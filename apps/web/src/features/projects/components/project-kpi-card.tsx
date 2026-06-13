import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ProjectKpi } from "../types/projects-list.types";
import { getToneIconClass, getToneTextClass } from "./projects-list-style-utils";

export function ProjectKpiCard({ Icon, kpi }: { Icon: LucideIcon; kpi: ProjectKpi }) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-3 shadow-sm shadow-slate-950/[0.04] dark:border-slate-800 dark:bg-slate-900">
      <div className="grid h-full min-h-[76px] grid-cols-[42px_minmax(0,1fr)_78px] items-center gap-3">
        <div className={cn("grid h-10 w-10 place-items-center rounded-lg border", getToneIconClass(kpi.tone))}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold text-slate-600 dark:text-slate-300">{kpi.label}</p>
          <p className="mt-0.5 truncate text-2xl font-black tracking-tight text-slate-950 dark:text-white">{kpi.value}</p>
          <p className="mt-1 truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">{kpi.supportLabel}</p>
        </div>
        <Sparkline points={kpi.sparkline} className={getToneTextClass(kpi.tone)} />
      </div>
    </div>
  );
}

function Sparkline({ className, points }: { className?: string; points: number[] }) {
  const path = getSparklinePath(points);

  return (
    <svg className={cn("h-9 w-[78px] self-end", className)} viewBox="0 0 78 36" aria-hidden="true">
      <path d="M0 32H78" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" />
      <path d={path} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function getSparklinePath(points: number[]) {
  if (points.length < 2) return "";

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const xStep = 78 / (points.length - 1);

  return points
    .map((point, index) => {
      const x = index * xStep;
      const y = 31 - ((point - min) / range) * 24;

      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}
