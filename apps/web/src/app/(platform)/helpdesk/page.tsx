import type { Metadata } from "next";

import { PlaceholderModulePage } from "@/components/layout/placeholder-module-page";

export const metadata: Metadata = {
  title: "Helpdesk",
  description: "Helpdesk workspace for SUCOFINDO Asset Integrity Management Platform.",
};

export default function HelpdeskPage() {
  return (
    <PlaceholderModulePage
      title="Helpdesk"
      description="This module is prepared for future development."
      route="/helpdesk"
    />
  );
}