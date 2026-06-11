import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Asset Certification",
  description:
    "Asset-specific certification status, regulatory applicability, certificate validity, renewal history, and evidence requirements.",
};

export default function AssetCertificationPage() {
  return (
    <ModulePlaceholder
      title="Asset Certification"
      description="Asset-specific certification status, regulatory applicability, certificate validity, renewal history, and evidence requirements."
    />
  );
}