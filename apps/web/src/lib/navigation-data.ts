import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  ClipboardCheck,
  ClipboardList,
  Database,
  FileText,
  FolderKanban,
  Gauge,
  HardHat,
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
    key: "projects-data-intake",
    label: "Projects & Data Intake",
    href: "/projects",
    icon: FolderKanban,
    children: [
      { label: "Project List", href: "/projects" },
      { label: "Project Templates", href: "/projects/templates" },
    ],
  },
  {
    key: "asset-registry",
    label: "Asset Registry",
    href: "/assets",
    icon: Database,
    children: [
      { label: "Asset List", href: "/assets" },
      { label: "Bulk Import / Update", href: "/assets/import" },
    ],
  },
  {
    key: "integrity-rbi",
    label: "Integrity & RBI",
    href: "/integrity-rbi",
    icon: ClipboardList,
    children: [
      { label: "RBI Overview", href: "/integrity-rbi" },
      { label: "Risk Register", href: "/integrity-rbi/risk-register" },
      { label: "Risk Analytics", href: "/integrity-rbi/risk-analytics" },
      { label: "RBI Assessments", href: "/integrity-rbi/assessments" },
      { label: "RBI Update & Revalidation", href: "/integrity-rbi/revalidation" },
      { label: "IOW & MOC Triggers", href: "/integrity-rbi/iow-moc-triggers" },
      { label: "FFS & RLA Interface", href: "/integrity-rbi/ffs-rla" },
      { label: "Methodology & Governance", href: "/integrity-rbi/methodology-governance" },
    ],
  },
  {
    key: "inspection-management",
    label: "Inspection Management",
    href: "/inspections",
    icon: ClipboardCheck,
    children: [
      { label: "Inspection Overview", href: "/inspections" },
      { label: "Inspection Plan", href: "/inspections/plan" },
      { label: "Inspection Schedule", href: "/inspections/schedule" },
      { label: "Inspection Workpacks", href: "/inspections/workpacks" },
      { label: "Inspection Execution", href: "/inspections/execution" },
      { label: "Inspection Findings", href: "/inspections/findings" },
      { label: "Inspection History", href: "/inspections/history" },
    ],
  },
  {
    key: "anomalies-actions",
    label: "Anomalies & Actions",
    href: "/anomalies-actions/anomalies",
    icon: AlertTriangle,
    children: [
      { label: "Anomaly Register", href: "/anomalies-actions/anomalies" },
      { label: "Recommendation Register", href: "/anomalies-actions/recommendations" },
      { label: "Action Tracker", href: "/anomalies-actions/action-tracker" },
      { label: "Corrective Action Close-out", href: "/anomalies-actions/close-out" },
      { label: "Triggered Actions", href: "/anomalies-actions/triggered-actions" },
    ],
  },
  {
    key: "compliance-certification",
    label: "Compliance & Certification",
    href: "/compliance-certification",
    icon: ShieldCheck,
    children: [
      { label: "Compliance Overview", href: "/compliance-certification" },
      { label: "Certification Register", href: "/compliance-certification/certification-register" },
      { label: "Regulatory Matrix", href: "/compliance-certification/regulatory-matrix" },
      { label: "Renewal Tracker", href: "/compliance-certification/renewal-tracker" },
      { label: "Evidence Pack", href: "/compliance-certification/evidence-pack" },
      { label: "Submission & Approval Log", href: "/compliance-certification/submission-approval-log" },
    ],
  },
  {
    key: "documents-reports",
    label: "Documents & Reports",
    href: "/documents-reports/documents",
    icon: FileText,
    children: [
      { label: "Document Center", href: "/documents-reports/documents" },
      { label: "Report Center", href: "/documents-reports/reports" },
      { label: "Templates", href: "/documents-reports/templates" },
      { label: "Evidence Pack Builder", href: "/documents-reports/evidence-pack-builder" },
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
      { label: "Helpdesk Overview", href: "/helpdesk" },
      { label: "Create Ticket", href: "/helpdesk/create-ticket" },
      { label: "Ticket List", href: "/helpdesk/tickets" },
      { label: "SLA Dashboard", href: "/helpdesk/sla-dashboard" },
      { label: "Knowledge Base", href: "/helpdesk/knowledge-base" },
    ],
  },
  {
    key: "about-sucofindo",
    label: "About SUCOFINDO",
    href: "/about-sucofindo",
    icon: Building2,
  },
  {
    key: "administration",
    label: "Administration",
    href: "/administration",
    icon: Settings,
    children: [
      { label: "Admin Overview", href: "/administration" },
      { label: "User Management", href: "/administration/users" },
      { label: "Role & Permission", href: "/administration/roles-permissions" },
      { label: "Client / Site / Project", href: "/administration/client-site-project" },
      { label: "Asset Taxonomy", href: "/administration/asset-taxonomy" },
      { label: "Risk Matrix", href: "/administration/risk-matrix" },
      { label: "RBI Methodology", href: "/administration/rbi-methodology" },
      { label: "Regulatory & Standard Library", href: "/administration/regulatory-standard-library" },
      { label: "Inspection Templates", href: "/administration/inspection-templates" },
      { label: "Approval Workflow", href: "/administration/approval-workflows" },
      { label: "Notification Settings", href: "/administration/notification-settings" },
      { label: "Data Import Mapping", href: "/administration/data-import-mapping" },
      { label: "Audit Trail", href: "/administration/audit-trail" },
      { label: "System Logs", href: "/administration/system-logs" },
    ],
  },
];

export const DEFAULT_OPEN_NAVIGATION_KEYS = NAVIGATION_ITEMS
  .filter((item) => item.children?.length)
  .map((item) => item.key);

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

export function isChildNavigationHrefActive(pathname: string, parentHref: string, childHref: string) {
  if (pathname === childHref) return true;

  if (childHref === parentHref) {
    return false;
  }

  return pathname.startsWith(`${childHref}/`);
}

export function getNavigationPageByPath(pathname: string) {
  const sortedPages = [...NAVIGATION_PAGES].sort((a, b) => b.href.length - a.href.length);

  return sortedPages.find((page) => isNavigationHrefActive(pathname, page.href));
}

export function isProtectedNavigationPath(pathname: string) {
  return NAVIGATION_ITEMS.some((item) => isNavigationHrefActive(pathname, item.href));
}