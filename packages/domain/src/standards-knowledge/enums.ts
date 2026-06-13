export const STANDARD_PUBLISHERS = [
  "API",
  "ISO",
  "ASME",
  "IEC",
  "AMPP_NACE",
  "ESDM",
  "MIGAS",
  "KEMNAKER",
  "internal",
  "client",
  "other",
] as const;

export type StandardPublisher = (typeof STANDARD_PUBLISHERS)[number];

export const INDUSTRIES = [
  "oil_gas",
  "geothermal",
  "petrochemical",
  "chemical",
  "power",
  "general_industry",
] as const;

export type Industry = (typeof INDUSTRIES)[number];

export const EQUIPMENT_APPLICABILITY = [
  "pressure_vessel",
  "piping",
  "pipeline",
  "storage_tank",
  "heat_exchanger",
  "prd_psv",
  "rotating_equipment",
  "lifting_equipment",
  "boiler",
  "geothermal_steamfield",
  "geothermal_brine_line",
  "wellhead",
  "structural",
  "electrical",
  "instrumentation",
  "safety_system",
  "other",
] as const;

export type EquipmentApplicability = (typeof EQUIPMENT_APPLICABILITY)[number];

export const ANALYSIS_APPLICABILITY = [
  "RBI",
  "inspection_planning",
  "FFS",
  "RLA",
  "certification",
  "PLO_readiness",
  "document_completeness",
  "damage_mechanism_review",
  "corrosion_assessment",
  "reliability_assessment",
  "safety_system_assessment",
  "evidence_pack",
] as const;

export type AnalysisApplicability = (typeof ANALYSIS_APPLICABILITY)[number];

export const DOCUMENT_STATUSES = [
  "uploaded",
  "parsing",
  "parsed",
  "extraction_pending",
  "extracted",
  "review_pending",
  "approved",
  "active",
  "superseded",
  "rejected",
  "archived",
] as const;

export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export const REQUIREMENT_STATUSES = [
  "draft",
  "SME_review_pending",
  "legal_review_pending",
  "approved",
  "active",
  "rejected",
  "superseded",
] as const;

export type RequirementStatus = (typeof REQUIREMENT_STATUSES)[number];

export const RULE_STATUSES = ["draft", "validation_pending", "approved", "active", "retired"] as const;

export type RuleStatus = (typeof RULE_STATUSES)[number];

export const ANALYSIS_OUTPUT_STATUSES = [
  "draft",
  "preliminary",
  "requires_engineer_review",
  "approved_by_engineer",
  "rejected",
] as const;

export type AnalysisOutputStatus = (typeof ANALYSIS_OUTPUT_STATUSES)[number];

export const DATA_QUALITY_STATUSES = [
  "verified",
  "partially_verified",
  "assumed",
  "missing",
  "rejected",
] as const;

export type DataQualityStatus = (typeof DATA_QUALITY_STATUSES)[number];

export const AUTOMATION_AUTHORITY_LEVELS = [
  "automatic_allowed",
  "draft_only",
  "human_approval_required",
  "prohibited",
] as const;

export type AutomationAuthorityLevel = (typeof AUTOMATION_AUTHORITY_LEVELS)[number];
