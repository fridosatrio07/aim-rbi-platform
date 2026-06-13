-- Development metadata placeholders only.
-- Do not add licensed standard text, PDF contents, chunks, embeddings, or
-- proprietary evidence to seeds in this public repository.

INSERT INTO standard_documents (
  id,
  standard_code,
  normalized_code,
  title,
  publisher,
  status,
  industries,
  asset_applicability,
  analysis_applicability,
  confidentiality,
  license_note,
  owner_organization,
  metadata_only
) VALUES
  (
    '00000000-0000-0000-0000-000000005800',
    'API 580',
    'API 580',
    'Risk-Based Inspection methodology metadata placeholder',
    'API',
    'uploaded',
    ARRAY['oil_gas','petrochemical','chemical','geothermal'],
    ARRAY['pressure_vessel','piping','storage_tank','heat_exchanger'],
    ARRAY['RBI','inspection_planning','damage_mechanism_review'],
    'licensed',
    'Metadata placeholder only. Do not commit licensed text or embeddings.',
    'SUCOFINDO AEBT development placeholder',
    true
  ),
  (
    '00000000-0000-0000-0000-000000005810',
    'API 581',
    'API 581',
    'RBI quantitative methods metadata placeholder',
    'API',
    'uploaded',
    ARRAY['oil_gas','petrochemical','chemical'],
    ARRAY['pressure_vessel','piping','storage_tank','heat_exchanger'],
    ARRAY['RBI','corrosion_assessment','inspection_planning'],
    'licensed',
    'Metadata placeholder only. Do not commit licensed text or embeddings.',
    'SUCOFINDO AEBT development placeholder',
    true
  ),
  (
    '00000000-0000-0000-0000-000000142240',
    'ISO 14224',
    'ISO 14224',
    'Reliability and maintenance data taxonomy metadata placeholder',
    'ISO',
    'uploaded',
    ARRAY['oil_gas','petrochemical','power','general_industry'],
    ARRAY['rotating_equipment','safety_system','instrumentation','electrical','other'],
    ARRAY['reliability_assessment','RBI','document_completeness'],
    'licensed',
    'Metadata placeholder only. Do not commit licensed text or embeddings.',
    'SUCOFINDO AEBT development placeholder',
    true
  ),
  (
    '00000000-0000-0000-0000-000000322021',
    'Permen ESDM 32/2021',
    'PERMEN ESDM 32/2021',
    'Indonesian energy-sector technical regulation metadata placeholder',
    'ESDM',
    'uploaded',
    ARRAY['oil_gas','geothermal'],
    ARRAY['pipeline','piping','pressure_vessel','storage_tank','geothermal_steamfield','geothermal_brine_line'],
    ARRAY['certification','PLO_readiness','document_completeness','evidence_pack'],
    'licensed',
    'Metadata placeholder only. Do not commit licensed text or embeddings.',
    'SUCOFINDO AEBT development placeholder',
    true
  ),
  (
    '00000000-0000-0000-0000-000000332021',
    'Permen ESDM 33/2021',
    'PERMEN ESDM 33/2021',
    'Indonesian energy-sector compliance regulation metadata placeholder',
    'ESDM',
    'uploaded',
    ARRAY['oil_gas','geothermal'],
    ARRAY['wellhead','pipeline','piping','safety_system','other'],
    ARRAY['certification','PLO_readiness','document_completeness','evidence_pack'],
    'licensed',
    'Metadata placeholder only. Do not commit licensed text or embeddings.',
    'SUCOFINDO AEBT development placeholder',
    true
  )
ON CONFLICT (id) DO NOTHING;
