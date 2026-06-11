import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "RBI Assessment Basis",
  description:
    "Assessment identity, scope, methodology, plan period, risk criteria, boundaries, team assignment, and document basis.",
};

export default function RBIAssessmentBasisPage() {
  return (
    <ModulePlaceholder
      title="RBI Assessment Basis"
      description="Assessment identity, scope, methodology, plan period, risk criteria, boundaries, team assignment, and document basis."
    />
  );
}