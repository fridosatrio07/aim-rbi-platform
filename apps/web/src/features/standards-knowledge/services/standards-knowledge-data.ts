import type {
  AuditEventView,
  EvidenceRequirementView,
  ParsedChunkView,
  ParsingStep,
  RequirementView,
  RuleView,
  SandboxOutput,
  StandardLibraryItem,
} from "../types/standards-knowledge.types";

export const STANDARDS_LIBRARY: StandardLibraryItem[] = [
  {
    id: "api-580",
    code: "API 580",
    title: "Risk-Based Inspection methodology metadata placeholder",
    publisher: "API",
    edition: "Metadata placeholder",
    year: 2026,
    status: "active",
    industries: ["oil_gas", "petrochemical", "geothermal"],
    equipmentApplicability: ["pressure_vessel", "piping", "storage_tank"],
    analysisApplicability: ["RBI", "inspection_planning"],
    active: true,
    reviewState: "SME approved metadata",
    storageMode: "metadata_only",
    licenseNote: "Metadata only. Licensed text/chunks/embeddings are not committed.",
  },
  {
    id: "api-581",
    code: "API 581",
    title: "RBI quantitative methods metadata placeholder",
    publisher: "API",
    edition: "Metadata placeholder",
    year: 2026,
    status: "review_pending",
    industries: ["oil_gas", "petrochemical"],
    equipmentApplicability: ["pressure_vessel", "piping", "heat_exchanger"],
    analysisApplicability: ["RBI", "corrosion_assessment"],
    active: false,
    reviewState: "SME review pending",
    storageMode: "metadata_only",
    licenseNote: "Metadata only. Upload requires organization license.",
  },
  {
    id: "iso-14224",
    code: "ISO 14224",
    title: "Reliability and maintenance data taxonomy metadata placeholder",
    publisher: "ISO",
    edition: "Metadata placeholder",
    year: 2026,
    status: "approved",
    industries: ["oil_gas", "power", "general_industry"],
    equipmentApplicability: ["rotating_equipment", "safety_system", "instrumentation"],
    analysisApplicability: ["reliability_assessment", "document_completeness"],
    active: false,
    reviewState: "Approved, rule validation pending",
    storageMode: "metadata_only",
    licenseNote: "Metadata only. No ISO text stored in Git.",
  },
  {
    id: "permen-esdm-32-2021",
    code: "Permen ESDM 32/2021",
    title: "Indonesian energy-sector technical regulation metadata placeholder",
    publisher: "ESDM",
    edition: "2021",
    year: 2021,
    status: "extracted",
    industries: ["oil_gas", "geothermal"],
    equipmentApplicability: ["pipeline", "piping", "pressure_vessel", "geothermal_steamfield"],
    analysisApplicability: ["certification", "PLO_readiness", "evidence_pack"],
    active: false,
    reviewState: "Draft requirements extracted",
    storageMode: "metadata_only",
    licenseNote: "Metadata placeholder only; verify official regulatory source.",
  },
  {
    id: "permen-esdm-33-2021",
    code: "Permen ESDM 33/2021",
    title: "Indonesian energy-sector compliance regulation metadata placeholder",
    publisher: "ESDM",
    edition: "2021",
    year: 2021,
    status: "uploaded",
    industries: ["oil_gas", "geothermal"],
    equipmentApplicability: ["wellhead", "pipeline", "safety_system"],
    analysisApplicability: ["certification", "PLO_readiness", "document_completeness"],
    active: false,
    reviewState: "Metadata registered",
    storageMode: "metadata_only",
    licenseNote: "Metadata placeholder only; upload private evidence with proper access rights.",
  },
];

