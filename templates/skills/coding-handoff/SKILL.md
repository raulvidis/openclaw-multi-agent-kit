---
name: coding-handoff
description: Standardize coding handoffs between builder, QA, and deploy agents. Use when a coding task moves across stages and requires strict ACK/DONE/BLOCKED status updates, branch metadata, and PR readiness checks.
---

# Coding Handoff Skill

## Required Handoff Envelope

Always send handoff messages using:

- `from`
- `to`
- `task_id`
- `priority` (P1/P2/P3)
- `summary`
- `context` (branch, commit, environment)
- `done_when` (checklist)
- `deliver_to` (topic/channel target)

## Lifecycle

1. Post `ACK` quickly with ownership and ETA.
2. Execute scoped checks.
3. Post `DONE` with evidence (tests, logs, diff summary) or `BLOCKED` with explicit unblock requirements.

## PR Readiness Gate

Before DONE, verify:

- lint/type/test status
- regression risk notes
- rollback note
- unresolved TODOs list

If any gate fails, return BLOCKED, not DONE.
