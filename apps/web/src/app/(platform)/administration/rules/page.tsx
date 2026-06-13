import type { Metadata } from "next";

import { RulesListPageContent } from "@/features/standards-knowledge/components/rules-pages";

export const metadata: Metadata = {
  title: "Rules",
};

export default function RulesPage() {
  return <RulesListPageContent />;
}
