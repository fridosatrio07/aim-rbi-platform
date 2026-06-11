import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Inspection Detail",
  description:
    "Inspection result capture for visual inspection, NDE, thickness readings, photos, findings, recommendations, and report generation.",
};

export default function InspectionDetailPage() {
  return (
    <ModulePlaceholder
      title="Inspection Detail"
      description="Inspection result capture for visual inspection, NDE, thickness readings, photos, findings, recommendations, and report generation."
    />
  );
}