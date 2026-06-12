import type {
  AnomalySeverity,
  CertificateStatus,
  DocumentCompletenessSegment,
  InspectionDueStatus,
  RiskLevel,
} from "./dashboard-types";

export type DashboardRiskFilter = RiskLevel | "all";
export type DashboardAssetClassFilter = string | "all";
export type DashboardInspectionFilter = InspectionDueStatus | "all";
export type DashboardCertificateFilter = CertificateStatus | "all";
export type DashboardAnomalyFilter = AnomalySeverity | "all";
export type DashboardDocumentFilter = DocumentCompletenessSegment["status"] | "all";

export interface DashboardFilterState {
  riskLevel: DashboardRiskFilter;
  assetClass: DashboardAssetClassFilter;
  inspectionDueStatus: DashboardInspectionFilter;
  certificateStatus: DashboardCertificateFilter;
  anomalySeverity: DashboardAnomalyFilter;
  documentCompletenessStatus: DashboardDocumentFilter;
}

export interface DashboardDateRange {
  presetId: "last-30" | "last-90" | "campaign" | "custom" | null;
  startDate: string;
  endDate: string;
}

export interface DashboardDatePreset {
  id: NonNullable<DashboardDateRange["presetId"]>;
  label: string;
  startDate: string;
  endDate: string;
}

export const DASHBOARD_DATE_PRESETS: DashboardDatePreset[] = [
  {
    id: "last-30",
    label: "Last 30 Days",
    startDate: "2026-05-13",
    endDate: "2026-06-12",
  },
  {
    id: "last-90",
    label: "Last 90 Days",
    startDate: "2026-03-15",
    endDate: "2026-06-12",
  },
  {
    id: "campaign",
    label: "Renewal Campaign",
    startDate: "2026-04-01",
    endDate: "2026-09-30",
  },
];

export const DEFAULT_DASHBOARD_DATE_RANGE: DashboardDateRange = {
  presetId: "last-30",
  startDate: "2026-05-13",
  endDate: "2026-06-12",
};

export const DEFAULT_DASHBOARD_FILTERS: DashboardFilterState = {
  riskLevel: "all",
  assetClass: "all",
  inspectionDueStatus: "overdue",
  certificateStatus: "all",
  anomalySeverity: "all",
  documentCompletenessStatus: "all",
};

export const INSPECTION_STATUS_ORDER: InspectionDueStatus[] = [
  "overdue",
  "due-30",
  "due-90",
  "current",
  "pending-validation",
];
