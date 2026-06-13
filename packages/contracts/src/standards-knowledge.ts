import type {
  AnalysisApplicability,
  AnalysisOutputStatus,
  ApplicableStandardResult,
  AssetContext,
  AutomationAuthorityLevel,
  ConservativeDueDateCandidate,
  ConservativeDueDateResult,
  CorrosionRateResult,
  DataCompletenessResult,
  DataQualityStatus,
  DocumentChunkMetadata,
  DocumentStatus,
  EquipmentApplicability,
  EvidenceRequirement,
  EvidencePack,
  ExtractedRequirement,
  Industry,
  RequirementStatus,
  RuleSet,
  RuleStatus,
  StandardDocument,
  StandardPublisher,
  StandardVersion,
} from "../../domain/src/standards-knowledge/index.js";

export interface StandardsLibraryQuery {
  search?: string;
  publisher?: StandardPublisher;
  status?: DocumentStatus;
  industry?: Industry;
  equipmentApplicability?: EquipmentApplicability;
  analysisApplicability?: AnalysisApplicability;
}

export interface CreateStandardDocumentRequest {
  code: string;
  title: string;
  publisher: StandardPublisher;
  edition?: string;
  publicationYear?: number;
  effectiveDate?: string;
  industries: Industry[];
  equipmentApplicability: EquipmentApplicability[];
  analysisApplicability: AnalysisApplicability[];
  confidentiality: StandardDocument["confidentiality"];
  licenseNote: string;
  ownerOrganization?: string;
  reviewRequirement: "SME" | "legal" | "admin" | "superadmin";
}

export interface CreateStandardDocumentResponse {
  standard: StandardDocument;
  version: StandardVersion;
  auditEventId: string;
}

export interface UploadStandardDocumentMetadataRequest extends CreateStandardDocumentRequest {
  fileName?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  checksumSha256?: string;
  storageUri?: string;
}

export interface UploadStandardDocumentMetadataResponse {
  standardDocumentId: string;
  standardVersionId: string;
  privateStorageUri?: string;
  status: DocumentStatus;
  warnings: string[];
}

export interface StartParsingJobRequest {
  standardVersionId: string;
  documentStorageUri: string;
  requestedBy: string;
  parserMode?: "metadata_only" | "text" | "text_and_tables";
}

export interface ParsingJobResponse {
  jobId: string;
  status: "queued" | "running" | "completed" | "failed";
  standardVersionId: string;
  chunks?: DocumentChunkMetadata[];
  warnings: string[];
  limitationStatement: string;
}

export interface RequirementExtractionRequest {
  standardVersionId: string;
  chunkIds?: string[];
  extractionMode?: "deterministic" | "LLM" | "hybrid";
  requestedBy: string;
}

export interface RequirementExtractionResponse {
  jobId: string;
  status: "queued" | "running" | "completed" | "failed";
  requirements: ExtractedRequirement[];
  warnings: string[];
  limitationStatement: string;
}

export interface RequirementReviewRequest {
  requirementId: string;
  decision: "approve" | "reject" | "request_changes";
  reviewerId: string;
  reviewerRole: "SME" | "engineer" | "legal" | "admin" | "superadmin";
  editedSummary?: string;
  reviewComment?: string;
  requireLegalReview?: boolean;
}

export interface RequirementReviewResponse {
  requirementId: string;
  status: RequirementStatus;
  auditEventId: string;
}

export interface ActivateRuleRequest {
  approvedRequirementId: string;
  name: string;
  description: string;
  authorityLevel: AutomationAuthorityLevel;
  status?: RuleStatus;
  conditions: RuleSet["conditions"];
  conflictPolicy: RuleSet["conflictPolicy"];
  priority?: number;
  activatedBy: string;
}

export interface ActivateRuleResponse {
  ruleSet: RuleSet;
  auditEventId: string;
}

export interface ApplicabilityCheckRequest {
  assetContext: AssetContext;
}

export interface ApplicabilityCheckResponse {
  assetContext: AssetContext;
  applicableStandards: ApplicableStandardResult[];
  outputStatus: AnalysisOutputStatus;
  warnings: string[];
  limitationStatement: string;
}

