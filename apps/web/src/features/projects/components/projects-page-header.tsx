import Link from "next/link";
import { FolderKanban } from "lucide-react";

export function ProjectsPageHeader() {
  return (
    <header className="min-w-0">
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
        <Link href="/projects" className="transition hover:text-blue-700 dark:hover:text-blue-200">
          Projects
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-slate-700 dark:text-slate-200">Project List</span>
      </nav>

      <div className="mt-3 flex min-w-0 items-center gap-2.5">
        <FolderKanban className="h-6 w-6 shrink-0 text-blue-700 dark:text-blue-300" aria-hidden="true" />
        <h1 className="truncate text-2xl font-black tracking-tight text-slate-950 dark:text-white">Projects</h1>
      </div>
      <p className="mt-1 text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
        Manage active AIM/RBI project portfolios, readiness, and delivery status across all facilities.
      </p>
    </header>
  );
}
