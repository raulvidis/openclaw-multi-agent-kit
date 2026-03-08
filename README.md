# OpenClaw Agents — Multi-Agent Telegram Supergroup Templates

> **Production-tested templates for building AI agent teams on [OpenClaw](https://openclaw.sh) with Telegram supergroup integration.**

This is an **OpenClaw-specific** project. These templates are designed to run on the OpenClaw platform — they use OpenClaw's agent system, workspace structure, session management, `sessions_send` for bot-to-bot communication, and Telegram channel bindings. If you're not running OpenClaw, these won't work out of the box.

Built from a real production setup running 10 autonomous agents coordinated through a Telegram supergroup with dedicated topic channels. Each agent has its own bot, personality, workspace, and domain expertise.

---

## Credits & Inspiration

Agent personality patterns and the concept of specialized AI agent divisions are inspired by **[The Agency](https://github.com/msitarzewski/agency-agents)** by [@msitarzewski](https://github.com/msitarzewski) — a collection of 55+ specialized AI agent personalities built for Claude Code. Great resource for agent design philosophy, personality crafting, and workflow patterns regardless of what platform you run.

What we build here is different: the **operational infrastructure** for running those kinds of agents as a live, coordinated team on OpenClaw — with Telegram supergroups, shared context files, bot-to-bot triggers, cron schedules, topic-based team channels, and structured escalation chains.

---

## What Is This?

A complete template kit for deploying a multi-agent team on **OpenClaw + Telegram**:

- **SOUL.md templates** — Agent personality and behavior definitions
- **IDENTITY.md templates** — Agent metadata and capabilities
- **Workspace templates** — Shared context, memory, and coordination files
- **openclaw.json snippets** — Configuration for agents, bindings, channels, and teams
- **AI Instructions** — Step-by-step setup guide written for AI agents to follow
- **Architecture docs** — How agents communicate, escalate, and share context

---

## Architecture Overview

```
                    ┌──────────┐
                    │  You 👑   │
                    └────┬─────┘
                         │
                    ┌────▼─────┐
                    │Lead Agent│ Orchestrator
                    └────┬─────┘
          ┌──────────────┼──────────────┐
          │              │              │
    ┌─────▼─────┐  ┌────▼────┐  ┌─────▼─────┐
    │ RESEARCH  │  │  BUILD  │  │  MARKET   │
    │  Team     │  │  Team   │  │  Team     │
    └─────┬─────┘  └────┬────┘  └─────┬─────┘
          │              │              │
    Research +     Code → QA →    Content +
    Analytics      Deploy          Community
```

### Key Concepts

- **Two Telegram routing models** — choose between multi-bot routing and native topic `agentId` routing
- **Multi-bot routing** — Each agent has its own Telegram bot token and visible identity
- **Native topic routing** — One Telegram bot can route different topics to different internal agents via `topics.<id>.agentId`
- **One topic per team** — Teams share a topic channel in a supergroup
- **Primary + Secondary agents** — Primary owns the topic; secondary responds when mentioned or triggered
- **Shared context via files** — Agents coordinate through shared markdown files, not APIs
- **Structured escalation** — Clear rules for when to escalate up the chain

### Important Telegram Routing Caveat

In native topic routing, `agentId` controls the **internal OpenClaw agent** that handles the message — workspace, memory, tools, prompt, model, session.

It does **not** control the **visible Telegram bot identity**.

So this:

```json5
"13": { agentId: "connor" }
```

means Topic 13 is handled by the `connor` agent internally, but replies still come from whichever Telegram account is attached to that group/topic (often the default/orchestrator bot).

Use this rule of thumb:

- **Want one visible bot with many internal specialist brains?** Use native topic routing.
- **Want Connor to look like Connor and Kara to look like Kara?** Use multi-bot routing.

---

## Quick Start

### For Humans

See [`docs/supergroup-setup.md`](docs/supergroup-setup.md) for the full step-by-step guide.

### For AI Agents

See [`INSTRUCTIONS.md`](INSTRUCTIONS.md) — a complete setup guide written specifically for AI agents to follow. Give it to your orchestrator agent and let it handle the setup.

---

## Templates

### Soul Templates (Agent Personalities)

| Template | Role |
|----------|------|
| [Orchestrator](templates/soul/orchestrator.md) | Lead agent — coordinates all others |
| [Coding Agent](templates/soul/coding-agent.md) | Software engineering specialist |
| [QA Agent](templates/soul/qa-agent.md) | Testing and quality assurance |
| [DevOps Agent](templates/soul/devops-agent.md) | Infrastructure and deployment |
| [Research Agent](templates/soul/research-agent.md) | Market research and intelligence |
| [Growth Agent](templates/soul/growth-agent.md) | Analytics and growth experiments |
| [Content Agent](templates/soul/content-agent.md) | Social media content creation |
| [Community Agent](templates/soul/community-agent.md) | Community engagement (Reddit, forums) |
| [Lead Gen Agent](templates/soul/leadgen-agent.md) | Prospect research and lead scoring |
| [Ops Agent](templates/soul/ops-agent.md) | Email, calendar, and data management |

### Identity Template

| Template | Purpose |
|----------|---------|
| [Agent Identity](templates/identity/agent-identity.md) | Standard identity template for any agent |

### Workspace Templates

| Template | Purpose |
|----------|---------|
| [THESIS.md](templates/workspace/THESIS.md) | Business thesis — north star for all agents |
| [SIGNALS.md](templates/workspace/SIGNALS.md) | Shared intelligence hub |
| [FEEDBACK-LOG.md](templates/workspace/FEEDBACK-LOG.md) | Style corrections and lessons |
| [SUPERGROUP-MAP.md](templates/workspace/SUPERGROUP-MAP.md) | Topic and agent mapping |
| [AGENTS.md](templates/workspace/AGENTS.md) | Orchestrator operations guide |

---

## Team Configurations

### Build Team (Code > QA > Deploy)

**Topic:** Single shared topic
**Agents:** Coder (primary) + QA (secondary) + DevOps (secondary)
**Flow:** Coder builds > triggers QA via `sessions_send` > QA tests > triggers DevOps > DevOps deploys

### Research Team

**Topic:** Single shared topic
**Agents:** Researcher (primary) + Growth Analyst (secondary)
**Flow:** Researcher posts findings > triggers Analyst for metrics/experiments

### Social Team

**Topic:** Single shared topic
**Agents:** Content Creator (primary) + Community Manager (secondary)
**Flow:** Content posted on Twitter <> adapted for Reddit, cross-pollination of insights

---

## Agent Communication

### Bot-to-Bot via sessions_send

Telegram bots **cannot** see each other's messages. This is a Telegram limitation. Use OpenClaw's `sessions_send` to trigger teammates.

Use the enforced handoff format documented here:
- [Inter-Agent Handoff Standard](docs/inter-agent-handoff-standard.md)

Quick example:

```
sessions_send(agentId="qa-agent", message="HANDOFF\nfrom: coder\nto: qa\ntask_id: build-142\npriority: P1\nsummary: Validate checkout fix\ncontext: branch=fix/coupon-rounding\ndeliver_to: telegram:-1001234567890:13\ndeadline: asap\ndone_when:\n- Repro no longer fails\n- Regression checks pass")
```

The receiving agent gets the message as a new session input and posts ACK + DONE updates in the shared topic.

### Shared Context via Files

| File | Purpose |
|------|---------|
| `THESIS.md` | Business direction — all agents read |
| `SIGNALS.md` | Intelligence hub — research writes, everyone reads |
| `FEEDBACK-LOG.md` | Style corrections — any agent writes, all read |

---

## Examples

- [`examples/full-team.json`](examples/full-team.json) — Complete 10-agent team config
- [`examples/minimal-team.json`](examples/minimal-team.json) — Minimal 3-agent setup (orchestrator + coder + QA)

---

## Docs

- [INSTRUCTIONS.md](INSTRUCTIONS.md) — **AI-readable setup guide** (give this to your agent)
- [Agent Design Patterns](docs/agent-design-patterns.md) — How to write effective SOUL.md files
- [Supergroup Setup Guide](docs/supergroup-setup.md) — Step-by-step Telegram setup
- [Scaling Your Team](docs/scaling.md) — Adding new agents and teams

---

## Contributing

PRs welcome. If you build a useful agent template or team configuration, share it.

## License

MIT

---

*Agent personality patterns inspired by [The Agency](https://github.com/msitarzewski/agency-agents) by [@msitarzewski](https://github.com/msitarzewski). OpenClaw operational layer by [@raulvidis](https://github.com/raulv).*
