"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  Filter,
  Layout,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_ROUTES } from "@/lib/app-routes";
import { cn } from "@/lib/utils";

import { RISK_REGISTER_DATA } from "../services/risk-register-data";
import {
  RISK_REGISTER_COLUMN_LABELS,
  exportRiskRegisterCsv,
} from "../services/risk-register-export";
import {
  DEFAULT_RISK_REGISTER_FILTERS,
  DEFAULT_VISIBLE_COLUMNS,
  clearFilterChip,
  filterRiskRegisterRecords,
  getActiveFilterChips,
  getSavedViewFilters,
  sortRiskRegisterRecords,
} from "../services/risk-register-selectors";
import type {
  InspectionEffectiveness,
  RiskRecordRiskCategory,
  RiskRegisterAssetClass,
  RiskRegisterColumnKey,
  RiskRegisterDamageMechanism,
  RiskRegisterFilters,
  RiskRegisterRecord,
  RiskRegisterRiskLevel,
  RiskRegisterSavedView,
  RiskRegisterSortKey,
  RiskRegisterSystem,
  SortDirection,
} from "../services/risk-register-types";

const RISK_LEVEL_OPTIONS: Array<{ value: RiskRegisterRiskLevel; label: string }> = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium-high", label: "Medium-High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const ASSET_CLASS_OPTIONS: Array<{ value: RiskRegisterAssetClass; label: string }> = [
  { value: "all", label: "All" },
  { value: "pressure-vessel", label: "Pressure Vessel" },
  { value: "piping-flowline", label: "Piping Circuit / Flowline" },
  { value: "tank", label: "Tank" },
  { value: "compressor-rotating", label: "Compressor / Rotating Equipment" },
  { value: "pressure-safety-device", label: "Pressure Safety Device" },
  { value: "pump", label: "Pump" },
  { value: "heat-exchanger", label: "Heat Exchanger" },
  { value: "shutdown-valve", label: "Shutdown Valve" },
  { value: "metering-skid", label: "Metering Skid" },
  { value: "electrical-utility", label: "Electrical / Utility" },
];

const SYSTEM_OPTIONS: Array<{ value: RiskRegisterSystem; label: string }> = [
  { value: "all", label: "All" },
  { value: "separation-crude-stabilization", label: "Separation / Crude Stabilization" },
  { value: "crude-export", label: "Crude Export" },
  { value: "storage", label: "Storage" },
  { value: "gas-compression", label: "Gas Compression" },
  { value: "relief-protection", label: "Relief & Protection" },
  { value: "produced-water", label: "Produced Water" },
  { value: "crude-transfer", label: "Crude Transfer" },
  { value: "associated-gas", label: "Associated Gas" },
  { value: "esd-isolation", label: "ESD / Isolation" },
  { value: "gas-dehydration", label: "Gas Dehydration" },
];

const DAMAGE_OPTIONS: Array<{ value: RiskRegisterDamageMechanism; label: string }> = [
  { value: "all", label: "All" },
  { value: "internal-co2-corrosion", label: "Internal CO2 corrosion" },
  { value: "under-deposit-corrosion", label: "Under-deposit corrosion" },
  { value: "erosion-corrosion", label: "Erosion-corrosion" },
  { value: "external-atmospheric-corrosion", label: "External atmospheric corrosion" },
  { value: "localized-pitting", label: "Localized pitting" },
  { value: "vibration-fatigue", label: "Vibration fatigue" },
  { value: "documentation-calibration-control", label: "Documentation/calibration control issue" },
  { value: "mic", label: "MIC" },
  { value: "mechanical-seal-leakage", label: "Mechanical seal leakage" },
  { value: "insulation-degradation", label: "Insulation degradation" },
];

const SAVED_VIEW_OPTIONS: Array<{ value: RiskRegisterSavedView; label: string }> = [
  { value: "all", label: "All Risk Records" },
  { value: "high-risk-focus", label: "High Risk Focus" },
  { value: "due-within-90", label: "Due Within 90 Days" },
  { value: "low-inspection-effectiveness", label: "Low Inspection Effectiveness" },
  { value: "psv-calibration-issues", label: "PSV Calibration Issues" },
];

