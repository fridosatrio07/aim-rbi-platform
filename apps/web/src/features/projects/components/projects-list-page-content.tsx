"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Database,
  Download,
  Eye,
  FileCheck2,
  Filter,
  FolderKanban,
  Grid2X2,
  List,
  MoreHorizontal,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import {
  BreadcrumbTrail,
  CompactKpiCard,
  CompactKpiStrip,
  CompactPageHeader,
  CompactPageShell,
  DenseCard,
  DenseSection,
  DenseTable,
  DenseTableCell,
  DenseTableHeadCell,
  DenseTableHeader,
  DenseTableRow,
  EmptyStateCompact,
  FilterSelect,
  FilterToolbar,
  MetricTile,
  ProgressCell,
  ProgressMiniBar,
  SearchInput,
  StatusBadge,
  ToolbarButton,
} from "@/components/data-display/compact-primitives";
import { cn } from "@/lib/utils";

import { DEFAULT_PROJECT_FILTERS, PROJECTS_DATA } from "../services/project-data";
import {
  filterProjects,
  getClientOptions,
  getPhaseOptions,
  getProjectIssueValue,
  getProjectPortfolioKpis,
  getPhaseTone,
  getRiskProfileOptions,
  getRiskTone,
  getSiteOptions,
  getStatusOptions,
  getStatusTone,
} from "../services/project-selectors";
import type { ProjectFilters, ProjectRecord } from "../services/project-types";

type ViewMode = "cards" | "table";

const PROJECT_LIST_DESCRIPTION =
  "Manage AIM/RBI project portfolios, readiness, asset integrity status, and delivery risk across facilities.";

