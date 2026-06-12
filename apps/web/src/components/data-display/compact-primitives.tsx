import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  Inbox,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type CompactTone =
  | "slate"
  | "blue"
  | "cyan"
  | "emerald"
  | "amber"
  | "orange"
  | "red"
  | "violet";

export type CompactDensity = "default" | "tight";

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

const toneIconStyles: Record<CompactTone, string> = {
  slate: "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
  blue: "border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200",
  cyan: "border-cyan-100 bg-cyan-50 text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200",
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200",
  amber: "border-amber-100 bg-amber-50 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200",
  orange: "border-orange-100 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200",
  red: "border-red-100 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200",
  violet: "border-violet-100 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200",
};

const toneGradientStyles: Record<CompactTone, string> = {
  slate: "from-slate-600 to-slate-400",
  blue: "from-blue-700 to-cyan-500",
  cyan: "from-cyan-600 to-blue-500",
  emerald: "from-emerald-600 to-cyan-500",
  amber: "from-amber-500 to-orange-500",
  orange: "from-orange-600 to-amber-400",
  red: "from-red-600 to-orange-500",
  violet: "from-violet-600 to-blue-500",
};

const riskToneMap = {
  critical: "red",
  high: "orange",
  "medium-high": "orange",
  medium: "amber",
  low: "emerald",
  informational: "blue",
} as const satisfies Record<string, CompactTone>;

const phaseToneMap = {
  planned: "slate",
  "in-design": "cyan",
  "in-development": "blue",
  review: "violet",
  approved: "emerald",
  blocked: "red",
  archived: "slate",
} as const satisfies Record<string, CompactTone>;

export function CompactPageShell({
  children,
  className,
  maxWidth = "max-w-[1760px]",
  viewport = false,
}: {
  children: ReactNode;
  className?: string;
  maxWidth?: string;
  viewport?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full min-w-0 text-slate-950 dark:text-slate-100",
        maxWidth,
        viewport ? "flex min-h-[calc(100vh-var(--app-header-height)-5.25rem)] flex-col overflow-hidden" : "space-y-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DenseCard({
  children,
  className,
  interactive = false,
  ...props
}: HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  interactive?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-950/[0.03] dark:border-slate-800 dark:bg-slate-900",
        interactive && "transition hover:border-blue-200 hover:shadow-md hover:shadow-blue-950/5 dark:hover:border-blue-500/30",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function CompactCard({ children, className }: { children: ReactNode; className?: string }) {
  return <DenseCard className={className}>{children}</DenseCard>;
}

export function DenseSection({
  action,
  children,
  className,
  contentClassName,
  density = "default",
  eyebrow,
  title,
}: {
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  density?: CompactDensity;
  eyebrow?: string;
  title: string;
}) {
  return (
    <DenseCard className={className}>
      <div
        className={cn(
          "flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800",
          density === "tight" ? "px-3 py-2.5" : "px-4 py-3",
        )}
      >
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-blue-700 dark:text-blue-300">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="truncate text-sm font-black text-slate-950 dark:text-white">{title}</h2>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className={cn(density === "tight" ? "p-3" : "p-4", contentClassName)}>{children}</div>
    </DenseCard>
  );
}

export function SectionPanel(props: {
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  title: string;
}) {
  return <DenseSection {...props} />;
}

export function StatusBadge({
  className,
  label,
  tone = "blue",
  withDot = false,
}: {
  className?: string;
  label: string;
  tone?: CompactTone;
  withDot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-[11px] font-extrabold",
        toneStyles[tone],
        className,
      )}
    >
      {withDot ? <span className={cn("h-1.5 w-1.5 rounded-full", getToneDotClass(tone))} aria-hidden="true" /> : null}
      {label}
    </span>
  );
}

export function RiskBadge({
  level,
  label,
  className,
}: {
  level: keyof typeof riskToneMap;
  label?: string;
  className?: string;
}) {
  return <StatusBadge className={className} label={label ?? formatBadgeLabel(level)} tone={riskToneMap[level]} withDot />;
}

export function PhaseBadge({
  phase,
  label,
  className,
}: {
  phase: keyof typeof phaseToneMap;
  label?: string;
  className?: string;
}) {
  return <StatusBadge className={className} label={label ?? formatBadgeLabel(phase)} tone={phaseToneMap[phase]} />;
}

export function CompactKpiStrip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7", className)}>{children}</div>;
}

