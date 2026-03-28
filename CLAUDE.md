# CLAUDE.md — Project Rules & Context

> **RULE: Update this file whenever code or project structure changes.** Every added, removed, or renamed file, template, config key, or architectural decision must be reflected here before the task is considered done.

---

## Project Overview

**OpenClaw Multi-Agent Kit** — Production-tested templates for building AI agent teams on [OpenClaw](https://openclaw.sh) with Telegram supergroup integration. This is a template/docs-only repo (no runtime code). It provides SOUL.md personality templates, IDENTITY.md metadata templates, workspace scaffolding, and openclaw.json config snippets for deploying up to 10 autonomous agents coordinated through Telegram topic channels.

**Includes a self-hosted runtime.** The repo now ships both a template/docs layer and a deployable backend + documentation website for hosting on Railway and Vercel.

## Tech Stack / Platform

- **Platform:** OpenClaw (agent orchestration platform) + self-hosted Railway backend
- **Channel:** Telegram (supergroups with topics)
- **LLM providers:** Anthropic Claude models (sonnet-4-6, opus-4-6, haiku-4-5)
- **Config format:** JSON / JSONC
- **Docs/templates:** Markdown
- **Backend (Railway):** Node.js 18+, Express, Telegraf, @anthropic-ai/sdk
- **Docs site (Vercel):** Next.js 14, marked, highlight.js, gray-matter

## Repository Structure

```
.
├── .gitignore                         # OS artifacts, node_modules, .next, .env
├── CLAUDE.md                          # This file — project rules & context
├── INSTRUCTIONS.md                    # AI-readable setup guide (8 phases)
├── README.md                          # Project overview & quick start
├── LICENSE                            # MIT
├── package.json                       # Next.js docs site (Vercel)
├── next.config.js                     # Next.js configuration
├── vercel.json                        # Vercel deployment config
├── railway.json                       # Railway deployment config (points to server/)
│
├── pages/                             # Next.js pages (Vercel docs site)
│   ├── _app.js                        # App wrapper
│   ├── index.js                       # Home / landing page
│   └── docs/
│       ├── [...slug].js               # Dynamic doc renderer (markdown + JSON)
│       ├── _railway.js                # Railway hosting guide component
│       └── _vercel.js                 # Vercel hosting guide component
│
├── components/
│   └── Layout.js                      # Sidebar + header layout
│
├── lib/
│   └── docs.js                        # Markdown file scanner and reader
│
├── styles/
│   └── globals.css                    # Global CSS (dark theme)
│
├── server/                            # Self-hosted agent backend (Railway)
│   ├── package.json                   # Node.js dependencies
│   ├── index.js                       # Express server + bot launcher
│   ├── Procfile                       # Railway process declaration
│   ├── .env.example                   # Environment variable template
│   └── src/
│       ├── config.js                  # Agent config builder + SOUL loader
│       ├── agentRouter.js             # Per-message routing logic
│       └── claudeClient.js            # Anthropic SDK wrapper + history
│
├── docs/
│   ├── agent-design-patterns.md       # How to write effective SOUL.md files
│   ├── scaling.md                     # Scaling guidance: when to add agents, cost, circular triggers
│   ├── supergroup-setup.md            # Step-by-step Telegram supergroup setup (covers multi-bot + native topic routing)
│   └── telegram-dm-topics.md          # Telegram DM forum topics + ACP binding guide
├── examples/
│   ├── full-team.json                 # Complete 10-agent openclaw.json config
│   └── minimal-team.json              # Minimal 3-agent config (orchestrator + coder + QA)
└── templates/
    ├── openclaw-config.jsonc          # Base config snippet with defaults
    ├── identity/
    │   └── agent-identity.md          # Standard identity template for any agent
    ├── soul/                          # Agent personality templates (SOUL.md)
    │   ├── orchestrator.md            # Lead agent — coordinates all others
    │   ├── coding-agent.md            # Software engineering specialist
    │   ├── qa-agent.md                # Testing and quality assurance
    │   ├── devops-agent.md            # Infrastructure and deployment
    │   ├── research-agent.md          # Market research and intelligence
    │   ├── growth-agent.md            # Analytics and growth experiments
    │   ├── content-agent.md           # Social media content creation
    │   ├── community-agent.md         # Community engagement (Reddit, forums)
    │   ├── leadgen-agent.md           # Prospect research and lead scoring
    │   └── ops-agent.md               # Email, calendar, and data management
    └── workspace/                     # Shared context file templates
        ├── AGENTS.md                  # Orchestrator operations guide
        ├── FEEDBACK-LOG.md            # Style corrections and lessons
        ├── SIGNALS.md                 # Shared intelligence hub
        ├── SUPERGROUP-MAP.md          # Topic and agent mapping
        └── THESIS.md                  # Business thesis — north star for all agents
```

## Hosting Architecture

```
GitHub repo
    │
    ├── Vercel (auto-detect Next.js at root)
    │       Next.js docs site — static, no env vars needed
    │       URL: https://your-project.vercel.app
    │
    └── Railway (root directory = server/ or via railway.json)
            Node.js multi-agent Telegram bot server
            URL: https://your-app.up.railway.app
            Env vars: ANTHROPIC_API_KEY, BOT_TOKEN_*, TELEGRAM_GROUP_ID, TOPIC_*, WEBHOOK_URL
```

### Railway Server — Environment Variables

| Variable | Description | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key | Yes |
| `BOT_TOKEN_ORCHESTRATOR` | Orchestrator bot token | Yes (minimum) |
| `BOT_TOKEN_<AGENT>` | Per-agent bot tokens (CODER, QA, DEVOPS, etc.) | Optional |
| `TELEGRAM_GROUP_ID` | Supergroup ID (negative number) | Yes |
| `TOPIC_BUILD` / `TOPIC_RESEARCH` / etc. | Topic thread IDs | Optional |
| `WEBHOOK_URL` | Public HTTPS URL of Railway service | Yes (production) |

## Architecture — Key Concepts

- **Three Telegram routing models** — Multi-bot routing, native topic routing, and DM forum topics (see docs/)
- **One topic per team** — Teams share a topic channel in a supergroup
- **Primary + Secondary agents** — Primary owns the topic; secondary responds only when @mentioned or triggered
- **Shared context via markdown files** — Agents coordinate through THESIS.md, SIGNALS.md, FEEDBACK-LOG.md (not APIs)
- **Bot-to-bot via `sessions_send`** — Telegram bots cannot see each other's messages; OpenClaw's `sessions_send` bridges them
- **Structured escalation** — Agents escalate to orchestrator; orchestrator escalates to human

### Telegram Routing Models

| Model | Visibility | Best For |
|-------|-----------|----------|
| **Multi-bot routing** | Each agent has its own bot identity | Specialist teams with visible personas |
| **Native topic routing** | One bot, different internal agents per topic | Clean single-bot UX with internal specialization |
| **DM forum topics** | Topics inside a direct chat | Private 1:1 organized conversations with ACP support |

### Team Layout (default)

| Team     | Topic    | Primary Agent | Secondary Agents    |
|----------|----------|---------------|---------------------|
| General  | Topic 1  | Orchestrator  | —                   |
| Build    | Topic N  | Coder         | QA, DevOps          |
| Research | Topic N  | Researcher    | Growth              |
| Social   | Topic N  | Content       | Community           |
| Leads    | Topic N  | Lead Gen      | —                   |
| Ops      | Topic N  | Ops           | —                   |

### Critical Config Rule: `requireMention`

- **Multi-agent topics:** ALL bots must have `requireMention: true` — otherwise one bot responds to everything
- **Single-agent topics:** The sole agent can use `requireMention: false`
- **Orchestrator:** Must have `enabled: false` on topics owned by other agents

## Conventions

- **Template placeholders** use `[Your ... Name]`, `YOUR_*`, `[Name]`, or `{WORKSPACE}` — always replace before use
- **SOUL.md structure** follows the 10-section pattern from `docs/agent-design-patterns.md`: Identity, Who I Am, Core Principles, How I Work, Domain Sections, Communication Style, Shared Context, Team Integration, Learning/Memory, Success Metrics
- **Model selection:** Orchestrator/Coder use sonnet-4-6 or opus-4-6; lighter agents (QA, DevOps, Ops, Community) use haiku-4-5
- **Example configs** must stay in sync — `full-team.json` covers all 10 agents, `minimal-team.json` covers orchestrator + coder + QA

## Editing Guidelines

- When adding a new agent template: add the soul template in `templates/soul/`, update `README.md` tables, update `examples/full-team.json`, and update this file's structure tree
- When adding a new workspace template: add in `templates/workspace/`, update `README.md`, and update this file
- When changing config schema or keys: update `templates/openclaw-config.jsonc`, both example files, and `INSTRUCTIONS.md`
- Keep `INSTRUCTIONS.md` as the single source of truth for the AI-readable setup flow
- All markdown templates use `---` horizontal rules as section separators
