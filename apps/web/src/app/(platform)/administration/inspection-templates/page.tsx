import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Inspection Template Configuration",
  description:
    "Configure inspection templates, checklist items, report templates, equipment type applicability, methods, required photos, and version status.",
};

export default function InspectionTemplateConfigurationPage() {
  return (
    <ModulePlaceholder
      title="Inspection Template Configuration"
      description="Configure inspection templates, checklist items, report templates, equipment type applicability, methods, required photos, and version status."
    />
  );
}