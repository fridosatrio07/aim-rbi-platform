"use client";

import { useState } from "react";
import {
  Bell,
  Building2,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  UserCircle,
} from "lucide-react";
import type { AppInfo } from "@/lib/app-info";
import type { AppTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface TopbarProps {
  appInfo: AppInfo;
  theme: AppTheme;
  onMobileMenuClick?: () => void;
  onThemeToggle: () => void;
}

const PROJECT_OPTIONS = [
  "PT Nusantara Geothermal Energy - Kamojang Unit 3",
  "PT Energi Hulu Indonesia - Subang Gas Processing Facility",
  "PT Refinery Asset Operator - North Field Production Station",
];

const NOTIFICATIONS = [
  "Overdue inspection detected",
  "Certificate expiring soon",
  "High risk anomaly updated",
];

export function Topbar({
  appInfo,
  theme,
  onMobileMenuClick,
  onThemeToggle,
}: TopbarProps) {
  const [selectedProject, setSelectedProject] = useState(appInfo.projectName);
  const [projectOpen, setProjectOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const isDark = theme === "dark";

  const dropdownPanelClass = cn(
    "absolute right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border shadow-[0_18px_45px_rgba(15,23,42,0.22)]",
    isDark ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-800",
  );

  const dropdownHoverClass = isDark
    ? "hover:bg-slate-800 hover:text-blue-200"
    : "hover:bg-blue-50 hover:text-blue-700";

  return (
    <header className="aim-top-gradient sticky top-0 z-20 h-[116px] border-b border-white/10">
      <div className="flex h-full items-center gap-5 px-6 lg:px-8">
        <button
          type="button"
          onClick={onMobileMenuClick}
          className="grid h-11 w-11 place-items-center rounded-xl border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/15 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden min-w-0 flex-1 lg:block" />

        <div className="relative min-w-0 flex-1 lg:max-w-[520px]">
          <button
            type="button"
            onClick={() => {
              setProjectOpen((current) => !current);
              setNotificationOpen(false);
              setUserOpen(false);
            }}
            aria-expanded={projectOpen}
            aria-label={`Project / Site: ${selectedProject}`}
            className="flex h-[68px] w-full items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 text-left text-white shadow-sm backdrop-blur transition-colors hover:bg-white/15"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/10 text-blue-100">
              <Building2 className="h-6 w-6" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-bold uppercase tracking-[0.16em] text-blue-100">
                Project / Site
              </div>
              <div className="truncate text-[18px] font-extrabold leading-6 text-white">
                {selectedProject}
              </div>
            </div>

            <ChevronDown className="h-5 w-5 shrink-0 text-blue-100" />
          </button>

          {projectOpen ? (
            <div className={cn(dropdownPanelClass, "w-full")}>
              {PROJECT_OPTIONS.map((project) => (
                <button
                  key={project}
                  type="button"
                  onClick={() => {
                    setSelectedProject(project);
                    setProjectOpen(false);
                  }}
                  className={cn("block w-full px-4 py-3 text-left text-sm transition-colors", dropdownHoverClass)}
                >
                  {project}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="h-16 w-px bg-white/20" />

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationOpen((current) => !current);
              setProjectOpen(false);
              setUserOpen(false);
            }}
            aria-expanded={notificationOpen}
            aria-label="Notifications"
            className="relative grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-transparent text-white transition-colors hover:bg-white/10"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
              12
            </span>
          </button>

          {notificationOpen ? (
            <div className={cn(dropdownPanelClass, "w-72")}>
              <div className={cn("border-b px-4 py-3 text-sm font-semibold", isDark ? "border-slate-800" : "border-slate-200")}>
                Notifications
              </div>
              {NOTIFICATIONS.map((notification) => (
                <div
                  key={notification}
                  className={cn("px-4 py-3 text-sm transition-colors", dropdownHoverClass)}
                >
                  {notification}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onThemeToggle}
          className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-transparent text-white transition-colors hover:bg-white/10"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>

        <div className="h-16 w-px bg-white/20" />

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setUserOpen((current) => !current);
              setProjectOpen(false);
              setNotificationOpen(false);
            }}
            aria-expanded={userOpen}
            aria-label="User menu"
            className="flex h-[68px] items-center gap-4 rounded-xl px-2 text-white transition-colors hover:bg-white/10"
          >
            <div className="grid h-[58px] w-[58px] place-items-center rounded-full border-4 border-white bg-white/95 text-blue-700 shadow-sm">
              <UserCircle className="h-10 w-10" />
            </div>

            <div className="hidden min-w-[130px] text-left md:block">
              <div className="text-[18px] font-extrabold leading-6">{appInfo.user.name}</div>
              <div className="text-[13px] font-semibold leading-5 text-blue-100">
                {appInfo.user.organization}
              </div>
              <div className="text-[13px] font-semibold leading-5 text-blue-100">
                {appInfo.user.role}
              </div>
            </div>

            <ChevronDown className="hidden h-5 w-5 text-blue-100 md:block" />
          </button>

          {userOpen ? (
            <div className={cn(dropdownPanelClass, "w-64")}>
              <div className={cn("border-b px-4 py-3", isDark ? "border-slate-800" : "border-slate-200")}>
                <div className="text-sm font-semibold">{appInfo.user.name}</div>
                <div className="text-xs text-slate-500">
                  {appInfo.user.organization} - {appInfo.user.role}
                </div>
              </div>

              <button type="button" className={cn("flex w-full items-center gap-2 px-4 py-3 text-left text-sm", dropdownHoverClass)}>
                <UserCircle className="h-4 w-4" />
                Profile
              </button>
              <button type="button" className={cn("flex w-full items-center gap-2 px-4 py-3 text-left text-sm", dropdownHoverClass)}>
                <Settings className="h-4 w-4" />
                Account Settings
              </button>
              <button type="button" className={cn("flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600", dropdownHoverClass)}>
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}