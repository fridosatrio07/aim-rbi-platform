"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  Database,
  ExternalLink,
  FileCheck2,
  FileWarning,
  ShieldAlert,
  TrendingUp,
  X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_ROUTES } from "@/lib/app-routes";
import { cn } from "@/lib/utils";

import { DashboardRightToolsBar } from "./dashboard-right-tools-bar";
import {
  DEFAULT_DASHBOARD_DATE_RANGE,
  DEFAULT_DASHBOARD_FILTERS,
  INSPECTION_STATUS_ORDER,
} from "../services/dashboard-filter-state";
import { DASHBOARD_SEED_DATA } from "../services/dashboard-seed-data";
import { exportDashboardSnapshot } from "../services/dashboard-snapshot-export";
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
  CertificateRecord,
  CriticalAttentionRecord,
  InspectionDueStatus,
  RiskLevel,
} from "../services/dashboard-types";
import type {
  DashboardCertificateFilter,
  DashboardDocumentFilter,
  DashboardFilterState,
  DashboardAnomalyFilter,
  DashboardRiskFilter,
} from "../services/dashboard-filter-state";

type SnapshotStatus = "idle" | "capturing" | "success" | "error";

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
  const [dateRange, setDateRange] = useState(DEFAULT_DASHBOARD_DATE_RANGE);
  const [filters, setFilters] = useState<DashboardFilterState>(DEFAULT_DASHBOARD_FILTERS);
  const [rightToolsOpen, setRightToolsOpen] = useState(true);
  const [snapshotStatus, setSnapshotStatus] = useState<SnapshotStatus>("idle");
  const [snapshotMessage, setSnapshotMessage] = useState<string | null>(null);
  const [selectedCriticalItem, setSelectedCriticalItem] = useState<CriticalAttentionRecord | null>(null);

  async function handleExportSnapshot() {
    setSnapshotStatus("capturing");
    setSnapshotMessage("Capturing Dashboard main content...");

    try {
      await exportDashboardSnapshot();
      setSnapshotStatus("success");
      setSnapshotMessage("Dashboard Snapshot exported as PNG.");
    } catch (error) {
      setSnapshotStatus("error");
      setSnapshotMessage(error instanceof Error ? error.message : "Dashboard Snapshot export failed.");
    }
  }

  return (
    <div
      className={cn(
        "relative transition-[padding] duration-300 ease-out",
        rightToolsOpen ? "lg:pr-[364px] 2xl:pr-[384px]" : "lg:pr-16",
      )}
    >
      <div
        id="dashboard-snapshot-area"
        className="space-y-4 bg-slate-50 pb-1 text-slate-950 dark:bg-slate-950 dark:text-slate-100"
      >
        <div className="min-w-0">
          <nav
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400"
            aria-label="Breadcrumb"
          >
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

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-12 2xl:grid-cols-[repeat(6,minmax(0,1fr))_minmax(240px,1.35fr)]">
          <KpiCard
            className="lg:col-span-2 xl:col-span-3 2xl:col-span-1"
            icon={Database}
            label="Total Assets"
            value={kpis.totalAssets}
            microText="+12 vs last 30 days"
            tone="blue"
          />
          <KpiCard
            className="lg:col-span-2 xl:col-span-3 2xl:col-span-1"
            icon={ShieldAlert}
            label="High-Risk Assets"
            value={kpis.highRiskAssets}
            microText={`${kpis.highRiskPercent.toFixed(1)}% of total assets`}
            tone="red"
          />
          <KpiCard
            className="lg:col-span-2 xl:col-span-3 2xl:col-span-1"
            icon={CalendarDays}
            label="Overdue Inspections"
            value={kpis.overdueInspections}
            microText={`${kpis.inspectionsDueWithin90Days} due within 90 days`}
            tone="orange"
          />
          <KpiCard
            className="lg:col-span-2 xl:col-span-3 2xl:col-span-1"
            icon={FileCheck2}
            label="Certificates Due ≤180 Days"
            value={kpis.certificatesDueWithin180Days}
            microText={`${kpis.expiredOrUrgentCertificates} expired / urgent evidence`}
            tone="cyan"
          />
          <KpiCard
            className="lg:col-span-2 xl:col-span-3 2xl:col-span-1"
            icon={AlertTriangle}
            label="Active Anomalies"
            value={kpis.activeAnomalies}
            microText={`${kpis.overdueCorrectiveActions} overdue corrective actions`}
            tone="violet"
          />
          <KpiCard
            className="lg:col-span-2 xl:col-span-3 2xl:col-span-1"
            icon={ClipboardCheck}
            label="Open Recommendations"
            value={kpis.openRecommendations}
            microText={`${kpis.waitingClientClarification} waiting client clarification`}
            tone="blue"
          />
          <ReadinessCard
            className="lg:col-span-6 xl:col-span-6 2xl:col-span-1"
            score={kpis.readinessScore}
            target={kpis.readinessTarget}
            delta={kpis.readinessDelta}
          />
        </div>

        <div className="grid gap-3 xl:grid-cols-12">
          <RiskMatrixPanel
            className="xl:col-span-4"
            riskFilter={filters.riskLevel}
            riskSummary={riskSummary}
            totalAssets={getTotalAssetCount(data)}
          />
          <InspectionTrendPanel className="xl:col-span-4" />
          <CertificationTimelinePanel
            className="xl:col-span-4"
            certificateStatusFilter={filters.certificateStatus}
            certificates={data.certificates}
          />
          <AnomalyDistributionPanel
            className="xl:col-span-3"
            anomalySeverityFilter={filters.anomalySeverity}
          />
          <RbiProgressPanel className="xl:col-span-3" />
          <DocumentCompletenessPanel
            className="xl:col-span-3"
            documentStatusFilter={filters.documentCompletenessStatus}
          />
          <CriticalAttentionPanel
            className="xl:col-span-12"
            rows={data.criticalAttention}
            onSelectRow={setSelectedCriticalItem}
          />
        </div>
      </div>

      <DashboardRightToolsBar
        key={[
          dateRange.presetId,
          dateRange.startDate,
          dateRange.endDate,
          ...Object.values(filters),
        ].join(":")}
        assetClasses={data.assetClasses}
        dateRange={dateRange}
        filters={filters}
        open={rightToolsOpen}
        snapshotMessage={snapshotMessage}
        snapshotStatus={snapshotStatus}
        onDateRangeChange={setDateRange}
        onExportSnapshot={handleExportSnapshot}
        onFiltersChange={setFilters}
        onOpenChange={setRightToolsOpen}
      />
      <CriticalAttentionSheet item={selectedCriticalItem} onClose={() => setSelectedCriticalItem(null)} />
    </div>
  );
}

