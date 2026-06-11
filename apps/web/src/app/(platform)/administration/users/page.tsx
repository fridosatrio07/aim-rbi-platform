import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "User Management",
  description:
    "Manage users, organizations, roles, client/site access, account status, MFA status, and activity.",
};

export default function UserManagementPage() {
  return (
    <ModulePlaceholder
      title="User Management"
      description="Manage users, organizations, roles, client/site access, account status, MFA status, and activity."
    />
  );
}