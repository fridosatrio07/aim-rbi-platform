import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "RBI Assessments",
  description:
    "List and status of RBI assessments across projects, sites, units, equipment, and components.",
};

export default function RBIAssessmentsPage() {
  return (
    <ModulePlaceholder
      title="RBI Assessments"
      description="List and status of RBI assessments across projects, sites, units, equipment, and components."
    />
  );
}