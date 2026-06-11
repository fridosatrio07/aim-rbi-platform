import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Inspection History",
  description:
    "Historical inspection archive across sites, assets, methods, findings, reports, certificates, and inspectors.",
};

export default function InspectionHistoryPage() {
  return (
    <ModulePlaceholder
      title="Inspection History"
      description="Historical inspection archive across sites, assets, methods, findings, reports, certificates, and inspectors."
    />
  );
}