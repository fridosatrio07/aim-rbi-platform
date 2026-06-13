import { Database, Droplets, Factory, Flame, Gauge, HardDrive, Settings2, ShieldCheck, TimerReset, Waves } from "lucide-react";

import { cn } from "@/lib/utils";

import type { FacilityOverviewItem } from "../types/projects-list.types";

const overviewIcons = [Droplets, Database, Flame, Waves, HardDrive];

export function ProjectFacilityOverview({
  className,
  items,
}: {
  className?: string;
  items: FacilityOverviewItem[];
}) {
  const throughput = items.slice(0, 5);
  const details = items.slice(5);
  const detailIcons = [TimerReset, Gauge, Factory, ShieldCheck, Settings2];

  return (
    <div className={cn("min-w-0 border-l border-slate-200 pl-4 dark:border-slate-800", className)}>
      <h3 className="text-xs font-black text-blue-800 dark:text-blue-200">Facility Overview</h3>
      <div className="mt-2 space-y-2">
        {throughput.map((item, index) => {
          const Icon = overviewIcons[index] ?? Factory;

          return (
            <div key={item.id} className="flex items-start gap-2 text-xs leading-4 text-slate-700 dark:text-slate-200">
              <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-700 dark:text-blue-300" aria-hidden="true" />
              <span>
                <span className="font-black">{item.value}</span> {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 border-t border-slate-200 pt-2 dark:border-slate-800">
        <div className="grid gap-x-3 gap-y-1.5 text-xs">
          {details.map((item, index) => {
            const Icon = detailIcons[index] ?? Settings2;

            return (
              <div key={item.id} className="grid grid-cols-[96px_minmax(0,1fr)] items-start gap-2">
                <span className="flex items-center gap-1.5 font-black text-blue-800 dark:text-blue-200">
                  <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                  {item.label}:
                </span>
                <span className="min-w-0 font-medium text-slate-700 dark:text-slate-200">{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
