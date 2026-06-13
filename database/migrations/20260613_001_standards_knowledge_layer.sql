-- Standards & Regulatory Knowledge Layer foundational schema.
-- Copyright/security warning:
--   Do not seed or commit proprietary PDF standards, extracted full text,
--   full chunks, embeddings, or licensed document content. Store only metadata,
--   private storage URIs, hashes, and citation metadata in public repositories.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'standard_publisher') THEN
    CREATE TYPE standard_publisher AS ENUM (
      'API', 'ISO', 'ASME', 'IEC', 'AMPP_NACE', 'ESDM', 'MIGAS', 'KEMNAKER', 'internal', 'client', 'other'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_status') THEN
    CREATE TYPE document_status AS ENUM (
      'uploaded', 'parsing', 'parsed', 'extraction_pending', 'extracted', 'review_pending',
      'approved', 'active', 'superseded', 'rejected', 'archived'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'requirement_status') THEN
    CREATE TYPE requirement_status AS ENUM (
      'draft', 'SME_review_pending', 'legal_review_pending', 'approved', 'active', 'rejected', 'superseded'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rule_status') THEN
    CREATE TYPE rule_status AS ENUM ('draft', 'validation_pending', 'approved', 'active', 'retired');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'analysis_output_status') THEN
    CREATE TYPE analysis_output_status AS ENUM (
      'draft', 'preliminary', 'requires_engineer_review', 'approved_by_engineer', 'rejected'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'data_quality_status') THEN
    CREATE TYPE data_quality_status AS ENUM ('verified', 'partially_verified', 'assumed', 'missing', 'rejected');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'automation_authority_level') THEN
    CREATE TYPE automation_authority_level AS ENUM (
      'automatic_allowed', 'draft_only', 'human_approval_required', 'prohibited'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS standard_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_code text NOT NULL,
  normalized_code text NOT NULL,
  title text NOT NULL,
  publisher standard_publisher NOT NULL,
  status document_status NOT NULL DEFAULT 'uploaded',
  current_version_id uuid,
  industries text[] NOT NULL DEFAULT '{}',
  asset_applicability text[] NOT NULL DEFAULT '{}',
  analysis_applicability text[] NOT NULL DEFAULT '{}',
  confidentiality text NOT NULL DEFAULT 'licensed',
  license_note text NOT NULL,
  owner_organization text,
  document_storage_uri text,
  metadata_only boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

CREATE TABLE IF NOT EXISTS standard_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_document_id uuid NOT NULL REFERENCES standard_documents(id) ON DELETE CASCADE,
  standard_code text NOT NULL,
  title text NOT NULL,
  edition text,
  publication_year integer,
  effective_date date,
  superseded_by_version_id uuid REFERENCES standard_versions(id),
  is_superseded boolean NOT NULL DEFAULT false,
  status document_status NOT NULL DEFAULT 'uploaded',
  document_storage_uri text,
  checksum_sha256 text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

ALTER TABLE standard_documents
  ADD CONSTRAINT standard_documents_current_version_fk
  FOREIGN KEY (current_version_id) REFERENCES standard_versions(id) DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE IF NOT EXISTS standard_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_version_id uuid NOT NULL REFERENCES standard_versions(id) ON DELETE CASCADE,
  parent_section_id uuid REFERENCES standard_sections(id),
  section_code text,
  heading text NOT NULL,
  page_start integer,
  page_end integer,
  ordinal integer NOT NULL DEFAULT 0,
  citation_label text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

CREATE TABLE IF NOT EXISTS document_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_version_id uuid NOT NULL REFERENCES standard_versions(id) ON DELETE CASCADE,
  standard_section_id uuid REFERENCES standard_sections(id) ON DELETE SET NULL,
  chunk_id text NOT NULL,
  page_start integer,
  page_end integer,
  section_heading text,
  token_estimate integer,
  content_sha256 text,
  storage_uri text,
  short_preview text,
  contains_table boolean NOT NULL DEFAULT false,
  contains_formula boolean NOT NULL DEFAULT false,
  copyright_safe_for_preview boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  UNIQUE (standard_version_id, chunk_id)
);

CREATE TABLE IF NOT EXISTS document_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_version_id uuid NOT NULL REFERENCES standard_versions(id) ON DELETE CASCADE,
  document_chunk_id uuid REFERENCES document_chunks(id) ON DELETE SET NULL,
  table_label text,
  page_reference text,
  extraction_method text NOT NULL DEFAULT 'deterministic',
  confidence_score numeric(5,4) NOT NULL DEFAULT 0,
  storage_uri text,
  schema_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  warnings text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

