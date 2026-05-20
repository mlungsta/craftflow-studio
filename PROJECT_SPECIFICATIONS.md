# PROJECT_SPECIFICATIONS.md

## Project Name
Digital Maker AI

## Product Vision
Digital Maker AI is a professional-grade AI creation platform that transforms user intent into high-value digital outputs with predictable quality, strong governance, and disciplined cost control.

## Strategic Objective
Deliver a secure, scalable, multi-model AI application that supports creative and production workflows while maintaining strict token efficiency and enterprise-level engineering standards.

## Core Product Principles
1. Reliability over novelty.
2. Security by default.
3. Cost-aware intelligence.
4. Deterministic engineering workflows.
5. Phased delivery with explicit change control.

## Target Users (MVP)
1. Founders and solo operators creating digital assets.
2. Small business teams producing marketing and product content.
3. Agencies requiring repeatable AI-assisted output workflows.

## MVP Problem Statement
Users need high-quality AI output without unstable prompts, runaway token costs, or fragmented workflows across multiple tools.

## MVP Outcome
A user can authenticate, create a project, submit a structured request, generate output through controlled LLM routing, save versioned results, and monitor usage/cost in-app.

## In-Scope (MVP)
1. Auth and user session management.
2. Project/workspace creation.
3. Prompt submission and generation pipeline.
4. Provider/model abstraction layer.
5. Saved generations + history.
6. Usage and cost observability dashboard (MVP level).
7. Basic moderation and abuse controls.

## Out-of-Scope (Until Later Phases)
1. Team RBAC depth beyond basic roles.
2. Advanced collaboration workflows.
3. Marketplace/plugin ecosystem.
4. Autonomous multi-agent orchestration.
5. Native mobile apps.

## Non-Functional Requirements
1. Security
- Secrets in server-side environment only.
- Encryption in transit and at rest.
- Basic audit trails for sensitive actions.

2. Performance
- P95 response target for synchronous requests documented per endpoint.
- Long-running jobs shifted to async queue.

3. Cost Governance
- Token/cost tracking for every generation.
- Budget guardrails and soft limits in MVP.

4. Maintainability
- Modular architecture.
- Typed contracts across frontend-backend boundaries.
- Phase-locked documentation updates.

## Proposed Technical Baseline
- Frontend: Next.js (App Router) + TypeScript
- Backend: API routes / service layer with provider abstraction
- Database: PostgreSQL
- Queue: Background job worker for long generations
- Storage: Object storage for generated artifacts
- Auth: Secure session-based or JWT with HTTP-only token handling

## Logical Architecture
1. Client Layer
- Prompt UI, projects, generation history, usage views.

2. API Orchestration Layer
- Request validation
- AuthZ/AuthN
- Rate limit checks
- Moderation pre-check
- Model routing decision

3. LLM Provider Layer
- Unified interface for multiple providers
- Retry/fallback policy
- Usage/cost normalization

4. Persistence Layer
- Users, projects, generations, artifacts, usage logs, audit records

5. Observability Layer
- Logs, latency metrics, error metrics, token/cost metrics

## Core Domain Entities (MVP)
1. users
2. projects
3. generation_requests
4. generations
5. artifacts
6. usage_logs
7. provider_configs (internal/admin)
8. audit_events

## Security Controls
1. API key isolation and secret vault usage.
2. Per-user and per-IP rate limits.
3. Payload validation and input sanitation.
4. Prompt injection risk controls for tool-connected operations.
5. Content moderation prior to expensive model calls.

## Acceptance Criteria (MVP)
1. A new user can complete first generation within 5 minutes.
2. Every generation request produces usage and cost telemetry.
3. No provider secret appears in browser-accessible code.
4. Generation history is queryable and restorable by project.
5. Phase-1 scope can be delivered without phase leakage.

## Governance
This specification is normative for build decisions. Any contradiction must be escalated and resolved by explicit user instruction.
