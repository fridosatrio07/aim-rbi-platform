import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PageBreadcrumbItem {
  label: string;
  href?: string;
}

export function PageBreadcrumb({
  items,
  dark = false,
}: {
  items: PageBreadcrumbItem[];
  dark?: boolean;
}) {
  return (
    <nav className="flex min-w-0 items-center gap-1 text-xs font-medium" aria-label="Breadcrumb">
      <Link
        href="/dashboard"
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors",
          dark ? "text-slate-400 hover:text-blue-200" : "text-slate-500 hover:text-blue-700",
        )}
      >
        <Home className="h-3.5 w-3.5" />
        Home
      </Link>

      {items.length ? (
        <ChevronRight className={cn("h-3.5 w-3.5", dark ? "text-slate-600" : "text-slate-300")} />
      ) : null}

      {items.map((item, index) => {
        const active = index === items.length - 1;

        return (
          <div key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1">
            {item.href && !active ? (
              <Link
                href={item.href}
                className={cn(
                  "truncate rounded-md px-1.5 py-1 transition-colors",
                  dark ? "text-slate-400 hover:text-blue-200" : "text-slate-500 hover:text-blue-700",
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn("truncate px-1.5 py-1", dark ? "text-slate-200" : "text-slate-700")}>
                {item.label}
              </span>
            )}

            {!active ? (
              <ChevronRight className={cn("h-3.5 w-3.5", dark ? "text-slate-600" : "text-slate-300")} />
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}