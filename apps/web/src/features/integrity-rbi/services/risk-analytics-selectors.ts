import type {
  DamageMechanismParetoItem,
  DistributionItem,
  InspectionCoveragePoint,
  RiskAnalyticsData,
  RiskAnalyticsFilters,
  RiskAssetPoint,
  RiskLevel,
  RiskViewMode,
  TopRiskAsset,
} from "./risk-analytics-types";

export function getRiskScore(asset: RiskAssetPoint, mode: RiskViewMode) {
  return mode === "baseline" ? asset.riskScoreBaseline : asset.riskScoreMitigated;
}

export function getProbability(asset: RiskAssetPoint, mode: RiskViewMode) {
  return mode === "baseline" ? asset.probabilityBaseline : asset.probabilityMitigated;
}

export function getConsequence(asset: RiskAssetPoint, mode: RiskViewMode) {
  return mode === "baseline" ? asset.consequenceBaseline : asset.consequenceMitigated;
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 23) return "extreme";
  if (score >= 18) return "very-high";
  if (score >= 13) return "high";
  if (score >= 8) return "medium";

  return "low";
}

export function getRiskLevelForAsset(asset: RiskAssetPoint, mode: RiskViewMode) {
  return getRiskLevel(getRiskScore(asset, mode));
}

export function filterRiskAssets(
  assets: RiskAssetPoint[],
  filters: RiskAnalyticsFilters,
  mode: RiskViewMode,
) {
  return assets.filter((asset) => {
    const assetClassMatch = filters.assetClass === "all" || asset.assetClass === filters.assetClass;
    const damageMatch =
      filters.damageMechanism === "all" || asset.dominantDamageMechanism === filters.damageMechanism;
    const riskMatch = filters.riskCategory === "all" || getRiskLevelForAsset(asset, mode) === filters.riskCategory;

    return assetClassMatch && damageMatch && riskMatch;
  });
}

export function filterCoveragePoints(
  points: InspectionCoveragePoint[],
  filters: RiskAnalyticsFilters,
  assets: RiskAssetPoint[],
  mode: RiskViewMode,
) {
  const filteredAssetIds = new Set(filterRiskAssets(assets, filters, mode).map((asset) => asset.assetId));

  return points.filter((point) => filteredAssetIds.has(point.assetId));
}

export function getDistributionValue(item: DistributionItem, mode: RiskViewMode) {
  return mode === "baseline" ? item.baseline : item.mitigated;
}

export function getTopRiskAssetsForMode(data: RiskAnalyticsData, mode: RiskViewMode, filters: RiskAnalyticsFilters) {
  const filteredAssetIds = new Set(filterRiskAssets(data.riskAssets, filters, mode).map((asset) => asset.assetId));

  return data.topRiskAssets
    .filter((asset) => filteredAssetIds.has(asset.assetId))
    .map((asset) => ({
      ...asset,
      activeRiskScore: mode === "baseline" ? asset.riskScoreBaseline : asset.riskScoreMitigated,
    }))
    .sort((a, b) => b.activeRiskScore - a.activeRiskScore);
}

export function getActiveRiskScore(asset: TopRiskAsset, mode: RiskViewMode) {
  return mode === "baseline" ? asset.riskScoreBaseline : asset.riskScoreMitigated;
}

export function getFilteredParetoItems(
  items: DamageMechanismParetoItem[],
  filters: RiskAnalyticsFilters,
) {
  if (filters.damageMechanism === "all") return items;

  return items.filter((item) => item.id === filters.damageMechanism);
}

export function getFilteredCountLabel(filteredCount: number, totalCount: number) {
  if (filteredCount === totalCount) return `${totalCount} modeled assets in view`;

  return `${filteredCount} of ${totalCount} modeled assets in view`;
}

export function getTotalAssetPopulation(data: RiskAnalyticsData) {
  return data.assetPopulation.reduce((sum, item) => sum + item.count, 0);
}

export function getPercent(value: number, total: number) {
  if (total === 0) return 0;

  return Math.round((value / total) * 100);
}
