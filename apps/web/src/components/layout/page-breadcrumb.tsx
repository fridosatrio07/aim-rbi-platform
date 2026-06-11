import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

import { cn } from "@/lib/utils";

export interface PageBreadcrumbItem {
  label: string;
  href?: string;
}

export function PageBreadcrumb({ items }: { items: PageBreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400">
      <Link href="/dashboard" prefetch={false} className="flex items-center gap-1 rounded text-slate-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-300" aria-label="Dashboard">
        <Home className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
      {items.length ? <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
      {items.map((item, index) => {
        const active = index === items.length - 1;
        const content = <span className={cn("truncate", active && "text-blue-700 dark:text-blue-300")}>{item.label}</span>;

        return (
          <span key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1">
            {item.href && !active ? (
              <Link href={item.href} prefetch={false} className="min-w-0 truncate hover:text-blue-700 dark:hover:text-blue-300">
                {item.label}
              </Link>
            ) : (
              content
            )}
            {!active ? <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
          </span>
        );
      })}
    </nav>
  );
}
