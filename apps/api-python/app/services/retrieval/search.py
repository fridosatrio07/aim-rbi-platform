from __future__ import annotations


def search_knowledge_index(query: str, standard_version_ids: list[str], top_k: int) -> dict:
    return {
        "query": query,
        "matches": [
            {
                "standard_version_id": standard_version_ids[0] if standard_version_ids else None,
                "score": 0.1,
                "citation": {
                    "section_reference": "metadata",
                    "page_reference": "metadata",
                    "note": "Placeholder retrieval result; private vector index is not configured.",
                },
                "short_preview": None,
            }
        ][:top_k],
        "warnings": ["Retrieval backend is a placeholder. Configure pgvector/local vector store for production use."],
        "limitation_statement": "Search result is assistive and must be checked against licensed source documents by authorized users.",
    }