const OPTIONAL_COLUMNS: RiskRegisterColumnKey[] = [
  "system",
  "equipmentClass",
  "riskDriver",
  "damageMechanism",
  "mitigationRecommendation",
];

const KPI_ICON_MAP: Record<string, LucideIcon> = {
  "high-risk-assets": ShieldAlert,
  "medium-high-risk-assets": BarChart3,
  "open-recommendations": CheckCircle2,
  "active-anomalies": AlertTriangle,
};

const KPI_TONE_STYLES = {
  red: "border-red-100 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200",
  orange: "border-orange-100 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200",
  cyan: "border-cyan-100 bg-cyan-50 text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200",
  violet: "border-violet-100 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200",
} as const;

export function RiskRegisterPageContent() {
  const [filters, setFilters] = useState<RiskRegisterFilters>(DEFAULT_RISK_REGISTER_FILTERS);
  const [sortKey, setSortKey] = useState<RiskRegisterSortKey>("priority");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE_COLUMNS);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RiskRegisterRecord | null>(null);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const filteredRecords = useMemo(
    () => filterRiskRegisterRecords(RISK_REGISTER_DATA.records, filters),
    [filters],
  );
  const visibleRecords = useMemo(
    () => sortRiskRegisterRecords(filteredRecords, sortKey, sortDirection),
    [filteredRecords, sortDirection, sortKey],
  );
  const activeChips = useMemo(() => getActiveFilterChips(filters), [filters]);

  function updateFilter<T extends keyof RiskRegisterFilters>(key: T, value: RiskRegisterFilters[T]) {
    setFilters((current) => ({
      ...current,
      [key]: value,
      savedView: key === "savedView" ? (value as RiskRegisterSavedView) : "all",
    }));
  }

  function handleSavedViewChange(savedView: RiskRegisterSavedView) {
    setFilters(getSavedViewFilters(savedView));
    setSortKey(savedView === "all" ? "priority" : "nextInspectionDue");
    setSortDirection("asc");
  }

  function handleClearAll() {
    setFilters(DEFAULT_RISK_REGISTER_FILTERS);
    setSortKey("priority");
    setSortDirection("asc");
  }

  function handleSort(nextSortKey: RiskRegisterSortKey) {
    setSortKey((currentSortKey) => {
      if (currentSortKey === nextSortKey) {
        setSortDirection((currentDirection) => (currentDirection === "asc" ? "desc" : "asc"));
        return currentSortKey;
      }

      setSortDirection(nextSortKey === "assetTag" ? "asc" : "desc");
      return nextSortKey;
    });
  }

  function handleExportCsv() {
    exportRiskRegisterCsv(visibleRecords, visibleColumns);
    setExportMessage(`Exported ${visibleRecords.length} visible records as CSV.`);
  }

  return (
    <div className="space-y-3 text-slate-950 dark:text-slate-100">
      <header className="min-w-0">
        <nav className="flex items-center gap-2 text-xs font-extrabold text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
          <Link href={APP_ROUTES.dashboard} className="transition hover:text-blue-700 dark:hover:text-blue-200">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/integrity-rbi" className="transition hover:text-blue-700 dark:hover:text-blue-200">
            Integrity / RBI
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-700 dark:text-slate-200">Risk Register</span>
        </nav>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
          Risk Register
        </h1>
      </header>

      <RiskKpiCards />
      <SummaryMetricStrip />
      <FrameworkChips />

      <RiskRegisterFilters
        activeChips={activeChips}
        columnsOpen={columnsOpen}
        exportMessage={exportMessage}
        filters={filters}
        visibleColumns={visibleColumns}
        visibleCount={visibleRecords.length}
        onClearAll={handleClearAll}
        onClearChip={(key) => setFilters((current) => clearFilterChip(current, key))}
        onColumnsOpenChange={setColumnsOpen}
        onExportCsv={handleExportCsv}
        onFilterChange={updateFilter}
        onSavedViewChange={handleSavedViewChange}
        onVisibleColumnsChange={setVisibleColumns}
      />

      <RiskRegisterTable
        records={visibleRecords}
        sortDirection={sortDirection}
        sortKey={sortKey}
        totalPortfolioRecords={RISK_REGISTER_DATA.totalPortfolioRecords}
        totalRenderedRecords={RISK_REGISTER_DATA.records.length}
        visibleColumns={visibleColumns}
        onSelectRecord={setSelectedRecord}
        onSort={handleSort}
      />

      <RiskRecordDrawer record={selectedRecord} onClose={() => setSelectedRecord(null)} />
    </div>
  );
}

function RiskKpiCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {RISK_REGISTER_DATA.kpis.map((kpi) => {
        const Icon = KPI_ICON_MAP[kpi.id] ?? BarChart3;

        return (
          <Card key={kpi.id} className="rounded-2xl">
            <CardContent className="flex min-h-[84px] items-center gap-2.5 p-3">
              <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl border", KPI_TONE_STYLES[kpi.tone])}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {kpi.label}
                </p>
                <p className="mt-0.5 text-2xl font-black tracking-tight text-slate-950 dark:text-white">{kpi.value}</p>
                <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">SPM-01 portfolio register</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function SummaryMetricStrip() {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {RISK_REGISTER_DATA.summaryMetrics.map((metric) => (
        <div
          key={metric.id}
          className={cn(
            "flex items-center justify-between rounded-2xl border px-3 py-2 text-sm font-bold",
            metric.tone === "red" && "border-red-100 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200",
            metric.tone === "orange" && "border-orange-100 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200",
            metric.tone === "blue" && "border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200",
            metric.tone === "emerald" && "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200",
          )}
        >
          <span className="truncate">{metric.label}</span>
          <span className="shrink-0 text-lg font-black">{metric.value}</span>
        </div>
      ))}
    </div>
  );
}

function FrameworkChips() {
  return (
    <div className="flex flex-wrap gap-2">
      {RISK_REGISTER_DATA.frameworkLabels.map((label) => (
        <span
          key={label}
          className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function RiskRegisterFilters({
  activeChips,
  columnsOpen,
  exportMessage,
  filters,
  visibleColumns,
  visibleCount,
  onClearAll,
  onClearChip,
  onColumnsOpenChange,
  onExportCsv,
  onFilterChange,
  onSavedViewChange,
  onVisibleColumnsChange,
}: {
  activeChips: Array<{ key: keyof RiskRegisterFilters; label: string }>;
  columnsOpen: boolean;
  exportMessage: string | null;
  filters: RiskRegisterFilters;
  visibleColumns: Record<RiskRegisterColumnKey, boolean>;
  visibleCount: number;
  onClearAll: () => void;
  onClearChip: (key: keyof RiskRegisterFilters) => void;
  onColumnsOpenChange: (open: boolean) => void;
  onExportCsv: () => void;
  onFilterChange: <T extends keyof RiskRegisterFilters>(key: T, value: RiskRegisterFilters[T]) => void;
  onSavedViewChange: (savedView: RiskRegisterSavedView) => void;
  onVisibleColumnsChange: (columns: Record<RiskRegisterColumnKey, boolean>) => void;
}) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="space-y-2.5 p-3">
        <div className="grid gap-2.5 xl:grid-cols-12">
          <label className="relative xl:col-span-3">
            <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Search
            </span>
            <Search className="pointer-events-none absolute bottom-2.5 left-3 h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs font-bold text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-blue-500/60 dark:focus:ring-blue-500/20"
              placeholder="Search asset, system, risk driver, mechanism..."
              value={filters.search}
              onChange={(event) => onFilterChange("search", event.target.value)}
            />
          </label>
          <FilterSelect
            className="xl:col-span-2"
            label="Risk Level"
            options={RISK_LEVEL_OPTIONS}
            value={filters.riskLevel}
            onChange={(value) => onFilterChange("riskLevel", value as RiskRegisterRiskLevel)}
          />
          <FilterSelect
            className="xl:col-span-2"
            label="Asset Class"
            options={ASSET_CLASS_OPTIONS}
            value={filters.assetClass}
            onChange={(value) => onFilterChange("assetClass", value as RiskRegisterAssetClass)}
          />
          <FilterSelect
            className="xl:col-span-2"
            label="System"
            options={SYSTEM_OPTIONS}
            value={filters.system}
            onChange={(value) => onFilterChange("system", value as RiskRegisterSystem)}
          />
          <FilterSelect
            className="xl:col-span-3"
            label="Damage Mechanism"
            options={DAMAGE_OPTIONS}
            value={filters.damageMechanism}
            onChange={(value) => onFilterChange("damageMechanism", value as RiskRegisterDamageMechanism)}
          />
        </div>

        <div className="flex flex-col gap-2.5 border-t border-slate-200 pt-2.5 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-extrabold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
              <Filter className="h-3.5 w-3.5" aria-hidden="true" />
              {visibleCount} visible records
            </span>
            {activeChips.map((chip) => (
              <button
                key={`${chip.key}-${chip.label}`}
                type="button"
                onClick={() => onClearChip(chip.key)}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-blue-500/30 dark:hover:text-blue-200"
              >
                {chip.label}
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            ))}
            {activeChips.length > 0 ? (
              <button type="button" onClick={onClearAll} className="text-xs font-extrabold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
                Clear all
              </button>
            ) : null}
            {exportMessage ? (
              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                {exportMessage}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <label className="relative">
              <Eye className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <select
                className="h-9 rounded-xl border border-slate-200 bg-white pl-8 pr-8 text-xs font-extrabold text-slate-700 shadow-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-blue-500/60 dark:focus:ring-blue-500/20"
                value={filters.savedView}
                onChange={(event) => onSavedViewChange(event.target.value as RiskRegisterSavedView)}
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
                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-extrabold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              >
                <Layout className="h-4 w-4" aria-hidden="true" />
                Columns
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              {columnsOpen ? (
                <div className="absolute right-0 z-20 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-950">
                  <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Optional columns
                  </p>
                  <div className="space-y-2">
                    {OPTIONAL_COLUMNS.map((column) => (
                      <label key={column} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900">
                        <span>{RISK_REGISTER_COLUMN_LABELS[column]}</span>
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

            <button
              type="button"
              onClick={onExportCsv}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-xs font-extrabold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export CSV
            </button>
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
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={cn("min-w-0", className)}>
      <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <select
        className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-blue-500/60 dark:focus:ring-blue-500/20"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function RiskRegisterTable({
  records,
  sortDirection,
  sortKey,
  totalPortfolioRecords,
  totalRenderedRecords,
  visibleColumns,
  onSelectRecord,
  onSort,
}: {
  records: RiskRegisterRecord[];
  sortDirection: SortDirection;
  sortKey: RiskRegisterSortKey;
  totalPortfolioRecords: number;
  totalRenderedRecords: number;
  visibleColumns: Record<RiskRegisterColumnKey, boolean>;
  onSelectRecord: (record: RiskRegisterRecord) => void;
  onSort: (sortKey: RiskRegisterSortKey) => void;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex-row items-center justify-between gap-3 px-3 py-2.5">
        <div>
          <CardTitle className="text-sm font-black text-slate-950 dark:text-white">Asset-Level RBI Risk Records</CardTitle>
          <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing {records.length} of {totalRenderedRecords} modeled rows from {totalPortfolioRecords} portfolio risk records
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-extrabold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200 sm:flex">
          <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
          Highlighted records require priority review
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-0">
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="max-h-[min(520px,calc(100vh-24rem))] overflow-auto aim-shell-scrollbar">
            <table className="min-w-[1660px] border-separate border-spacing-0 text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  {visibleColumns.assetTag ? (
                    <SortableHeader className="w-[150px]" label="Asset Tag" sortDirection={sortDirection} sortKey="assetTag" activeSortKey={sortKey} onSort={onSort} />
                  ) : null}
                  {visibleColumns.system ? <TableHeader className="w-[220px]" label="System" /> : null}
                  {visibleColumns.equipmentClass ? <TableHeader className="w-[210px]" label="Equipment Class" /> : null}
                  {visibleColumns.pof ? (
                    <SortableHeader className="w-[105px]" label="PoF" sortDirection={sortDirection} sortKey="pof" activeSortKey={sortKey} onSort={onSort} />
                  ) : null}
                  {visibleColumns.cof ? (
                    <SortableHeader className="w-[105px]" label="CoF" sortDirection={sortDirection} sortKey="cof" activeSortKey={sortKey} onSort={onSort} />
                  ) : null}
                  {visibleColumns.riskCategory ? (
                    <SortableHeader className="w-[145px]" label="Risk Category" sortDirection={sortDirection} sortKey="riskCategory" activeSortKey={sortKey} onSort={onSort} />
                  ) : null}
                  {visibleColumns.riskDriver ? <TableHeader className="w-[270px]" label="Risk Driver" /> : null}
                  {visibleColumns.damageMechanism ? <TableHeader className="w-[250px]" label="Damage Mechanism" /> : null}
                  {visibleColumns.inspectionEffectiveness ? <TableHeader className="w-[175px]" label="Inspection Effectiveness" /> : null}
                  {visibleColumns.nextInspectionDue ? (
                    <SortableHeader className="w-[165px]" label="Next Inspection Due" sortDirection={sortDirection} sortKey="nextInspectionDue" activeSortKey={sortKey} onSort={onSort} />
                  ) : null}
                  {visibleColumns.mitigationRecommendation ? <TableHeader className="w-[320px]" label="Mitigation Recommendation" /> : null}
                  {visibleColumns.actions ? <TableHeader className="w-[130px] text-right" label="Action" /> : null}
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr
                    key={record.id}
                    onClick={() => onSelectRecord(record)}
                    className={cn(
                      "group cursor-pointer border-t border-slate-200 align-top transition hover:bg-blue-50/50 dark:border-slate-800 dark:hover:bg-blue-500/10",
                      record.priorityHighlight && "bg-red-50/60 dark:bg-red-500/10",
                    )}
                  >
                    {visibleColumns.assetTag ? (
                      <td className={cn("border-t border-slate-200 px-3 py-2 dark:border-slate-800", record.priorityHighlight && "border-l-4 border-l-red-500")}>
                        <div className="flex items-center gap-2">
                          {record.priorityHighlight ? (
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500 shadow-sm shadow-red-500/30" />
                          ) : null}
                          <span className="font-black text-slate-950 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-200">
                            {record.assetTag}
                          </span>
                        </div>
                      </td>
                    ) : null}
                    {visibleColumns.system ? <TextCell value={record.system} /> : null}
                    {visibleColumns.equipmentClass ? <TextCell value={record.equipmentClass} /> : null}
                    {visibleColumns.pof ? <ScoreCell value={record.pof} /> : null}
                    {visibleColumns.cof ? <ScoreCell value={record.cof} /> : null}
                    {visibleColumns.riskCategory ? (
                      <td className="border-t border-slate-200 px-3 py-2 dark:border-slate-800">
                        <RiskBadge risk={record.riskCategory} />
                      </td>
                    ) : null}
                    {visibleColumns.riskDriver ? <LongTextCell value={record.riskDriver} /> : null}
                    {visibleColumns.damageMechanism ? <LongTextCell value={record.damageMechanism} /> : null}
                    {visibleColumns.inspectionEffectiveness ? (
                      <td className="border-t border-slate-200 px-3 py-2 dark:border-slate-800">
                        <InspectionEffectivenessBadge effectiveness={record.inspectionEffectiveness} />
                      </td>
                    ) : null}
                    {visibleColumns.nextInspectionDue ? (
                      <td className="whitespace-nowrap border-t border-slate-200 px-3 py-2 text-sm font-extrabold text-slate-700 dark:border-slate-800 dark:text-slate-200">
                        {record.nextInspectionDueLabel}
                      </td>
                    ) : null}
                    {visibleColumns.mitigationRecommendation ? <LongTextCell value={record.mitigationRecommendation} /> : null}
                    {visibleColumns.actions ? (
                      <td className="border-t border-slate-200 px-3 py-2 text-right dark:border-slate-800">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onSelectRecord(record);
                          }}
                          className="inline-flex items-center justify-center rounded-xl border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700 transition hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:bg-blue-500/20"
                        >
                          View details
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {records.length === 0 ? (
            <div className="grid place-items-center bg-white px-4 py-16 text-center dark:bg-slate-900">
              <div>
                <SlidersHorizontal className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
                <p className="mt-3 text-sm font-extrabold text-slate-800 dark:text-slate-100">No risk records match the current filters.</p>
                <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Adjust search, risk level, asset class, system, or damage mechanism.</p>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function TableHeader({ className, label }: { className?: string; label: string }) {
  return (
    <th className={cn("border-b border-slate-200 px-3 py-2 dark:border-slate-800", className)}>
      {label}
    </th>
  );
}

function SortableHeader({
  activeSortKey,
  className,
  label,
  sortDirection,
  sortKey,
  onSort,
}: {
  activeSortKey: RiskRegisterSortKey;
  className?: string;
  label: string;
  sortDirection: SortDirection;
  sortKey: RiskRegisterSortKey;
  onSort: (sortKey: RiskRegisterSortKey) => void;
}) {
  const active = activeSortKey === sortKey;

  return (
    <th className={cn("border-b border-slate-200 px-3 py-2 dark:border-slate-800", className)}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1 rounded-lg px-1 py-0.5 transition hover:bg-white hover:text-blue-700 dark:hover:bg-slate-900 dark:hover:text-blue-200",
          active && "text-blue-700 dark:text-blue-200",
        )}
      >
        {label}
        <span aria-hidden="true">{active ? (sortDirection === "asc" ? "Asc" : "Desc") : "Sort"}</span>
      </button>
    </th>
  );
}

function TextCell({ value }: { value: string }) {
  return (
    <td className="border-t border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 dark:border-slate-800 dark:text-slate-200">
      <span className="line-clamp-2">{value}</span>
    </td>
  );
}

function LongTextCell({ value }: { value: string }) {
  return (
    <td className="border-t border-slate-200 px-3 py-2 text-sm font-semibold leading-5 text-slate-600 dark:border-slate-800 dark:text-slate-300">
      <span className="line-clamp-2">{value}</span>
    </td>
  );
}

function ScoreCell({ value }: { value: number }) {
  return (
    <td className="border-t border-slate-200 px-3 py-2 dark:border-slate-800">
      <div className="flex min-w-[72px] items-center gap-2">
        <span className="w-8 text-sm font-black text-slate-950 dark:text-white">{value.toFixed(1)}</span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={cn(
              "h-full rounded-full",
              value >= 4 ? "bg-red-500" : value >= 3.4 ? "bg-orange-500" : value >= 2.7 ? "bg-amber-400" : "bg-emerald-500",
            )}
            style={{ width: `${(value / 5) * 100}%` }}
          />
        </div>
      </div>
    </td>
  );
}

function RiskBadge({ risk }: { risk: RiskRecordRiskCategory }) {
  const label = risk === "medium-high" ? "Medium-High" : risk.charAt(0).toUpperCase() + risk.slice(1);
  const className =
    risk === "high"
      ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
      : risk === "medium-high"
        ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-200"
        : risk === "medium"
          ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
          : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200";

  return (
    <span className={cn("inline-flex h-7 min-w-[104px] items-center justify-center whitespace-nowrap rounded-full border px-3 text-[11px] font-extrabold", className)}>
      {label}
    </span>
  );
}

function InspectionEffectivenessBadge({ effectiveness }: { effectiveness: InspectionEffectiveness }) {
  const label = effectiveness === "medium-high" ? "Medium-High" : effectiveness.charAt(0).toUpperCase() + effectiveness.slice(1);
  const className =
    effectiveness === "low"
      ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
      : effectiveness === "medium"
        ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
        : effectiveness === "medium-high"
          ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200"
          : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200";

  return (
    <span className={cn("inline-flex h-7 min-w-[108px] items-center justify-center whitespace-nowrap rounded-full border px-3 text-[11px] font-extrabold", className)}>
      {label}
    </span>
  );
}

function RiskRecordDrawer({ record, onClose }: { record: RiskRegisterRecord | null; onClose: () => void }) {
  if (!record) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 top-[var(--app-header-height)] z-40 flex justify-end bg-slate-950/35 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="risk-record-drawer-title">
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close risk record detail" />
      <aside className="relative flex h-full w-full max-w-[540px] flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-wide text-blue-700 dark:text-blue-300">Risk Register Detail</p>
            <h2 id="risk-record-drawer-title" className="mt-1 text-xl font-black text-slate-950 dark:text-white">
              {record.assetTag}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{record.system} - {record.equipmentClass}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white" aria-label="Close details">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 aim-shell-scrollbar">
          <div className="flex flex-wrap gap-2">
            <RiskBadge risk={record.riskCategory} />
            <InspectionEffectivenessBadge effectiveness={record.inspectionEffectiveness} />
            {record.priorityHighlight ? (
              <span className="inline-flex h-7 items-center rounded-full border border-red-200 bg-red-50 px-3 text-[11px] font-extrabold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                Priority Review
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DrawerMetric label="PoF" value={record.pof.toFixed(1)} />
            <DrawerMetric label="CoF" value={record.cof.toFixed(1)} />
            <DrawerMetric label="Next Inspection Due" value={record.nextInspectionDueLabel} />
            <DrawerMetric label="Open Recommendations" value={String(record.openRecommendationCount)} />
          </div>

          <DetailBlock
            rows={[
              ["Asset tag", record.assetTag],
              ["System", record.system],
              ["Equipment class", record.equipmentClass],
              ["Risk category", record.riskCategory === "medium-high" ? "Medium-High" : record.riskCategory],
              ["Risk driver", record.riskDriver],
              ["Damage mechanism", record.damageMechanism],
              ["Inspection effectiveness", record.inspectionEffectiveness],
              ["Next inspection due", record.nextInspectionDueLabel],
              ["Mitigation recommendation", record.mitigationRecommendation],
            ]}
          />

          <div className="grid gap-2">
            <DrawerLink href={record.linkedRoutes.assetDetail} label="Asset Detail" />
            <DrawerLink href={record.linkedRoutes.inspectionPlanning} label="Inspection Planning" />
            <DrawerLink href={record.linkedRoutes.anomalies} label="Anomalies" />
            <DrawerLink href={record.linkedRoutes.documentsEvidence} label="Documents / Evidence" />
            <DrawerLink href={record.linkedRoutes.riskAnalytics} label="RBI Analytics" />
            <DrawerLink href={record.linkedRoutes.riskMatrix} label="Risk Matrix" />
            <DrawerLink href={record.linkedRoutes.recommendation} label="Open Recommendation" />
          </div>
        </div>
      </aside>
    </div>
  );
}

function DrawerMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function DetailBlock({ rows }: { rows: Array<[string, string]> }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[160px_minmax(0,1fr)] border-t border-slate-200 first:border-t-0 dark:border-slate-800">
          <div className="bg-slate-50 px-3 py-2 text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            {label}
          </div>
          <div className="min-w-0 px-3 py-2 text-sm font-bold text-slate-800 dark:text-slate-100">{value}</div>
        </div>
      ))}
    </div>
  );
}

function DrawerLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm font-extrabold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-800 dark:text-slate-200 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-200">
      {label}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}
