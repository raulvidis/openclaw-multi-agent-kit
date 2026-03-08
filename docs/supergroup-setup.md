# Supergroup Setup Guide

Step-by-step guide to setting up a Telegram supergroup for your agent team.

## Prerequisites

- A Telegram account
- OpenClaw installed and running
- Anthropic API key (or other LLM provider configured)

## Step 1: Create the Supergroup

1. Open Telegram
2. Create a new group
3. Convert it to a supergroup (Settings > Group Type > Supergroup)
4. Enable Topics (Settings > Topics > Enable)
5. Note the group ID (use a bot like @raw_data_bot or check OpenClaw logs)

## Step 2: Create Topics

Create a topic for each team:
- **General** (topic 1, auto-created) — Orchestrator
- **Build** — Coding + QA + DevOps
- **Research** — Market Research + Growth Analytics
- **Social** — Content + Community
- **Leads** — Lead Generation
- **Ops** — Email, Calendar, Data

Note each topic ID.

## Step 3: Create Bots

For each agent, go to [@BotFather](https://t.me/BotFather):

1. `/newbot`
2. Name: `[AgentName] Bot`
3. Username: `[agentname]_bot`
4. Save the token
5. `/setjoingroups` > Enable (so the bot can be added to groups)
6. `/setprivacy` > Disable (so the bot can read messages in groups)

## Step 4: Add Bots to Supergroup

Add each bot to your supergroup as admin with these permissions:
- Send messages
- Read messages
- Pin messages (optional)

## Step 5: Configure OpenClaw

See the example configs in `examples/`.

First, choose your routing model.

### Option A — Multi-bot routing (recommended for specialist teams)

Use this if you want each specialist to have its **own visible Telegram identity**.

Key concepts:
- **Primary agent** on a topic: `requireMention: false` (responds to all messages) — ONLY if it's the ONLY agent in that topic
- **Secondary agent** on a topic: `requireMention: true` (only responds when @mentioned)
- **Multi-agent topics**: ALL agents must have `requireMention: true` — otherwise the bot with `false` will respond to everything, including when you @mention other agents
- **Disabled topics**: topics where the orchestrator should NOT respond (handled by other bots)
- Routing happens through **Telegram account/bot identity + `bindings[].match.accountId`**

This is the better UX if your team is intentionally presented as multiple named specialists.

### Option B — Native topic routing (one visible bot, many internal agents)

Use this if you want **one public Telegram bot** but different topics to be handled by different internal OpenClaw agents.

Example:

```json5
channels: {
  telegram: {
    groups: {
      "-1001234567890": {
        topics: {
          "1":  { agentId: "main" },
          "13": { agentId: "coder" },
          "14": { agentId: "leads" },
          "18": { agentId: "research" }
        }
      }
    }
  }
}
```

Important caveat:
- `agentId` changes the **internal agent owner**
- `agentId` does **not** change the **visible Telegram bot/account**

So if your default/orchestrator bot is the one in the group, replies may still visibly come from that bot even when Topic 13 is internally routed to `coder`.

**Choose native topic routing when:**
- you want one clean public bot identity
- you prefer simpler config over persona separation
- internal ownership matters more than visible bot branding

**Choose multi-bot routing when:**
- agent identity matters in the chat UI
- each specialist should visibly answer as themselves
- you want clear topic ownership at a glance

## Step 6: Test

1. Restart OpenClaw: `openclaw restart`
2. Send a message in each topic
3. Verify the correct routing behavior:
   - **Multi-bot:** the correct specialist bot should visibly respond
   - **Native topic routing:** the correct internal agent should answer, but the visible sender may still be the shared/default bot
4. Test `sessions_send` between agents using the structured format in `docs/inter-agent-handoff-standard.md`

## Troubleshooting

- **Bot not responding:** Check bot token, verify bot is admin in group
- **Wrong bot responds:** Check topic config, ensure requireMention settings are correct
- **Everything responds as the orchestrator bot:** You probably enabled native topic `agentId` routing on a shared/default Telegram account. Internal routing is working, but visible bot identity is still shared.
- **Bot-to-bot messages not working:** Bots cant see each other — use `sessions_send`
