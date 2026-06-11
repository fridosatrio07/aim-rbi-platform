import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Asset Datasheet",
  description:
    "Validated design, construction, mechanical, material, and nameplate data for selected asset.",
};

export default function AssetDatasheetPage() {
  return (
    <ModulePlaceholder
      title="Asset Datasheet"
      description="Validated design, construction, mechanical, material, and nameplate data for selected asset."
    />
  );
}