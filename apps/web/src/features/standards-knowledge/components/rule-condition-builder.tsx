import { DenseSection, StatusBadge } from "@/components/data-display/compact-primitives";

import { AutomationAuthorityBadge, RuleStatusBadge } from "./status-badges";
import type { RuleView } from "../types/standards-knowledge.types";

export function RuleConditionBuilder({ rule }: { rule: RuleView }) {
  return (
    <DenseSection title="Rule Conditions" eyebrow={rule.standardCode} action={<RuleStatusBadge status={rule.status} />}>
      <div className="flex flex-wrap gap-2">
        {rule.conditions.map((condition) => (
          <StatusBadge key={condition} label={condition} tone="blue" />
        ))}
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Automation Authority</p>
          <div className="mt-2"><AutomationAuthorityBadge authorityLevel={rule.authorityLevel} /></div>
        </div>
        <div className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Conflict Policy</p>
          <p className="mt-2 text-sm font-black text-slate-950 dark:text-white">{rule.conflictPolicy}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Output Guard</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600 dark:text-slate-300">{rule.outputGuard}</p>
        </div>
      </div>
    </DenseSection>
  );
}
