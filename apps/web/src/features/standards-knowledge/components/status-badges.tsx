import { StatusBadge } from "@/components/data-display/compact-primitives";

import type {
  AutomationAuthorityLevel,
  DataQualityStatus,
  RequirementStatus,
  RuleStatus,
  StandardStatus,
} from "../types/standards-knowledge.types";

type Tone = "slate" | "blue" | "cyan" | "emerald" | "amber" | "orange" | "red" | "violet";

const standardTone: Record<StandardStatus, Tone> = {
  uploaded: "slate",
  parsing: "cyan",
  parsed: "blue",
  extraction_pending: "amber",
  extracted: "blue",
  review_pending: "violet",
  approved: "emerald",
  active: "emerald",
  superseded: "slate",
  rejected: "red",
  archived: "slate",
};

const requirementTone: Record<RequirementStatus, Tone> = {
  draft: "slate",
  SME_review_pending: "violet",
  legal_review_pending: "amber",
  approved: "emerald",
  active: "emerald",
  rejected: "red",
  superseded: "slate",
};

const ruleTone: Record<RuleStatus, Tone> = {
  draft: "slate",
  validation_pending: "amber",
  approved: "emerald",
  active: "emerald",
  retired: "slate",
};

const dataQualityTone: Record<DataQualityStatus, Tone> = {
  verified: "emerald",
  partially_verified: "amber",
  assumed: "orange",
  missing: "red",
  rejected: "red",
};

const authorityTone: Record<AutomationAuthorityLevel, Tone> = {
  automatic_allowed: "emerald",
  draft_only: "blue",
  human_approval_required: "orange",
  prohibited: "red",
};

export function StandardStatusBadge({ status }: { status: StandardStatus }) {
  return <StatusBadge label={formatLabel(status)} tone={standardTone[status]} withDot />;
}

export function RequirementStatusBadge({ status }: { status: RequirementStatus }) {
  return <StatusBadge label={formatLabel(status)} tone={requirementTone[status]} withDot />;
}

export function RuleStatusBadge({ status }: { status: RuleStatus }) {
  return <StatusBadge label={formatLabel(status)} tone={ruleTone[status]} withDot />;
}

export function DataQualityBadge({ status }: { status: DataQualityStatus }) {
  return <StatusBadge label={formatLabel(status)} tone={dataQualityTone[status]} withDot />;
}

export function AutomationAuthorityBadge({ authorityLevel }: { authorityLevel: AutomationAuthorityLevel }) {
  return <StatusBadge label={formatLabel(authorityLevel)} tone={authorityTone[authorityLevel]} withDot />;
}

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\bSME\b/g, "SME")
    .replace(/\bPLO\b/g, "PLO")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}
