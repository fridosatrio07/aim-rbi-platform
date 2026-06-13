import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";

import {
  STANDARD_METADATA_PLACEHOLDERS,
  calculateSimpleCorrosionRate,
  classifyDataCompleteness,
  getConservativeDueDate,
  normalizeStandardCode,
  resolveApplicableStandards,
  type AnalysisRun,
  type AssetContext,
  type AuditEvent,
  type ConservativeDueDateCandidate,
  type DataQualityStatus,
  type DocumentChunkMetadata,
  type DocumentStatus,
  type EvidenceItem,
  type EvidencePack,
  type EvidenceRequirement,
  type ExtractedRequirement,
  type RequirementStatus,
  type RuleSet,
  type StandardDocument,
  type StandardVersion,
} from "@aim-rbi/domain";

import type {
  ActivateRuleRequest,
  CreateStandardDocumentRequest,
  PreliminaryRiskRankingRequest,
  StartParsingJobRequest,
  UploadStandardDocumentMetadataRequest,
} from "@aim-rbi/contracts";

type JobRecord = {
  id: string;
  type: "parse" | "extract";
  status: "queued" | "running" | "completed" | "failed";
  standardVersionId: string;
  chunks?: DocumentChunkMetadata[];
  requirements?: ExtractedRequirement[];
  warnings: string[];
  limitationStatement: string;
};

@Injectable()
export class StandardsKnowledgeRepository {
  private readonly standards = new Map<string, StandardDocument>();
  private readonly versions = new Map<string, StandardVersion>();
  private readonly chunks = new Map<string, DocumentChunkMetadata>();
  private readonly extractedRequirements = new Map<string, ExtractedRequirement>();
  private readonly rules = new Map<string, RuleSet>();
  private readonly evidenceRequirements = new Map<string, EvidenceRequirement>();
  private readonly analysisRuns = new Map<string, AnalysisRun>();
  private readonly evidencePacks = new Map<string, EvidencePack>();
  private readonly auditEvents: AuditEvent[] = [];
  private readonly jobs = new Map<string, JobRecord>();

  constructor() {
    this.seedPlaceholders();
  }

  listStandards(query?: {
    search?: string;
    publisher?: string;
    status?: string;
    industry?: string;
    equipmentApplicability?: string;
    analysisApplicability?: string;
  }) {
    const search = query?.search?.toLowerCase();

    return [...this.standards.values()].filter((standard) => {
      if (search && !`${standard.code} ${standard.title}`.toLowerCase().includes(search)) return false;
      if (query?.publisher && standard.publisher !== query.publisher) return false;
      if (query?.status && standard.status !== query.status) return false;
      if (query?.industry && !standard.industries.includes(query.industry as never)) return false;
      if (
        query?.equipmentApplicability &&
        !standard.equipmentApplicability.includes(query.equipmentApplicability as never)
      ) {
        return false;
      }
      if (
        query?.analysisApplicability &&
        !standard.analysisApplicability.includes(query.analysisApplicability as never)
      ) {
        return false;
      }
      return true;
    });
  }

  getStandard(id: string) {
    return this.standards.get(id);
  }

  getVersion(id: string) {
    return this.versions.get(id);
  }

  createStandard(request: CreateStandardDocumentRequest, actorId = "system") {
    const timestamp = now();
    const standardId = randomUUID();
    const versionId = randomUUID();
    const standard: StandardDocument = {
      id: standardId,
      code: request.code,
      normalizedCode: normalizeStandardCode(request.code),
      title: request.title,
      publisher: request.publisher,
      status: "uploaded",
      currentVersionId: versionId,
      industries: request.industries,
      equipmentApplicability: request.equipmentApplicability,
      analysisApplicability: request.analysisApplicability,
      confidentiality: request.confidentiality,
      licenseNote: request.licenseNote,
      ownerOrganization: request.ownerOrganization,
      metadataOnly: true,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: actorId,
      updatedBy: actorId,
    };
    const version: StandardVersion = {
      id: versionId,
      standardDocumentId: standardId,
      code: request.code,
      title: request.title,
      edition: request.edition,
      publicationYear: request.publicationYear,
      effectiveDate: request.effectiveDate,
      isSuperseded: false,
      status: "uploaded",
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: actorId,
      updatedBy: actorId,
    };

    this.standards.set(standard.id, standard);
    this.versions.set(version.id, version);
    const auditEventId = this.recordAudit(actorId, "upload", "standard_document", standard.id, undefined, standard);
    return { standard, version, auditEventId };
  }

  updateStandardStatus(id: string, status: DocumentStatus, actorId = "system") {
    const standard = this.requireStandard(id);
    const before = { ...standard };
    const updated = { ...standard, status, updatedAt: now(), updatedBy: actorId };
    this.standards.set(id, updated);
    this.recordAudit(actorId, status === "rejected" ? "reject" : "review", "standard_document", id, before, updated);
    return updated;
  }