export interface DocumentCompletenessCheckRequest {
  assetContext: AssetContext;
  requiredFields: string[];
  availableFields: string[] | Record<string, unknown>;
}

export interface DocumentCompletenessCheckResponse extends DataCompletenessResult {
  outputStatus: AnalysisOutputStatus;
  requiredReviewRole?: string;
  limitationStatement: string;
}

export interface CorrosionCalculationRequest {
  previousThickness: number;
  currentThickness: number;
  previousDate: string;
  currentDate: string;
  unit?: "mm" | "inch";
  minimumRequiredThickness?: number;
}

export interface CorrosionCalculationResponse extends CorrosionRateResult {
  remainingLifeYears?: number;
  dataQualityStatus: DataQualityStatus;
  requiredReviewRole?: string;
}

export interface DueDateCalculationRequest {
  candidates: ConservativeDueDateCandidate[];
}

export interface DueDateCalculationResponse extends ConservativeDueDateResult {
  outputStatus: AnalysisOutputStatus;
  requiredReviewRole?: string;
}

export interface PreliminaryRiskRankingRequest {
  assetContext: AssetContext;
  probabilityCategory: 1 | 2 | 3 | 4 | 5;
  consequenceCategory: 1 | 2 | 3 | 4 | 5;
  basis?: string;
  ruleIds?: string[];
}

export interface PreliminaryRiskRankingResponse {
  riskScore: number;
  riskRank: "low" | "medium" | "medium_high" | "high";
  outputStatus: AnalysisOutputStatus;
  warnings: string[];
  requiredReviewRole: "engineer";
  limitationStatement: string;
}

export interface DraftInspectionPlanRequest {
  assetContext: AssetContext;
  applicableRuleIds: string[];
  knownDamageMechanisms?: string[];
  dataQualityStatus?: DataQualityStatus;
}

export interface DraftInspectionPlanResponse {
  outputStatus: AnalysisOutputStatus;
  planSummary: string;
  proposedMethods: string[];
  warnings: string[];
  requiredReviewRole: "engineer" | "SME";
  limitationStatement: string;
}

export interface DraftFindingRecommendationRequest {
  assetContext: AssetContext;
  findingBasis: string;
  ruleIds?: string[];
  dataQualityStatus?: DataQualityStatus;
}

export interface DraftFindingRecommendationResponse {
  outputStatus: AnalysisOutputStatus;
  findingDraft: string;
  recommendationDraft: string;
  warnings: string[];
  requiredReviewRole: "engineer";
  limitationStatement: string;
}

export interface EvidencePackGenerationRequest {
  assetContext: AssetContext;
  applicableStandardVersionIds: string[];
  evidenceRequirements: EvidenceRequirement[];
  availableEvidence: Array<{ id: string; evidenceType: string; title: string; dataQualityStatus: DataQualityStatus }>;
  analysisRunIds?: string[];
  generatedBy: string;
}

export interface EvidencePackGenerationResponse {
  evidencePack: EvidencePack;
  outputStatus: AnalysisOutputStatus;
  warnings: string[];
  limitationStatement: string;
}

export const STANDARDS_KNOWLEDGE_ENDPOINTS = {
  standardsLibrary: "/standards",
  uploadMetadata: "/documents/standards/upload-metadata",
  parsingJobs: "/ai-orchestration/parsing-jobs",
  extractionJobs: "/ai-orchestration/extraction-jobs",
  requirementReview: "/reviews/requirements",
  ruleActivation: "/rules/activate",
  applicabilityCheck: "/analysis/applicable-standards",
  documentCompleteness: "/analysis/document-completeness",
  corrosionRate: "/analysis/corrosion-rate",
  dueDate: "/analysis/due-date",
  preliminaryRisk: "/analysis/preliminary-risk",
  draftInspectionPlan: "/analysis/draft-inspection-plan",
  draftFindingRecommendation: "/analysis/draft-finding-recommendation",
  evidencePackDraft: "/evidence/pack-draft",
} as const;
