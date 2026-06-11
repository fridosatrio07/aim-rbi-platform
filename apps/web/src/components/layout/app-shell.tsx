"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { isProtectedNavigationPath } from "@/lib/navigation-data";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  if (!isProtectedNavigationPath(pathname)) {
    return <>{children}</>;
  }

  return <AppLayout>{children}</AppLayout>;
}