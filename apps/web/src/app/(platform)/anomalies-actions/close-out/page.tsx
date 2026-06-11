import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Corrective Action Close-out",
  description:
    "Close-out verification for recommendations and corrective actions, including evidence review, residual risk, and approval status.",
};

export default function CorrectiveActionCloseOutPage() {
  return (
    <ModulePlaceholder
      title="Corrective Action Close-out"
      description="Close-out verification for recommendations and corrective actions, including evidence review, residual risk, and approval status."
    />
  );
}