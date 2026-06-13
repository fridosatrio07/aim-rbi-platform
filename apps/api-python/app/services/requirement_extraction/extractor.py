from __future__ import annotations


def extract_draft_requirements(standard_version_id: str, chunks: list[dict], extraction_mode: str) -> dict:
    warnings = []
    if extraction_mode != "deterministic":
        warnings.append("External LLM provider is not configured; deterministic low-confidence fallback was used.")

    source_chunks = chunks or [{"chunk_id": "metadata-only", "section_heading": "Metadata placeholder"}]
    requirements = []
    for index, chunk in enumerate(source_chunks, start=1):
        requirements.append(
            {
                "requirement_summary": (
                    "Draft requirement placeholder generated from citation metadata. "
                    "SME must validate the source basis before approval."
                ),
                "requirement_type": "governance_placeholder",
                "source_section_reference": chunk.get("section_heading"),
                "source_page_reference": str(chunk.get("page_start")) if chunk.get("page_start") else None,
                "confidence_score": 0.25,
                "extraction_method": "deterministic",
                "status": "draft",
                "warnings": warnings + [f"Requirement {index} is not active and cannot drive final authority output."],
                "limitation_statement": (
                    "AI/deterministic extraction is always draft and requires SME/legal review before rule activation."
                ),
            }
        )

    return {
        "standard_version_id": standard_version_id,
        "requirements": requirements,
        "warnings": warnings,
        "limitation_statement": "Draft extraction result only; human review is mandatory before activation.",
    }