export function CompactKpiCard({
  className,
  delta,
  deltaTone = "slate",
  icon: Icon,
  label,
  tone = "blue",
  value,
}: {
  className?: string;
  delta?: ReactNode;
  deltaTone?: CompactTone;
  icon?: LucideIcon;
  label: string;
  tone?: CompactTone;
  value: ReactNode;
}) {
  return (
    <DenseCard className={cn("min-h-[84px] overflow-hidden p-3", className)}>
      <div className="flex h-full min-w-0 items-center gap-3">
        {Icon ? (
          <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-2xl border", toneIconStyles[tone])}>
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </div>
        ) : null}
        <div className="min-w-0">
          <p className="truncate text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className={cn("mt-1 truncate text-2xl font-black tracking-tight", getToneTextClass(tone))}>{value}</p>
          {delta ? <p className={cn("mt-1 truncate text-xs font-bold", getToneTextClass(deltaTone))}>{delta}</p> : null}
        </div>
      </div>
    </DenseCard>
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
  return <MetricTile label={label} marker={marker} tone={tone} value={value} />;
}

export function MetricTile({
  className,
  label,
  marker,
  tone = "blue",
  value,
}: {
  className?: string;
  label: string;
  marker?: ReactNode;
  tone?: CompactTone;
  value: ReactNode;
}) {
  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900", className)}>
      <p className="truncate text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className={cn("mt-1 truncate text-xl font-black", getToneTextClass(tone))}>{value}</p>
      {marker ? <p className="mt-1 truncate text-xs font-bold text-slate-500 dark:text-slate-400">{marker}</p> : null}
    </div>
  );
}

export function ProgressMiniBar({
  className,
  tone = "blue",
  value,
}: {
  className?: string;
  tone?: CompactTone;
  value: number;
}) {
  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800", className)}>
      <div
        className={cn("h-full rounded-full bg-gradient-to-r", toneGradientStyles[tone])}
        style={{ width: `${clampPercent(value)}%` }}
      />
    </div>
  );
}

export function ProgressCell({
  className,
  label,
  tone = "blue",
  value,
}: {
  className?: string;
  label?: string;
  tone?: CompactTone;
  value: number;
}) {
  return (
    <div className={cn("min-w-[120px]", className)}>
      <div className="mb-1 flex items-center justify-between gap-2 text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
        <span className="truncate">{label ?? "Progress"}</span>
        <span className={getToneTextClass(tone)}>{clampPercent(value)}%</span>
      </div>
      <ProgressMiniBar tone={tone} value={value} />
    </div>
  );
}

export function MiniTrend({
  className,
  points,
  tone = "blue",
}: {
  className?: string;
  points: number[];
  tone?: CompactTone;
}) {
  const path = getSparklinePath(points);

  return (
    <svg className={cn("h-8 w-24", getToneTextClass(tone), className)} viewBox="0 0 96 32" aria-hidden="true">
      <path d="M0 28H96" fill="none" stroke="currentColor" strokeOpacity="0.16" strokeWidth="2" />
      {path ? <path d={path} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /> : null}
    </svg>
  );
}

