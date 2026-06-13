from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


AnalysisStatus = Literal["draft", "preliminary", "requires_engineer_review", "approved_by_engineer", "rejected"]
DataQualityStatus = Literal["verified", "partially_verified", "assumed", "missing", "rejected"]


class CitationReference(BaseModel):
    standard_code: str | None = None
    edition: str | None = None
    section_reference: str | None = None
    page_reference: str | None = None
    chunk_id: str | None = None
    note: str | None = None


class ParseRequest(BaseModel):
    standard_version_id: str
    document_storage_uri: str
    parser_mode: Literal["metadata_only", "text", "text_and_tables"] = "metadata_only"
    copyright_safe_preview: bool = False


class ParsedChunk(BaseModel):
    chunk_id: str
    page_start: int | None = None
    page_end: int | None = None
    section_heading: str | None = None
    short_preview: str | None = None
    token_estimate: int = 0
    copyright_safe_for_preview: bool = False
    warnings: list[str] = Field(default_factory=list)


class JobResponse(BaseModel):
    id: str
    status: Literal["queued", "running", "completed", "failed"]
    type: Literal["parse", "extract"]
    warnings: list[str] = Field(default_factory=list)
    limitation_statement: str
    result: dict[str, Any] = Field(default_factory=dict)


class RequirementExtractionRequest(BaseModel):
    standard_version_id: str
    chunks: list[ParsedChunk] = Field(default_factory=list)
    extraction_mode: Literal["deterministic", "LLM", "hybrid"] = "deterministic"


class ExtractedRequirementSchema(BaseModel):
    requirement_summary: str
    requirement_type: str
    source_section_reference: str | None = None
    source_page_reference: str | None = None
    confidence_score: float
    extraction_method: Literal["deterministic", "LLM", "hybrid", "manual"] = "deterministic"
    status: Literal["draft"] = "draft"
    warnings: list[str] = Field(default_factory=list)
    limitation_statement: str


class RetrievalSearchRequest(BaseModel):
    query: str
    standard_version_ids: list[str] = Field(default_factory=list)
    top_k: int = 5


class CorrosionRateRequest(BaseModel):
    previous_thickness: float | None = None
    current_thickness: float | None = None
    previous_date: str | None = None
    current_date: str | None = None
    unit: Literal["mm", "inch"] = "mm"
    minimum_required_thickness: float | None = None


class CorrosionRateResponse(BaseModel):
    corrosion_rate: float | None = None
    raw_rate: float | None = None
    elapsed_years: float | None = None
    metal_loss: float | None = None
    remaining_life_years: float | None = None
    status: AnalysisStatus
    data_quality_status: DataQualityStatus
    warnings: list[str]
    limitation_statement: str


class DueDateCandidate(BaseModel):
    source: Literal["statutory", "regulator", "owner", "RBI", "recommendation", "engineer_override", "manual"]
    date: str | None = None
    label: str | None = None
    approved_override: bool = False
    rule_id: str | None = None


class DueDateRequest(BaseModel):
    candidates: list[DueDateCandidate]


class PreliminaryRiskRequest(BaseModel):
    probability_category: int = Field(ge=1, le=5)
    consequence_category: int = Field(ge=1, le=5)
    basis: str | None = None
    automatic_screening_allowed: bool = False


class CompletenessRequest(BaseModel):
    required_evidence: list[str]
    available_evidence: list[str]


class EvidencePackDraftRequest(BaseModel):
    asset_identity: dict[str, Any]
    applicable_standards: list[dict[str, Any]] = Field(default_factory=list)
    required_evidence: list[str] = Field(default_factory=list)
    available_evidence: list[str] = Field(default_factory=list)
    analysis_outputs: list[dict[str, Any]] = Field(default_factory=list)
    generated_by: str = "system"
