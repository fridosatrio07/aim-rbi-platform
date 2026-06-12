export type AssessmentStatus =
  | "Draft"
  | "In Review"
  | "Approved"
  | "Pending Approval"
  | "Requires Revalidation"
  | "Overdue Assessment";

export type AssessmentRiskLevel = "High" | "Medium-High" | "Medium" | "Low";

export type AssessmentReviewStage =
  | "Assessor Review"
  | "Peer Review"
  | "Technical Governance Review"
  | "Client Review"
  | "Final Approval";

export type AssessmentApprovalStatus =
  | "Pending"
  | "Not Submitted"
  | "Awaiting Evidence"
  | "Approved"
  | "Rejected for Revision";

export type AssessmentAssetClass =
  | "All"
  | "Pressure Vessel"
  | "Piping Circuit"
  | "Storage Tank"
  | "Rotating Equipment"
  | "Heat Transfer Equipment"
  | "Pressure Safety Device"
  | "Pump"
  | "Valve / Isolation"
  | "Metering Skid";

export type AssessmentEvidenceStatus =
  | "Complete"
  | "Partial"
  | "Awaiting Evidence"
  | "Missing Critical Evidence"
  | "Rejected for Revision";

export type AssessmentSavedView =
  | "all"
  | "my-active-view"
  | "high-risk-review"
  | "backlog-review"
  | "revalidation-queue";

export type AssessmentDateRange = "all" | "last-7-days" | "last-30-days" | "current-campaign";

export type AssessmentFilterChip =
  | "Draft"
  | "In Review"
  | "Approved"
  | "Requires Revalidation"
  | "High Risk"
  | "Overdue Assessment";

export type AssessmentSortKey =
  | "assessmentId"
  | "assetSystem"
  | "status"
  | "riskLevel"
  | "lastModified"
  | "approvalStatus";

export type SortDirection = "asc" | "desc";

export type AssessmentColumnKey =
  | "assessmentId"
  | "assetSystem"
  | "status"
  | "assessor"
  | "reviewStage"
  | "riskLevel"
  | "lastModified"
  | "approvalStatus"
  | "nextAction"
  | "actions";

export interface AssessmentFilters {
  search: string;
  chips: AssessmentFilterChip[];
  assetClass: AssessmentAssetClass;
  assessor: "All" | "Budi Santoso" | "Dewi Lestari" | "Rizky Pratama";
  reviewStage: "All" | AssessmentReviewStage;
  dateRange: AssessmentDateRange;
  savedView: AssessmentSavedView;
}

export interface AssessmentRouteLinks {
  assessmentDetail: string;
  assetProfile: string;
  evidence: string;
  anomalies: string;
  recommendations: string;
  assignReviewer: string;
  revalidation: string;
}

export interface RbiAssessmentRecord {
  id: string;
  assessmentId: string;
  assetSystem: string;
  assetId: string;
  status: AssessmentStatus;
  assessor: "Budi Santoso" | "Dewi Lestari" | "Rizky Pratama";
  reviewStage: AssessmentReviewStage;
  riskLevel: AssessmentRiskLevel;
  lastModified: string;
  lastModifiedLabel: string;
  approvalStatus: AssessmentApprovalStatus;
  nextAction: string;
  assetClass: Exclude<AssessmentAssetClass, "All">;
  standardMapping: string;
  primaryDamageMechanism: string;
  evidenceStatus: AssessmentEvidenceStatus;
  overdue: boolean;
  requiresRevalidation: boolean;
  linkedRoutes: AssessmentRouteLinks;
}

export interface AssessmentKpi {
  id: string;
  label: string;
  value: number;
  marker: string;
  tone: "blue" | "red" | "orange" | "emerald" | "violet" | "cyan";
  chip?: AssessmentFilterChip;
}

export interface AssessmentWorkflowItem {
  id: string;
  label: string;
  count: number;
  tone: "slate" | "blue" | "orange" | "emerald" | "violet" | "red";
}

export interface AssessmentBacklogItem {
  stage: AssessmentReviewStage;
  count: number;
}

export interface HighRiskAttentionItem {
  id: string;
  assetSystem: string;
  issue: string;
  href: string;
}

export interface RbiAssessmentsData {
  totalPortfolioAssessments: number;
  kpis: AssessmentKpi[];
  records: RbiAssessmentRecord[];
  workflowSummary: AssessmentWorkflowItem[];
  reviewBacklog: AssessmentBacklogItem[];
  highRiskAttention: HighRiskAttentionItem[];
}
