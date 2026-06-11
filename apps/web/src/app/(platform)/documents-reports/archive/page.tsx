import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Archive",
  description:
    "Archive for historical documents, superseded reports, retained project records, and controlled restoration.",
};

export default function ArchivePage() {
  return (
    <ModulePlaceholder
      title="Archive"
      description="Archive for historical documents, superseded reports, retained project records, and controlled restoration."
    />
  );
}