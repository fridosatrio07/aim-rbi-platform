import Link from "next/link";
import { ArrowRight, Construction, Layers3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlaceholderModulePageProps {
  title: string;
  parentLabel?: string;
  route?: string;
}

export function PlaceholderModulePage({ title, parentLabel, route }: PlaceholderModulePageProps) {
  return (
    <div className="grid min-w-0 gap-3 lg:grid-cols-12">
      <Card className="lg:col-span-8">
        <CardHeader className="pb-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
              <Layers3 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              {parentLabel ? (
                <p className="mb-1 text-xs font-semibold uppercase text-blue-700 dark:text-blue-300">{parentLabel}</p>
              ) : null}
              <CardTitle className="text-xl">{title}</CardTitle>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                This module is prepared for future development.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/45">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                <Construction className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">Module workspace</p>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Future screens, workflows, approval states, registers, and report views will be added here while preserving the same authenticated application shell.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Navigation Status</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3 text-sm">
            {route ? (
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                <dt className="text-slate-500 dark:text-slate-400">Route</dt>
                <dd className="min-w-0 truncate font-semibold text-slate-950 dark:text-slate-100">{route}</dd>
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">Status</dt>
              <dd className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-200">
                Prepared
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500 dark:text-slate-400">Data Source</dt>
              <dd className="font-semibold text-slate-950 dark:text-slate-100">Prototype</dd>
            </div>
          </dl>
          <Link
            href="/risk-based-inspection/rbi-information"
            prefetch={false}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
          >
            Back to RBI Information
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
