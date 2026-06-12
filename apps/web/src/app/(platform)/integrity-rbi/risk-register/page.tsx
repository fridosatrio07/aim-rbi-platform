import type { Metadata } from "next";

import { RiskRegisterPageContent } from "@/features/integrity-rbi/components/risk-register-page-content";

export const metadata: Metadata = {
  title: "Risk Register",
  description:
    "Central RBI risk register for asset/component risk ranking, damage mechanisms, PoF, CoF, inspection plan, mitigation, and review status.",
};

export default function RiskRegisterPage() {
  return <RiskRegisterPageContent />;
}