export function BreadcrumbTrail({
  items,
}: {
  items: Array<{ href?: string; label: string }>;
}) {
  return (
    <nav
      className="flex flex-wrap items-center gap-2 text-xs font-extrabold text-slate-500 dark:text-slate-400"
      aria-label="Breadcrumb"
    >
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

export function CompactPageHeader({
  action,
  breadcrumb,
  className,
  description,
  eyebrow,
  icon: Icon,
  meta,
  title,
}: {
  action?: ReactNode;
  breadcrumb?: ReactNode;
  className?: string;
  description?: string;
  eyebrow?: string;
  icon?: LucideIcon;
  meta?: ReactNode;
  title: string;
}) {
  return (
    <header className={cn("flex flex-wrap items-start justify-between gap-3", className)}>
      <div className="flex min-w-0 items-start gap-3">
        {Icon ? (
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        ) : null}
        <div className="min-w-0">
          {breadcrumb}
          {eyebrow ? (
            <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-blue-700 dark:text-blue-300">
              {eyebrow}
            </p>
          ) : null}
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h1>
            {meta}
          </div>
          {description ? (
            <p className="mt-1 max-w-3xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function PageHeader(props: {
  action?: ReactNode;
  breadcrumb?: ReactNode;
  description?: string;
  icon?: LucideIcon;
  title: string;
}) {
  return <CompactPageHeader {...props} />;
}

export function ToolbarButton({
  children,
  className,
  href,
  variant = "secondary",
  ...buttonProps
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const buttonClassName = cn(
    "inline-flex h-9 items-center justify-center gap-2 rounded-xl px-3 text-sm font-extrabold transition",
    variant === "primary" &&
      "bg-blue-700 text-white shadow-sm shadow-blue-950/10 hover:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-400",
    variant === "secondary" &&
      "border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500/30 dark:hover:text-blue-200",
    variant === "ghost" &&
      "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={buttonClassName}>
        {variant === "secondary" ? <ArrowLeft className="h-4 w-4" aria-hidden="true" /> : null}
        {children}
        {variant === "primary" ? <ArrowUpRight className="h-4 w-4" aria-hidden="true" /> : null}
      </Link>
    );
  }

  return (
    <button type="button" className={buttonClassName} {...buttonProps}>
      {children}
    </button>
  );
}

export function FilterToolbar({
  actions,
  children,
  className,
  title = "Filters",
}: {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm shadow-slate-950/[0.03] lg:flex-row lg:items-end lg:justify-between dark:border-slate-800 dark:bg-slate-900",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-end gap-2">
        <div className="flex h-9 shrink-0 items-center gap-2 rounded-xl bg-slate-50 px-3 text-xs font-extrabold text-slate-500 dark:bg-slate-950 dark:text-slate-400">
          <SlidersHorizontal className="h-3.5 w-3.5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
          {title}
        </div>
        {children}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function FilterSelect({
  className,
  label,
  options,
  onChange,
  onValueChange,
  ...props
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label: string;
  options: Array<{ count?: number; label: string; value: string }>;
  onValueChange?: (value: string) => void;
}) {
  return (
    <label className={cn("block min-w-[168px]", className)}>
      <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <select
        className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        onChange={(event) => {
          onChange?.(event);
          onValueChange?.(event.target.value);
        }}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.count === undefined ? option.label : `${option.label} (${option.count})`}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SearchInput({
  className,
  inputClassName,
  label = "Search",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  inputClassName?: string;
  label?: string;
}) {
  return (
    <label className={cn("block min-w-[220px]", className)}>
      <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          className={cn(
            "h-9 w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 text-xs font-bold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200",
            inputClassName,
          )}
          type="search"
          {...props}
        />
      </span>
    </label>
  );
}

export function DenseTable({
  children,
  className,
  containerClassName,
  maxHeight = "min(520px,calc(100vh-22rem))",
  ...props
}: TableHTMLAttributes<HTMLTableElement> & {
  containerClassName?: string;
  maxHeight?: string;
}) {
  return (
    <div
      className={cn(
        "aim-compact-table overflow-auto rounded-2xl border border-slate-200 bg-white aim-shell-scrollbar dark:border-slate-800 dark:bg-slate-900",
        containerClassName,
      )}
      style={{ maxHeight }}
    >
      <table className={cn("w-full min-w-[760px] border-separate border-spacing-0 text-left", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function DenseTableHeader({ children, className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn("sticky top-0 z-10 bg-slate-50 text-[11px] uppercase tracking-[0.08em] text-slate-500 dark:bg-slate-950 dark:text-slate-400", className)} {...props}>
      {children}
    </thead>
  );
}

export function DenseTableRow({
  children,
  className,
  interactive = false,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & {
  interactive?: boolean;
}) {
  return (
    <tr
      className={cn(
        "aim-compact-row border-b border-slate-200 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200",
        interactive && "cursor-pointer transition hover:bg-blue-50/60 dark:hover:bg-blue-500/10",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function DenseTableHeadCell({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("border-b border-slate-200 px-3 py-2 font-extrabold dark:border-slate-800", className)} {...props} />;
}

export function DenseTableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("border-b border-slate-100 px-3 py-2 align-middle dark:border-slate-800/80", className)} {...props} />;
}

export function SplitPanel({
  aside,
  children,
  className,
  asideClassName,
  mainClassName,
}: {
  aside: ReactNode;
  children: ReactNode;
  className?: string;
  asideClassName?: string;
  mainClassName?: string;
}) {
  return (
    <div className={cn("grid min-h-0 gap-3 xl:grid-cols-[minmax(0,1fr)_360px]", className)}>
      <div className={cn("min-w-0", mainClassName)}>{children}</div>
      <aside className={cn("min-w-0", asideClassName)}>{aside}</aside>
    </div>
  );
}

export function CompactDrawer({
  actions,
  children,
  className,
  description,
  onClose,
  open,
  title,
}: {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  description?: string;
  onClose: () => void;
  open: boolean;
  title: string;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 top-[var(--app-header-height)] z-40 flex justify-end bg-slate-950/35 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compact-drawer-title"
    >
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close detail drawer" />
      <aside
        className={cn(
          "relative flex h-full w-full max-w-[480px] flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="min-w-0">
            <h2 id="compact-drawer-title" className="text-xl font-black text-slate-950 dark:text-white">
              {title}
            </h2>
            {description ? <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
            aria-label="Close details"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 aim-shell-scrollbar">{children}</div>
        {actions ? <div className="border-t border-slate-200 p-4 dark:border-slate-800">{actions}</div> : null}
      </aside>
    </div>
  );
}

export const DetailDrawer = CompactDrawer;

export function RightToolsRail({
  children,
  className,
  icon: Icon = SlidersHorizontal,
  label = "Tools",
  onOpenChange,
  open,
  title = "Controls",
}: {
  children: ReactNode;
  className?: string;
  icon?: LucideIcon;
  label?: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title?: string;
}) {
  if (!open) {
    return (
      <aside className="fixed bottom-4 right-3 top-[calc(var(--app-header-height)+12px)] z-[35] hidden w-14 flex-col items-center rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-[0_18px_45px_rgba(15,23,42,0.16)] backdrop-blur lg:flex dark:border-slate-800 dark:bg-slate-900/95">
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-blue-500/10 dark:hover:text-blue-200"
          aria-label={`Open ${label}`}
          title={`Open ${label}`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </button>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "fixed bottom-4 right-3 top-[calc(var(--app-header-height)+12px)] z-[35] hidden w-[348px] flex-col rounded-2xl border border-slate-200 bg-white/95 shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur lg:flex 2xl:w-[368px] dark:border-slate-800 dark:bg-slate-900/95",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-blue-700 dark:text-blue-300">{label}</p>
          <h2 className="text-base font-black text-slate-950 dark:text-white">{title}</h2>
        </div>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label={`Collapse ${label}`}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3 aim-shell-scrollbar">{children}</div>
    </aside>
  );
}

export function EmptyStateCompact({
  action,
  className,
  description,
  icon: Icon = Inbox,
  title,
}: {
  action?: ReactNode;
  className?: string;
  description: string;
  icon?: LucideIcon;
  title: string;
}) {
  return (
    <div
      className={cn(
        "grid min-h-[180px] place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center dark:border-slate-700 dark:bg-slate-900/50",
        className,
      )}
    >
      <div className="max-w-sm">
        <div className="mx-auto grid h-10 w-10 place-items-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="mt-3 text-sm font-black text-slate-950 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">{description}</p>
        {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}

export function NavigationStatusCardCompact({
  className,
  currentRoute,
  dataSource,
  parentCta,
  readiness = 32,
  status,
}: {
  className?: string;
  currentRoute: string;
  dataSource: string;
  parentCta?: ReactNode;
  readiness?: number;
  status: string;
}) {
  return (
    <DenseCard className={cn("p-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-black text-slate-950 dark:text-white">Navigation Status</h2>
        <StatusBadge label={status} tone={status === "Prepared" ? "blue" : "cyan"} />
      </div>

      <div className="mt-3 space-y-3 text-sm">
        <StatusRow label="Route">
          <code className="max-w-[190px] truncate rounded-lg bg-slate-100 px-2 py-1 text-xs font-extrabold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            {currentRoute}
          </code>
        </StatusRow>
        <StatusRow label="Data Source">
          <span className="text-right text-xs font-extrabold text-slate-700 dark:text-slate-200">{dataSource}</span>
        </StatusRow>
        <StatusRow label="Readiness">
          <span className="font-extrabold text-blue-700 dark:text-blue-300">{clampPercent(readiness)}%</span>
        </StatusRow>
        <ProgressMiniBar value={readiness} />
      </div>

      {parentCta ? <div className="mt-4">{parentCta}</div> : null}
    </DenseCard>
  );
}

function StatusRow({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-3 first:border-t-0 first:pt-0 dark:border-slate-800">
      <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
      {children}
    </div>
  );
}

function clampPercent(value: number) {
  return Math.min(Math.max(Math.round(value), 0), 100);
}

function formatBadgeLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getSparklinePath(points: number[]) {
  if (points.length < 2) return "";

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const xStep = 96 / (points.length - 1);

  return points
    .map((point, index) => {
      const x = index * xStep;
      const y = 28 - ((point - min) / range) * 24;

      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
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

function getToneDotClass(tone: CompactTone) {
  switch (tone) {
    case "blue":
      return "bg-blue-500";
    case "cyan":
      return "bg-cyan-500";
    case "emerald":
      return "bg-emerald-500";
    case "amber":
      return "bg-amber-400";
    case "orange":
      return "bg-orange-500";
    case "red":
      return "bg-red-500";
    case "violet":
      return "bg-violet-500";
    default:
      return "bg-slate-500";
  }
}
