import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Compliance Evidence Pack",
  description:
    "Regulatory evidence pack builder for selected assets or facilities, including inspection reports, RBI reports, certificates, RLA/FFS, and approvals.",
};

export default function ComplianceEvidencePackPage() {
  return (
    <ModulePlaceholder
      title="Compliance Evidence Pack"
      description="Regulatory evidence pack builder for selected assets or facilities, including inspection reports, RBI reports, certificates, RLA/FFS, and approvals."
    />
  );
}