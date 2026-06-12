import type { Metadata } from "next";

import { AssessmentsPageContent } from "@/features/integrity-rbi/components/assessments-page-content";

export const metadata: Metadata = {
  title: "Assessments",
};

export default function RBIAssessmentsPage() {
  return <AssessmentsPageContent />;
}
