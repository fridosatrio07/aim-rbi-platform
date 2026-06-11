import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Renewal Tracker",
  description:
    "Certificate and permit renewal timeline, evidence requirements, owner action, SUCOFINDO action, and submission status.",
};

export default function RenewalTrackerPage() {
  return (
    <ModulePlaceholder
      title="Renewal Tracker"
      description="Certificate and permit renewal timeline, evidence requirements, owner action, SUCOFINDO action, and submission status."
    />
  );
}