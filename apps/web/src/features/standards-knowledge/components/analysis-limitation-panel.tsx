import { AlertTriangle } from "lucide-react";

import { DenseSection, StatusBadge } from "@/components/data-display/compact-primitives";

export function AnalysisLimitationPanel({ limitation, warnings }: { limitation: string; warnings: string[] }) {
  return (
    <DenseSection title="Limitations & Warnings" eyebrow="Decision-support boundary" action={<StatusBadge label="No final authority" tone="red" />}>
      <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p className="text-sm font-bold leading-6">{limitation}</p>
      </div>
      {warnings.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {warnings.map((warning) => (
            <li key={warning} className="rounded-xl bg-orange-50 px-3 py-2 text-sm font-bold text-orange-800 dark:bg-orange-500/10 dark:text-orange-100">
              {warning}
            </li>
          ))}
        </ul>
      ) : null}
    </DenseSection>
  );
}
