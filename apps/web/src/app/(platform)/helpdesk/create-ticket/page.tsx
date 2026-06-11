import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Create Ticket",
  description:
    "Ticket creation form for data issue, document issue, asset correction, RBI clarification, inspection scheduling, report revision, certification support, or platform issue.",
};

export default function CreateTicketPage() {
  return (
    <ModulePlaceholder
      title="Create Ticket"
      description="Ticket creation form for data issue, document issue, asset correction, RBI clarification, inspection scheduling, report revision, certification support, or platform issue."
    />
  );
}