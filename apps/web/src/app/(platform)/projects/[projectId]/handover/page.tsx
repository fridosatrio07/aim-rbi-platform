import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Handover to Registry & RBI",
  description:
    "Final gate for publishing validated data to Asset Registry, RBI assessment, inspection planning, and compliance modules.",
};

export default function HandoverToRegistryRBIPage() {
  return (
    <ModulePlaceholder
      title="Handover to Registry & RBI"
      description="Final gate for publishing validated data to Asset Registry, RBI assessment, inspection planning, and compliance modules."
    />
  );
}