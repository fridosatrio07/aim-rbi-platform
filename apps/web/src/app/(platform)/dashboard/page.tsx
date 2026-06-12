import type { Metadata } from "next";

import { DashboardPageContent } from "@/features/dashboard/components/dashboard-page-content";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard overview for SUCOFINDO Asset Integrity Management Platform.",
};

export default function DashboardPage() {
  return <DashboardPageContent />;
}
