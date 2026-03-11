# Telegram Channel Architecture (Production Pattern)

Use this when your team grows beyond 3-4 agents and routing starts getting messy.

## Core Rule

Design channels as **workflow lanes**, not personality rooms.

Bad:
- Topic per agent (`Connor`, `Kara`, `Hank`, ...)

Good:
- Topic per flow (`Build`, `Research`, `Growth`, `Ops`)

## Recommended Topic Map

- `General` — orchestrator + high-level decisions
- `Build` — coding, QA, DevOps handoffs
- `Research` — market, competitor, trend analysis
- `Growth` — content + paid + experimentation
- `Leads` — lead sourcing + enrichment + qualification
- `Ops` — calendar/email/admin workflows
- `Incidents` — priority alerts and production issues

## Ownership Model

For every topic, define:

- **Primary owner** (drives output, `requireMention: false`)
- **Secondary specialists** (support only, `requireMention: true`)

Never set two bots to `requireMention: false` in one topic.

## Mention Policy

- `General`: mention-required for all specialists
- domain topics (`Build`, `Research`, etc.): only primary auto-responds
- high-noise topics: mention-required for everyone

## Handoff Contract (mandatory)

Use `sessions_send` with strict lifecycle messages:

1. `ACK` — immediate, confirms ownership
2. `DONE` — result + deliver_to + summary
3. `BLOCKED` — explicit blocker + required input

No free-form handoffs in production.

## ACL & Safety

- Use allowlists for group/topic access
- Keep external messaging permissions restricted per role
- Restrict write/delete/exec capabilities for non-technical agents
- Keep secrets out of shared workspace files

## Observability

Track lane-level metrics:

- ACK latency
- completion latency
- blocked rate
- escalation rate
- rework rate

## Escalation Tree

Topic primary escalates to orchestrator when:

- blocked > 30 min
- ambiguity in business decision
- security/risk/public-facing uncertainty

## Configuration Checklist

- topic IDs documented in `SUPERGROUP-MAP.md`
- bindings deterministic and explicit
- only one primary responder per topic
- secondary responders mention-gated
- handoff format standardized and enforced
