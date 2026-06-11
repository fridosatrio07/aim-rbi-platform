import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "System Logs",
  description:
    "System event logs and service health for frontend, APIs, database, storage, extraction service, and platform operations.",
};

export default function SystemLogsPage() {
  return (
    <ModulePlaceholder
      title="System Logs"
      description="System event logs and service health for frontend, APIs, database, storage, extraction service, and platform operations."
    />
  );
}