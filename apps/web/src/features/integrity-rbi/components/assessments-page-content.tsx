"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Eye,
  FileSearch,
  Filter,
  History,
  ListChecks,
  MoreHorizontal,
  Search,
  ShieldAlert,
  X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_ROUTES } from "@/lib/app-routes";
import { cn } from "@/lib/utils";

import { RBI_ASSESSMENTS_DATA } from "../services/assessment-data";
import {
  DEFAULT_ASSESSMENT_FILTERS,
  DEFAULT_VISIBLE_ASSESSMENT_COLUMNS,
  filterAssessments,
  getActiveFilterLabels,
  getSavedViewFilters,
  paginateAssessments,
  sortAssessments,
  toggleChip,
} from "../services/assessment-selectors";
import type {
  AssessmentAssetClass,
  AssessmentColumnKey,
  AssessmentDateRange,
  AssessmentFilterChip,
  AssessmentFilters,
  AssessmentKpi,
  AssessmentReviewStage,
  AssessmentSavedView,
  AssessmentSortKey,
  RbiAssessmentRecord,
  SortDirection,
} from "../services/assessment-types";

const FILTER_CHIPS: AssessmentFilterChip[] = [
  "Draft",
  "In Review",
  "Approved",
  "Requires Revalidation",
  "High Risk",
  "Overdue Assessment",
];

const ASSET_CLASS_OPTIONS: AssessmentAssetClass[] = [
  "All",
  "Pressure Vessel",
  "Piping Circuit",
  "Storage Tank",
  "Rotating Equipment",
  "Heat Transfer Equipment",
  "Pressure Safety Device",
  "Pump",
  "Valve / Isolation",
  "Metering Skid",
];

const ASSESSOR_OPTIONS: AssessmentFilters["assessor"][] = [
  "All",
  "Budi Santoso",
  "Dewi Lestari",
  "Rizky Pratama",
];

const REVIEW_STAGE_OPTIONS: AssessmentFilters["reviewStage"][] = [
  "All",
  "Assessor Review",
  "Peer Review",
  "Technical Governance Review",
  "Client Review",
  "Final Approval",
];

const DATE_RANGE_OPTIONS: Array<{ value: AssessmentDateRange; label: string }> = [
  { value: "current-campaign", label: "Current Campaign" },
  { value: "last-7-days", label: "Last 7 Days" },
  { value: "last-30-days", label: "Last 30 Days" },
  { value: "all", label: "All Dates" },
];

const SAVED_VIEW_OPTIONS: Array<{ value: AssessmentSavedView; label: string }> = [
  { value: "all", label: "All Assessments" },
  { value: "my-active-view", label: "My Active View" },
  { value: "high-risk-review", label: "High Risk Review" },
  { value: "backlog-review", label: "Backlog Review" },
  { value: "revalidation-queue", label: "Revalidation Queue" },
];

const OPTIONAL_COLUMNS: AssessmentColumnKey[] = [
  "assessor",
  "reviewStage",
  "lastModified",
  "approvalStatus",
  "nextAction",
];

const COLUMN_LABELS: Record<AssessmentColumnKey, string> = {
  assessmentId: "Assessment ID",
  assetSystem: "Asset / System",
  status: "Status",
  assessor: "Assessor",
  reviewStage: "Review Stage",
  riskLevel: "Risk Level",
  lastModified: "Last Modified",
  approvalStatus: "Approval Status",
  nextAction: "Next Action",
  actions: "Actions",
};

const KPI_ICONS: Record<string, LucideIcon> = {
  total: ClipboardCheck,
  backlog: Clock3,
  approved: CheckCircle2,
  revalidation: History,
  "high-risk": ShieldAlert,
  overdue: AlertTriangle,
};

const TONE_STYLES = {
  blue: "border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200",
  red: "border-red-100 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200",
  orange: "border-orange-100 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200",
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200",
  violet: "border-violet-100 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200",
  cyan: "border-cyan-100 bg-cyan-50 text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200",
  slate: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200",
} as const;

