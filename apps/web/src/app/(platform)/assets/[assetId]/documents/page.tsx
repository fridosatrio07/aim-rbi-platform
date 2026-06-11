import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Asset Documents",
  description:
    "Asset-linked design, inspection, RBI, compliance, operation, RLA/FFS, and other controlled documents.",
};

export default function AssetDocumentsPage() {
  return (
    <ModulePlaceholder
      title="Asset Documents"
      description="Asset-linked design, inspection, RBI, compliance, operation, RLA/FFS, and other controlled documents."
    />
  );
}