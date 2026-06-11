import type { LucideIcon } from "lucide-react";

import {
  AlertTriangle,
  Building2,
  ClipboardCheck,
  ClipboardList,
  Database,
  FileText,
  FolderKanban,
  Headphones,
  Home,
  Settings,
  ShieldCheck,
} from "lucide-react";

export interface NavigationChild {
  label: string;
  href: string;
}

export interface NavigationItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  children?: NavigationChild[];
}

export interface NavigationPage {
  label: string;
  href: string;
  parentLabel?: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    key: "projects",
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
    children: [
      { label: "Project List", href: "/projects" },
      { label: "Templates", href: "/projects/templates" },
    ],
  },
  {
    key: "asset-registry",
    label: "Assets",
    href: "/assets",
    icon: Database,
    children: [
      { label: "Asset List", href: "/assets" },
      { label: "Import / Update", href: "/assets/import" },
    ],
  },
  {
    key: "integrity-rbi",
    label: "Integrity / RBI",
    href: "/integrity-rbi",
    icon: ClipboardList,
    children: [
      { label: "Overview", href: "/integrity-rbi" },
      { label: "Risk Register", href: "/integrity-rbi/risk-register" },
      { label: "Risk Analytics", href: "/integrity-rbi/risk-analytics" },
      { label: "Assessments", href: "/integrity-rbi/assessments" },
      { label: "Revalidation", href: "/integrity-rbi/revalidation" },
      { label: "IOW / MOC", href: "/integrity-rbi/iow-moc-triggers" },
      { label: "FFS / RLA", href: "/integrity-rbi/ffs-rla" },
      { label: "Methodology", href: "/integrity-rbi/methodology-governance" },
    ],
  },
  {
    key: "inspections",
    label: "Inspections",
    href: "/inspections",
    icon: ClipboardCheck,
    children: [
      { label: "Overview", href: "/inspections" },
      { label: "Plan", href: "/inspections/plan" },
      { label: "Schedule", href: "/inspections/schedule" },
      { label: "Workpacks", href: "/inspections/workpacks" },
      { label: "Execution", href: "/inspections/execution" },
      { label: "Findings", href: "/inspections/findings" },
      { label: "History", href: "/inspections/history" },
    ],
  },
  {
    key: "anomalies-actions",
    label: "Anomalies",
    href: "/anomalies-actions/anomalies",
    icon: AlertTriangle,
    children: [
      { label: "Anomaly Register", href: "/anomalies-actions/anomalies" },
      { label: "Recommendations", href: "/anomalies-actions/recommendations" },
      { label: "Action Tracker", href: "/anomalies-actions/action-tracker" },
      { label: "Close-out", href: "/anomalies-actions/close-out" },
      { label: "Triggered Actions", href: "/anomalies-actions/triggered-actions" },
    ],
  },
  {
    key: "compliance-certification",
    label: "Compliance",
    href: "/compliance-certification",
    icon: ShieldCheck,
    children: [
      { label: "Overview", href: "/compliance-certification" },
      { label: "Certificates", href: "/compliance-certification/certification-register" },
      { label: "Regulatory Matrix", href: "/compliance-certification/regulatory-matrix" },
      { label: "Renewals", href: "/compliance-certification/renewal-tracker" },
      { label: "Evidence Pack", href: "/compliance-certification/evidence-pack" },
      { label: "Submissions", href: "/compliance-certification/submission-approval-log" },
    ],
  },
  {
    key: "documents-reports",
    label: "Docs & Reports",
    href: "/documents-reports/documents",
    icon: FileText,
    children: [
      { label: "Documents", href: "/documents-reports/documents" },
      { label: "Reports", href: "/documents-reports/reports" },
      { label: "Templates", href: "/documents-reports/templates" },
      { label: "Evidence Builder", href: "/documents-reports/evidence-pack-builder" },
      { label: "Transmittal Log", href: "/documents-reports/transmittal-log" },
      { label: "Archive", href: "/documents-reports/archive" },
    ],
  },
  {
    key: "helpdesk",
    label: "Helpdesk",
    href: "/helpdesk",
    icon: Headphones,
    children: [
      { label: "Overview", href: "/helpdesk" },
      { label: "Create Ticket", href: "/helpdesk/create-ticket" },
      { label: "Tickets", href: "/helpdesk/tickets" },
      { label: "SLA Dashboard", href: "/helpdesk/sla-dashboard" },
      { label: "Knowledge Base", href: "/helpdesk/knowledge-base" },
    ],
  },
  {
    key: "administration",
    label: "Administration",
    href: "/administration",
    icon: Settings,
    children: [
      { label: "Overview", href: "/administration" },
      { label: "Users", href: "/administration/users" },
      { label: "Roles", href: "/administration/roles-permissions" },
      { label: "Client / Site / Project", href: "/administration/client-site-project" },
      { label: "Asset Taxonomy", href: "/administration/asset-taxonomy" },
      { label: "Risk Matrix", href: "/administration/risk-matrix" },
      { label: "RBI Methodology", href: "/administration/rbi-methodology" },
      { label: "Regulatory Library", href: "/administration/regulatory-standard-library" },
      { label: "Inspection Templates", href: "/administration/inspection-templates" },
      { label: "Approval Workflow", href: "/administration/approval-workflows" },
      { label: "Notifications", href: "/administration/notification-settings" },
      { label: "Import Mapping", href: "/administration/data-import-mapping" },
      { label: "Audit Trail", href: "/administration/audit-trail" },
      { label: "System Logs", href: "/administration/system-logs" },
    ],
  },
  {
    key: "about-sucofindo",
    label: "About SUCOFINDO",
    href: "/about-sucofindo",
    icon: Building2,
  },
];

export const DEFAULT_OPEN_NAVIGATION_KEYS: string[] = [];

export const NAVIGATION_PAGES: NavigationPage[] = NAVIGATION_ITEMS.flatMap((item) => [
  { label: item.label, href: item.href },
  ...(item.children ?? []).map((child) => ({
    label: child.label,
    href: child.href,
    parentLabel: item.label,
  })),
]);

export function isNavigationHrefActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getNavigationPageByPath(pathname: string) {
  const sortedPages = [...NAVIGATION_PAGES].sort((a, b) => b.href.length - a.href.length);

  return sortedPages.find((page) => isNavigationHrefActive(pathname, page.href));
}

export function isProtectedNavigationPath(pathname: string) {
  return NAVIGATION_ITEMS.some((item) => isNavigationHrefActive(pathname, item.href));
}