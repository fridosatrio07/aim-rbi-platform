import {
  DenseSection,
  DenseTable,
  DenseTableCell,
  DenseTableHeadCell,
  DenseTableHeader,
  DenseTableRow,
  ToolbarButton,
} from "@/components/data-display/compact-primitives";

import { RequirementStatusBadge } from "./status-badges";
import type { RequirementView } from "../types/standards-knowledge.types";

export function RequirementReviewTable({ requirements }: { requirements: RequirementView[] }) {
  return (
    <DenseSection title="Draft Requirements" eyebrow="SME/legal review gate">
      <DenseTable maxHeight="520px">
        <DenseTableHeader>
          <tr>
            <DenseTableHeadCell>Requirement Summary</DenseTableHeadCell>
            <DenseTableHeadCell>Type</DenseTableHeadCell>
            <DenseTableHeadCell>Source</DenseTableHeadCell>
            <DenseTableHeadCell>Confidence</DenseTableHeadCell>
            <DenseTableHeadCell>Status</DenseTableHeadCell>
            <DenseTableHeadCell>Actions</DenseTableHeadCell>
          </tr>
        </DenseTableHeader>
        <tbody>
          {requirements.map((requirement) => (
            <DenseTableRow key={requirement.id}>
              <DenseTableCell className="max-w-[420px]">
                <p className="font-black text-slate-950 dark:text-white">{requirement.summary}</p>
                {requirement.comment ? <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{requirement.comment}</p> : null}
              </DenseTableCell>
              <DenseTableCell>{requirement.type}</DenseTableCell>
              <DenseTableCell>{requirement.sectionReference} / {requirement.pageReference}</DenseTableCell>
              <DenseTableCell>{Math.round(requirement.confidence * 100)}%</DenseTableCell>
              <DenseTableCell><RequirementStatusBadge status={requirement.status} /></DenseTableCell>
              <DenseTableCell>
                <div className="flex gap-2">
                  <ToolbarButton>Approve</ToolbarButton>
                  <ToolbarButton variant="ghost">Reject</ToolbarButton>
                </div>
              </DenseTableCell>
            </DenseTableRow>
          ))}
        </tbody>
      </DenseTable>
    </DenseSection>
  );
}
