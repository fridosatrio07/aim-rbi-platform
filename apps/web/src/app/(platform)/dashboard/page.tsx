import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: {
    absolute: "Assets Integrity Management Platform | SUCOFINDO",
  },
  description:
    "Portfolio dashboard for asset integrity, RBI exposure, inspection status, certification, open actions, and data quality.",
};

export default function AssetsIntegrityManagementPlatformSUCOFINDOPage() {
  return (
    <ModulePlaceholder
      title="Assets Integrity Management Platform | SUCOFINDO"
      description="Portfolio dashboard for asset integrity, RBI exposure, inspection status, certification, open actions, and data quality."
    />
  );
}