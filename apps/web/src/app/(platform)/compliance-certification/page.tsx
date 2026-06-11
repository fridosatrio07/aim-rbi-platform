import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Compliance & Certification",
  description:
    "Compliance overview for certificates, PLO/PLF, renewal status, regulatory gaps, evidence readiness, and high-priority compliance issues.",
};

export default function ComplianceCertificationPage() {
  return (
    <ModulePlaceholder
      title="Compliance & Certification"
      description="Compliance overview for certificates, PLO/PLF, renewal status, regulatory gaps, evidence readiness, and high-priority compliance issues."
    />
  );
}