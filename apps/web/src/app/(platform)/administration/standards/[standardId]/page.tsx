import type { Metadata } from "next";

import { StandardDetailPageContent } from "@/features/standards-knowledge/components/standards-pages";

export const metadata: Metadata = {
  title: "Standard Detail",
};

export default async function StandardDetailPage({
  params,
}: {
  params: Promise<{ standardId: string }>;
}) {
  const { standardId } = await params;
  return <StandardDetailPageContent standardId={standardId} />;
}
