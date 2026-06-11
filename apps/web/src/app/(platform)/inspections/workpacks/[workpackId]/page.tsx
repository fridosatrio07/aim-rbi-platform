import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Inspection Workpack Detail",
  description:
    "Detailed inspection workpack with asset context, scope, readiness checklist, inspection method, document references, and field package generation.",
};

export default function InspectionWorkpackDetailPage() {
  return (
    <ModulePlaceholder
      title="Inspection Workpack Detail"
      description="Detailed inspection workpack with asset context, scope, readiness checklist, inspection method, document references, and field package generation."
    />
  );
}