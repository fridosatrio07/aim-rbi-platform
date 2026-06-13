import type { CompactTone } from "@/components/data-display/compact-primitives";

import { PROJECTS_DATA } from "./project-data";
import type { ProjectFilters, ProjectPhase, ProjectRecord, ProjectRiskProfile, ProjectStatus } from "./project-types";

export function filterProjects(projects: ProjectRecord[], filters: ProjectFilters) {
  const query = filters.search.trim().toLowerCase();

  return projects.filter((project) => {
    if (filters.client !== "All" && project.client !== filters.client) return false;
    if (filters.site !== "All" && project.site !== filters.site) return false;
    if (filters.phase !== "All" && project.phase !== filters.phase) return false;
    if (filters.riskProfile !== "All" && project.riskProfile !== filters.riskProfile) return false;
    if (filters.status !== "All" && project.status !== filters.status) return false;

    if (!query) return true;

    const searchable = [
      project.code,
      project.name,
      project.fullFacilityName,
      project.client,
      project.site,
      project.facilityType,
      project.projectOwner,
      project.phase,
      project.status,
      project.riskProfile,
      ...project.tags,
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(query);
  });
}

export function getProjectPortfolioKpis(projects: ProjectRecord[]) {
  const totalProjects = projects.length;
  const activeProjects = projects.filter((project) => project.status === "Active").length;
  const totalAssets = projects.reduce((sum, project) => sum + project.assetCount, 0);
  const overdueActions = projects.reduce((sum, project) => sum + getProjectIssueValue(project, "overdue-actions"), 0);
  const averageDataCompleteness = Math.round(
    projects.reduce((sum, project) => sum + project.dataCompleteness, 0) / Math.max(projects.length, 1),
  );
  const averageRbiProgress = Math.round(
    projects.reduce((sum, project) => sum + project.rbiProgress, 0) / Math.max(projects.length, 1),
  );

  return {
    activeProjects,
    averageDataCompleteness,
    averageRbiProgress,
    overdueActions,
    totalAssets,
    totalProjects,
  };
}

export function getProjectIssueValue(project: ProjectRecord, key: string) {
  return project.issueMetrics.find((metric) => metric.key === key)?.value ?? 0;
}

export function getProjectOptionValues<T extends string>(projects: ProjectRecord[], accessor: (project: ProjectRecord) => T) {
  return Array.from(new Set(projects.map(accessor))).sort((a, b) => a.localeCompare(b));
}

export function getClientOptions() {
  return getProjectOptionValues(PROJECTS_DATA, (project) => project.client);
}

export function getSiteOptions() {
  return getProjectOptionValues(PROJECTS_DATA, (project) => project.site);
}

export function getPhaseOptions() {
  return getProjectOptionValues<ProjectPhase>(PROJECTS_DATA, (project) => project.phase);
}

export function getRiskProfileOptions() {
  return getProjectOptionValues<ProjectRiskProfile>(PROJECTS_DATA, (project) => project.riskProfile);
}

export function getStatusOptions() {
  return getProjectOptionValues<ProjectStatus>(PROJECTS_DATA, (project) => project.status);
}

export function getRiskTone(riskProfile: ProjectRiskProfile): CompactTone {
  if (riskProfile === "High") return "red";
  if (riskProfile === "Medium-High") return "orange";
  if (riskProfile === "Medium") return "amber";

  return "emerald";
}

export function getStatusTone(status: ProjectStatus): CompactTone {
  if (status === "Active") return "blue";
  if (status === "At Risk") return "red";
  if (status === "Monitoring") return "cyan";

  return "slate";
}

export function getPhaseTone(phase: ProjectPhase): CompactTone {
  if (phase === "RBI Baseline") return "blue";
  if (phase === "Certification Recovery") return "amber";
  if (phase === "Integrity Review") return "violet";
  if (phase === "Revamp Readiness") return "cyan";

  return "emerald";
}
