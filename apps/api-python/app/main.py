from fastapi import FastAPI

from app.api.v1.endpoints.knowledge import router as knowledge_router

app = FastAPI(
    title="AIM RBI Engineering and Knowledge Service",
    version="0.1.0",
    description=(
        "Engineering decision-support APIs for parsing, retrieval, draft requirement "
        "extraction, calculations, preliminary RBI screening, and evidence pack drafts."
    ),
)

app.include_router(knowledge_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "api-python"}
