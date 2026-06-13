from __future__ import annotations

from datetime import datetime, timezone

from app.services.calculations.engineering_calculations import document_completeness


def build_evidence_pack_draft(request: dict) -> dict:
    completeness = document_completeness(request.get("required_evidence", []), request.get("available_evidence", []))
    return {
        "asset_identity": request.get("asset_identity", {}),
        "applicable_standards": request.get("applicable_standards", []),
        "required_evidence_matrix": request.get("required_evidence", []),
        "available_evidence": request.get("available_evidence", []),
        "missing_evidence": completeness["missing_evidence"],
        "data_quality_status": completeness["status"],
        "analysis_outputs": request.get("analysis_outputs", []),
        "findings_and_recommendations": [],
        "citation_references": [],
        "limitation_statement": (
            "Draft evidence pack only. It does not create final certificate, PLO, FFS, RLA, "
            "or safe-operation conclusions."
        ),
        "human_review_approval_section": "Engineer/regulatory review required before submission.",
        "output_status": "draft",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "generated_by": request.get("generated_by", "system"),
        "warnings": completeness["warnings"],
    }
