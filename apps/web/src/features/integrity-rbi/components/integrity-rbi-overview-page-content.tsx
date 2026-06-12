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
  ClipboardCheck,
  ClipboardList,
  Database,
  FileText,
  Gauge,
  LineChart,
  Radar,
  ShieldAlert,
  Target,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_ROUTES } from "@/lib/app-routes";
import { cn } from "@/lib/utils";

import { INTEGRITY_RBI_OVERVIEW_DATA } from "../services/integrity-rbi-overview-data";
import {
  OVERVIEW_RISK_COLORS,
  getHighAndMediumHighSummary,
  getHighZoneCount,
  getMatrixCell,
  getMaxDamageMechanismCount,
  getRiskDistributionGradient,
  getRiskDistributionTotal,
} from "../services/integrity-rbi-overview-selectors";
import type {
  DamageMechanismSummary,
  EquipmentCompletionItem,
  HighRiskAssetSummary,
  IntegrityRbiChildPage,
  IntegrityRbiKpi,
  OverviewIssueSeverity,
  OverviewRiskLevel,
  RecentAssessmentSummary,
  RevalidationScheduleItem,
  RiskDistributionSegment,
  RiskMatrixCell,
  WorkflowStageSummary,
} from "../services/integrity-rbi-overview-types";

type HighRiskSortKey = "rank" | "riskScore";
type AssessmentSortKey = "rank" | "assessmentDate";
type SortDirection = "asc" | "desc";

const KPI_ICONS: Record<string, LucideIcon> = {
  "total-assets": Database,
  "high-risk": ShieldAlert,
  completion: CheckCircle2,
  "overdue-inspections": CalendarDays,
  "next-revalidation": Target,
  "actions-anomalies": AlertTriangle,
};

