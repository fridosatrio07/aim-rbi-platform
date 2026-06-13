from __future__ import annotations

from pathlib import Path


def parse_document_metadata(standard_version_id: str, document_storage_uri: str, parser_mode: str, copyright_safe_preview: bool) -> dict:
    path = Path(document_storage_uri)
    warnings: list[str] = []

    if parser_mode != "metadata_only" and not path.exists():
        warnings.append("Document path is not accessible; metadata-only fallback was used.")

    chunks = [
        {
            "chunk_id": f"{standard_version_id}-metadata-001",
            "page_start": 1,
            "page_end": 1,
            "section_heading": "Metadata placeholder",
            "short_preview": "Metadata-only placeholder; licensed source text is not exposed."
            if copyright_safe_preview
            else None,
            "token_estimate": 0,
            "copyright_safe_for_preview": copyright_safe_preview,
            "warnings": warnings,
        }
    ]

    if parser_mode == "text_and_tables":
        warnings.append("Table extraction is scaffolded; verify tables manually before rule creation.")
    elif parser_mode == "text":
        warnings.append("Text extraction requires configured parser libraries and private runtime storage.")

    return {
        "standard_version_id": standard_version_id,
        "chunks": chunks,
        "warnings": warnings,
        "limitation_statement": (
            "Parsing output is citation metadata/draft extraction support only. Do not commit "
            "licensed text, chunks, or embeddings to Git."
        ),
    }
