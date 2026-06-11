import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Ticket Detail",
  description:
    "Ticket detail with description, related asset/project, conversation timeline, attachments, assignment, resolution, and close-out.",
};

export default function TicketDetailPage() {
  return (
    <ModulePlaceholder
      title="Ticket Detail"
      description="Ticket detail with description, related asset/project, conversation timeline, attachments, assignment, resolution, and close-out."
    />
  );
}