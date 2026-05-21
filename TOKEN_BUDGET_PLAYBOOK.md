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

## Phase Budgets (Baseline)
### Phase 1 Budget
- Total cap: 4,000,000 tokens

### Phase 2 Budget
- Total cap: 3,500,000 tokens

### Phase 3 Budget
- Total cap: 5,000,000 tokens

### Phase 4 Budget
- Total cap: 4,500,000 tokens
- Allocation:
  1. Reliability/SRE hardening: 28%
  2. Security/compliance implementation: 20%
  3. Commercial operations and analytics: 18%
  4. Product optimization experiments: 18%
  5. Incident/rollback drills and docs: 10%
  6. Reserve: 6%

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
