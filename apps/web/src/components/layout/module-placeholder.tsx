import Link from "next/link";
import { ArrowRight, Construction, Layers3 } from "lucide-react";
import { cn } from "@/lib/utils";

type ModulePlaceholderProps = {
  title: string;
  parentLabel?: string;
  route?: string;
  description?: string;
};

export function ModulePlaceholder({
  title,
  parentLabel,
  route,
  description = "This module is prepared for future development.",
}: ModulePlaceholderProps) {
  return (
    <section className="px-5 py-5 sm:px-6 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="aim-card-shadow rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-200">
              <Layers3 className="h-7 w-7" />
            </div>

            <div className="min-w-0">
              {parentLabel ? (
                <div className="mb-1 text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                  {parentLabel}
                </div>
              ) : null}
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
                {title}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-400">
                {description}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                <Construction className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-950 dark:text-slate-100">
                  Module workspace
                </div>
                <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-400">
                  Future screens, workflows, approval states, registers, analytics, and report views will be added here while preserving the same authenticated application shell.
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="aim-card-shadow rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-100">
            Navigation Status
          </h2>

          <dl className="mt-5 divide-y divide-slate-200 text-base dark:divide-slate-800">
            {route ? (
              <div className="grid grid-cols-[72px_1fr] gap-4 py-3">
                <dt className="text-slate-500 dark:text-slate-400">Route</dt>
                <dd className="truncate font-semibold text-slate-950 dark:text-slate-100">
                  {route}
                </dd>
              </div>
            ) : null}

            <div className="grid grid-cols-[72px_1fr] gap-4 py-3">
              <dt className="text-slate-500 dark:text-slate-400">Status</dt>
              <dd>
                <span className="inline-flex rounded-lg bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-200">
                  Prepared
                </span>
              </dd>
            </div>

            <div className="grid grid-cols-[72px_1fr] gap-4 py-3">
              <dt className="text-slate-500 dark:text-slate-400">Data Source</dt>
              <dd className="font-semibold text-slate-950 dark:text-slate-100">
                Prototype
              </dd>
            </div>
          </dl>

          <Link
            href="/dashboard"
            className={cn(
              "mt-5 inline-flex items-center gap-2 text-base font-semibold text-blue-700 transition-colors hover:text-blue-800",
              "dark:text-blue-300 dark:hover:text-blue-200",
            )}
          >
            Back to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>
    </section>
  );
}