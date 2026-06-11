import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Helpdesk",
  description:
    "Helpdesk overview for tickets, SLA, support categories, platform issues, service requests, and knowledge base access.",
};

export default function HelpdeskPage() {
  return (
    <ModulePlaceholder
      title="Helpdesk"
      description="Helpdesk overview for tickets, SLA, support categories, platform issues, service requests, and knowledge base access."
    />
  );
}