import type { ProjectPhase, ProjectRiskProfile, ProjectStatus, ProjectTone } from "../types/projects-list.types";

export function clampPercent(value: number) {
  return Math.min(Math.max(Math.round(value), 0), 100);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function getToneTextClass(tone: ProjectTone) {
  switch (tone) {
    case "blue":
      return "text-blue-700 dark:text-blue-300";
    case "cyan":
      return "text-cyan-700 dark:text-cyan-300";
    case "teal":
      return "text-teal-700 dark:text-teal-300";
    case "emerald":
      return "text-emerald-700 dark:text-emerald-300";
    case "amber":
      return "text-amber-700 dark:text-amber-300";
    case "orange":
      return "text-orange-700 dark:text-orange-300";
    case "red":
      return "text-red-600 dark:text-red-300";
    case "violet":
      return "text-violet-700 dark:text-violet-300";
    default:
      return "text-slate-700 dark:text-slate-200";
  }
}

export function getToneIconClass(tone: ProjectTone) {
  switch (tone) {
    case "blue":
      return "border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200";
    case "cyan":
      return "border-cyan-100 bg-cyan-50 text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200";
    case "teal":
      return "border-teal-100 bg-teal-50 text-teal-700 dark:border-teal-500/20 dark:bg-teal-500/10 dark:text-teal-200";
    case "emerald":
      return "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200";
    case "amber":
      return "border-amber-100 bg-amber-50 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200";
    case "orange":
      return "border-orange-100 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200";
    case "red":
      return "border-red-100 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200";
    case "violet":
      return "border-violet-100 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";
  }
}

export function getToneBarClass(tone: ProjectTone) {
  switch (tone) {
    case "cyan":
      return "bg-cyan-500";
    case "teal":
      return "bg-teal-500";
    case "emerald":
      return "bg-emerald-500";
    case "amber":
      return "bg-amber-400";
    case "orange":
      return "bg-orange-500";
    case "red":
      return "bg-red-500";
    case "violet":
      return "bg-violet-500";
    case "slate":
      return "bg-slate-500";
    default:
      return "bg-blue-600";
  }
}

export function getStatusBadgeClass(status: ProjectStatus) {
  if (status === "Planning") {
    return "border-violet-200 bg-violet-100 text-violet-800 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200";
}

export function getPhaseBadgeClass(phase: ProjectPhase) {
  switch (phase) {
    case "RBI Detailed":
      return "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-200";
    case "Scoping":
      return "border-violet-200 bg-violet-100 text-violet-800 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200";
    case "Inspection":
      return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200";
    default:
      return "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200";
  }
}

export function getRiskTone(riskProfile: ProjectRiskProfile): ProjectTone {
  if (riskProfile === "High") return "red";
  if (riskProfile === "Medium-High") return "orange";

  return "amber";
}

export function getRiskDotClass(riskProfile: ProjectRiskProfile) {
  if (riskProfile === "High") return "bg-red-500";
  if (riskProfile === "Medium-High") return "bg-amber-500";

  return "bg-amber-400";
}
