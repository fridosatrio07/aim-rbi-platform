"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
  ANOMALY_SEVERITY_LABELS,
  INSPECTION_STATUS_LABELS,
  RISK_LEVEL_LABELS,
} from "../services/dashboard-selectors";
import {
  DASHBOARD_DATE_PRESETS,
  DEFAULT_DASHBOARD_FILTERS,
  DEFAULT_DASHBOARD_DATE_RANGE,
  type DashboardDateRange,
  type DashboardFilterState,
  INSPECTION_STATUS_ORDER,
} from "../services/dashboard-filter-state";
import type { AssetClassSummary } from "../services/dashboard-types";

type SnapshotStatus = "idle" | "capturing" | "success" | "error";

interface DashboardRightToolsBarProps {
  assetClasses: AssetClassSummary[];
  dateRange: DashboardDateRange;
  filters: DashboardFilterState;
  open: boolean;
  snapshotMessage: string | null;
  snapshotStatus: SnapshotStatus;
  onDateRangeChange: (dateRange: DashboardDateRange) => void;
  onFiltersChange: (filters: DashboardFilterState) => void;
  onOpenChange: (open: boolean) => void;
  onExportSnapshot: () => void;
}

const RISK_OPTIONS = [
  { value: "all", label: "All risk levels" },
  ...(["high", "medium-high", "medium", "low"] as const).map((level) => ({
    value: level,
    label: RISK_LEVEL_LABELS[level],
  })),
];

const CERTIFICATE_OPTIONS = [
  { value: "all", label: "All certificate statuses" },
  { value: "expired", label: "Expired" },
  { value: "due-soon", label: "Due Soon" },
  { value: "due", label: "Due" },
];

const ANOMALY_OPTIONS = [
  { value: "all", label: "All anomaly severities" },
  ...(["critical", "high", "medium", "low"] as const).map((severity) => ({
    value: severity,
    label: ANOMALY_SEVERITY_LABELS[severity],
  })),
];

const DOCUMENT_OPTIONS = [
  { value: "all", label: "All document statuses" },
  { value: "complete", label: "Complete" },
  { value: "partial", label: "Partial / Needs Update" },
  { value: "missing", label: "Missing / Expired / Unvalidated" },
];