CREATE TABLE IF NOT EXISTS document_formulas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_version_id uuid NOT NULL REFERENCES standard_versions(id) ON DELETE CASCADE,
  document_chunk_id uuid REFERENCES document_chunks(id) ON DELETE SET NULL,
  formula_label text,
  formula_summary text NOT NULL,
  page_reference text,
  extraction_method text NOT NULL DEFAULT 'deterministic',
  confidence_score numeric(5,4) NOT NULL DEFAULT 0,
  storage_uri text,
  warnings text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

CREATE TABLE IF NOT EXISTS knowledge_indexes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_version_id uuid NOT NULL REFERENCES standard_versions(id) ON DELETE CASCADE,
  index_name text NOT NULL,
  index_kind text NOT NULL,
  storage_uri text NOT NULL,
  embedding_provider text,
  embedding_model text,
  content_policy text NOT NULL DEFAULT 'private_runtime_only',
  status text NOT NULL DEFAULT 'building',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

CREATE TABLE IF NOT EXISTS extracted_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_version_id uuid NOT NULL REFERENCES standard_versions(id) ON DELETE CASCADE,
  standard_section_id uuid REFERENCES standard_sections(id) ON DELETE SET NULL,
  source_chunk_id text,
  requirement_summary text NOT NULL,
  requirement_type text NOT NULL,
  source_section_reference text,
  source_page_reference text,
  confidence_score numeric(5,4) NOT NULL DEFAULT 0,
  extraction_method text NOT NULL DEFAULT 'deterministic',
  status requirement_status NOT NULL DEFAULT 'draft',
  limitation_statement text NOT NULL,
  warnings text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

CREATE TABLE IF NOT EXISTS approved_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  extracted_requirement_id uuid REFERENCES extracted_requirements(id) ON DELETE SET NULL,
  standard_version_id uuid NOT NULL REFERENCES standard_versions(id) ON DELETE CASCADE,
  requirement_summary text NOT NULL,
  requirement_type text NOT NULL,
  source_section_reference text,
  source_page_reference text,
  status requirement_status NOT NULL DEFAULT 'approved',
  reviewer_id uuid NOT NULL,
  reviewer_role text NOT NULL,
  review_comment text,
  approved_at timestamptz,
  legal_review_required boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

CREATE TABLE IF NOT EXISTS rule_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  approved_requirement_id uuid REFERENCES approved_requirements(id) ON DELETE SET NULL,
  standard_version_id uuid NOT NULL REFERENCES standard_versions(id) ON DELETE CASCADE,
  standard_code text NOT NULL,
  standard_title text NOT NULL,
  publisher standard_publisher NOT NULL,
  edition text,
  name text NOT NULL,
  description text NOT NULL,
  status rule_status NOT NULL DEFAULT 'draft',
  authority_level automation_authority_level NOT NULL DEFAULT 'draft_only',
  priority integer NOT NULL DEFAULT 100,
  conflict_policy text NOT NULL DEFAULT 'most_conservative',
  effective_from date,
  retired_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

CREATE TABLE IF NOT EXISTS rule_conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_set_id uuid NOT NULL REFERENCES rule_sets(id) ON DELETE CASCADE,
  industries text[] NOT NULL DEFAULT '{}',
  asset_applicability text[] NOT NULL DEFAULT '{}',
  analysis_applicability text[] NOT NULL DEFAULT '{}',
  service_keywords text[] NOT NULL DEFAULT '{}',
  jurisdiction text[] NOT NULL DEFAULT '{}',
  condition_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  data_quality_minimum data_quality_status,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

CREATE TABLE IF NOT EXISTS calculation_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  method_key text NOT NULL,
  name text NOT NULL,
  version text NOT NULL,
  implementation_reference text NOT NULL,
  authority_level automation_authority_level NOT NULL DEFAULT 'draft_only',
  required_inputs text[] NOT NULL DEFAULT '{}',
  output_status analysis_output_status NOT NULL DEFAULT 'preliminary',
  limitation_statement text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  UNIQUE (method_key, version)
);

CREATE TABLE IF NOT EXISTS evidence_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_class text NOT NULL,
  analysis_type text NOT NULL,
  evidence_type text NOT NULL,
  description text NOT NULL,
  mandatory boolean NOT NULL DEFAULT true,
  authority_level automation_authority_level NOT NULL DEFAULT 'draft_only',
  rule_set_id uuid REFERENCES rule_sets(id) ON DELETE SET NULL,
  accepted_formats text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

