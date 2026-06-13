import { ShieldCheck } from "lucide-react";

import { DenseSection, StatusBadge } from "@/components/data-display/compact-primitives";

export function HumanReviewGateCard({ requiredRole }: { requiredRole: string }) {
  return (
    <DenseSection title="Human Review Gate" eyebrow="Governance required" action={<StatusBadge label={requiredRole} tone="violet" />}>
      <div className="flex gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
          Draft, preliminary, PLO/certification, FFS/RLA, repair, alteration, rerating, risk acceptance, and critical damage mechanism decisions remain blocked until the required human reviewer approves them.
        </p>
      </div>
    </DenseSection>
  );
}
