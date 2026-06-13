# Standards & Regulatory Knowledge Layer

This layer manages standards/regulations as controlled metadata and private runtime documents. It supports:

- superadmin/admin metadata registration and private upload storage;
- parsing jobs that produce citation metadata, chunks, tables, and formulas in private storage;
- draft requirement extraction using deterministic fallback when AI providers are unavailable;
- SME/legal/admin review before requirements become approved rules;
- rule-assisted applicability, completeness, due date, corrosion-rate, preliminary risk, inspection-plan, finding/recommendation, and evidence-pack drafts.

The source of truth is split across:

- `packages/domain/src/standards-knowledge` for shared enums, domain models, sample metadata, and deterministic utilities;
- `packages/contracts/src/standards-knowledge.ts` and `packages/contracts/openapi/standards-knowledge-layer.openapi.yaml` for API payloads;
- `database/migrations/20260613_001_standards_knowledge_layer.sql` for PostgreSQL tables and indexes;
- `apps/api-nest/src/modules/*` for governance APIs;
- `apps/api-python/app` for parsing, extraction, retrieval placeholders, calculations, and draft evidence packs;
- `apps/web/src/features/standards-knowledge` for the superadmin/admin UI.

## Upload Flow

1. Superadmin/admin opens `/administration/standards/upload`.
2. Metadata is captured first: code, title, publisher, edition/year, effective date, industry, equipment applicability, analysis applicability, confidentiality, license note, owner, and review requirement.
3. Optional source files are stored only in private runtime storage such as `storage/local-dev/standards/uploads` or object storage.
4. NestJS registers metadata through `POST /documents/standards/upload-metadata`.
5. FastAPI parsing is triggered through `/ingestion/parse` or NestJS orchestration through `/ai-orchestration/parsing-jobs`.
6. Extraction creates draft requirements only.
7. SME/legal/admin review is required before rule activation.

## Requirement To Rule Flow

Draft extracted requirements cannot become active rules. A reviewer must approve the summary and source basis first. Rule activation is blocked when:

- the requirement is still draft/review-pending/rejected;
- the requested authority level is `prohibited`;
- the rule would produce final engineering authority output.

Rules include conditions, authority level, conflict policy, status, and audit events.