const CHILD_PAGE_ICONS: Record<string, LucideIcon> = {
  "risk-register": ClipboardList,
  "risk-analytics": LineChart,
  assessments: ClipboardCheck,
  revalidation: CalendarDays,
  "iow-moc": Gauge,
  "ffs-rla": ShieldAlert,
  methodology: FileText,
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

const MATRIX_ZONE_STYLES = {
  high: "bg-red-500 text-white shadow-sm shadow-red-950/10",
  medium: "bg-amber-300 text-amber-950 dark:bg-amber-400 dark:text-amber-950",
  low: "bg-emerald-500 text-white",
} as const;

export function IntegrityRbiOverviewPageContent() {
  const data = INTEGRITY_RBI_OVERVIEW_DATA;
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<OverviewRiskLevel | "all">("all");
  const [selectedMatrixCell, setSelectedMatrixCell] = useState<RiskMatrixCell | null>(null);
  const [selectedDamageId, setSelectedDamageId] = useState<string | null>(null);
  const [highRiskSort, setHighRiskSort] = useState<HighRiskSortKey>("rank");
  const [assessmentSort, setAssessmentSort] = useState<AssessmentSortKey>("assessmentDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const highRiskAssets = useMemo(() => {
    const sorted = [...data.topHighRiskAssets].sort((a, b) => {
      const comparison = highRiskSort === "rank" ? a.rank - b.rank : a.riskScore - b.riskScore;

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [data.topHighRiskAssets, highRiskSort, sortDirection]);

  const recentAssessments = useMemo(() => {
    return [...data.recentAssessments].sort((a, b) => {
      const comparison =
        assessmentSort === "rank"
          ? a.rank - b.rank
          : new Date(a.assessmentDate).getTime() - new Date(b.assessmentDate).getTime();

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [assessmentSort, data.recentAssessments, sortDirection]);

  function handleHighRiskSort(sortKey: HighRiskSortKey) {
    setHighRiskSort((current) => {
      if (current === sortKey) {
        setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
        return current;
      }

      setSortDirection(sortKey === "rank" ? "asc" : "desc");
      return sortKey;
    });
  }

  function handleAssessmentSort(sortKey: AssessmentSortKey) {
    setAssessmentSort((current) => {
      if (current === sortKey) {
        setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
        return current;
      }

      setSortDirection(sortKey === "rank" ? "asc" : "desc");
      return sortKey;
    });
  }

  return (
    <div className="space-y-4 text-slate-950 dark:text-slate-100">
      <header className="min-w-0">
        <nav className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
          <Link href={APP_ROUTES.rbi.overview} className="transition hover:text-blue-700 dark:hover:text-blue-200">
            Integrity / RBI
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-700 dark:text-slate-200">Overview</span>
        </nav>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          Integrity / RBI Overview
        </h1>
      </header>

      <FacilityContextCard />
      <KpiCards kpis={data.kpis} />
      <ChildPageCards pages={data.childPages} />

      <div className="grid gap-4 xl:grid-cols-12">
        <RiskDistributionCard
          className="xl:col-span-4"
          selectedRiskLevel={selectedRiskLevel}
          segments={data.riskDistribution}
          onSelectedRiskLevelChange={setSelectedRiskLevel}
        />
        <RiskMatrixCard
          cells={data.riskMatrix}
          className="xl:col-span-4"
          selectedCell={selectedMatrixCell}
          onSelectCell={setSelectedMatrixCell}
        />
        <DamageMechanismCard
          className="xl:col-span-4"
          items={data.damageMechanisms}
          selectedDamageId={selectedDamageId}
          onSelectDamageId={setSelectedDamageId}
        />

        <InspectionEffectivenessCard className="xl:col-span-3" />
        <AssessmentCompletionCard className="xl:col-span-3" items={data.assessmentCompletion} />
        <RevalidationScheduleCard className="xl:col-span-3" items={data.revalidationSchedule} />
        <GovernanceStandardsCard className="xl:col-span-3" />

        <TopHighRiskAssetsTable
          assets={highRiskAssets}
          className="xl:col-span-6"
          sortDirection={sortDirection}
          sortKey={highRiskSort}
          onSort={handleHighRiskSort}
        />
        <IntegrityIssuesCard className="xl:col-span-3" />
        <RecentAssessmentsTable
          assessments={recentAssessments}
          className="xl:col-span-3"
          sortDirection={sortDirection}
          sortKey={assessmentSort}
          onSort={handleAssessmentSort}
        />
      </div>

      <WorkflowSection stages={data.workflow.stages} />
    </div>
  );
}

function FacilityContextCard() {
  const facility = INTEGRITY_RBI_OVERVIEW_DATA.facility;

  return (
    <Card className="overflow-hidden rounded-2xl">
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)_minmax(360px,0.9fr)]">
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-blue-700 dark:text-blue-300">Facility Context</p>
          <h2 className="mt-1 text-lg font-black leading-6 text-slate-950 dark:text-white">{facility.name}</h2>
          <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <span>Owner: {facility.owner}</span>
            <span>Facility Type: {facility.type}</span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Operating Mode</p>
          <div className="flex flex-wrap gap-2">
            {facility.operatingMode.map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-3 dark:border-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10">
          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-blue-700 dark:text-blue-300">Nominal Throughput</p>
          <div className="grid grid-cols-2 gap-2">
            {facility.throughput.map((item) => (
              <div key={item.id} className="rounded-xl bg-white/80 px-3 py-2 dark:bg-slate-950/70">
                <p className="text-sm font-black text-slate-950 dark:text-white">{item.value}</p>
                <p className="mt-0.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function KpiCards({ kpis }: { kpis: IntegrityRbiKpi[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      {kpis.map((kpi) => {
        const Icon = KPI_ICONS[kpi.id] ?? BarChart3;

        return (
          <Link key={kpi.id} href={kpi.href} className="group rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
            <Card className="h-full rounded-2xl transition group-hover:-translate-y-0.5 group-hover:border-blue-200 group-hover:shadow-lg group-hover:shadow-blue-950/5 dark:group-hover:border-blue-500/30">
              <CardContent className="flex min-h-[112px] items-center gap-3 p-3.5">
                <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl border", TONE_STYLES[kpi.tone])}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">{kpi.label}</p>
                  <p className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">{kpi.value}</p>
                  <p className="mt-1 truncate text-xs font-bold text-slate-500 dark:text-slate-400">{kpi.marker}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

function ChildPageCards({ pages }: { pages: IntegrityRbiChildPage[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
      {pages.map((page) => {
        const Icon = CHILD_PAGE_ICONS[page.id] ?? ClipboardList;

        return (
          <Link key={page.id} href={page.href} className="group rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
            <Card className="h-full rounded-2xl transition group-hover:-translate-y-0.5 group-hover:border-blue-200 group-hover:bg-blue-50/40 dark:group-hover:border-blue-500/30 dark:group-hover:bg-blue-500/10">
              <CardContent className="flex h-full min-h-[126px] flex-col justify-between p-3.5">
                <div>
                  <div className={cn("mb-3 grid h-9 w-9 place-items-center rounded-xl border", TONE_STYLES[page.tone])}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-black text-slate-950 dark:text-white">{page.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">{page.descriptor}</p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-blue-700 dark:text-blue-300">
                  Open
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

function OverviewPanel({
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
      <CardHeader className="flex-row items-start justify-between gap-3 p-4 pb-3">
        <div className="flex min-w-0 items-start gap-2.5">
          {Icon ? (
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
          ) : null}
          <div className="min-w-0">
            <CardTitle className="truncate text-base font-extrabold text-slate-950 dark:text-white">{title}</CardTitle>
            {subtitle ? <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className="p-4 pt-0">{children}</CardContent>
    </Card>
  );
}

function RiskDistributionCard({
  className,
  segments,
  selectedRiskLevel,
  onSelectedRiskLevelChange,
}: {
  className?: string;
  segments: RiskDistributionSegment[];
  selectedRiskLevel: OverviewRiskLevel | "all";
  onSelectedRiskLevelChange: (level: OverviewRiskLevel | "all") => void;
}) {
  const total = getRiskDistributionTotal(segments);
  const highSummary = getHighAndMediumHighSummary(segments);
  const gradient = getRiskDistributionGradient(segments);

  return (
    <OverviewPanel
      className={className}
      icon={BarChart3}
      title="Risk Distribution"
      subtitle="Asset risk portfolio by category"
      action={<LinkArrow href={APP_ROUTES.rbi.riskRegister} label="Register" />}
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative grid h-36 w-36 shrink-0 place-items-center rounded-full outline-none ring-offset-2 transition hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-blue-300"
          style={{ background: gradient }}
          onClick={() => onSelectedRiskLevelChange("all")}
          aria-label="Clear risk distribution selection"
        >
          <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-center shadow-inner dark:bg-slate-900">
            <div>
              <p className="text-3xl font-black text-slate-950 dark:text-white">{total}</p>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Assets</p>
            </div>
          </div>
        </button>
        <div className="min-w-0 flex-1 space-y-2">
          {segments.map((segment) => {
            const selected = selectedRiskLevel === "all" || selectedRiskLevel === segment.level;

            return (
              <button
                key={segment.level}
                type="button"
                onClick={() => onSelectedRiskLevelChange(selectedRiskLevel === segment.level ? "all" : segment.level)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm transition hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-800 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10",
                  selectedRiskLevel === segment.level && "border-blue-200 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/10",
                  !selected && "opacity-45",
                )}
              >
                <span className="flex min-w-0 items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: OVERVIEW_RISK_COLORS[segment.level] }} />
                  <span className="truncate">{segment.label}</span>
                </span>
                <span className="font-black text-slate-950 dark:text-white">{segment.count}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50 px-3 py-2 text-sm font-bold text-orange-800 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200">
        High + Medium-High: {highSummary.count} assets, {highSummary.percent}%
      </div>
    </OverviewPanel>
  );
}

function RiskMatrixCard({
  cells,
  className,
  selectedCell,
  onSelectCell,
}: {
  cells: RiskMatrixCell[];
  className?: string;
  selectedCell: RiskMatrixCell | null;
  onSelectCell: (cell: RiskMatrixCell | null) => void;
}) {
  const highZoneCount = getHighZoneCount(cells);
  const selectedSummary = selectedCell
    ? `PoF ${selectedCell.probability} / CoF ${selectedCell.consequence}: ${selectedCell.count} assets`
    : `High Zone: ${highZoneCount} assets`;

  return (
    <OverviewPanel className={className} icon={Radar} title="PoF / CoF Summary" subtitle="Compact RBI-style 5x5 matrix">
      <div className="mb-2 grid grid-cols-[86px_repeat(5,minmax(40px,1fr))] gap-1 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
        <div />
        <div className="col-span-5 rounded-lg bg-slate-50 py-1 dark:bg-slate-950">Consequence of Failure</div>
        <div />
        {["1", "2", "3", "4", "5"].map((label) => (
          <div key={label} className="rounded-lg bg-slate-50 px-1 py-1 dark:bg-slate-950">{label}</div>
        ))}
      </div>
      <div className="grid grid-cols-[86px_repeat(5,minmax(40px,1fr))] gap-1">
        {[5, 4, 3, 2, 1].map((probability) => (
          <MatrixRow
            key={probability}
            cells={cells}
            probability={probability}
            selectedCell={selectedCell}
            onSelectCell={onSelectCell}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        <span>Probability of Failure</span>
        <span className="text-right font-black text-slate-950 dark:text-white">{selectedSummary}</span>
      </div>
    </OverviewPanel>
  );
}

function MatrixRow({
  cells,
  probability,
  selectedCell,
  onSelectCell,
}: {
  cells: RiskMatrixCell[];
  probability: number;
  selectedCell: RiskMatrixCell | null;
  onSelectCell: (cell: RiskMatrixCell | null) => void;
}) {
  return (
    <>
      <div className="flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 px-2 py-1 dark:bg-slate-950">
        <span className="text-sm font-black text-slate-950 dark:text-white">{probability}</span>
        <span className="truncate text-[10px] font-bold text-slate-500 dark:text-slate-400">{getProbabilityLabel(probability)}</span>
      </div>
      {[1, 2, 3, 4, 5].map((consequence) => {
        const cell = getMatrixCell(cells, probability, consequence);
        if (!cell) return <div key={consequence} />;
        const selected = selectedCell?.probability === probability && selectedCell.consequence === consequence;

        return (
          <button
            key={consequence}
            type="button"
            onClick={() => onSelectCell(selected ? null : cell)}
            className={cn(
              "grid aspect-square min-h-12 place-items-center rounded-xl text-sm font-black transition hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
              MATRIX_ZONE_STYLES[cell.zone],
              selected && "ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-slate-950",
            )}
            title={`PoF ${probability}, CoF ${consequence}: ${cell.count} assets`}
          >
            {cell.count}
          </button>
        );
      })}
    </>
  );
}

function DamageMechanismCard({
  className,
  items,
  selectedDamageId,
  onSelectDamageId,
}: {
  className?: string;
  items: DamageMechanismSummary[];
  selectedDamageId: string | null;
  onSelectDamageId: (id: string | null) => void;
}) {
  const max = getMaxDamageMechanismCount(items);

  return (
    <OverviewPanel className={className} icon={Gauge} title="Damage Mechanism Distribution" subtitle="Dominant integrity drivers">
      <div className="space-y-2">
        {items.map((item) => {
          const selected = selectedDamageId === null || selectedDamageId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectDamageId(selectedDamageId === item.id ? null : item.id)}
              className={cn(
                "grid w-full grid-cols-[minmax(0,1fr)_minmax(120px,1.2fr)_36px] items-center gap-3 rounded-xl px-2 py-1.5 text-left transition hover:bg-blue-50/60 dark:hover:bg-blue-500/10",
                selectedDamageId === item.id && "bg-blue-50 dark:bg-blue-500/10",
                !selected && "opacity-40",
              )}
            >
              <span className="truncate text-xs font-bold text-slate-600 dark:text-slate-300" title={item.label}>{item.label}</span>
              <span className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <span className="block h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" style={{ width: `${(item.count / max) * 100}%` }} />
              </span>
              <span className="text-right text-xs font-black text-slate-950 dark:text-white">{item.count}</span>
            </button>
          );
        })}
      </div>
    </OverviewPanel>
  );
}

function InspectionEffectivenessCard({ className }: { className?: string }) {
  const data = INTEGRITY_RBI_OVERVIEW_DATA.inspectionEffectiveness;
  const maxValue = Math.max(...data.items.map((item) => item.value), 1);

  return (
    <OverviewPanel
      className={className}
      icon={ClipboardCheck}
      title="Inspection Effectiveness"
      subtitle={`Effectiveness score: ${data.score} / 100`}
      action={<LinkArrow href={APP_ROUTES.inspections.overview} label="Inspections" />}
    >
      <div className="mb-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500" style={{ width: `${data.score}%` }} />
      </div>
      <div className="space-y-2">
        {data.items.map((item) => (
          <ProgressRow key={item.id} label={item.label} tone={item.tone} value={item.value} maxValue={maxValue} />
        ))}
      </div>
    </OverviewPanel>
  );
}

function AssessmentCompletionCard({ className, items }: { className?: string; items: EquipmentCompletionItem[] }) {
  return (
    <OverviewPanel
      className={className}
      icon={CheckCircle2}
      title="RBI Assessment Completion"
      subtitle="Completion by equipment class"
      action={<LinkArrow href={APP_ROUTES.rbi.assessments} label="View by Workstage" />}
    >
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id}>
            <div className="mb-1 flex items-center justify-between gap-2 text-xs font-bold">
              <span className="truncate text-slate-600 dark:text-slate-300">{item.label}</span>
              <span className="font-black text-slate-950 dark:text-white">{item.percent}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" style={{ width: `${item.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </OverviewPanel>
  );
}

function RevalidationScheduleCard({ className, items }: { className?: string; items: RevalidationScheduleItem[] }) {
  return (
    <OverviewPanel
      className={className}
      icon={CalendarDays}
      title="Next Revalidation Schedule"
      action={<LinkArrow href={APP_ROUTES.rbi.revalidation} label="View Plan" />}
    >
      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="grid grid-cols-[minmax(0,1fr)_88px_76px] items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm transition hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-800 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10"
          >
            <span className="min-w-0">
              <span className="block truncate font-black text-slate-950 dark:text-white">{item.assetTag} {item.assetName}</span>
            </span>
            <span className="whitespace-nowrap text-xs font-bold text-slate-500 dark:text-slate-400">{item.dueDate}</span>
            <StatusBadge status={item.status} />
          </Link>
        ))}
      </div>
    </OverviewPanel>
  );
}

function GovernanceStandardsCard({ className }: { className?: string }) {
  return (
    <OverviewPanel
      className={className}
      icon={FileText}
      title="Applicable Standards & Governance"
      action={<LinkArrow href={APP_ROUTES.rbi.methodologyGovernance} label="Methodology" />}
    >
      <div className="space-y-2">
        {INTEGRITY_RBI_OVERVIEW_DATA.governanceStandards.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm transition hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-800 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10"
          >
            <span className="min-w-0">
              <span className="block truncate font-black text-slate-950 dark:text-white">{item.label}</span>
              <span className="block truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{item.category}</span>
            </span>
            <StatusBadge status={item.status} />
          </Link>
        ))}
      </div>
    </OverviewPanel>
  );
}

function TopHighRiskAssetsTable({
  assets,
  className,
  sortDirection,
  sortKey,
  onSort,
}: {
  assets: HighRiskAssetSummary[];
  className?: string;
  sortDirection: SortDirection;
  sortKey: HighRiskSortKey;
  onSort: (sortKey: HighRiskSortKey) => void;
}) {
  return (
    <OverviewPanel
      className={className}
      icon={ShieldAlert}
      title="Top High-Risk Assets"
      action={<LinkArrow href={APP_ROUTES.rbi.riskRegister} label="View Full Risk Register" />}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-[110px_minmax(0,1fr)_104px_82px_minmax(0,1.2fr)] bg-slate-50 text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
          <div className="px-3 py-2">Asset Tag</div>
          <div className="px-3 py-2">Equipment/System</div>
          <SortableMiniHeader active={sortKey === "riskScore"} direction={sortDirection} label="Risk Score" onClick={() => onSort("riskScore")} />
          <SortableMiniHeader active={sortKey === "rank"} direction={sortDirection} label="Rank" onClick={() => onSort("rank")} />
          <div className="px-3 py-2">Drivers</div>
        </div>
        {assets.map((asset) => (
          <Link
            key={asset.id}
            href={asset.href}
            className="grid min-h-[52px] grid-cols-[110px_minmax(0,1fr)_104px_82px_minmax(0,1.2fr)] items-center border-t border-slate-200 text-sm transition hover:bg-blue-50/50 dark:border-slate-800 dark:hover:bg-blue-500/10"
          >
            <div className="px-3 py-2 font-black text-slate-950 dark:text-white">{asset.assetTag}</div>
            <div className="min-w-0 px-3 py-2 font-bold text-slate-700 dark:text-slate-200">
              <span className="truncate">{asset.equipmentSystem}</span>
            </div>
            <div className="px-3 py-2 text-right font-black text-red-600 dark:text-red-300">{asset.riskScore.toFixed(1)}</div>
            <div className="px-3 py-2 text-right font-black text-slate-950 dark:text-white">{asset.rank}</div>
            <div className="flex flex-wrap gap-1 px-3 py-2">
              {asset.drivers.map((driver) => (
                <span key={driver} className="rounded-full border border-orange-100 bg-orange-50 px-2 py-0.5 text-[11px] font-bold text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200">
                  {driver}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </OverviewPanel>
  );
}

function IntegrityIssuesCard({ className }: { className?: string }) {
  return (
    <OverviewPanel
      className={className}
      icon={AlertTriangle}
      title="Integrity Issues & Alerts"
      action={<LinkArrow href={APP_ROUTES.anomalies.register} label="View All Issues" />}
    >
      <div className="space-y-2">
        {INTEGRITY_RBI_OVERVIEW_DATA.integrityIssues.map((issue) => (
          <Link
            key={issue.id}
            href={issue.href}
            className="block rounded-2xl border border-slate-200 p-3 text-sm transition hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-800 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <IssueSeverityBadge severity={issue.severity} />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{issue.date}</span>
            </div>
            <p className="line-clamp-2 font-bold leading-5 text-slate-800 dark:text-slate-100">{issue.title}</p>
          </Link>
        ))}
      </div>
    </OverviewPanel>
  );
}

function RecentAssessmentsTable({
  assessments,
  className,
  sortDirection,
  sortKey,
  onSort,
}: {
  assessments: RecentAssessmentSummary[];
  className?: string;
  sortDirection: SortDirection;
  sortKey: AssessmentSortKey;
  onSort: (sortKey: AssessmentSortKey) => void;
}) {
  return (
    <OverviewPanel
      className={className}
      icon={ClipboardCheck}
      title="Recent Assessments"
      action={<LinkArrow href={APP_ROUTES.rbi.assessments} label="View All Assessments" />}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-[82px_minmax(0,1fr)_90px_64px_92px] bg-slate-50 text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
          <div className="px-3 py-2">Asset</div>
          <div className="px-3 py-2">Method</div>
          <SortableMiniHeader active={sortKey === "assessmentDate"} direction={sortDirection} label="Date" onClick={() => onSort("assessmentDate")} />
          <SortableMiniHeader active={sortKey === "rank"} direction={sortDirection} label="Rank" onClick={() => onSort("rank")} />
          <div className="px-3 py-2">Status</div>
        </div>
        {assessments.map((assessment) => (
          <Link
            key={assessment.id}
            href={assessment.href}
            className="grid min-h-[52px] grid-cols-[82px_minmax(0,1fr)_90px_64px_92px] items-center border-t border-slate-200 text-sm transition hover:bg-blue-50/50 dark:border-slate-800 dark:hover:bg-blue-500/10"
          >
            <div className="px-3 py-2 font-black text-slate-950 dark:text-white">{assessment.assetTag}</div>
            <div className="min-w-0 px-3 py-2 font-bold text-slate-700 dark:text-slate-200">
              <span className="truncate">{assessment.method}</span>
            </div>
            <div className="px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400">{assessment.assessmentDate}</div>
            <div className="px-3 py-2 text-right font-black text-slate-950 dark:text-white">{assessment.rank}</div>
            <div className="px-3 py-2">
              <StatusBadge status={assessment.status} />
            </div>
          </Link>
        ))}
      </div>
    </OverviewPanel>
  );
}

function WorkflowSection({ stages }: { stages: WorkflowStageSummary[] }) {
  const workflow = INTEGRITY_RBI_OVERVIEW_DATA.workflow;

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex-row items-center justify-between gap-3 p-4 pb-3">
        <div>
          <CardTitle className="text-base font-extrabold text-slate-950 dark:text-white">Integrity / RBI Workflow</CardTitle>
          <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Assessment to mitigation planning workstream status</p>
        </div>
        <div className="min-w-[180px] rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wide">Workflow Health</span>
            <span className="text-lg font-black">{workflow.healthPercent}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/80 dark:bg-slate-950">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${workflow.healthPercent}%` }} />
          </div>
          <p className="mt-1 text-xs font-bold">Status: {workflow.status}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid gap-3 lg:grid-cols-5">
          {stages.map((stage) => (
            <Link
              key={stage.id}
              href={stage.href}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-lg hover:shadow-blue-950/5 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="font-black text-slate-950 dark:text-white">{stage.label}</p>
                <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-300" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                {stage.metrics.map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-sm dark:bg-slate-900">
                    <span className="truncate font-bold text-slate-600 dark:text-slate-300">{metric.label}</span>
                    <span className={cn("font-black", getToneTextClass(metric.tone))}>{metric.value}</span>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressRow({
  label,
  maxValue,
  tone,
  value,
}: {
  label: string;
  maxValue: number;
  tone: "red" | "orange" | "blue" | "emerald" | "slate";
  value: number;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2 text-xs font-bold">
        <span className="truncate text-slate-600 dark:text-slate-300">{label}</span>
        <span className={cn("font-black", getToneTextClass(tone))}>{value}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className={cn("h-full rounded-full", getToneBarClass(tone))} style={{ width: `${(value / maxValue) * 100}%` }} />
      </div>
    </div>
  );
}

function SortableMiniHeader({
  active,
  direction,
  label,
  onClick,
}: {
  active: boolean;
  direction: SortDirection;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("px-3 py-2 text-right transition hover:text-blue-700 dark:hover:text-blue-200", active && "text-blue-700 dark:text-blue-200")}
    >
      {label} {active ? (direction === "asc" ? "Asc" : "Desc") : "Sort"}
    </button>
  );
}

function LinkArrow({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
      {label}
      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "Due Soon" || status === "In Review"
      ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-200"
      : status === "Planned"
        ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200"
        : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200";

  return (
    <span className={cn("inline-flex h-6 min-w-[70px] items-center justify-center whitespace-nowrap rounded-full border px-2 text-[10px] font-extrabold", className)}>
      {status}
    </span>
  );
}

function IssueSeverityBadge({ severity }: { severity: OverviewIssueSeverity }) {
  const label = severity.charAt(0).toUpperCase() + severity.slice(1);
  const className =
    severity === "critical"
      ? "border-red-300 bg-red-100 text-red-800 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-100"
      : severity === "high"
        ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
        : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200";

  return (
    <span className={cn("inline-flex h-6 min-w-[70px] items-center justify-center whitespace-nowrap rounded-full border px-2 text-[10px] font-extrabold", className)}>
      {label}
    </span>
  );
}

function getProbabilityLabel(probability: number) {
  switch (probability) {
    case 5:
      return "Almost Certain";
    case 4:
      return "Likely";
    case 3:
      return "Possible";
    case 2:
      return "Unlikely";
    default:
      return "Rare";
  }
}

function getToneTextClass(tone: "red" | "orange" | "blue" | "emerald" | "slate") {
  switch (tone) {
    case "red":
      return "text-red-600 dark:text-red-300";
    case "orange":
      return "text-orange-600 dark:text-orange-300";
    case "blue":
      return "text-blue-600 dark:text-blue-300";
    case "emerald":
      return "text-emerald-600 dark:text-emerald-300";
    default:
      return "text-slate-700 dark:text-slate-200";
  }
}

function getToneBarClass(tone: "red" | "orange" | "blue" | "emerald" | "slate") {
  switch (tone) {
    case "red":
      return "bg-red-500";
    case "orange":
      return "bg-orange-500";
    case "blue":
      return "bg-blue-500";
    case "emerald":
      return "bg-emerald-500";
    default:
      return "bg-slate-500";
  }
}
