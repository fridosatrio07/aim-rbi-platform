import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Client, Site & Project Configuration",
  description:
    "Master configuration for clients, sites, facilities, units, systems, projects, defaults, and assigned SUCOFINDO branch.",
};

export default function ClientSiteProjectConfigurationPage() {
  return (
    <ModulePlaceholder
      title="Client, Site & Project Configuration"
      description="Master configuration for clients, sites, facilities, units, systems, projects, defaults, and assigned SUCOFINDO branch."
    />
  );
}