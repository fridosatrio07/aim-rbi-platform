import { BookOpenCheck } from "lucide-react";

import { DenseSection } from "@/components/data-display/compact-primitives";

export function CitationReferenceCard({ citations }: { citations: Array<{ label: string; detail: string }> }) {
  return (
    <DenseSection title="Citation / Reference Basis" eyebrow="Traceability">
      <div className="grid gap-2">
        {citations.map((citation) => (
          <div key={`${citation.label}-${citation.detail}`} className="flex gap-3 rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
            <BookOpenCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-blue-300" aria-hidden="true" />
            <div>
              <p className="text-sm font-black text-slate-950 dark:text-white">{citation.label}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{citation.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </DenseSection>
  );
}
