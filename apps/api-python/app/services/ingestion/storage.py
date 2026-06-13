from __future__ import annotations

from pathlib import Path

PRIVATE_STANDARDS_ROOT = Path("storage/local-dev/standards")


def resolve_private_storage_uri(relative_path: str) -> str:
    """Resolve private local-dev storage; never place standards under a public web folder."""
    return str((PRIVATE_STANDARDS_ROOT / relative_path).as_posix())
