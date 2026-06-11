import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Asset Detail",
  description:
    "Asset-level overview showing identity, hierarchy, integrity status, risk, inspection, certification, documents, and recent activity.",
};

export default function AssetDetailPage() {
  return (
    <ModulePlaceholder
      title="Asset Detail"
      description="Asset-level overview showing identity, hierarchy, integrity status, risk, inspection, certification, documents, and recent activity."
    />
  );
}