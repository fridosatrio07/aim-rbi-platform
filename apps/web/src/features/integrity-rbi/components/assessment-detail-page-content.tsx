"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Database,
  FileSearch,
  FileText,
  Gauge,
  Layers3,
  Link2,
  MessageSquareWarning,
  PanelRightOpen,
  Save,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_ROUTES } from "@/lib/app-routes";
import { cn } from "@/lib/utils";

import { RBI_ASSESSMENT_DETAIL_DATA } from "../services/assessment-detail-data";
import type {
  AssessmentAccordionSection,
  AssessmentConfidenceLevel,
  AssessmentDataQualityLevel,
  AssessmentDetailKpi,
  AssessmentDetailRiskLevel,
  AssessmentEvidenceItem,
  AssessmentStepPreview,
  AssessmentWorkflowStep,
  DamageMechanismReviewRow,
  DamageScreeningResult,
  EvidenceStatusFilter,
  MechanismCategoryFilter,
} from "../services/assessment-detail-types";

const data = RBI_ASSESSMENT_DETAIL_DATA;

const KPI_ICONS: Record<string, LucideIcon> = {
  "overall-risk": ShieldCheck,
  pof: Gauge,
  cof: AlertTriangle,
  rank: Target,
  "inspection-effectiveness": ClipboardCheck,
  comments: MessageSquareWarning,
};

const STEP_ICONS: Record<string, LucideIcon> = {
  "assessment-basis": BookOpenCheck,
  "asset-operating-info": Database,
  "damage-mechanism-review": SlidersHorizontal,
  "pof-evaluation": Gauge,
  "cof-evaluation": AlertTriangle,
  "risk-target": Target,
  "inspection-mitigation-plan": ClipboardCheck,
  "review-acceptance": ShieldCheck,
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

const MECHANISM_CATEGORY_OPTIONS: Array<{ value: MechanismCategoryFilter; label: string }> = [
  { value: "all", label: "All Categories" },
  { value: "internal-corrosion", label: "Internal Corrosion" },
  { value: "external-corrosion", label: "External Corrosion" },
  { value: "mechanical-integrity", label: "Mechanical Integrity" },
  { value: "documentation-control", label: "Documentation Control" },
];

const EVIDENCE_STATUS_OPTIONS: Array<{ value: EvidenceStatusFilter; label: string }> = [
  { value: "all", label: "All Evidence" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
  { value: "clarification", label: "Requires Clarification" },
];

export function AssessmentDetailPageContent() {
  const [activeStepId, setActiveStepId] = useState("damage-mechanism-review");
  const [mechanismCategory, setMechanismCategory] = useState<MechanismCategoryFilter>("all");
  const [evidenceStatus, setEvidenceStatus] = useState<EvidenceStatusFilter>("all");
  const [mechanismSearch, setMechanismSearch] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [clarificationOpen, setClarificationOpen] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [draftRfiCount, setDraftRfiCount] = useState(0);

  const activeStep = useMemo(
    () => data.workflowSteps.find((step) => step.id === activeStepId) ?? data.workflowSteps[2],
    [activeStepId],
  );
  const activePreview = useMemo(
    () => data.stepPreviews.find((preview) => preview.stepId === activeStep.id) ?? data.stepPreviews[2],
    [activeStep.id],
  );
  const filteredMechanisms = useMemo(
    () => filterDamageMechanisms(data.damageMechanisms, mechanismCategory, evidenceStatus, mechanismSearch),
    [evidenceStatus, mechanismCategory, mechanismSearch],
  );

  function toggleAccordion(sectionId: string) {
    setExpandedSections((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }));
  }

  function handleSaveDraft() {
    const timestamp = new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());

    setSavedAt(timestamp);
    setActionNotice("Draft workspace tersimpan lokal untuk sesi review ini.");
  }

  function handleSubmitForReview() {
    const pendingGateCount = data.statusPanel.acceptanceGates.filter((gate) => gate.status !== "complete").length;

    if (data.statusPanel.reviewHealth.unresolvedRfis > 0 || pendingGateCount > 0) {
      setActionNotice(
        `Submit ditahan: ${data.statusPanel.reviewHealth.unresolvedRfis} RFI belum selesai dan ${pendingGateCount} acceptance gate belum lengkap.`,
      );
      return;
    }

    setActionNotice("Assessment siap dikirim ke Technical Authority.");
  }

  function handleCreateClarification() {
    setDraftRfiCount((current) => current + 1);
    setActionNotice("Draft RFI dibuat untuk konfirmasi H2S content dan PSV-1203 set-pressure package.");
    setClarificationOpen(false);
  }

  return (
    <div className="space-y-4 text-slate-950 dark:text-slate-100">
      <header className="min-w-0">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
          <Link href={APP_ROUTES.rbi.overview} className="transition hover:text-blue-700 dark:hover:text-blue-200">
            Integrity / RBI
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={APP_ROUTES.rbi.assessments} className="transition hover:text-blue-700 dark:hover:text-blue-200">
            Assessments
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-700 dark:text-slate-200">{data.summary.assessmentId}</span>
        </nav>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            RBI Assessment Workspace
          </h1>
          <div className="flex flex-wrap gap-2">
            <Link
              href={data.routes.assessmentsList}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-extrabold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500/30 dark:hover:text-blue-200"
            >
              <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
              Assessments
            </Link>
            <Link
              href={data.routes.riskRegister}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-700 px-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-800"
            >
              Risk Register
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <AssessmentSummaryHeader />
      <KpiStrip kpis={data.kpis} />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <main className="min-w-0 space-y-4">
          <WorkflowStepper activeStepId={activeStep.id} steps={data.workflowSteps} onStepChange={setActiveStepId} />
          <StepPreviewWorkspace
            activePreview={activePreview}
            activeStep={activeStep}
            expandedSections={expandedSections}
            filteredMechanisms={filteredMechanisms}
            mechanismCategory={mechanismCategory}
            mechanismSearch={mechanismSearch}
            evidenceStatus={evidenceStatus}
            onEvidenceStatusChange={setEvidenceStatus}
            onMechanismCategoryChange={setMechanismCategory}
            onMechanismSearchChange={setMechanismSearch}
            onToggleAccordion={toggleAccordion}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <LinkedAssetContextCard />
            <HistoricalInspectionCard />
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <RiskMatrixPositionCard />
            <KeyIntegrityConcernsCard />
          </div>
        </main>

        <AssessmentStatusPanel
          actionNotice={actionNotice}
          draftRfiCount={draftRfiCount}
          savedAt={savedAt}
          onEvidenceOpen={() => setEvidenceOpen(true)}
          onRequestClarification={() => setClarificationOpen(true)}
          onSaveDraft={handleSaveDraft}
          onSubmitForReview={handleSubmitForReview}
        />
      </div>

      {clarificationOpen ? (
        <ClarificationDialog onClose={() => setClarificationOpen(false)} onCreate={handleCreateClarification} />
      ) : null}
      {evidenceOpen ? <EvidenceDrawer evidenceItems={data.evidenceItems} onClose={() => setEvidenceOpen(false)} /> : null}
    </div>
  );
}

