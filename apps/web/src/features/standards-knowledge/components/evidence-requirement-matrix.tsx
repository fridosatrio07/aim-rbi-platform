import {
  DenseSection,
  DenseTable,
  DenseTableCell,
  DenseTableHeadCell,
  DenseTableHeader,
  DenseTableRow,
  StatusBadge,
} from "@/components/data-display/compact-primitives";

import { AutomationAuthorityBadge } from "./status-badges";
import type { EvidenceRequirementView } from "../types/standards-knowledge.types";

export function EvidenceRequirementMatrix({ items }: { items: EvidenceRequirementView[] }) {
  return (
    <DenseSection title="Evidence Requirement Matrix" eyebrow="Equipment and analysis basis">
      <DenseTable maxHeight="620px">
        <DenseTableHeader>
          <tr>
            <DenseTableHeadCell>Equipment</DenseTableHeadCell>
            <DenseTableHeadCell>Analysis</DenseTableHeadCell>
            <DenseTableHeadCell>Evidence</DenseTableHeadCell>
            <DenseTableHeadCell>Mandatory</DenseTableHeadCell>
            <DenseTableHeadCell>Authority</DenseTableHeadCell>
            <DenseTableHeadCell>Formats</DenseTableHeadCell>
          </tr>
        </DenseTableHeader>
        <tbody>
          {items.map((item) => (
            <DenseTableRow key={item.id}>
              <DenseTableCell>{item.equipmentClass}</DenseTableCell>
              <DenseTableCell>{item.analysisType}</DenseTableCell>
              <DenseTableCell className="font-black text-slate-950 dark:text-white">{item.evidenceType}</DenseTableCell>
              <DenseTableCell><StatusBadge label={item.mandatory ? "Mandatory" : "Optional"} tone={item.mandatory ? "orange" : "slate"} /></DenseTableCell>
              <DenseTableCell><AutomationAuthorityBadge authorityLevel={item.authorityLevel} /></DenseTableCell>
              <DenseTableCell>{item.acceptedFormats.join(", ")}</DenseTableCell>
            </DenseTableRow>
          ))}
        </tbody>
      </DenseTable>
    </DenseSection>
  );
}
