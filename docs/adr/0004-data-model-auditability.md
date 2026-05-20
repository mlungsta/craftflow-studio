# ADR-0004: Data Model and Auditability Baseline

- Status: Accepted
- Date: 2026-05-20
- Phase: Phase 1 (MVP Foundation)

## Context
Phase 1 requires persistent projects, generation history, and complete usage/cost telemetry with auditability.

## Decision
Adopt PostgreSQL schema with normalized entities:
1. `users`, `projects`
2. `generation_requests`, `generations`, `artifacts`
3. `usage_logs`, `audit_events`

Design priorities:
- Referential integrity for project-bound history
- Immutable usage logs
- Query efficiency for project timeline and cost summaries

## Consequences
- Enables clear product history and billing analytics.
- Supports incident investigation and replay context.

## Out of Scope
- Advanced partitioning and warehousing strategy (Phase 3)
