import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown, Download, Filter, List, Search, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ProjectFilterState } from "../types/projects-list.types";

interface ProjectsFilterToolbarProps {
  filters: ProjectFilterState;
  options: {
    clients: string[];
    phases: string[];
    riskProfiles: string[];
    sites: string[];
    statuses: string[];
  };
  onFilterChange: (key: keyof ProjectFilterState, value: string) => void;
  onReset: () => void;
}

type ViewMode = "Compact Register" | "Portfolio Strip" | "Delivery Focus";

export function ProjectsFilterToolbar({ filters, onFilterChange, onReset, options }: ProjectsFilterToolbarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("Compact Register");

  function setFilterPreset(nextFilters: Partial<ProjectFilterState>) {
    Object.entries(nextFilters).forEach(([key, value]) => {
      onFilterChange(key as keyof ProjectFilterState, value);
    });
    setFiltersOpen(false);
  }

  return (
    <div className="relative">
      <div className="grid gap-2 lg:grid-cols-[repeat(5,minmax(132px,1fr))_minmax(220px,1.4fr)_auto] lg:items-end">
        <FilterSelectField
          label="Client"
          value={filters.client}
          options={options.clients}
          onChange={(value) => onFilterChange("client", value)}
        />
        <FilterSelectField
          label="Site"
          value={filters.site}
          options={options.sites}
          onChange={(value) => onFilterChange("site", value)}
        />
        <FilterSelectField
          label="Phase"
          value={filters.phase}
          options={options.phases}
          onChange={(value) => onFilterChange("phase", value)}
        />
        <FilterSelectField
          label="Risk Profile"
          value={filters.riskProfile}
          options={options.riskProfiles}
          onChange={(value) => onFilterChange("riskProfile", value)}
        />
        <FilterSelectField
          label="Project Status"
          value={filters.status}
          options={options.statuses}
          onChange={(value) => onFilterChange("status", value)}
        />

        <label className="block min-w-0">
          <span className="sr-only">Search</span>
          <span className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              type="search"
              placeholder="Search projects..."
              value={filters.search}
              onChange={(event) => onFilterChange("search", event.target.value)}
            />
          </span>
        </label>

        <div className="flex items-center justify-end gap-2">
          <ToolbarMenuButton active={filtersOpen} onClick={() => setFiltersOpen((current) => !current)}>
            <Filter className="h-4 w-4" aria-hidden="true" />
            Filters
          </ToolbarMenuButton>
          <ToolbarMenuButton active={viewOpen} onClick={() => setViewOpen((current) => !current)}>
            <List className="h-4 w-4 text-blue-700 dark:text-blue-300" aria-hidden="true" />
            View
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          </ToolbarMenuButton>
          <div className="inline-flex">
            <ToolbarMenuButton active={exportOpen} className="rounded-r-none" onClick={() => setExportOpen((current) => !current)}>
              <Download className="h-4 w-4" aria-hidden="true" />
              Export
            </ToolbarMenuButton>
            <button
              type="button"
              onClick={() => setExportOpen((current) => !current)}
              className="grid h-9 w-9 place-items-center rounded-r-md border border-l-0 border-slate-200 bg-white text-slate-600 transition hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-blue-200"
              aria-label="Open export menu"
            >
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {filtersOpen ? (
        <MenuPanel className="right-[230px]">
          <MenuButton onClick={() => setFilterPreset({ status: "Active" })}>Active projects</MenuButton>
          <MenuButton onClick={() => setFilterPreset({ riskProfile: "High" })}>High risk profile</MenuButton>
          <MenuButton onClick={onReset}>Reset filters</MenuButton>
        </MenuPanel>
      ) : null}

      {viewOpen ? (
        <MenuPanel className="right-[104px]">
          {(["Compact Register", "Portfolio Strip", "Delivery Focus"] as ViewMode[]).map((mode) => (
            <MenuButton
              key={mode}
              selected={viewMode === mode}
              onClick={() => {
                setViewMode(mode);
                setViewOpen(false);
              }}
            >
              {mode}
            </MenuButton>
          ))}
        </MenuPanel>
      ) : null}

      {exportOpen ? (
        <MenuPanel className="right-0 w-56">
          <MenuButton>Project register (.xlsx)</MenuButton>
          <MenuButton>Portfolio summary (.pdf)</MenuButton>
          <MenuButton>Selected project snapshot</MenuButton>
        </MenuPanel>
      ) : null}

      <span className="sr-only">Current view mode: {viewMode}</span>
    </div>
  );
}

function FilterSelectField({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-[11px] font-medium text-slate-600 dark:text-slate-300">{label}</span>
      <select
        className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToolbarMenuButton({
  active,
  children,
  className,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  className?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm shadow-slate-950/[0.02] transition hover:border-blue-200 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500/30 dark:hover:text-blue-200",
        active && "border-blue-300 text-blue-700 ring-2 ring-blue-500/10 dark:border-blue-500/50 dark:text-blue-200",
        className,
      )}
    >
      {children}
    </button>
  );
}

function MenuPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "absolute top-[calc(100%+8px)] z-30 w-48 rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950",
        className,
      )}
    >
      {children}
    </div>
  );
}

function MenuButton({
  children,
  onClick,
  selected,
}: {
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-blue-500/10 dark:hover:text-blue-200",
        selected && "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-200",
      )}
    >
      {selected ? <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