export function AssessmentsPageContent() {
  const [filters, setFilters] = useState<AssessmentFilters>(DEFAULT_ASSESSMENT_FILTERS);
  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE_ASSESSMENT_COLUMNS);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [sortKey, setSortKey] = useState<AssessmentSortKey>("lastModified");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const filteredRecords = useMemo(() => filterAssessments(RBI_ASSESSMENTS_DATA.records, filters), [filters]);
  const sortedRecords = useMemo(
    () => sortAssessments(filteredRecords, sortKey, sortDirection),
    [filteredRecords, sortDirection, sortKey],
  );
  const paginated = useMemo(
    () => paginateAssessments(sortedRecords, page, rowsPerPage),
    [page, rowsPerPage, sortedRecords],
  );
  const activeFilterLabels = useMemo(() => getActiveFilterLabels(filters), [filters]);

  function updateFilter<T extends keyof AssessmentFilters>(key: T, value: AssessmentFilters[T]) {
    setFilters((current) => ({
      ...current,
      [key]: value,
      savedView: key === "savedView" ? (value as AssessmentSavedView) : "all",
    }));
    setPage(1);
  }

  function handleChipToggle(chip: AssessmentFilterChip) {
    setFilters((current) => ({
      ...current,
      chips: toggleChip(current.chips, chip),
      savedView: "all",
    }));
    setPage(1);
  }

  function handleKpiClick(kpi: AssessmentKpi) {
    if (!kpi.chip) {
      setFilters(DEFAULT_ASSESSMENT_FILTERS);
      setPage(1);
      return;
    }

    const chip = kpi.chip;

    setFilters((current) => ({
      ...current,
      chips: current.chips.includes(chip) ? [] : [chip],
      savedView: "all",
    }));
    setPage(1);
  }

  function handleSavedViewChange(savedView: AssessmentSavedView) {
    setFilters(getSavedViewFilters(savedView));
    setPage(1);
  }

  function handleSort(nextSortKey: AssessmentSortKey) {
    setSortKey((currentSortKey) => {
      if (currentSortKey === nextSortKey) {
        setSortDirection((currentDirection) => (currentDirection === "asc" ? "desc" : "asc"));
        return currentSortKey;
      }

      setSortDirection(nextSortKey === "assessmentId" || nextSortKey === "assetSystem" ? "asc" : "desc");
      return nextSortKey;
    });
  }

  function handleClearAll() {
    setFilters(DEFAULT_ASSESSMENT_FILTERS);
    setPage(1);
  }

  return (
    <div className="space-y-4 text-slate-950 dark:text-slate-100">
      <header className="min-w-0">
        <nav className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
          <Link href={APP_ROUTES.rbi.overview} className="transition hover:text-blue-700 dark:hover:text-blue-200">
            Integrity / RBI
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-700 dark:text-slate-200">Assessments</span>
        </nav>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          Assessments
        </h1>
      </header>

      <AssessmentKpiCards filters={filters} onKpiClick={handleKpiClick} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          <AssessmentFilters
            activeFilterLabels={activeFilterLabels}
            columnsOpen={columnsOpen}
            filters={filters}
            visibleColumns={visibleColumns}
            visibleCount={filteredRecords.length}
            onClearAll={handleClearAll}
            onColumnsOpenChange={setColumnsOpen}
            onFilterChange={updateFilter}
            onSavedViewChange={handleSavedViewChange}
            onToggleChip={handleChipToggle}
            onVisibleColumnsChange={setVisibleColumns}
          />

          <AssessmentTable
            openActionId={openActionId}
            page={paginated.page}
            pageCount={paginated.pageCount}
            records={paginated.rows}
            rowsPerPage={rowsPerPage}
            sortDirection={sortDirection}
            sortKey={sortKey}
            totalCount={sortedRecords.length}
            visibleColumns={visibleColumns}
            onOpenActionChange={setOpenActionId}
            onPageChange={setPage}
            onRowsPerPageChange={(value) => {
              setRowsPerPage(value);
              setPage(1);
            }}
            onSort={handleSort}
          />
        </div>

        <AssessmentSidePanel />
      </div>
    </div>
  );
}

