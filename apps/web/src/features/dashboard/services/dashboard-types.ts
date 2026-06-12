import type { APP_ROUTES } from "@/lib/app-routes";

export type DashboardRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES] extends string
  ? (typeof APP_ROUTES)[keyof typeof APP_ROUTES]
  : string;

export type RiskLevel = "low" | "medium" | "medium-high" | "high";

export type InspectionDueStatus =
  | "overdue"
  | "due-30"
  | "due-90"
  | "current"
  | "pending-validation";

export type CertificateStatus = "expired" | "due-soon" | "due";

export type AnomalySeverity = "critical" | "high" | "medium" | "low";

export type CriticalAttentionStatus =
  | "open"
  | "waiting-validation"
  | "due-soon";

export interface FacilityProfile {
  id: string;
  name: string;
  shortName: string;
  type: string;
  owner: string;
  nominalThroughput: string[];
  operatingMode: string[];
  userContext: string;
  footerDateLabel: string;
}

export interface AssetClassSummary {
  id: string;
  label: string;
  count: number;
  iconLabel: string;
}

export interface RiskMatrixCell {
  likelihood: number;
  consequence: number;
  count: number;
  level: RiskLevel;
}

export interface InspectionTrendPoint {
  id: string;
  label: string;
  statuses: Record<InspectionDueStatus, number>;
}

export interface CertificateRecord {
  id: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  certificateType: string;
  expiryDate: string;
  daysLeft: number;
  status: CertificateStatus;
  route: string;
}

export interface AnomalySeveritySegment {
  severity: AnomalySeverity;
  count: number;
}

export interface RbiProgressRecord {
  id: string;
  equipmentClass: string;
  assessed: number;
  total: number;
  methodologyLabel: string;
}

export interface DocumentCompletenessSegment {
  status: "complete" | "partial" | "missing";
  label: string;
  count: number;
}

export interface DocumentIssue {
  id: string;
  label: string;
  count: number;
  status: "action-required" | "watch";
  route: string;
}

export interface CriticalAttentionRecord {
  id: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  issue: string;
  severity: "medium" | "medium-high" | "high";
  status: CriticalAttentionStatus;
  dueStatus: string;
  relatedRoute: string;
  taxonomyLabels: string[];
  recommendedAction: string;
}

export interface RecommendationSummary {
  open: number;
  waitingClientClarification: number;
}

export interface IntegrityReadiness {
  score: number;
  target: number;
  deltaLast30Days: number;
}

export interface DashboardSeedData {
  facility: FacilityProfile;
  assetClasses: AssetClassSummary[];
  riskMatrix: RiskMatrixCell[];
  inspectionTrend: InspectionTrendPoint[];
  certificates: CertificateRecord[];
  certificateSummary: {
    dueWithin180Days: number;
    expiredOrUrgentEvidence: number;
  };
  anomalyDistribution: AnomalySeveritySegment[];
  anomalySummary: {
    overdueCorrectiveActions: number;
    waitingClientClarification: number;
  };
  rbiProgress: RbiProgressRecord[];
  documentCompleteness: DocumentCompletenessSegment[];
  documentIssues: DocumentIssue[];
  criticalAttention: CriticalAttentionRecord[];
  recommendationSummary: RecommendationSummary;
  integrityReadiness: IntegrityReadiness;
  taxonomyLabels: string[];
}
