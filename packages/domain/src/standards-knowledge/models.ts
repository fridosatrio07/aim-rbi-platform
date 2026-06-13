import type {
  AnalysisApplicability,
  AnalysisOutputStatus,
  AutomationAuthorityLevel,
  DataQualityStatus,
  DocumentStatus,
  EquipmentApplicability,
  Industry,
  RequirementStatus,
  RuleStatus,
  StandardPublisher,
} from "./enums.js";

export type UUID = string;
export type ISODateString = string;
export type ISODateTimeString = string;
export type JsonObject = Record<string, unknown>;

export interface AuditedEntity {
  id: UUID;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
  createdBy?: UUID;
  updatedBy?: UUID;
}

export interface AssetContext {
  assetId?: UUID;
  assetTag?: string;
  assetType?: EquipmentApplicability;
  equipmentClass?: EquipmentApplicability;
  service?: string;
  industry?: Industry;
  analysisType?: AnalysisApplicability;
  designCode?: string;
  jurisdiction?: string;
  ownerRequirementSetId?: UUID;
  dataQualityStatus?: DataQualityStatus;
}

export interface StandardDocument extends AuditedEntity {
  code: string;
  normalizedCode: string;
  title: string;
  publisher: StandardPublisher;
  status: DocumentStatus;
  currentVersionId?: UUID;
  industries: Industry[];
  equipmentApplicability: EquipmentApplicability[];
  analysisApplicability: AnalysisApplicability[];
  confidentiality: "public" | "internal" | "licensed" | "client_confidential";
  licenseNote: string;
  ownerOrganization?: string;
  documentStorageUri?: string;
  metadataOnly: boolean;
}

export interface StandardVersion extends AuditedEntity {
  standardDocumentId: UUID;
  code: string;
  title: string;
  edition?: string;
  publicationYear?: number;
  effectiveDate?: ISODateString;
  supersededByVersionId?: UUID;
  isSuperseded: boolean;
  status: DocumentStatus;
  documentStorageUri?: string;
  checksumSha256?: string;
}

export interface StandardSection extends AuditedEntity {
  standardVersionId: UUID;
  sectionCode?: string;
  heading: string;
  pageStart?: number;
  pageEnd?: number;
  parentSectionId?: UUID;
  ordinal: number;
  citationLabel: string;
}

export interface DocumentChunkMetadata extends AuditedEntity {
  standardVersionId: UUID;
  sectionId?: UUID;
  chunkId: string;
  pageStart?: number;
  pageEnd?: number;
  sectionHeading?: string;
  tokenEstimate?: number;
  contentSha256?: string;
  storageUri?: string;
  shortPreview?: string;
  containsTable?: boolean;
  containsFormula?: boolean;
  copyrightSafeForPreview: boolean;
}

export interface ExtractedRequirement extends AuditedEntity {
  standardVersionId: UUID;
  standardSectionId?: UUID;
  sourceChunkId?: string;
  requirementSummary: string;
  requirementType: string;
  sourceSectionReference?: string;
  sourcePageReference?: string;
  confidenceScore: number;
  extractionMethod: "deterministic" | "LLM" | "hybrid" | "manual";
  status: RequirementStatus;
  limitationStatement: string;
  warnings: string[];
}

export interface ApprovedRequirement extends AuditedEntity {
  extractedRequirementId?: UUID;
  standardVersionId: UUID;
  requirementSummary: string;
  requirementType: string;
  sourceSectionReference?: string;
  sourcePageReference?: string;
  status: RequirementStatus;
  reviewerId: UUID;
  reviewerRole: "SME" | "engineer" | "legal" | "admin" | "superadmin";
  reviewComment?: string;
  approvedAt?: ISODateTimeString;
  legalReviewRequired: boolean;
}

export interface RuleCondition {
  id: UUID;
  ruleSetId: UUID;
  industries?: Industry[];
  equipmentApplicability?: EquipmentApplicability[];
  analysisApplicability?: AnalysisApplicability[];
  serviceKeywords?: string[];
  jurisdiction?: string[];
  conditionExpression?: JsonObject;
  dataQualityMinimum?: DataQualityStatus;
}

export interface RuleSet extends AuditedEntity {
  approvedRequirementId?: UUID;
  standardVersionId: UUID;
  standardCode: string;
  standardTitle: string;
  publisher: StandardPublisher;
  edition?: string;
  name: string;
  description: string;
  status: RuleStatus;
  authorityLevel: AutomationAuthorityLevel;
  conditions: RuleCondition[];
  priority: number;
  conflictPolicy: "earliest_due_date" | "most_conservative" | "manual_review";
  effectiveFrom?: ISODateString;
  retiredAt?: ISODateTimeString;
}

export interface CalculationMethod extends AuditedEntity {
  key: string;
  name: string;
  version: string;
  implementationReference: string;
  authorityLevel: AutomationAuthorityLevel;
  requiredInputs: string[];
  outputStatus: AnalysisOutputStatus;
  limitationStatement: string;
}

