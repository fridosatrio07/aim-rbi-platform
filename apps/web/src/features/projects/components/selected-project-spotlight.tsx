import Image from "next/image";
import { Database, UsersRound } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ProjectSummary } from "../types/projects-list.types";
import { ProjectFacilityOverview } from "./project-facility-overview";
import { ProjectIntensityScale } from "./project-intensity-scale";
import { ProjectProgressDonut } from "./project-progress-donut";
import { getStatusBadgeClass, getToneTextClass } from "./projects-list-style-utils";

const tagStyles = [
  "border-blue-100 bg-blue-50 text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200",
  "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
  "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
  "border-teal-100 bg-teal-50 text-teal-800 dark:border-teal-500/20 dark:bg-teal-500/10 dark:text-teal-200",
];

export function SelectedProjectSpotlight({ project }: { project: ProjectSummary }) {
  return (
    <section className="overflow-hidden rounded-lg border border-blue-500 bg-white shadow-sm shadow-blue-950/10 ring-1 ring-blue-500/20 dark:bg-slate-900">
      <div className="grid gap-3 p-2.5 xl:grid-cols-[248px_minmax(0,1fr)] 2xl:grid-cols-[248px_minmax(390px,1fr)_minmax(650px,1.52fr)]">
        <div className="relative h-[226px] overflow-hidden rounded-md border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
          <Image
            src={project.imageSrc}
            alt={`${project.subtitle} industrial gathering station`}
            fill
            priority
            sizes="248px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-slate-950/5" />
          <span className={cn("absolute left-2 top-2 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase", getStatusBadgeClass(project.status))}>
            {project.status === "Active" ? "Active Project" : "Planning Project"}
          </span>
          <div className="absolute bottom-0 left-0 w-[94px] rounded-tr-lg bg-blue-800 px-3 py-2.5 text-white shadow-lg shadow-blue-950/20">
            <p className="text-4xl font-black leading-none tracking-tight">{project.assetCount}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-bold">
              <Database className="h-3.5 w-3.5" aria-hidden="true" />
              Assets
            </p>
          </div>
        </div>

        <div className="min-w-0 px-1.5 py-2">
          <h2 className="text-xl font-black leading-tight tracking-tight text-slate-950 dark:text-white">
            {project.code} {project.name}
          </h2>
          <p className="mt-1 text-lg font-black leading-tight text-blue-700 dark:text-blue-300">{project.subtitle}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span
                key={tag}
                className={cn("rounded-md border px-3 py-1 text-xs font-bold", tagStyles[index] ?? tagStyles[1])}
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="mt-3 max-w-[620px] text-sm font-medium leading-6 text-slate-700 dark:text-slate-300">{project.description}</p>

          <div className="mt-8">
            <p className="text-xs font-black text-blue-800 dark:text-blue-200">Project Owner</p>
            <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
              <UsersRound className="h-5 w-5 text-blue-700 dark:text-blue-300" aria-hidden="true" />
              <span>{project.ownerDisplay}</span>
            </div>
          </div>
        </div>

        <div className="grid min-w-0 gap-3 border-t border-slate-200 pt-3 xl:col-span-2 2xl:col-span-1 2xl:border-l 2xl:border-t-0 2xl:pl-4 2xl:pt-0 dark:border-slate-800">
          <div className="grid gap-3 lg:grid-cols-[170px_minmax(220px,260px)_minmax(300px,1fr)]">
            <div className="min-w-0 border-r border-slate-200 pr-3 dark:border-slate-800">
              <p className="text-xs font-black text-blue-800 dark:text-blue-200">RBI baseline in progress</p>
              <div className="mt-3">
                <ProjectProgressDonut value={project.rbiProgress} />
              </div>
            </div>

            <div className="min-w-0 border-r border-slate-200 pr-3 dark:border-slate-800">
              <p className="text-xs font-black text-blue-800 dark:text-blue-200">Overall Portfolio Intensity</p>
              <p className="mt-3 text-2xl font-black text-orange-600 dark:text-orange-300">{project.intensityLabel}</p>
              <ProjectIntensityScale value={project.intensityPercent} />
            </div>

            <ProjectFacilityOverview className="lg:row-span-2" items={project.facilityOverview} />

            <div className="grid gap-2 lg:col-span-2 sm:grid-cols-2 xl:grid-cols-4">
              {project.metricTiles.map((metric) => (
                <div key={metric.id} className="min-h-[56px] rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
                  <p className="truncate text-[11px] font-medium text-slate-600 dark:text-slate-400">{metric.label}</p>
                  <p className={cn("mt-1 text-xl font-black", getToneTextClass(metric.tone))}>{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
