# PHASE_PLAN.md

## Phase Lock Statement
Phases are locked. Work must follow sequence. No scope jump is allowed unless the user explicitly approves a phase change.

## Phase 1: MVP Foundation (Two-Track Lock)
Phase 1 is split into two mandatory tracks and must be delivered in order:
1. Phase 1A: Prompt Maker
2. Phase 1B: Website Maker

No other product modules are allowed in Phase 1 implementation.

## Phase 1A: Prompt Maker (Primary Track)
### Goal
Deliver a high-quality guided prompt system that compiles deterministic, model-targeted prompts with strong token efficiency.

### In-Scope
1. Prompt Maker tool selection and entry flow.
2. Two guided paths:
- Business Blueprint
- Digital Product
3. Multi-step questionnaire engine.
4. Prompt compiler that converts questionnaire data into final prompts.
5. Provider/model target output variants (ChatGPT, Claude, Gemini format variants).
6. Prompt version history per project.
7. Regenerate-by-section behavior for weak prompt sections.
8. Usage/token/cost telemetry on every prompt generation.

### Deliverables
1. Prompt Maker UI flow end-to-end.
2. Prompt schema definitions and validation.
3. Prompt generation API contract and persistence.
4. Saved prompt history with version retrieval.
5. Basic quality scoring (clarity/specificity/constraints checks).

### Exit Criteria
- User can complete Business Blueprint prompt flow end-to-end.
- User can complete Digital Product prompt flow end-to-end.
- Prompt outputs are reproducible from saved questionnaire state.
- Token/cost telemetry captured for 100% of prompt generations.

## Phase 1B: Website Maker (Secondary Track)
### Goal
Deliver an opinionated website generation workflow for digital product storefront creation.

### In-Scope
1. Guided Website Maker wizard (products, audience, color, store details, review/generate).
2. One constrained output target for MVP (Shopify-ready theme/content package).
3. Structured content generation for essential store sections.
4. Image prompt pack generation for store visual assets.
5. Brand/style token output (palette, typography, tone directives).
6. Generation status tracking and result history.
7. Usage/token/cost telemetry on every website generation.

### Deliverables
1. Website Maker UI flow end-to-end.
2. Website generation API and async status retrieval.
3. Generated output package contract (content blocks + style tokens + setup checklist).
4. Saved website generation history per project.

### Exit Criteria
- User can complete Website Maker flow from questionnaire to output package.
- Output package is consistent with chosen audience/product inputs.
- Generation status and history are queryable.
- Token/cost telemetry captured for 100% of website generations.

## Phase 1 Explicitly Deferred
The following are locked out of Phase 1 implementation:
1. Product Research module.
2. Competitor Analyzer module.
3. Image Maker standalone module.
4. Video Maker module.
5. Ad Library module.
6. Broad "all-in-one" multi-tool parity goals beyond Prompt Maker + Website Maker.

## Phase 2: Product Hardening
### Goal
Improve reliability, output quality, and workflow polish for Prompt Maker and Website Maker.

### Scope
1. Better regeneration controls and quality diagnostics.
2. Enhanced async processing and retries.
3. Rich template libraries for prompt and website generation.
4. Expanded observability and alerting.
5. Export and retention improvements.

### Exit Criteria
- Failed generation recovery paths are reliable.
- UX supports practical daily usage for target users.
- Production incident triage metrics are available.

## Phase 3: Scale and Differentiation
### Goal
Add advanced capabilities and business-critical controls.

### Scope
1. Multi-model dynamic routing by task profile.
2. Team collaboration features (roles, shared projects).
3. Billing integration and plan enforcement.
4. Advanced workflow tools and automation hooks.
5. Performance/cost optimization loops.

### Exit Criteria
- Multi-tenant operational controls are stable.
- Billing and usage enforcement are accurate.
- Platform can scale without architecture rewrite.

## Change Management Rules
1. No phase work starts before prior phase exit criteria are met or waived.
2. Every new feature request must be mapped to a phase before implementation.
3. Emergency changes must still be documented with rationale and rollback notes.
4. Any addition of tools outside Prompt Maker and Website Maker in Phase 1 requires explicit user approval.
