import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Asset Bulk Import",
  description:
    "Spreadsheet or CMMS/EAM import workflow for bulk asset registry creation and update.",
};

export default function AssetBulkImportPage() {
  return (
    <ModulePlaceholder
      title="Asset Bulk Import"
      description="Spreadsheet or CMMS/EAM import workflow for bulk asset registry creation and update."
    />
  );
}