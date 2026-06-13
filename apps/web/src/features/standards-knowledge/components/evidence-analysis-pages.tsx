"use client";

import { ClipboardCheck, FlaskConical } from "lucide-react";

import {
  BreadcrumbTrail,
  CompactPageHeader,
  CompactPageShell,
  DenseSection,
  StatusBadge,
  ToolbarButton,
} from "@/components/data-display/compact-primitives";

import { AnalysisLimitationPanel } from "./analysis-limitation-panel";
import { CitationReferenceCard } from "./citation-reference-card";
import { EvidenceRequirementMatrix } from "./evidence-requirement-matrix";
import { HumanReviewGateCard } from "./human-review-gate-card";
import { EVIDENCE_REQUIREMENTS, SANDBOX_OUTPUTS } from "../services/standards-knowledge-data";

const breadcrumb = [{ href: "/administration", label: "Administration" }, { href: "/administration/standards", label: "Standards Knowledge" }];

export function EvidenceRequirementsPageContent() {
  return (
    <CompactPageShell>
      <CompactPageHeader
        icon={ClipboardCheck}
        title="Evidence Requirements"
        description="Define required document and evidence types by equipment class and analysis type."
        breadcrumb={<BreadcrumbTrail items={[...breadcrumb, { label: "Evidence Requirements" }]} />}
        action={<ToolbarButton href="/administration/standards">Back to Standards</ToolbarButton>}
      />
      <EvidenceRequirementMatrix items={EVIDENCE_REQUIREMENTS} />
    </CompactPageShell>
  );
}

export function AnalysisSandboxPageContent() {
  return (
    <CompactPageShell>
      <CompactPageHeader
        icon={FlaskConical}
        title="Analysis Sandbox"
        description="Test applicability, completeness, corrosion rate, due date, preliminary risk, draft inspection planning, and evidence pack outputs with review gates visible."
        breadcrumb={<BreadcrumbTrail items={[...breadcrumb, { label: "Analysis Sandbox" }]} />}
        action={<ToolbarButton href="/administration/standards">Back to Standards</ToolbarButton>}
      />
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-3">
          <DenseSection title="Sandbox Outputs" eyebrow="Assistive only">
            <div className="grid gap-3">
              {SANDBOX_OUTPUTS.map((output) => (
                <div key={output.id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-black text-slate-950 dark:text-white">{output.title}</h2>
                    <StatusBadge label={output.status.replace(/_/g, " ")} tone={output.status === "requires_engineer_review" ? "orange" : "blue"} />
                  </div>
                  <p className="mt-2 text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">Input basis</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {output.inputBasis.map((basis) => <StatusBadge key={basis} label={basis} tone="slate" />)}
                  </div>
                  <AnalysisLimitationPanel limitation={output.limitationStatement} warnings={output.warnings} />
                  <CitationReferenceCard citations={output.citations} />
                </div>
              ))}
            </div>
          </DenseSection>
        </div>
        <div className="space-y-3">
          <HumanReviewGateCard requiredRole="engineer / SME / regulatory" />
          <DenseSection title="Blocked Final Outputs" eyebrow="Authority boundary">
            <ul className="space-y-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
              <li>No automatic safe, fit-for-service, fit-for-operation, or layak operasi declaration.</li>
              <li>No automatic extension beyond statutory, owner, or regulator limits.</li>
              <li>No final FFS/RLA/PLO/certificate readiness without human review.</li>
              <li>No automatic repair, alteration, rerating, or risk acceptance approval.</li>
            </ul>
          </DenseSection>
        </div>
      </div>
    </CompactPageShell>
  );
}
