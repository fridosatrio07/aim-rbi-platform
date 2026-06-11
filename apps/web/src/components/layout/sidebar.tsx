"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DEFAULT_OPEN_NAVIGATION_KEYS,
  isChildNavigationHrefActive,
  isNavigationHrefActive,
  NAVIGATION_ITEMS,
  type NavigationItem,
} from "@/lib/navigation-data";
import { cn } from "@/lib/utils";
import type { AppTheme } from "@/lib/theme";

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
        "grid shrink-0 place-items-center rounded-xl bg-white shadow-[0_16px_30px_rgba(15,23,42,0.22)] ring-1 ring-white/40",
        compact ? "h-12 w-12" : "h-[74px] w-[96px]",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo/sucofindo-logo.png"
        alt="SUCOFINDO"
        className={cn("object-contain", compact ? "h-9 w-9" : "h-[58px] w-[78px]")}
        onError={(event) => {
          event.currentTarget.style.display = "none";
          const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = "grid";
        }}
      />
      <div
        className={cn(
          "hidden place-items-center rounded-lg bg-blue-700 font-bold text-white",
          compact ? "h-9 w-9 text-xs" : "h-[58px] w-[78px] text-sm",
        )}
      >
        SCI
      </div>
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
  onNavigate,
}: SidebarContentProps) {
  const pathname = usePathname();
  const [openMenuKeys, setOpenMenuKeys] = useState(DEFAULT_OPEN_NAVIGATION_KEYS);

  const effectiveCollapsed = collapsed && !isMobile;
  const isDark = theme === "dark";

  useEffect(() => {
    const activeParentKeys = NAVIGATION_ITEMS
      .filter((item) => item.children?.some((child) => isNavigationHrefActive(pathname, child.href)))
      .map((item) => item.key);

    if (!activeParentKeys.length) return;

    setOpenMenuKeys((current) => Array.from(new Set([...current, ...activeParentKeys])));
  }, [pathname]);

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
    <aside
      className={cn(
        "relative flex h-full flex-col border-r shadow-[8px_0_32px_rgba(15,23,42,0.10)] transition-all duration-200",
        effectiveCollapsed ? "w-[92px]" : "w-[336px]",
        isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white",
      )}
    >
      <div
        className={cn(
          "aim-top-gradient relative flex h-[116px] shrink-0 items-center",
          effectiveCollapsed ? "justify-center px-3" : "px-9",
        )}
      >
        {effectiveCollapsed ? (
          <SucofindoLogo compact />
        ) : (
          <div className="flex w-full items-center gap-7">
            <div className="flex flex-col items-center">
              <SucofindoLogo />
              <div className="mt-2 text-center text-[10px] font-semibold leading-3 text-white">
                Assuring Quality,
                <br />
                Protecting Trust
              </div>
            </div>

            <div className="h-[72px] w-px bg-white/35" />

            <div className="min-w-0">
              <div className="text-[17px] font-extrabold uppercase leading-6 tracking-wide text-white">
                ASSET INTEGRITY
              </div>
              <div className="text-[17px] font-extrabold uppercase leading-6 tracking-wide text-white">
                MANAGEMENT
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => (isMobile ? onNavigate?.() : onCollapsedChange(!effectiveCollapsed))}
          className={cn(
            "absolute -right-6 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border bg-white text-blue-700 shadow-[0_16px_32px_rgba(15,23,42,0.20)] transition-colors hover:bg-blue-50",
            isDark ? "border-slate-700" : "border-slate-200",
          )}
          aria-label={isMobile ? "Close navigation menu" : effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isMobile ? (
            <X className="h-5 w-5" />
          ) : effectiveCollapsed ? (
            <ChevronsRight className="h-5 w-5" />
          ) : (
            <ChevronsLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="aim-shell-scrollbar flex-1 overflow-y-auto px-4 py-6">
        <nav className="space-y-2" aria-label="Primary navigation">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const hasChildren = Boolean(item.children?.length);
            const isOpen = openMenuKeys.includes(item.key);
            const active = isItemActive(pathname, item);

            const rowClassName = cn(
              "group relative flex min-h-12 w-full min-w-0 items-center gap-3 rounded-xl text-[15px] font-semibold transition-colors",
              effectiveCollapsed ? "justify-center px-0" : "px-4",
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
              "absolute left-0 top-2 h-8 w-1 rounded-r-full",
              isDark ? "bg-blue-300" : "bg-blue-700",
            );

            return (
              <div key={item.key}>
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() => toggleMenu(item)}
                    className={rowClassName}
                    aria-expanded={isOpen}
                    title={effectiveCollapsed ? item.label : undefined}
                  >
                    {active ? <span className={indicatorClassName} /> : null}
                    <Icon className={iconClassName} />

                    {!effectiveCollapsed ? (
                      <>
                        <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        )}
                      </>
                    ) : null}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={rowClassName}
                    title={effectiveCollapsed ? item.label : undefined}
                    onClick={onNavigate}
                  >
                    {active ? <span className={indicatorClassName} /> : null}
                    <Icon className={iconClassName} />
                    {!effectiveCollapsed ? <span className="min-w-0 flex-1 truncate">{item.label}</span> : null}
                  </Link>
                )}

                {hasChildren && isOpen && !effectiveCollapsed ? (
                  <div className={cn("ml-8 mt-2 space-y-1 border-l pl-5", isDark ? "border-slate-800" : "border-slate-200")}>
                    {item.children?.map((child) => {
                      const childActive = isChildNavigationHrefActive(pathname, item.href, child.href);

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onNavigate}
                          className={cn(
                            "block rounded-lg px-4 py-2.5 text-[14px] font-medium transition-colors",
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
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export function Sidebar({
  collapsed,
  mobileOpen,
  theme,
  onCollapsedChange,
  onMobileOpenChange,
}: SidebarProps) {
  return (
    <>
      <div className="hidden shrink-0 lg:block">
        <SidebarContent
          collapsed={collapsed}
          theme={theme}
          onCollapsedChange={onCollapsedChange}
        />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/55"
            aria-label="Close navigation overlay"
            onClick={() => onMobileOpenChange(false)}
          />
          <div className="absolute inset-y-0 left-0">
            <SidebarContent
              collapsed={false}
              theme={theme}
              isMobile
              onCollapsedChange={onCollapsedChange}
              onNavigate={() => onMobileOpenChange(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}