  registerUploadMetadata(request: UploadStandardDocumentMetadataRequest, actorId = "system") {
    const created = this.createStandard(request, actorId);
    const privateStorageUri =
      request.storageUri ?? `storage/local-dev/standards/uploads/${created.version.id}/${request.fileName ?? "document.bin"}`;
    const standard = { ...created.standard, documentStorageUri: privateStorageUri, metadataOnly: false };
    const version = {
      ...created.version,
      documentStorageUri: privateStorageUri,
      checksumSha256: request.checksumSha256,
    };

    this.standards.set(standard.id, standard);
    this.versions.set(version.id, version);

    return {
      standardDocumentId: standard.id,
      standardVersionId: version.id,
      privateStorageUri,
      status: standard.status,
      warnings: [
        "Only private storage metadata was registered. Raw standard files must remain outside public Git history.",
      ],
    };
  }

  createParsingJob(request: StartParsingJobRequest) {
    const version = this.requireVersion(request.standardVersionId);
    const timestamp = now();
    const chunk: DocumentChunkMetadata = {
      id: randomUUID(),
      standardVersionId: version.id,
      chunkId: `${version.code.replace(/\s+/g, "-").toLowerCase()}-metadata-chunk-001`,
      pageStart: 1,
      pageEnd: 1,
      sectionHeading: "Metadata placeholder",
      tokenEstimate: 0,
      contentSha256: "metadata-only",
      storageUri: `storage/local-dev/standards/chunks/${version.id}/metadata.json`,
      shortPreview: "Metadata-only placeholder; licensed source text is not exposed.",
      containsTable: false,
      containsFormula: false,
      copyrightSafeForPreview: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.chunks.set(chunk.id, chunk);
    const job: JobRecord = {
      id: randomUUID(),
      type: "parse",
      status: "completed",
      standardVersionId: version.id,
      chunks: [chunk],
      warnings: [
        "Parser scaffold completed using metadata-only fallback. Configure FastAPI parsing workers for real document extraction.",
      ],
      limitationStatement:
        "Parsed output contains citation metadata only in this scaffold and must not be treated as licensed standard text.",
    };
    this.jobs.set(job.id, job);
    this.recordAudit(request.requestedBy, "parse", "standard_version", version.id, undefined, job);
    return job;
  }

  createExtractionJob(standardVersionId: string, requestedBy: string) {
    const version = this.requireVersion(standardVersionId);
    const timestamp = now();
    const requirement: ExtractedRequirement = {
      id: randomUUID(),
      standardVersionId: version.id,
      sourceChunkId: "metadata-only",
      requirementSummary:
        "Draft placeholder requirement: verify applicability, evidence basis, and review authority before converting to a rule.",
      requirementType: "governance_placeholder",
      sourceSectionReference: "metadata",
      sourcePageReference: "metadata",
      confidenceScore: 0.2,
      extractionMethod: "deterministic",
      status: "SME_review_pending",
      limitationStatement:
        "Deterministic fallback extraction produced a low-confidence draft that requires SME review before activation.",
      warnings: ["No external LLM or full-text parser was used."],
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: requestedBy,
      updatedBy: requestedBy,
    };
    this.extractedRequirements.set(requirement.id, requirement);
    const job: JobRecord = {
      id: randomUUID(),
      type: "extract",
      status: "completed",
      standardVersionId: version.id,
      requirements: [requirement],
      warnings: requirement.warnings,
      limitationStatement: requirement.limitationStatement,
    };
    this.jobs.set(job.id, job);
    this.recordAudit(requestedBy, "extract", "standard_version", version.id, undefined, job);
    return job;
  }

  getJob(id: string) {
    return this.jobs.get(id);
  }

  listRequirements(standardVersionId?: string) {
    const items = [...this.extractedRequirements.values()];
    return standardVersionId ? items.filter((item) => item.standardVersionId === standardVersionId) : items;
  }

  reviewRequirement(
    requirementId: string,
    decision: "approve" | "reject" | "request_changes",
    reviewerId: string,
    reviewComment?: string,
    editedSummary?: string,
  ) {
    const requirement = this.requireRequirement(requirementId);
    const before = { ...requirement };
    const status: RequirementStatus =
      decision === "approve" ? "approved" : decision === "reject" ? "rejected" : "SME_review_pending";
    const updated: ExtractedRequirement = {
      ...requirement,
      requirementSummary: editedSummary ?? requirement.requirementSummary,
      status,
      updatedAt: now(),
      updatedBy: reviewerId,
      warnings:
        decision === "request_changes"
          ? [...requirement.warnings, reviewComment ?? "Reviewer requested changes."]
          : requirement.warnings,
    };
    this.extractedRequirements.set(requirementId, updated);
    const auditEventId = this.recordAudit(reviewerId, decision === "reject" ? "reject" : "review", "extracted_requirement", requirementId, before, updated);
    return { requirementId, status, auditEventId };
  }

  createRule(request: ActivateRuleRequest) {
    const requirement = this.requireRequirement(request.approvedRequirementId);
    const version = this.requireVersion(requirement.standardVersionId);
    const timestamp = now();
    const ruleSet: RuleSet = {
      id: randomUUID(),
      approvedRequirementId: requirement.id,
      standardVersionId: version.id,
      standardCode: version.code,
      standardTitle: version.title,
      publisher: this.getStandard(version.standardDocumentId)?.publisher ?? "other",
      edition: version.edition,
      name: request.name,
      description: request.description,
      status: request.status ?? "active",
      authorityLevel: request.authorityLevel,
      conditions: request.conditions.map((condition) => ({
        ...condition,
        id: condition.id ?? randomUUID(),
        ruleSetId: condition.ruleSetId ?? "pending",
      })),
      priority: request.priority ?? 100,
      conflictPolicy: request.conflictPolicy,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: request.activatedBy,
      updatedBy: request.activatedBy,
    };
    ruleSet.conditions = ruleSet.conditions.map((condition) => ({ ...condition, ruleSetId: ruleSet.id }));
    this.rules.set(ruleSet.id, ruleSet);
    const auditEventId = this.recordAudit(request.activatedBy, "activate_rule", "rule_set", ruleSet.id, undefined, ruleSet);
    return { ruleSet, auditEventId };
  }

  listRules(status?: string) {
    const rules = [...this.rules.values()];
    return status ? rules.filter((rule) => rule.status === status) : rules;
  }

  resolveApplicability(assetContext: AssetContext) {
    return resolveApplicableStandards(assetContext, this.listRules());
  }

  calculateCorrosionRate(input: {
    previousThickness?: number;
    currentThickness?: number;
    previousDate?: string;
    currentDate?: string;
    minimumRequiredThickness?: number;
  }) {
    const result = calculateSimpleCorrosionRate(
      input.previousThickness,
      input.currentThickness,
      input.previousDate,
      input.currentDate,
    );

    const remainingLifeYears =
      result.corrosionRatePerYear && result.corrosionRatePerYear > 0 && input.minimumRequiredThickness !== undefined && input.currentThickness !== undefined
        ? (input.currentThickness - input.minimumRequiredThickness) / result.corrosionRatePerYear
        : undefined;

    return {
      ...result,
      remainingLifeYears,
      dataQualityStatus: result.warnings.length > 0 ? "partially_verified" : "verified" as DataQualityStatus,
      requiredReviewRole: result.status === "requires_engineer_review" ? "engineer" : undefined,
    };
  }

  calculateDueDate(candidates: ConservativeDueDateCandidate[]) {
    return {
      ...getConservativeDueDate(candidates),
      outputStatus: "preliminary" as const,
      requiredReviewRole: "engineer",
    };
  }

  checkCompleteness(requiredFields: string[], availableFields: string[] | Record<string, unknown>) {
    const completeness = classifyDataCompleteness(requiredFields, availableFields);
    return {
      ...completeness,
      outputStatus: completeness.status === "verified" ? "preliminary" as const : "requires_engineer_review" as const,
      requiredReviewRole: completeness.status === "verified" ? undefined : "engineer",
      limitationStatement:
        "Completeness check verifies evidence presence only and does not establish final PLO, certificate, FFS, or RLA readiness.",
    };
  }

  rankRisk(request: PreliminaryRiskRankingRequest) {
    const riskScore = request.probabilityCategory * request.consequenceCategory;
    const riskRank = riskScore >= 16 ? "high" : riskScore >= 10 ? "medium_high" : riskScore >= 5 ? "medium" : "low";
    return {
      riskScore,
      riskRank,
      outputStatus: "preliminary" as const,
      warnings: ["Qualitative risk ranking is preliminary and requires engineer review before acceptance."],
      requiredReviewRole: "engineer" as const,
      limitationStatement:
        "Preliminary PoF x CoF ranking is decision support only and cannot change risk acceptance criteria automatically.",
    };
  }

  listEvidenceRequirements() {
    return [...this.evidenceRequirements.values()];
  }

  upsertEvidenceRequirement(input: Omit<EvidenceRequirement, "id" | "createdAt" | "updatedAt">) {
    const timestamp = now();
    const requirement: EvidenceRequirement = {
      ...input,
      id: randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.evidenceRequirements.set(requirement.id, requirement);
    return requirement;
  }

  createEvidencePack(input: {
    assetContext: AssetContext;
    applicableStandardVersionIds: string[];
    evidenceRequirements: EvidenceRequirement[];
    availableEvidence: EvidenceItem[];
    analysisRunIds?: string[];
    generatedBy: string;
  }) {
    const completeness = classifyDataCompleteness(
      input.evidenceRequirements.map((requirement) => requirement.evidenceType),
      input.availableEvidence.map((item) => item.evidenceType),
    );
    const missingEvidence = input.evidenceRequirements.filter((requirement) =>
      completeness.missingFields.includes(requirement.evidenceType),
    );
    const timestamp = now();
    const pack: EvidencePack = {
      id: randomUUID(),
      assetContext: input.assetContext,
      applicableStandardVersionIds: input.applicableStandardVersionIds,
      requiredEvidence: input.evidenceRequirements,
      availableEvidence: input.availableEvidence,
      missingEvidence,
      dataQualityStatus: completeness.status,
      analysisRunIds: input.analysisRunIds ?? [],
      findings: [],
      citationReferences: [],
      limitationStatement:
        "Draft evidence pack only. It does not issue final PLO, certification, FFS, RLA, or safe-operation conclusions.",
      outputStatus: "draft",
      humanReviewSection: "Engineer and regulatory reviewer approval required before external submission.",
      generatedAt: timestamp,
      generatedBy: input.generatedBy,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: input.generatedBy,
      updatedBy: input.generatedBy,
    };
    this.evidencePacks.set(pack.id, pack);
    this.recordAudit(input.generatedBy, "run_analysis", "evidence_pack", pack.id, undefined, pack);
    return pack;
  }

  listAuditEvents() {
    return this.auditEvents;
  }

  private seedPlaceholders() {
    if (this.standards.size > 0) return;

    for (const placeholder of STANDARD_METADATA_PLACEHOLDERS) {
      const version: StandardVersion = {
        id: `${placeholder.id}-version-001`,
        standardDocumentId: placeholder.id,
        code: placeholder.code,
        title: placeholder.title,
        edition: "metadata placeholder",
        isSuperseded: false,
        status: placeholder.status,
        createdAt: placeholder.createdAt,
        updatedAt: placeholder.updatedAt,
      };
      this.versions.set(version.id, version);
      this.standards.set(placeholder.id, { ...placeholder, currentVersionId: version.id });
    }

    this.seedEvidenceRequirements();
  }

  private seedEvidenceRequirements() {
    const defaults: Array<Omit<EvidenceRequirement, "id" | "createdAt" | "updatedAt">> = [
      {
        equipmentClass: "pressure_vessel",
        analysisType: "RBI",
        evidenceType: "datasheet",
        description: "Asset datasheet and design basis metadata.",
        mandatory: true,
        authorityLevel: "draft_only",
        acceptedFormats: ["pdf", "xlsx", "docx"],
      },
      {
        equipmentClass: "pressure_vessel",
        analysisType: "RBI",
        evidenceType: "thickness_history",
        description: "Verified thickness/CML history for corrosion assessment.",
        mandatory: true,
        authorityLevel: "human_approval_required",
        acceptedFormats: ["xlsx", "csv", "pdf"],
      },
      {
        equipmentClass: "pipeline",
        analysisType: "PLO_readiness",
        evidenceType: "statutory_certificate",
        description: "Current or prior statutory certificate evidence where applicable.",
        mandatory: true,
        authorityLevel: "human_approval_required",
        acceptedFormats: ["pdf"],
      },
    ];

    for (const item of defaults) {
      const requirement = {
        ...item,
        id: randomUUID(),
        createdAt: now(),
        updatedAt: now(),
      };
      this.evidenceRequirements.set(requirement.id, requirement);
    }
  }

  private requireStandard(id: string) {
    const standard = this.standards.get(id);
    if (!standard) throw new Error(`Standard not found: ${id}`);
    return standard;
  }

  private requireVersion(id: string) {
    const version = this.versions.get(id);
    if (!version) throw new Error(`Standard version not found: ${id}`);
    return version;
  }

  private requireRequirement(id: string) {
    const requirement = this.extractedRequirements.get(id);
    if (!requirement) throw new Error(`Requirement not found: ${id}`);
    return requirement;
  }

  private recordAudit(
    actorId: string,
    action: AuditEvent["action"],
    entityType: string,
    entityId: string,
    before?: unknown,
    after?: unknown,
  ) {
    const auditEvent: AuditEvent = {
      id: randomUUID(),
      actorId,
      actorRole: "system_or_placeholder_role",
      action,
      entityType,
      entityId,
      before: toJsonSnapshot(before),
      after: toJsonSnapshot(after),
      createdAt: now(),
      updatedAt: now(),
    };
    this.auditEvents.push(auditEvent);
    return auditEvent.id;
  }
}

function now() {
  return new Date().toISOString();
}

function toJsonSnapshot(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object") return undefined;
  return value as Record<string, unknown>;
}
