import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Asset Inspection History",
  description:
    "Asset-specific inspection events, methods, findings, reports, effectiveness, and follow-up recommendations.",
};

export default function AssetInspectionHistoryPage() {
  return (
    <ModulePlaceholder
      title="Asset Inspection History"
      description="Asset-specific inspection events, methods, findings, reports, effectiveness, and follow-up recommendations."
    />
  );
}