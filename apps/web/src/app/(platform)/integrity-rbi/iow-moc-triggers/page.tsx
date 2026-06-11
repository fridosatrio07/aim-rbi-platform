import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "IOW & MOC Triggers",
  description:
    "Integrity Operating Window and Management of Change trigger register linked to RBI impact screening and revalidation.",
};

export default function IOWMOCTriggersPage() {
  return (
    <ModulePlaceholder
      title="IOW & MOC Triggers"
      description="Integrity Operating Window and Management of Change trigger register linked to RBI impact screening and revalidation."
    />
  );
}