export function ProjectsListPageContent() {
  const [filters, setFilters] = useState<ProjectFilters>(DEFAULT_PROJECT_FILTERS);
  const [selectedProjectId, setSelectedProjectId] = useState("spm-01");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const portfolioKpis = useMemo(() => getProjectPortfolioKpis(PROJECTS_DATA), []);
  const filteredProjects = useMemo(() => filterProjects(PROJECTS_DATA, filters), [filters]);
  const selectedProject = useMemo(
    () =>
      filteredProjects.find((project) => project.id === selectedProjectId) ??
      filteredProjects[0] ??
      PROJECTS_DATA.find((project) => project.id === selectedProjectId) ??
      PROJECTS_DATA[0],
    [filteredProjects, selectedProjectId],
  );

  function updateFilter<T extends keyof ProjectFilters>(key: T, value: ProjectFilters[T]) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetFilters() {
    setFilters(DEFAULT_PROJECT_FILTERS);
  }

  return (
    <CompactPageShell viewport className="gap-3">
      <CompactPageHeader
        breadcrumb={<BreadcrumbTrail items={[{ href: "/projects", label: "Projects" }, { label: "Project List" }]} />}
        description={PROJECT_LIST_DESCRIPTION}
        icon={FolderKanban}
        meta={<StatusBadge label="SPM-01 active context" tone="blue" withDot />}
        title="Projects"
        action={
          <ToolbarButton href={`/projects/${selectedProject.id}`} variant="primary">
            Open Workspace
          </ToolbarButton>
        }
      />

      <CompactKpiStrip className="grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <CompactKpiCard icon={FolderKanban} label="Total Projects" value={portfolioKpis.totalProjects} delta="AIM/RBI portfolio" />
        <CompactKpiCard icon={Sparkles} label="Active Projects" value={portfolioKpis.activeProjects} tone="emerald" delta="Live delivery" />
        <CompactKpiCard icon={Database} label="Total Assets in Portfolio" value={portfolioKpis.totalAssets} tone="cyan" delta="Across 5 facilities" />
        <CompactKpiCard icon={AlertTriangle} label="Overdue Actions" value={portfolioKpis.overdueActions} tone="red" delta="Corrective action backlog" />
        <CompactKpiCard
          icon={FileCheck2}
          label="Average Data Completeness"
          value={`${portfolioKpis.averageDataCompleteness}%`}
          tone="blue"
          delta="Minimum evidence readiness"
        />
        <CompactKpiCard icon={BarChart3} label="RBI Progress" value={`${portfolioKpis.averageRbiProgress}%`} tone="violet" delta="Portfolio average" />
      </CompactKpiStrip>

      <ActiveProjectPanel project={selectedProject} />

      <div className="relative">
        <FilterToolbar
          title="Project Filters"
          actions={
            <>
              <ToolbarButton
                className={filtersOpen ? "border-blue-200 text-blue-700 dark:border-blue-500/40 dark:text-blue-200" : ""}
                onClick={() => setFiltersOpen((current) => !current)}
              >
                <Filter className="h-4 w-4" aria-hidden="true" />
                Filters
              </ToolbarButton>
              <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-950">
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  className={cn(
                    "inline-flex h-7 items-center gap-1.5 rounded-lg px-2 text-[11px] font-extrabold transition",
                    viewMode === "cards"
                      ? "bg-blue-700 text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
                  )}
                >
                  <Grid2X2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Cards
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={cn(
                    "inline-flex h-7 items-center gap-1.5 rounded-lg px-2 text-[11px] font-extrabold transition",
                    viewMode === "table"
                      ? "bg-blue-700 text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
                  )}
                >
                  <List className="h-3.5 w-3.5" aria-hidden="true" />
                  Table
                </button>
              </div>
              <ToolbarButton onClick={() => setExportOpen((current) => !current)}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Export
              </ToolbarButton>
            </>
          }
        >
          <FilterSelect
            className="min-w-[148px]"
            label="Client"
            options={[
              { label: "All clients", value: "All" },
              ...getClientOptions().map((client) => ({ label: client, value: client })),
            ]}
            value={filters.client}
            onValueChange={(value) => updateFilter("client", value as ProjectFilters["client"])}
          />
          <FilterSelect
            className="min-w-[172px]"
            label="Site"
            options={[
              { label: "All sites", value: "All" },
              ...getSiteOptions().map((site) => ({ label: site, value: site })),
            ]}
            value={filters.site}
            onValueChange={(value) => updateFilter("site", value)}
          />
          <FilterSelect
            className="min-w-[146px]"
            label="Phase"
            options={[
              { label: "All phases", value: "All" },
              ...getPhaseOptions().map((phase) => ({ label: phase, value: phase })),
            ]}
            value={filters.phase}
            onValueChange={(value) => updateFilter("phase", value as ProjectFilters["phase"])}
          />
          <FilterSelect
            className="min-w-[132px]"
            label="Risk"
            options={[
              { label: "All risk", value: "All" },
              ...getRiskProfileOptions().map((riskProfile) => ({ label: riskProfile, value: riskProfile })),
            ]}
            value={filters.riskProfile}
            onValueChange={(value) => updateFilter("riskProfile", value as ProjectFilters["riskProfile"])}
          />
          <FilterSelect
            className="min-w-[132px]"
            label="Status"
            options={[
              { label: "All status", value: "All" },
              ...getStatusOptions().map((status) => ({ label: status, value: status })),
            ]}
            value={filters.status}
            onValueChange={(value) => updateFilter("status", value as ProjectFilters["status"])}
          />
          <SearchInput
            className="min-w-[260px] flex-1"
            label="Search"
            placeholder="Code, project, site, owner, facility type..."
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
          />
        </FilterToolbar>

        {filtersOpen ? (
          <CompactPopover className="right-28 top-[calc(100%+8px)] w-[340px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-950 dark:text-white">Advanced filter staging</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">
                  API-backed saved views will attach here. Current filters run locally against typed service data.
                </p>
              </div>
              <SlidersHorizontal className="h-4 w-4 text-blue-600 dark:text-blue-300" aria-hidden="true" />
            </div>
            <div className="mt-3 grid gap-2">
              <StatusBadge label={`${filteredProjects.length} visible projects`} tone="blue" />
              <StatusBadge label="SPM-01 project context preserved" tone="emerald" />
              <StatusBadge label="No backend export required yet" tone="slate" />
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-3 inline-flex h-8 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-extrabold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset filters
            </button>
          </CompactPopover>
        ) : null}

        {exportOpen ? (
          <CompactPopover className="right-0 top-[calc(100%+8px)] w-[300px]">
            <p className="text-sm font-black text-slate-950 dark:text-white">Export queue</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">
              Export hooks are prepared for portfolio list, KPI snapshot, and selected project evidence summary.
            </p>
            <div className="mt-3 grid gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
              <span className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950">Portfolio XLSX - local placeholder</span>
              <span className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950">Readiness PDF - local placeholder</span>
            </div>
          </CompactPopover>
        ) : null}
      </div>

      <ProjectTileStrip
        filteredProjects={filteredProjects}
        selectedProjectId={selectedProject.id}
        viewMode={viewMode}
        onSelect={setSelectedProjectId}
      />

      <DenseSection
        action={
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>{filteredProjects.length} projects</span>
            <StatusBadge label={`${selectedProject.code} selected`} tone="blue" />
          </div>
        }
        className="min-h-0 flex-1 overflow-hidden"
        contentClassName="min-h-0 p-0"
        density="tight"
        eyebrow="Portfolio register"
        title="Project List"
      >
        {filteredProjects.length > 0 ? (
          <ProjectTable
            projects={filteredProjects}
            selectedProjectId={selectedProject.id}
            openActionId={openActionId}
            onActionOpenChange={setOpenActionId}
            onSelect={setSelectedProjectId}
          />
        ) : (
          <EmptyStateCompact
            className="m-3 min-h-[220px]"
            icon={FolderKanban}
            title="No projects match the current filters"
            description="Adjust client, site, phase, risk, status, or search terms to recover the project list."
            action={
              <ToolbarButton onClick={resetFilters}>
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Reset filters
              </ToolbarButton>
            }
          />
        )}
      </DenseSection>
    </CompactPageShell>
  );
}

