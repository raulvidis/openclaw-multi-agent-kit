# Soul Template Library

This folder contains two layers:

1. **Core OpenClaw templates** (flat files in this folder) — opinionated starter roles for production teams.
2. **Extended category templates** (subfolders) — broad role catalog imported and adapted from Agency-style role libraries.

## Core Starters (recommended first)

- `orchestrator.md`
- `coding-agent.md`
- `qa-agent.md`
- `devops-agent.md`
- `research-agent.md`
- `growth-agent.md`
- `content-agent.md`
- `community-agent.md`
- `leadgen-agent.md`
- `ops-agent.md`

## Extended Categories

- `design/`
- `engineering/`
- `game-development/`
- `integrations/`
- `marketing/`
- `performance-marketing/`
- `product/`
- `project-management/`
- `sales/`
- `spatial-computing/`
- `specialized/`
- `support/`
- `testing/`

## Adaptation Checklist (before production)

- Add OpenClaw-specific routing behavior (`sessions_send`, topic/thread delivery, escalation chain).
- Add memory rules (`THESIS.md`, `SIGNALS.md`, `FEEDBACK-LOG.md`).
- Add explicit safety boundaries (external sends, deletes, credentials handling).
- Define ACK/DONE/BLOCKED handoff format for every cross-agent workflow.
- Define per-agent ownership + timeout escalation path.

## High-Impact “Spicy” OpenClaw Practices

These consistently improve real multi-agent teams:

1. **Topic-as-Team, not Topic-as-Agent**
   - One topic per workflow lane (e.g., Build, Research, Growth), with primary + secondary specialists in the same lane.

2. **ACK-first handoffs**
   - Any `sessions_send` handoff must return ACK in-topic fast, then DONE/BLOCKED later. Prevents silent drops.

3. **Failure budgets per lane**
   - Cap retries per workflow stage, then auto-escalate to orchestrator. Avoid infinite loops.

4. **Two-speed model policy**
   - Fast/default model for triage and scanning; premium model only for final synthesis/critical calls.

5. **Memory distillation rhythm**
   - Raw notes daily, distilled strategic memory weekly. Keeps recall fast and useful.

6. **Thread binding hygiene**
   - Keep long-running coding/review sessions thread-bound; close stale threads aggressively.

7. **Immutable outcome summaries**
   - End each substantial task with: context → decision → result → next action. Makes future agent onboarding painless.
