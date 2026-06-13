export type ProjectStatus = "Active" | "Planning";

export type ProjectPhase = "RBI Baseline" | "RBI Detailed" | "Scoping" | "Inspection";

export type ProjectRiskProfile = "Medium" | "Medium-High" | "High";

export type ProjectTone = "blue" | "cyan" | "teal" | "emerald" | "amber" | "orange" | "red" | "slate" | "violet";

export interface ProjectKpi {
  id: string;
  label: string;
  value: string;
  supportLabel: string;
  tone: ProjectTone;
  sparkline: number[];
}

export interface FacilityOverviewItem {
  id: string;
  label: string;
  value: string;
}

export interface ProjectMetricTile {
  id: string;
  label: string;
  value: string;
  tone: ProjectTone;
}

export interface ProjectSummary {
  id: string;
  code: string;
  name: string;
  client: string;
  site: string;
  clientSite: string;
  facilityType: string;
  status: ProjectStatus;
  phase: ProjectPhase;
  assetCount: number;
  rbiProgress: number;
  riskProfile: ProjectRiskProfile;
  dataCompleteness: number;
  overdueActions: number;
  projectOwner: string;
  imageSrc: string;
  subtitle: string;
  tags: string[];
  description: string;
  ownerDisplay: string;
  intensityPercent: number;
  intensityLabel: string;
  facilityOverview: FacilityOverviewItem[];
  metricTiles: ProjectMetricTile[];
}

export interface ProjectFilterState {
  client: string;
  site: string;
  phase: string;
  riskProfile: string;
  status: string;
  search: string;
}
