"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Building2,
  ChevronDown,
  HelpCircle,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  UserCircle,
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

const PROJECT_OPTIONS = ["SPM-01 Instalasi Stasiun Pengumpul Minyak Demo Facility"];

const NOTIFICATIONS = [
  "Overdue inspection detected",
  "Certificate expiring soon",
  "High risk anomaly updated",
];

export function Topbar({
  appInfo,
  sidebarCollapsed = false,
  theme,
  onMobileMenuClick,
  onThemeToggle,
}: TopbarProps) {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState(PROJECT_OPTIONS[0]);
  const [projectOpen, setProjectOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const isDark = theme === "dark";

  const dropdownPanelClass = cn(
    "border shadow-[0_18px_45px_rgba(15,23,42,0.22)]",
    isDark
      ? "border-slate-700 bg-slate-900 text-slate-100"
      : "border-slate-200 bg-white text-slate-800",
  );

  const dropdownHoverClass = isDark
    ? "hover:bg-slate-800 hover:text-blue-200"
    : "hover:bg-blue-50 hover:text-blue-700";

  function handleLogout() {
    logout();
    navigateToAppRoute(router, "/login", "replace");
  }

  function navigateFromUserMenu(href: string) {
    setUserOpen(false);
    navigateToAppRoute(router, href);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-30 h-[var(--app-header-height)] border-b transition-colors duration-300",
        sidebarCollapsed ? "lg:left-16" : "lg:left-[248px]",
        isDark
          ? "border-slate-800 bg-slate-950/95 text-slate-100"
          : "border-slate-200 bg-white/95 text-slate-950",
      )}
    >
      <div className="flex h-full items-center gap-2.5 px-3 sm:px-4">
        <button
          type="button"
          onClick={onMobileMenuClick}
          className={cn(
            "grid h-10 w-10 place-items-center rounded-xl border lg:hidden",
            isDark
              ? "border-slate-700 bg-slate-900 text-slate-200"
              : "border-slate-200 bg-white text-slate-700",
          )}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="relative hidden min-w-0 md:block">
          <button
            type="button"
            className={cn(
              "flex h-10 w-[360px] max-w-[38vw] items-center gap-2.5 rounded-xl border px-3 text-left transition-colors",
              isDark
                ? "border-slate-700 bg-slate-900/90 hover:bg-slate-900"
                : "border-slate-200 bg-slate-50 hover:bg-white",
            )}
            onClick={() => {
              setProjectOpen((current) => !current);
              setNotificationOpen(false);
              setUserOpen(false);
            }}
            aria-expanded={projectOpen}
            aria-label={`Project / Site: ${selectedProject}`}
          >
            <Building2 className="h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-slate-500">Project / Site</p>
              <p className="truncate text-sm font-bold">{selectedProject}</p>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
          </button>

          {projectOpen ? (
            <div className={cn("absolute left-0 top-[calc(100%+8px)] w-full rounded-2xl p-2", dropdownPanelClass)}>
              {PROJECT_OPTIONS.map((project) => (
                <button
                  key={project}
                  type="button"
                  className={cn("block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold", dropdownHoverClass)}
                  onClick={() => {
                    setSelectedProject(project);
                    setProjectOpen(false);
                  }}
                >
                  {project}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationOpen((current) => !current);
                setProjectOpen(false);
                setUserOpen(false);
              }}
              className={cn(
                "relative grid h-10 w-10 place-items-center rounded-xl transition-colors",
                isDark ? "hover:bg-slate-900" : "hover:bg-slate-100",
              )}
              aria-expanded={notificationOpen}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              <span className="absolute right-1.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                12
              </span>
            </button>

            {notificationOpen ? (
              <div className={cn("absolute right-0 top-[calc(100%+8px)] w-80 rounded-2xl p-3", dropdownPanelClass)}>
                <p className="px-2 pb-2 text-sm font-bold">Notifications</p>
                <div className="space-y-1">
                  {NOTIFICATIONS.map((notification) => (
                    <div
                      key={notification}
                      className={cn("rounded-xl px-3 py-2 text-sm", isDark ? "bg-slate-800" : "bg-slate-50")}
                    >
                      {notification}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onThemeToggle}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-xl transition-colors",
              isDark ? "hover:bg-slate-900" : "hover:bg-slate-100",
            )}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setUserOpen((current) => !current);
                setProjectOpen(false);
                setNotificationOpen(false);
              }}
              className={cn(
                "flex h-11 items-center gap-2 rounded-xl px-2 pr-2.5 transition-colors",
                isDark ? "hover:bg-slate-900" : "hover:bg-slate-100",
              )}
              aria-expanded={userOpen}
              aria-label="User menu"
            >
              <div
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full border",
                  isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white",
                )}
              >
                <UserCircle className="h-6 w-6 text-slate-500" aria-hidden="true" />
              </div>
              <div className="hidden min-w-0 text-left md:block">
                <p className="truncate text-sm font-bold">{appInfo.user.name}</p>
                <p className="truncate text-xs font-semibold text-slate-500">SUCOFINDO</p>
                <p className="truncate text-xs text-slate-500">Superadmin</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500" aria-hidden="true" />
            </button>

            {userOpen ? (
              <div className={cn("absolute right-0 top-[calc(100%+8px)] w-64 rounded-2xl p-2", dropdownPanelClass)}>
                <div className="px-3 py-3">
                  <p className="font-bold">{appInfo.user.name}</p>
                  <p className="text-sm text-slate-500">SUCOFINDO - Superadmin</p>
                </div>
                <button
                  type="button"
                  className={cn("flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold", dropdownHoverClass)}
                  onClick={() => navigateFromUserMenu("/profile")}
                >
                  <UserCircle className="h-4 w-4" />
                  Profile
                </button>
                <button
                  type="button"
                  className={cn("flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold", dropdownHoverClass)}
                  onClick={() => navigateFromUserMenu("/helpdesk")}
                >
                  <HelpCircle className="h-4 w-4" />
                  Helpdesk
                </button>
                <button
                  type="button"
                  className={cn("flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold", dropdownHoverClass)}
                  onClick={() => navigateFromUserMenu("/account-settings")}
                >
                  <Settings className="h-4 w-4" />
                  Account Settings
                </button>
                <button
                  type="button"
                  className={cn("flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50")}
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
