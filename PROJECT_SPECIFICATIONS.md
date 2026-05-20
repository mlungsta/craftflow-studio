# PROJECT_SPECIFICATIONS.md

## Project Name
CraftFlow Studio

## Product Vision
CraftFlow Studio is a professional-grade AI creation platform focused on two core value engines: Prompt Maker and Website Maker, delivered with predictable quality, strong governance, and disciplined cost control.

## Strategic Objective
Deliver a secure, scalable AI application that provides best-in-class Prompt Maker and Website Maker workflows while maintaining strict token efficiency and enterprise-level engineering standards.

## Core Product Principles
1. Reliability over novelty.
2. Security by default.
3. Cost-aware intelligence.
4. Deterministic engineering workflows.
5. Phased delivery with explicit change control.
6. Focused scope over feature sprawl.

## Target Users (MVP)
1. Founders and solo operators creating digital assets.
2. Small business teams producing monetizable digital products.
3. Agencies requiring repeatable prompt and storefront generation workflows.

## MVP Problem Statement
Users need high-quality prompt engineering and storefront generation without unstable prompts, runaway token costs, or fragmented multi-tool workflows.

## MVP Outcome
A user can authenticate, create a project, generate expert-level prompts via guided questionnaires, generate a storefront package via guided website workflow, save versioned outputs, and monitor usage/cost in-app.

## MVP Product Scope Lock
Phase 1 is strictly limited to:
1. Prompt Maker (Business Blueprint + Digital Product flows)
2. Website Maker (opinionated storefront generation flow)

All other legacy/original-platform tools are explicitly deferred.

## In-Scope (MVP)
1. Auth and user session management.
2. Project/workspace creation.
3. Prompt Maker questionnaire engine and prompt compiler.
4. Prompt output variants by target model format.
5. Website Maker questionnaire engine and output package generation.
6. Provider/model abstraction layer.
7. Saved generations + version history.
8. Usage and cost observability dashboard (MVP level).
9. Basic moderation and abuse controls.

## Out-of-Scope (Until Later Phases)
1. Product Research module.
2. Competitor Analyzer module.
3. Image Maker standalone module.
4. Video Maker module.
5. Ad Library module.
6. Team RBAC depth beyond basic roles.
7. Advanced collaboration workflows.
8. Marketplace/plugin ecosystem.
9. Autonomous multi-agent orchestration.
10. Native mobile apps.

## Non-Functional Requirements
1. Security
- Secrets in server-side environment only.
- Encryption in transit and at rest.
- Basic audit trails for sensitive actions.

2. Performance
- P95 response target for synchronous requests documented per endpoint.
- Long-running website generation operations shifted to async queue.

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
- Prompt Maker flow UI
- Website Maker flow UI
- Projects, generation history, usage views

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
3. prompt_blueprint_requests
4. prompt_product_requests
5. website_generation_requests
6. generations
7. artifacts
8. usage_logs
9. audit_events

## Security Controls
1. API key isolation and secret vault usage.
2. Per-user and per-IP rate limits.
3. Payload validation and input sanitation.
4. Prompt injection risk controls for tool-connected operations.
5. Content moderation prior to expensive model calls.

## Acceptance Criteria (MVP)
1. A new user can complete Business Blueprint prompt flow within 5 minutes.
2. A new user can complete Digital Product prompt flow within 5 minutes.
3. A new user can complete Website Maker generation flow end-to-end.
4. Every generation request produces usage and cost telemetry.
5. No provider secret appears in browser-accessible code.
6. Generation history is queryable and restorable by project.
7. Phase-1 scope is delivered without leakage into deferred tools.

## Governance
This specification is normative for build decisions. Any contradiction must be escalated and resolved by explicit user instruction.
