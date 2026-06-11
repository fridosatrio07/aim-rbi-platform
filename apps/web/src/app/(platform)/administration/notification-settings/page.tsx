import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Notification Settings",
  description:
    "Configure notification rules for inspection due, certificate expiry, RFI overdue, action overdue, RBI revalidation due, and data validation.",
};

export default function NotificationSettingsPage() {
  return (
    <ModulePlaceholder
      title="Notification Settings"
      description="Configure notification rules for inspection due, certificate expiry, RFI overdue, action overdue, RBI revalidation due, and data validation."
    />
  );
}