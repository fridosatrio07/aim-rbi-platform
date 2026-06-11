import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "CoF Evaluation",
  description:
    "Consequence of Failure evaluation based on fluid, inventory, release scenario, isolation, detection, mitigation, safety, environment, and financial impact.",
};

export default function CoFEvaluationPage() {
  return (
    <ModulePlaceholder
      title="CoF Evaluation"
      description="Consequence of Failure evaluation based on fluid, inventory, release scenario, isolation, detection, mitigation, safety, environment, and financial impact."
    />
  );
}