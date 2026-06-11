"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Building2,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  UserCircle
} from "lucide-react";

import type { AppInfo } from "@/lib/dashboard-data";
import { logout } from "@/lib/auth";
import { navigateToAppRoute } from "@/lib/static-navigation";
import { cn } from "@/lib/utils";

type AppTheme = "light" | "dark";

interface TopbarProps {
  appInfo: AppInfo;
  sidebarCollapsed?: boolean;
  theme: AppTheme;
  onMobileMenuClick?: () => void;
  onThemeToggle: () => void;
}

const PROJECT_OPTIONS = [
  "SPM-01 Instalasi Stasiun Pengumpul Minyak Demo Facility"
];

const NOTIFICATIONS = [
  "Overdue inspection detected",
  "Certificate expiring soon",
  "High risk anomaly updated"
];

export function Topbar({
  appInfo,
  sidebarCollapsed = false,
  theme,
  onMobileMenuClick,
  onThemeToggle
}: TopbarProps) {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState(PROJECT_OPTIONS[0]);
  const [projectOpen, setProjectOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const isDark = theme === "dark";
  const dropdownPanelClass = cn(
    "border shadow-[0_18px_45px_rgba(15,23,42,0.22)]",
    isDark ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-800"
  );
  const dropdownHoverClass = isDark ? "hover:bg-slate-800 hover:text-blue-200" : "hover:bg-blue-50 hover:text-blue-700";

  function handleLogout() {
    logout();
    navigateToAppRoute(router, "/login", "replace");
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-[var(--app-header-height)] border-b bg-gradient-to-r text-white shadow-[0_10px_30px_rgba(15,23,42,0.12)] transition-[left] duration-300 ease-out",
        isDark
          ? "border-slate-800 from-slate-950 via-slate-900 to-slate-800"
          : "border-slate-700/25 from-slate-800 via-slate-700 to-blue-900 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800",
        sidebarCollapsed ? "lg:left-20" : "lg:left-[280px]"
      )}
    >
      <div className="flex h-full min-w-0 items-center gap-2 px-3 sm:gap-3 sm:px-4 lg:px-5 xl:px-6">
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/15 lg:hidden"
          onClick={onMobileMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="hidden min-w-0 flex-1 lg:block" aria-hidden="true" />

        <div className="relative min-w-0 flex-1 sm:flex-none">
          <button
            type="button"
            className="flex h-12 w-full min-w-0 items-center gap-2 rounded-lg border border-white/15 bg-white/7 px-3 text-left shadow-inner shadow-white/5 transition-colors hover:bg-white/12 sm:h-14 sm:w-[280px] lg:w-[320px] xl:w-[380px]"
            onClick={() => {
              setProjectOpen((current) => !current);
              setNotificationOpen(false);
              setUserOpen(false);
            }}
            aria-expanded={projectOpen}
            aria-label={`Project / Site: ${selectedProject}`}
          >
            <Building2 className="h-5 w-5 shrink-0 text-blue-100 sm:h-6 sm:w-6" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold leading-4 text-blue-100/85 sm:text-xs">Project / Site</span>
              <span className="block truncate text-sm font-bold leading-5 text-white sm:text-base">{selectedProject}</span>
            </span>
            <ChevronDown className={cn("h-4 w-4 shrink-0 text-blue-100 transition-transform", projectOpen && "rotate-180")} aria-hidden="true" />
          </button>

          {projectOpen ? (
            <div className={cn("fixed left-3 right-3 top-[calc(var(--app-header-height)+8px)] z-[90] overflow-hidden rounded-lg py-1 sm:absolute sm:left-0 sm:right-auto sm:top-[calc(100%+10px)] sm:w-[min(88vw,380px)]", dropdownPanelClass)}>
              {PROJECT_OPTIONS.map((project) => (
                <button
                  key={project}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold transition-colors",
                    dropdownHoverClass,
                    selectedProject === project && (isDark ? "bg-blue-500/10 text-blue-200" : "bg-blue-50 text-blue-700")
                  )}
                  onClick={() => {
                    setSelectedProject(project);
                    setProjectOpen(false);
                  }}
                >
                  <Building2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 truncate">{project}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="hidden h-11 w-px shrink-0 bg-white/20 sm:block" aria-hidden="true" />

        <div className="relative shrink-0">
          <button
            type="button"
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-blue-50 transition-colors hover:bg-white/10"
            onClick={() => {
              setNotificationOpen((current) => !current);
              setProjectOpen(false);
              setUserOpen(false);
            }}
            aria-expanded={notificationOpen}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold leading-none text-white ring-2 ring-blue-900">
              12
            </span>
          </button>

          {notificationOpen ? (
            <div className={cn("absolute right-0 top-[calc(100%+12px)] z-[90] w-[min(86vw,300px)] rounded-lg p-2", dropdownPanelClass)}>
              <p className={cn("px-2 pb-2 pt-1 text-xs font-bold uppercase", isDark ? "text-slate-400" : "text-slate-500")}>Notifications</p>
              <div className="space-y-1">
                {NOTIFICATIONS.map((notification) => (
                  <div key={notification} className={cn("rounded-md px-2 py-2 text-sm font-medium transition-colors", isDark ? "text-slate-200 hover:bg-slate-800" : "text-slate-700 hover:bg-slate-50")}>
                    {notification}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-blue-50 transition-colors hover:bg-white/10"
          onClick={onThemeToggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to night mode"}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
        </button>

        <div className="hidden h-11 w-px shrink-0 bg-white/20 sm:block" aria-hidden="true" />

        <div className="relative shrink-0">
          <button
            type="button"
            className="flex min-w-0 items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-white/10 sm:gap-3 sm:px-2"
            onClick={() => {
              setUserOpen((current) => !current);
              setProjectOpen(false);
              setNotificationOpen(false);
            }}
            aria-expanded={userOpen}
            aria-label="User menu"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-900 shadow-sm sm:h-12 sm:w-12">
              <UserCircle className="h-7 w-7 text-slate-500 sm:h-8 sm:w-8" aria-hidden="true" />
            </div>
            <span className="hidden min-w-0 md:block">
              <span className="block truncate text-sm font-bold leading-5 text-white">{appInfo.user.name}</span>
              <span className="block truncate text-xs font-semibold leading-4 text-blue-100/90">SUCOFINDO</span>
              <span className="block truncate text-xs font-semibold leading-4 text-blue-100/90">Superadmin</span>
            </span>
            <ChevronDown className={cn("hidden h-4 w-4 shrink-0 text-blue-100 transition-transform sm:block", userOpen && "rotate-180")} aria-hidden="true" />
          </button>

          {userOpen ? (
            <div className={cn("absolute right-0 top-[calc(100%+10px)] z-[90] w-56 overflow-hidden rounded-lg py-1", dropdownPanelClass)}>
              <div className={cn("border-b px-3 py-2", isDark ? "border-slate-700" : "border-slate-100")}>
                <p className={cn("truncate text-sm font-bold", isDark ? "text-slate-100" : "text-slate-950")}>{appInfo.user.name}</p>
                <p className={cn("text-xs font-semibold", isDark ? "text-slate-400" : "text-slate-500")}>SUCOFINDO - Superadmin</p>
              </div>
              <button type="button" className={cn("flex w-full items-center gap-2 px-3 py-2.5 text-sm font-semibold transition-colors", isDark ? "hover:bg-slate-800" : "hover:bg-slate-50")}>
                <UserCircle className="h-4 w-4" aria-hidden="true" />
                Profile
              </button>
              <button type="button" className={cn("flex w-full items-center gap-2 px-3 py-2.5 text-sm font-semibold transition-colors", isDark ? "hover:bg-slate-800" : "hover:bg-slate-50")}>
                <Settings className="h-4 w-4" aria-hidden="true" />
                Account Settings
              </button>
              <button
                type="button"
                className={cn("flex w-full items-center gap-2 border-t px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors", isDark ? "border-slate-700 hover:bg-red-950/30" : "border-slate-100 hover:bg-red-50")}
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
