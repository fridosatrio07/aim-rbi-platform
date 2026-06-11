import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "FFS & RLA Interface",
  description:
    "Interface for Fitness-for-Service and Residual Life Assessment triggers, studies, remaining life, operating limitations, and RBI recalculation.",
};

export default function FFSRLAInterfacePage() {
  return (
    <ModulePlaceholder
      title="FFS & RLA Interface"
      description="Interface for Fitness-for-Service and Residual Life Assessment triggers, studies, remaining life, operating limitations, and RBI recalculation."
    />
  );
}