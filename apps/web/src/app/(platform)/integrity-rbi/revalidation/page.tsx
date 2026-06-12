import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "RBI Update & Revalidation",
  description:
    "Time-based and event-based RBI update control triggered by inspection findings, IOW exceedance, MOC, repair, replacement, incident, or operating changes.",
};

export default function RBIUpdateRevalidationPage() {
  return (
    <ModulePlaceholder
      title="RBI Update & Revalidation"
      description="Time-based and event-based RBI update control triggered by inspection findings, IOW exceedance, MOC, repair, replacement, incident, or operating changes."
      parentLabel="Integrity / RBI"
      parentHref="/integrity-rbi"
    />
  );
}
