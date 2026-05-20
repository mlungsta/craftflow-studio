# Phase 1 System Design

## Objective
Define the implementation-ready architecture contract for Phase 1 MVP foundation.

## Request Lifecycle (Generation)
1. Client sends `POST /v1/generations` with project ID, task type, prompt, and optional context.
2. API layer validates auth, ownership, payload shape, rate limits, and idempotency.
3. Moderation pre-check sets `generation_requests.moderation_status`.
4. If blocked, request is recorded and returned as rejected.
5. If approved, generation record is created in `queued` status.
6. Service layer invokes provider abstraction contract.
7. Result is normalized and persisted in `generations`.
8. Usage telemetry is always written to `usage_logs`.
9. Audit event is written for security/traceability.
10. Client fetches generation status via `GET /v1/generations/{generationId}`.

## Phase 1 Modules
- `src/app/api`: transport and route handlers
- `src/core/services`: generation/project/auth use cases
- `src/core/providers`: provider adapter interface + first provider implementation
- `src/core/security`: auth, rate limit, moderation hooks
- `src/core/observability`: logger, metrics, usage recorder
- `src/core/domain`: entity and policy contracts

## Security-Critical Invariants
1. Provider keys are server-side only.
2. Every generation has a usage record.
3. Every rejected/failed generation preserves traceability state.
4. Project access is user-scoped.

## API-DB Contract Mapping
- `/v1/projects` <-> `projects`
- `/v1/generations` <-> `generation_requests`, `generations`
- `/v1/usage/summary` <-> aggregate over `usage_logs`

## Phase Boundary Guardrails
Not allowed in this phase:
1. Team/org RBAC depth
2. Billing subscription enforcement
3. Dynamic cross-provider intelligent routing engine
4. Marketplace/plugin framework
