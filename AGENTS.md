# AGENTS.md

## Mission Lock
This repository builds **Digital Maker AI** with a strict phased delivery model. The phase model is locked and must not be changed unless the user explicitly states a change request in writing.

## Non-Deviation Rule
- Do not deviate from the current phase scope.
- Do not implement future-phase features early.
- If a requested change conflicts with current phase scope, pause and request explicit user confirmation.

## Authoritative Documents (Priority Order)
1. `PROJECT_SPECIFICATIONS.md`
2. `PHASE_PLAN.md`
3. `TOKEN_BUDGET_PLAYBOOK.md`
4. `AGENTS.md`

If documents conflict, higher-priority document wins.

## Engineering Operating Standard (Senior-Only)
- Architecture-first, code-second.
- No ambiguous implementations.
- Every change maps to approved requirements.
- Every PR/change includes assumptions, risks, and validation steps.
- No hidden behavior or silent side effects.

## Prompting Discipline for Codex
All implementation prompts must include:
1. Objective
2. Phase + scope boundary
3. In-scope files only
4. Constraints (security, performance, cost)
5. Output contract (diff or full file)
6. Acceptance checks

## Token Discipline
- Follow `TOKEN_BUDGET_PLAYBOOK.md` caps.
- Prefer minimal context and precise diffs.
- Max 2 retries per task before root-cause analysis.

## Security Baseline (Always On)
- Never expose provider API keys in frontend code.
- Secrets only in server-side env management.
- Apply auth, rate limits, and audit logging for all generation endpoints.
- Add moderation/abuse checks before expensive model calls.

## Done Criteria (Per Task)
A task is complete only if:
- Requirements met for current phase.
- Tests/checks pass (or clearly documented if unavailable).
- Token/cost impact acknowledged.
- Documentation updated when behavior changes.

## Change Control
Any of these require explicit user approval:
- Phase order change
- Major architecture change
- Provider strategy change
- Security model change
- Budget cap overrides
