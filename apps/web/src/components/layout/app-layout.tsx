"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { APP_INFO } from "@/lib/app-info";
import {
  applyTheme,
  getCurrentDocumentTheme,
  getStoredThemePreference,
  setManualTheme,
  syncThemeFromPreference,
  type AppTheme,
  type ThemeSource,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

const SIDEBAR_COLLAPSED_KEY = "assetIntegritySidebarCollapsed";

interface AppLayoutProps {
  children: ReactNode;
  contentClassName?: string;
}

export function AppLayout({ children, contentClassName }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<AppTheme>(() => getCurrentDocumentTheme());
  const [themeSource, setThemeSource] = useState<ThemeSource>("system");

  useEffect(() => {
    setSidebarCollapsed(window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true");

    const preference = syncThemeFromPreference();

    setTheme(preference.theme);
    setThemeSource(preference.source);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function handleSystemThemeChange(event: MediaQueryListEvent) {
      const preference = getStoredThemePreference();

      if (preference.source !== "system") return;

      const nextTheme = event.matches ? "dark" : "light";

      applyTheme(nextTheme, "system");
      setTheme(nextTheme);
      setThemeSource("system");
    }

    if (themeSource === "system") {
      media.addEventListener("change", handleSystemThemeChange);
    }

    return () => media.removeEventListener("change", handleSystemThemeChange);
  }, [themeSource]);

  function handleSidebarCollapsedChange(nextCollapsed: boolean) {
    setSidebarCollapsed(nextCollapsed);
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(nextCollapsed));
  }

  function handleThemeToggle() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      setManualTheme(nextTheme);
      setThemeSource("manual");

      return nextTheme;
    });
  }

  const isDark = theme === "dark";

  return (
    <div className={cn("flex min-h-screen transition-colors", isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-950")}>
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        theme={theme}
        onCollapsedChange={handleSidebarCollapsedChange}
        onMobileOpenChange={setMobileSidebarOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          appInfo={APP_INFO}
          theme={theme}
          onMobileMenuClick={() => setMobileSidebarOpen(true)}
          onThemeToggle={handleThemeToggle}
        />

        <main className={cn("min-w-0 flex-1 overflow-x-hidden transition-colors", isDark ? "bg-slate-950" : "bg-slate-50", contentClassName)}>
          {children}
        </main>
      </div>
    </div>
  );
}