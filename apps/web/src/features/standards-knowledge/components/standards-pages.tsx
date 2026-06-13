"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpenCheck, FileSearch, Scale, UploadCloud } from "lucide-react";

import {
  BreadcrumbTrail,
  CompactKpiCard,
  CompactKpiStrip,
  CompactPageHeader,
  CompactPageShell,
  DenseSection,
  DenseTable,
  DenseTableCell,
  DenseTableHeadCell,
  DenseTableHeader,
  DenseTableRow,
  FilterSelect,
  FilterToolbar,
  SearchInput,
  StatusBadge,
  ToolbarButton,
} from "@/components/data-display/compact-primitives";

import { AuditTrailPanel } from "./audit-trail-panel";
import { CitationReferenceCard } from "./citation-reference-card";
import { HumanReviewGateCard } from "./human-review-gate-card";
import { ParsingJobTimeline } from "./parsing-job-timeline";
import { RequirementReviewTable } from "./requirement-review-table";
import { StandardMetadataForm } from "./standard-metadata-form";
import { StandardStatusBadge } from "./status-badges";
import { StandardUploadDropzone } from "./standard-upload-dropzone";
import {
  AUDIT_EVENTS,
  PARSED_CHUNKS,
  PARSING_TIMELINE,
  REQUIREMENTS,
  RULES,
  STANDARDS_LIBRARY,
  getRequirementsByStandard,
  getStandardById,
} from "../services/standards-knowledge-data";

const breadcrumb = [{ href: "/administration", label: "Administration" }, { label: "Standards Knowledge" }];

export function StandardsListPageContent() {
  const [search, setSearch] = useState("");
  const [publisher, setPublisher] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const normalizedSearch = search.toLowerCase();
    return STANDARDS_LIBRARY.filter((standard) => {
      const matchesSearch = `${standard.code} ${standard.title}`.toLowerCase().includes(normalizedSearch);
      const matchesPublisher = publisher === "all" || standard.publisher === publisher;
      const matchesStatus = status === "all" || standard.status === status;
      return matchesSearch && matchesPublisher && matchesStatus;
    });
  }, [publisher, search, status]);

  return (
    <CompactPageShell>
      <CompactPageHeader
        icon={BookOpenCheck}
        title="Standards & Regulatory Knowledge"
        description="Controlled metadata, private ingestion, draft extraction, SME review, approved rules, and traceable decision-support outputs."
        breadcrumb={<BreadcrumbTrail items={breadcrumb} />}
        action={<ToolbarButton href="/administration/standards/upload" variant="primary">Upload / Register</ToolbarButton>}
      />

      <CompactKpiStrip>
        <CompactKpiCard icon={BookOpenCheck} label="Standards" value={STANDARDS_LIBRARY.length} delta="metadata placeholders only" />
        <CompactKpiCard icon={Scale} label="Active Rules" value={RULES.filter((rule) => rule.status === "active").length} delta="draft-only guarded" tone="emerald" />
        <CompactKpiCard icon={FileSearch} label="Draft Requirements" value={REQUIREMENTS.length} delta="human review required" tone="violet" />
        <CompactKpiCard icon={UploadCloud} label="Private Storage" value="Git ignored" delta="uploads/chunks/embeddings" tone="orange" />
      </CompactKpiStrip>

      <FilterToolbar
        actions={<StatusBadge label={`${filtered.length} records`} tone="blue" />}
      >
        <SearchInput value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search code or title" />
        <FilterSelect
          label="Publisher"
          value={publisher}
          onValueChange={setPublisher}
          options={[
            { label: "All publishers", value: "all" },
            { label: "API", value: "API" },
            { label: "ISO", value: "ISO" },
            { label: "ESDM", value: "ESDM" },
          ]}
        />
        <FilterSelect
          label="Status"
          value={status}
          onValueChange={setStatus}
          options={[
            { label: "All statuses", value: "all" },
            { label: "Uploaded", value: "uploaded" },
            { label: "Review pending", value: "review_pending" },
            { label: "Approved", value: "approved" },
            { label: "Active", value: "active" },
          ]}
        />
      </FilterToolbar>

      <DenseSection title="Library" eyebrow="Metadata and review state">
        <DenseTable maxHeight="620px">
          <DenseTableHeader>
            <tr>
              <DenseTableHeadCell>Code / Title</DenseTableHeadCell>
              <DenseTableHeadCell>Publisher</DenseTableHeadCell>
              <DenseTableHeadCell>Edition</DenseTableHeadCell>
              <DenseTableHeadCell>Status</DenseTableHeadCell>
              <DenseTableHeadCell>Applicability</DenseTableHeadCell>
              <DenseTableHeadCell>Review</DenseTableHeadCell>
            </tr>
          </DenseTableHeader>
          <tbody>
            {filtered.map((standard) => (
              <DenseTableRow key={standard.id} interactive>
                <DenseTableCell>
                  <Link href={`/administration/standards/${standard.id}`} className="font-black text-blue-700 hover:text-blue-800 dark:text-blue-300">
                    {standard.code}
                  </Link>
                  <p className="mt-1 max-w-[420px] text-sm font-semibold text-slate-500 dark:text-slate-400">{standard.title}</p>
                </DenseTableCell>
                <DenseTableCell>{standard.publisher}</DenseTableCell>
                <DenseTableCell>{standard.edition}</DenseTableCell>
                <DenseTableCell><StandardStatusBadge status={standard.status} /></DenseTableCell>
                <DenseTableCell>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{standard.equipmentApplicability.slice(0, 3).join(", ")}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{standard.analysisApplicability.join(", ")}</p>
                </DenseTableCell>
                <DenseTableCell>{standard.reviewState}</DenseTableCell>
              </DenseTableRow>
            ))}
          </tbody>
        </DenseTable>
      </DenseSection>
    </CompactPageShell>
  );
}

