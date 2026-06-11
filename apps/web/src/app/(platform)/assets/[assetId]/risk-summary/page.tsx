import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Asset Risk Summary",
  description:
    "Latest RBI result, PoF, CoF, risk category, risk driver, inspection due date, mitigation impact, and data quality.",
};

export default function AssetRiskSummaryPage() {
  return (
    <ModulePlaceholder
      title="Asset Risk Summary"
      description="Latest RBI result, PoF, CoF, risk category, risk driver, inspection due date, mitigation impact, and data quality."
    />
  );
}