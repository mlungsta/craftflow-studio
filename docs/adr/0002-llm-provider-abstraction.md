# ADR-0002: LLM Provider Abstraction Contract

- Status: Accepted
- Date: 2026-05-20
- Phase: Phase 1 (MVP Foundation)

## Context
MVP uses one provider initially but must be architecture-ready for multiple providers without endpoint redesign.

## Decision
Define a provider interface contract with normalized request/response payloads:
1. `generate(input, options) -> GenerationResult`
2. Required normalized outputs:
- `output_text`
- `input_tokens`, `output_tokens`, `total_tokens`
- `latency_ms`
- `provider_name`, `model_name`
- `finish_reason`

All API and database contracts persist normalized telemetry independent of provider-native response shapes.

## Consequences
- Enables provider switch/fallback with minimal downstream change.
- Supports stable usage and cost analytics.
- Reduces vendor lock-in.

## Out of Scope
- Dynamic per-request provider orchestration policy engine (Phase 3)