export interface AnalysisRun extends AuditedEntity {
  analysisType: AnalysisApplicability;
  assetContext: AssetContext;
  input: JsonObject;
  output: JsonObject;
  status: AnalysisOutputStatus;
  dataQualityStatus: DataQualityStatus;
  warnings: string[];
  limitationStatement: string;
  requiredReviewRole?: "SME" | "engineer" | "corrosion_engineer" | "regulatory" | "admin";
  ruleIdsUsed: UUID[];
  standardVersionIdsUsed: UUID[];
  calculationMethodVersion?: string;
}

export interface AnalysisFinding extends AuditedEntity {
  analysisRunId: UUID;
  findingType: "warning" | "gap" | "recommendation" | "calculation" | "risk_ranking";
  title: string;
  summary: string;
  status: AnalysisOutputStatus;
  severity?: "low" | "medium" | "high" | "critical";
  ruleIdsUsed: UUID[];
  citationReferences: CitationReference[];
  requiredReviewRole?: string;
}

export interface EvidenceRequirement extends AuditedEntity {
  equipmentClass: EquipmentApplicability;
  analysisType: AnalysisApplicability;
  evidenceType: string;
  description: string;
  mandatory: boolean;
  authorityLevel: AutomationAuthorityLevel;
  ruleSetId?: UUID;
  acceptedFormats: string[];
}

export interface EvidencePack extends AuditedEntity {
  assetContext: AssetContext;
  applicableStandardVersionIds: UUID[];
  requiredEvidence: EvidenceRequirement[];
  availableEvidence: EvidenceItem[];
  missingEvidence: EvidenceRequirement[];
  dataQualityStatus: DataQualityStatus;
  analysisRunIds: UUID[];
  findings: AnalysisFinding[];
  citationReferences: CitationReference[];
  limitationStatement: string;
  outputStatus: AnalysisOutputStatus;
  humanReviewSection: string;
  generatedAt: ISODateTimeString;
  generatedBy: UUID;
}

export interface EvidenceItem {
  id: UUID;
  evidenceType: string;
  title: string;
  storageUri?: string;
  dataQualityStatus: DataQualityStatus;
  uploadedAt?: ISODateTimeString;
}

export interface ReviewWorkflow extends AuditedEntity {
  entityType: "standard_document" | "extracted_requirement" | "rule_set" | "analysis_run" | "evidence_pack";
  entityId: UUID;
  status: "pending" | "approved" | "rejected" | "changes_requested";
  requiredRole: "SME" | "engineer" | "corrosion_engineer" | "legal" | "regulatory" | "admin" | "superadmin";
  reviewerId?: UUID;
  reviewComment?: string;
  decidedAt?: ISODateTimeString;
}

export interface AuditEvent extends AuditedEntity {
  actorId: UUID;
  actorRole: string;
  action:
    | "upload"
    | "parse"
    | "extract"
    | "review"
    | "approve"
    | "activate_rule"
    | "run_analysis"
    | "override"
    | "reject"
    | "archive";
  entityType: string;
  entityId: UUID;
  before?: JsonObject;
  after?: JsonObject;
  reason?: string;
  ipAddress?: string;
}

export interface CitationReference {
  standardCode: string;
  edition?: string;
  sectionReference?: string;
  pageReference?: string;
  chunkId?: string;
  ruleId?: UUID;
  note?: string;
}

export interface ConservativeDueDateCandidate {
  source: "statutory" | "regulator" | "owner" | "RBI" | "recommendation" | "engineer_override" | "manual";
  date?: string | Date | null;
  label?: string;
  approvedOverride?: boolean;
  ruleId?: UUID;
}

export interface ConservativeDueDateResult {
  selectedDate?: ISODateString;
  selectedCandidate?: ConservativeDueDateCandidate;
  consideredCandidates: ConservativeDueDateCandidate[];
  rejectedCandidates: Array<ConservativeDueDateCandidate & { reason: string }>;
  warnings: string[];
  limitationStatement: string;
}

export interface CorrosionRateResult {
  corrosionRatePerYear?: number;
  rawRatePerYear?: number;
  elapsedYears?: number;
  metalLoss?: number;
  status: AnalysisOutputStatus;
  warnings: string[];
  limitationStatement: string;
}

export interface DataCompletenessResult {
  status: DataQualityStatus;
  requiredFields: string[];
  availableFields: string[];
  missingFields: string[];
  coveragePercent: number;
  warnings: string[];
}

export interface ApplicableStandardResult {
  standardVersionId: UUID;
  standardCode: string;
  standardTitle: string;
  publisher: StandardPublisher;
  edition?: string;
  ruleIds: UUID[];
  authorityLevel: AutomationAuthorityLevel;
  matchBasis: string[];
}
