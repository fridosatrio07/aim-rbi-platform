import { CheckCircle2, Clock, Loader2, TriangleAlert } from "lucide-react";

import { DenseSection } from "@/components/data-display/compact-primitives";
import { cn } from "@/lib/utils";

import type { ParsingStep } from "../types/standards-knowledge.types";

const icons = {
  completed: CheckCircle2,
  running: Loader2,
  queued: Clock,
  warning: TriangleAlert,
};

export function ParsingJobTimeline({ steps }: { steps: ParsingStep[] }) {
  return (
    <DenseSection title="Parsing & Extraction Timeline" eyebrow="Job status">
      <div className="grid gap-2">
        {steps.map((step) => {
          const Icon = icons[step.status];
          return (
            <div key={step.id} className="flex gap-3 rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
              <div
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-xl border",
                  step.status === "completed" && "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
                  step.status === "warning" && "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-200",
                  step.status === "queued" && "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
                  step.status === "running" && "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-950 dark:text-white">{step.label}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{step.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </DenseSection>
  );
}
