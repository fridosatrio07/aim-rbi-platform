export type StandardStatus =
  | "uploaded"
  | "parsing"
  | "parsed"
  | "extraction_pending"
  | "extracted"
  | "review_pending"
  | "approved"
  | "active"
  | "superseded"
  | "rejected"
  | "archived";

export type RequirementStatus =
  | "draft"
  | "SME_review_pending"
  | "legal_review_pending"
  | "approved"
  | "active"
  | "rejected"
  | "superseded";

export type RuleStatus = "draft" | "validation_pending" | "approved" | "active" | "retired";
export type DataQualityStatus = "verified" | "partially_verified" | "assumed" | "missing" | "rejected";
export type AutomationAuthorityLevel = "automatic_allowed" | "draft_only" | "human_approval_required" | "prohibited";

export interface StandardLibraryItem {
  id: string;
  code: string;
  title: string;
  publisher: string;
  edition: string;
  year: number;
  status: StandardStatus;
  industries: string[];
  equipmentApplicability: string[];
  analysisApplicability: string[];
  active: boolean;
  reviewState: string;
  storageMode: "metadata_only" | "private_document";
  licenseNote: string;
}

export interface ParsingStep {
  id: string;
  label: string;
  status: "completed" | "running" | "queued" | "warning";
  detail: string;
}

export interface ParsedChunkView {
  id: string;
  section: string;
  page: string;
  tokenEstimate: number;
  previewAllowed: boolean;
  preview: string;
  warning?: string;
}

export interface RequirementView {
  id: string;
  standardId: string;
  summary: string;
  type: string;
  sectionReference: string;
  pageReference: string;
  confidence: number;
  extractionMethod: "deterministic" | "LLM" | "hybrid" | "manual";
  status: RequirementStatus;
  reviewer?: string;
  comment?: string;
}

export interface RuleView {
  id: string;
  requirementId: string;
  standardCode: string;
  name: string;
  status: RuleStatus;
  authorityLevel: AutomationAuthorityLevel;
  conflictPolicy: string;
  conditions: string[];
  outputGuard: string;
}

export interface EvidenceRequirementView {
  id: string;
  equipmentClass: string;
  analysisType: string;
  evidenceType: string;
  mandatory: boolean;
  authorityLevel: AutomationAuthorityLevel;
  acceptedFormats: string[];
}

export interface AuditEventView {
  id: string;
  actor: string;
  action: string;
  entity: string;
  timestamp: string;
  summary: string;
}

export interface SandboxOutput {
  id: string;
  title: string;
  status: "draft" | "preliminary" | "requires_engineer_review";
  inputBasis: string[];
  warnings: string[];
  requiredReviewRole: string;
  limitationStatement: string;
  citations: Array<{ label: string; detail: string }>;
}
