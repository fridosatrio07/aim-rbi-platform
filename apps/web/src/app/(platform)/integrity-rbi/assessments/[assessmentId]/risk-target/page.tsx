import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Risk & Target",
  description:
    "Risk result, risk matrix, iso-risk view, risk driver, risk appetite comparison, and management acceptance requirement.",
};

export default function RiskTargetPage() {
  return (
    <ModulePlaceholder
      title="Risk & Target"
      description="Risk result, risk matrix, iso-risk view, risk driver, risk appetite comparison, and management acceptance requirement."
    />
  );
}