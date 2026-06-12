export type RiskViewMode = "baseline" | "mitigated";

export type RiskLevel = "low" | "medium" | "high" | "very-high" | "extreme";

export type PortfolioRiskBand = "low" | "medium" | "medium-high" | "high";

export type AssetClassFilter =
  | "all"
  | "pressure-vessel"
  | "piping-circuit"
  | "storage-tank"
  | "pressure-safety-device"
  | "rotating-equipment"
  | "heat-exchanger"
  | "instrumented-safety";

export type RiskCategoryFilter = "all" | RiskLevel;

export type DamageMechanismFilter =
  | "all"
  | "internal-co2-corrosion"
  | "h2s-susceptibility"
  | "localized-pitting"
  | "under-deposit-corrosion"
  | "external-atmospheric-corrosion"
  | "corrosion-under-insulation"
  | "mic-produced-water"
  | "erosion-corrosion"
  | "vibration-fatigue"
  | "psv-documentation-mismatch"
  | "flange-leakage"
  | "gasket-degradation"
  | "nozzle-coating-breakdown"
  | "thinning-cml-tml"
  | "missing-calibration-evidence"
  | "expired-inspection-certificate"
  | "incomplete-pid-revision-control"
  | "overdue-ndt-report-validation";

export type DateRangeFilter = "last-30" | "last-90" | "current-campaign" | "ytd";

export interface RiskAnalyticsFilters {
  facilityId: string;
  assetClass: AssetClassFilter;
  riskCategory: RiskCategoryFilter;
  damageMechanism: DamageMechanismFilter;
  dateRange: DateRangeFilter;
  showComparison: boolean;
}

export interface FacilityRiskAnalyticsContext {
  id: string;
  name: string;
  type: string;
  owner: string;
  currentUser: string;
  operatingMode: string;
  condition: string[];
  throughput: {
    grossLiquidBopd: number;
    crudeExportBopd: number;
    associatedGasMmscfd: number;
    producedWaterBwpd: number;
    onsiteStorageBbl: number;
  };
}

export interface RiskAnalyticsKpi {
  id: string;
  label: string;
  value: number;
  delta: string;
  href: string;
  tone: "blue" | "red" | "orange" | "cyan" | "violet" | "emerald";
}

export interface AssetPopulationItem {
  id: AssetClassFilter;
  label: string;
  count: number;
}

export interface RiskAssetPoint {
  id: string;
  assetId: string;
  tag: string;
  name: string;
  assetType: string;
  assetClass: Exclude<AssetClassFilter, "all">;
  probabilityBaseline: number;
  consequenceBaseline: number;
  probabilityMitigated: number;
  consequenceMitigated: number;
  riskScoreBaseline: number;
  riskScoreMitigated: number;
  dominantDamageMechanism: DamageMechanismFilter;
  dominantDamageMechanismLabel: string;
  inspectionStatus: string;
  certificationStatus: string;
  evidenceStatus: string;
  inspectionCoveragePercent: number;
  standards: string[];
  linkedRoutes: {
    assetDetail: string;
    inspectionHistory: string;
    rbiAssessment: string;
    documentEvidence: string;
    anomalies: string;
    recommendations: string;
  };
}

export interface RiskCategorySummary {
  id: PortfolioRiskBand;
  label: string;
  count: number;
}

export interface DistributionItem {
  id: string;
  label: string;
  baseline: number;
  mitigated: number;
}

export interface DamageMechanismParetoItem {
  id: DamageMechanismFilter;
  label: string;
  count: number;
}

export interface RiskTrendItem {
  month: string;
  baseline: number;
  mitigated: number;
}

export interface InspectionCoveragePoint {
  id: string;
  assetId: string;
  tag: string;
  assetClass: Exclude<AssetClassFilter, "all">;
  coveragePercent: number;
  riskScoreBaseline: number;
  riskScoreMitigated: number;
  radius: number;
}

export interface MitigationScenario {
  id: string;
  label: string;
  highRiskCount: number;
  averageRiskReductionPercent: number;
  actionCoveragePercent: number;
  readinessScore: number;
  note: string;
}

export interface RiskInsight {
  id: string;
  text: string;
  href: string;
  tone: "red" | "orange" | "blue" | "cyan";
}

export interface InspectionValidationSummary {
  overdue: number;
  dueWithin90Days: number;
  current: number;
  pendingValidation: number;
  insufficientHistory: number;
}

export interface DocumentationCompletenessSummary {
  complete: number;
  partial: number;
  missingExpiredUnvalidated: number;
}

export interface TopRiskAsset {
  id: string;
  assetId: string;
  tag: string;
  assetType: string;
  riskScoreBaseline: number;
  riskScoreMitigated: number;
  dominantDamageMechanism: string;
  href: string;
}

export interface RiskAnalyticsData {
  facility: FacilityRiskAnalyticsContext;
  assetPopulation: AssetPopulationItem[];
  portfolioRiskSummary: RiskCategorySummary[];
  kpis: RiskAnalyticsKpi[];
  riskAssets: RiskAssetPoint[];
  pofDistribution: DistributionItem[];
  cofDistribution: DistributionItem[];
  damageMechanismPareto: DamageMechanismParetoItem[];
  riskTrend: RiskTrendItem[];
  inspectionCoverage: InspectionCoveragePoint[];
  mitigationScenarios: MitigationScenario[];
  riskInsights: RiskInsight[];
  inspectionValidationSummary: InspectionValidationSummary;
  documentationCompletenessSummary: DocumentationCompletenessSummary;
  topRiskAssets: TopRiskAsset[];
  routePlaceholders: {
    riskInsights: string;
    highRiskAssetList: string;
  };
}
