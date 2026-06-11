import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Audit Trail",
  description:
    "System-wide audit trail for users, roles, modules, actions, objects, previous values, new values, approvals, and security logs.",
};

export default function AuditTrailPage() {
  return (
    <ModulePlaceholder
      title="Audit Trail"
      description="System-wide audit trail for users, roles, modules, actions, objects, previous values, new values, approvals, and security logs."
    />
  );
}