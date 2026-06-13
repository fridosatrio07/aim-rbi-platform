import type { ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ProjectSummary, ProjectTone } from "../types/projects-list.types";
import { getPhaseBadgeClass, getStatusBadgeClass, getToneBarClass } from "./projects-list-style-utils";

export function ProjectsRegisterTable({
  onSelect,
  projects,
  selectedProjectId,
}: {
  onSelect: (projectId: string) => void;
  projects: ProjectSummary[];
  selectedProjectId: string;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-950/[0.03] dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto aim-shell-scrollbar">
        <table className="w-full min-w-[1480px] border-separate border-spacing-0 text-left">
          <thead className="bg-slate-50 text-[11px] font-black text-slate-600 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              <HeadCell className="w-10" />
              <HeadCell>Project Code</HeadCell>
              <HeadCell>Project Name</HeadCell>
              <HeadCell>Client/Site</HeadCell>
              <HeadCell>Facility Type</HeadCell>
              <HeadCell>Phase</HeadCell>
              <HeadCell>Data Completeness</HeadCell>
              <HeadCell>RBI Progress</HeadCell>
              <HeadCell>Asset Count</HeadCell>
              <HeadCell>Overdue Actions</HeadCell>
              <HeadCell>Project Owner</HeadCell>
              <HeadCell>Status</HeadCell>
              <HeadCell className="w-14 text-right">Actions</HeadCell>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const selected = project.id === selectedProjectId;
              const [client, site] = project.clientSite.split(" / ");

              return (
                <tr
                  key={project.id}
                  onClick={() => onSelect(project.id)}
                  className={cn(
                    "cursor-pointer text-xs font-medium text-slate-700 transition hover:bg-blue-50/60 dark:text-slate-200 dark:hover:bg-blue-500/10",
                    selected && "bg-blue-50 dark:bg-blue-500/10",
                  )}
                >
                  <BodyCell>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelect(project.id);
                      }}
                      className={cn(
                        "grid h-4 w-4 place-items-center rounded-full border transition",
                        selected ? "border-blue-600 bg-blue-600" : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900",
                      )}
                      aria-label={`Select ${project.code}`}
                    >
                      {selected ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                    </button>
                  </BodyCell>
                  <BodyCell className="font-black text-blue-800 dark:text-blue-200">{project.code}</BodyCell>
                  <BodyCell>
                    <span className="block max-w-[210px] truncate font-semibold text-slate-950 dark:text-white">{project.name}</span>
                  </BodyCell>
                  <BodyCell>
                    <span className="block max-w-[150px] truncate font-semibold text-slate-900 dark:text-slate-100">{client}</span>
                    <span className="block max-w-[150px] truncate text-[11px] text-slate-500 dark:text-slate-400">{site}</span>
                  </BodyCell>
                  <BodyCell>{project.facilityType}</BodyCell>
                  <BodyCell>
                    <span className={cn("inline-flex h-6 items-center rounded-md border px-2 text-[11px] font-black", getPhaseBadgeClass(project.phase))}>
                      {project.phase}
                    </span>
                  </BodyCell>
                  <BodyCell>
                    <ProgressValue tone={project.dataCompleteness >= 72 ? "blue" : "orange"} value={project.dataCompleteness} />
                  </BodyCell>
                  <BodyCell>
                    <ProgressValue tone="blue" value={project.rbiProgress} />
                  </BodyCell>
                  <BodyCell className="font-black text-blue-800 dark:text-blue-200">{project.assetCount}</BodyCell>
                  <BodyCell className="font-black text-red-600 dark:text-red-300">{project.overdueActions}</BodyCell>
                  <BodyCell>
                    <span className="block max-w-[190px] whitespace-normal leading-4">{project.projectOwner}</span>
                  </BodyCell>
                  <BodyCell>
                    <span className={cn("inline-flex h-6 items-center rounded-md border px-2 text-[11px] font-black", getStatusBadgeClass(project.status))}>
                      {project.status}
                    </span>
                  </BodyCell>
                  <BodyCell className="text-right">
                    <button
                      type="button"
                      onClick={(event) => event.stopPropagation()}
                      className="inline-grid h-8 w-8 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-200"
                      aria-label={`Open actions for ${project.code}`}
                    >
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </BodyCell>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function HeadCell({ children, className }: { children?: ReactNode; className?: string }) {
  return <th className={cn("border-b border-slate-200 px-3 py-2 align-middle dark:border-slate-800", className)}>{children}</th>;
}

function BodyCell({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn("border-b border-slate-100 px-3 py-2 align-middle dark:border-slate-800/80", className)}>{children}</td>;
}

function ProgressValue({ tone, value }: { tone: ProjectTone; value: number }) {
  return (
    <div className="grid grid-cols-[34px_86px] items-center gap-2">
      <span className="text-right font-semibold text-slate-700 dark:text-slate-200">{value}%</span>
      <span className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <span className={cn("block h-full rounded-full", getToneBarClass(tone))} style={{ width: `${value}%` }} />
      </span>
    </div>
  );
}
