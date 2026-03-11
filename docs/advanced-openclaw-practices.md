# Advanced OpenClaw Practices (That Actually Work)

This is a pragmatic playbook for operating multi-agent teams in production.

## 1) Deterministic Routing First

Use explicit bindings for critical routes; keep wildcard fallbacks last.

Why: routing ambiguity is the #1 hidden source of "wrong agent answered" incidents.

Reference: OpenClaw multi-agent routing and binding precedence.

## 2) Topic Ownership + Secondary Responders

Treat each topic as a workflow lane:

- Primary agent owns throughput and final output quality.
- Secondary specialists are triggered via `sessions_send` for depth work.

Why: this balances speed and specialization without context fragmentation.

## 3) Strict Handoff Contract (ACK / DONE / BLOCKED)

Never do free-form handoffs in production pipelines.

Minimum contract:

- `ACK` within short SLA
- `DONE` with delivery location + outcome summary
- `BLOCKED` with required unblock input

Why: prevents silent dead-ends and makes orchestration measurable.

## 4) Session Scope Discipline

Use thread-bound/persistent sessions for long coding or research runs.
Use one-shot runs for isolated tasks.

Why: prevents context bloat while preserving continuity where needed.

## 5) Two-Speed Model Policy

Default model handles triage, scraping, and formatting.
Premium model handles synthesis, architecture, and high-risk decisions.

Why: strongest quality/cost ratio in live teams.

## 6) Memory Distillation Cadence

Daily: append raw operational memory.
Weekly: distill into durable playbooks and decision logs.

Why: avoids memory rot and token-heavy recall.

## 7) Escalation Budgets

Set max retries per workflow stage, then auto-escalate.

Why: kills infinite retry loops and hidden stalls.

## 8) Safety-by-Default Tool Policies

Restrict risky tools per agent role (write/delete/exec/network actions).
Expand only when the workflow proves stable.

Why: limits blast radius during early iterations.

## 9) Operational SLOs for Agents

Track per-lane metrics:

- ACK latency
- Completion latency
- Blocked rate
- Rework rate

Why: agent teams improve when measured like real systems.

## 10) Final Output Schema

Every substantial task should end with:

- Context
- Decision
- Result
- Next Action

Why: this makes downstream handoffs and human review dramatically easier.
