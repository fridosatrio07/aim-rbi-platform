import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Inspection Findings",
  description:
    "Inspection findings register linked to anomaly creation, recommendation assignment, RBI update, and close-out workflow.",
};

export default function InspectionFindingsPage() {
  return (
    <ModulePlaceholder
      title="Inspection Findings"
      description="Inspection findings register linked to anomaly creation, recommendation assignment, RBI update, and close-out workflow."
    />
  );
}