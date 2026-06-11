import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "FFS/RLA/RBI Triggered Actions",
  description:
    "Engineering-triggered actions requiring FFS, RLA, RBI update, IOW update, or additional engineering review.",
};

export default function FFSRLARBITriggeredActionsPage() {
  return (
    <ModulePlaceholder
      title="FFS/RLA/RBI Triggered Actions"
      description="Engineering-triggered actions requiring FFS, RLA, RBI update, IOW update, or additional engineering review."
    />
  );
}