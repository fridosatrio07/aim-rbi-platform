"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  Database,
  Download,
  ExternalLink,
  FileCheck2,
  FileWarning,
  Filter,
  Gauge,
  Layers3,
  ShieldAlert,
  TrendingUp,
  X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_ROUTES } from "@/lib/app-routes";
import { cn } from "@/lib/utils";

import { DASHBOARD_SEED_DATA } from "../services/dashboard-seed-data";
import {
  ANOMALY_SEVERITY_LABELS,
  INSPECTION_STATUS_LABELS,
  RISK_LEVEL_LABELS,
  getDashboardKpis,
  getDocumentCompletenessTotal,
  getPercent,
  getRbiProgressPercent,
  getRiskSummary,
  getTotalAssetCount,
} from "../services/dashboard-selectors";
import type {
  AnomalySeverity,
  AssetClassSummary,
  CertificateRecord,
  CriticalAttentionRecord,
  InspectionDueStatus,
  RiskLevel,
} from "../services/dashboard-types";

type RiskFilter = RiskLevel | "all";
type AssetClassFilter = string | "all";

const DATE_RANGE_OPTIONS = [
  { id: "30d", label: "May 13 - Jun 12, 2026" },
  { id: "90d", label: "Mar 15 - Jun 12, 2026" },
  { id: "campaign", label: "Renewal Campaign 2026" },
] as const;

const RISK_FILTER_OPTIONS: Array<{ value: RiskFilter; label: string }> = [
  { value: "all", label: "All risk levels" },
  { value: "high", label: "High" },
  { value: "medium-high", label: "Medium-High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const INSPECTION_STATUS_ORDER: InspectionDueStatus[] = [
  "overdue",
  "due-30",
  "due-90",
  "current",
  "pending-validation",
];

const RISK_LEVEL_STYLES: Record<
  RiskLevel,
  {
    cell: string;
    badge: string;
    dot: string;
    text: string;
  }
> = {
  high: {
    cell: "bg-red-600 text-white shadow-sm shadow-red-950/10",
    badge: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200",
    dot: "bg-red-500",
    text: "text-red-700 dark:text-red-300",
  },
  "medium-high": {
    cell: "bg-orange-500 text-white shadow-sm shadow-orange-950/10",
    badge: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-200",
    dot: "bg-orange-500",
    text: "text-orange-700 dark:text-orange-300",
  },
  medium: {
    cell: "bg-amber-300 text-amber-950 shadow-sm shadow-amber-950/10",
    badge: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200",
    dot: "bg-amber-400",
    text: "text-amber-700 dark:text-amber-300",
  },
  low: {
    cell: "bg-emerald-500 text-white shadow-sm shadow-emerald-950/10",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-300",
  },
};

const INSPECTION_STATUS_STYLES: Record<
  InspectionDueStatus,
  {
    bg: string;
    text: string;
    border: string;
    segment: string;
  }
> = {
  overdue: {
    bg: "bg-red-50 dark:bg-red-500/10",
    text: "text-red-700 dark:text-red-200",
    border: "border-red-200 dark:border-red-500/30",
    segment: "bg-red-500",
  },
  "due-30": {
    bg: "bg-orange-50 dark:bg-orange-500/10",
    text: "text-orange-700 dark:text-orange-200",
    border: "border-orange-200 dark:border-orange-500/30",
    segment: "bg-orange-500",
  },
  "due-90": {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-800 dark:text-amber-200",
    border: "border-amber-200 dark:border-amber-500/30",
    segment: "bg-amber-400",
  },
  current: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-200",
    border: "border-emerald-200 dark:border-emerald-500/30",
    segment: "bg-emerald-500",
  },
  "pending-validation": {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-200",
    border: "border-blue-200 dark:border-blue-500/30",
    segment: "bg-blue-500",
  },
};

const ANOMALY_SEVERITY_STYLES: Record<
  AnomalySeverity,
  {
    color: string;
    dot: string;
    badge: string;
  }
> = {
  critical: {
    color: "#ef4444",
    dot: "bg-red-500",
    badge: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200",
  },
  high: {
    color: "#f97316",
    dot: "bg-orange-500",
    badge: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-200",
  },
  medium: {
    color: "#facc15",
    dot: "bg-yellow-400",
    badge: "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-200",
  },
  low: {
    color: "#22c55e",
    dot: "bg-emerald-500",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
  },
};

