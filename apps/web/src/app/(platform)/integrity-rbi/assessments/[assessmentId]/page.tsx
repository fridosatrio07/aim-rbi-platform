import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "RBI Assessment Workspace",
  description:
    "Eight-step RBI assessment workspace covering basis, asset data, DMR, PoF, CoF, risk target, inspection plan, and acceptance.",
};

export default function RBIAssessmentWorkspacePage() {
  return (
    <ModulePlaceholder
      title="RBI Assessment Workspace"
      description="Eight-step RBI assessment workspace covering basis, asset data, DMR, PoF, CoF, risk target, inspection plan, and acceptance."
    />
  );
}