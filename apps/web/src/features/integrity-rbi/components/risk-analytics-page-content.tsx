"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Download,
  Filter,
  Gauge,
  Layers3,
  LineChart,
  Radar,
  ShieldAlert,
  Target,
  X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_ROUTES } from "@/lib/app-routes";
import { cn } from "@/lib/utils";

import { RISK_ANALYTICS_DATA } from "../services/risk-analytics-data";
import {
  filterCoveragePoints,
  filterRiskAssets,
  getActiveRiskScore,
  getConsequence,
  getDistributionValue,
  getFilteredCountLabel,
  getFilteredParetoItems,
  getPercent,
  getProbability,
  getRiskLevel,
  getRiskLevelForAsset,
  getRiskScore,
  getTopRiskAssetsForMode,
} from "../services/risk-analytics-selectors";
import type {
  AssetClassFilter,
  DamageMechanismFilter,
  DateRangeFilter,
  DistributionItem,
  MitigationScenario,
  RiskAnalyticsFilters,
  RiskAssetPoint,
  RiskCategoryFilter,
  RiskInsight,
  RiskLevel,
  RiskViewMode,
} from "../services/risk-analytics-types";

const DEFAULT_FILTERS: RiskAnalyticsFilters = {
  facilityId: RISK_ANALYTICS_DATA.facility.id,
  assetClass: "all",
  riskCategory: "all",
  damageMechanism: "all",
  dateRange: "current-campaign",
  showComparison: true,
};

const ASSET_CLASS_OPTIONS: Array<{ value: AssetClassFilter; label: string }> = [
  { value: "all", label: "All Asset Classes" },
  { value: "pressure-vessel", label: "Pressure Vessels" },
  { value: "piping-circuit", label: "Piping Circuits" },
  { value: "storage-tank", label: "Storage Tanks" },
  { value: "pressure-safety-device", label: "PRD / PSV / PRV" },
  { value: "rotating-equipment", label: "Rotating Equipment" },
  { value: "heat-exchanger", label: "Heaters / Exchangers" },
  { value: "instrumented-safety", label: "Instrumented Safety" },
];

