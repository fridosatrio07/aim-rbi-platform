import type { Metadata } from "next";

import { EvidenceRequirementsPageContent } from "@/features/standards-knowledge/components/evidence-analysis-pages";

export const metadata: Metadata = {
  title: "Evidence Requirements",
};

export default function EvidenceRequirementsPage() {
  return <EvidenceRequirementsPageContent />;
}
