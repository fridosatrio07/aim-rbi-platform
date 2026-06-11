import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Inspection Management",
  description:
    "Inspection overview for plan, schedule, workpack, execution, findings, reports, and historical inspection records.",
};

export default function InspectionManagementPage() {
  return (
    <ModulePlaceholder
      title="Inspection Management"
      description="Inspection overview for plan, schedule, workpack, execution, findings, reports, and historical inspection records."
    />
  );
}