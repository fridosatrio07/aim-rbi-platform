import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Ticket List",
  description:
    "Support ticket list with category, priority, status, related project/asset, assigned team, SLA due, and last update.",
};

export default function TicketListPage() {
  return (
    <ModulePlaceholder
      title="Ticket List"
      description="Support ticket list with category, priority, status, related project/asset, assigned team, SLA due, and last update."
    />
  );
}