function AssessmentKpiCards({
  filters,
  onKpiClick,
}: {
  filters: AssessmentFilters;
  onKpiClick: (kpi: AssessmentKpi) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      {RBI_ASSESSMENTS_DATA.kpis.map((kpi) => {
        const Icon = KPI_ICONS[kpi.id] ?? ClipboardCheck;
        const active = kpi.chip ? filters.chips.includes(kpi.chip) : filters.chips.length === 0 && filters.search.length === 0;

        return (
          <button
            key={kpi.id}
            type="button"
            onClick={() => onKpiClick(kpi)}
            className={cn(
              "group rounded-2xl text-left outline-none transition focus-visible:ring-2 focus-visible:ring-blue-300",
              active && "ring-2 ring-blue-200 dark:ring-blue-500/30",
            )}
          >
            <Card className="h-full rounded-2xl transition group-hover:-translate-y-0.5 group-hover:border-blue-200 group-hover:shadow-lg group-hover:shadow-blue-950/5 dark:group-hover:border-blue-500/30">
              <CardContent className="flex min-h-[112px] items-center gap-3 p-3.5">
                <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl border", TONE_STYLES[kpi.tone])}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">{kpi.label}</p>
                  <p className="mt-1 text-3xl font-black tracking-tight text-slate-950 dark:text-white">{kpi.value}</p>
                  <p className="mt-1 truncate text-xs font-bold text-slate-500 dark:text-slate-400">{kpi.marker}</p>
                </div>
              </CardContent>
            </Card>
          </button>
        );
      })}
    </div>
  );
}

