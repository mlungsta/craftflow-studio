# TOKEN_BUDGET_PLAYBOOK.md

## Purpose
Control token spend while preserving senior-level output quality through deterministic prompting, routing, and iteration governance.

## Global Policies
1. Prompt Precision Policy
- Every prompt must include objective, constraints, files-in-scope, expected output format, and acceptance checks.

2. Context Minimalism Policy
- Include only relevant files/interfaces.
- Prefer summaries + explicit contracts over dumping full repository context.

3. Iteration Stop-Loss
- Max 2 iterations per discrete task.
- If unresolved after 2 iterations: stop, run root-cause analysis, then re-plan.

4. Model Tiering
- Tier A (premium): architecture, critical path logic, final review.
- Tier B (mid): implementation details, refactors.
- Tier C (economy): formatting, boilerplate, straightforward tests.

5. Output Contract
- Request diffs by default.
- Full files only for new files or major structural rewrites.

## Phase Budgets (Initial Baseline)
### Phase 1 Budget
- Total cap: 4,000,000 tokens
- Allocation:
  1. Architecture/spec refinement: 12%
  2. Core backend implementation: 30%
  3. Frontend implementation: 22%
  4. Testing/validation: 16%
  5. Debugging/rework reserve: 12%
  6. Documentation/ops notes: 8%

### Phase 2 Budget
- Total cap: 3,500,000 tokens
- Allocation emphasizes reliability and UX hardening.

### Phase 3 Budget
- Total cap: 5,000,000 tokens
- Allocation emphasizes scale, multi-model routing, and billing controls.

## Task-Level Budgeting
For each task, define:
1. Planned token cap
2. Allowed model tier
3. Maximum iterations
4. Pass/fail acceptance tests

If planned cap is exceeded by >20%, freeze and review root cause before continuing.

## Waste Patterns to Avoid
1. Unbounded exploratory prompts.
2. Rewriting entire files for small changes.
3. Re-litigating settled architecture decisions.
4. Parallel changes without stable interface contracts.

## Senior Prompt Templates (Condensed)
### Template A: Architecture Decision
- Objective
- Current constraints
- Alternatives (max 3)
- Recommended option with tradeoffs
- Decision output format

### Template B: Implementation Task
- Objective
- Phase and scope boundary
- Files in scope
- Required changes
- Tests to add/run
- Return format (diff + rationale + validation)

### Template C: Debugging Task
- Symptom
- Repro steps
- Expected vs actual
- Suspected root causes
- Required proof for fix

## Quality Gates Before Closing Any Task
1. Requirement traceability complete.
2. Security constraints respected.
3. Tests and checks passed (or documented blockers).
4. Token usage within task budget or justified.

## Reporting Cadence
- Maintain a running phase burn log:
  1. Task name
  2. Planned vs actual tokens
  3. Variance reason
  4. Corrective action

## Override Rules
Budget overrides require explicit user approval with:
1. Reason for overrun
2. Expected additional value
3. Revised cap
4. Risk of continuing vs stopping
