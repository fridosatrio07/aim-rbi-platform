import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Administration",
  description:
    "Restricted administration control center for user management, permissions, taxonomy, risk matrix, methodology, regulatory library, workflows, and audit trail.",
};

export default function AdministrationPage() {
  return (
    <ModulePlaceholder
      title="Administration"
      description="Restricted administration control center for user management, permissions, taxonomy, risk matrix, methodology, regulatory library, workflows, and audit trail."
    />
  );
}