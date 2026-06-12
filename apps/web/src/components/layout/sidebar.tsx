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
        className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-white/95 shadow-sm transition hover:bg-white"
        title="Dashboard"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={toStaticAssetHref("/logo/sucofindo-logo.png")}
          alt="SUCOFINDO"
          className="h-8 w-8 object-contain"
        />
      </Link>
    );
  }

  return (
    <Link
      href="/dashboard"
      className="group flex min-h-[104px] items-center gap-3 rounded-[1.35rem] border border-white/20 bg-white/10 px-3 py-3 shadow-sm transition hover:bg-white/15"
    >
      <div className="flex w-24 shrink-0 flex-col items-center">
        <div className="grid h-14 w-24 place-items-center rounded-2xl bg-white px-2 py-2 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={toStaticAssetHref("/logo/sucofindo-logo.png")}
            alt="SUCOFINDO"
            className="max-h-10 max-w-full object-contain"
          />
        </div>
        <p className="mt-2 text-center text-[10px] font-extrabold leading-3 text-white">
          Assuring Quality,
          <br />
          Protecting Trust
        </p>
      </div>

      <div className="h-20 w-px shrink-0 bg-white/35" aria-hidden="true" />

      <div className="min-w-0 flex-1 text-white">
        <p className="text-[14px] font-extrabold leading-5 tracking-tight">
          ASSET INTEGRITY
        </p>
        <p className="text-[14px] font-extrabold leading-5 tracking-tight">
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
      "group relative overflow-hidden rounded-2xl transition-all",
      isDark
        ? parentActive
          ? "bg-blue-500/15 text-blue-100 shadow-[inset_0_0_0_1px_rgba(147,197,253,0.25)]"
          : "text-slate-300 hover:bg-white/5 hover:text-blue-100"
        : parentActive
          ? "bg-blue-50 text-blue-700 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.10)]"
          : "text-slate-700 hover:bg-slate-50 hover:text-blue-700",
    );

    const iconClassName = cn(
      "h-5 w-5 shrink-0",
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
                "flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-xl text-left text-sm font-bold outline-none transition",
                effectiveCollapsed ? "justify-center px-0" : "px-3",
                parentActive && !effectiveCollapsed ? "bg-white/45" : "",
              )}
              title={effectiveCollapsed ? item.label : undefined}
              aria-label={`${item.label} - open first subpage`}
            >
              {parentActive ? (
                <span
                  className={cn(
                    "absolute left-0 top-3 h-6 w-1 rounded-r-full",
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
                className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl transition", isDark ? "hover:bg-white/10" : "hover:bg-white")}
                aria-expanded={isOpen}
                aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label} children`}
              >
                <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen ? "rotate-90" : "rotate-0")} aria-hidden="true" />
              </button>
            ) : null}
          </div>

          {hasChildren && isOpen && !effectiveCollapsed ? (
            <div className={cn("mx-2 mb-2 rounded-2xl border p-1.5", isDark ? "border-white/10 bg-slate-950/25" : "border-blue-100 bg-white/70")}>
              <div className="grid gap-1">
                {item.children?.map((child) => {
                  const childActive = child.href === activeChildHref;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => onNavigate?.()}
                      className={cn(
                        "flex min-h-9 items-center rounded-xl px-3 text-sm font-semibold transition",
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
          className={cn("relative flex min-h-11 min-w-0 items-center gap-3 rounded-2xl text-sm font-bold transition", effectiveCollapsed ? "justify-center px-0" : "px-4")}
          title={effectiveCollapsed ? item.label : undefined}
        >
          {parentActive ? (
            <span className={cn("absolute left-0 top-3 h-6 w-1 rounded-r-full", isDark ? "bg-blue-200" : "bg-blue-700")} aria-hidden="true" />
          ) : null}
          <Icon className={iconClassName} aria-hidden="true" />
          {!effectiveCollapsed ? <span className="truncate">{item.label}</span> : null}
        </Link>
      </li>
    );
  }

  return (
    <div className={cn("flex h-full min-h-0 w-full flex-col", isDark ? "bg-slate-950 text-slate-100" : "bg-white text-slate-950")}>
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 p-4">
        <SucofindoLogo collapsed={effectiveCollapsed} />
      </div>

      <div className={cn("border-b p-3", isDark ? "border-slate-800" : "border-slate-200")}>
        <button
          type="button"
          onClick={() => (isMobile ? onNavigate?.() : onCollapsedChange(!effectiveCollapsed))}
          className={cn(
            "flex h-12 w-full items-center rounded-2xl border text-sm font-extrabold transition",
            effectiveCollapsed ? "justify-center px-0" : "justify-between px-4",
            isDark ? "border-blue-400/20 bg-blue-500/10 text-blue-100 hover:bg-blue-500/15" : "border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100",
          )}
          aria-label={isMobile ? "Close navigation menu" : effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {!effectiveCollapsed ? <span>Navigation</span> : null}
          {effectiveCollapsed ? <ChevronsRight className="h-5 w-5" aria-hidden="true" /> : <ChevronsLeft className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3">
        <ul className="space-y-2">{NAVIGATION_ITEMS.map((item) => renderItem(item))}</ul>
      </nav>
    </div>
  );
}

export function Sidebar({ collapsed, mobileOpen, theme, onCollapsedChange, onMobileOpenChange }: SidebarProps) {
  return (
    <>
      {mobileOpen ? <div className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={() => onMobileOpenChange(false)} /> : null}

      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-[280px] border-r shadow-2xl transition-transform duration-300 lg:hidden", theme === "dark" ? "border-slate-800" : "border-slate-200", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <SidebarContent collapsed={false} theme={theme} isMobile onCollapsedChange={onCollapsedChange} onNavigate={() => onMobileOpenChange(false)} />
      </aside>

      <aside className={cn("fixed inset-y-0 left-0 z-40 hidden border-r shadow-[0_18px_45px_rgba(15,23,42,0.14)] transition-[width] duration-300 lg:flex", collapsed ? "w-20" : "w-[280px]", theme === "dark" ? "border-slate-800" : "border-slate-200")}>
        <SidebarContent collapsed={collapsed} theme={theme} onCollapsedChange={onCollapsedChange} />
      </aside>
    </>
  );
}