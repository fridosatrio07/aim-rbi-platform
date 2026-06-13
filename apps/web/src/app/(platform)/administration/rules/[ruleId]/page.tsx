import type { Metadata } from "next";

import { RuleDetailPageContent } from "@/features/standards-knowledge/components/rules-pages";

export const metadata: Metadata = {
  title: "Rule Detail",
};

export default async function RuleDetailPage({
  params,
}: {
  params: Promise<{ ruleId: string }>;
}) {
  const { ruleId } = await params;
  return <RuleDetailPageContent ruleId={ruleId} />;
}
