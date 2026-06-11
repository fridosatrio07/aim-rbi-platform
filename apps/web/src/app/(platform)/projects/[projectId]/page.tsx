import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Project Detail",
  description:
    "Project-level overview for scope, progress, data completeness, owner action, SUCOFINDO validation, and handover readiness.",
};

export default function ProjectDetailPage() {
  return (
    <ModulePlaceholder
      title="Project Detail"
      description="Project-level overview for scope, progress, data completeness, owner action, SUCOFINDO validation, and handover readiness."
    />
  );
}