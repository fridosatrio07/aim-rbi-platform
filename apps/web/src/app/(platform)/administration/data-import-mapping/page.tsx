import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Data Import Mapping",
  description:
    "Configure import mapping profiles, source columns, target fields, validation rules, transformation rules, and sample data preview.",
};

export default function DataImportMappingPage() {
  return (
    <ModulePlaceholder
      title="Data Import Mapping"
      description="Configure import mapping profiles, source columns, target fields, validation rules, transformation rules, and sample data preview."
    />
  );
}