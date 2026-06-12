import type {
  DamageMechanismSummary,
  RiskDistributionSegment,
  RiskMatrixCell,
  OverviewRiskLevel,
} from "./integrity-rbi-overview-types";

export const OVERVIEW_RISK_COLORS: Record<OverviewRiskLevel, string> = {
  high: "#ef4444",
  "medium-high": "#f97316",
  medium: "#facc15",
  low: "#22c55e",
};

export function getRiskDistributionTotal(segments: RiskDistributionSegment[]) {
  return segments.reduce((sum, segment) => sum + segment.count, 0);
}

export function getHighAndMediumHighSummary(segments: RiskDistributionSegment[]) {
  const total = getRiskDistributionTotal(segments);
  const count = segments
    .filter((segment) => segment.level === "high" || segment.level === "medium-high")
    .reduce((sum, segment) => sum + segment.count, 0);

  return {
    count,
    percent: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
  };
}

export function getRiskDistributionGradient(segments: RiskDistributionSegment[]) {
  const total = getRiskDistributionTotal(segments);
  let cursor = 0;

  return `conic-gradient(${segments
    .map((segment) => {
      const start = cursor;
      const size = total > 0 ? (segment.count / total) * 100 : 0;
      cursor += size;

      return `${OVERVIEW_RISK_COLORS[segment.level]} ${start}% ${cursor}%`;
    })
    .join(", ")})`;
}

export function getMatrixCell(cells: RiskMatrixCell[], probability: number, consequence: number) {
  return cells.find((cell) => cell.probability === probability && cell.consequence === consequence);
}

export function getHighZoneCount(cells: RiskMatrixCell[]) {
  return cells.filter((cell) => cell.zone === "high").reduce((sum, cell) => sum + cell.count, 0);
}

export function getMaxDamageMechanismCount(items: DamageMechanismSummary[]) {
  return Math.max(...items.map((item) => item.count), 1);
}

export function getPercent(value: number, total: number) {
  if (total === 0) return 0;

  return Math.round((value / total) * 100);
}
