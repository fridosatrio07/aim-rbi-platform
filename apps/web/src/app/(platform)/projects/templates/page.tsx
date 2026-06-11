import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Project Templates",
  description:
    "Reusable templates for asset registry, RBI assessment, inspection campaign, compliance mapping, certification support, and full AIM implementation.",
};

export default function ProjectTemplatesPage() {
  return (
    <ModulePlaceholder
      title="Project Templates"
      description="Reusable templates for asset registry, RBI assessment, inspection campaign, compliance mapping, certification support, and full AIM implementation."
    />
  );
}