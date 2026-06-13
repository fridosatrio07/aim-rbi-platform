from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.schemas.knowledge import (
    CompletenessRequest,
    CorrosionRateRequest,
    DueDateRequest,
    EvidencePackDraftRequest,
    ParseRequest,
    PreliminaryRiskRequest,
    RequirementExtractionRequest,
    RetrievalSearchRequest,
)
from app.services.calculations.engineering_calculations import (
    conservative_due_date,
    document_completeness,
    preliminary_risk,
    simple_corrosion_rate,
)
from app.services.evidence.pack import build_evidence_pack_draft
from app.services.jobs.job_store import job_store
from app.services.parsing.parser import parse_document_metadata
from app.services.requirement_extraction.extractor import extract_draft_requirements
from app.services.retrieval.search import search_knowledge_index

router = APIRouter()


@router.post("/ingestion/parse")
def parse_document(request: ParseRequest) -> dict:
    result = parse_document_metadata(
        request.standard_version_id,
        request.document_storage_uri,
        request.parser_mode,
        request.copyright_safe_preview,
    )
    return job_store.create(
        "parse",
        result,
        result["warnings"],
        result["limitation_statement"],
    )


@router.get("/ingestion/jobs/{job_id}")
def get_ingestion_job(job_id: str) -> dict:
    job = job_store.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.post("/extraction/requirements")
def extract_requirements(request: RequirementExtractionRequest) -> dict:
    result = extract_draft_requirements(
        request.standard_version_id,
        [chunk.model_dump() for chunk in request.chunks],
        request.extraction_mode,
    )
    return job_store.create(
        "extract",
        result,
        result["warnings"],
        result["limitation_statement"],
    )


@router.post("/retrieval/search")
def retrieval_search(request: RetrievalSearchRequest) -> dict:
    return search_knowledge_index(request.query, request.standard_version_ids, request.top_k)


@router.post("/calculations/corrosion-rate")
def calculate_corrosion_rate(request: CorrosionRateRequest) -> dict:
    return simple_corrosion_rate(
        request.previous_thickness,
        request.current_thickness,
        request.previous_date,
        request.current_date,
        request.minimum_required_thickness,
    )


@router.post("/calculations/due-date")
def calculate_due_date(request: DueDateRequest) -> dict:
    return conservative_due_date([candidate.model_dump() for candidate in request.candidates])


@router.post("/analysis/preliminary-risk")
def analyze_preliminary_risk(request: PreliminaryRiskRequest) -> dict:
    return preliminary_risk(
        request.probability_category,
        request.consequence_category,
        request.automatic_screening_allowed,
    )


@router.post("/analysis/document-completeness")
def analyze_document_completeness(request: CompletenessRequest) -> dict:
    return document_completeness(request.required_evidence, request.available_evidence)


@router.post("/evidence/pack-draft")
def evidence_pack_draft(request: EvidencePackDraftRequest) -> dict:
    return build_evidence_pack_draft(request.model_dump())
