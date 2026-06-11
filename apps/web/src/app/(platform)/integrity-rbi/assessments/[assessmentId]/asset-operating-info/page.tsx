import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "RBI Asset & Operating Info",
  description:
    "Calculation snapshot of asset data, component/circuit data, design data, operating conditions, process fluid, and missing critical data.",
};

export default function RBIAssetOperatingInfoPage() {
  return (
    <ModulePlaceholder
      title="RBI Asset & Operating Info"
      description="Calculation snapshot of asset data, component/circuit data, design data, operating conditions, process fluid, and missing critical data."
    />
  );
}