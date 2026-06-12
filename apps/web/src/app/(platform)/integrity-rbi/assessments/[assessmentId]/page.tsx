import type { Metadata } from "next";

import { AssessmentDetailPageContent } from "@/features/integrity-rbi/components/assessment-detail-page-content";

export const metadata: Metadata = {
  title: "RBI Assessment Workspace",
};

export default function RBIAssessmentWorkspacePage() {
  return <AssessmentDetailPageContent />;
}
