export type OverviewRiskLevel = "high" | "medium-high" | "medium" | "low";

export type OverviewIssueSeverity = "critical" | "high" | "medium";

export type OverviewStatus = "Completed" | "In Review" | "Due Soon" | "Planned" | "Active" | "In Use" | "Healthy";

export interface IntegrityRbiFacilityOverview {
  id: string;
  name: string;
  type: string;
  owner: string;
  currentUser: string;
  operatingMode: string[];
  throughput: Array<{
    id: string;
    label: string;
    value: string;
  }>;
}

export interface IntegrityRbiKpi {
  id: string;
  label: string;
  value: string;
  marker: string;
  tone: "blue" | "red" | "orange" | "emerald" | "violet" | "cyan";
  href: string;
}

export interface IntegrityRbiChildPage {
  id: string;
  name: string;
  descriptor: string;
  href: string;
  tone: "blue" | "red" | "orange" | "emerald" | "violet" | "cyan" | "slate";
}

export interface RiskDistributionSegment {
  level: OverviewRiskLevel;
  label: string;
  count: number;
}

export interface RiskMatrixCell {
  probability: number;
  consequence: number;
  count: number;
  zone: "low" | "medium" | "high";
}

export interface DamageMechanismSummary {
  id: string;
  label: string;
  count: number;
}

export interface InspectionEffectivenessItem {
  id: string;
  label: string;
  value: number;
  tone: "red" | "orange" | "blue" | "emerald" | "slate";
}

export interface EquipmentCompletionItem {
  id: string;
  label: string;
  percent: number;
}

export interface RevalidationScheduleItem {
  id: string;
  assetTag: string;
  assetName: string;
  dueDate: string;
  status: "Due Soon" | "Planned";
  href: string;
}

export interface HighRiskAssetSummary {
  id: string;
  assetTag: string;
  equipmentSystem: string;
  riskScore: number;
  rank: number;
  drivers: string[];
  href: string;
}

export interface IntegrityIssueAlert {
  id: string;
  severity: OverviewIssueSeverity;
  title: string;
  date: string;
  href: string;
}

export interface RecentAssessmentSummary {
  id: string;
  assetTag: string;
  method: string;
  assessmentDate: string;
  rank: number;
  status: "Completed" | "In Review";
  href: string;
}

export interface GovernanceStandardSummary {
  id: string;
  label: string;
  category: string;
  status: "In Use" | "Active";
  href: string;
}

export interface WorkflowStageSummary {
  id: string;
  label: string;
  href: string;
  metrics: Array<{
    label: string;
    value: number;
    tone: "red" | "orange" | "blue" | "emerald" | "slate";
  }>;
}

export interface IntegrityRbiOverviewData {
  facility: IntegrityRbiFacilityOverview;
  kpis: IntegrityRbiKpi[];
  childPages: IntegrityRbiChildPage[];
  riskDistribution: RiskDistributionSegment[];
  riskMatrix: RiskMatrixCell[];
  damageMechanisms: DamageMechanismSummary[];
  inspectionEffectiveness: {
    score: number;
    items: InspectionEffectivenessItem[];
  };
  assessmentCompletion: EquipmentCompletionItem[];
  revalidationSchedule: RevalidationScheduleItem[];
  topHighRiskAssets: HighRiskAssetSummary[];
  integrityIssues: IntegrityIssueAlert[];
  recentAssessments: RecentAssessmentSummary[];
  governanceStandards: GovernanceStandardSummary[];
  workflow: {
    healthPercent: number;
    status: OverviewStatus;
    stages: WorkflowStageSummary[];
  };
}
