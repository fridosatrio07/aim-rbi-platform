export type AssessmentDetailRiskLevel = "Low" | "Medium" | "Medium-High" | "High" | "Extreme";

export type AssessmentWorkflowStepStatus =
  | "completed"
  | "current"
  | "pending"
  | "blocked"
  | "needsClarification"
  | "pendingValidation";

export type DamageScreeningResult = "Applicable" | "Monitor" | "Requires Clarification";

export type AssessmentConfidenceLevel = "High" | "Medium" | "Low";

export type AssessmentDataQualityLevel = "Good" | "Fair" | "Poor";

export type EvidenceStatusFilter = "all" | "good" | "fair" | "poor" | "clarification";

export type MechanismCategoryFilter =
  | "all"
  | "internal-corrosion"
  | "external-corrosion"
  | "mechanical-integrity"
  | "documentation-control";

export interface AssessmentDetailSummary {
  assessmentId: string;
  assetTag: string;
  assetName: string;
  assetClass: string;
  service: string;
  locationArea: string;
  assessmentType: string;
  methodologyLabels: string[];
  status: "In Review";
  leadOwner: string;
  lastUpdated: string;
  nextReviewTarget: string;
  facilityName: string;
  facilityType: string;
  projectOwner: string;
}

export interface AssessmentDetailKpi {
  id: string;
  label: string;
  value: string;
  marker: string;
  tone: "blue" | "red" | "orange" | "emerald" | "violet" | "cyan" | "slate";
}

export interface AssessmentWorkflowStep {
  id: string;
  label: string;
  shortLabel: string;
  status: AssessmentWorkflowStepStatus;
  completeness: number;
  disciplines: string[];
  requiredEvidenceCount: number;
  linkedComments: number;
  linkedRfis: number;
  href: string;
}

export interface StepPreviewMetric {
  label: string;
  value: string;
  tone: "blue" | "red" | "orange" | "emerald" | "violet" | "cyan" | "slate";
}

export interface StepPreviewAction {
  label: string;
  href: string;
}

export interface AssessmentStepPreview {
  stepId: string;
  title: string;
  statusText: string;
  narrative: string;
  metrics: StepPreviewMetric[];
  bullets: string[];
  actions: StepPreviewAction[];
}

export interface DamageMechanismReviewRow {
  id: string;
  mechanism: string;
  category: Exclude<MechanismCategoryFilter, "all">;
  screeningResult: DamageScreeningResult;
  confidence: AssessmentConfidenceLevel;
  evidenceSummary: string;
  affectedComponent: string;
  severityDriver: string;
  dataQuality: AssessmentDataQualityLevel;
  reviewerNote: string;
}

export interface AssessmentAccordionSection {
  id: string;
  title: string;
  items: string[];
}

export interface LinkedAssetContextItem {
  label: string;
  value: string;
  href?: string;
}

export interface HistoricalInspectionItem {
  year: string;
  title: string;
  status: "Validated" | "Pending Validation" | "Evidence Incomplete" | "In Progress";
  href: string;
}

export interface RiskMatrixCell {
  probability: number;
  consequence: number;
  label: AssessmentDetailRiskLevel;
}

export interface AssessmentStatusStep {
  label: string;
  status: "completed" | "in-progress" | "pending";
  completeness?: number;
}

export interface AssessmentStakeholderStatus {
  role: string;
  status: "Assigned" | "Pending";
}

export interface AssessmentAcceptanceGate {
  label: string;
  status: "complete" | "in-progress" | "pending";
}

export interface AssessmentEvidenceItem {
  id: string;
  title: string;
  type: string;
  status: "Linked" | "Pending Validation" | "Missing Critical";
  href: string;
}

export interface AssessmentStatusPanelData {
  overallCompleteness: number;
  sectionCompleteness: AssessmentStatusStep[];
  reviewStage: string;
  stakeholders: AssessmentStakeholderStatus[];
  reviewHealth: {
    openComments: number;
    unresolvedRfis: number;
    pendingAcceptanceDecisions: number;
  };
  dataQualityScore: number;
  evidenceCoverageScore: number;
  documentPackage: {
    filesLinked: number;
    pendingValidation: number;
    missingCriticalAttachment: number;
  };
  acceptanceGates: AssessmentAcceptanceGate[];
}

export interface AssessmentDetailRoutes {
  assessmentsList: string;
  assetProfile: string;
  riskRegister: string;
  riskAnalytics: string;
  inspectionHistory: string;
  evidencePack: string;
  documents: string;
  anomalies: string;
  recommendations: string;
  governance: string;
}

export interface RbiAssessmentDetailData {
  summary: AssessmentDetailSummary;
  kpis: AssessmentDetailKpi[];
  workflowSteps: AssessmentWorkflowStep[];
  stepPreviews: AssessmentStepPreview[];
  damageMechanisms: DamageMechanismReviewRow[];
  accordionSections: AssessmentAccordionSection[];
  linkedAssetContext: LinkedAssetContextItem[];
  historicalInspections: HistoricalInspectionItem[];
  riskMatrix: RiskMatrixCell[];
  currentRiskPosition: {
    probability: number;
    consequence: number;
    label: AssessmentDetailRiskLevel;
  };
  keyIntegrityConcerns: string[];
  statusPanel: AssessmentStatusPanelData;
  evidenceItems: AssessmentEvidenceItem[];
  routes: AssessmentDetailRoutes;
}