function AssessmentFilters({
  activeFilterLabels,
  columnsOpen,
  filters,
  visibleColumns,
  visibleCount,
  onClearAll,
  onColumnsOpenChange,
  onFilterChange,
  onSavedViewChange,
  onToggleChip,
  onVisibleColumnsChange,
}: {
  activeFilterLabels: string[];
  columnsOpen: boolean;
  filters: AssessmentFilters;
  visibleColumns: Record<AssessmentColumnKey, boolean>;
  visibleCount: number;
  onClearAll: () => void;
  onColumnsOpenChange: (open: boolean) => void;
  onFilterChange: <T extends keyof AssessmentFilters>(key: T, value: AssessmentFilters[T]) => void;
  onSavedViewChange: (savedView: AssessmentSavedView) => void;
  onToggleChip: (chip: AssessmentFilterChip) => void;
  onVisibleColumnsChange: (columns: Record<AssessmentColumnKey, boolean>) => void;
}) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="space-y-3 p-3.5">
        <div className="grid gap-3 xl:grid-cols-12">
          <label className="relative xl:col-span-4">
            <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Search Assessments</span>
            <Search className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm font-bold text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-blue-500/60 dark:focus:ring-blue-500/20"
              placeholder="Search ID, asset, assessor, status, evidence..."
              value={filters.search}
              onChange={(event) => onFilterChange("search", event.target.value)}
            />
          </label>
          <FilterSelect
            className="xl:col-span-2"
            label="Asset Class"
            options={ASSET_CLASS_OPTIONS}
            value={filters.assetClass}
            onChange={(value) => onFilterChange("assetClass", value as AssessmentAssetClass)}
          />
          <FilterSelect
            className="xl:col-span-2"
            label="Assessor"
            options={ASSESSOR_OPTIONS}
            value={filters.assessor}
            onChange={(value) => onFilterChange("assessor", value as AssessmentFilters["assessor"])}
          />
          <FilterSelect
            className="xl:col-span-2"
            label="Review Stage"
            options={REVIEW_STAGE_OPTIONS}
            value={filters.reviewStage}
            onChange={(value) => onFilterChange("reviewStage", value as AssessmentReviewStage | "All")}
          />
          <FilterSelect
            className="xl:col-span-2"
            label="Date Range"
            options={DATE_RANGE_OPTIONS}
            value={filters.dateRange}
            onChange={(value) => onFilterChange("dateRange", value as AssessmentDateRange)}
          />
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
          {FILTER_CHIPS.map((chip) => {
            const active = filters.chips.includes(chip);

            return (
              <button
                key={chip}
                type="button"
                onClick={() => onToggleChip(chip)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-extrabold transition",
                  active
                    ? "border-blue-200 bg-blue-600 text-white shadow-sm dark:border-blue-500/40"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-200",
                )}
              >
                {chip}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-3 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-extrabold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
              <Filter className="h-3.5 w-3.5" aria-hidden="true" />
              {visibleCount} visible assessments
            </span>
            {activeFilterLabels.map((label) => (
              <span key={label} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                {label}
              </span>
            ))}
            {activeFilterLabels.length > 0 ? (
              <button type="button" onClick={onClearAll} className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
                <X className="h-3 w-3" aria-hidden="true" />
                Clear all
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <label className="relative">
              <Eye className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
              <select
                className="h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-xs font-extrabold text-slate-700 shadow-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-blue-500/60 dark:focus:ring-blue-500/20"
                value={filters.savedView}
                onChange={(event) => onSavedViewChange(event.target.value as AssessmentSavedView)}
              >
                {SAVED_VIEW_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => onColumnsOpenChange(!columnsOpen)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-extrabold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              >
                <ListChecks className="h-4 w-4" aria-hidden="true" />
                Columns
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              {columnsOpen ? (
                <div className="absolute right-0 z-20 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-950">
                  <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Optional columns</p>
                  <div className="space-y-2">
                    {OPTIONAL_COLUMNS.map((column) => (
                      <label key={column} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900">
                        <span>{COLUMN_LABELS[column]}</span>
                        <input
                          checked={visibleColumns[column]}
                          className="h-4 w-4 accent-blue-600"
                          type="checkbox"
                          onChange={(event) =>
                            onVisibleColumnsChange({
                              ...visibleColumns,
                              [column]: event.target.checked,
                            })
                          }
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FilterSelect({
  className,
  label,
  options,
  value,
  onChange,
}: {
  className?: string;
  label: string;
  options: string[] | Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={cn("min-w-0", className)}>
      <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
      <select
        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 shadow-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-blue-500/60 dark:focus:ring-blue-500/20"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => {
          const valueOption = typeof option === "string" ? option : option.value;
          const labelOption = typeof option === "string" ? option : option.label;

          return (
            <option key={valueOption} value={valueOption}>
              {labelOption}
            </option>
          );
        })}
      </select>
    </label>
  );
}

function AssessmentTable({
  openActionId,
  page,
  pageCount,
  records,
  rowsPerPage,
  sortDirection,
  sortKey,
  totalCount,
  visibleColumns,
  onOpenActionChange,
  onPageChange,
  onRowsPerPageChange,
  onSort,
}: {
  openActionId: string | null;
  page: number;
  pageCount: number;
  records: RbiAssessmentRecord[];
  rowsPerPage: number;
  sortDirection: SortDirection;
  sortKey: AssessmentSortKey;
  totalCount: number;
  visibleColumns: Record<AssessmentColumnKey, boolean>;
  onOpenActionChange: (id: string | null) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onSort: (sortKey: AssessmentSortKey) => void;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex-row items-center justify-between gap-3 p-4 pb-3">
        <div>
          <CardTitle className="text-base font-extrabold text-slate-950 dark:text-white">RBI Assessment List</CardTitle>
          <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing {records.length} of {totalCount} filtered assessments from {RBI_ASSESSMENTS_DATA.totalPortfolioAssessments} portfolio assessments
          </p>
        </div>
        <Link href={APP_ROUTES.rbi.riskAnalytics} className="hidden items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-blue-700 sm:inline-flex">
          RBI Analytics
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="min-w-[1420px] border-separate border-spacing-0 text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  {visibleColumns.assessmentId ? <SortableHeader activeSortKey={sortKey} className="w-[145px]" label="Assessment ID" sortDirection={sortDirection} sortKey="assessmentId" onSort={onSort} /> : null}
                  {visibleColumns.assetSystem ? <SortableHeader activeSortKey={sortKey} className="w-[240px]" label="Asset / System" sortDirection={sortDirection} sortKey="assetSystem" onSort={onSort} /> : null}
                  {visibleColumns.status ? <SortableHeader activeSortKey={sortKey} className="w-[160px]" label="Status" sortDirection={sortDirection} sortKey="status" onSort={onSort} /> : null}
                  {visibleColumns.assessor ? <TableHeader className="w-[150px]" label="Assessor" /> : null}
                  {visibleColumns.reviewStage ? <TableHeader className="w-[210px]" label="Review Stage" /> : null}
                  {visibleColumns.riskLevel ? <SortableHeader activeSortKey={sortKey} className="w-[130px]" label="Risk Level" sortDirection={sortDirection} sortKey="riskLevel" onSort={onSort} /> : null}
                  {visibleColumns.lastModified ? <SortableHeader activeSortKey={sortKey} className="w-[170px]" label="Last Modified" sortDirection={sortDirection} sortKey="lastModified" onSort={onSort} /> : null}
                  {visibleColumns.approvalStatus ? <SortableHeader activeSortKey={sortKey} className="w-[170px]" label="Approval Status" sortDirection={sortDirection} sortKey="approvalStatus" onSort={onSort} /> : null}
                  {visibleColumns.nextAction ? <TableHeader className="w-[240px]" label="Next Action" /> : null}
                  {visibleColumns.actions ? <TableHeader className="w-[92px] text-right" label="Actions" /> : null}
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <AssessmentRow
                    key={record.id}
                    open={openActionId === record.id}
                    record={record}
                    visibleColumns={visibleColumns}
                    onOpenActionChange={onOpenActionChange}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {records.length === 0 ? (
            <div className="grid place-items-center bg-white px-4 py-16 text-center dark:bg-slate-900">
              <div>
                <FileSearch className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
                <p className="mt-3 text-sm font-extrabold text-slate-800 dark:text-slate-100">No assessments match the current filters.</p>
                <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Adjust search, chips, saved view, or dropdown filters.</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            Rows per page
            <select
              className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-extrabold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              value={rowsPerPage}
              onChange={(event) => onRowsPerPageChange(Number(event.target.value))}
            >
              {[6, 8, 12, 18].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Previous
            </button>
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">
              Page {page} of {pageCount}
            </span>
            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() => onPageChange(page + 1)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Next
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AssessmentRow({
  open,
  record,
  visibleColumns,
  onOpenActionChange,
}: {
  open: boolean;
  record: RbiAssessmentRecord;
  visibleColumns: Record<AssessmentColumnKey, boolean>;
  onOpenActionChange: (id: string | null) => void;
}) {
  return (
    <tr className={cn("group border-t border-slate-200 align-top transition hover:bg-blue-50/50 dark:border-slate-800 dark:hover:bg-blue-500/10", record.overdue && "bg-red-50/50 dark:bg-red-500/10")}>
      {visibleColumns.assessmentId ? (
        <td className={cn("border-t border-slate-200 px-3 py-3 font-black text-slate-950 dark:border-slate-800 dark:text-white", record.overdue && "border-l-4 border-l-red-500")}>
          {record.assessmentId}
        </td>
      ) : null}
      {visibleColumns.assetSystem ? (
        <td className="border-t border-slate-200 px-3 py-3 dark:border-slate-800">
          <Link href={record.linkedRoutes.assetProfile} className="font-extrabold text-slate-950 transition hover:text-blue-700 dark:text-white dark:hover:text-blue-200">
            {record.assetSystem}
          </Link>
          <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{record.assetClass} - {record.standardMapping}</p>
        </td>
      ) : null}
      {visibleColumns.status ? (
        <td className="border-t border-slate-200 px-3 py-3 dark:border-slate-800">
          <StatusBadge status={record.status} />
        </td>
      ) : null}
      {visibleColumns.assessor ? <TextCell value={record.assessor} /> : null}
      {visibleColumns.reviewStage ? <TextCell value={record.reviewStage} /> : null}
      {visibleColumns.riskLevel ? (
        <td className="border-t border-slate-200 px-3 py-3 dark:border-slate-800">
          <RiskBadge risk={record.riskLevel} />
        </td>
      ) : null}
      {visibleColumns.lastModified ? <TextCell value={record.lastModifiedLabel} nowrap /> : null}
      {visibleColumns.approvalStatus ? (
        <td className="border-t border-slate-200 px-3 py-3 dark:border-slate-800">
          <ApprovalBadge status={record.approvalStatus} />
        </td>
      ) : null}
      {visibleColumns.nextAction ? (
        <td className="border-t border-slate-200 px-3 py-3 dark:border-slate-800">
          <p className="line-clamp-2 text-sm font-bold leading-5 text-slate-700 dark:text-slate-200">{record.nextAction}</p>
          <p className="mt-1 line-clamp-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{record.primaryDamageMechanism}</p>
        </td>
      ) : null}
      {visibleColumns.actions ? (
        <td className="relative border-t border-slate-200 px-3 py-3 text-right dark:border-slate-800">
          <button
            type="button"
            onClick={() => onOpenActionChange(open ? null : record.id)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            aria-label={`Open actions for ${record.assessmentId}`}
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>
          {open ? <AssessmentActionMenu record={record} /> : null}
        </td>
      ) : null}
    </tr>
  );
}

function AssessmentActionMenu({ record }: { record: RbiAssessmentRecord }) {
  return (
    <div className="absolute right-3 top-12 z-20 w-56 rounded-2xl border border-slate-200 bg-white p-2 text-left shadow-xl dark:border-slate-800 dark:bg-slate-950">
      <ActionLink href={record.linkedRoutes.assessmentDetail} label="View assessment" />
      <ActionLink href={record.linkedRoutes.assetProfile} label="Open asset profile" />
      <ActionLink href={record.linkedRoutes.evidence} label="Review evidence" />
      <ActionLink href={record.linkedRoutes.assignReviewer} label="Assign reviewer" />
      <ActionLink href={record.linkedRoutes.revalidation} label="Mark for revalidation" />
    </div>
  );
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="block rounded-xl px-3 py-2 text-xs font-extrabold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-blue-500/10 dark:hover:text-blue-200">
      {label}
    </Link>
  );
}

function AssessmentSidePanel() {
  return (
    <aside className="space-y-4">
      <WorkflowSummaryPanel />
      <ReviewBacklogPanel />
      <HighRiskAttentionPanel />
    </aside>
  );
}

function WorkflowSummaryPanel() {
  return (
    <SidePanel title="Assessment Workflow Summary" icon={ListChecks}>
      <div className="space-y-2">
        {RBI_ASSESSMENTS_DATA.workflowSummary.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.label}</span>
            <span className={cn("text-lg font-black", getToneTextClass(item.tone))}>{item.count}</span>
          </div>
        ))}
      </div>
    </SidePanel>
  );
}

function ReviewBacklogPanel() {
  const max = Math.max(...RBI_ASSESSMENTS_DATA.reviewBacklog.map((item) => item.count), 1);

  return (
    <SidePanel title="Review Backlog by Stage" icon={Clock3}>
      <div className="space-y-3">
        {RBI_ASSESSMENTS_DATA.reviewBacklog.map((item) => (
          <div key={item.stage}>
            <div className="mb-1 flex items-center justify-between gap-2 text-xs font-bold">
              <span className="truncate text-slate-600 dark:text-slate-300">{item.stage}</span>
              <span className="font-black text-slate-950 dark:text-white">{item.count}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" style={{ width: `${(item.count / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </SidePanel>
  );
}

function HighRiskAttentionPanel() {
  return (
    <SidePanel
      title="High-Risk / Overdue Attention"
      icon={ShieldAlert}
      action={
        <Link href={APP_ROUTES.rbi.riskRegister} className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
          Open High-Risk Items
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      }
    >
      <div className="space-y-2">
        {RBI_ASSESSMENTS_DATA.highRiskAttention.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="block rounded-2xl border border-red-100 bg-red-50/70 p-3 transition hover:border-red-200 hover:bg-red-50 dark:border-red-500/20 dark:bg-red-500/10 dark:hover:bg-red-500/15"
          >
            <p className="font-black text-slate-950 dark:text-white">{item.assetSystem}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-red-700 dark:text-red-200">{item.issue}</p>
          </Link>
        ))}
      </div>
    </SidePanel>
  );
}

function SidePanel({
  action,
  children,
  icon: Icon,
  title,
}: {
  action?: ReactNode;
  children: ReactNode;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex-row items-start justify-between gap-3 p-4 pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
          <CardTitle className="text-base font-extrabold text-slate-950 dark:text-white">{title}</CardTitle>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className="p-4 pt-0">{children}</CardContent>
    </Card>
  );
}

function TableHeader({ className, label }: { className?: string; label: string }) {
  return <th className={cn("border-b border-slate-200 px-3 py-3 dark:border-slate-800", className)}>{label}</th>;
}

function SortableHeader({
  activeSortKey,
  className,
  label,
  sortDirection,
  sortKey,
  onSort,
}: {
  activeSortKey: AssessmentSortKey;
  className?: string;
  label: string;
  sortDirection: SortDirection;
  sortKey: AssessmentSortKey;
  onSort: (sortKey: AssessmentSortKey) => void;
}) {
  const active = activeSortKey === sortKey;

  return (
    <th className={cn("border-b border-slate-200 px-3 py-3 dark:border-slate-800", className)}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn("inline-flex items-center gap-1 rounded-lg px-1 py-0.5 transition hover:bg-white hover:text-blue-700 dark:hover:bg-slate-900 dark:hover:text-blue-200", active && "text-blue-700 dark:text-blue-200")}
      >
        {label}
        <span aria-hidden="true">{active ? (sortDirection === "asc" ? "Asc" : "Desc") : "Sort"}</span>
      </button>
    </th>
  );
}

function TextCell({ nowrap, value }: { nowrap?: boolean; value: string }) {
  return (
    <td className={cn("border-t border-slate-200 px-3 py-3 text-sm font-bold text-slate-700 dark:border-slate-800 dark:text-slate-200", nowrap && "whitespace-nowrap")}>
      {value}
    </td>
  );
}

function StatusBadge({ status }: { status: RbiAssessmentRecord["status"] }) {
  const className =
    status === "Approved"
      ? TONE_STYLES.emerald
      : status === "In Review"
        ? TONE_STYLES.blue
        : status === "Draft"
          ? TONE_STYLES.slate
          : status === "Requires Revalidation"
            ? TONE_STYLES.violet
            : status === "Overdue Assessment"
              ? TONE_STYLES.red
              : TONE_STYLES.orange;

  return <Badge className={className} label={status} />;
}

function RiskBadge({ risk }: { risk: RbiAssessmentRecord["riskLevel"] }) {
  const className =
    risk === "High"
      ? TONE_STYLES.red
      : risk === "Medium-High"
        ? TONE_STYLES.orange
        : risk === "Medium"
          ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
          : TONE_STYLES.emerald;

  return <Badge className={className} label={risk} />;
}

function ApprovalBadge({ status }: { status: RbiAssessmentRecord["approvalStatus"] }) {
  const className =
    status === "Approved"
      ? TONE_STYLES.emerald
      : status === "Not Submitted"
        ? TONE_STYLES.slate
        : status === "Awaiting Evidence"
          ? TONE_STYLES.cyan
          : status === "Rejected for Revision"
            ? TONE_STYLES.red
            : TONE_STYLES.blue;

  return <Badge className={className} label={status} minWidth="min-w-[132px]" />;
}

function Badge({
  className,
  label,
  minWidth = "min-w-[112px]",
}: {
  className: string;
  label: string;
  minWidth?: string;
}) {
  return (
    <span className={cn("inline-flex h-7 items-center justify-center whitespace-nowrap rounded-full border px-3 text-[11px] font-extrabold", minWidth, className)}>
      {label}
    </span>
  );
}

function getToneTextClass(tone: "slate" | "blue" | "orange" | "emerald" | "violet" | "red") {
  switch (tone) {
    case "blue":
      return "text-blue-600 dark:text-blue-300";
    case "orange":
      return "text-orange-600 dark:text-orange-300";
    case "emerald":
      return "text-emerald-600 dark:text-emerald-300";
    case "violet":
      return "text-violet-600 dark:text-violet-300";
    case "red":
      return "text-red-600 dark:text-red-300";
    default:
      return "text-slate-700 dark:text-slate-200";
  }
}
