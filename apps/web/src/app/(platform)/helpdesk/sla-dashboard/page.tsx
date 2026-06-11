import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "SLA Dashboard",
  description:
    "Helpdesk SLA performance dashboard for response time, resolution time, overdue tickets, reopened tickets, and team workload.",
};

export default function SLADashboardPage() {
  return (
    <ModulePlaceholder
      title="SLA Dashboard"
      description="Helpdesk SLA performance dashboard for response time, resolution time, overdue tickets, reopened tickets, and team workload."
    />
  );
}