export function StandardUploadPageContent() {
  return (
    <CompactPageShell>
      <CompactPageHeader
        icon={UploadCloud}
        title="Upload / Register Standard"
        description="Register standards metadata and optionally attach a private source document. Raw licensed content is never served from public web routes."
        breadcrumb={<BreadcrumbTrail items={[...breadcrumb, { label: "Upload" }]} />}
        action={<ToolbarButton href="/administration/standards">Back to Standards</ToolbarButton>}
      />
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-3">
          <StandardMetadataForm />
          <StandardUploadDropzone />
        </div>
        <div className="space-y-3">
          <HumanReviewGateCard requiredRole="superadmin/admin + SME" />
          <DenseSection title="Storage Contract" eyebrow="Local development">
            <div className="space-y-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
              <p><code>storage/local-dev/standards/uploads</code> stores private uploads.</p>
              <p><code>parsed-text</code>, <code>chunks</code>, and <code>embeddings</code> are ignored by Git.</p>
              <p>Only metadata, hashes, status, citations, and rule summaries are committed.</p>
            </div>
          </DenseSection>
        </div>
      </div>
    </CompactPageShell>
  );
}

export function StandardDetailPageContent({ standardId }: { standardId: string }) {
  const standard = getStandardById(standardId);
  const requirements = getRequirementsByStandard(standard.id);
  const activeRules = RULES.filter((rule) => requirements.some((requirement) => requirement.id === rule.requirementId));

  return (
    <CompactPageShell>
      <CompactPageHeader
        icon={BookOpenCheck}
        title={`${standard.code} Knowledge Record`}
        description={standard.title}
        breadcrumb={<BreadcrumbTrail items={[...breadcrumb, { label: standard.code }]} />}
        meta={<StandardStatusBadge status={standard.status} />}
        action={<ToolbarButton href="/administration/standards">Back to Standards</ToolbarButton>}
      />
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-3">
          <DenseSection title="Metadata" eyebrow={standard.publisher}>
            <div className="grid gap-3 md:grid-cols-3">
              <MetadataTile label="Edition" value={standard.edition} />
              <MetadataTile label="Year" value={String(standard.year)} />
              <MetadataTile label="Storage" value={standard.storageMode} />
              <MetadataTile label="Industries" value={standard.industries.join(", ")} />
              <MetadataTile label="Equipment" value={standard.equipmentApplicability.join(", ")} />
              <MetadataTile label="Analysis" value={standard.analysisApplicability.join(", ")} />
            </div>
            <p className="mt-3 rounded-2xl bg-orange-50 px-3 py-2 text-sm font-bold text-orange-800 dark:bg-orange-500/10 dark:text-orange-100">{standard.licenseNote}</p>
          </DenseSection>
          <ParsingJobTimeline steps={PARSING_TIMELINE} />
          <RequirementReviewTable requirements={requirements} />
        </div>
        <div className="space-y-3">
          <DenseSection title="Active / Draft Rules" eyebrow="Requirement-derived">
            <div className="space-y-2">
              {activeRules.map((rule) => (
                <Link key={rule.id} href={`/administration/rules/${rule.id}`} className="block rounded-2xl border border-slate-200 p-3 transition hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-800 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10">
                  <p className="font-black text-slate-950 dark:text-white">{rule.name}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{rule.outputGuard}</p>
                </Link>
              ))}
            </div>
          </DenseSection>
          <AuditTrailPanel events={AUDIT_EVENTS} />
        </div>
      </div>
    </CompactPageShell>
  );
}

