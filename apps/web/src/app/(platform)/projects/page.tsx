import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Projects & Data Intake",
  description:
    "Project onboarding, scope definition, data request checklist, document upload, extraction staging, validation, and handover.",
};

export default function ProjectsDataIntakePage() {
  return (
    <ModulePlaceholder
      title="Projects & Data Intake"
      description="Project onboarding, scope definition, data request checklist, document upload, extraction staging, validation, and handover."
    />
  );
}