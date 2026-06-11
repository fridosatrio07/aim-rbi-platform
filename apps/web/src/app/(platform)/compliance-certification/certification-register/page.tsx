import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Certification Register",
  description:
    "Register of certificates, PLO/PLF, permits, validity, regulatory references, renewal owners, evidence, and compliance status.",
};

export default function CertificationRegisterPage() {
  return (
    <ModulePlaceholder
      title="Certification Register"
      description="Register of certificates, PLO/PLF, permits, validity, regulatory references, renewal owners, evidence, and compliance status."
    />
  );
}