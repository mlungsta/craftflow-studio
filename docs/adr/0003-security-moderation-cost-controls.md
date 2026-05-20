# ADR-0003: Security, Moderation, and Cost Controls Baseline

- Status: Accepted
- Date: 2026-05-20
- Phase: Phase 1 (MVP Foundation)

## Context
The platform must prevent key leakage, abuse, and runaway spend while keeping user flows fast.

## Decision
Enforce baseline controls in API orchestration layer:
1. Server-side secret management only (no frontend key exposure)
2. Authenticated generation endpoints
3. Per-user and per-IP rate limiting
4. Pre-generation moderation status recorded on request
5. Usage and cost logging on every generation attempt
6. Audit event logging for security-sensitive actions

## Consequences
- Reduced abuse and cost spikes.
- Improved operational traceability.
- Slight added request latency acceptable for MVP constraints.

## Out of Scope
- Full policy engine and adaptive anomaly detection (Phase 2+)
