import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Anomaly Register",
  description:
    "Central anomaly register for inspection findings, RBI issues, IOW/MOC triggers, incidents, risk impact, actions, and status.",
};

export default function AnomalyRegisterPage() {
  return (
    <ModulePlaceholder
      title="Anomaly Register"
      description="Central anomaly register for inspection findings, RBI issues, IOW/MOC triggers, incidents, risk impact, actions, and status."
    />
  );
}