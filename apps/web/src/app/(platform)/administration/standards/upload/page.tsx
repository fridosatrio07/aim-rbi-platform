import type { Metadata } from "next";

import { StandardUploadPageContent } from "@/features/standards-knowledge/components/standards-pages";

export const metadata: Metadata = {
  title: "Upload Standard",
};

export default function StandardUploadPage() {
  return <StandardUploadPageContent />;
}
