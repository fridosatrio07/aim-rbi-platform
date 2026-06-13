import type { Metadata } from "next";

import { ProjectsListPageContent } from "@/features/projects/components/projects-list-page-content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Manage AIM/RBI project portfolios, readiness, asset integrity status, and delivery risk across facilities.",
};

export default function ProjectsPage() {
  return <ProjectsListPageContent />;
}
