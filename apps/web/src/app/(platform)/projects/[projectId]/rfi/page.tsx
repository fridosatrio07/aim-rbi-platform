import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "RFI & Clarification",
  description:
    "Manage requests for information, clarification, owner responses, SUCOFINDO reviews, and overdue project data issues.",
};

export default function RFIClarificationPage() {
  return (
    <ModulePlaceholder
      title="RFI & Clarification"
      description="Manage requests for information, clarification, owner responses, SUCOFINDO reviews, and overdue project data issues."
    />
  );
}