const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function DashboardRightToolsBar({
  assetClasses,
  dateRange,
  filters,
  open,
  snapshotMessage,
  snapshotStatus,
  onDateRangeChange,
  onFiltersChange,
  onOpenChange,
  onExportSnapshot,
}: DashboardRightToolsBarProps) {
  const [draftDateRange, setDraftDateRange] = useState(dateRange);
  const [draftFilters, setDraftFilters] = useState(filters);

  function applyPreset(presetId: DashboardDateRange["presetId"]) {
    const preset = DASHBOARD_DATE_PRESETS.find((item) => item.id === presetId);

    if (!preset) return;

    setDraftDateRange({
      presetId,
      startDate: preset.startDate,
      endDate: preset.endDate,
    });
  }

  function updateDraftFilter<Key extends keyof DashboardFilterState>(
    key: Key,
    value: DashboardFilterState[Key],
  ) {
    setDraftFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  if (!open) {
    return (
      <aside className="fixed bottom-4 right-3 top-[calc(var(--app-header-height)+12px)] z-[35] hidden w-14 flex-col items-center rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-[0_18px_45px_rgba(15,23,42,0.16)] backdrop-blur lg:flex dark:border-slate-800 dark:bg-slate-900/95">
        <RailButton icon={ChevronLeft} label="Open Dashboard tools" onClick={() => onOpenChange(true)} />
        <div className="my-2 h-px w-full bg-slate-200 dark:bg-slate-800" />
        <RailButton icon={CalendarDays} label="Open date range" onClick={() => onOpenChange(true)} />
        <RailButton icon={Filter} label="Open filters" onClick={() => onOpenChange(true)} />
        <RailButton icon={Download} label="Open export" onClick={() => onOpenChange(true)} />
      </aside>
    );
  }

  return (
    <aside className="fixed bottom-4 right-3 top-[calc(var(--app-header-height)+12px)] z-[35] hidden w-[348px] flex-col rounded-2xl border border-slate-200 bg-white/95 shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur lg:flex 2xl:w-[368px] dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-blue-700 dark:text-blue-300">
            Dashboard Tools
          </p>
          <h2 className="text-base font-black text-slate-950 dark:text-white">Controls</h2>
        </div>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Collapse Dashboard tools"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 aim-shell-scrollbar">
        <Card className="rounded-2xl">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-extrabold">
              <CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-300" aria-hidden="true" />
              Date Range
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-3 pt-0">
            <div className="grid grid-cols-2 gap-2">
              {DASHBOARD_DATE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  className={cn(
                    "rounded-xl border px-2 py-2 text-xs font-extrabold transition",
                    draftDateRange.presetId === preset.id
                      ? "border-blue-200 bg-blue-600 text-white dark:border-blue-400/40 dark:bg-blue-500"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-blue-500/30 dark:hover:text-blue-200",
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <DateInput
                label="Start"
                value={draftDateRange.startDate}
                onChange={(value) =>
                  setDraftDateRange((current) => ({ ...current, presetId: "custom", startDate: value }))
                }
              />
              <DateInput
                label="End"
                value={draftDateRange.endDate}
                onChange={(value) =>
                  setDraftDateRange((current) => ({ ...current, presetId: "custom", endDate: value }))
                }
              />
            </div>

            <MiniCalendar startDate={draftDateRange.startDate} endDate={draftDateRange.endDate} />

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraftDateRange(DEFAULT_DASHBOARD_DATE_RANGE);
                  onDateRangeChange(DEFAULT_DASHBOARD_DATE_RANGE);
                }}
                className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 text-xs font-extrabold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Reset
              </button>
              <button
                type="button"
                disabled={!draftDateRange.startDate || !draftDateRange.endDate}
                onClick={() => onDateRangeChange(draftDateRange)}
                className="inline-flex h-9 items-center justify-center rounded-xl bg-blue-600 text-xs font-extrabold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
              >
                Apply Date
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-extrabold">
              <SlidersHorizontal className="h-4 w-4 text-blue-600 dark:text-blue-300" aria-hidden="true" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-3 pt-0">
            <ToolsSelect
              label="Risk level"
              value={draftFilters.riskLevel}
              onChange={(value) => updateDraftFilter("riskLevel", value as DashboardFilterState["riskLevel"])}
              options={RISK_OPTIONS}
            />
            <ToolsSelect
              label="Asset class"
              value={draftFilters.assetClass}
              onChange={(value) => updateDraftFilter("assetClass", value)}
              options={[
                { value: "all", label: "All asset classes" },
                ...assetClasses.map((assetClass) => ({
                  value: assetClass.id,
                  label: `${assetClass.iconLabel} - ${assetClass.label}`,
                })),
              ]}
            />
            <ToolsSelect
              label="Inspection due status"
              value={draftFilters.inspectionDueStatus}
              onChange={(value) =>
                updateDraftFilter("inspectionDueStatus", value as DashboardFilterState["inspectionDueStatus"])
              }
              options={[
                { value: "all", label: "All inspection statuses" },
                ...INSPECTION_STATUS_ORDER.map((status) => ({
                  value: status,
                  label: INSPECTION_STATUS_LABELS[status],
                })),
              ]}
            />
            <ToolsSelect
              label="Certificate status"
              value={draftFilters.certificateStatus}
              onChange={(value) =>
                updateDraftFilter("certificateStatus", value as DashboardFilterState["certificateStatus"])
              }
              options={CERTIFICATE_OPTIONS}
            />
            <ToolsSelect
              label="Anomaly severity"
              value={draftFilters.anomalySeverity}
              onChange={(value) =>
                updateDraftFilter("anomalySeverity", value as DashboardFilterState["anomalySeverity"])
              }
              options={ANOMALY_OPTIONS}
            />
            <ToolsSelect
              label="Document completeness status"
              value={draftFilters.documentCompletenessStatus}
              onChange={(value) =>
                updateDraftFilter(
                  "documentCompletenessStatus",
                  value as DashboardFilterState["documentCompletenessStatus"],
                )
              }
              options={DOCUMENT_OPTIONS}
            />

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setDraftFilters(DEFAULT_DASHBOARD_FILTERS);
                  onFiltersChange(DEFAULT_DASHBOARD_FILTERS);
                }}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset
              </button>
              <button
                type="button"
                onClick={() => onFiltersChange(draftFilters)}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 text-xs font-extrabold text-white transition hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-extrabold">
              <Download className="h-4 w-4 text-blue-600 dark:text-blue-300" aria-hidden="true" />
              Export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            <button
              type="button"
              onClick={onExportSnapshot}
              disabled={snapshotStatus === "capturing"}
              className="flex w-full items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-left text-sm font-extrabold text-blue-800 transition hover:bg-blue-100 disabled:cursor-wait disabled:opacity-70 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:bg-blue-500/20"
            >
              Dashboard Snapshot
              <span className="text-xs font-black">{snapshotStatus === "capturing" ? "Capturing" : "PNG"}</span>
            </button>
            {["Evidence Pack Queue", "Reports Dataset"].map((label) => (
              <button
                key={label}
                type="button"
                disabled
                className="flex w-full cursor-not-allowed items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-bold text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500"
              >
                {label}
                <span className="text-xs font-black">Planned</span>
              </button>
            ))}
            {snapshotMessage ? (
              <p
                className={cn(
                  "rounded-xl px-3 py-2 text-xs font-bold",
                  snapshotStatus === "error"
                    ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-200"
                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200",
                )}
              >
                {snapshotMessage}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}

function RailButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-blue-500/10 dark:hover:text-blue-200"
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function ToolsSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full rounded-xl border border-slate-200 bg-white px-2 text-xs font-bold text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
      />
    </label>
  );
}

function MiniCalendar({ startDate, endDate }: { startDate: string; endDate: string }) {
  const calendarDays = useMemo(() => getCalendarDays(2026, 5), []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-xs font-black text-slate-800 dark:text-slate-100">June 2026</span>
        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Calendar
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_LABELS.map((label, index) => (
          <span key={`${label}-${index}`} className="text-[10px] font-black text-slate-400">
            {label}
          </span>
        ))}
        {calendarDays.map((day) => {
          const inRange = Boolean(
            day.isoDate &&
              startDate &&
              endDate &&
              day.isoDate >= startDate &&
              day.isoDate <= endDate,
          );

          return (
            <span
              key={day.key}
              className={cn(
                "grid h-7 place-items-center rounded-lg text-[11px] font-black",
                !day.date && "text-transparent",
                day.date && !inRange && "bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-300",
                day.date && inRange && "bg-blue-600 text-white",
              )}
            >
              {day.date ?? 0}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function getCalendarDays(year: number, monthIndex: number) {
  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const cells = [];

  for (let index = 0; index < mondayOffset; index += 1) {
    cells.push({ key: `blank-${index}`, date: null, isoDate: null });
  }

  for (let date = 1; date <= daysInMonth; date += 1) {
    cells.push({
      key: `day-${date}`,
      date,
      isoDate: `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ key: `blank-${cells.length}`, date: null, isoDate: null });
  }

  return cells;
}
