"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import {
  DEFAULT_OPEN_NAVIGATION_KEYS,
  isNavigationHrefActive,
  NAVIGATION_ITEMS,
  type NavigationItem
} from "@/lib/navigation-data";
import { toStaticAssetHref } from "@/lib/static-navigation";
import { cn } from "@/lib/utils";

type AppTheme = "light" | "dark";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  theme: AppTheme;
  onCollapsedChange: (collapsed: boolean) => void;
  onMobileOpenChange: (open: boolean) => void;
}

interface SidebarContentProps {
  collapsed: boolean;
  theme: AppTheme;
  isMobile?: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onNavigate?: () => void;
}

function SucofindoLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg bg-white/95 shadow-sm ring-1 ring-white/70",
        compact ? "h-11 w-12 p-1.5" : "h-14 w-20 p-2"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={toStaticAssetHref("/images/logo-sucofindo.png")}
        alt="SUCOFINDO"
        width={compact ? 48 : 92}
        height={compact ? 34 : 64}
        className="h-full w-full object-contain"
      />
    </div>
  );
}

function isItemActive(pathname: string, item: NavigationItem) {
  return (
    isNavigationHrefActive(pathname, item.href) ||
    Boolean(item.children?.some((child) => isNavigationHrefActive(pathname, child.href)))
  );
}

