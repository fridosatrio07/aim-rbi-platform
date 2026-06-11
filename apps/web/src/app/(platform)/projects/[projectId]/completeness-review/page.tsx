import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Completeness Review",
  description:
    "Assess Asset Registry readiness, RBI readiness, inspection planning readiness, and compliance readiness based on critical data completeness.",
};

export default function CompletenessReviewPage() {
  return (
    <ModulePlaceholder
      title="Completeness Review"
      description="Assess Asset Registry readiness, RBI readiness, inspection planning readiness, and compliance readiness based on critical data completeness."
    />
  );
}