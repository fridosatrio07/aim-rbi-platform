# Analysis Authority Boundaries

Authority levels:

- `automatic_allowed`: the system may compute and present a result automatically with cited basis.
- `draft_only`: the system may produce a draft that requires engineer/SME review.
- `human_approval_required`: the system must not activate final output without review.
- `prohibited`: the system blocks final action and explains why.

Conservative conflict resolution:

- select the earliest valid due date among statutory, regulator, owner, RBI, recommendation, and approved manual override candidates;
- do not automatically use RBI intervals that are longer than statutory, owner, or regulator limits;
- flag shorter RBI/risk-driven recommendations as conservative recommendations requiring engineer review where appropriate;
- if data quality is missing, assumed, or partially verified, downgrade confidence and require review.

Evidence packs, analysis sandbox outputs, inspection plans, findings, recommendations, and risk rankings must remain draft/preliminary unless the responsible human reviewer approves them through the workflow.