CREATE TABLE IF NOT EXISTS analysis_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_type text NOT NULL,
  asset_context jsonb NOT NULL DEFAULT '{}'::jsonb,
  input_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  output_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  status analysis_output_status NOT NULL DEFAULT 'draft',
  data_quality_status data_quality_status NOT NULL DEFAULT 'missing',
  warnings text[] NOT NULL DEFAULT '{}',
  limitation_statement text NOT NULL,
  required_review_role text,
  rule_ids_used uuid[] NOT NULL DEFAULT '{}',
  standard_version_ids_used uuid[] NOT NULL DEFAULT '{}',
  calculation_method_version text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

CREATE TABLE IF NOT EXISTS analysis_findings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_run_id uuid NOT NULL REFERENCES analysis_runs(id) ON DELETE CASCADE,
  finding_type text NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  status analysis_output_status NOT NULL DEFAULT 'draft',
  severity text,
  rule_ids_used uuid[] NOT NULL DEFAULT '{}',
  citation_references jsonb NOT NULL DEFAULT '[]'::jsonb,
  required_review_role text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

CREATE TABLE IF NOT EXISTS evidence_packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_context jsonb NOT NULL DEFAULT '{}'::jsonb,
  applicable_standard_version_ids uuid[] NOT NULL DEFAULT '{}',
  required_evidence jsonb NOT NULL DEFAULT '[]'::jsonb,
  available_evidence jsonb NOT NULL DEFAULT '[]'::jsonb,
  missing_evidence jsonb NOT NULL DEFAULT '[]'::jsonb,
  data_quality_status data_quality_status NOT NULL DEFAULT 'missing',
  analysis_run_ids uuid[] NOT NULL DEFAULT '{}',
  findings jsonb NOT NULL DEFAULT '[]'::jsonb,
  citation_references jsonb NOT NULL DEFAULT '[]'::jsonb,
  limitation_statement text NOT NULL,
  output_status analysis_output_status NOT NULL DEFAULT 'draft',
  human_review_section text NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now(),
  generated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

CREATE TABLE IF NOT EXISTS review_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  required_role text NOT NULL,
  reviewer_id uuid,
  review_comment text,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

CREATE TABLE IF NOT EXISTS audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_role text NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  before_json jsonb,
  after_json jsonb,
  reason text,
  ip_address inet,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

CREATE INDEX IF NOT EXISTS idx_standard_documents_code ON standard_documents (normalized_code);
CREATE INDEX IF NOT EXISTS idx_standard_documents_publisher ON standard_documents (publisher);
CREATE INDEX IF NOT EXISTS idx_standard_documents_status ON standard_documents (status);
CREATE INDEX IF NOT EXISTS idx_standard_documents_asset_applicability ON standard_documents USING gin (asset_applicability);
CREATE INDEX IF NOT EXISTS idx_standard_documents_analysis_applicability ON standard_documents USING gin (analysis_applicability);
CREATE INDEX IF NOT EXISTS idx_standard_documents_search
  ON standard_documents USING gin (to_tsvector('simple', coalesce(standard_code, '') || ' ' || coalesce(title, '')));

CREATE INDEX IF NOT EXISTS idx_standard_versions_code ON standard_versions (standard_code);
CREATE INDEX IF NOT EXISTS idx_standard_versions_status ON standard_versions (status);
CREATE INDEX IF NOT EXISTS idx_document_chunks_version ON document_chunks (standard_version_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_metadata ON document_chunks USING gin (metadata);
CREATE INDEX IF NOT EXISTS idx_extracted_requirements_status ON extracted_requirements (status);
CREATE INDEX IF NOT EXISTS idx_approved_requirements_status ON approved_requirements (status);
CREATE INDEX IF NOT EXISTS idx_rule_sets_status ON rule_sets (status);
CREATE INDEX IF NOT EXISTS idx_rule_sets_authority ON rule_sets (authority_level);
CREATE INDEX IF NOT EXISTS idx_rule_conditions_json ON rule_conditions USING gin (condition_json);
CREATE INDEX IF NOT EXISTS idx_rule_conditions_asset ON rule_conditions USING gin (asset_applicability);
CREATE INDEX IF NOT EXISTS idx_rule_conditions_analysis ON rule_conditions USING gin (analysis_applicability);
CREATE INDEX IF NOT EXISTS idx_evidence_requirements_equipment_analysis ON evidence_requirements (equipment_class, analysis_type);
CREATE INDEX IF NOT EXISTS idx_analysis_runs_type_status ON analysis_runs (analysis_type, status);
CREATE INDEX IF NOT EXISTS idx_analysis_runs_input_json ON analysis_runs USING gin (input_json);
CREATE INDEX IF NOT EXISTS idx_audit_events_entity ON audit_events (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON audit_events (action);
