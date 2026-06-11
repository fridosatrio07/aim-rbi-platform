"use client";

import type { ReactNode } from "react";

import { usePathname } from "next/navigation";

import { AppLayout } from "@/components/layout/app-layout";
import { isProtectedNavigationPath } from "@/lib/navigation-data";
import { getCurrentAppRoute, isFileProtocol } from "@/lib/static-navigation";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  const effectivePathname = isFileProtocol() ? getCurrentAppRoute() : pathname;

  if (!isProtectedNavigationPath(effectivePathname)) {
    return <>{children}</>;
  }

  return <AppLayout>{children}</AppLayout>;
}