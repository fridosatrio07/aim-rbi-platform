import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Action Tracker",
  description:
    "Operational action tracking board for corrective and preventive actions, assignments, status, due dates, evidence, and close-out.",
};

export default function ActionTrackerPage() {
  return (
    <ModulePlaceholder
      title="Action Tracker"
      description="Operational action tracking board for corrective and preventive actions, assignments, status, due dates, evidence, and close-out."
    />
  );
}