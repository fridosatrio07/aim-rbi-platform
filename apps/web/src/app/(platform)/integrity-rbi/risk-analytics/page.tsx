import type { Metadata } from "next";

import { RiskAnalyticsPageContent } from "@/features/integrity-rbi/components/risk-analytics-page-content";

export const metadata: Metadata = {
  title: "Risk Analytics",
  description:
    "Technical risk analytics dashboard for risk distribution, PoF/CoF matrix, risk drivers, mitigation effectiveness, inspection effectiveness, and data quality.",
};

export default function RiskAnalyticsPage() {
  return <RiskAnalyticsPageContent />;
}
