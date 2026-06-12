import type { LucideIcon } from "lucide-react";

import {
  AlertTriangle,
  ClipboardCheck,
  ClipboardList,
  Database,
  FileText,
  FolderKanban,
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
  parentHref?: string;
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
];

export const DEFAULT_OPEN_NAVIGATION_KEYS: string[] = [];

export const NAVIGATION_PAGES: NavigationPage[] = NAVIGATION_ITEMS.flatMap((item) => [
  { label: item.label, href: item.href },
  ...(item.children ?? []).map((child) => ({
    label: child.label,
    href: child.href,
    parentLabel: item.label,
    parentHref: item.href,
  })),
]);

export function isNavigationHrefActive(pathname: string, href: string) {
  const normalizedPathname = normalizeNavigationPath(pathname);
  const normalizedHref = normalizeNavigationPath(href);

  return normalizedPathname === normalizedHref || normalizedPathname.startsWith(`${normalizedHref}/`);
}

export function getNavigationPageByPath(pathname: string) {
  const sortedPages = [...NAVIGATION_PAGES].sort((a, b) => b.href.length - a.href.length);

  return sortedPages.find((page) => isNavigationHrefActive(normalizeNavigationPath(pathname), page.href));
}

export function getNavigationParentByPath(pathname: string) {
  const normalizedPathname = normalizeNavigationPath(pathname);
  const currentPage = getNavigationPageByPath(normalizedPathname);

  if (currentPage?.parentHref) {
    return {
      href: currentPage.parentHref,
      label: currentPage.parentLabel ?? getNavigationLabelByHref(currentPage.parentHref) ?? "Parent Module",
    };
  }

  const derivedParentPath = getParentRouteByPath(normalizedPathname);

  if (derivedParentPath && isProtectedNavigationPath(derivedParentPath)) {
    return {
      href: derivedParentPath,
      label: getNavigationLabelByHref(derivedParentPath) ?? getReadableRouteSegment(derivedParentPath),
    };
  }

  if (normalizedPathname !== "/dashboard") {
    return {
      href: "/dashboard",
      label: "Dashboard",
    };
  }

  return undefined;
}

export function getNavigationBreadcrumbsByPath(pathname: string) {
  const normalizedPathname = normalizeNavigationPath(pathname);
  const page = getNavigationPageByPath(normalizedPathname);
  const parent = getNavigationParentByPath(normalizedPathname);
  const breadcrumbs: NavigationPage[] = [];

  if (parent && parent.href !== normalizedPathname) {
    breadcrumbs.push({ href: parent.href, label: parent.label });
  }

  breadcrumbs.push({
    href: page?.href ?? normalizedPathname,
    label: page?.label ?? getReadableRouteSegment(normalizedPathname),
    parentHref: parent?.href,
    parentLabel: parent?.label,
  });

  return breadcrumbs;
}

export function getParentRouteByPath(pathname: string) {
  const normalizedPathname = normalizeNavigationPath(pathname);
  const segments = normalizedPathname.split("/").filter(Boolean);

  if (segments.length <= 1) return undefined;

  return `/${segments.slice(0, -1).join("/")}`;
}

export function getModuleRootByPath(pathname: string) {
  const normalizedPathname = normalizeNavigationPath(pathname);

  return NAVIGATION_ITEMS.find((item) => isNavigationHrefActive(normalizedPathname, item.href));
}

function getNavigationLabelByHref(href: string) {
  const normalizedHref = normalizeNavigationPath(href);
  const item = NAVIGATION_ITEMS.find((navigationItem) => normalizeNavigationPath(navigationItem.href) === normalizedHref);

  if (item) return item.label;

  return NAVIGATION_ITEMS.flatMap((navigationItem) => navigationItem.children ?? []).find(
    (child) => normalizeNavigationPath(child.href) === normalizedHref,
  )?.label;
}

export function isProtectedNavigationPath(pathname: string) {
  const normalizedPathname = normalizeNavigationPath(pathname);

  return NAVIGATION_ITEMS.some((item) => isNavigationHrefActive(normalizedPathname, item.href));
}

function normalizeNavigationPath(pathname: string) {
  const [pathWithoutQuery] = pathname.split("?");
  const trimmedPath = pathWithoutQuery.split("#")[0]?.replace(/\/+$/, "") || "/";

  return trimmedPath === "" ? "/" : trimmedPath;
}

function getReadableRouteSegment(pathname: string) {
  const normalizedPathname = normalizeNavigationPath(pathname);
  const segment = normalizedPathname.split("/").filter(Boolean).at(-1);

  if (!segment) return "Dashboard";

  return segment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
