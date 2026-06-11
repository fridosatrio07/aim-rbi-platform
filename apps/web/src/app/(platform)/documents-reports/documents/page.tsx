import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Document Center",
  description:
    "Controlled document repository for design, inspection, RBI, compliance, operation, RLA/FFS, project, and evidence documents.",
};

export default function DocumentCenterPage() {
  return (
    <ModulePlaceholder
      title="Document Center"
      description="Controlled document repository for design, inspection, RBI, compliance, operation, RLA/FFS, project, and evidence documents."
    />
  );
}