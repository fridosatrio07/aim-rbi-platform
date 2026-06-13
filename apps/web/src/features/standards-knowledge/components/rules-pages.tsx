"use client";

import Link from "next/link";
import { Gavel, SlidersHorizontal } from "lucide-react";

import {
  BreadcrumbTrail,
  CompactPageHeader,
  CompactPageShell,
  DenseSection,
  DenseTable,
  DenseTableCell,
  DenseTableHeadCell,
  DenseTableHeader,
  DenseTableRow,
  ToolbarButton,
} from "@/components/data-display/compact-primitives";

import { RuleConditionBuilder } from "./rule-condition-builder";
import { AutomationAuthorityBadge, RuleStatusBadge } from "./status-badges";
import { RULES, getRuleById } from "../services/standards-knowledge-data";

const breadcrumb = [{ href: "/administration", label: "Administration" }, { href: "/administration/standards", label: "Standards Knowledge" }];

export function RulesListPageContent() {
  return (
    <CompactPageShell>
      <CompactPageHeader
        icon={Gavel}
        title="Rules"
        description="Approved requirement-derived rule sets with applicability conditions, conflict policy, and automation authority."
        breadcrumb={<BreadcrumbTrail items={[...breadcrumb, { label: "Rules" }]} />}
        action={<ToolbarButton href="/administration/standards">Back to Standards</ToolbarButton>}
      />
      <DenseSection title="Rule Sets" eyebrow="Activation guarded by review">
        <DenseTable maxHeight="620px">
          <DenseTableHeader>
            <tr>
              <DenseTableHeadCell>Rule</DenseTableHeadCell>
              <DenseTableHeadCell>Standard</DenseTableHeadCell>
              <DenseTableHeadCell>Status</DenseTableHeadCell>
              <DenseTableHeadCell>Authority</DenseTableHeadCell>
              <DenseTableHeadCell>Conditions</DenseTableHeadCell>
              <DenseTableHeadCell>Guard</DenseTableHeadCell>
            </tr>
          </DenseTableHeader>
          <tbody>
            {RULES.map((rule) => (
              <DenseTableRow key={rule.id} interactive>
                <DenseTableCell>
                  <Link href={`/administration/rules/${rule.id}`} className="font-black text-blue-700 hover:text-blue-800 dark:text-blue-300">{rule.name}</Link>
                </DenseTableCell>
                <DenseTableCell>{rule.standardCode}</DenseTableCell>
                <DenseTableCell><RuleStatusBadge status={rule.status} /></DenseTableCell>
                <DenseTableCell><AutomationAuthorityBadge authorityLevel={rule.authorityLevel} /></DenseTableCell>
                <DenseTableCell>{rule.conditions.join("; ")}</DenseTableCell>
                <DenseTableCell className="max-w-[320px] text-xs font-semibold leading-5">{rule.outputGuard}</DenseTableCell>
              </DenseTableRow>
            ))}
          </tbody>
        </DenseTable>
      </DenseSection>
    </CompactPageShell>
  );
}

export function RuleDetailPageContent({ ruleId }: { ruleId: string }) {
  const rule = getRuleById(ruleId);
  return (
    <CompactPageShell>
      <CompactPageHeader
        icon={SlidersHorizontal}
        title={rule.name}
        description="Rule detail showing applicability, conflict handling, automation authority, and output guardrails."
        breadcrumb={<BreadcrumbTrail items={[...breadcrumb, { href: "/administration/rules", label: "Rules" }, { label: rule.name }]} />}
        meta={<RuleStatusBadge status={rule.status} />}
        action={<ToolbarButton href="/administration/rules">Back to Rules</ToolbarButton>}
      />
      <RuleConditionBuilder rule={rule} />
    </CompactPageShell>
  );
}
