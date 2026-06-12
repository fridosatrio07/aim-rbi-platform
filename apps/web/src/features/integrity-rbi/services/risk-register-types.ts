export type RiskRegisterRiskLevel = "all" | "high" | "medium-high" | "medium" | "low";

export type RiskRecordRiskCategory = Exclude<RiskRegisterRiskLevel, "all">;

export type RiskRegisterAssetClass =
  | "all"
  | "pressure-vessel"
  | "piping-flowline"
  | "tank"
  | "compressor-rotating"
  | "pressure-safety-device"
  | "pump"
  | "heat-exchanger"
  | "shutdown-valve"
  | "metering-skid"
  | "electrical-utility";

export type RiskRegisterSystem =
  | "all"
  | "separation-crude-stabilization"
  | "crude-export"
  | "storage"
  | "gas-compression"
  | "relief-protection"
  | "produced-water"
  | "crude-transfer"
  | "associated-gas"
  | "esd-isolation"
  | "gas-dehydration";

export type RiskRegisterDamageMechanism =
  | "all"
  | "internal-co2-corrosion"
  | "under-deposit-corrosion"
  | "erosion-corrosion"
  | "external-atmospheric-corrosion"
  | "localized-pitting"
  | "vibration-fatigue"
  | "documentation-calibration-control"
  | "mic"
  | "mechanical-seal-leakage"
  | "insulation-degradation";

export type InspectionEffectiveness = "low" | "medium" | "medium-high" | "high";

export type RiskRegisterSavedView =
  | "all"
  | "high-risk-focus"
  | "due-within-90"
  | "low-inspection-effectiveness"
  | "psv-calibration-issues";

export type RiskRegisterSortKey =
  | "priority"
  | "assetTag"
  | "pof"
  | "cof"
  | "riskCategory"
  | "nextInspectionDue";

export type SortDirection = "asc" | "desc";

export type RiskRegisterColumnKey =
  | "assetTag"
  | "system"
  | "equipmentClass"
  | "pof"
  | "cof"
  | "riskCategory"
  | "riskDriver"
  | "damageMechanism"
  | "inspectionEffectiveness"
  | "nextInspectionDue"
  | "mitigationRecommendation"
  | "actions";

export interface RiskRegisterFilters {
  search: string;
  riskLevel: RiskRegisterRiskLevel;
  assetClass: RiskRegisterAssetClass;
  system: RiskRegisterSystem;
  damageMechanism: RiskRegisterDamageMechanism;
  savedView: RiskRegisterSavedView;
}

export interface RiskRegisterRouteLinks {
  assetDetail: string;
  inspectionPlanning: string;
  anomalies: string;
  documentsEvidence: string;
  riskAnalytics: string;
  riskMatrix: string;
  recommendation: string;
}

export interface RiskRegisterRecord {
  id: string;
  assetId: string;
  assetTag: string;
  system: string;
  systemId: Exclude<RiskRegisterSystem, "all">;
  equipmentClass: string;
  assetClass: Exclude<RiskRegisterAssetClass, "all">;
  pof: number;
  cof: number;
  riskCategory: RiskRecordRiskCategory;
  riskDriver: string;
  damageMechanism: string;
  damageMechanismIds: Exclude<RiskRegisterDamageMechanism, "all">[];
  inspectionEffectiveness: InspectionEffectiveness;
  nextInspectionDue: string;
  nextInspectionDueLabel: string;
  mitigationRecommendation: string;
  priorityHighlight: boolean;
  recommendationStatus: "open" | "in-progress" | "monitoring";
  activeAnomalyCount: number;
  openRecommendationCount: number;
  linkedRoutes: RiskRegisterRouteLinks;
}

export interface RiskRegisterKpi {
  id: string;
  label: string;
  value: number;
  tone: "red" | "orange" | "cyan" | "violet";
}

export interface RiskRegisterSummaryMetric {
  id: string;
  label: string;
  value: string;
  tone: "red" | "orange" | "blue" | "emerald";
}

export interface RiskRegisterData {
  totalPortfolioRecords: number;
  facility: {
    id: string;
    name: string;
    type: string;
    owner: string;
    currentUser: string;
  };
  kpis: RiskRegisterKpi[];
  summaryMetrics: RiskRegisterSummaryMetric[];
  frameworkLabels: string[];
  records: RiskRegisterRecord[];
}
