import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Inspection Workpacks",
  description:
    "Field inspection workpack preparation, checklist, linked documents, CML/TML list, acceptance criteria, and readiness status.",
};

export default function InspectionWorkpacksPage() {
  return (
    <ModulePlaceholder
      title="Inspection Workpacks"
      description="Field inspection workpack preparation, checklist, linked documents, CML/TML list, acceptance criteria, and readiness status."
    />
  );
}