import { ChevronRight } from "lucide-react";

import type { ProjectSummary } from "../types/projects-list.types";
import { ProjectSummaryCard } from "./project-summary-card";

export function ProjectCardStrip({
  onSelect,
  projects,
  selectedProjectId,
}: {
  onSelect: (projectId: string) => void;
  projects: ProjectSummary[];
  selectedProjectId: string;
}) {
  return (
    <section className="grid grid-cols-[repeat(5,minmax(226px,1fr))_40px] gap-3 overflow-x-auto pb-1 aim-shell-scrollbar" aria-label="Project summaries">
      {projects.map((project) => (
        <ProjectSummaryCard
          key={project.id}
          project={project}
          selected={project.id === selectedProjectId}
          onSelect={onSelect}
        />
      ))}
      <button
        type="button"
        className="grid h-10 w-10 self-center place-items-center rounded-md border border-slate-200 bg-white text-blue-800 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-900 dark:text-blue-200 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10"
        aria-label="Show more projects"
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </section>
  );
}
