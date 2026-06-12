import type {
  AssessmentColumnKey,
  AssessmentDateRange,
  AssessmentFilterChip,
  AssessmentFilters,
  AssessmentSavedView,
  AssessmentSortKey,
  RbiAssessmentRecord,
  SortDirection,
} from "./assessment-types";

export const DEFAULT_ASSESSMENT_FILTERS: AssessmentFilters = {
  search: "",
  chips: [],
  assetClass: "All",
  assessor: "All",
  reviewStage: "All",
  dateRange: "current-campaign",
  savedView: "all",
};

export const DEFAULT_VISIBLE_ASSESSMENT_COLUMNS: Record<AssessmentColumnKey, boolean> = {
  assessmentId: true,
  assetSystem: true,
  status: true,
  assessor: true,
  reviewStage: true,
  riskLevel: true,
  lastModified: true,
  approvalStatus: true,
  nextAction: true,
  actions: true,
};

const riskWeight = {
  High: 4,
  "Medium-High": 3,
  Medium: 2,
  Low: 1,
} as const;

const statusWeight = {
  "Overdue Assessment": 6,
  "Requires Revalidation": 5,
  "In Review": 4,
  "Pending Approval": 3,
  Draft: 2,
  Approved: 1,
} as const;

export function getSavedViewFilters(savedView: AssessmentSavedView): AssessmentFilters {
  switch (savedView) {
    case "my-active-view":
      return {
        ...DEFAULT_ASSESSMENT_FILTERS,
        savedView,
        assessor: "Budi Santoso",
        chips: ["In Review"],
      };
    case "high-risk-review":
      return {
        ...DEFAULT_ASSESSMENT_FILTERS,
        savedView,
        chips: ["High Risk", "In Review"],
      };
    case "backlog-review":
      return {
        ...DEFAULT_ASSESSMENT_FILTERS,
        savedView,
        chips: ["In Review"],
        reviewStage: "Technical Governance Review",
      };
    case "revalidation-queue":
      return {
        ...DEFAULT_ASSESSMENT_FILTERS,
        savedView,
        chips: ["Requires Revalidation"],
      };
    default:
      return DEFAULT_ASSESSMENT_FILTERS;
  }
}

export function filterAssessments(records: RbiAssessmentRecord[], filters: AssessmentFilters) {
  const search = normalize(filters.search);

  return records.filter((record) => {
    const searchMatch =
      search.length === 0 ||
      [
        record.assessmentId,
        record.assetSystem,
        record.assessor,
        record.status,
        record.reviewStage,
        record.riskLevel,
        record.approvalStatus,
        record.nextAction,
        record.assetClass,
        record.primaryDamageMechanism,
        record.standardMapping,
      ]
        .map(normalize)
        .some((value) => value.includes(search));
    const chipMatch = filters.chips.length === 0 || filters.chips.every((chip) => doesRecordMatchChip(record, chip));
    const assetClassMatch = filters.assetClass === "All" || record.assetClass === filters.assetClass;
    const assessorMatch = filters.assessor === "All" || record.assessor === filters.assessor;
    const reviewStageMatch = filters.reviewStage === "All" || record.reviewStage === filters.reviewStage;
    const dateRangeMatch = doesRecordMatchDateRange(record, filters.dateRange);

    return searchMatch && chipMatch && assetClassMatch && assessorMatch && reviewStageMatch && dateRangeMatch;
  });
}

export function sortAssessments(
  records: RbiAssessmentRecord[],
  sortKey: AssessmentSortKey,
  direction: SortDirection,
) {
  const multiplier = direction === "asc" ? 1 : -1;

  return [...records].sort((a, b) => {
    const comparison = compareAssessment(a, b, sortKey);
    if (comparison !== 0) return comparison * multiplier;

    return a.assessmentId.localeCompare(b.assessmentId);
  });
}

export function paginateAssessments(records: RbiAssessmentRecord[], page: number, rowsPerPage: number) {
  const pageCount = Math.max(1, Math.ceil(records.length / rowsPerPage));
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const start = (safePage - 1) * rowsPerPage;

  return {
    page: safePage,
    pageCount,
    rows: records.slice(start, start + rowsPerPage),
  };
}

export function toggleChip(chips: AssessmentFilterChip[], chip: AssessmentFilterChip) {
  if (chips.includes(chip)) return chips.filter((current) => current !== chip);

  return [...chips, chip];
}

export function getActiveFilterLabels(filters: AssessmentFilters) {
  const labels: string[] = [];

  if (filters.search) labels.push(`Search: ${filters.search}`);
  labels.push(...filters.chips);
  if (filters.assetClass !== "All") labels.push(`Asset Class: ${filters.assetClass}`);
  if (filters.assessor !== "All") labels.push(`Assessor: ${filters.assessor}`);
  if (filters.reviewStage !== "All") labels.push(`Stage: ${filters.reviewStage}`);
  if (filters.dateRange !== "current-campaign") labels.push(`Range: ${formatDateRange(filters.dateRange)}`);
  if (filters.savedView !== "all") labels.push(`View: ${formatSavedView(filters.savedView)}`);

  return labels;
}

function compareAssessment(a: RbiAssessmentRecord, b: RbiAssessmentRecord, sortKey: AssessmentSortKey) {
  switch (sortKey) {
    case "assetSystem":
      return a.assetSystem.localeCompare(b.assetSystem);
    case "status":
      return statusWeight[a.status] - statusWeight[b.status];
    case "riskLevel":
      return riskWeight[a.riskLevel] - riskWeight[b.riskLevel];
    case "lastModified":
      return new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime();
    case "approvalStatus":
      return a.approvalStatus.localeCompare(b.approvalStatus);
    default:
      return a.assessmentId.localeCompare(b.assessmentId);
  }
}

function doesRecordMatchChip(record: RbiAssessmentRecord, chip: AssessmentFilterChip) {
  switch (chip) {
    case "High Risk":
      return record.riskLevel === "High";
    case "Overdue Assessment":
      return record.overdue || record.status === "Overdue Assessment";
    default:
      return record.status === chip;
  }
}

function doesRecordMatchDateRange(record: RbiAssessmentRecord, dateRange: AssessmentDateRange) {
  if (dateRange === "all" || dateRange === "current-campaign") return true;

  const reviewDate = new Date("2026-06-12T23:59:59.000+07:00");
  const modifiedDate = new Date(record.lastModified);
  const diffDays = Math.ceil((reviewDate.getTime() - modifiedDate.getTime()) / 86_400_000);

  if (dateRange === "last-7-days") return diffDays <= 7;
  if (dateRange === "last-30-days") return diffDays <= 30;

  return true;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function formatSavedView(savedView: AssessmentSavedView) {
  switch (savedView) {
    case "my-active-view":
      return "My Active View";
    case "high-risk-review":
      return "High Risk Review";
    case "backlog-review":
      return "Backlog Review";
    case "revalidation-queue":
      return "Revalidation Queue";
    default:
      return "All Assessments";
  }
}

function formatDateRange(dateRange: AssessmentDateRange) {
  switch (dateRange) {
    case "all":
      return "All Dates";
    case "last-7-days":
      return "Last 7 Days";
    case "last-30-days":
      return "Last 30 Days";
    default:
      return "Current Campaign";
  }
}
