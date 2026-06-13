import type { Metadata } from "next";

import { StandardExtractionPageContent } from "@/features/standards-knowledge/components/standards-pages";

export const metadata: Metadata = {
  title: "Standard Extraction",
};

export default async function StandardExtractionPage({
  params,
}: {
  params: Promise<{ standardId: string }>;
}) {
  const { standardId } = await params;
  return <StandardExtractionPageContent standardId={standardId} />;
}
