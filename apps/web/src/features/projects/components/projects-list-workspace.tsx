"use client";

import { useMemo, useState } from "react";

import { DEFAULT_PROJECT_FILTERS, PROJECTS_LIST_KPIS, PROJECTS_LIST_PROJECTS } from "../data/projects-list.mock";
import type { ProjectFilterState, ProjectSummary } from "../types/projects-list.types";
import { ProjectCardStrip } from "./project-card-strip";
import { ProjectsFilterToolbar } from "./projects-filter-toolbar";
import { ProjectsKpiStrip } from "./projects-kpi-strip";
import { ProjectsPageHeader } from "./projects-page-header";
import { ProjectsRegisterTable } from "./projects-register-table";
import { SelectedProjectSpotlight } from "./selected-project-spotlight";

export function ProjectsListWorkspace() {
  const [selectedProjectId, setSelectedProjectId] = useState("spm-01");
  const [filters, setFilters] = useState<ProjectFilterState>(DEFAULT_PROJECT_FILTERS);

  const filterOptions = useMemo(
    () => ({
      clients: ["All Clients", ...getUniqueOptions(PROJECTS_LIST_PROJECTS, (project) => project.client)],
      phases: ["All Phases", ...getUniqueOptions(PROJECTS_LIST_PROJECTS, (project) => project.phase)],
      riskProfiles: ["All Risk Profiles", ...getUniqueOptions(PROJECTS_LIST_PROJECTS, (project) => project.riskProfile)],
      sites: ["All Sites", ...getUniqueOptions(PROJECTS_LIST_PROJECTS, (project) => project.site)],
      statuses: ["All Statuses", ...getUniqueOptions(PROJECTS_LIST_PROJECTS, (project) => project.status)],
    }),
    [],
  );

  const visibleProjects = useMemo(() => filterProjects(PROJECTS_LIST_PROJECTS, filters), [filters]);
  const selectedProject =
    PROJECTS_LIST_PROJECTS.find((project) => project.id === selectedProjectId) ?? PROJECTS_LIST_PROJECTS[0];

  function updateFilter(key: keyof ProjectFilterState, value: string) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetFilters() {
    setFilters(DEFAULT_PROJECT_FILTERS);
  }

  return (
    <div className="space-y-3 text-slate-950 dark:text-slate-100">
      <ProjectsPageHeader />
      <ProjectsKpiStrip kpis={PROJECTS_LIST_KPIS} />
      <SelectedProjectSpotlight project={selectedProject} />
      <ProjectsFilterToolbar filters={filters} options={filterOptions} onFilterChange={updateFilter} onReset={resetFilters} />
      <ProjectCardStrip projects={PROJECTS_LIST_PROJECTS} selectedProjectId={selectedProject.id} onSelect={setSelectedProjectId} />
      {visibleProjects.length > 0 ? (
        <ProjectsRegisterTable projects={visibleProjects} selectedProjectId={selectedProject.id} onSelect={setSelectedProjectId} />
      ) : (
        <div className="grid min-h-[220px] place-items-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          No projects match the current filters.
        </div>
      )}
    </div>
  );
}

function filterProjects(projects: ProjectSummary[], filters: ProjectFilterState) {
  const query = filters.search.trim().toLowerCase();

  return projects.filter((project) => {
    if (filters.client !== "All Clients" && project.client !== filters.client) return false;
    if (filters.site !== "All Sites" && project.site !== filters.site) return false;
    if (filters.phase !== "All Phases" && project.phase !== filters.phase) return false;
    if (filters.riskProfile !== "All Risk Profiles" && project.riskProfile !== filters.riskProfile) return false;
    if (filters.status !== "All Statuses" && project.status !== filters.status) return false;

    if (!query) return true;

    return [
      project.code,
      project.name,
      project.client,
      project.site,
      project.clientSite,
      project.facilityType,
      project.phase,
      project.riskProfile,
      project.status,
      project.projectOwner,
    ]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

function getUniqueOptions(projects: ProjectSummary[], accessor: (project: ProjectSummary) => string) {
  return Array.from(new Set(projects.map(accessor))).sort((a, b) => a.localeCompare(b));
}
