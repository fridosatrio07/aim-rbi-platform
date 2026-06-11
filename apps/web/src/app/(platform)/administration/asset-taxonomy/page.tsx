import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Asset Taxonomy Configuration",
  description:
    "Configure equipment taxonomy, component types, maintainable items, sector applicability, RBI applicability, inspection applicability, and certification applicability.",
};

export default function AssetTaxonomyConfigurationPage() {
  return (
    <ModulePlaceholder
      title="Asset Taxonomy Configuration"
      description="Configure equipment taxonomy, component types, maintainable items, sector applicability, RBI applicability, inspection applicability, and certification applicability."
    />
  );
}