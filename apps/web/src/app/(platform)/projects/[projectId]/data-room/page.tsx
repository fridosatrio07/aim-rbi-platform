import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Document Upload & Data Room",
  description:
    "Controlled engineering data room for uploading and classifying project documents before extraction, validation, and registry publication.",
};

export default function DocumentUploadDataRoomPage() {
  return (
    <ModulePlaceholder
      title="Document Upload & Data Room"
      description="Controlled engineering data room for uploading and classifying project documents before extraction, validation, and registry publication."
    />
  );
}