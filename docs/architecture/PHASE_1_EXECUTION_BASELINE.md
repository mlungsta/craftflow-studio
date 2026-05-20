# PHASE_1_EXECUTION_BASELINE.md

## Purpose
This document defines the Phase 1 baseline structure and traceability contracts for implementation.

## Scope Lock
This baseline is strictly constrained to Phase 1 in `PHASE_PLAN.md`, which is locked to:
1. Phase 1A: Prompt Maker
2. Phase 1B: Website Maker

## Deliverables Created
1. `/docs/adr` for architecture decisions
2. `/docs/contracts/openapi.phase1.yaml` for API contract
3. `/db/schema.sql` and `/db/migrations/0001_phase1_init.sql` for persistence baseline
4. `/docs/architecture/phase1-system-design.md` for system-level behavior

## Requirement Traceability Map (Updated)
1. Auth and user session management -> OpenAPI `POST /v1/auth/session`, `DELETE /v1/auth/session`
2. Project management -> OpenAPI `/v1/projects` + DB `projects`
3. Prompt Maker generation pipeline -> OpenAPI prompt endpoints + DB prompt request tables + `generations`
4. Website Maker generation pipeline -> OpenAPI website endpoints + DB website request tables + `generations`
5. Provider abstraction readiness -> ADR-0002 + schema fields for provider/model metadata
6. History/versioning -> DB `generations`, `artifacts`
7. Usage/token/cost logging -> DB `usage_logs` + OpenAPI usage endpoint
8. Moderation/abuse baseline -> OpenAPI moderation status + ADR-0003
9. Cost visibility -> OpenAPI usage summary endpoint

## Phase 1A Implementation Guardrails
- Only implement Prompt Maker user flows:
  1. Business Blueprint
  2. Digital Product
- Prompt compiler must produce deterministic output format.
- Save questionnaire state and generated prompt version history.

## Phase 1B Implementation Guardrails
- Only implement Website Maker flow for one constrained storefront package output.
- Do not implement broad website-builder permutations in Phase 1.
- Preserve async generation pattern and full telemetry logging.

## Explicitly Deferred in Phase 1
1. Product Research
2. Competitor Analyzer
3. Image Maker standalone
4. Video Maker
5. Ad Library

## Constraints
- No Phase 2/3 features may be implemented from this baseline.
- Any contract expansion must include phase classification.
- Any scope expansion beyond Prompt Maker + Website Maker requires explicit user approval.
