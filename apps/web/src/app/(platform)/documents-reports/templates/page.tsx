import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Document & Report Templates",
  description:
    "Template library for reports, inspection workpacks, evidence pack index, transmittals, and standardized deliverables.",
};

export default function DocumentReportTemplatesPage() {
  return (
    <ModulePlaceholder
      title="Document & Report Templates"
      description="Template library for reports, inspection workpacks, evidence pack index, transmittals, and standardized deliverables."
    />
  );
}