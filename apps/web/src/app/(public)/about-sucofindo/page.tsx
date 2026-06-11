import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/app-layout";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "About SUCOFINDO",
  description:
    "Company and service profile for SUCOFINDO Asset Integrity Management services.",
};

export default function AboutSucofindoPage() {
  return (
    <AppLayout>
      <ModulePlaceholder
        title="About SUCOFINDO"
        parentLabel="Company Profile"
        route="/about-sucofindo"
        description="SUCOFINDO company profile, TIC service scope, Asset Integrity Management capability, Risk-Based Inspection methodology, inspection and NDT capability, RLA/reengineering capability, PLO/PLF support, and contact information."
      />
    </AppLayout>
  );
}