import type { RiskRegisterColumnKey, RiskRegisterRecord } from "./risk-register-types";

export const RISK_REGISTER_COLUMN_LABELS: Record<RiskRegisterColumnKey, string> = {
  assetTag: "Asset Tag",
  system: "System",
  equipmentClass: "Equipment Class",
  pof: "PoF",
  cof: "CoF",
  riskCategory: "Risk Category",
  riskDriver: "Risk Driver",
  damageMechanism: "Damage Mechanism",
  inspectionEffectiveness: "Inspection Effectiveness",
  nextInspectionDue: "Next Inspection Due",
  mitigationRecommendation: "Mitigation Recommendation",
  actions: "Actions",
};

export const RISK_REGISTER_EXPORT_COLUMNS: RiskRegisterColumnKey[] = [
  "assetTag",
  "system",
  "equipmentClass",
  "pof",
  "cof",
  "riskCategory",
  "riskDriver",
  "damageMechanism",
  "inspectionEffectiveness",
  "nextInspectionDue",
  "mitigationRecommendation",
];

export function exportRiskRegisterCsv(
  records: RiskRegisterRecord[],
  visibleColumns: Record<RiskRegisterColumnKey, boolean>,
) {
  const columns = RISK_REGISTER_EXPORT_COLUMNS.filter((column) => visibleColumns[column]);
  const header = columns.map((column) => RISK_REGISTER_COLUMN_LABELS[column]);
  const rows = records.map((record) => columns.map((column) => getCsvValue(record, column)));
  const csv = [header, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `spm-01-risk-register-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function getCsvValue(record: RiskRegisterRecord, column: RiskRegisterColumnKey) {
  switch (column) {
    case "pof":
      return record.pof.toFixed(1);
    case "cof":
      return record.cof.toFixed(1);
    case "riskCategory":
      return record.riskCategory;
    case "inspectionEffectiveness":
      return record.inspectionEffectiveness;
    case "nextInspectionDue":
      return record.nextInspectionDueLabel;
    case "actions":
      return "";
    default:
      return String(record[column]);
  }
}

function escapeCsv(value: string) {
  if (/[",\r\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;

  return value;
}