function KpiCard({
  className,
  icon: Icon,
  label,
  value,
  microText,
  tone,
}: {
  className?: string;
  icon: LucideIcon;
  label: string;
  value: number | string;
  microText: string;
  tone: keyof typeof KPI_TONE_STYLES;
}) {
  return (
    <Card className={cn("h-full cursor-default rounded-2xl", className)}>
      <CardContent className="flex h-full min-h-[112px] items-center gap-3 p-3.5">
        <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl ring-1", KPI_TONE_STYLES[tone])}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold leading-4 text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">{value}</p>
          <p className="mt-1 truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{microText}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ReadinessCard({
  className,
  score,
  target,
  delta,
}: {
  className?: string;
  score: number;
  target: number;
  delta: number;
}) {
  const radius = 33;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <Card className={cn("cursor-default overflow-hidden rounded-2xl border-blue-700 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 text-white shadow-[0_18px_45px_rgba(37,99,235,0.28)]", className)}>
      <CardContent className="flex h-full min-h-[112px] items-center justify-between gap-3 p-3.5">
        <div className="min-w-0">
          <p className="text-xs font-extrabold text-blue-100">Overall Integrity Readiness Score</p>
          <p className="mt-1 text-4xl font-black tracking-tight">{score}%</p>
          <p className="mt-1 text-xs font-bold text-blue-100">Target ≥{target}%</p>
          <p className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-200">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
            {delta}% vs last 30 days
          </p>
        </div>
        <div className="relative grid h-20 w-20 shrink-0 place-items-center">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 88 88" aria-hidden="true">
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
    <Card className={cn("h-full min-w-0 rounded-2xl", className)}>
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
}: {
  className?: string;
  riskFilter: DashboardRiskFilter;
  riskSummary: Record<RiskLevel, number>;
  totalAssets: number;
}) {
  const cellsByKey = new Map(
    DASHBOARD_SEED_DATA.riskMatrix.map((cell) => [`${cell.likelihood}-${cell.consequence}`, cell]),
  );

  return (
    <DashboardPanel title="Risk Matrix" subtitle="Likelihood vs Consequence" className={className}>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_132px]">
        <div className="min-w-0">
          <div className="mb-2 grid grid-cols-[78px_repeat(5,minmax(36px,1fr))] gap-1 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
            <div />
            <div className="col-span-5 rounded-lg bg-slate-50 py-1 dark:bg-slate-950">Consequence</div>
            <div />
            {CONSEQUENCE_LABELS.map((label, index) => (
              <div key={label} className="truncate rounded-lg bg-slate-50 px-1 py-1 dark:bg-slate-950" title={label}>
                <span className="block text-xs text-slate-700 dark:text-slate-200">{index + 1}</span>
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[78px_repeat(5,minmax(36px,1fr))] gap-1">
            {[5, 4, 3, 2, 1].map((likelihood) => (
              <RiskMatrixRow
                key={likelihood}
                likelihood={likelihood}
                cellsByKey={cellsByKey}
                riskFilter={riskFilter}
              />
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between gap-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span>Likelihood</span>
            <span className="text-right">1 low consequence to 5 catastrophic</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {(["high", "medium-high", "medium", "low"] as RiskLevel[]).map((level) => (
            <div
              key={level}
              className={cn(
                "flex h-12 items-center justify-between gap-2 rounded-xl border px-3 text-sm font-extrabold transition",
                RISK_LEVEL_STYLES[level].badge,
                riskFilter !== "all" && riskFilter !== level && "opacity-40",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", RISK_LEVEL_STYLES[level].dot)} />
                <span className="truncate">{RISK_LEVEL_LABELS[level]}</span>
              </span>
              <span className="shrink-0">{riskSummary[level]}</span>
            </div>
          ))}

          <div className="flex h-12 items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs font-extrabold text-slate-500 dark:text-slate-400">Total Assets</p>
            <p className="text-xl font-black text-slate-950 dark:text-white">{totalAssets}</p>
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
}: {
  likelihood: number;
  cellsByKey: Map<string, (typeof DASHBOARD_SEED_DATA.riskMatrix)[number]>;
  riskFilter: DashboardRiskFilter;
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
          <div
            key={consequence}
            className={cn(
              "grid aspect-square min-h-10 place-items-center rounded-lg text-sm font-black transition",
              RISK_LEVEL_STYLES[cell.level].cell,
              dimmed && "opacity-35 grayscale",
            )}
            title={`${RISK_LEVEL_LABELS[cell.level]} risk: likelihood ${likelihood}, consequence ${consequence}, ${cell.count} assets`}
          >
            {cell.count}
          </div>
        );
      })}
    </>
  );
}

function InspectionTrendPanel({ className }: { className?: string }) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<InspectionDueStatus | null>(null);
  const maxTotal = Math.max(
    ...DASHBOARD_SEED_DATA.inspectionTrend.map((point) =>
      INSPECTION_STATUS_ORDER.reduce((total, status) => total + point.statuses[status], 0),
    ),
  );
  const latest = DASHBOARD_SEED_DATA.inspectionTrend[DASHBOARD_SEED_DATA.inspectionTrend.length - 1];

  useEffect(() => {
    if (!selectedStatus) return undefined;

    function clearSelectionOnOutsidePointerDown(event: PointerEvent) {
      if (!panelRef.current?.contains(event.target as Node)) {
        setSelectedStatus(null);
      }
    }

    document.addEventListener("pointerdown", clearSelectionOnOutsidePointerDown);

    return () => document.removeEventListener("pointerdown", clearSelectionOnOutsidePointerDown);
  }, [selectedStatus]);

  function toggleStatus(status: InspectionDueStatus) {
    setSelectedStatus((current) => (current === status ? null : status));
  }

  return (
    <DashboardPanel title="Inspection Due Trend" subtitle="By due status" className={className}>
      <div ref={panelRef}>
      <div className="mb-3 flex flex-wrap gap-2">
        {INSPECTION_STATUS_ORDER.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => toggleStatus(status)}
            aria-pressed={selectedStatus === status}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-extrabold transition",
              INSPECTION_STATUS_STYLES[status].bg,
              INSPECTION_STATUS_STYLES[status].text,
              INSPECTION_STATUS_STYLES[status].border,
              selectedStatus === status && "ring-4 ring-blue-500/10",
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
                        onClick={() => toggleStatus(status)}
                        title={`${point.label} ${INSPECTION_STATUS_LABELS[status]}: ${point.statuses[status]}`}
                        className={cn(
                          "w-full transition hover:brightness-110",
                          INSPECTION_STATUS_STYLES[status].segment,
                          selectedStatus && selectedStatus !== status && "opacity-45",
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
      </div>
    </DashboardPanel>
  );
}

function CertificationTimelinePanel({
  className,
  certificateStatusFilter,
  certificates,
}: {
  className?: string;
  certificateStatusFilter: DashboardCertificateFilter;
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
        {certificates.map((certificate) => {
          const dimmed = certificateStatusFilter !== "all" && certificateStatusFilter !== certificate.status;

          return (
            <div
              key={certificate.id}
              className={cn(
                "grid grid-cols-[1.15fr_0.9fr_0.55fr] border-t border-slate-200 text-sm transition dark:border-slate-800",
                dimmed && "opacity-35",
              )}
            >
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
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 px-3 py-3 dark:bg-slate-950">
        <div className="relative h-9">
          <div className="absolute left-0 right-0 top-4 h-1 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500" />
          {certificates.map((certificate) => {
            const dimmed = certificateStatusFilter !== "all" && certificateStatusFilter !== certificate.status;

            return (
              <Link
                key={certificate.id}
                href={certificate.route}
                title={`${certificate.assetTag} ${certificate.daysLeft < 0 ? "expired" : `${certificate.daysLeft} days left`}`}
                className={cn(
                  "absolute top-2 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full border-2 border-white shadow-sm transition dark:border-slate-950",
                  certificate.status === "expired" ? "bg-red-500" : certificate.status === "due-soon" ? "bg-amber-400" : "bg-emerald-500",
                  dimmed && "opacity-35",
                )}
                style={{ left: `${getCertificateTimelinePosition(certificate.daysLeft)}%` }}
                aria-label={`Open certificate record for ${certificate.assetTag}`}
              />
            );
          })}
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

function AnomalyDistributionPanel({
  className,
  anomalySeverityFilter,
}: {
  className?: string;
  anomalySeverityFilter: DashboardAnomalyFilter;
}) {
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
          {DASHBOARD_SEED_DATA.anomalyDistribution.map((segment) => {
            const dimmed = anomalySeverityFilter !== "all" && anomalySeverityFilter !== segment.severity;

            return (
              <div key={segment.severity} className={cn("flex items-center justify-between gap-3 text-sm transition", dimmed && "opacity-35")}>
                <span className="flex min-w-0 items-center gap-2 font-bold text-slate-600 dark:text-slate-300">
                  <span className={cn("h-2.5 w-2.5 rounded-full", ANOMALY_SEVERITY_STYLES[segment.severity].dot)} />
                  {ANOMALY_SEVERITY_LABELS[segment.severity]}
                </span>
                <span className="font-extrabold text-slate-950 dark:text-white">
                  {segment.count} <span className="text-xs font-bold text-slate-500">({getPercent(segment.count, total)}%)</span>
                </span>
              </div>
            );
          })}
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

function DocumentCompletenessPanel({
  className,
  documentStatusFilter,
}: {
  className?: string;
  documentStatusFilter: DashboardDocumentFilter;
}) {
  const total = getDocumentCompletenessTotal(DASHBOARD_SEED_DATA);

  return (
    <DashboardPanel title="Document Completeness" className={className}>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex h-12 w-full overflow-hidden">
          {DASHBOARD_SEED_DATA.documentCompleteness.map((segment) => {
            const percent = getPercent(segment.count, total);
            const dimmed = documentStatusFilter !== "all" && documentStatusFilter !== segment.status;
            const color =
              segment.status === "complete"
                ? "bg-emerald-500"
                : segment.status === "partial"
                  ? "bg-amber-400 text-amber-950"
                  : "bg-red-500 text-white";

            return (
              <div
                key={segment.status}
                className={cn("grid place-items-center text-xs font-black text-white transition", color, dimmed && "opacity-35")}
                style={{ width: `${percent}%` }}
              >
                {segment.count} ({percent}%)
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2 p-3 text-xs font-bold">
          {DASHBOARD_SEED_DATA.documentCompleteness.map((segment) => {
            const dimmed = documentStatusFilter !== "all" && documentStatusFilter !== segment.status;

            return (
              <span key={segment.status} className={cn("inline-flex items-center gap-2 text-slate-600 transition dark:text-slate-300", dimmed && "opacity-35")}>
                <span className={cn("h-2.5 w-2.5 rounded-full", segment.status === "complete" ? "bg-emerald-500" : segment.status === "partial" ? "bg-amber-400" : "bg-red-500")} />
                {segment.label}
              </span>
            );
          })}
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
        <div className="grid grid-cols-[minmax(0,1fr)_116px_148px_168px] bg-slate-50 text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
          <div className="px-3 py-2">Item / Issue</div>
          <div className="px-2 py-2 text-center">Severity</div>
          <div className="px-2 py-2 text-center">Status</div>
          <div className="px-3 py-2 text-right">Due / Status</div>
        </div>
        {rows.map((row) => (
          <button
            key={row.id}
            type="button"
            onClick={() => onSelectRow(row)}
            className="grid min-h-[58px] w-full grid-cols-[minmax(0,1fr)_116px_148px_168px] border-t border-slate-200 text-left text-sm transition hover:bg-blue-50/60 dark:border-slate-800 dark:hover:bg-blue-500/10"
          >
            <div className="min-w-0 px-3 py-2">
              <p className="truncate font-extrabold text-slate-900 dark:text-white">{row.assetTag}</p>
              <p className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{row.issue}</p>
            </div>
            <div className="flex items-center justify-center px-2 py-2">
              <SeverityBadge severity={row.severity} />
            </div>
            <div className="flex items-center justify-center px-2 py-2">
              <StatusBadge status={row.status} />
            </div>
            <div className="flex items-center justify-end px-3 py-2 text-right">
              <span className={cn("whitespace-nowrap text-xs font-extrabold", row.dueStatus.toLowerCase().includes("overdue") ? "text-red-600 dark:text-red-300" : "text-orange-600 dark:text-orange-300")}>
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

  return (
    <span className={cn("inline-flex h-7 min-w-[90px] items-center justify-center whitespace-nowrap rounded-full border px-3 text-[11px] font-extrabold", className)}>
      {label}
    </span>
  );
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

  return (
    <span className={cn("inline-flex h-7 min-w-[128px] items-center justify-center whitespace-nowrap rounded-full border px-3 text-[11px] font-extrabold", className)}>
      {label}
    </span>
  );
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
