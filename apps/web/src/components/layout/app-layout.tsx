"use client";

import type { ReactNode } from "react";
import { useEffect, useSyncExternalStore } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { APP_INFO } from "@/lib/app-info";
import {
  applyTheme,
  getStoredThemePreference,
  setManualTheme,
  type AppTheme,
  type ThemeSource,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

const SIDEBAR_COLLAPSED_KEY = "assetIntegritySidebarCollapsed";
const SIDEBAR_COLLAPSED_CHANGE_EVENT = "assetIntegritySidebarCollapsedChange";
const THEME_CHANGE_EVENT = "assetIntegrityThemeChange";

type ThemePreferenceSnapshot = `${ThemeSource}:${AppTheme}`;

interface AppLayoutProps {
  children: ReactNode;
  contentClassName?: string;
}

function canUseDOM() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function parseThemePreferenceSnapshot(snapshot: string): {
  source: ThemeSource;
  theme: AppTheme;
} {
  const [sourceValue, themeValue] = snapshot.split(":");

  return {
    source: sourceValue === "manual" ? "manual" : "system",
    theme: themeValue === "dark" ? "dark" : "light",
  };
}

function getThemePreferenceSnapshot(): ThemePreferenceSnapshot {
  if (!canUseDOM()) {
    return "system:light";
  }

  const preference = getStoredThemePreference();

  return `${preference.source}:${preference.theme}`;
}

function getThemePreferenceServerSnapshot(): ThemePreferenceSnapshot {
  return "system:light";
}

function subscribeToThemePreference(callback: () => void) {
  if (!canUseDOM()) {
    return () => {};
  }

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = () => callback();

  window.addEventListener("storage", handleChange);
  window.addEventListener(THEME_CHANGE_EVENT, handleChange);
  media.addEventListener("change", handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(THEME_CHANGE_EVENT, handleChange);
    media.removeEventListener("change", handleChange);
  };
}

function getSidebarCollapsedSnapshot() {
  if (!canUseDOM()) {
    return false;
  }

  return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
}

function getSidebarCollapsedServerSnapshot() {
  return false;
}

function subscribeToSidebarCollapsed(callback: () => void) {
  if (!canUseDOM()) {
    return () => {};
  }

  const handleChange = () => callback();

  window.addEventListener("storage", handleChange);
  window.addEventListener(SIDEBAR_COLLAPSED_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(SIDEBAR_COLLAPSED_CHANGE_EVENT, handleChange);
  };
}

function notifySidebarCollapsedChange() {
  if (!canUseDOM()) return;

  window.dispatchEvent(new Event(SIDEBAR_COLLAPSED_CHANGE_EVENT));
}

function notifyThemeChange() {
  if (!canUseDOM()) return;

  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function AppLayout({ children, contentClassName }: AppLayoutProps) {
  const sidebarCollapsed = useSyncExternalStore(
    subscribeToSidebarCollapsed,
    getSidebarCollapsedSnapshot,
    getSidebarCollapsedServerSnapshot,
  );

  const themePreferenceSnapshot = useSyncExternalStore(
    subscribeToThemePreference,
    getThemePreferenceSnapshot,
    getThemePreferenceServerSnapshot,
  );

  const { theme, source: themeSource } =
    parseThemePreferenceSnapshot(themePreferenceSnapshot);

  const isDark = theme === "dark";

  useEffect(() => {
    applyTheme(theme, themeSource);
  }, [theme, themeSource]);

  function handleSidebarCollapsedChange(nextCollapsed: boolean) {
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(nextCollapsed));
    notifySidebarCollapsedChange();
  }

  function handleThemeToggle() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setManualTheme(nextTheme);
    notifyThemeChange();
  }

  return (
    <div
      className={cn(
        "flex min-h-screen transition-colors",
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-950",
      )}
    >
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={false}
        theme={theme}
        onCollapsedChange={handleSidebarCollapsedChange}
        onMobileOpenChange={() => {}}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          appInfo={APP_INFO}
          theme={theme}
          onMobileMenuClick={() => {}}
          onThemeToggle={handleThemeToggle}
        />

        <main
          className={cn(
            "min-w-0 flex-1 overflow-x-hidden transition-colors",
            isDark ? "bg-slate-950" : "bg-slate-50",
            contentClassName,
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}