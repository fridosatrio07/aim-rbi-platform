import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Asset Operating Data",
  description:
    "Operating envelope, process parameters, historical readings, IOW linkage, and validated operating data snapshots.",
};

export default function AssetOperatingDataPage() {
  return (
    <ModulePlaceholder
      title="Asset Operating Data"
      description="Operating envelope, process parameters, historical readings, IOW linkage, and validated operating data snapshots."
    />
  );
}