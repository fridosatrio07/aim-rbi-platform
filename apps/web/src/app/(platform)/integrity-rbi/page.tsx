import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Integrity & RBI",
  description:
    "Risk-Based Inspection program overview covering RBI assessments, risk register, analytics, revalidation, IOW/MOC triggers, and methodology governance.",
};

export default function IntegrityRBIPage() {
  return (
    <ModulePlaceholder
      title="Integrity & RBI"
      description="Risk-Based Inspection program overview covering RBI assessments, risk register, analytics, revalidation, IOW/MOC triggers, and methodology governance."
    />
  );
}