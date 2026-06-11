import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Asset Registry",
  description:
    "Validated asset master database for equipment hierarchy, datasheets, operating data, CML/TML, risk summary, documents, and certification.",
};

export default function AssetRegistryPage() {
  return (
    <ModulePlaceholder
      title="Asset Registry"
      description="Validated asset master database for equipment hierarchy, datasheets, operating data, CML/TML, risk summary, documents, and certification."
    />
  );
}