export function StandardExtractionPageContent({ standardId }: { standardId: string }) {
  const standard = getStandardById(standardId);
  return (
    <CompactPageShell>
      <CompactPageHeader
        icon={FileSearch}
        title={`${standard.code} Extraction`}
        description="Review parsed metadata/chunk citations, extraction warnings, and draft requirements before SME review."
        breadcrumb={<BreadcrumbTrail items={[...breadcrumb, { href: `/administration/standards/${standard.id}`, label: standard.code }, { label: "Extraction" }]} />}
        action={<ToolbarButton href={`/administration/standards/${standard.id}`}>Back to Detail</ToolbarButton>}
      />
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_420px]">
        <DenseSection title="Parsed Sections / Chunks" eyebrow="No licensed full text">
          <div className="grid gap-2">
            {PARSED_CHUNKS.map((chunk) => (
              <div key={chunk.id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-black text-slate-950 dark:text-white">{chunk.section}</p>
                  <StatusBadge label={chunk.previewAllowed ? "Preview allowed" : "Preview hidden"} tone={chunk.previewAllowed ? "emerald" : "orange"} />
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">Page: {chunk.page} / Chunk: {chunk.id}</p>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-600 dark:text-slate-300">{chunk.preview}</p>
                {chunk.warning ? <p className="mt-2 rounded-xl bg-orange-50 px-3 py-2 text-xs font-bold text-orange-800 dark:bg-orange-500/10 dark:text-orange-100">{chunk.warning}</p> : null}
              </div>
            ))}
          </div>
        </DenseSection>
        <div className="space-y-3">
          <ParsingJobTimeline steps={PARSING_TIMELINE} />
          <CitationReferenceCard citations={[{ label: standard.code, detail: "Metadata citations only; private source text is hidden." }]} />
        </div>
      </div>
    </CompactPageShell>
  );
}

export function StandardRequirementsPageContent({ standardId }: { standardId: string }) {
  const standard = getStandardById(standardId);
  return (
    <CompactPageShell>
      <CompactPageHeader
        icon={Scale}
        title={`${standard.code} Requirement Review`}
        description="SME/legal/admin review converts draft extraction into approved requirements, then rules. Unreviewed output cannot activate."
        breadcrumb={<BreadcrumbTrail items={[...breadcrumb, { href: `/administration/standards/${standard.id}`, label: standard.code }, { label: "Requirements" }]} />}
        action={<ToolbarButton href={`/administration/standards/${standard.id}`}>Back to Detail</ToolbarButton>}
      />
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
        <RequirementReviewTable requirements={getRequirementsByStandard(standard.id)} />
        <HumanReviewGateCard requiredRole="SME / legal / admin" />
      </div>
    </CompactPageShell>
  );
}

function MetadataTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
