import type { Metadata } from "next";

import { PlaceholderModulePage } from "@/components/layout/placeholder-module-page";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Account settings workspace for SUCOFINDO Asset Integrity Management Platform.",
};

export default function AccountSettingsPage() {
  return <PlaceholderModulePage title="Account Settings" route="/account-settings" />;
}