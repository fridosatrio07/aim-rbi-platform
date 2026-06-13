from __future__ import annotations

from uuid import uuid4


class InMemoryJobStore:
    def __init__(self) -> None:
        self._jobs: dict[str, dict] = {}

    def create(self, job_type: str, result: dict, warnings: list[str], limitation_statement: str) -> dict:
        job = {
            "id": str(uuid4()),
            "type": job_type,
            "status": "completed",
            "warnings": warnings,
            "limitation_statement": limitation_statement,
            "result": result,
        }
        self._jobs[job["id"]] = job
        return job

    def get(self, job_id: str) -> dict | None:
        return self._jobs.get(job_id)


job_store = InMemoryJobStore()