function AssessmentSummaryHeader() {
  const summary = data.summary;

  return (
    <Card className="overflow-hidden rounded-2xl">
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-start gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700 dark:border-blue-500/20 dark:from-blue-500/10 dark:to-cyan-500/10 dark:text-blue-200">
              <Layers3 className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                  Assessment ID: {summary.assessmentId}
                </p>
                <Badge label={summary.status} className={TONE_STYLES.blue} minWidth="min-w-[96px]" />
              </div>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                {summary.assetName}
              </h2>
              <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 md:grid-cols-2">
                <InfoLine label="Asset Class" value={summary.assetClass} />
                <InfoLine label="Assessment Type" value={summary.assessmentType} />
                <InfoLine label="Service" value={summary.service} />
                <InfoLine label="Location / Area" value={summary.locationArea} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {summary.methodologyLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
          <InfoLine label="Lead / Owner" value={summary.leadOwner} />
          <InfoLine label="Last Updated" value={summary.lastUpdated} />
          <InfoLine label="Next Review Target" value={summary.nextReviewTarget} />
          <InfoLine label="Facility" value={summary.facilityName} />
          <InfoLine label="Project Owner" value={summary.projectOwner} />
        </div>
      </CardContent>
    </Card>
  );
}

function KpiStrip({ kpis }: { kpis: AssessmentDetailKpi[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      {kpis.map((kpi) => {
        const Icon = KPI_ICONS[kpi.id] ?? Gauge;

        return (
          <Card key={kpi.id} className="rounded-2xl">
            <CardContent className="flex min-h-[112px] items-center gap-3 p-3.5">
              <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl border", TONE_STYLES[kpi.tone])}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {kpi.label}
                </p>
                <p className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">{kpi.value}</p>
                <p className="mt-1 line-clamp-2 text-xs font-bold text-slate-500 dark:text-slate-400">{kpi.marker}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function WorkflowStepper({
  activeStepId,
  steps,
  onStepChange,
}: {
  activeStepId: string;
  steps: AssessmentWorkflowStep[];
  onStepChange: (stepId: string) => void;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="p-4 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-black">RBI Workflow Stepper</CardTitle>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Container-level navigation for future detailed step workspaces.
            </p>
          </div>
          <Link
            href={APP_ROUTES.rbi.methodologyGovernance}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            Methodology
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = STEP_ICONS[step.id] ?? ClipboardCheck;
            const active = step.id === activeStepId;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onStepChange(step.id)}
                className={cn(
                  "group min-h-[120px] rounded-2xl border p-3 text-left transition",
                  active
                    ? "border-blue-300 bg-blue-50 shadow-sm shadow-blue-950/5 dark:border-blue-500/40 dark:bg-blue-500/10"
                    : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/30 dark:hover:bg-slate-900/80",
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl border", getStepTone(step.status, active))}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Step {index + 1}
                      </p>
                      <StepStatusPill status={step.status} />
                    </div>
                    <h3 className="mt-1 text-sm font-black leading-5 text-slate-950 dark:text-white">{step.label}</h3>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-blue-600" style={{ width: `${step.completeness}%` }} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <TinyPill label={`${step.completeness}%`} />
                      <TinyPill label={`${step.requiredEvidenceCount} evidence`} />
                      <TinyPill label={`${step.linkedComments} comments`} />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function StepPreviewWorkspace({
  activePreview,
  activeStep,
  expandedSections,
  filteredMechanisms,
  mechanismCategory,
  mechanismSearch,
  evidenceStatus,
  onEvidenceStatusChange,
  onMechanismCategoryChange,
  onMechanismSearchChange,
  onToggleAccordion,
}: {
  activePreview: AssessmentStepPreview;
  activeStep: AssessmentWorkflowStep;
  expandedSections: Record<string, boolean>;
  filteredMechanisms: DamageMechanismReviewRow[];
  mechanismCategory: MechanismCategoryFilter;
  mechanismSearch: string;
  evidenceStatus: EvidenceStatusFilter;
  onEvidenceStatusChange: (value: EvidenceStatusFilter) => void;
  onMechanismCategoryChange: (value: MechanismCategoryFilter) => void;
  onMechanismSearchChange: (value: string) => void;
  onToggleAccordion: (sectionId: string) => void;
}) {
  const isDamageReview = activeStep.id === "damage-mechanism-review";

  return (
    <Card className="rounded-2xl">
      <CardHeader className="p-4 pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StepStatusPill status={activeStep.status} />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{activePreview.statusText}</span>
            </div>
            <CardTitle className="mt-2 text-xl font-black">{activePreview.title}</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            {activePreview.actions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                {action.label}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.6fr)]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm font-bold leading-6 text-slate-600 dark:text-slate-300">{activePreview.narrative}</p>
            <ul className="mt-3 grid gap-2">
              {activePreview.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {activePreview.metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">{metric.label}</p>
                <p className={cn("mt-1 text-xl font-black", getToneTextClass(metric.tone))}>{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        {isDamageReview ? (
          <>
            <DamageMechanismFilters
              evidenceStatus={evidenceStatus}
              mechanismCategory={mechanismCategory}
              mechanismSearch={mechanismSearch}
              onEvidenceStatusChange={onEvidenceStatusChange}
              onMechanismCategoryChange={onMechanismCategoryChange}
              onMechanismSearchChange={onMechanismSearchChange}
            />
            <DamageMechanismTable rows={filteredMechanisms} />
            <DamageMechanismAccordions expandedSections={expandedSections} onToggle={onToggleAccordion} sections={data.accordionSections} />
          </>
        ) : (
          <ShellPreviewNotice step={activeStep} />
        )}
      </CardContent>
    </Card>
  );
}

function DamageMechanismFilters({
  evidenceStatus,
  mechanismCategory,
  mechanismSearch,
  onEvidenceStatusChange,
  onMechanismCategoryChange,
  onMechanismSearchChange,
}: {
  evidenceStatus: EvidenceStatusFilter;
  mechanismCategory: MechanismCategoryFilter;
  mechanismSearch: string;
  onEvidenceStatusChange: (value: EvidenceStatusFilter) => void;
  onMechanismCategoryChange: (value: MechanismCategoryFilter) => void;
  onMechanismSearchChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[180px_180px_minmax(0,1fr)]">
      <FilterSelect
        label="Mechanism Category"
        value={mechanismCategory}
        options={MECHANISM_CATEGORY_OPTIONS}
        onChange={(value) => onMechanismCategoryChange(value as MechanismCategoryFilter)}
      />
      <FilterSelect
        label="Evidence Status"
        value={evidenceStatus}
        options={EVIDENCE_STATUS_OPTIONS}
        onChange={(value) => onEvidenceStatusChange(value as EvidenceStatusFilter)}
      />
      <label className="relative block">
        <span className="sr-only">Search damage mechanisms</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          value={mechanismSearch}
          onChange={(event) => onMechanismSearchChange(event.target.value)}
          placeholder="Search mechanism, evidence, component, reviewer note..."
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-blue-500/40 dark:focus:ring-blue-500/10"
        />
      </label>
    </div>
  );
}

function DamageMechanismTable({ rows }: { rows: DamageMechanismReviewRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="min-w-[1180px] w-full border-collapse text-left">
          <thead className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              <TableHeader className="w-[210px]" label="Mechanism" />
              <TableHeader className="w-[160px]" label="Screening Result" />
              <TableHeader className="w-[120px]" label="Confidence" />
              <TableHeader className="w-[300px]" label="Evidence Summary" />
              <TableHeader className="w-[220px]" label="Affected Component" />
              <TableHeader className="w-[220px]" label="Severity Driver" />
              <TableHeader className="w-[120px]" label="Data Quality" />
              <TableHeader className="w-[260px]" label="Reviewer Note" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {rows.map((row) => (
              <tr key={row.id} className="align-top transition hover:bg-blue-50/50 dark:hover:bg-blue-500/5">
                <td className="px-3 py-3 text-sm font-black text-slate-950 dark:text-white">{row.mechanism}</td>
                <td className="px-3 py-3">
                  <ScreeningBadge value={row.screeningResult} />
                </td>
                <td className="px-3 py-3">
                  <Badge label={row.confidence} className={getConfidenceStyle(row.confidence)} minWidth="min-w-[86px]" />
                </td>
                <td className="px-3 py-3 text-sm font-semibold leading-5 text-slate-600 dark:text-slate-300">{row.evidenceSummary}</td>
                <td className="px-3 py-3 text-sm font-semibold leading-5 text-slate-600 dark:text-slate-300">{row.affectedComponent}</td>
                <td className="px-3 py-3 text-sm font-semibold leading-5 text-slate-600 dark:text-slate-300">{row.severityDriver}</td>
                <td className="px-3 py-3">
                  <Badge label={row.dataQuality} className={getDataQualityStyle(row.dataQuality)} minWidth="min-w-[72px]" />
                </td>
                <td className="px-3 py-3 text-sm font-semibold leading-5 text-slate-600 dark:text-slate-300">{row.reviewerNote}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <div className="border-t border-slate-200 p-8 text-center text-sm font-bold text-slate-500 dark:border-slate-800 dark:text-slate-400">
            No damage mechanism records match the selected filters.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DamageMechanismAccordions({
  expandedSections,
  sections,
  onToggle,
}: {
  expandedSections: Record<string, boolean>;
  sections: AssessmentAccordionSection[];
  onToggle: (sectionId: string) => void;
}) {
  return (
    <div className="grid gap-2 lg:grid-cols-3">
      {sections.map((section) => {
        const open = Boolean(expandedSections[section.id]);

        return (
          <div key={section.id} className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => onToggle(section.id)}
              className="flex w-full items-center justify-between gap-3 p-3 text-left text-sm font-black text-slate-950 transition hover:text-blue-700 dark:text-white dark:hover:text-blue-200"
            >
              {section.title}
              <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} aria-hidden="true" />
            </button>
            {open ? (
              <ul className="space-y-2 border-t border-slate-200 p-3 dark:border-slate-800">
                {section.items.map((item) => (
                  <li key={item} className="text-sm font-semibold leading-5 text-slate-600 dark:text-slate-300">
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function ShellPreviewNotice({ step }: { step: AssessmentWorkflowStep }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 dark:border-blue-500/20 dark:from-blue-500/10 dark:to-cyan-500/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-blue-900 dark:text-blue-100">Shell preview only</p>
          <p className="mt-1 max-w-3xl text-sm font-semibold leading-6 text-blue-800/80 dark:text-blue-100/80">
            This workspace shows the container state for {step.label}. Detailed engineering input forms will plug into this step route later without changing the assessment shell.
          </p>
        </div>
        <Link
          href={step.href}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-700 px-3 text-sm font-extrabold text-white transition hover:bg-blue-800"
        >
          Open Step Route
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function LinkedAssetContextCard() {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="p-4 pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-black">
          <Link2 className="h-4 w-4 text-blue-600 dark:text-blue-300" aria-hidden="true" />
          Linked Asset & Data Context
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 p-4 pt-0 sm:grid-cols-2">
        {data.linkedAssetContext.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p>
            {item.href ? (
              <Link href={item.href} className="mt-1 inline-flex items-center gap-1 text-sm font-black text-blue-700 transition hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100">
                {item.value}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            ) : (
              <p className="mt-1 text-sm font-black text-slate-950 dark:text-white">{item.value}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function HistoricalInspectionCard() {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex-row items-start justify-between gap-3 p-4 pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-black">
          <FileSearch className="h-4 w-4 text-blue-600 dark:text-blue-300" aria-hidden="true" />
          Historical Inspection Snapshot
        </CardTitle>
        <Link href={data.routes.inspectionHistory} className="text-xs font-extrabold text-blue-700 hover:text-blue-900 dark:text-blue-300">
          View records
        </Link>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        {data.historicalInspections.map((item) => (
          <Link
            key={`${item.year}-${item.title}`}
            href={item.href}
            className="grid grid-cols-[58px_minmax(0,1fr)_150px] items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/5"
          >
            <span className="text-sm font-black text-slate-500 dark:text-slate-400">{item.year}</span>
            <span className="min-w-0 text-sm font-black text-slate-950 dark:text-white">{item.title}</span>
            <span className="justify-self-end">
              <Badge label={item.status} className={getInspectionStatusStyle(item.status)} minWidth="min-w-[132px]" />
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

function RiskMatrixPositionCard() {
  const probabilities = [5, 4, 3, 2, 1];
  const consequences = [1, 2, 3, 4, 5];

  return (
    <Card className="rounded-2xl">
      <CardHeader className="p-4 pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base font-black">
            <Target className="h-4 w-4 text-blue-600 dark:text-blue-300" aria-hidden="true" />
            Risk Matrix Position
          </CardTitle>
          <Link href={data.routes.riskAnalytics} className="text-xs font-extrabold text-blue-700 hover:text-blue-900 dark:text-blue-300">
            Open analytics
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0">
        <div className="grid grid-cols-[40px_repeat(5,minmax(0,1fr))] gap-1">
          <div />
          {consequences.map((cof) => (
            <div key={cof} className="text-center text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              C{cof}
            </div>
          ))}
          {probabilities.map((pof) => (
            <RiskMatrixRow key={pof} probability={pof} consequences={consequences} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(["Extreme", "High", "Medium-High", "Medium", "Low"] as AssessmentDetailRiskLevel[]).map((label) => (
            <span key={label} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
              <span className={cn("h-2.5 w-2.5 rounded-full", getRiskDotClass(label))} />
              {label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RiskMatrixRow({ probability, consequences }: { probability: number; consequences: number[] }) {
  return (
    <>
      <div className="grid place-items-center rounded-lg bg-slate-50 text-[10px] font-black text-slate-500 dark:bg-slate-950 dark:text-slate-400">
        P{probability}
      </div>
      {consequences.map((consequence) => {
        const cell = data.riskMatrix.find((item) => item.probability === probability && item.consequence === consequence);
        const isCurrent =
          data.currentRiskPosition.probability === probability && data.currentRiskPosition.consequence === consequence;

        return (
          <div
            key={`${probability}-${consequence}`}
            className={cn(
              "grid h-12 place-items-center rounded-xl border text-xs font-black",
              getRiskCellClass(cell?.label ?? "Low"),
              isCurrent && "ring-2 ring-blue-700 ring-offset-2 ring-offset-white dark:ring-blue-300 dark:ring-offset-slate-950",
            )}
            title={`PoF ${probability} / CoF ${consequence}`}
          >
            {isCurrent ? "V-101" : probability * consequence}
          </div>
        );
      })}
    </>
  );
}

function KeyIntegrityConcernsCard() {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex-row items-start justify-between gap-3 p-4 pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-black">
          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-300" aria-hidden="true" />
          Key Integrity Concerns
        </CardTitle>
        <Link href={data.routes.recommendations} className="text-xs font-extrabold text-blue-700 hover:text-blue-900 dark:text-blue-300">
          Recommendations
        </Link>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        {data.keyIntegrityConcerns.map((concern, index) => (
          <div key={concern} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-orange-50 text-xs font-black text-orange-700 dark:bg-orange-500/10 dark:text-orange-200">
              {index + 1}
            </span>
            <p className="text-sm font-semibold leading-5 text-slate-600 dark:text-slate-300">{concern}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AssessmentStatusPanel({
  actionNotice,
  draftRfiCount,
  savedAt,
  onEvidenceOpen,
  onRequestClarification,
  onSaveDraft,
  onSubmitForReview,
}: {
  actionNotice: string | null;
  draftRfiCount: number;
  savedAt: string | null;
  onEvidenceOpen: () => void;
  onRequestClarification: () => void;
  onSaveDraft: () => void;
  onSubmitForReview: () => void;
}) {
  const status = data.statusPanel;

  return (
    <aside className="sticky top-4 space-y-4">
      <Card className="overflow-hidden rounded-2xl">
        <CardHeader className="border-b border-slate-200 bg-gradient-to-br from-blue-700 to-cyan-600 p-4 text-white dark:border-blue-500/20">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-base font-black">
              <PanelRightOpen className="h-4 w-4" aria-hidden="true" />
              Assessment Status
            </CardTitle>
            <Badge label={data.summary.status} className="border-white/20 bg-white/15 text-white" minWidth="min-w-[86px]" />
          </div>
          <div className="pt-2">
            <div className="flex items-end justify-between gap-3">
              <span className="text-xs font-bold text-white/80">Overall completeness</span>
              <span className="text-3xl font-black">{status.overallCompleteness}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white" style={{ width: `${status.overallCompleteness}%` }} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <PanelSection title="Section Completeness">
            <div className="space-y-2">
              {status.sectionCompleteness.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between gap-2 text-xs font-bold">
                    <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                    <span className={getGateTextClass(item.status)}>{formatSectionStatus(item.status, item.completeness)}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className={cn("h-full rounded-full", getStatusProgressClass(item.status))} style={{ width: `${item.completeness ?? 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </PanelSection>

          <PanelSection title="Review Stage">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3 text-sm font-black text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
              {status.reviewStage}
            </div>
          </PanelSection>

          <PanelSection title="Reviewers / Stakeholders">
            <div className="space-y-2">
              {status.stakeholders.map((stakeholder) => (
                <div key={stakeholder.role} className="flex items-center justify-between gap-3 text-sm font-bold">
                  <span className="text-slate-600 dark:text-slate-300">{stakeholder.role}</span>
                  <Badge
                    label={stakeholder.status}
                    className={stakeholder.status === "Assigned" ? TONE_STYLES.emerald : TONE_STYLES.orange}
                    minWidth="min-w-[84px]"
                  />
                </div>
              ))}
            </div>
          </PanelSection>

          <PanelSection title="Review Health">
            <div className="grid grid-cols-3 gap-2">
              <MiniMetric label="Comments" value={status.reviewHealth.openComments} tone="orange" />
              <MiniMetric label="RFIs" value={status.reviewHealth.unresolvedRfis + draftRfiCount} tone="red" />
              <MiniMetric label="Decision" value={status.reviewHealth.pendingAcceptanceDecisions} tone="violet" />
            </div>
          </PanelSection>

          <PanelSection title="Data & Evidence">
            <div className="grid grid-cols-2 gap-2">
              <ScoreBox label="Data Quality" value={`${status.dataQualityScore} / 100`} percent={status.dataQualityScore} />
              <ScoreBox label="Evidence Coverage" value={`${status.evidenceCoverageScore}%`} percent={status.evidenceCoverageScore} />
            </div>
            <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              {status.documentPackage.filesLinked} files linked · {status.documentPackage.pendingValidation} pending validation · {status.documentPackage.missingCriticalAttachment} missing critical attachment
            </div>
          </PanelSection>

          <PanelSection title="Acceptance Gates">
            <div className="space-y-2">
              {status.acceptanceGates.map((gate) => (
                <div key={gate.label} className="flex items-center justify-between gap-3 text-sm font-bold">
                  <span className="text-slate-600 dark:text-slate-300">{gate.label}</span>
                  <span className={cn("h-2.5 w-2.5 rounded-full", getGateDotClass(gate.status))} title={gate.status} />
                </div>
              ))}
            </div>
          </PanelSection>

          {actionNotice ? (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3 text-sm font-bold text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
              {actionNotice}
            </div>
          ) : null}
          {savedAt ? (
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Last saved: {savedAt}</p>
          ) : null}

          <div className="grid gap-2">
            <button type="button" onClick={onSaveDraft} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-extrabold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              <Save className="h-4 w-4" aria-hidden="true" />
              Save Draft
            </button>
            <button type="button" onClick={onSubmitForReview} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-3 text-sm font-extrabold text-white transition hover:bg-blue-800">
              <Send className="h-4 w-4" aria-hidden="true" />
              Submit for Review
            </button>
            <button type="button" onClick={onRequestClarification} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 text-sm font-extrabold text-orange-800 transition hover:bg-orange-100 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200">
              <MessageSquareWarning className="h-4 w-4" aria-hidden="true" />
              Request Clarification
            </button>
            <button type="button" onClick={onEvidenceOpen} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-3 text-sm font-extrabold text-cyan-800 transition hover:bg-cyan-100 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200">
              <FileText className="h-4 w-4" aria-hidden="true" />
              View Evidence Pack
            </button>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

function ClarificationDialog({ onClose, onCreate }: { onClose: () => void; onCreate: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-lg rounded-2xl shadow-2xl">
        <CardHeader className="flex-row items-start justify-between gap-3 p-4 pb-3">
          <div>
            <CardTitle className="text-lg font-black">Request Clarification</CardTitle>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
              Draft an RFI for unresolved technical evidence before PoF/CoF approval.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white">
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0">
          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3 text-sm font-bold leading-6 text-orange-800 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200">
            Proposed RFI: confirm H2S content from process chemistry and reconcile PSV-1203 set-pressure evidence mismatch.
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={onClose} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-extrabold text-slate-700 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              Cancel
            </button>
            <button type="button" onClick={onCreate} className="h-10 rounded-xl bg-blue-700 px-3 text-sm font-extrabold text-white transition hover:bg-blue-800">
              Create RFI Draft
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EvidenceDrawer({ evidenceItems, onClose }: { evidenceItems: AssessmentEvidenceItem[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/35 backdrop-blur-sm">
      <Card className="h-full w-full max-w-xl overflow-y-auto rounded-none border-y-0 border-r-0 shadow-2xl">
        <CardHeader className="sticky top-0 z-10 flex-row items-start justify-between gap-3 border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <CardTitle className="text-lg font-black">Evidence Pack</CardTitle>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
              Linked evidence prepared for V-101 RBI workspace review.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white">
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          {evidenceItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="block rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-slate-950 dark:text-white">{item.title}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">{item.type}</p>
                </div>
                <Badge label={item.status} className={getEvidenceItemStatusStyle(item.status)} minWidth="min-w-[132px]" />
              </div>
            </Link>
          ))}
          <Link
            href={data.routes.evidencePack}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-3 text-sm font-extrabold text-white transition hover:bg-blue-800"
          >
            Open Evidence Pack Route
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function FilterSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-extrabold text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-blue-500/40 dark:focus:ring-blue-500/10"
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

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function PanelSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section>
      <h3 className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</h3>
      {children}
    </section>
  );
}

function MiniMetric({ label, tone, value }: { label: string; tone: "orange" | "red" | "violet"; value: number }) {
  return (
    <div className={cn("rounded-2xl border p-2 text-center", TONE_STYLES[tone])}>
      <p className="text-lg font-black">{value}</p>
      <p className="text-[10px] font-extrabold uppercase tracking-wide">{label}</p>
    </div>
  );
}

function ScoreBox({ label, percent, value }: { label: string; percent: number; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{value}</p>
      <div className="mt-2 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full bg-cyan-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function TableHeader({ className, label }: { className?: string; label: string }) {
  return <th className={cn("border-b border-slate-200 px-3 py-3 dark:border-slate-800", className)}>{label}</th>;
}

function ScreeningBadge({ value }: { value: DamageScreeningResult }) {
  const className =
    value === "Applicable"
      ? TONE_STYLES.emerald
      : value === "Requires Clarification"
        ? TONE_STYLES.orange
        : TONE_STYLES.blue;

  return <Badge label={value} className={className} minWidth="min-w-[150px]" />;
}

function StepStatusPill({ status }: { status: AssessmentWorkflowStep["status"] }) {
  const label =
    status === "completed"
      ? "Completed"
      : status === "current"
        ? "Current"
        : status === "needsClarification"
          ? "Needs Clarification"
          : status === "pendingValidation"
            ? "Pending Validation"
            : status === "blocked"
              ? "Blocked"
              : "Pending";

  const className =
    status === "completed"
      ? TONE_STYLES.emerald
      : status === "current"
        ? TONE_STYLES.blue
        : status === "needsClarification" || status === "pendingValidation"
          ? TONE_STYLES.orange
          : status === "blocked"
            ? TONE_STYLES.red
            : TONE_STYLES.slate;

  return <Badge label={label} className={className} minWidth="min-w-[84px]" />;
}

function TinyPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-extrabold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
      {label}
    </span>
  );
}

function Badge({
  className,
  label,
  minWidth = "min-w-[96px]",
}: {
  className: string;
  label: string;
  minWidth?: string;
}) {
  return (
    <span className={cn("inline-flex h-7 items-center justify-center whitespace-nowrap rounded-full border px-2.5 text-[11px] font-extrabold", minWidth, className)}>
      {label}
    </span>
  );
}

function filterDamageMechanisms(
  rows: DamageMechanismReviewRow[],
  category: MechanismCategoryFilter,
  evidence: EvidenceStatusFilter,
  search: string,
) {
  const normalizedSearch = search.trim().toLowerCase();

  return rows.filter((row) => {
    const categoryMatch = category === "all" || row.category === category;
    const evidenceMatch =
      evidence === "all" ||
      row.dataQuality.toLowerCase() === evidence ||
      (evidence === "clarification" && row.screeningResult === "Requires Clarification");
    const searchMatch =
      normalizedSearch.length === 0 ||
      [
        row.mechanism,
        row.screeningResult,
        row.confidence,
        row.evidenceSummary,
        row.affectedComponent,
        row.severityDriver,
        row.dataQuality,
        row.reviewerNote,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

    return categoryMatch && evidenceMatch && searchMatch;
  });
}

function getStepTone(status: AssessmentWorkflowStep["status"], active: boolean) {
  if (active) return TONE_STYLES.blue;
  if (status === "completed") return TONE_STYLES.emerald;
  if (status === "current") return TONE_STYLES.blue;
  if (status === "blocked") return TONE_STYLES.red;
  if (status === "needsClarification" || status === "pendingValidation") return TONE_STYLES.orange;
  return TONE_STYLES.slate;
}

function getConfidenceStyle(value: AssessmentConfidenceLevel) {
  if (value === "High") return TONE_STYLES.emerald;
  if (value === "Medium") return TONE_STYLES.orange;
  return TONE_STYLES.red;
}

function getDataQualityStyle(value: AssessmentDataQualityLevel) {
  if (value === "Good") return TONE_STYLES.emerald;
  if (value === "Fair") return TONE_STYLES.orange;
  return TONE_STYLES.red;
}

function getInspectionStatusStyle(status: string) {
  if (status === "Validated") return TONE_STYLES.emerald;
  if (status === "In Progress") return TONE_STYLES.blue;
  if (status === "Evidence Incomplete") return TONE_STYLES.red;
  return TONE_STYLES.orange;
}

function getEvidenceItemStatusStyle(status: AssessmentEvidenceItem["status"]) {
  if (status === "Linked") return TONE_STYLES.emerald;
  if (status === "Missing Critical") return TONE_STYLES.red;
  return TONE_STYLES.orange;
}

function getRiskCellClass(label: AssessmentDetailRiskLevel) {
  switch (label) {
    case "Extreme":
      return "border-red-300 bg-red-600 text-white";
    case "High":
      return "border-orange-300 bg-orange-500 text-white";
    case "Medium-High":
      return "border-amber-300 bg-amber-300 text-amber-950";
    case "Medium":
      return "border-lime-300 bg-lime-200 text-lime-950";
    default:
      return "border-emerald-300 bg-emerald-200 text-emerald-950";
  }
}

function getRiskDotClass(label: AssessmentDetailRiskLevel) {
  switch (label) {
    case "Extreme":
      return "bg-red-600";
    case "High":
      return "bg-orange-500";
    case "Medium-High":
      return "bg-amber-300";
    case "Medium":
      return "bg-lime-300";
    default:
      return "bg-emerald-400";
  }
}

function getStatusProgressClass(status: "completed" | "in-progress" | "pending") {
  if (status === "completed") return "bg-emerald-500";
  if (status === "in-progress") return "bg-blue-600";
  return "bg-slate-300 dark:bg-slate-700";
}

function getGateDotClass(status: "complete" | "in-progress" | "pending") {
  if (status === "complete") return "bg-emerald-500";
  if (status === "in-progress") return "bg-blue-600";
  return "bg-slate-300 dark:bg-slate-700";
}

function getGateTextClass(status: "completed" | "in-progress" | "pending") {
  if (status === "completed") return "text-emerald-700 dark:text-emerald-300";
  if (status === "in-progress") return "text-blue-700 dark:text-blue-300";
  return "text-slate-500 dark:text-slate-400";
}

function formatSectionStatus(status: "completed" | "in-progress" | "pending", completeness = 0) {
  if (status === "completed") return `${completeness}%`;
  if (status === "in-progress") return "In Progress";
  return "Pending";
}

function getToneTextClass(tone: keyof typeof TONE_STYLES) {
  switch (tone) {
    case "blue":
      return "text-blue-700 dark:text-blue-300";
    case "red":
      return "text-red-700 dark:text-red-300";
    case "orange":
      return "text-orange-700 dark:text-orange-300";
    case "emerald":
      return "text-emerald-700 dark:text-emerald-300";
    case "violet":
      return "text-violet-700 dark:text-violet-300";
    case "cyan":
      return "text-cyan-700 dark:text-cyan-300";
    default:
      return "text-slate-700 dark:text-slate-200";
  }
}
