import type {
  AnalysisApplicability,
  AutomationAuthorityLevel,
  DataQualityStatus,
  EquipmentApplicability,
  Industry,
} from "./enums.js";
import type {
  ApplicableStandardResult,
  AssetContext,
  ConservativeDueDateCandidate,
  ConservativeDueDateResult,
  CorrosionRateResult,
  DataCompletenessResult,
  RuleSet,
} from "./models.js";

const DAYS_PER_YEAR = 365.2425;

const AUTOMATIC_ALLOWED_OUTPUTS = new Set([
  "applicable_standards",
  "document_completeness",
  "corrosion_rate",
  "due_date",
  "preliminary_risk_ranking",
  "draft_inspection_plan",
  "draft_finding_recommendation",
  "data_insufficiency_warning",
  "evidence_pack_draft",
]);

const HUMAN_REVIEW_OUTPUTS = new Set([
  "safe",
  "fit_for_service",
  "fit_for_operation",
  "layak_operasi",
  "inspection_interval_extension",
  "final_FFS",
  "final_RLA",
  "final_PLO",
  "certificate_readiness",
  "risk_acceptance_change",
  "repair_approval",
  "alteration_approval",
  "rerating_approval",
  "critical_damage_mechanism_conclusion",
]);

export function isHumanApprovalRequired(outputType: AutomationAuthorityLevel | string): boolean {
  if (outputType === "automatic_allowed") return false;
  if (outputType === "draft_only" || outputType === "human_approval_required" || outputType === "prohibited") {
    return true;
  }

  const normalized = outputType.trim().replace(/[\s-]+/g, "_");

  if (AUTOMATIC_ALLOWED_OUTPUTS.has(normalized)) return false;
  if (HUMAN_REVIEW_OUTPUTS.has(normalized)) return true;

  const lower = normalized.toLowerCase();
  return (
    lower.includes("final") ||
    lower.includes("safe") ||
    lower.includes("fit_for") ||
    lower.includes("layak_operasi") ||
    lower.includes("certificate") ||
    lower.includes("approval")
  );
}

export function getConservativeDueDate(
  candidates: ConservativeDueDateCandidate[],
): ConservativeDueDateResult {
  const consideredCandidates: ConservativeDueDateCandidate[] = [];
  const rejectedCandidates: ConservativeDueDateResult["rejectedCandidates"] = [];

  for (const candidate of candidates) {
    const parsed = parseDate(candidate.date);

    if (!parsed) {
      rejectedCandidates.push({ ...candidate, reason: "Missing or invalid due date." });
      continue;
    }

    consideredCandidates.push({ ...candidate, date: toIsoDate(parsed) });
  }

  const selectedCandidate = consideredCandidates
    .map((candidate) => ({ candidate, parsed: parseDate(candidate.date) }))
    .filter((item): item is { candidate: ConservativeDueDateCandidate; parsed: Date } => Boolean(item.parsed))
    .sort((a, b) => a.parsed.getTime() - b.parsed.getTime())[0]?.candidate;

  const warnings: string[] = [];

  if (!selectedCandidate) {
    warnings.push("No valid due date candidate was available; engineer review is required.");
  }

  const hasLongerRbiCandidate = consideredCandidates.some((candidate) => {
    if (candidate.source !== "RBI" || !selectedCandidate?.date || !candidate.date) return false;
    return parseDate(candidate.date)!.getTime() > parseDate(selectedCandidate.date)!.getTime();
  });

  if (hasLongerRbiCandidate) {
    warnings.push("RBI interval was not allowed to extend beyond a more conservative statutory, regulator, owner, or recommendation date.");
  }

  return {
    selectedDate: selectedCandidate?.date ? toIsoDate(parseDate(selectedCandidate.date)!) : undefined,
    selectedCandidate,
    consideredCandidates,
    rejectedCandidates,
    warnings,
    limitationStatement:
      "Due date selection is a conservative decision-support result. Final interval extension or deferral requires authorized engineer or regulatory review.",
  };
}

export function resolveApplicableStandards(
  assetContext: AssetContext,
  approvedRules: RuleSet[],
): ApplicableStandardResult[] {
  const matched = new Map<string, ApplicableStandardResult>();

  for (const rule of approvedRules) {
    if (rule.status !== "active" && rule.status !== "approved") continue;
    if (!rule.conditions.some((condition) => matchesRuleCondition(assetContext, condition))) continue;

    const existing = matched.get(rule.standardVersionId);
    const matchBasis = buildMatchBasis(assetContext);

    if (existing) {
      existing.ruleIds.push(rule.id);
      existing.matchBasis = Array.from(new Set([...existing.matchBasis, ...matchBasis]));
      if (existing.authorityLevel === "automatic_allowed" && rule.authorityLevel !== "automatic_allowed") {
        existing.authorityLevel = rule.authorityLevel;
      }
      continue;
    }

    matched.set(rule.standardVersionId, {
      standardVersionId: rule.standardVersionId,
      standardCode: rule.standardCode,
      standardTitle: rule.standardTitle,
      publisher: rule.publisher,
      edition: rule.edition,
      ruleIds: [rule.id],
      authorityLevel: rule.authorityLevel,
      matchBasis,
    });
  }

  return [...matched.values()].sort((a, b) => a.standardCode.localeCompare(b.standardCode));
}

