import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Role & Permission",
  description:
    "Role and permission matrix for module access, actions, approvals, exports, and configuration rights.",
};

export default function RolePermissionPage() {
  return (
    <ModulePlaceholder
      title="Role & Permission"
      description="Role and permission matrix for module access, actions, approvals, exports, and configuration rights."
    />
  );
}