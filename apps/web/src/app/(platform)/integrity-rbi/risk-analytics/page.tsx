import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Risk Analytics",
  description:
    "Technical risk analytics dashboard for risk distribution, PoF/CoF matrix, risk drivers, mitigation effectiveness, inspection effectiveness, and data quality.",
};

export default function RiskAnalyticsPage() {
  return (
    <ModulePlaceholder
      title="Risk Analytics"
      description="Technical risk analytics dashboard for risk distribution, PoF/CoF matrix, risk drivers, mitigation effectiveness, inspection effectiveness, and data quality."
    />
  );
}