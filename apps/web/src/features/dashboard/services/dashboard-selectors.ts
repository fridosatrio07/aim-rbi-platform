import type {
  AnomalySeverity,
  DashboardSeedData,
  InspectionDueStatus,
  RiskLevel,
} from "./dashboard-types";

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  high: "High",
  "medium-high": "Medium-High",
  medium: "Medium",
  low: "Low",
};

export const INSPECTION_STATUS_LABELS: Record<InspectionDueStatus, string> = {
  overdue: "Overdue",
  "due-30": "Due <=30 Days",
  "due-90": "Due <=90 Days",
  current: "Current",
  "pending-validation": "Pending Validation",
};

export const ANOMALY_SEVERITY_LABELS: Record<AnomalySeverity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function getTotalAssetCount(data: DashboardSeedData) {
  return data.assetClasses.reduce((total, assetClass) => total + assetClass.count, 0);
}

export function getRiskSummary(data: DashboardSeedData): Record<RiskLevel, number> {
  return data.riskMatrix.reduce<Record<RiskLevel, number>>(
    (summary, cell) => {
      summary[cell.level] += cell.count;
      return summary;
    },
    { high: 0, "medium-high": 0, medium: 0, low: 0 },
  );
}

export function getLatestInspectionSnapshot(data: DashboardSeedData) {
  return data.inspectionTrend[data.inspectionTrend.length - 1];
}

export function getInspectionDueWithin90Days(data: DashboardSeedData) {
  const latest = getLatestInspectionSnapshot(data);

  return latest.statuses["due-90"];
}

export function getCurrentInspectionCount(data: DashboardSeedData) {
  return getLatestInspectionSnapshot(data).statuses.current;
}

export function getPendingInspectionValidationCount(data: DashboardSeedData) {
  return getLatestInspectionSnapshot(data).statuses["pending-validation"];
}

export function getActiveAnomalyCount(data: DashboardSeedData) {
  return data.anomalyDistribution.reduce((total, segment) => total + segment.count, 0);
}

export function getDocumentCompletenessTotal(data: DashboardSeedData) {
  return data.documentCompleteness.reduce((total, segment) => total + segment.count, 0);
}

export function getReadinessGap(data: DashboardSeedData) {
  return Math.max(0, data.integrityReadiness.target - data.integrityReadiness.score);
}

export function getDashboardKpis(data: DashboardSeedData) {
  const totalAssets = getTotalAssetCount(data);
  const riskSummary = getRiskSummary(data);
  const latestInspection = getLatestInspectionSnapshot(data);
  const highRiskAssets = riskSummary.high;
  const highRiskPercent = totalAssets === 0 ? 0 : (highRiskAssets / totalAssets) * 100;

  return {
    totalAssets,
    highRiskAssets,
    highRiskPercent,
    overdueInspections: latestInspection.statuses.overdue,
    inspectionsDueWithin90Days: getInspectionDueWithin90Days(data),
    certificatesDueWithin180Days: data.certificateSummary.dueWithin180Days,
    expiredOrUrgentCertificates: data.certificateSummary.expiredOrUrgentEvidence,
    activeAnomalies: getActiveAnomalyCount(data),
    overdueCorrectiveActions: data.anomalySummary.overdueCorrectiveActions,
    openRecommendations: data.recommendationSummary.open,
    waitingClientClarification: data.recommendationSummary.waitingClientClarification,
    readinessScore: data.integrityReadiness.score,
    readinessTarget: data.integrityReadiness.target,
    readinessDelta: data.integrityReadiness.deltaLast30Days,
  };
}

export function getRbiProgressPercent(assessed: number, total: number) {
  if (total === 0) return 0;
  return Math.round((assessed / total) * 100);
}

export function getPercent(count: number, total: number) {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
}
