import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "RBI Methodology Configuration",
  description:
    "Configure API 580/API 581 program settings, DMR library, inspection effectiveness library, revalidation rules, and assumption rules.",
};

export default function RBIMethodologyConfigurationPage() {
  return (
    <ModulePlaceholder
      title="RBI Methodology Configuration"
      description="Configure API 580/API 581 program settings, DMR library, inspection effectiveness library, revalidation rules, and assumption rules."
    />
  );
}