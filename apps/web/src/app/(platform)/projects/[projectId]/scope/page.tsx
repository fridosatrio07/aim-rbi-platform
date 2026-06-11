import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Scope & Asset Selection",
  description:
    "Define project scope by selecting facilities, units, systems, equipment, and assets included in registry, RBI, inspection, or certification workflows.",
};

export default function ScopeAssetSelectionPage() {
  return (
    <ModulePlaceholder
      title="Scope & Asset Selection"
      description="Define project scope by selecting facilities, units, systems, equipment, and assets included in registry, RBI, inspection, or certification workflows."
    />
  );
}