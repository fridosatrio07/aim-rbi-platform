import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Evidence Pack Builder",
  description:
    "Wizard for building multi-document evidence packs for audit, certification, client review, regulator review, and project handover.",
};

export default function EvidencePackBuilderPage() {
  return (
    <ModulePlaceholder
      title="Evidence Pack Builder"
      description="Wizard for building multi-document evidence packs for audit, certification, client review, regulator review, and project handover."
    />
  );
}