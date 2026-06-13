import type { Metadata } from "next";

import { AnalysisSandboxPageContent } from "@/features/standards-knowledge/components/evidence-analysis-pages";

export const metadata: Metadata = {
  title: "Analysis Sandbox",
};

export default function AnalysisSandboxPage() {
  return <AnalysisSandboxPageContent />;
}
