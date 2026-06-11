import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Asset Change Log",
  description:
    "Audit trail of asset data changes, source documents, reviewers, approvals, and previous/current values.",
};

export default function AssetChangeLogPage() {
  return (
    <ModulePlaceholder
      title="Asset Change Log"
      description="Audit trail of asset data changes, source documents, reviewers, approvals, and previous/current values."
    />
  );
}