export const PARSING_TIMELINE: ParsingStep[] = [
  {
    id: "registered",
    label: "Metadata registered",
    status: "completed",
    detail: "Standard code, publisher, edition, applicability, and license note captured.",
  },
  {
    id: "private-storage",
    label: "Private storage URI assigned",
    status: "completed",
    detail: "Raw documents stay under storage/local-dev/standards/uploads or object storage.",
  },
  {
    id: "parse",
    label: "Parsing job",
    status: "warning",
    detail: "Metadata-only fallback active until parser libraries/private worker are configured.",
  },
  {
    id: "extract",
    label: "Draft extraction",
    status: "queued",
    detail: "Draft requirements require SME/legal review before activation.",
  },
];

export const PARSED_CHUNKS: ParsedChunkView[] = [
  {
    id: "api-580-metadata-001",
    section: "Metadata placeholder",
    page: "metadata",
    tokenEstimate: 0,
    previewAllowed: true,
    preview: "Metadata-only placeholder; licensed source text is not exposed.",
  },
  {
    id: "api-581-private-001",
    section: "Private parsed section",
    page: "private",
    tokenEstimate: 820,
    previewAllowed: false,
    preview: "Preview hidden",
    warning: "Licensed source chunk stored in private runtime storage only.",
  },
];

export const REQUIREMENTS: RequirementView[] = [
  {
    id: "req-rbi-applicability",
    standardId: "api-580",
    summary: "Use RBI methodology as draft guidance for pressure equipment screening when applicability is verified.",
    type: "applicability",
    sectionReference: "metadata",
    pageReference: "metadata",
    confidence: 0.82,
    extractionMethod: "manual",
    status: "approved",
    reviewer: "SME reviewer",
    comment: "Approved as metadata-level applicability rule; not a final technical conclusion.",
  },
  {
    id: "req-esdm-evidence",
    standardId: "permen-esdm-32-2021",
    summary: "Collect identity, design, inspection, and prior certification evidence before PLO readiness review.",
    type: "evidence",
    sectionReference: "metadata",
    pageReference: "metadata",
    confidence: 0.42,
    extractionMethod: "deterministic",
    status: "SME_review_pending",
    comment: "Needs regulatory reviewer confirmation.",
  },
  {
    id: "req-corrosion-data",
    standardId: "api-581",
    summary: "Corrosion calculations require verified prior/current thickness values and measurement dates.",
    type: "calculation_input",
    sectionReference: "metadata",
    pageReference: "metadata",
    confidence: 0.67,
    extractionMethod: "hybrid",
    status: "legal_review_pending",
    comment: "Legal review required before licensed source citation is exposed.",
  },
];

export const RULES: RuleView[] = [
  {
    id: "rule-api580-rbi-pressure-vessel",
    requirementId: "req-rbi-applicability",
    standardCode: "API 580",
    name: "Pressure vessel RBI applicability",
    status: "active",
    authorityLevel: "draft_only",
    conflictPolicy: "most_conservative",
    conditions: ["industry: oil_gas/geothermal", "equipment: pressure_vessel", "analysis: RBI"],
    outputGuard: "Preliminary/draft outputs only; engineer review required for acceptance.",
  },
  {
    id: "rule-esdm-plo-evidence",
    requirementId: "req-esdm-evidence",
    standardCode: "Permen ESDM 32/2021",
    name: "PLO evidence matrix guidance",
    status: "validation_pending",
    authorityLevel: "human_approval_required",
    conflictPolicy: "manual_review",
    conditions: ["industry: geothermal/oil_gas", "analysis: PLO_readiness", "equipment: pipeline/wellhead"],
    outputGuard: "Cannot issue final PLO readiness automatically.",
  },
  {
    id: "rule-corrosion-simple-rate",
    requirementId: "req-corrosion-data",
    standardCode: "API 581",
    name: "Simple corrosion rate input gate",
    status: "draft",
    authorityLevel: "automatic_allowed",
    conflictPolicy: "earliest_due_date",
    conditions: ["analysis: corrosion_assessment", "requires: prior/current thickness dates"],
    outputGuard: "Calculation allowed, but FFS/RLA conclusion blocked without engineer review.",
  },
];