function ActiveProjectPanel({ project }: { project: ProjectRecord }) {
  const overdueInspections = getProjectIssueValue(project, "overdue-inspections");
  const openRecommendations = getProjectIssueValue(project, "open-recommendations");
  const activeAnomalies = getProjectIssueValue(project, "active-anomalies");
  const overdueActions = getProjectIssueValue(project, "overdue-actions");
  const openRfis = getProjectIssueValue(project, "open-rfis");
  const urgentCertificates = getProjectIssueValue(project, "urgent-certificates");

  return (
    <DenseCard className="overflow-hidden border-blue-100 bg-gradient-to-br from-white via-white to-blue-50/60 dark:border-blue-500/20 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30">
      <div className="grid min-h-[236px] gap-3 p-3 xl:grid-cols-[1.12fr_0.92fr_1.18fr]">
        <div className="flex min-w-0 flex-col rounded-2xl border border-blue-100 bg-white/85 p-3 shadow-sm dark:border-blue-500/20 dark:bg-slate-950/40">
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge label="Active project" tone="blue" withDot />
            <StatusBadge label={project.status} tone={getStatusTone(project.status)} />
            <StatusBadge label={`${project.riskProfile} intensity`} tone={getRiskTone(project.riskProfile)} />
          </div>
          <div className="mt-3 min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-blue-700 dark:text-blue-300">{project.code}</p>
            <h2 className="mt-1 text-xl font-black leading-tight text-slate-950 dark:text-white">{project.name}</h2>
            <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">
              {project.fullFacilityName}
            </p>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-[132px_minmax(0,1fr)]">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3 dark:border-blue-500/20 dark:bg-blue-500/10">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-blue-700 dark:text-blue-300">Asset population</p>
              <p className="mt-1 text-4xl font-black tracking-tight text-blue-800 dark:text-blue-100">{project.assetCount}</p>
              <p className="mt-1 text-xs font-bold text-blue-700/80 dark:text-blue-200">assets registered</p>
            </div>
            <div className="grid content-between gap-2">
              <ProgressCell label="RBI baseline progress" tone="blue" value={project.rbiProgress} />
              <ProgressCell label="Data completeness" tone="emerald" value={project.dataCompleteness} />
              <div className="grid gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>{project.program}</span>
                <span>{project.campaign}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto grid gap-1.5 pt-3 text-xs font-semibold text-slate-600 sm:grid-cols-2 dark:text-slate-300">
            <span className="truncate rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900">{project.operatingMode}</span>
            <span className="truncate rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900">{project.documentation}</span>
          </div>
        </div>

        <div className="grid gap-3">
          <DenseSection density="tight" title="Facility Throughput" contentClassName="grid grid-cols-2 gap-2">
            {project.throughput.map((metric) => (
              <MetricTile key={metric.label} className="p-2.5" label={metric.label} value={metric.value} tone="cyan" />
            ))}
          </DenseSection>
          <DenseSection density="tight" title="Project Governance" contentClassName="space-y-2">
            <CompactInfoRow label="Owner" value={project.projectOwner} />
            <CompactInfoRow label="Facility life" value={project.facilityLife} />
            <CompactInfoRow label="Facility type" value={project.facilityType} />
            <div className="grid max-h-[118px] grid-cols-2 gap-1.5 overflow-y-auto pr-1 aim-shell-scrollbar">
              {project.assetPopulation.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-2.5 py-1.5 dark:bg-slate-950">
                  <span className="truncate text-[11px] font-bold text-slate-500 dark:text-slate-400">{item.label}</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </DenseSection>
        </div>

        <div className="grid gap-3">
          <DenseSection density="tight" title="Delivery Attention" contentClassName="grid grid-cols-2 gap-2">
            {project.issueMetrics.slice(0, 7).map((metric) => (
              <MetricTile key={metric.key} className="p-2.5" label={metric.label} value={metric.value} tone={metric.tone} />
            ))}
          </DenseSection>
          <div className="grid gap-3 xl:grid-cols-[0.85fr_1fr]">
            <DenseSection density="tight" title="Risk Mix" contentClassName="space-y-2">
              <RiskMixRow label="High" value={project.riskDistribution.high} total={project.assetCount} tone="red" />
              <RiskMixRow label="Medium-High" value={project.riskDistribution.mediumHigh} total={project.assetCount} tone="orange" />
              <RiskMixRow label="Medium" value={project.riskDistribution.medium} total={project.assetCount} tone="amber" />
              <RiskMixRow label="Low" value={project.riskDistribution.low} total={project.assetCount} tone="emerald" />
            </DenseSection>
            <DenseSection density="tight" title="Asset / Issue Signals" contentClassName="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {project.tags.slice(0, 4).map((tag) => (
                  <StatusBadge key={tag} label={tag} tone="slate" />
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.issueLabels.slice(0, 3).map((issue) => (
                  <StatusBadge key={issue} label={issue} tone="amber" />
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.standards.slice(0, 3).map((standard) => (
                  <StatusBadge key={standard} label={standard} tone="cyan" />
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <StatusBadge label={`${overdueInspections} overdue inspections`} tone={overdueInspections > 15 ? "red" : "orange"} />
                <StatusBadge label={`${openRecommendations} recommendations`} tone="orange" />
                <StatusBadge label={`${activeAnomalies} anomalies`} tone="amber" />
                <StatusBadge label={`${overdueActions} overdue actions`} tone={overdueActions > 7 ? "red" : "orange"} />
                <StatusBadge label={`${openRfis} RFIs`} tone="cyan" />
                <StatusBadge label={`${urgentCertificates} urgent certs`} tone={urgentCertificates > 3 ? "red" : "amber"} />
              </div>
            </DenseSection>
          </div>
        </div>
      </div>
    </DenseCard>
  );
}

function ProjectTileStrip({
  filteredProjects,
  onSelect,
  selectedProjectId,
  viewMode,
}: {
  filteredProjects: ProjectRecord[];
  onSelect: (projectId: string) => void;
  selectedProjectId: string;
  viewMode: ViewMode;
}) {
  const projectsForStrip = filteredProjects;

  return (
    <div className="grid gap-2 overflow-x-auto pb-1 aim-shell-scrollbar md:grid-cols-2 xl:grid-cols-5">
      {projectsForStrip.map((project) => {
        const selected = project.id === selectedProjectId;

        return (
          <button
            key={project.id}
            type="button"
            onClick={() => onSelect(project.id)}
            className={cn(
              "min-h-[92px] rounded-2xl border bg-white p-3 text-left shadow-sm transition dark:bg-slate-900",
              selected
                ? "border-blue-300 ring-2 ring-blue-100 dark:border-blue-500/60 dark:ring-blue-500/20"
                : "border-slate-200 hover:border-blue-200 hover:bg-blue-50/40 dark:border-slate-800 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10",
              viewMode === "table" ? "min-h-[82px]" : "",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.12em] text-blue-700 dark:text-blue-300">{project.code}</p>
                <p className="mt-1 line-clamp-2 text-sm font-black leading-5 text-slate-950 dark:text-white">{project.name}</p>
              </div>
              <StatusBadge label={project.status} tone={getStatusTone(project.status)} />
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <TileMiniMetric label="Assets" value={project.assetCount} />
              <TileMiniMetric label="Data" value={`${project.dataCompleteness}%`} />
              <TileMiniMetric label="RBI" value={`${project.rbiProgress}%`} />
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <StatusBadge label={project.riskProfile} tone={getRiskTone(project.riskProfile)} />
              <span className="truncate text-[11px] font-bold text-slate-500 dark:text-slate-400">{project.phase}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ProjectTable({
  onActionOpenChange,
  onSelect,
  openActionId,
  projects,
  selectedProjectId,
}: {
  onActionOpenChange: (projectId: string | null) => void;
  onSelect: (projectId: string) => void;
  openActionId: string | null;
  projects: ProjectRecord[];
  selectedProjectId: string;
}) {
  return (
    <DenseTable maxHeight="max(260px,min(420px,calc(100vh-45rem)))" className="min-w-[1320px]" containerClassName="rounded-none border-0">
      <DenseTableHeader>
        <tr>
          <DenseTableHeadCell>Project Code</DenseTableHeadCell>
          <DenseTableHeadCell>Project Name</DenseTableHeadCell>
          <DenseTableHeadCell>Client / Site</DenseTableHeadCell>
          <DenseTableHeadCell>Facility Type</DenseTableHeadCell>
          <DenseTableHeadCell>Phase</DenseTableHeadCell>
          <DenseTableHeadCell>Data Completeness</DenseTableHeadCell>
          <DenseTableHeadCell>RBI Progress</DenseTableHeadCell>
          <DenseTableHeadCell>Asset Count</DenseTableHeadCell>
          <DenseTableHeadCell>Overdue Actions</DenseTableHeadCell>
          <DenseTableHeadCell>Project Owner</DenseTableHeadCell>
          <DenseTableHeadCell>Status</DenseTableHeadCell>
          <DenseTableHeadCell className="text-right">Actions</DenseTableHeadCell>
        </tr>
      </DenseTableHeader>
      <tbody>
        {projects.map((project) => {
          const selected = project.id === selectedProjectId;
          const overdueActions = getProjectIssueValue(project, "overdue-actions");

          return (
            <DenseTableRow
              key={project.id}
              interactive
              onClick={() => onSelect(project.id)}
              className={selected ? "bg-blue-50/80 dark:bg-blue-500/10" : ""}
            >
              <DenseTableCell>
                <div className="flex items-center gap-2">
                  <span className="font-black text-blue-700 dark:text-blue-300">{project.code}</span>
                  {selected ? <span className="h-2 w-2 rounded-full bg-blue-600" aria-label="Selected" /> : null}
                </div>
              </DenseTableCell>
              <DenseTableCell>
                <div className="max-w-[260px]">
                  <p className="truncate font-black text-slate-950 dark:text-white">{project.name}</p>
                  <p className="truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">{project.program}</p>
                </div>
              </DenseTableCell>
              <DenseTableCell>
                <div className="max-w-[220px]">
                  <p className="truncate text-xs font-black text-slate-700 dark:text-slate-200">{project.client}</p>
                  <p className="truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">{project.site}</p>
                </div>
              </DenseTableCell>
              <DenseTableCell className="max-w-[180px] truncate text-xs font-semibold">{project.facilityType}</DenseTableCell>
              <DenseTableCell>
                <StatusBadge label={project.phase} tone={getPhaseTone(project.phase)} />
              </DenseTableCell>
              <DenseTableCell>
                <ProgressCell label="Completeness" tone={project.dataCompleteness >= 75 ? "emerald" : "amber"} value={project.dataCompleteness} />
              </DenseTableCell>
              <DenseTableCell>
                <ProgressCell label="RBI" tone={project.rbiProgress >= 50 ? "blue" : "violet"} value={project.rbiProgress} />
              </DenseTableCell>
              <DenseTableCell>
                <span className="text-sm font-black text-slate-950 dark:text-white">{project.assetCount}</span>
              </DenseTableCell>
              <DenseTableCell>
                <StatusBadge label={String(overdueActions)} tone={overdueActions > 7 ? "red" : "orange"} withDot />
              </DenseTableCell>
              <DenseTableCell className="max-w-[210px] truncate text-xs font-semibold">{project.projectOwner}</DenseTableCell>
              <DenseTableCell>
                <StatusBadge label={project.status} tone={getStatusTone(project.status)} withDot />
              </DenseTableCell>
              <DenseTableCell className="relative text-right">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onActionOpenChange(openActionId === project.id ? null : project.id);
                  }}
                  className="inline-grid h-8 w-8 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:text-blue-700 dark:border-slate-700 dark:text-slate-300"
                  aria-label={`Open actions for ${project.code}`}
                >
                  <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                </button>
                {openActionId === project.id ? (
                  <div className="absolute right-2 top-9 z-20 w-44 rounded-2xl border border-slate-200 bg-white p-1.5 text-left shadow-xl dark:border-slate-800 dark:bg-slate-950">
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-blue-500/10 dark:hover:text-blue-200"
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      Open project
                    </Link>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      Evidence snapshot
                    </button>
                  </div>
                ) : null}
              </DenseTableCell>
            </DenseTableRow>
          );
        })}
      </tbody>
    </DenseTable>
  );
}

function CompactPopover({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute z-30 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CompactInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[94px_minmax(0,1fr)] gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950">
      <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">{label}</span>
      <span className="truncate text-xs font-bold text-slate-700 dark:text-slate-200">{value}</span>
    </div>
  );
}

function RiskMixRow({
  label,
  tone,
  total,
  value,
}: {
  label: string;
  tone: "amber" | "emerald" | "orange" | "red";
  total: number;
  value: number;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2 text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <ProgressMiniBar tone={tone} value={Math.round((value / Math.max(total, 1)) * 100)} />
    </div>
  );
}

function TileMiniMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-2 py-1.5 dark:bg-slate-950">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-black text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
