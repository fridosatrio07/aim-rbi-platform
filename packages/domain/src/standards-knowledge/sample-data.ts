import type { StandardDocument } from "./models.js";
import { normalizeStandardCode } from "./utilities.js";

const now = "2026-06-13T00:00:00.000Z";

function placeholderStandard(
  id: string,
  code: string,
  title: string,
  publisher: StandardDocument["publisher"],
  industries: StandardDocument["industries"],
  equipmentApplicability: StandardDocument["equipmentApplicability"],
  analysisApplicability: StandardDocument["analysisApplicability"],
): StandardDocument {
  return {
    id,
    code,
    normalizedCode: normalizeStandardCode(code),
    title,
    publisher,
    status: "uploaded",
    industries,
    equipmentApplicability,
    analysisApplicability,
    confidentiality: "licensed",
    licenseNote:
      "Metadata placeholder only. Do not commit licensed standards, extracted full text, chunks, embeddings, or proprietary evidence to Git.",
    metadataOnly: true,
    ownerOrganization: "SUCOFINDO AEBT development placeholder",
    createdAt: now,
    updatedAt: now,
  };
}

export const STANDARD_METADATA_PLACEHOLDERS: StandardDocument[] = [
  placeholderStandard(
    "std-placeholder-api-580",
    "API 580",
    "Risk-Based Inspection methodology metadata placeholder",
    "API",
    ["oil_gas", "petrochemical", "chemical", "geothermal"],
    ["pressure_vessel", "piping", "storage_tank", "heat_exchanger"],
    ["RBI", "inspection_planning", "damage_mechanism_review"],
  ),
  placeholderStandard(
    "std-placeholder-api-581",
    "API 581",
    "RBI quantitative methods metadata placeholder",
    "API",
    ["oil_gas", "petrochemical", "chemical"],
    ["pressure_vessel", "piping", "storage_tank", "heat_exchanger"],
    ["RBI", "corrosion_assessment", "inspection_planning"],
  ),
  placeholderStandard(
    "std-placeholder-iso-14224",
    "ISO 14224",
    "Reliability and maintenance data taxonomy metadata placeholder",
    "ISO",
    ["oil_gas", "petrochemical", "power", "general_industry"],
    ["rotating_equipment", "safety_system", "instrumentation", "electrical", "other"],
    ["reliability_assessment", "RBI", "document_completeness"],
  ),
  placeholderStandard(
    "std-placeholder-permen-esdm-32-2021",
    "Permen ESDM 32/2021",
    "Indonesian energy-sector technical regulation metadata placeholder",
    "ESDM",
    ["oil_gas", "geothermal"],
    ["pipeline", "piping", "pressure_vessel", "storage_tank", "geothermal_steamfield", "geothermal_brine_line"],
    ["certification", "PLO_readiness", "document_completeness", "evidence_pack"],
  ),
  placeholderStandard(
    "std-placeholder-permen-esdm-33-2021",
    "Permen ESDM 33/2021",
    "Indonesian energy-sector compliance regulation metadata placeholder",
    "ESDM",
    ["oil_gas", "geothermal"],
    ["wellhead", "pipeline", "piping", "safety_system", "other"],
    ["certification", "PLO_readiness", "document_completeness", "evidence_pack"],
  ),
];
