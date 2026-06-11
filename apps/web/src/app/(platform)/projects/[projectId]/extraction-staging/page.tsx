import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Data Extraction Staging",
  description:
    "Review extracted data from uploaded documents before validation and publication to Asset Registry.",
};

export default function DataExtractionStagingPage() {
  return (
    <ModulePlaceholder
      title="Data Extraction Staging"
      description="Review extracted data from uploaded documents before validation and publication to Asset Registry."
    />
  );
}