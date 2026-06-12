import type { Metadata } from "next";

import { PlaceholderModulePage } from "@/components/layout/placeholder-module-page";

export const metadata: Metadata = {
  title: "Profile",
  description: "User profile workspace for SUCOFINDO Asset Integrity Management Platform.",
};

export default function ProfilePage() {
  return <PlaceholderModulePage title="Profile" route="/profile" />;
}