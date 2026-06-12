"use client";

import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Construction, Layers3 } from "lucide-react";

import {
  BreadcrumbTrail,
  NavigationStatusCardCompact,
  PageHeader,
  SectionPanel,
  StatusBadge,
  ToolbarButton,
} from "@/components/data-display/compact-primitives";
import { getNavigationBreadcrumbsByPath, getNavigationParentByPath } from "@/lib/navigation-data";
import { cn } from "@/lib/utils";

interface PlaceholderModulePageProps {
  title: string;
  description?: string;
  parentLabel?: string;
  parentHref?: string;
  route?: string;
  status?: "Prepared" | "In Design" | "In Development" | "Prototype";
  dataSource?: string;
  compact?: boolean;
}

const DEFAULT_DESCRIPTION = "This module is prepared for future development.";

export function PlaceholderModulePage({
  title,
  description = DEFAULT_DESCRIPTION,
  parentLabel,
  parentHref,
  route,
  status = "Prepared",
  dataSource = "Typed mock data / future API contract",
  compact = true,
}: PlaceholderModulePageProps) {
  const pathname = usePathname();
  const currentRoute = route ?? pathname ?? "/";
  const resolvedParent = parentHref
    ? { href: parentHref, label: parentLabel ?? "Parent Module" }
    : getNavigationParentByPath(currentRoute);
  const parent = parentLabel && resolvedParent ? { ...resolvedParent, label: parentLabel } : resolvedParent;
  const breadcrumbs = getNavigationBreadcrumbsByPath(currentRoute);
  const showParentCta = Boolean(parent?.href && parent.href !== currentRoute && currentRoute !== "/dashboard");
  const spacingClassName = compact ? "space-y-3" : "space-y-4";

  return (
    <div className={cn(spacingClassName, "text-slate-950 dark:text-slate-100")}>
      <PageHeader
        icon={Layers3}
        title={title}
        description={description}
        breadcrumb={<BreadcrumbTrail items={breadcrumbs.map((item, index) => ({
          href: index === breadcrumbs.length - 1 ? undefined : item.href,
          label: item.label,
        }))} />}
        action={showParentCta ? <ToolbarButton href={parent?.href}>Back to {parent?.label}</ToolbarButton> : null}
      />

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
        <SectionPanel
          title="Planned Workspace"
          action={<StatusBadge label={status} tone={status === "Prepared" ? "blue" : "cyan"} />}
        >
          <div className="grid gap-3 lg:grid-cols-3">
            <ModuleStateRow
              icon={Construction}
              title="Planned workflows"
              items={["Register or workspace view", "Approval and review state", "Evidence-linked actions"]}
            />
            <ModuleStateRow
              icon={Layers3}
              title="Expected source data"
              items={["Asset and inspection records", "Documents and evidence status", "Audit trail activity"]}
            />
            <ModuleStateRow
              icon={ArrowUpRight}
              title="Future backend integration"
              items={["NestJS workflow API", "FastAPI analytics where required", "PostgreSQL / TimescaleDB entities"]}
            />
          </div>
        </SectionPanel>

        <NavigationStatusCardCompact
          currentRoute={currentRoute}
          dataSource={dataSource}
          status={status}
          parentCta={showParentCta ? <ToolbarButton href={parent?.href}>Back to {parent?.label}</ToolbarButton> : null}
        />
      </div>
    </div>
  );
}

function ModuleStateRow({
  icon: Icon,
  items,
  title,
}: {
  icon: LucideIcon;
  items: string[];
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-black text-slate-950 dark:text-white">{title}</h3>
      </div>
      <ul className="mt-3 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm font-semibold leading-5 text-slate-600 dark:text-slate-300">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
