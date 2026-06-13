import type { Metadata } from "next";

import { StandardsListPageContent } from "@/features/standards-knowledge/components/standards-pages";

export const metadata: Metadata = {
  title: "Standards & Regulatory Knowledge",
};

export default function StandardsKnowledgePage() {
  return <StandardsListPageContent />;
}
