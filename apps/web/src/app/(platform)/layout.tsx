import type { ReactNode } from "react";

import { AppLayout } from "@/components/layout/app-layout";

export default function PlatformLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <AppLayout>{children}</AppLayout>;
}