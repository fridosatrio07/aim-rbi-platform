import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Recommendation Detail",
  description:
    "Detailed recommendation page with technical basis, source evidence, expected risk reduction, responsible party, due date, and approval workflow.",
};

export default function RecommendationDetailPage() {
  return (
    <ModulePlaceholder
      title="Recommendation Detail"
      description="Detailed recommendation page with technical basis, source evidence, expected risk reduction, responsible party, due date, and approval workflow."
    />
  );
}