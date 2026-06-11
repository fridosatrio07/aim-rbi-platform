import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Methodology & Governance",
  description:
    "Read-only RBI methodology, API 580/API 581 basis, DMR procedure, risk matrix version, revalidation rules, and governance references.",
};

export default function MethodologyGovernancePage() {
  return (
    <ModulePlaceholder
      title="Methodology & Governance"
      description="Read-only RBI methodology, API 580/API 581 basis, DMR procedure, risk matrix version, revalidation rules, and governance references."
    />
  );
}