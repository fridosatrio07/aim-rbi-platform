import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Anomaly Detail",
  description:
    "Detailed anomaly record with source evidence, defect type, severity, risk impact, recommendation, status, and close-out requirements.",
};

export default function AnomalyDetailPage() {
  return (
    <ModulePlaceholder
      title="Anomaly Detail"
      description="Detailed anomaly record with source evidence, defect type, severity, risk impact, recommendation, status, and close-out requirements."
    />
  );
}