const KPI_TONE_STYLES = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100 dark:bg-blue-500/10 dark:text-blue-200 dark:ring-blue-500/20",
  red: "bg-red-50 text-red-700 ring-red-100 dark:bg-red-500/10 dark:text-red-200 dark:ring-red-500/20",
  orange: "bg-orange-50 text-orange-700 ring-orange-100 dark:bg-orange-500/10 dark:text-orange-200 dark:ring-orange-500/20",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-200 dark:ring-cyan-500/20",
  violet: "bg-violet-50 text-violet-700 ring-violet-100 dark:bg-violet-500/10 dark:text-violet-200 dark:ring-violet-500/20",
} as const;

const CONSEQUENCE_LABELS = ["Insignificant", "Minor", "Moderate", "Major", "Catastrophic"];
const LIKELIHOOD_LABELS: Record<number, string> = {
  5: "Almost Certain",
  4: "Likely",
  3: "Possible",
  2: "Unlikely",
  1: "Rare",
};

export function DashboardPageContent() {
  const data = DASHBOARD_SEED_DATA;
  const kpis = useMemo(() => getDashboardKpis(data), [data]);
  const riskSummary = useMemo(() => getRiskSummary(data), [data]);
  const [dateRange, setDateRange] = useState<(typeof DATE_RANGE_OPTIONS)[number]["id"]>("30d");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [assetClassFilter, setAssetClassFilter] = useState<AssetClassFilter>("all");
  const [inspectionStatus, setInspectionStatus] = useState<InspectionDueStatus>("overdue");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [selectedCriticalItem, setSelectedCriticalItem] = useState<CriticalAttentionRecord | null>(null);

  function notifyExportWorkflow(label: string) {
    setExportOpen(false);
    setExportNotice(`${label} export workflow will be connected to Evidence Pack / Reports.`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <nav className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
            <Link href={APP_ROUTES.dashboard} className="transition hover:text-blue-700 dark:hover:text-blue-200">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-700 dark:text-slate-200">Dashboard</span>
          </nav>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="relative inline-flex min-w-[220px] items-center">
            <span className="sr-only">Date range</span>
            <CalendarDays className="pointer-events-none absolute left-3 h-4 w-4 text-slate-500" aria-hidden="true" />
            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value as (typeof DATE_RANGE_OPTIONS)[number]["id"])}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {DATE_RANGE_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-500" aria-hidden="true" />
          </label>

          <button
            type="button"
            onClick={() => setFiltersOpen((current) => !current)}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-bold shadow-sm transition",
              filtersOpen
                ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200"
                : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500/30",
            )}
            aria-expanded={filtersOpen}
          >
            <Filter className="h-4 w-4" aria-hidden="true" />
            Filter
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setExportOpen((current) => !current)}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500/30"
              aria-expanded={exportOpen}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>

            {exportOpen ? (
              <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.18)] dark:border-slate-800 dark:bg-slate-900">
                {["Dashboard Snapshot", "Evidence Pack Queue", "Reports Dataset"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => notifyExportWorkflow(label)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-blue-500/10 dark:hover:text-blue-200"
                  >
                    {label}
                    <span className="text-xs font-bold text-slate-400">Planned</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {exportNotice ? (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
          <span>{exportNotice}</span>
          <button type="button" onClick={() => setExportNotice(null)} className="rounded-lg p-1 hover:bg-blue-100 dark:hover:bg-blue-500/20" aria-label="Dismiss export notice">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {filtersOpen ? (
        <Card className="rounded-2xl">
          <CardContent className="grid gap-3 p-4 md:grid-cols-3">
            <SelectControl
              label="Risk level"
              icon={ShieldAlert}
              value={riskFilter}
              onChange={(value) => setRiskFilter(value as RiskFilter)}
              options={RISK_FILTER_OPTIONS}
            />
            <SelectControl
              label="Asset class"
              icon={Layers3}
              value={assetClassFilter}
              onChange={(value) => setAssetClassFilter(value)}
              options={[
                { value: "all", label: "All asset classes" },
                ...data.assetClasses.map((assetClass) => ({ value: assetClass.id, label: assetClass.label })),
              ]}
            />
            <SelectControl
              label="Inspection status"
              icon={ClipboardCheck}
              value={inspectionStatus}
              onChange={(value) => setInspectionStatus(value as InspectionDueStatus)}
              options={INSPECTION_STATUS_ORDER.map((status) => ({
                value: status,
                label: INSPECTION_STATUS_LABELS[status],
              }))}
            />
          </CardContent>
        </Card>
      ) : null}

      <FacilityContextStrip
        assetClassFilter={assetClassFilter}
        assetClasses={data.assetClasses}
        facility={data.facility}
        onAssetClassFilterChange={setAssetClassFilter}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
        <KpiCard
          icon={Database}
          label="Total Assets"
          value={kpis.totalAssets}
          microText="+12 vs last 30 days"
          tone="blue"
          active={assetClassFilter === "all"}
          onClick={() => setAssetClassFilter("all")}
        />
        <KpiCard
          icon={ShieldAlert}
          label="High-Risk Assets"
          value={kpis.highRiskAssets}
          microText={`${kpis.highRiskPercent.toFixed(1)}% of total assets`}
          tone="red"
          active={riskFilter === "high"}
          onClick={() => setRiskFilter("high")}
        />
        <KpiCard
          icon={CalendarDays}
          label="Overdue Inspections"
          value={kpis.overdueInspections}
          microText={`${kpis.inspectionsDueWithin90Days} due within 90 days`}
          tone="orange"
          active={inspectionStatus === "overdue"}
          onClick={() => setInspectionStatus("overdue")}
        />
        <KpiCard
          icon={FileCheck2}
          label="Certificates Due ≤180 Days"
          value={kpis.certificatesDueWithin180Days}
          microText={`${kpis.expiredOrUrgentCertificates} expired / urgent evidence`}
          tone="cyan"
        />
        <KpiCard
          icon={AlertTriangle}
          label="Active Anomalies"
          value={kpis.activeAnomalies}
          microText={`${kpis.overdueCorrectiveActions} overdue corrective actions`}
          tone="violet"
        />
        <KpiCard
          icon={ClipboardCheck}
          label="Open Recommendations"
          value={kpis.openRecommendations}
          microText={`${kpis.waitingClientClarification} waiting client clarification`}
          tone="blue"
        />
        <ReadinessCard score={kpis.readinessScore} target={kpis.readinessTarget} delta={kpis.readinessDelta} />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <RiskMatrixPanel
          className="xl:col-span-4"
          riskFilter={riskFilter}
          riskSummary={riskSummary}
          totalAssets={getTotalAssetCount(data)}
          onRiskFilterChange={setRiskFilter}
        />
        <InspectionTrendPanel
          className="xl:col-span-4"
          activeStatus={inspectionStatus}
          onStatusChange={setInspectionStatus}
        />
        <CertificationTimelinePanel className="xl:col-span-4" certificates={data.certificates} />
        <AnomalyDistributionPanel className="xl:col-span-3" />
        <RbiProgressPanel className="xl:col-span-3" />
        <DocumentCompletenessPanel className="xl:col-span-3" />
        <CriticalAttentionPanel
          className="xl:col-span-3"
          rows={data.criticalAttention}
          onSelectRow={setSelectedCriticalItem}
        />
      </div>

      <CriticalAttentionSheet item={selectedCriticalItem} onClose={() => setSelectedCriticalItem(null)} />
    </div>
  );
}

function SelectControl({
  label,
  icon: Icon,
  value,
  options,
  onChange,
}: {
  label: string;
  icon: LucideIcon;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </span>
      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
      </span>
    </label>
  );
}

function FacilityContextStrip({
  facility,
  assetClasses,
  assetClassFilter,
  onAssetClassFilterChange,
}: {
  facility: typeof DASHBOARD_SEED_DATA.facility;
  assetClasses: AssetClassSummary[];
  assetClassFilter: AssetClassFilter;
  onAssetClassFilterChange: (value: AssetClassFilter) => void;
}) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="grid gap-4 p-4 xl:grid-cols-[1.2fr_1fr]">
        <div className="min-w-0 space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <ContextMetric label="Facility" value={facility.name} icon={Gauge} />
            <ContextMetric label="Owner" value={facility.owner} icon={BadgeCheck} />
            <ContextMetric label="Facility Type" value={facility.type} icon={Layers3} />
          </div>
          <div className="flex flex-wrap gap-2">
            {facility.nominalThroughput.map((item) => (
              <span
                key={item}
                className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Asset population
            </p>
            <button
              type="button"
              onClick={() => onAssetClassFilterChange("all")}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
            >
              Reset
            </button>
          </div>
          <div className="flex max-h-24 flex-wrap gap-2 overflow-y-auto pr-1 aim-shell-scrollbar">
            {assetClasses.map((assetClass) => {
              const selected = assetClassFilter === assetClass.id;

              return (
                <button
                  key={assetClass.id}
                  type="button"
                  onClick={() => onAssetClassFilterChange(selected ? "all" : assetClass.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-bold transition",
                    selected
                      ? "border-blue-200 bg-blue-600 text-white shadow-sm dark:border-blue-400/40 dark:bg-blue-500"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-blue-500/30 dark:hover:text-blue-200",
                  )}
                >
                  <span className={cn("rounded-full px-1.5 py-0.5 text-[10px]", selected ? "bg-white/20" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300")}>
                    {assetClass.iconLabel}
                  </span>
                  <span>{assetClass.count}</span>
                  <span className="max-w-[180px] truncate">{assetClass.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ContextMetric({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <Icon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-1 truncate text-sm font-extrabold text-slate-900 dark:text-slate-100" title={value}>
        {value}
      </p>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  microText,
  tone,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  microText: string;
  tone: keyof typeof KPI_TONE_STYLES;
  active?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <Card className={cn("h-full rounded-2xl transition", active ? "border-blue-300 ring-4 ring-blue-500/10" : "hover:border-blue-200 dark:hover:border-blue-500/30")}>
      <CardContent className="flex h-full items-center gap-3 p-4">
        <div className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-1", KPI_TONE_STYLES[tone])}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-extrabold text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">{value}</p>
          <p className="mt-1 truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{microText}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (!onClick) {
    return content;
  }

  return (
    <button type="button" onClick={onClick} className="min-w-0 text-left">
      {content}
    </button>
  );
}

function ReadinessCard({ score, target, delta }: { score: number; target: number; delta: number }) {
  const radius = 33;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <Card className="overflow-hidden rounded-2xl border-blue-700 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 text-white shadow-[0_18px_45px_rgba(37,99,235,0.28)]">
      <CardContent className="flex h-full items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="text-xs font-extrabold text-blue-100">Overall Integrity Readiness Score</p>
          <p className="mt-2 text-4xl font-black tracking-tight">{score}%</p>
          <p className="mt-1 text-xs font-bold text-blue-100">Target ≥{target}%</p>
          <p className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-200">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
            {delta}% vs last 30 days
          </p>
        </div>
        <div className="relative grid h-24 w-24 shrink-0 place-items-center">
          <svg className="h-24 w-24 -rotate-90" viewBox="0 0 88 88" aria-hidden="true">
            <circle cx="44" cy="44" r={radius} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="10" />
            <circle
              cx="44"
              cy="44"
              r={radius}
              fill="none"
              stroke="url(#readinessGradient)"
              strokeLinecap="round"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
            <defs>
              <linearGradient id="readinessGradient" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="100%" stopColor="#86efac" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute text-xl font-black">{score}%</span>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardPanel({
  title,
  subtitle,
  action,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Card className={cn("min-w-0 rounded-2xl", className)}>
      <CardHeader className="flex-row items-start justify-between gap-3 p-4 pb-3">
        <div className="min-w-0">
          <CardTitle className="truncate text-base font-extrabold text-slate-950 dark:text-white">{title}</CardTitle>
          {subtitle ? <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className="p-4 pt-0">{children}</CardContent>
    </Card>
  );
}

function RiskMatrixPanel({
  className,
  riskFilter,
  riskSummary,
  totalAssets,
  onRiskFilterChange,
}: {
  className?: string;
  riskFilter: RiskFilter;
  riskSummary: Record<RiskLevel, number>;
  totalAssets: number;
  onRiskFilterChange: (value: RiskFilter) => void;
}) {
  const cellsByKey = new Map(
    DASHBOARD_SEED_DATA.riskMatrix.map((cell) => [`${cell.likelihood}-${cell.consequence}`, cell]),
  );

  return (
    <DashboardPanel title="Risk Matrix" subtitle="Likelihood vs Consequence" className={className}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_138px]">
        <div className="min-w-0">
          <div className="mb-2 grid grid-cols-[72px_repeat(5,minmax(44px,1fr))] gap-1 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
            <div />
            <div className="col-span-5 rounded-xl bg-slate-50 py-1 dark:bg-slate-950">Consequence</div>
            <div />
            {CONSEQUENCE_LABELS.map((label, index) => (
              <div key={label} className="truncate rounded-lg bg-slate-50 px-1 py-1 dark:bg-slate-950" title={label}>
                <span className="block text-xs text-slate-700 dark:text-slate-200">{index + 1}</span>
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[72px_repeat(5,minmax(44px,1fr))] gap-1">
            {[5, 4, 3, 2, 1].map((likelihood) => (
              <RiskMatrixRow
                key={likelihood}
                likelihood={likelihood}
                cellsByKey={cellsByKey}
                riskFilter={riskFilter}
                onRiskFilterChange={onRiskFilterChange}
              />
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span>Likelihood</span>
            <span>1 Low consequence to 5 catastrophic</span>
          </div>
        </div>

        <div className="space-y-2">
          {(["high", "medium-high", "medium", "low"] as RiskLevel[]).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onRiskFilterChange(riskFilter === level ? "all" : level)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm font-extrabold transition",
                RISK_LEVEL_STYLES[level].badge,
                riskFilter === level && "ring-4 ring-blue-500/10",
              )}
            >
              <span className="flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", RISK_LEVEL_STYLES[level].dot)} />
                {RISK_LEVEL_LABELS[level]}
              </span>
              <span>{riskSummary[level]}</span>
            </button>
          ))}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Assets</p>
            <p className="mt-1 text-3xl font-black text-slate-950 dark:text-white">{totalAssets}</p>
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
}

function RiskMatrixRow({
  likelihood,
  cellsByKey,
  riskFilter,
  onRiskFilterChange,
}: {
  likelihood: number;
  cellsByKey: Map<string, (typeof DASHBOARD_SEED_DATA.riskMatrix)[number]>;
  riskFilter: RiskFilter;
  onRiskFilterChange: (value: RiskFilter) => void;
}) {
  return (
    <>
      <div className="flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 px-2 py-1 text-left dark:bg-slate-950">
        <span className="text-sm font-black text-slate-900 dark:text-white">{likelihood}</span>
        <span className="min-w-0 truncate text-[10px] font-bold text-slate-500 dark:text-slate-400">
          {LIKELIHOOD_LABELS[likelihood]}
        </span>
      </div>
      {[1, 2, 3, 4, 5].map((consequence) => {
        const cell = cellsByKey.get(`${likelihood}-${consequence}`);
        if (!cell) return <div key={consequence} />;

        const dimmed = riskFilter !== "all" && riskFilter !== cell.level;

        return (
          <button
            key={consequence}
            type="button"
            onClick={() => onRiskFilterChange(riskFilter === cell.level ? "all" : cell.level)}
            className={cn(
              "grid min-h-12 place-items-center rounded-xl text-sm font-black transition hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-500/20",
              RISK_LEVEL_STYLES[cell.level].cell,
              dimmed && "opacity-35 grayscale",
            )}
            aria-label={`${RISK_LEVEL_LABELS[cell.level]} risk: likelihood ${likelihood}, consequence ${consequence}, ${cell.count} assets`}
          >
            {cell.count}
          </button>
        );
      })}
    </>
  );
}

function InspectionTrendPanel({
  className,
  activeStatus,
  onStatusChange,
}: {
  className?: string;
  activeStatus: InspectionDueStatus;
  onStatusChange: (status: InspectionDueStatus) => void;
}) {
  const maxTotal = Math.max(
    ...DASHBOARD_SEED_DATA.inspectionTrend.map((point) =>
      INSPECTION_STATUS_ORDER.reduce((total, status) => total + point.statuses[status], 0),
    ),
  );
  const latest = DASHBOARD_SEED_DATA.inspectionTrend[DASHBOARD_SEED_DATA.inspectionTrend.length - 1];

  return (
    <DashboardPanel title="Inspection Due Trend" subtitle="By due status" className={className}>
      <div className="mb-3 flex flex-wrap gap-2">
        {INSPECTION_STATUS_ORDER.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onStatusChange(status)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-extrabold transition",
              INSPECTION_STATUS_STYLES[status].bg,
              INSPECTION_STATUS_STYLES[status].text,
              INSPECTION_STATUS_STYLES[status].border,
              activeStatus === status && "ring-4 ring-blue-500/10",
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", INSPECTION_STATUS_STYLES[status].segment)} />
            {latest.statuses[status]} {INSPECTION_STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
        <div className="grid h-44 grid-cols-6 items-end gap-3">
          {DASHBOARD_SEED_DATA.inspectionTrend.map((point) => {
            const total = INSPECTION_STATUS_ORDER.reduce((sum, status) => sum + point.statuses[status], 0);

            return (
              <div key={point.id} className="flex h-full min-w-0 flex-col justify-end gap-2">
                <div className="flex h-full items-end justify-center">
                  <div className="flex w-full max-w-10 flex-col-reverse overflow-hidden rounded-t-xl border border-white/80 bg-white shadow-sm dark:border-slate-900 dark:bg-slate-800" style={{ height: `${(total / maxTotal) * 100}%` }}>
                    {INSPECTION_STATUS_ORDER.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => onStatusChange(status)}
                        title={`${point.label} ${INSPECTION_STATUS_LABELS[status]}: ${point.statuses[status]}`}
                        className={cn(
                          "w-full transition hover:brightness-110",
                          INSPECTION_STATUS_STYLES[status].segment,
                          activeStatus !== status && "opacity-45",
                        )}
                        style={{ height: `${Math.max(4, (point.statuses[status] / total) * 100)}%` }}
                        aria-label={`${point.label} ${INSPECTION_STATUS_LABELS[status]} ${point.statuses[status]}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="truncate text-center text-[11px] font-bold text-slate-500 dark:text-slate-400">{point.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardPanel>
  );
}

function CertificationTimelinePanel({
  className,
  certificates,
}: {
  className?: string;
  certificates: CertificateRecord[];
}) {
  return (
    <DashboardPanel
      title="Certification Expiry Timeline"
      className={className}
      action={
        <Link href={APP_ROUTES.certification.register} className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
          Certificates
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      }
    >
      <div className="mb-3 flex flex-wrap gap-2 text-xs font-bold">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700 dark:bg-blue-500/10 dark:text-blue-200">
          {DASHBOARD_SEED_DATA.certificateSummary.dueWithin180Days} due within 180 days
        </span>
        <span className="rounded-full bg-red-50 px-3 py-1 text-red-700 dark:bg-red-500/10 dark:text-red-200">
          {DASHBOARD_SEED_DATA.certificateSummary.expiredOrUrgentEvidence} expired / urgent renewal evidence
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-[1.15fr_0.9fr_0.55fr] bg-slate-50 text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
          <div className="px-3 py-2">Asset / Certificate</div>
          <div className="px-3 py-2">Expiry</div>
          <div className="px-3 py-2 text-right">Status</div>
        </div>
        {certificates.map((certificate) => (
          <div key={certificate.id} className="grid grid-cols-[1.15fr_0.9fr_0.55fr] border-t border-slate-200 text-sm dark:border-slate-800">
            <div className="min-w-0 px-3 py-2">
              <p className="truncate font-extrabold text-slate-900 dark:text-white">{certificate.assetTag} {certificate.assetName}</p>
              <p className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{certificate.certificateType}</p>
            </div>
            <div className="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300">
              <p>{certificate.expiryDate}</p>
              <p className={certificate.daysLeft < 0 ? "text-red-600 dark:text-red-300" : "text-slate-500 dark:text-slate-400"}>
                {certificate.daysLeft < 0 ? `${certificate.daysLeft} days` : `${certificate.daysLeft} days left`}
              </p>
            </div>
            <div className="flex items-center justify-end px-3 py-2">
              <CertificateBadge status={certificate.status} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 px-3 py-3 dark:bg-slate-950">
        <div className="relative h-9">
          <div className="absolute left-0 right-0 top-4 h-1 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500" />
          {certificates.map((certificate) => (
            <Link
              key={certificate.id}
              href={certificate.route}
              title={`${certificate.assetTag} ${certificate.daysLeft < 0 ? "expired" : `${certificate.daysLeft} days left`}`}
              className={cn(
                "absolute top-2 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full border-2 border-white shadow-sm dark:border-slate-950",
                certificate.status === "expired" ? "bg-red-500" : certificate.status === "due-soon" ? "bg-amber-400" : "bg-emerald-500",
              )}
              style={{ left: `${getCertificateTimelinePosition(certificate.daysLeft)}%` }}
              aria-label={`Open certificate record for ${certificate.assetTag}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
          <span>Now</span>
          <span>30 Days</span>
          <span>90 Days</span>
          <span>180 Days</span>
        </div>
      </div>
    </DashboardPanel>
  );
}

function CertificateBadge({ status }: { status: CertificateRecord["status"] }) {
  const label = status === "expired" ? "Expired" : status === "due-soon" ? "Due Soon" : "Due";
  const className =
    status === "expired"
      ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
      : status === "due-soon"
        ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
        : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200";

  return <span className={cn("rounded-full border px-2 py-1 text-[11px] font-extrabold", className)}>{label}</span>;
}

function getCertificateTimelinePosition(daysLeft: number) {
  const min = -20;
  const max = 180;
  const clamped = Math.max(min, Math.min(max, daysLeft));

  return ((clamped - min) / (max - min)) * 100;
}

function AnomalyDistributionPanel({ className }: { className?: string }) {
  const total = DASHBOARD_SEED_DATA.anomalyDistribution.reduce((sum, segment) => sum + segment.count, 0);
  const gradient = getAnomalyGradient(DASHBOARD_SEED_DATA.anomalyDistribution, total);

  return (
    <DashboardPanel title="Anomaly Severity Distribution" className={className}>
      <div className="flex items-center gap-4">
        <div className="relative grid h-36 w-36 shrink-0 place-items-center rounded-full" style={{ background: gradient }}>
          <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-center shadow-inner dark:bg-slate-900">
            <div>
              <p className="text-3xl font-black text-slate-950 dark:text-white">{total}</p>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Total</p>
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          {DASHBOARD_SEED_DATA.anomalyDistribution.map((segment) => (
            <div key={segment.severity} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2 font-bold text-slate-600 dark:text-slate-300">
                <span className={cn("h-2.5 w-2.5 rounded-full", ANOMALY_SEVERITY_STYLES[segment.severity].dot)} />
                {ANOMALY_SEVERITY_LABELS[segment.severity]}
              </span>
              <span className="font-extrabold text-slate-950 dark:text-white">
                {segment.count} <span className="text-xs font-bold text-slate-500">({getPercent(segment.count, total)}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <MiniMetric icon={Clock3} value={DASHBOARD_SEED_DATA.anomalySummary.overdueCorrectiveActions} label="Corrective Actions Overdue" tone="red" />
        <MiniMetric icon={CircleAlert} value={DASHBOARD_SEED_DATA.anomalySummary.waitingClientClarification} label="RFIs Waiting for Client Clarification" tone="blue" />
      </div>
    </DashboardPanel>
  );
}

function getAnomalyGradient(segments: typeof DASHBOARD_SEED_DATA.anomalyDistribution, total: number) {
  let current = 0;
  const stops = segments.map((segment) => {
    const start = current;
    const width = (segment.count / total) * 100;
    current += width;
    const color = ANOMALY_SEVERITY_STYLES[segment.severity].color;

    return `${color} ${start}% ${current}%`;
  });

  return `conic-gradient(${stops.join(", ")})`;
}

function MiniMetric({ icon: Icon, value, label, tone }: { icon: LucideIcon; value: number; label: string; tone: "red" | "blue" }) {
  return (
    <div className={cn("rounded-2xl border p-3", tone === "red" ? "border-red-100 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10" : "border-blue-100 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/10")}>
      <div className={cn("flex items-center gap-2", tone === "red" ? "text-red-700 dark:text-red-200" : "text-blue-700 dark:text-blue-200")}>
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span className="text-2xl font-black">{value}</span>
      </div>
      <p className="mt-1 text-xs font-bold text-slate-600 dark:text-slate-300">{label}</p>
    </div>
  );
}

function RbiProgressPanel({ className }: { className?: string }) {
  return (
    <DashboardPanel title="RBI Assessment Progress" subtitle="API 580-style RBI" className={className}>
      <div className="space-y-3">
        {DASHBOARD_SEED_DATA.rbiProgress.map((record) => {
          const percent = getRbiProgressPercent(record.assessed, record.total);

          return (
            <div key={record.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-slate-900 dark:text-white">{record.equipmentClass}</p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">{record.methodologyLabel}</p>
                </div>
                <p className="shrink-0 text-sm font-black text-slate-950 dark:text-white">
                  {record.assessed}/{record.total}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500" style={{ width: `${percent}%` }} />
                </div>
                <span className="w-10 text-right text-xs font-black text-slate-600 dark:text-slate-300">{percent}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardPanel>
  );
}

function DocumentCompletenessPanel({ className }: { className?: string }) {
  const total = getDocumentCompletenessTotal(DASHBOARD_SEED_DATA);

  return (
    <DashboardPanel title="Document Completeness Overview" className={className}>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex h-12 w-full overflow-hidden">
          {DASHBOARD_SEED_DATA.documentCompleteness.map((segment) => {
            const percent = getPercent(segment.count, total);
            const color =
              segment.status === "complete"
                ? "bg-emerald-500"
                : segment.status === "partial"
                  ? "bg-amber-400 text-amber-950"
                  : "bg-red-500 text-white";

            return (
              <div key={segment.status} className={cn("grid place-items-center text-xs font-black text-white", color)} style={{ width: `${percent}%` }}>
                {segment.count} ({percent}%)
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2 p-3 text-xs font-bold">
          {DASHBOARD_SEED_DATA.documentCompleteness.map((segment) => (
            <span key={segment.status} className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className={cn("h-2.5 w-2.5 rounded-full", segment.status === "complete" ? "bg-emerald-500" : segment.status === "partial" ? "bg-amber-400" : "bg-red-500")} />
              {segment.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {DASHBOARD_SEED_DATA.documentIssues.map((issue) => (
          <Link
            key={issue.id}
            href={issue.route}
            className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-3 py-2 text-sm transition hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-800 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10"
          >
            <span className="flex min-w-0 items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
              <FileWarning className="h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
              <span className="truncate">
                {issue.count} {issue.label}
              </span>
            </span>
            <span className="shrink-0 rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-extrabold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
              Action Required
            </span>
          </Link>
        ))}
      </div>
    </DashboardPanel>
  );
}

function CriticalAttentionPanel({
  className,
  rows,
  onSelectRow,
}: {
  className?: string;
  rows: CriticalAttentionRecord[];
  onSelectRow: (row: CriticalAttentionRecord) => void;
}) {
  return (
    <DashboardPanel
      title="Critical Attention"
      className={className}
      action={
        <Link href={APP_ROUTES.anomalies.register} className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
          View All
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      }
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-[1fr_86px_98px] bg-slate-50 text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
          <div className="px-3 py-2">Item / Issue</div>
          <div className="px-3 py-2">Severity</div>
          <div className="px-3 py-2 text-right">Due / Status</div>
        </div>
        {rows.map((row) => (
          <button
            key={row.id}
            type="button"
            onClick={() => onSelectRow(row)}
            className="grid w-full grid-cols-[1fr_86px_98px] border-t border-slate-200 text-left text-sm transition hover:bg-blue-50/60 dark:border-slate-800 dark:hover:bg-blue-500/10"
          >
            <div className="min-w-0 px-3 py-2">
              <p className="truncate font-extrabold text-slate-900 dark:text-white">{row.assetTag}</p>
              <p className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{row.issue}</p>
            </div>
            <div className="flex items-center px-3 py-2">
              <SeverityBadge severity={row.severity} />
            </div>
            <div className="flex items-center justify-end px-3 py-2 text-right">
              <span className={cn("text-xs font-extrabold", row.dueStatus.toLowerCase().includes("overdue") ? "text-red-600 dark:text-red-300" : "text-orange-600 dark:text-orange-300")}>
                {row.dueStatus}
              </span>
            </div>
          </button>
        ))}
      </div>
    </DashboardPanel>
  );
}

function SeverityBadge({ severity }: { severity: CriticalAttentionRecord["severity"] }) {
  const label = severity === "medium-high" ? "Med-High" : severity === "high" ? "High" : "Medium";
  const className =
    severity === "high"
      ? RISK_LEVEL_STYLES.high.badge
      : severity === "medium-high"
        ? RISK_LEVEL_STYLES["medium-high"].badge
        : RISK_LEVEL_STYLES.medium.badge;

  return <span className={cn("rounded-full border px-2 py-1 text-[11px] font-extrabold", className)}>{label}</span>;
}

function StatusBadge({ status }: { status: CriticalAttentionRecord["status"] }) {
  const label =
    status === "waiting-validation"
      ? "Waiting Validation"
      : status === "due-soon"
        ? "Due Soon"
        : "Open";
  const className =
    status === "waiting-validation"
      ? "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200"
      : status === "due-soon"
        ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
        : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200";

  return <span className={cn("rounded-full border px-2 py-1 text-xs font-extrabold", className)}>{label}</span>;
}

function CriticalAttentionSheet({
  item,
  onClose,
}: {
  item: CriticalAttentionRecord | null;
  onClose: () => void;
}) {
  if (!item) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 top-[var(--app-header-height)] z-40 flex justify-end bg-slate-950/35 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="critical-attention-title">
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close critical attention details" />
      <aside className="relative flex h-full w-full max-w-[480px] flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-wide text-blue-700 dark:text-blue-300">Critical Attention Detail</p>
            <h2 id="critical-attention-title" className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
              {item.assetTag}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{item.assetName}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white" aria-label="Close details">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 aim-shell-scrollbar">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-extrabold text-slate-950 dark:text-white">{item.issue}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <SeverityBadge severity={item.severity} />
              <StatusBadge status={item.status} />
              <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-extrabold text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                {item.dueStatus}
              </span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Taxonomy Labels</p>
            <div className="flex flex-wrap gap-2">
              {item.taxonomyLabels.map((label) => (
                <span key={label} className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200">
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Recommended Next Action</p>
            <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              {item.recommendedAction}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 p-5 dark:border-slate-800">
          <Link
            href={item.relatedRoute}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-700"
          >
            Open Related Workflow
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </aside>
    </div>
  );
}
