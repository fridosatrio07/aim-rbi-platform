import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Inspection Plan",
  description:
    "Risk-based, regulatory-based, and fixed-interval inspection plan with method, coverage, due date, priority, and inspection basis.",
};

export default function InspectionPlanPage() {
  return (
    <ModulePlaceholder
      title="Inspection Plan"
      description="Risk-based, regulatory-based, and fixed-interval inspection plan with method, coverage, due date, priority, and inspection basis."
    />
  );
}