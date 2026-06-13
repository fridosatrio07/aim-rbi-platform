import type { Metadata } from "next";

import { StandardRequirementsPageContent } from "@/features/standards-knowledge/components/standards-pages";

export const metadata: Metadata = {
  title: "Requirement Review",
};

export default async function StandardRequirementsPage({
  params,
}: {
  params: Promise<{ standardId: string }>;
}) {
  const { standardId } = await params;
  return <StandardRequirementsPageContent standardId={standardId} />;
}