export const EVIDENCE_REQUIREMENTS: EvidenceRequirementView[] = [
  {
    id: "ev-datasheet",
    equipmentClass: "pressure_vessel",
    analysisType: "RBI",
    evidenceType: "datasheet",
    mandatory: true,
    authorityLevel: "draft_only",
    acceptedFormats: ["pdf", "xlsx", "docx"],
  },
  {
    id: "ev-thickness",
    equipmentClass: "pressure_vessel",
    analysisType: "RBI",
    evidenceType: "thickness_history",
    mandatory: true,
    authorityLevel: "human_approval_required",
    acceptedFormats: ["xlsx", "csv", "pdf"],
  },
  {
    id: "ev-certificate",
    equipmentClass: "pipeline",
    analysisType: "PLO_readiness",
    evidenceType: "statutory_certificate",
    mandatory: true,
    authorityLevel: "human_approval_required",
    acceptedFormats: ["pdf"],
  },
  {
    id: "ev-pid",
    equipmentClass: "piping",
    analysisType: "inspection_planning",
    evidenceType: "P&ID / line list",
    mandatory: true,
    authorityLevel: "draft_only",
    acceptedFormats: ["pdf", "dwg", "xlsx"],
  },
];

export const SANDBOX_OUTPUTS: SandboxOutput[] = [
  {
    id: "applicable-standards",
    title: "Applicable Standards",
    status: "preliminary",
    inputBasis: ["oil_gas", "pressure_vessel", "RBI"],
    warnings: [],
    requiredReviewRole: "SME",
    limitationStatement: "Applicability guidance is preliminary and must be confirmed for project scope.",
    citations: [{ label: "API 580", detail: "rule-api580-rbi-pressure-vessel" }],
  },
  {
    id: "document-completeness",
    title: "Document Completeness",
    status: "requires_engineer_review",
    inputBasis: ["datasheet available", "thickness_history missing"],
    warnings: ["Missing required evidence: thickness_history."],
    requiredReviewRole: "engineer",
    limitationStatement: "Completeness check does not declare PLO/certificate readiness.",
    citations: [{ label: "Evidence Matrix", detail: "ev-thickness" }],
  },
  {
    id: "corrosion-rate",
    title: "Simple Corrosion Rate",
    status: "preliminary",
    inputBasis: ["previous 12.4 mm on 2022-01-01", "current 11.8 mm on 2026-01-01"],
    warnings: ["Remaining life requires t_min and engineer review."],
    requiredReviewRole: "corrosion engineer",
    limitationStatement: "Calculation support only; no FFS/RLA conclusion is issued.",
    citations: [{ label: "Calculation method", detail: "simple_corrosion_rate:v1" }],
  },
];

export const AUDIT_EVENTS: AuditEventView[] = [
  {
    id: "audit-upload",
    actor: "superadmin",
    action: "upload_metadata",
    entity: "API 580",
    timestamp: "2026-06-13 09:15 WIB",
    summary: "Registered metadata-only standard placeholder.",
  },
  {
    id: "audit-extract",
    actor: "ai-orchestration",
    action: "extract_draft",
    entity: "Permen ESDM 32/2021",
    timestamp: "2026-06-13 09:42 WIB",
    summary: "Created low-confidence draft requirements for SME review.",
  },
  {
    id: "audit-rule",
    actor: "SME reviewer",
    action: "activate_rule",
    entity: "rule-api580-rbi-pressure-vessel",
    timestamp: "2026-06-13 10:05 WIB",
    summary: "Activated draft-only RBI applicability rule.",
  },
];

export function getStandardById(standardId: string) {
  return STANDARDS_LIBRARY.find((standard) => standard.id === standardId) ?? STANDARDS_LIBRARY[0];
}

export function getRuleById(ruleId: string) {
  return RULES.find((rule) => rule.id === ruleId) ?? RULES[0];
}

export function getRequirementsByStandard(standardId: string) {
  return REQUIREMENTS.filter((requirement) => requirement.standardId === standardId);
}
