import type {
  RiskRecordRiskCategory,
  RiskRegisterColumnKey,
  RiskRegisterFilters,
  RiskRegisterRecord,
  RiskRegisterSavedView,
  RiskRegisterSortKey,
  SortDirection,
} from "./risk-register-types";

export const DEFAULT_RISK_REGISTER_FILTERS: RiskRegisterFilters = {
  search: "",
  riskLevel: "all",
  assetClass: "all",
  system: "all",
  damageMechanism: "all",
  savedView: "all",
};

export const DEFAULT_VISIBLE_COLUMNS: Record<RiskRegisterColumnKey, boolean> = {
  assetTag: true,
  system: true,
  equipmentClass: true,
  pof: true,
  cof: true,
  riskCategory: true,
  riskDriver: true,
  damageMechanism: true,
  inspectionEffectiveness: true,
  nextInspectionDue: true,
  mitigationRecommendation: true,
  actions: true,
};

const riskSortWeight: Record<RiskRecordRiskCategory, number> = {
  high: 4,
  "medium-high": 3,
  medium: 2,
  low: 1,
};

export function getSavedViewFilters(savedView: RiskRegisterSavedView): RiskRegisterFilters {
  switch (savedView) {
    case "high-risk-focus":
      return {
        ...DEFAULT_RISK_REGISTER_FILTERS,
        savedView,
        riskLevel: "high",
      };
    case "due-within-90":
      return {
        ...DEFAULT_RISK_REGISTER_FILTERS,
        savedView,
      };
    case "low-inspection-effectiveness":
      return {
        ...DEFAULT_RISK_REGISTER_FILTERS,
        savedView,
      };
    case "psv-calibration-issues":
      return {
        ...DEFAULT_RISK_REGISTER_FILTERS,
        savedView,
        assetClass: "pressure-safety-device",
        damageMechanism: "documentation-calibration-control",
        search: "PSV",
      };
    default:
      return DEFAULT_RISK_REGISTER_FILTERS;
  }
}

export function filterRiskRegisterRecords(records: RiskRegisterRecord[], filters: RiskRegisterFilters) {
  const normalizedSearch = normalize(filters.search);

  return records.filter((record) => {
    const searchMatch =
      normalizedSearch.length === 0 ||
      [
        record.assetTag,
        record.system,
        record.equipmentClass,
        record.riskDriver,
        record.damageMechanism,
        record.mitigationRecommendation,
      ]
        .map(normalize)
        .some((value) => value.includes(normalizedSearch));
    const riskMatch = filters.riskLevel === "all" || record.riskCategory === filters.riskLevel;
    const assetClassMatch = filters.assetClass === "all" || record.assetClass === filters.assetClass;
    const systemMatch = filters.system === "all" || record.systemId === filters.system;
    const damageMatch =
      filters.damageMechanism === "all" || record.damageMechanismIds.includes(filters.damageMechanism);
    const savedViewMatch = doesRecordMatchSavedView(record, filters.savedView);

    return searchMatch && riskMatch && assetClassMatch && systemMatch && damageMatch && savedViewMatch;
  });
}

export function sortRiskRegisterRecords(
  records: RiskRegisterRecord[],
  sortKey: RiskRegisterSortKey,
  direction: SortDirection,
) {
  const multiplier = direction === "asc" ? 1 : -1;

  return [...records].sort((a, b) => {
    if (sortKey === "priority") {
      if (a.priorityHighlight !== b.priorityHighlight) return a.priorityHighlight ? -1 : 1;

      return new Date(a.nextInspectionDue).getTime() - new Date(b.nextInspectionDue).getTime();
    }

    const comparison = compareByKey(a, b, sortKey);

    if (comparison !== 0) return comparison * multiplier;

    if (a.priorityHighlight !== b.priorityHighlight) return a.priorityHighlight ? -1 : 1;

    return a.assetTag.localeCompare(b.assetTag);
  });
}

export function getActiveFilterChips(filters: RiskRegisterFilters) {
  const chips: Array<{ key: keyof RiskRegisterFilters; label: string }> = [];

  if (filters.search) chips.push({ key: "search", label: `Search: ${filters.search}` });
  if (filters.riskLevel !== "all") chips.push({ key: "riskLevel", label: `Risk: ${formatOptionLabel(filters.riskLevel)}` });
  if (filters.assetClass !== "all") chips.push({ key: "assetClass", label: `Asset: ${formatOptionLabel(filters.assetClass)}` });
  if (filters.system !== "all") chips.push({ key: "system", label: `System: ${formatOptionLabel(filters.system)}` });
  if (filters.damageMechanism !== "all") {
    chips.push({ key: "damageMechanism", label: `Damage: ${formatOptionLabel(filters.damageMechanism)}` });
  }
  if (filters.savedView !== "all") chips.push({ key: "savedView", label: `View: ${formatSavedView(filters.savedView)}` });

  return chips;
}

export function clearFilterChip(filters: RiskRegisterFilters, key: keyof RiskRegisterFilters): RiskRegisterFilters {
  if (key === "savedView") {
    return {
      ...filters,
      savedView: "all",
    };
  }

  return {
    ...filters,
    [key]: DEFAULT_RISK_REGISTER_FILTERS[key],
    savedView: key === "search" ? filters.savedView : "all",
  };
}

function compareByKey(a: RiskRegisterRecord, b: RiskRegisterRecord, sortKey: RiskRegisterSortKey) {
  switch (sortKey) {
    case "assetTag":
      return a.assetTag.localeCompare(b.assetTag);
    case "pof":
      return a.pof - b.pof;
    case "cof":
      return a.cof - b.cof;
    case "riskCategory":
      return riskSortWeight[a.riskCategory] - riskSortWeight[b.riskCategory];
    case "nextInspectionDue":
      return new Date(a.nextInspectionDue).getTime() - new Date(b.nextInspectionDue).getTime();
    default:
      return 0;
  }
}

function doesRecordMatchSavedView(record: RiskRegisterRecord, savedView: RiskRegisterSavedView) {
  switch (savedView) {
    case "due-within-90": {
      const reviewDate = new Date("2026-06-12T00:00:00.000Z");
      const dueDate = new Date(`${record.nextInspectionDue}T00:00:00.000Z`);
      const diffDays = Math.ceil((dueDate.getTime() - reviewDate.getTime()) / 86_400_000);

      return diffDays >= 0 && diffDays <= 90;
    }
    case "low-inspection-effectiveness":
      return record.inspectionEffectiveness === "low";
    case "psv-calibration-issues":
      return (
        record.assetClass === "pressure-safety-device" &&
        record.damageMechanismIds.includes("documentation-calibration-control")
      );
    default:
      return true;
  }
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function formatOptionLabel(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatSavedView(savedView: RiskRegisterSavedView) {
  switch (savedView) {
    case "high-risk-focus":
      return "High Risk Focus";
    case "due-within-90":
      return "Due Within 90 Days";
    case "low-inspection-effectiveness":
      return "Low Inspection Effectiveness";
    case "psv-calibration-issues":
      return "PSV Calibration Issues";
    default:
      return "All Risk Records";
  }
}
