import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type CompactTone = "slate" | "blue" | "cyan" | "emerald" | "amber" | "orange" | "red" | "violet";

const toneStyles: Record<CompactTone, string> = {
  slate: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200",
  blue: "border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200",
  cyan: "border-cyan-100 bg-cyan-50 text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200",
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200",
  amber: "border-amber-100 bg-amber-50 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200",
  orange: "border-orange-100 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200",
  red: "border-red-100 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200",
  violet: "border-violet-100 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200",
};

export function CompactCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-950/[0.03] dark:border-slate-800 dark:bg-slate-900",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionPanel({
  action,
  children,
  className,
  title,
}: {
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  title: string;
}) {
  return (
    <CompactCard className={className}>
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <h2 className="text-sm font-black text-slate-950 dark:text-white">{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </CompactCard>
  );
}

export function StatusBadge({
  className,
  label,
  tone = "blue",
}: {
  className?: string;
  label: string;
  tone?: CompactTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center justify-center whitespace-nowrap rounded-full border px-2.5 text-[11px] font-extrabold",
        toneStyles[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}

export function MetricCard({
  label,
  marker,
  tone = "blue",
  value,
}: {
  label: string;
  marker?: string;
  tone?: CompactTone;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className={cn("mt-1 text-xl font-black", getToneTextClass(tone))}>{value}</p>
      {marker ? <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">{marker}</p> : null}
    </div>
  );
}

export function ProgressMiniBar({
  className,
  value,
}: {
  className?: string;
  value: number;
}) {
  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800", className)}>
      <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
    </div>
  );
}

export function BreadcrumbTrail({
  items,
}: {
  items: Array<{ href?: string; label: string }>;
}) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-xs font-extrabold text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
          {index > 0 ? <span aria-hidden="true">/</span> : null}
          {item.href ? (
            <Link href={item.href} className="transition hover:text-blue-700 dark:hover:text-blue-200">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-700 dark:text-slate-200">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({
  action,
  breadcrumb,
  description,
  icon: Icon,
  title,
}: {
  action?: ReactNode;
  breadcrumb?: ReactNode;
  description?: string;
  icon?: LucideIcon;
  title: string;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        {Icon ? (
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        ) : null}
        <div className="min-w-0">
          {breadcrumb}
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h1>
          {description ? <p className="mt-1 max-w-3xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{description}</p> : null}
        </div>
      </div>
      {action}
    </header>
  );
}

export function ToolbarButton({
  children,
  href,
  variant = "secondary",
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
}) {
  const className =
    variant === "primary"
      ? "bg-blue-700 text-white hover:bg-blue-800"
      : "border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500/30 dark:hover:text-blue-200";

  if (href) {
    return (
      <Link href={href} className={cn("inline-flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-extrabold transition", className)}>
        {variant === "secondary" ? <ArrowLeft className="h-4 w-4" aria-hidden="true" /> : null}
        {children}
        {variant === "primary" ? <ArrowUpRight className="h-4 w-4" aria-hidden="true" /> : null}
      </Link>
    );
  }

  return (
    <button type="button" className={cn("inline-flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-extrabold transition", className)}>
      {children}
    </button>
  );
}

function getToneTextClass(tone: CompactTone) {
  switch (tone) {
    case "blue":
      return "text-blue-700 dark:text-blue-300";
    case "cyan":
      return "text-cyan-700 dark:text-cyan-300";
    case "emerald":
      return "text-emerald-700 dark:text-emerald-300";
    case "amber":
      return "text-amber-700 dark:text-amber-300";
    case "orange":
      return "text-orange-700 dark:text-orange-300";
    case "red":
      return "text-red-700 dark:text-red-300";
    case "violet":
      return "text-violet-700 dark:text-violet-300";
    default:
      return "text-slate-700 dark:text-slate-200";
  }
}
