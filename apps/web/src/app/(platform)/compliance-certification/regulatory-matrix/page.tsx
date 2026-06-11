import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Regulatory Matrix",
  description:
    "Mapping of regulations, standards, asset applicability, requirements, evidence, validity basis, responsible party, and status.",
};

export default function RegulatoryMatrixPage() {
  return (
    <ModulePlaceholder
      title="Regulatory Matrix"
      description="Mapping of regulations, standards, asset applicability, requirements, evidence, validity basis, responsible party, and status."
    />
  );
}