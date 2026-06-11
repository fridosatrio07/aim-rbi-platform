import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "CML/TML Thickness",
  description:
    "Thickness monitoring locations, historical readings, corrosion rate, remaining life, and alert status.",
};

export default function CMLTMLThicknessPage() {
  return (
    <ModulePlaceholder
      title="CML/TML Thickness"
      description="Thickness monitoring locations, historical readings, corrosion rate, remaining life, and alert status."
    />
  );
}