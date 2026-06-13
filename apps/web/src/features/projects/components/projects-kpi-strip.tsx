import { Activity, AlertTriangle, Database, FolderKanban, Layers3, Target } from "lucide-react";

import type { ProjectKpi } from "../types/projects-list.types";
import { ProjectKpiCard } from "./project-kpi-card";

const kpiIcons = {
  "total-projects": FolderKanban,
  "active-projects": Activity,
  "total-assets": Layers3,
  "overdue-actions": AlertTriangle,
  "average-data": Database,
  "rbi-progress": Target,
};

export function ProjectsKpiStrip({ kpis }: { kpis: ProjectKpi[] }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6" aria-label="Project portfolio KPI summary">
      {kpis.map((kpi) => {
        const Icon = kpiIcons[kpi.id as keyof typeof kpiIcons] ?? FolderKanban;

        return <ProjectKpiCard key={kpi.id} Icon={Icon} kpi={kpi} />;
      })}
    </section>
  );
}
