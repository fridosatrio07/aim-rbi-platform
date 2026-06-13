# AI Governance And Human Review

The platform is an engineering decision-support system, not an autonomous technical authority.

Allowed assisted outputs include:

- applicable standards/regulations;
- document/evidence completeness;
- simple corrosion rate;
- conservative due date;
- preliminary risk ranking;
- draft inspection plan;
- draft finding/recommendation;
- data insufficiency warnings;
- draft evidence pack with traceable references.

Outputs that require human review or are blocked from final automatic issue:

- safe, fit-for-service, fit-for-operation, or layak operasi declarations;
- inspection interval extension beyond statutory, owner, or regulator limits;
- final FFS/RLA conclusion;
- final PLO/certificate readiness;
- risk acceptance criteria change;
- repair, alteration, or rerating approval;
- final critical damage mechanism conclusion without corrosion/materials engineer review.

Use these output statuses consistently:

- `draft`
- `preliminary`
- `requires_engineer_review`
- `approved_by_engineer`
- `rejected`

Every AI/rule-assisted output must include input data, rule IDs, standard/regulation metadata, calculation method version, warnings, limitation statement, output status, required review role, timestamp, and audit event.
