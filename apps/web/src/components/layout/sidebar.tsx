"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useMemo, useState } from "react";

import {
  DEFAULT_OPEN_NAVIGATION_KEYS,
  isNavigationHrefActive,
  NAVIGATION_ITEMS,
  type NavigationItem,
} from "@/lib/navigation-data";
import { navigateToAppRoute, toStaticAssetHref } from "@/lib/static-navigation";
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

function getPrimaryHref(item: NavigationItem) {
  return item.children?.[0]?.href ?? item.href;
}

function getActiveChildHref(pathname: string, item: NavigationItem) {
  if (!item.children?.length) return undefined;

  return [...item.children]
    .sort((a, b) => b.href.length - a.href.length)
    .find((child) => isNavigationHrefActive(pathname, child.href))?.href;
}

function isParentActive(pathname: string, item: NavigationItem) {
  return (
    isNavigationHrefActive(pathname, item.href) ||
    Boolean(item.children?.some((child) => isNavigationHrefActive(pathname, child.href)))
  );
}

function isLeafItemActive(pathname: string, item: NavigationItem) {
  if (item.children?.length) return false;
  return isNavigationHrefActive(pathname, item.href);
}

function SucofindoLogo({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <Link
        href="/dashboard"
        className="mx-auto grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-white/95 shadow-sm transition hover:bg-white"
        title="Dashboard"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={toStaticAssetHref("/logo/sucofindo-logo.png")}
          alt="SUCOFINDO"
          className="h-7 w-7 object-contain"
        />
      </Link>
    );
  }

  return (
    <Link
      href="/dashboard"
      className="group flex min-h-[78px] items-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 px-2.5 py-2.5 shadow-sm transition hover:bg-white/15"
    >
      <div className="flex w-20 shrink-0 flex-col items-center">
        <div className="grid h-11 w-20 place-items-center rounded-xl bg-white px-2 py-1.5 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={toStaticAssetHref("/logo/sucofindo-logo.png")}
            alt="SUCOFINDO"
            className="max-h-8 max-w-full object-contain"
          />
        </div>
        <p className="mt-1.5 text-center text-[9px] font-extrabold leading-3 text-white">
          Assuring Quality,
          <br />
          Protecting Trust
        </p>
      </div>

      <div className="h-14 w-px shrink-0 bg-white/35" aria-hidden="true" />

      <div className="min-w-0 flex-1 text-white">
        <p className="text-[12px] font-extrabold leading-4 tracking-tight">
          ASSET INTEGRITY
        </p>
        <p className="text-[12px] font-extrabold leading-4 tracking-tight">
          MANAGEMENT
        </p>
      </div>
    </Link>
  );
}
function SidebarContent({
  collapsed,
  theme,
  isMobile = false,
  onCollapsedChange,
  onNavigate,
}: SidebarContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [openMenuKeys, setOpenMenuKeys] = useState(DEFAULT_OPEN_NAVIGATION_KEYS);
  const effectiveCollapsed = collapsed && !isMobile;
  const isDark = theme === "dark";

  const activeParentKeys = useMemo(
    () => NAVIGATION_ITEMS.filter((item) => getActiveChildHref(pathname, item)).map((item) => item.key),
    [pathname],
  );

  const visibleOpenMenuKeys = useMemo(
    () => Array.from(new Set([...openMenuKeys, ...activeParentKeys])),
    [openMenuKeys, activeParentKeys],
  );

  function navigateToPrimary(item: NavigationItem) {
    navigateToAppRoute(router, getPrimaryHref(item));
    onNavigate?.();
  }

  function toggleChildren(item: NavigationItem) {
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

  function renderItem(item: NavigationItem) {
    const Icon = item.icon;
    const hasChildren = Boolean(item.children?.length);
    const isOpen = visibleOpenMenuKeys.includes(item.key);
    const activeChildHref = getActiveChildHref(pathname, item);
    const parentActive = hasChildren ? isParentActive(pathname, item) : isLeafItemActive(pathname, item);

    const itemShellClassName = cn(
      "group relative overflow-hidden rounded-xl transition-all",
      isDark
        ? parentActive
          ? "bg-blue-500/15 text-blue-100 shadow-[inset_0_0_0_1px_rgba(147,197,253,0.25)]"
          : "text-slate-300 hover:bg-white/5 hover:text-blue-100"
        : parentActive
          ? "bg-blue-50 text-blue-700 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.10)]"
          : "text-slate-700 hover:bg-slate-50 hover:text-blue-700",
    );

    const iconClassName = cn(
      "h-[18px] w-[18px] shrink-0",
      isDark
        ? parentActive
          ? "text-blue-200"
          : "text-slate-400 group-hover:text-blue-200"
        : parentActive
          ? "text-blue-700"
          : "text-slate-500 group-hover:text-blue-700",
    );

    if (hasChildren) {
      return (
        <li key={item.key} className={itemShellClassName}>
          <div className={cn("flex items-center", effectiveCollapsed ? "justify-center" : "gap-1 p-1")}>
            <button
              type="button"
              onClick={() => navigateToPrimary(item)}
              className={cn(
                "flex min-h-9 min-w-0 flex-1 items-center gap-2.5 rounded-xl text-left text-sm font-bold outline-none transition",
                effectiveCollapsed ? "justify-center px-0" : "px-2.5",
                parentActive && !effectiveCollapsed ? "bg-white/45" : "",
              )}
              title={effectiveCollapsed ? item.label : undefined}
              aria-label={`${item.label} - open first subpage`}
            >
              {parentActive ? (
                <span
                  className={cn(
                    "absolute left-0 top-2.5 h-5 w-1 rounded-r-full",
                    isDark ? "bg-blue-200" : "bg-blue-700",
                  )}
                  aria-hidden="true"
                />
              ) : null}
              <Icon className={iconClassName} aria-hidden="true" />
              {!effectiveCollapsed ? <span className="truncate">{item.label}</span> : null}
            </button>

            {!effectiveCollapsed ? (
              <button
                type="button"
                onClick={() => toggleChildren(item)}
                className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-xl transition", isDark ? "hover:bg-white/10" : "hover:bg-white")}
                aria-expanded={isOpen}
                aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label} children`}
              >
                <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen ? "rotate-90" : "rotate-0")} aria-hidden="true" />
              </button>
            ) : null}
          </div>

          {hasChildren && isOpen && !effectiveCollapsed ? (
            <div className={cn("mx-2 mb-2 rounded-xl border p-1", isDark ? "border-white/10 bg-slate-950/25" : "border-blue-100 bg-white/70")}>
              <div className="grid gap-1">
                {item.children?.map((child) => {
                  const childActive = child.href === activeChildHref;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => onNavigate?.()}
                      className={cn(
                        "flex min-h-8 items-center rounded-lg px-2.5 text-xs font-semibold transition",
                        childActive
                          ? isDark
                            ? "bg-blue-500/20 text-blue-100"
                            : "bg-blue-600 text-white shadow-sm"
                          : isDark
                            ? "text-slate-300 hover:bg-white/5 hover:text-blue-100"
                            : "text-slate-600 hover:bg-blue-50 hover:text-blue-700",
                      )}
                    >
                      <span className="truncate">{child.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}
        </li>
      );
    }

    return (
      <li key={item.key} className={itemShellClassName}>
        <Link
          href={item.href}
          onClick={() => onNavigate?.()}
          className={cn("relative flex min-h-9 min-w-0 items-center gap-2.5 rounded-xl text-sm font-bold transition", effectiveCollapsed ? "justify-center px-0" : "px-3")}
          title={effectiveCollapsed ? item.label : undefined}
        >
          {parentActive ? (
            <span className={cn("absolute left-0 top-2.5 h-5 w-1 rounded-r-full", isDark ? "bg-blue-200" : "bg-blue-700")} aria-hidden="true" />
          ) : null}
          <Icon className={iconClassName} aria-hidden="true" />
          {!effectiveCollapsed ? <span className="truncate">{item.label}</span> : null}
        </Link>
      </li>
    );
  }

  return (
    <div className={cn("flex h-full min-h-0 w-full flex-col", isDark ? "bg-slate-950 text-slate-100" : "bg-white text-slate-950")}>
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 p-3">
        <SucofindoLogo collapsed={effectiveCollapsed} />
      </div>

      <div className={cn("border-b p-2.5", isDark ? "border-slate-800" : "border-slate-200")}>
        <button
          type="button"
          onClick={() => (isMobile ? onNavigate?.() : onCollapsedChange(!effectiveCollapsed))}
          className={cn(
            "flex h-9 w-full items-center rounded-xl border text-sm font-extrabold transition",
            effectiveCollapsed ? "justify-center px-0" : "justify-between px-3",
            isDark ? "border-blue-400/20 bg-blue-500/10 text-blue-100 hover:bg-blue-500/15" : "border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100",
          )}
          aria-label={isMobile ? "Close navigation menu" : effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {!effectiveCollapsed ? <span>Navigation</span> : null}
          {effectiveCollapsed ? <ChevronsRight className="h-5 w-5" aria-hidden="true" /> : <ChevronsLeft className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-2.5">
        <ul className="space-y-1.5">{NAVIGATION_ITEMS.map((item) => renderItem(item))}</ul>
      </nav>
    </div>
  );
}

export function Sidebar({ collapsed, mobileOpen, theme, onCollapsedChange, onMobileOpenChange }: SidebarProps) {
  return (
    <>
      {mobileOpen ? <div className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={() => onMobileOpenChange(false)} /> : null}

      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-[248px] border-r shadow-2xl transition-transform duration-300 lg:hidden", theme === "dark" ? "border-slate-800" : "border-slate-200", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <SidebarContent collapsed={false} theme={theme} isMobile onCollapsedChange={onCollapsedChange} onNavigate={() => onMobileOpenChange(false)} />
      </aside>

      <aside className={cn("fixed inset-y-0 left-0 z-40 hidden border-r shadow-[0_18px_45px_rgba(15,23,42,0.14)] transition-[width] duration-300 lg:flex", collapsed ? "w-16" : "w-[248px]", theme === "dark" ? "border-slate-800" : "border-slate-200")}>
        <SidebarContent collapsed={collapsed} theme={theme} onCollapsedChange={onCollapsedChange} />
      </aside>
    </>
  );
}
