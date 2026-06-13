import { History } from "lucide-react";

import { DenseSection } from "@/components/data-display/compact-primitives";

import type { AuditEventView } from "../types/standards-knowledge.types";

export function AuditTrailPanel({ events }: { events: AuditEventView[] }) {
  return (
    <DenseSection title="Audit Trail" eyebrow="Traceability">
      <div className="space-y-2">
        {events.map((event) => (
          <div key={event.id} className="flex gap-3 rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
            <History className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-blue-300" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm font-black text-slate-950 dark:text-white">{event.action} - {event.entity}</p>
              <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">{event.actor} / {event.timestamp}</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{event.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </DenseSection>
  );
}
