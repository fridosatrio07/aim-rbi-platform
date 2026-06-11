import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Risk Register",
  description:
    "Central RBI risk register for asset/component risk ranking, damage mechanisms, PoF, CoF, inspection plan, mitigation, and review status.",
};

export default function RiskRegisterPage() {
  return (
    <ModulePlaceholder
      title="Risk Register"
      description="Central RBI risk register for asset/component risk ranking, damage mechanisms, PoF, CoF, inspection plan, mitigation, and review status."
    />
  );
}