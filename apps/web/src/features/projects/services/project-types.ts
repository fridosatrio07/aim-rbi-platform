export type ProjectPhase =
  | "RBI Baseline"
  | "Certification Recovery"
  | "Inspection Campaign"
  | "Integrity Review"
  | "Revamp Readiness";

export type ProjectRiskProfile = "Low" | "Medium" | "Medium-High" | "High";

export type ProjectStatus = "Active" | "Monitoring" | "At Risk" | "Planned";

export type ProjectClient = "SUCOFINDO" | "Pertamina Hulu Energi" | "Medco E&P" | "Premier Oil" | "PGN Saka";

export interface ProjectThroughputMetric {
  label: string;
  value: string;
}

export interface ProjectIssueMetric {
  key: string;
  label: string;
  value: number;
  tone: "blue" | "cyan" | "emerald" | "amber" | "orange" | "red" | "slate";
}

export interface ProjectAssetPopulation {
  label: string;
  value: number;
}

export interface ProjectRecord {
  id: string;
  code: string;
  name: string;
  fullFacilityName: string;
  client: ProjectClient;
  site: string;
  facilityType: string;
  phase: ProjectPhase;
  riskProfile: ProjectRiskProfile;
  status: ProjectStatus;
  projectOwner: string;
  operatingMode: string;
  facilityLife: string;
  documentation: string;
  program: string;
  campaign: string;
  assetCount: number;
  dataCompleteness: number;
  rbiProgress: number;
  issueMetrics: ProjectIssueMetric[];
  throughput: ProjectThroughputMetric[];
  assetPopulation: ProjectAssetPopulation[];
  riskDistribution: {
    high: number;
    mediumHigh: number;
    medium: number;
    low: number;
  };
  tags: string[];
  issueLabels: string[];
  standards: string[];
}

export interface ProjectFilters {
  client: "All" | ProjectClient;
  phase: "All" | ProjectPhase;
  riskProfile: "All" | ProjectRiskProfile;
  search: string;
  site: "All" | string;
  status: "All" | ProjectStatus;
}
