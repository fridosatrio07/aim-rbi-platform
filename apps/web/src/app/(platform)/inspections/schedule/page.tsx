import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Inspection Schedule",
  description:
    "Inspection scheduling, field resource planning, inspector assignment, shutdown windows, access requirements, and schedule conflicts.",
};

export default function InspectionSchedulePage() {
  return (
    <ModulePlaceholder
      title="Inspection Schedule"
      description="Inspection scheduling, field resource planning, inspector assignment, shutdown windows, access requirements, and schedule conflicts."
    />
  );
}