import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Report Center",
  description:
    "Generated report center for asset register, data completeness, RBI, risk register, inspection plan, anomaly, certification, compliance, and executive reports.",
};

export default function ReportCenterPage() {
  return (
    <ModulePlaceholder
      title="Report Center"
      description="Generated report center for asset register, data completeness, RBI, risk register, inspection plan, anomaly, certification, compliance, and executive reports."
    />
  );
}