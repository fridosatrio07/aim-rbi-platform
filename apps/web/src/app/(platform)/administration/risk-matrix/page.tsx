import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Risk Matrix Configuration",
  description:
    "Configure PoF and CoF categories, risk colors, risk appetite thresholds, approval requirements, and risk matrix versions.",
};

export default function RiskMatrixConfigurationPage() {
  return (
    <ModulePlaceholder
      title="Risk Matrix Configuration"
      description="Configure PoF and CoF categories, risk colors, risk appetite thresholds, approval requirements, and risk matrix versions."
    />
  );
}