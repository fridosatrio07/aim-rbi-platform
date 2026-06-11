import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Approval Workflow",
  description:
    "Configure approval workflows for draft, technical review, owner review, approval, publication, and role assignment.",
};

export default function ApprovalWorkflowPage() {
  return (
    <ModulePlaceholder
      title="Approval Workflow"
      description="Configure approval workflows for draft, technical review, owner review, approval, publication, and role assignment."
    />
  );
}