const RISK_CATEGORY_OPTIONS: Array<{ value: RiskCategoryFilter; label: string }> = [
  { value: "all", label: "All Risk Categories" },
  { value: "extreme", label: "Extreme" },
  { value: "very-high", label: "Very High" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const DAMAGE_OPTIONS: Array<{ value: DamageMechanismFilter; label: string }> = [
  { value: "all", label: "All Damage Mechanisms" },
  { value: "internal-co2-corrosion", label: "Internal CO2 corrosion" },
  { value: "h2s-susceptibility", label: "H2S susceptibility screening" },
  { value: "localized-pitting", label: "Localized pitting" },
  { value: "under-deposit-corrosion", label: "Under-deposit corrosion" },
  { value: "external-atmospheric-corrosion", label: "External atmospheric corrosion" },
  { value: "corrosion-under-insulation", label: "Corrosion under insulation" },
  { value: "mic-produced-water", label: "MIC in produced-water lines" },
  { value: "erosion-corrosion", label: "Erosion-corrosion" },
  { value: "vibration-fatigue", label: "Vibration fatigue" },
  { value: "psv-documentation-mismatch", label: "PSV documentation mismatch" },
];

const DATE_RANGE_OPTIONS: Array<{ value: DateRangeFilter; label: string }> = [
  { value: "last-30", label: "Last 30 Days" },
  { value: "last-90", label: "Last 90 Days" },
  { value: "current-campaign", label: "Current Campaign" },
  { value: "ytd", label: "YTD 2026" },
];

const KPI_ICONS: Record<string, LucideIcon> = {
  "total-assets": Layers3,
  "high-risk-assets": ShieldAlert,
  "overdue-inspections": CalendarDays,
  "open-recommendations": ClipboardCheck,
  "active-anomalies": AlertTriangle,
  "due-within-90": Target,
};

const KPI_TONES = {
  blue: "border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200",
  red: "border-red-100 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200",
  orange: "border-orange-100 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200",
  cyan: "border-cyan-100 bg-cyan-50 text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200",
  violet: "border-violet-100 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200",
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200",
} as const;

const RISK_LEVEL_STYLES: Record<
  RiskLevel,
  {
    label: string;
    cell: string;
    badge: string;
    dot: string;
    marker: string;
  }
> = {
  low: {
    label: "Low",
    cell: "bg-emerald-100 text-emerald-950 dark:bg-emerald-500/20 dark:text-emerald-100",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
    dot: "bg-emerald-500",
    marker: "border-emerald-600 bg-emerald-500 text-white",
  },
  medium: {
    label: "Medium",
    cell: "bg-amber-100 text-amber-950 dark:bg-amber-500/20 dark:text-amber-100",
    badge: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200",
    dot: "bg-amber-400",
    marker: "border-amber-600 bg-amber-400 text-amber-950",
  },
  high: {
    label: "High",
    cell: "bg-orange-200 text-orange-950 dark:bg-orange-500/25 dark:text-orange-100",
    badge: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-200",
    dot: "bg-orange-500",
    marker: "border-orange-700 bg-orange-500 text-white",
  },
  "very-high": {
    label: "Very High",
    cell: "bg-red-300 text-red-950 dark:bg-red-500/30 dark:text-red-100",
    badge: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200",
    dot: "bg-red-500",
    marker: "border-red-700 bg-red-600 text-white",
  },
  extreme: {
    label: "Extreme",
    cell: "bg-red-700 text-white shadow-sm shadow-red-950/20",
    badge: "border-red-300 bg-red-100 text-red-800 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-100",
    dot: "bg-red-700",
    marker: "border-red-950 bg-red-800 text-white",
  },
};

const INSIGHT_TONES: Record<RiskInsight["tone"], string> = {
  red: "border-red-100 bg-red-50 text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-100",
  orange: "border-orange-100 bg-orange-50 text-orange-800 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-100",
  blue: "border-blue-100 bg-blue-50 text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-100",
  cyan: "border-cyan-100 bg-cyan-50 text-cyan-800 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-100",
};

export function RiskAnalyticsPageContent() {
  const data = RISK_ANALYTICS_DATA;
  const [filters, setFilters] = useState<RiskAnalyticsFilters>(DEFAULT_FILTERS);
  const [mode, setMode] = useState<RiskViewMode>("baseline");
  const [selectedAsset, setSelectedAsset] = useState<RiskAssetPoint | null>(null);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const filteredAssets = useMemo(
    () => filterRiskAssets(data.riskAssets, filters, mode),
    [data.riskAssets, filters, mode],
  );
  const filteredCoverage = useMemo(
    () => filterCoveragePoints(data.inspectionCoverage, filters, data.riskAssets, mode),
    [data.inspectionCoverage, data.riskAssets, filters, mode],
  );
  const filteredTopRiskAssets = useMemo(
    () => getTopRiskAssetsForMode(data, mode, filters),
    [data, filters, mode],
  );
  const filteredParetoItems = useMemo(
    () => getFilteredParetoItems(data.damageMechanismPareto, filters),
    [data.damageMechanismPareto, filters],
  );

  function updateFilter<T extends keyof RiskAnalyticsFilters>(key: T, value: RiskAnalyticsFilters[T]) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleResetFilters() {
    setFilters(DEFAULT_FILTERS);
    setMode("baseline");
  }

  function handleExport() {
    setExportMessage("Risk Analytics export is queued for Reports / Evidence Pack workflow integration.");
  }

  return (
    <div className="space-y-3 text-slate-950 dark:text-slate-100">
      <header className="min-w-0">
        <nav className="flex items-center gap-2 text-xs font-extrabold text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
          <Link href={APP_ROUTES.rbi.assessments} className="transition hover:text-blue-700 dark:hover:text-blue-200">
            Integrity / RBI
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-700 dark:text-slate-200">Risk Analytics</span>
        </nav>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
          Risk Analytics
        </h1>
      </header>

      <RiskAnalyticsFiltersBar
        exportMessage={exportMessage}
        filters={filters}
        filteredCount={filteredAssets.length}
        mode={mode}
        totalCount={data.riskAssets.length}
        onExport={handleExport}
        onFilterChange={updateFilter}
        onModeChange={setMode}
        onReset={handleResetFilters}
      />

      <RiskKpiCards />

      <div className="grid gap-3 xl:grid-cols-12">
        <RiskMatrixCard
          assets={filteredAssets}
          className="xl:col-span-8"
          mode={mode}
          showComparison={filters.showComparison}
          onSelectAsset={setSelectedAsset}
        />
        <RiskInsightsCard className="xl:col-span-4" insights={data.riskInsights} />

        <RiskDistributionCard
          className="xl:col-span-3"
          icon={Gauge}
          items={data.pofDistribution}
          mode={mode}
          title="Probability of Failure Distribution"
        />
        <RiskDistributionCard
          className="xl:col-span-3"
          icon={Target}
          items={data.cofDistribution}
          mode={mode}
          title="Consequence of Failure Distribution"
        />
        <DamageMechanismParetoCard className="xl:col-span-6" items={filteredParetoItems} />

        <RiskTrendCard className="xl:col-span-4" mode={mode} showComparison={filters.showComparison} />
        <InspectionCoverageRiskCard
          className="xl:col-span-4"
          mode={mode}
          points={filteredCoverage}
          onSelectAsset={(assetId) => {
            const asset = data.riskAssets.find((candidate) => candidate.assetId === assetId);
            if (asset) setSelectedAsset(asset);
          }}
        />
        <MitigationScenarioComparison className="xl:col-span-4" mode={mode} />

        <StatusSummaryCard
          className="xl:col-span-4"
          title="Asset & Risk Status Summary"
          items={data.portfolioRiskSummary.map((item) => ({
            label: item.label,
            value: item.count,
            tone: item.id === "high" ? "red" : item.id === "medium-high" ? "orange" : item.id === "medium" ? "amber" : "emerald",
          }))}
          href={data.routePlaceholders.highRiskAssetList}
        />
        <StatusSummaryCard
          className="xl:col-span-4"
          title="Inspection & Validation Summary"
          items={[
            { label: "Overdue", value: data.inspectionValidationSummary.overdue, tone: "red" },
            { label: "Due in 90 days", value: data.inspectionValidationSummary.dueWithin90Days, tone: "orange" },
            { label: "Current", value: data.inspectionValidationSummary.current, tone: "emerald" },
            { label: "Pending validation", value: data.inspectionValidationSummary.pendingValidation, tone: "blue" },
            { label: "Insufficient history", value: data.inspectionValidationSummary.insufficientHistory, tone: "slate" },
          ]}
          href={APP_ROUTES.inspections.schedule}
        />
        <DocumentationSummaryCard className="xl:col-span-4" />

        <TopHighRiskAssetsTable
          assets={filteredTopRiskAssets}
          className="xl:col-span-12"
          mode={mode}
          onSelectAsset={(assetId) => {
            const asset = data.riskAssets.find((candidate) => candidate.assetId === assetId);
            if (asset) setSelectedAsset(asset);
          }}
        />
      </div>

      <RiskAssetDrawer asset={selectedAsset} mode={mode} onClose={() => setSelectedAsset(null)} />
    </div>
  );
}

function RiskAnalyticsFiltersBar({
  exportMessage,
  filters,
  filteredCount,
  mode,
  totalCount,
  onExport,
  onFilterChange,
  onModeChange,
  onReset,
}: {
  exportMessage: string | null;
  filters: RiskAnalyticsFilters;
  filteredCount: number;
  mode: RiskViewMode;
  totalCount: number;
  onExport: () => void;
  onFilterChange: <T extends keyof RiskAnalyticsFilters>(key: T, value: RiskAnalyticsFilters[T]) => void;
  onModeChange: (mode: RiskViewMode) => void;
  onReset: () => void;
}) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="space-y-2.5 p-3">
        <div className="grid gap-2.5 lg:grid-cols-12">
          <FilterSelect
            className="lg:col-span-3"
            label="Facility"
            value={filters.facilityId}
            options={[{ value: RISK_ANALYTICS_DATA.facility.id, label: "SPM-01 North Block Gathering Station" }]}
            onChange={(value) => onFilterChange("facilityId", value)}
          />
          <FilterSelect
            className="lg:col-span-2"
            label="Asset Class"
            value={filters.assetClass}
            options={ASSET_CLASS_OPTIONS}
            onChange={(value) => onFilterChange("assetClass", value as AssetClassFilter)}
          />
          <FilterSelect
            className="lg:col-span-2"
            label="Risk Category"
            value={filters.riskCategory}
            options={RISK_CATEGORY_OPTIONS}
            onChange={(value) => onFilterChange("riskCategory", value as RiskCategoryFilter)}
          />
          <FilterSelect
            className="lg:col-span-2"
            label="Damage Mechanism"
            value={filters.damageMechanism}
            options={DAMAGE_OPTIONS}
            onChange={(value) => onFilterChange("damageMechanism", value as DamageMechanismFilter)}
          />
          <FilterSelect
            className="lg:col-span-1"
            label="Range"
            value={filters.dateRange}
            options={DATE_RANGE_OPTIONS}
            onChange={(value) => onFilterChange("dateRange", value as DateRangeFilter)}
          />
          <div className="flex flex-col justify-end gap-2 lg:col-span-2">
            <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950">
              {(["baseline", "mitigated"] as RiskViewMode[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onModeChange(option)}
                  className={cn(
                    "rounded-lg px-2 py-1.5 text-xs font-extrabold transition",
                    mode === option
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white",
                  )}
                >
                  {option === "baseline" ? "Baseline Risk" : "Post-Mitigation"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 border-t border-slate-200 pt-2.5 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
              <Filter className="h-3.5 w-3.5" aria-hidden="true" />
              {getFilteredCountLabel(filteredCount, totalCount)}
            </span>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-2.5 py-1 text-slate-600 dark:border-slate-800 dark:text-slate-300">
              <input
                checked={filters.showComparison}
                className="h-3.5 w-3.5 accent-blue-600"
                type="checkbox"
                onChange={(event) => onFilterChange("showComparison", event.target.checked)}
              />
              Compare baseline and post-mitigation
            </label>
            {exportMessage ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200">
                {exportMessage}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 px-3 text-xs font-extrabold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onExport}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-xs font-extrabold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export
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

function RiskKpiCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      {RISK_ANALYTICS_DATA.kpis.map((kpi) => {
        const Icon = KPI_ICONS[kpi.id] ?? BarChart3;

        return (
          <Link
            key={kpi.id}
            href={kpi.href}
            className="group rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            <Card className="h-full rounded-2xl transition group-hover:border-blue-200 group-hover:shadow-md group-hover:shadow-blue-950/5 dark:group-hover:border-blue-500/30">
              <CardContent className="flex min-h-[84px] items-center gap-2.5 p-3">
                <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl border", KPI_TONES[kpi.tone])}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {kpi.label}
                  </p>
                  <p className="mt-0.5 text-2xl font-black tracking-tight text-slate-950 dark:text-white">{kpi.value}</p>
                  <p className="mt-1 truncate text-xs font-bold text-slate-500 dark:text-slate-400">{kpi.delta}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

function AnalyticsPanel({
  action,
  children,
  className,
  icon: Icon,
  subtitle,
  title,
}: {
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  icon?: LucideIcon;
  subtitle?: string;
  title: string;
}) {
  return (
    <Card className={cn("h-full min-w-0 rounded-2xl", className)}>
      <CardHeader className="flex-row items-start justify-between gap-3 px-3 py-2.5">
        <div className="flex min-w-0 items-start gap-2.5">
          {Icon ? (
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
          ) : null}
          <div className="min-w-0">
            <CardTitle className="truncate text-sm font-black text-slate-950 dark:text-white">{title}</CardTitle>
            {subtitle ? <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-0">{children}</CardContent>
    </Card>
  );
}

function RiskMatrixCard({
  assets,
  className,
  mode,
  showComparison,
  onSelectAsset,
}: {
  assets: RiskAssetPoint[];
  className?: string;
  mode: RiskViewMode;
  showComparison: boolean;
  onSelectAsset: (asset: RiskAssetPoint) => void;
}) {
  const baselineExtreme = RISK_ANALYTICS_DATA.riskAssets.filter((asset) => getRiskLevelForAsset(asset, "baseline") === "extreme").length;
  const activeExtreme = assets.filter((asset) => getRiskLevelForAsset(asset, mode) === "extreme").length;

  return (
    <AnalyticsPanel
      className={className}
      icon={Radar}
      title="Risk Matrix"
      subtitle="Probability of Failure vs Consequence of Failure"
      action={
        <div className="flex items-center gap-2 text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
          <span>{mode === "baseline" ? "Baseline" : "Post-Mitigation"}</span>
          <span className="rounded-full border border-slate-200 px-2 py-1 dark:border-slate-800">
            Extreme {activeExtreme}
          </span>
        </div>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_160px]">
        <div className="min-w-0">
          <div className="mb-1.5 grid grid-cols-[74px_repeat(5,minmax(48px,1fr))] gap-1 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
            <div />
            <div className="col-span-5 rounded-lg bg-slate-50 py-1 dark:bg-slate-950">Consequence of Failure</div>
            <div />
            {["1 Negligible", "2 Minor", "3 Moderate", "4 Major", "5 Catastrophic"].map((label) => (
              <div key={label} className="truncate rounded-lg bg-slate-50 px-1 py-1 dark:bg-slate-950" title={label}>
                {label}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[74px_repeat(5,minmax(48px,1fr))] gap-1">
            {[5, 4, 3, 2, 1].map((probability) => (
              <RiskMatrixRow
                key={probability}
                assets={assets}
                mode={mode}
                probability={probability}
                showComparison={showComparison}
                onSelectAsset={onSelectAsset}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span>Probability of Failure</span>
            <span>Markers are clickable asset risk records</span>
          </div>
        </div>

        <div className="space-y-2">
          {(["extreme", "very-high", "high", "medium", "low"] as RiskLevel[]).map((level) => {
            const count = assets.filter((asset) => getRiskLevelForAsset(asset, mode) === level).length;

            return (
              <div
                key={level}
                className={cn(
                  "flex h-10 items-center justify-between rounded-xl border px-2.5 text-xs font-extrabold",
                  RISK_LEVEL_STYLES[level].badge,
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", RISK_LEVEL_STYLES[level].dot)} />
                  <span className="truncate">{RISK_LEVEL_STYLES[level].label}</span>
                </span>
                <span className="shrink-0">{count}</span>
              </div>
            );
          })}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            Baseline extreme markers: <span className="font-black text-slate-950 dark:text-white">{baselineExtreme}</span>
          </div>
        </div>
      </div>
    </AnalyticsPanel>
  );
}

function RiskMatrixRow({
  assets,
  mode,
  probability,
  showComparison,
  onSelectAsset,
}: {
  assets: RiskAssetPoint[];
  mode: RiskViewMode;
  probability: number;
  showComparison: boolean;
  onSelectAsset: (asset: RiskAssetPoint) => void;
}) {
  const probabilityLabels: Record<number, string> = {
    1: "Rare",
    2: "Unlikely",
    3: "Possible",
    4: "Likely",
    5: "Almost Certain",
  };

  return (
    <>
      <div className="flex min-w-0 items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1 dark:bg-slate-950">
        <span className="text-sm font-black text-slate-950 dark:text-white">{probability}</span>
        <span className="truncate text-[10px] font-bold text-slate-500 dark:text-slate-400">
          {probabilityLabels[probability]}
        </span>
      </div>
      {[1, 2, 3, 4, 5].map((consequence) => {
        const cellAssets = assets.filter(
          (asset) => getProbability(asset, mode) === probability && getConsequence(asset, mode) === consequence,
        );
        const comparisonAssets =
          showComparison && mode === "mitigated"
            ? assets.filter(
                (asset) =>
                  asset.probabilityBaseline === probability &&
                  asset.consequenceBaseline === consequence &&
                  (asset.probabilityBaseline !== asset.probabilityMitigated ||
                    asset.consequenceBaseline !== asset.consequenceMitigated),
              )
            : [];
        const level = getMatrixCellLevel(probability, consequence);

        return (
          <div
            key={`${probability}-${consequence}`}
            className={cn(
              "relative min-h-[56px] overflow-hidden rounded-lg border border-white/70 p-1.5 dark:border-slate-900",
              RISK_LEVEL_STYLES[level].cell,
            )}
          >
            <div className="absolute right-1.5 top-1 text-[10px] font-black opacity-45">{probability * consequence}</div>
            <div className="relative z-10 flex flex-wrap gap-1">
              {comparisonAssets.map((asset) => (
                <span
                  key={`baseline-${asset.id}`}
                  className="h-2.5 w-2.5 rounded-full border border-slate-700 bg-white/70"
                  title={`${asset.tag} baseline position`}
                />
              ))}
              {cellAssets.map((asset) => {
                const assetLevel = getRiskLevelForAsset(asset, mode);

                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => onSelectAsset(asset)}
                    title={`${asset.tag}: ${getRiskScore(asset, mode).toFixed(1)} risk score, ${asset.dominantDamageMechanismLabel}`}
                    className={cn(
                      "inline-flex max-w-full items-center rounded-full border px-1.5 py-0.5 text-[10px] font-black shadow-sm transition hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
                      RISK_LEVEL_STYLES[assetLevel].marker,
                    )}
                  >
                    <span className="max-w-[72px] truncate">{asset.tag.replace(" HP Separator", "")}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

function getMatrixCellLevel(probability: number, consequence: number): RiskLevel {
  const score = probability * consequence;

  if (score >= 20) return "extreme";
  if (score >= 16) return "very-high";
  if (score >= 10) return "high";
  if (score >= 5) return "medium";

  return "low";
}

function RiskInsightsCard({ className, insights }: { className?: string; insights: RiskInsight[] }) {
  return (
    <AnalyticsPanel
      action={
        <Link href={RISK_ANALYTICS_DATA.routePlaceholders.riskInsights} className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
          View all insights
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      }
      className={className}
      icon={ShieldAlert}
      title="Risk Insights"
    >
      <div className="space-y-2">
        {insights.map((insight) => (
          <Link
            key={insight.id}
            href={insight.href}
            className={cn(
              "flex items-start gap-2 rounded-xl border p-3 text-sm font-bold leading-5 transition hover:-translate-y-0.5 hover:shadow-sm",
              INSIGHT_TONES[insight.tone],
            )}
          >
            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{insight.text}</span>
          </Link>
        ))}
      </div>
    </AnalyticsPanel>
  );
}

function RiskDistributionCard({
  className,
  icon,
  items,
  mode,
  title,
}: {
  className?: string;
  icon: LucideIcon;
  items: DistributionItem[];
  mode: RiskViewMode;
  title: string;
}) {
  const maxValue = Math.max(...items.flatMap((item) => [item.baseline, item.mitigated]));

  return (
    <AnalyticsPanel className={className} icon={icon} title={title}>
      <div className="space-y-3">
        {items.map((item) => {
          const value = getDistributionValue(item, mode);

          return (
            <div key={item.id}>
              <div className="mb-1 flex items-center justify-between gap-2 text-xs font-bold">
                <span className="truncate text-slate-600 dark:text-slate-300">{item.label}</span>
                <span className="text-slate-950 dark:text-white">{value}</span>
              </div>
              <div
                className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                title={`${item.label}: ${value} assets (${mode})`}
              >
                <div
                  className={cn(
                    "h-full rounded-full",
                    mode === "baseline" ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gradient-to-r from-blue-500 to-emerald-500",
                  )}
                  style={{ width: `${(value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AnalyticsPanel>
  );
}

function DamageMechanismParetoCard({
  className,
  items,
}: {
  className?: string;
  items: typeof RISK_ANALYTICS_DATA.damageMechanismPareto;
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const maxValue = Math.max(...items.map((item) => item.count), 1);
  const chartItems = items.reduce<Array<(typeof items)[number] & { cumulativePercent: number }>>(
    (accumulator, item) => {
      const previousCount = accumulator.reduce((sum, current) => sum + current.count, 0);
      const cumulativeCount = previousCount + item.count;

      return [
        ...accumulator,
        {
          ...item,
          cumulativePercent: getPercent(cumulativeCount, total),
        },
      ];
    },
    [],
  );

  return (
    <AnalyticsPanel className={className} icon={BarChart3} title="Damage Mechanism Pareto" subtitle="Bars with cumulative percentage">
      <div className="space-y-2">
        {chartItems.map((item) => (
          <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_minmax(160px,2fr)_56px] items-center gap-3">
            <p className="truncate text-xs font-bold text-slate-600 dark:text-slate-300" title={item.label}>
              {item.label}
            </p>
            <div className="relative h-6 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" title={`${item.label}: ${item.count} findings, cumulative ${item.cumulativePercent}%`}>
              <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" style={{ width: `${(item.count / maxValue) * 100}%` }} />
              <div className="absolute inset-y-0 border-r-2 border-red-500/80" style={{ left: `${item.cumulativePercent}%` }} />
            </div>
            <p className="text-right text-xs font-black text-slate-950 dark:text-white">
              {item.count} <span className="text-slate-500">{item.cumulativePercent}%</span>
            </p>
          </div>
        ))}
      </div>
    </AnalyticsPanel>
  );
}

function RiskTrendCard({
  className,
  mode,
  showComparison,
}: {
  className?: string;
  mode: RiskViewMode;
  showComparison: boolean;
}) {
  const points = RISK_ANALYTICS_DATA.riskTrend;
  const width = 360;
  const height = 180;
  const padding = 24;
  const max = 90;
  const min = 45;

  const toPoint = (value: number, index: number) => {
    const x = padding + (index / (points.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / (max - min)) * (height - padding * 2);

    return `${x},${y}`;
  };

  const baselinePoints = points.map((point, index) => toPoint(point.baseline, index)).join(" ");
  const mitigatedPoints = points.map((point, index) => toPoint(point.mitigated, index)).join(" ");

  return (
    <AnalyticsPanel className={className} icon={LineChart} title="Risk Trend Over Time" subtitle="Portfolio risk score across 2026">
      <svg className="h-[210px] w-full" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Risk trend over time">
        <title>Risk trend comparing baseline and post-mitigation scores across 2026</title>
        {[0, 1, 2, 3].map((line) => {
          const y = padding + line * ((height - padding * 2) / 3);

          return <line key={line} x1={padding} x2={width - padding} y1={y} y2={y} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />;
        })}
        {(showComparison || mode === "baseline") ? (
          <polyline fill="none" points={baselinePoints} stroke="#ef4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
            <title>Baseline risk trend</title>
          </polyline>
        ) : null}
        {(showComparison || mode === "mitigated") ? (
          <polyline fill="none" points={mitigatedPoints} stroke="#2563eb" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
            <title>Post-mitigation risk trend</title>
          </polyline>
        ) : null}
        {points.map((point, index) => {
          const [x, y] = toPoint(mode === "baseline" ? point.baseline : point.mitigated, index).split(",").map(Number);

          return (
            <g key={point.month}>
              <circle cx={x} cy={y} fill={mode === "baseline" ? "#ef4444" : "#2563eb"} r="4">
                <title>{`${point.month}: ${mode === "baseline" ? point.baseline : point.mitigated} risk score`}</title>
              </circle>
              <text className="fill-slate-500 text-[10px] font-bold dark:fill-slate-400" textAnchor="middle" x={x} y={height - 6}>
                {point.month}
              </text>
            </g>
          );
        })}
      </svg>
      <ChartLegend
        items={[
          { label: "Baseline", color: "bg-red-500" },
          { label: "Post-Mitigation", color: "bg-blue-600" },
        ]}
      />
    </AnalyticsPanel>
  );
}

function InspectionCoverageRiskCard({
  className,
  mode,
  points,
  onSelectAsset,
}: {
  className?: string;
  mode: RiskViewMode;
  points: typeof RISK_ANALYTICS_DATA.inspectionCoverage;
  onSelectAsset: (assetId: string) => void;
}) {
  const width = 360;
  const height = 190;
  const padding = 28;

  return (
    <AnalyticsPanel className={className} icon={Target} title="Inspection Coverage vs Risk" subtitle="Coverage percentage against risk score">
      <svg className="h-[218px] w-full" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Inspection coverage versus risk scatter chart">
        <title>Inspection coverage compared with selected risk score</title>
        <line x1={padding} x2={width - padding} y1={height - padding} y2={height - padding} stroke="currentColor" className="text-slate-300 dark:text-slate-700" />
        <line x1={padding} x2={padding} y1={padding} y2={height - padding} stroke="currentColor" className="text-slate-300 dark:text-slate-700" />
        <text className="fill-slate-500 text-[10px] font-bold dark:fill-slate-400" x={width - 88} y={height - 8}>
          Coverage %
        </text>
        <text className="fill-slate-500 text-[10px] font-bold dark:fill-slate-400" x={4} y={18}>
          Risk
        </text>
        {points.map((point) => {
          const score = mode === "baseline" ? point.riskScoreBaseline : point.riskScoreMitigated;
          const x = padding + (point.coveragePercent / 100) * (width - padding * 2);
          const y = height - padding - (score / 26) * (height - padding * 2);
          const level = getRiskLevel(score);

          return (
            <g
              key={point.id}
              aria-label={`Open ${point.tag} risk detail`}
              className="cursor-pointer outline-none"
              role="button"
              tabIndex={0}
              onClick={() => onSelectAsset(point.assetId)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectAsset(point.assetId);
                }
              }}
            >
              <circle
                cx={x}
                cy={y}
                r={point.radius}
                className={cn("cursor-pointer stroke-white stroke-[2px] transition hover:opacity-80", level === "extreme" ? "fill-red-800" : level === "very-high" ? "fill-red-600" : level === "high" ? "fill-orange-500" : level === "medium" ? "fill-amber-400" : "fill-emerald-500")}
              >
                <title>{`${point.tag}: ${point.coveragePercent}% coverage, ${score.toFixed(1)} risk score`}</title>
              </circle>
            </g>
          );
        })}
      </svg>
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
        Produced-water circuits show the largest coverage gap among filtered assets.
      </p>
    </AnalyticsPanel>
  );
}

function MitigationScenarioComparison({ className, mode }: { className?: string; mode: RiskViewMode }) {
  return (
    <AnalyticsPanel className={className} icon={CheckCircle2} title="Mitigation Scenario Comparison">
      <div className="space-y-2">
        {RISK_ANALYTICS_DATA.mitigationScenarios.map((scenario) => (
          <MitigationScenarioRow key={scenario.id} mode={mode} scenario={scenario} />
        ))}
      </div>
    </AnalyticsPanel>
  );
}

function MitigationScenarioRow({ mode, scenario }: { mode: RiskViewMode; scenario: MitigationScenario }) {
  const active = mode === "baseline" ? scenario.id === "baseline" : scenario.id === "full-mitigation";

  return (
    <div
      className={cn(
        "rounded-2xl border p-3 transition",
        active
          ? "border-blue-200 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/10"
          : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-slate-950 dark:text-white">{scenario.label}</p>
          <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">{scenario.note}</p>
        </div>
        <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-black text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          {scenario.highRiskCount} high
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <MiniScenarioMetric label="Reduction" value={`${scenario.averageRiskReductionPercent}%`} />
        <MiniScenarioMetric label="Coverage" value={`${scenario.actionCoveragePercent}%`} />
        <MiniScenarioMetric label="Readiness" value={`${scenario.readinessScore}%`} />
      </div>
    </div>
  );
}

function MiniScenarioMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white px-2 py-2 dark:bg-slate-900">
      <p className="text-sm font-black text-slate-950 dark:text-white">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

function StatusSummaryCard({
  className,
  href,
  items,
  title,
}: {
  className?: string;
  href: string;
  items: Array<{ label: string; value: number; tone: "red" | "orange" | "amber" | "emerald" | "blue" | "slate" }>;
  title: string;
}) {
  return (
    <AnalyticsPanel
      action={
        <Link href={href} className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
          View
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      }
      className={className}
      title={title}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <p className={cn("text-2xl font-black", getToneTextClass(item.tone))}>{item.value}</p>
            <p className="mt-0.5 text-xs font-bold text-slate-500 dark:text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>
    </AnalyticsPanel>
  );
}

function DocumentationSummaryCard({ className }: { className?: string }) {
  const summary = RISK_ANALYTICS_DATA.documentationCompletenessSummary;
  const total = summary.complete + summary.partial + summary.missingExpiredUnvalidated;
  const segments = [
    { label: "Complete", value: summary.complete, color: "bg-emerald-500" },
    { label: "Partial", value: summary.partial, color: "bg-amber-400 text-amber-950" },
    { label: "Missing / expired / unvalidated", value: summary.missingExpiredUnvalidated, color: "bg-red-500 text-white" },
  ];

  return (
    <AnalyticsPanel
      action={
        <Link href={APP_ROUTES.documents.register} className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
          Document Control
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      }
      className={className}
      title="Documentation Completeness Summary"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex h-12">
          {segments.map((segment) => (
            <div
              key={segment.label}
              className={cn("grid place-items-center text-xs font-black text-white", segment.color)}
              style={{ width: `${getPercent(segment.value, total)}%` }}
              title={`${segment.label}: ${segment.value} assets`}
            >
              {segment.value}
            </div>
          ))}
        </div>
        <div className="space-y-2 p-3">
          {segments.map((segment) => (
            <div key={segment.label} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex min-w-0 items-center gap-2 font-bold text-slate-600 dark:text-slate-300">
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", segment.color.split(" ")[0])} />
                <span className="truncate">{segment.label}</span>
              </span>
              <span className="font-black text-slate-950 dark:text-white">{segment.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 grid gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
        <Link className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200" href={`${APP_ROUTES.certification.evidencePack}?package=psv-calibration`}>
          6 PSV calibration packages incomplete
        </Link>
        <Link className="rounded-xl border border-orange-100 bg-orange-50 px-3 py-2 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200" href={`${APP_ROUTES.certification.register}?assetClass=pressure-vessel`}>
          3 pressure vessels require certificate evidence update
        </Link>
        <Link className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200" href={`${APP_ROUTES.documents.register}?assetClass=storage-tank&evidence=external-inspection`}>
          2 tanks require external inspection evidence completion
        </Link>
      </div>
    </AnalyticsPanel>
  );
}

function TopHighRiskAssetsTable({
  assets,
  className,
  mode,
  onSelectAsset,
}: {
  assets: ReturnType<typeof getTopRiskAssetsForMode>;
  className?: string;
  mode: RiskViewMode;
  onSelectAsset: (assetId: string) => void;
}) {
  return (
    <AnalyticsPanel
      action={
        <Link href={RISK_ANALYTICS_DATA.routePlaceholders.highRiskAssetList} className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
          View full list
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      }
      className={className}
      title="Top High-Risk Assets"
    >
      <div className="overflow-x-auto rounded-2xl border border-slate-200 aim-shell-scrollbar dark:border-slate-800">
        <div className="grid min-w-[760px] grid-cols-[minmax(0,1fr)_160px_104px_132px] bg-slate-50 text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
          <div className="px-3 py-2">Asset</div>
          <div className="px-3 py-2">Type</div>
          <div className="px-3 py-2 text-right">Risk Score</div>
          <div className="px-3 py-2 text-right">Action</div>
        </div>
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="grid min-h-[46px] min-w-[760px] grid-cols-[minmax(0,1fr)_160px_104px_132px] items-center border-t border-slate-200 text-sm dark:border-slate-800"
          >
            <button type="button" onClick={() => onSelectAsset(asset.assetId)} className="min-w-0 px-3 py-2 text-left">
              <p className="truncate font-extrabold text-slate-950 hover:text-blue-700 dark:text-white dark:hover:text-blue-200">{asset.tag}</p>
              <p className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{asset.dominantDamageMechanism}</p>
            </button>
            <div className="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300">{asset.assetType}</div>
            <div className="px-3 py-2 text-right text-lg font-black text-slate-950 dark:text-white">
              {getActiveRiskScore(asset, mode).toFixed(1)}
            </div>
            <div className="flex items-center justify-end gap-2 px-3 py-2">
              <button
                type="button"
                onClick={() => onSelectAsset(asset.assetId)}
                className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700 transition hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:bg-blue-500/20"
              >
                View
              </button>
              <Link href={asset.href} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-extrabold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900">
                Asset
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AnalyticsPanel>
  );
}

function RiskAssetDrawer({
  asset,
  mode,
  onClose,
}: {
  asset: RiskAssetPoint | null;
  mode: RiskViewMode;
  onClose: () => void;
}) {
  if (!asset) return null;

  const riskScore = getRiskScore(asset, mode);
  const riskLevel = getRiskLevel(riskScore);

  return (
    <div className="fixed inset-x-0 bottom-0 top-[var(--app-header-height)] z-40 flex justify-end bg-slate-950/35 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="risk-asset-drawer-title">
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close asset risk detail" />
      <aside className="relative flex h-full w-full max-w-[520px] flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-wide text-blue-700 dark:text-blue-300">Asset Risk Detail</p>
            <h2 id="risk-asset-drawer-title" className="mt-1 text-xl font-black text-slate-950 dark:text-white">
              {asset.tag}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{asset.assetType}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white" aria-label="Close details">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 aim-shell-scrollbar">
          <div className={cn("rounded-2xl border p-3", RISK_LEVEL_STYLES[riskLevel].badge)}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide">Selected View</p>
                <p className="mt-1 text-sm font-bold">{mode === "baseline" ? "Baseline Risk" : "Post-Mitigation Risk"}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black">{riskScore.toFixed(1)}</p>
                <p className="text-xs font-extrabold">{RISK_LEVEL_STYLES[riskLevel].label}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <MiniScenarioMetric label="PoF" value={String(getProbability(asset, mode))} />
              <MiniScenarioMetric label="CoF" value={String(getConsequence(asset, mode))} />
            </div>
          </div>

          <DetailBlock
            rows={[
              ["Dominant damage mechanism", asset.dominantDamageMechanismLabel],
              ["Inspection status", asset.inspectionStatus],
              ["Certification / evidence", asset.certificationStatus],
              ["Document status", asset.evidenceStatus],
              ["Inspection coverage", `${asset.inspectionCoveragePercent}%`],
            ]}
          />

          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Taxonomy Labels</p>
            <div className="flex flex-wrap gap-2">
              {asset.standards.map((standard) => (
                <span key={standard} className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200">
                  {standard}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <DrawerLink href={asset.linkedRoutes.assetDetail} label="Open Asset Detail" />
            <DrawerLink href={asset.linkedRoutes.inspectionHistory} label="Inspection History" />
            <DrawerLink href={asset.linkedRoutes.rbiAssessment} label="RBI Assessment Detail" />
            <DrawerLink href={asset.linkedRoutes.documentEvidence} label="Document Evidence" />
            <DrawerLink href={asset.linkedRoutes.anomalies} label="Anomaly List" />
            <DrawerLink href={asset.linkedRoutes.recommendations} label="Recommendations" />
          </div>
        </div>
      </aside>
    </div>
  );
}

function DetailBlock({ rows }: { rows: Array<[string, string]> }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[170px_minmax(0,1fr)] border-t border-slate-200 first:border-t-0 dark:border-slate-800">
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

function ChartLegend({ items }: { items: Array<{ label: string; color: string }> }) {
  return (
    <div className="flex flex-wrap gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", item.color)} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function getToneTextClass(tone: "red" | "orange" | "amber" | "emerald" | "blue" | "slate") {
  switch (tone) {
    case "red":
      return "text-red-600 dark:text-red-300";
    case "orange":
      return "text-orange-600 dark:text-orange-300";
    case "amber":
      return "text-amber-600 dark:text-amber-300";
    case "emerald":
      return "text-emerald-600 dark:text-emerald-300";
    case "blue":
      return "text-blue-600 dark:text-blue-300";
    default:
      return "text-slate-700 dark:text-slate-200";
  }
}
