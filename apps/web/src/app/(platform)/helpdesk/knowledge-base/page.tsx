import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Knowledge Base",
  description:
    "User guidance and FAQ for getting started, data upload, Asset Registry, RBI workflow, Inspection Management, Certification, Reports, and troubleshooting.",
};

export default function KnowledgeBasePage() {
  return (
    <ModulePlaceholder
      title="Knowledge Base"
      description="User guidance and FAQ for getting started, data upload, Asset Registry, RBI workflow, Inspection Management, Certification, Reports, and troubleshooting."
    />
  );
}