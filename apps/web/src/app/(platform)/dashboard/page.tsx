import type { Metadata } from "next";

import { PlaceholderModulePage } from "@/components/layout/placeholder-module-page";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard overview for SUCOFINDO Asset Integrity Management Platform.",
};

export default function DashboardPage() {
  return <PlaceholderModulePage title="Dashboard" route="/dashboard" />;
}