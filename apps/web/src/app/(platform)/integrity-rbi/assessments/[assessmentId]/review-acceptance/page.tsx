import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "RBI Review & Acceptance",
  description:
    "Final RBI assessment review, assumption register, data quality summary, inspection plan, mitigation action, approval, and owner acceptance.",
};

export default function RBIReviewAcceptancePage() {
  return (
    <ModulePlaceholder
      title="RBI Review & Acceptance"
      description="Final RBI assessment review, assumption register, data quality summary, inspection plan, mitigation action, approval, and owner acceptance."
    />
  );
}