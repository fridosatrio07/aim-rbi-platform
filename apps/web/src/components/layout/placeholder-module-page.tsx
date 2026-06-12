"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Construction, Layers3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlaceholderModulePageProps {
  title: string;
  description?: string;
  parentLabel?: string;
  route?: string;
  [key: string]: unknown;
}

const DEFAULT_DESCRIPTION = "This module is prepared for future development.";

export function PlaceholderModulePage({
  title,
  description = DEFAULT_DESCRIPTION,
  parentLabel,
  route,
}: PlaceholderModulePageProps) {
  const pathname = usePathname();
  const currentRoute = route ?? pathname ?? "/";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
              <Layers3 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              {parentLabel ? (
                <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-blue-700">
                  {parentLabel}
                </p>
              ) : null}
              <CardTitle className="text-2xl">{title}</CardTitle>
              <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-slate-700 shadow-sm">
                <Construction className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Module workspace</h2>
                <p className="mt-2 leading-7 text-slate-600">
                  Future screens, workflows, approval states, registers, and report views will be
                  added here while preserving the same authenticated application shell.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Navigation Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 text-base">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-600">Route</span>
            <code className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-800">
              {currentRoute}
            </code>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-5">
            <span className="text-slate-600">Status</span>
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">
              Prepared
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-5">
            <span className="text-slate-600">Data Source</span>
            <span className="font-semibold text-slate-950">Prototype</span>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-800"
          >
            Dashboard
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}