export function calculateSimpleCorrosionRate(
  previousThickness: number | null | undefined,
  currentThickness: number | null | undefined,
  previousDate: string | Date | null | undefined,
  currentDate: string | Date | null | undefined,
): CorrosionRateResult {
  const warnings: string[] = [];

  if (!isFinitePositive(previousThickness) || !isFinitePositive(currentThickness)) {
    return corrosionRateWarning("Thickness values must be positive numbers.");
  }

  const previous = parseDate(previousDate);
  const current = parseDate(currentDate);

  if (!previous || !current) {
    return corrosionRateWarning("Both previous and current measurement dates are required.");
  }

  if (current.getTime() <= previous.getTime()) {
    return corrosionRateWarning("Current measurement date must be after previous measurement date.");
  }

  const elapsedYears = (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24 * DAYS_PER_YEAR);
  const metalLoss = previousThickness - currentThickness;
  const rawRatePerYear = metalLoss / elapsedYears;
  const corrosionRatePerYear = Math.max(rawRatePerYear, 0);

  if (rawRatePerYear < 0) {
    warnings.push("Calculated loss is negative; corrosion rate is reported as zero and measurement basis should be reviewed.");
  }

  return {
    corrosionRatePerYear,
    rawRatePerYear,
    elapsedYears,
    metalLoss,
    status: warnings.length > 0 ? "requires_engineer_review" : "preliminary",
    warnings,
    limitationStatement:
      "Simple corrosion rate is deterministic support only and does not establish final fitness-for-service or remaining-life conclusion.",
  };
}

export function classifyDataCompleteness(
  requiredFields: string[],
  availableFields: string[] | Record<string, unknown>,
): DataCompletenessResult {
  const available = Array.isArray(availableFields)
    ? availableFields.filter(Boolean)
    : Object.entries(availableFields)
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .map(([key]) => key);

  const availableSet = new Set(available.map((field) => field.trim()));
  const required = requiredFields.map((field) => field.trim()).filter(Boolean);
  const missingFields = required.filter((field) => !availableSet.has(field));
  const coveragePercent = required.length === 0 ? 100 : Math.round(((required.length - missingFields.length) / required.length) * 100);
  const status: DataQualityStatus =
    missingFields.length === 0 ? "verified" : coveragePercent > 0 ? "partially_verified" : "missing";

  return {
    status,
    requiredFields: required,
    availableFields: available,
    missingFields,
    coveragePercent,
    warnings:
      missingFields.length > 0
        ? [`Missing required evidence/data fields: ${missingFields.join(", ")}.`]
        : [],
  };
}

export function normalizeStandardCode(code: string): string {
  return code
    .trim()
    .toUpperCase()
    .replace(/[_-]+/g, " ")
    .replace(/[^A-Z0-9/.: ]+/g, "")
    .replace(/\s+/g, " ");
}

function matchesRuleCondition(
  assetContext: AssetContext,
  condition: {
    industries?: Industry[];
    equipmentApplicability?: EquipmentApplicability[];
    analysisApplicability?: AnalysisApplicability[];
    serviceKeywords?: string[];
    jurisdiction?: string[];
  },
) {
  return (
    matchesOne(assetContext.industry, condition.industries) &&
    matchesOne(assetContext.equipmentClass ?? assetContext.assetType, condition.equipmentApplicability) &&
    matchesOne(assetContext.analysisType, condition.analysisApplicability) &&
    matchesService(assetContext.service, condition.serviceKeywords) &&
    matchesOne(assetContext.jurisdiction, condition.jurisdiction)
  );
}

function buildMatchBasis(assetContext: AssetContext): string[] {
  return [
    assetContext.industry ? `industry:${assetContext.industry}` : undefined,
    assetContext.equipmentClass ? `equipment:${assetContext.equipmentClass}` : undefined,
    assetContext.assetType && assetContext.assetType !== assetContext.equipmentClass ? `asset:${assetContext.assetType}` : undefined,
    assetContext.analysisType ? `analysis:${assetContext.analysisType}` : undefined,
    assetContext.service ? `service:${assetContext.service}` : undefined,
  ].filter((item): item is string => Boolean(item));
}

function matchesOne(value: string | undefined, allowed?: readonly string[]) {
  if (!allowed || allowed.length === 0) return true;
  if (!value) return false;
  return allowed.includes(value);
}

function matchesService(service: string | undefined, keywords?: string[]) {
  if (!keywords || keywords.length === 0) return true;
  if (!service) return false;

  const normalizedService = service.toLowerCase();
  return keywords.some((keyword) => normalizedService.includes(keyword.toLowerCase()));
}

function corrosionRateWarning(message: string): CorrosionRateResult {
  return {
    status: "requires_engineer_review",
    warnings: [message],
    limitationStatement:
      "Calculation could not be completed from verified input data. Engineer review is required before any inspection or FFS decision.",
  };
}

function isFinitePositive(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function parseDate(value: string | Date | null | undefined): Date | undefined {
  if (!value) return undefined;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
