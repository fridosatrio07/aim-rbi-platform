import type { ReactNode } from "react";
import { Database } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ProjectSummary } from "../types/projects-list.types";
import { clampPercent, formatNumber, getRiskDotClass, getStatusBadgeClass } from "./projects-list-style-utils";

export function ProjectSummaryCard({
  onSelect,
  project,
  selected,
}: {
  onSelect: (projectId: string) => void;
  project: ProjectSummary;
  selected: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(project.id)}
      className={cn(
        "min-h-[126px] min-w-[226px] rounded-lg border bg-white p-3 text-left shadow-sm shadow-slate-950/[0.03] transition dark:bg-slate-900",
        selected
          ? "border-blue-500 ring-2 ring-blue-500/20"
          : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 dark:border-slate-800 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10",
      )}
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-black text-blue-900 dark:text-blue-200">{project.code}</p>
          <p className="mt-1 line-clamp-2 text-sm font-black leading-5 text-slate-950 dark:text-white">{project.name}</p>
          <p className="mt-0.5 truncate text-xs font-semibold text-blue-800 dark:text-blue-300">{project.site}</p>
        </div>
        <span className={cn("rounded-md border px-2 py-0.5 text-[11px] font-black", getStatusBadgeClass(project.status))}>{project.status}</span>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        <MiniMetric icon={<Database className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />} label="Assets" value={formatNumber(project.assetCount)} />
        <MiniMetric icon={<MiniRing value={project.rbiProgress} />} label="RBI" value={`${project.rbiProgress}%`} />
        <MiniMetric icon={<span className={cn("h-2.5 w-2.5 rounded-full", getRiskDotClass(project.riskProfile))} />} label="Risk Profile" value={project.riskProfile} />
        <MiniMetric icon={<MiniRing tone="emerald" value={project.dataCompleteness} />} label="Data" value={`${project.dataCompleteness}%`} />
      </div>
    </button>
  );
}

function MiniMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex h-5 items-center gap-1.5">
        {icon}
        <span className="truncate text-[11px] font-black text-slate-800 dark:text-slate-100">{value}</span>
      </div>
      <p className="mt-0.5 truncate text-[10px] font-semibold text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

function MiniRing({ tone = "blue", value }: { tone?: "blue" | "emerald"; value: number }) {
  const normalized = clampPercent(value);
  const radius = 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <svg className={cn("h-5 w-5 -rotate-90", tone === "emerald" ? "text-emerald-600" : "text-blue-600")} viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" fill="none" r={radius} stroke="currentColor" strokeOpacity="0.18" strokeWidth="2.4" />
      <circle cx="10" cy="10" fill="none" r={radius} stroke="currentColor" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" strokeWidth="2.4" />
    </svg>
  );
}
