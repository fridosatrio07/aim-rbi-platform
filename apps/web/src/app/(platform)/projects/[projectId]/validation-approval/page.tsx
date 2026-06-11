import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Data Validation & Approval",
  description:
    "Technical validation and owner approval workflow before extracted project data becomes validated asset registry data.",
};

export default function DataValidationApprovalPage() {
  return (
    <ModulePlaceholder
      title="Data Validation & Approval"
      description="Technical validation and owner approval workflow before extracted project data becomes validated asset registry data."
    />
  );
}