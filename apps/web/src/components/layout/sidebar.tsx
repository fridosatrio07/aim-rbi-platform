"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import {
  DEFAULT_OPEN_NAVIGATION_KEYS,
  isNavigationHrefActive,
  NAVIGATION_ITEMS,
  type NavigationItem,
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
        compact ? "h-11 w-12 p-1.5" : "h-14 w-20 p-2",
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

function getActiveChildHref(pathname: string, item: NavigationItem) {
  if (!item.children?.length) {
    return undefined;
  }

  return [...item.children]
    .sort((a, b) => b.href.length - a.href.length)
    .find((child) => isNavigationHrefActive(pathname, child.href))?.href;
}

function isLeafItemActive(pathname: string, item: NavigationItem) {
  if (item.children?.length) {
    return false;
  }

  return isNavigationHrefActive(pathname, item.href);
}

function SidebarContent({
  collapsed,
  theme,
  isMobile = false,
  onCollapsedChange,
  onNavigate,
}: SidebarContentProps) {
  const pathname = usePathname();
  const [openMenuKeys, setOpenMenuKeys] = useState<string[]>(DEFAULT_OPEN_NAVIGATION_KEYS);

  const effectiveCollapsed = collapsed && !isMobile;
  const isDark = theme === "dark";

  const activeParentKeys = useMemo(
    () =>
      NAVIGATION_ITEMS.filter((item) => getActiveChildHref(pathname, item)).map(
        (item) => item.key,
      ),
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
      current.includes(item.key)
        ? current.filter((key) => key !== item.key)
        : [...current, item.key],
    );
  }

  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-full flex-col transition-colors duration-300",
        isDark
          ? "bg-slate-950 text-slate-200"
          : "bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-200",
      )}
    >
      <div
        className={cn(
          "relative h-[var(--app-header-height)] shrink-0 overflow-visible bg-gradient-to-br",
          isDark
            ? "from-slate-950 via-slate-900 to-blue-950"
            : "from-blue-900 via-blue-800 to-blue-600 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950",
        )}
      >
        <div
          className={cn(
            "flex h-full items-center",
            effectiveCollapsed ? "justify-center px-3" : "gap-3 px-4",
          )}
        >
          {!effectiveCollapsed ? (
            <>
              <Link
                href="/dashboard"
                onClick={onNavigate}
                className="flex shrink-0 flex-col items-center gap-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/70"
                aria-label="Go to Dashboard"
              >
                <SucofindoLogo />
                <p className="max-w-[112px] text-center text-[9px] font-semibold leading-3 text-blue-50/90">
                  Assuring Quality, Protecting Trust
                </p>
              </Link>
              <div className="h-14 w-px shrink-0 bg-white/35" aria-hidden="true" />
              <Link
                href="/dashboard"
                onClick={onNavigate}
                className="min-w-0 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/70"
                aria-label="Go to Dashboard"
              >
                <p className="truncate text-[13px] font-bold leading-5">ASSET INTEGRITY</p>
                <p className="truncate text-[13px] font-bold leading-5">MANAGEMENT</p>
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard"
              onClick={onNavigate}
              className="rounded-xl focus:outline-none focus:ring-2 focus:ring-white/70"
              aria-label="Go to Dashboard"
            >
              <SucofindoLogo compact />
            </Link>
          )}
        </div>
      </div>

      <div className={cn("shrink-0 border-b py-2", isDark ? "border-slate-800" : "border-slate-200")}>
        <div className={cn(effectiveCollapsed ? "px-2" : "px-3")}>
          <button
            type="button"
            className={cn(
              "group flex min-h-11 w-full items-center rounded-lg border text-sm font-semibold transition-colors",
              effectiveCollapsed ? "justify-center px-0" : "justify-between gap-3 px-3",
              isDark
                ? "border-blue-400/20 bg-blue-500/10 text-blue-200 hover:bg-blue-500/15"
                : "border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100",
            )}
            onClick={() => (isMobile ? onNavigate?.() : onCollapsedChange(!effectiveCollapsed))}
            aria-label={isMobile ? "Close navigation menu" : effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {!effectiveCollapsed ? <span className="truncate">Navigation</span> : null}
            {effectiveCollapsed ? (
              <ChevronsRight className="h-5 w-5 shrink-0" aria-hidden="true" />
            ) : (
              <ChevronsLeft className="h-5 w-5 shrink-0" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <nav
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-4",
          effectiveCollapsed ? "px-2" : "px-3",
        )}
        aria-label="Primary navigation"
      >
        <ul className={cn("space-y-1.5", effectiveCollapsed && "space-y-2")}>
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const hasChildren = Boolean(item.children?.length);
            const isOpen = visibleOpenMenuKeys.includes(item.key);
            const activeChildHref = getActiveChildHref(pathname, item);
            const active = isLeafItemActive(pathname, item);

            const rowClassName = cn(
              "group relative flex min-h-11 w-full min-w-0 items-center gap-3 rounded-lg text-sm font-semibold transition-colors",
              effectiveCollapsed ? "justify-center px-0" : "px-3",
              isDark
                ? active
                  ? "bg-blue-500/10 text-blue-200"
                  : "text-slate-300 hover:bg-white/5 hover:text-blue-200"
                : active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-800 hover:bg-slate-50 hover:text-blue-700",
            );

            const iconClassName = cn(
              "h-5 w-5 shrink-0 transition-colors",
              isDark
                ? active
                  ? "text-blue-300"
                  : "text-slate-400 group-hover:text-blue-200"
                : active
                  ? "text-blue-700"
                  : "text-slate-600 group-hover:text-blue-700",
            );

            const indicatorClassName = cn(
              "absolute left-0 top-2 h-7 w-1 rounded-r-full",
              isDark ? "bg-blue-300" : "bg-blue-700",
            );

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
                    <Icon className={iconClassName} aria-hidden="true" />
                    {!effectiveCollapsed ? (
                      <>
                        <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                        {isOpen ? (
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 shrink-0",
                              isDark ? "text-slate-400" : "text-slate-500",
                            )}
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 shrink-0",
                              isDark ? "text-slate-400" : "text-slate-500",
                            )}
                            aria-hidden="true"
                          />
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
                    {!effectiveCollapsed ? (
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    ) : null}
                  </Link>
                )}

                {hasChildren && isOpen && !effectiveCollapsed ? (
                  <ul
                    className={cn(
                      "ml-8 mt-2 space-y-1 border-l pl-4",
                      isDark ? "border-slate-800" : "border-slate-200",
                    )}
                  >
                    {item.children?.map((child) => {
                      const childActive = child.href === activeChildHref;

                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            prefetch={false}
                            onClick={onNavigate}
                            aria-current={childActive ? "page" : undefined}
                            className={cn(
                              "block rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                              isDark
                                ? childActive
                                  ? "bg-blue-500/10 text-blue-200"
                                  : "text-slate-400 hover:bg-white/5 hover:text-blue-200"
                                : childActive
                                  ? "bg-blue-50 text-blue-700"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-blue-700",
                            )}
                          >
                            {child.label}
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
  onMobileOpenChange,
}: SidebarProps) {
  const isDark = theme === "dark";

  return (
    <>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/55"
            aria-label="Close navigation overlay"
            onClick={() => onMobileOpenChange(false)}
          />
          <aside
            className={cn(
              "relative z-10 h-full w-[280px] border-r shadow-[8px_0_32px_rgba(15,23,42,0.18)]",
              isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white",
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
        </div>
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden h-screen border-r shadow-[8px_0_32px_rgba(15,23,42,0.10)] transition-all duration-300 ease-out lg:block",
          collapsed ? "w-20" : "w-[280px]",
          isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white",
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