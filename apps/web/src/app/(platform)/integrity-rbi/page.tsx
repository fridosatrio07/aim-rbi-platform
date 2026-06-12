import type { Metadata } from "next";

import { IntegrityRbiOverviewPageContent } from "@/features/integrity-rbi/components/integrity-rbi-overview-page-content";

export const metadata: Metadata = {
  title: "Integrity / RBI Overview",
  description:
    "Risk-Based Inspection program overview covering RBI assessments, risk register, analytics, revalidation, IOW/MOC triggers, and methodology governance.",
};

export default function IntegrityRBIPage() {
  return <IntegrityRbiOverviewPageContent />;
}