function SidebarContent({
  collapsed,
  theme,
  isMobile = false,
  onCollapsedChange,
  onNavigate
}: SidebarContentProps) {
  const pathname = usePathname();
  const [openMenuKeys, setOpenMenuKeys] = useState<string[]>(DEFAULT_OPEN_NAVIGATION_KEYS);
  const effectiveCollapsed = collapsed && !isMobile;
  const isDark = theme === "dark";
  const activeParentKeys = useMemo(
    () =>
      NAVIGATION_ITEMS.filter((item) =>
        item.children?.some((child) => isNavigationHrefActive(pathname, child.href)),
      ).map((item) => item.key),
    [pathname],
  );

  const visibleOpenMenuKeys = useMemo(
    () => Array.from(new Set([...openMenuKeys, ...activeParentKeys])),
    [openMenuKeys, activeParentKeys],
  );

  function toggleMenu(item: NavigationItem) {
    if (effectiveCollapsed) {
      onCollapsedChange(false);
      setOpenMenuKeys((current) => Array.from(new Set([...current, item.key])));
      return;
    }

    setOpenMenuKeys((current) =>
      current.includes(item.key) ? current.filter((key) => key !== item.key) : [...current, item.key]
    );
  }

  return (
    <div className={cn("flex min-h-0 w-full flex-col transition-colors duration-300", isDark ? "bg-slate-950 text-slate-200" : "bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-200")}>
      <div
        className={cn(
          "relative h-[var(--app-header-height)] shrink-0 overflow-visible bg-gradient-to-br",
          isDark
            ? "from-slate-950 via-slate-900 to-blue-950"
            : "from-blue-900 via-blue-800 to-blue-600 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950"
        )}
      >
        <div className={cn("flex h-full items-center", effectiveCollapsed ? "justify-center px-3" : "gap-3 px-4")}>
          {!effectiveCollapsed ? (
            <>
              <div className="flex shrink-0 flex-col items-center gap-1">
                <SucofindoLogo />
                <p className="max-w-[112px] text-center text-[9px] font-semibold leading-3 text-blue-50/90">
                  Assuring Quality, Protecting Trust
                </p>
              </div>
              <div className="h-14 w-px shrink-0 bg-white/35" aria-hidden="true" />
              <div className="min-w-0 text-white">
                <p className="truncate text-[13px] font-bold leading-5">ASSET INTEGRITY</p>
                <p className="truncate text-[13px] font-bold leading-5">MANAGEMENT</p>
              </div>
            </>
          ) : (
            <SucofindoLogo compact />
          )}
        </div>

        <button
          type="button"
          className={cn(
            "absolute z-20 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-900 shadow-[0_8px_24px_rgba(15,23,42,0.18)] transition-colors hover:bg-blue-50",
            isDark && "border-slate-700 bg-slate-900 text-blue-200 hover:bg-slate-800",
            isMobile ? "right-3 top-4" : "-right-5 top-[calc((var(--app-header-height)-40px)/2)]"
          )}
          onClick={() => (isMobile ? onNavigate?.() : onCollapsedChange(!effectiveCollapsed))}
          aria-label={isMobile ? "Close navigation menu" : effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {effectiveCollapsed ? <ChevronsRight className="h-5 w-5" aria-hidden="true" /> : <ChevronsLeft className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      <nav
        className={cn("min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-4", effectiveCollapsed ? "px-2" : "px-3")}
        aria-label="Primary navigation"
      >
        <ul className={cn("space-y-1.5", effectiveCollapsed && "space-y-2")}>
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const hasChildren = Boolean(item.children?.length);
            const isOpen = visibleOpenMenuKeys.includes(item.key);
            const active = isItemActive(pathname, item);
            const rowClassName = cn(
              "group relative flex min-h-11 w-full min-w-0 items-center gap-3 rounded-lg text-sm font-semibold transition-colors",
              effectiveCollapsed ? "justify-center px-0" : "px-3",
              isDark
                ? active
                  ? "bg-blue-500/10 text-blue-200"
                  : "text-slate-300 hover:bg-white/5 hover:text-blue-200"
                : active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-800 hover:bg-slate-50 hover:text-blue-700"
            );
            const iconClassName = cn(
              "h-5 w-5 shrink-0 transition-colors",
              isDark
                ? active
                  ? "text-blue-300"
                  : "text-slate-400 group-hover:text-blue-200"
                : active
                  ? "text-blue-700"
                  : "text-slate-600 group-hover:text-blue-700"
            );
            const indicatorClassName = cn("absolute left-0 top-2 h-7 w-1 rounded-r-full", isDark ? "bg-blue-300" : "bg-blue-700");

            return (
              <li key={item.key} className="min-w-0">
                {hasChildren ? (
                  <button
                    type="button"
                    className={rowClassName}
                    onClick={() => toggleMenu(item)}
                    aria-expanded={isOpen}
                    title={effectiveCollapsed ? item.label : undefined}
                  >
                    {active ? <span className={indicatorClassName} /> : null}
                    <Icon className={iconClassName} aria-hidden="true" />
                    {!effectiveCollapsed ? (
                      <>
                        <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                        {isOpen ? (
                          <ChevronDown className={cn("h-4 w-4 shrink-0", isDark ? "text-slate-400" : "text-slate-500")} aria-hidden="true" />
                        ) : (
                          <ChevronRight className={cn("h-4 w-4 shrink-0", isDark ? "text-slate-400" : "text-slate-500")} aria-hidden="true" />
                        )}
                      </>
                    ) : null}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    prefetch={false}
                    className={rowClassName}
                    aria-current={active ? "page" : undefined}
                    title={effectiveCollapsed ? item.label : undefined}
                    onClick={onNavigate}
                  >
                    {active ? <span className={indicatorClassName} /> : null}
                    <Icon className={iconClassName} aria-hidden="true" />
                    {!effectiveCollapsed ? <span className="min-w-0 flex-1 truncate text-left">{item.label}</span> : null}
                  </Link>
                )}

                {hasChildren && isOpen && !effectiveCollapsed ? (
                  <ul className={cn("ml-[23px] mt-1 space-y-1 border-l py-1 pl-4", isDark ? "border-slate-700/70" : "border-slate-200")}>
                    {item.children?.map((child) => {
                      const childActive = isNavigationHrefActive(pathname, child.href);

                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            prefetch={false}
                            className={cn(
                              "group/sub relative flex min-h-9 min-w-0 items-center rounded-md px-3 text-[13px] font-medium transition-colors",
                              isDark
                                ? childActive
                                  ? "bg-blue-500/10 text-blue-200"
                                  : "text-slate-400 hover:bg-white/5 hover:text-blue-200"
                                : childActive
                                  ? "bg-blue-50/80 text-blue-700"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                            )}
                            aria-current={childActive ? "page" : undefined}
                            onClick={onNavigate}
                          >
                            <span
                              className={cn(
                                "absolute -left-[17px] top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full transition-colors",
                                childActive ? (isDark ? "bg-blue-300" : "bg-blue-700") : "bg-transparent group-hover/sub:bg-blue-300"
                              )}
                              aria-hidden="true"
                            />
                            <span className="min-w-0 truncate">{child.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function Sidebar({
  collapsed,
  mobileOpen,
  theme,
  onCollapsedChange,
  onMobileOpenChange
}: SidebarProps) {
  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-[60] bg-slate-950/45 backdrop-blur-[1px] lg:hidden"
          aria-label="Close navigation menu"
          onClick={() => onMobileOpenChange(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed bottom-0 left-0 top-0 z-[70] flex w-[min(86vw,320px)] overflow-visible border-r shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          theme === "dark" ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent
          collapsed={false}
          theme={theme}
          isMobile
          onCollapsedChange={onCollapsedChange}
          onNavigate={() => onMobileOpenChange(false)}
        />
      </aside>

      <aside
        className={cn(
          "fixed bottom-0 left-0 top-0 z-[55] hidden overflow-visible border-r shadow-[4px_0_28px_rgba(15,23,42,0.04)] transition-[width] duration-300 ease-out lg:flex",
          theme === "dark" ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950",
          collapsed ? "w-20" : "w-[280px]"
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          theme={theme}
          onCollapsedChange={onCollapsedChange}
        />
      </aside>
    </>
  );
}
