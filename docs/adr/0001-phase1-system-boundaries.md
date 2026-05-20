# ADR-0001: Phase 1 System Boundaries

- Status: Accepted
- Date: 2026-05-20
- Phase: Phase 1 (MVP Foundation)

## Context
Phase 1 requires an end-to-end generation workflow with authentication, project management, LLM access abstraction, persistence, and usage/cost logging.

## Decision
Adopt a modular monolith structure with explicit internal boundaries:
1. `src/app` for API routes and transport concerns
2. `src/core/services` for use-case orchestration
3. `src/core/providers` for LLM provider abstraction
4. `src/core/domain` for entities and business rules
5. `src/core/security` for auth/rate limit/moderation hooks
6. `src/core/observability` for logging/metrics/cost telemetry

## Consequences
- Faster delivery for MVP while preserving future extraction paths.
- Clear interfaces reduce rewrite cost in Phase 2/3.
- No distributed-service complexity in Phase 1.

## Out of Scope
- Multi-service decomposition
- Advanced workflow engine
- Multi-tenant role complexity
