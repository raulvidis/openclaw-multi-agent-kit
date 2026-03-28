require('dotenv').config();

const express  = require('express');
const { Telegraf } = require('telegraf');
const { buildAgentConfigs } = require('./src/config');
const { routeMessage } = require('./src/agentRouter');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ERROR: ANTHROPIC_API_KEY is not set');
    process.exit(1);
  }

  const agentConfigs = buildAgentConfigs();

  if (agentConfigs.length === 0) {
    console.error('ERROR: No valid bot tokens found. Set at least BOT_TOKEN_ORCHESTRATOR.');
    process.exit(1);
  }

  console.log(`Starting ${agentConfigs.length} agent(s): ${agentConfigs.map((a) => a.id).join(', ')}`);

  const bots = [];

  for (const agentConfig of agentConfigs) {
    const bot = new Telegraf(agentConfig.token);

    // Attach the agent config to each bot for easy reference
    bot.agentConfig = agentConfig;

    bot.on('message', (ctx) => routeMessage(ctx, agentConfig));

    bots.push(bot);
  }

  // ── Health check endpoint ──
  app.get('/health', (_req, res) => {
    res.json({
      status:    'ok',
      agents:    agentConfigs.map((a) => ({ id: a.id, model: a.model })),
      timestamp: new Date().toISOString(),
    });
  });

  const webhookBase = process.env.WEBHOOK_URL;

  if (webhookBase) {
    // ── Webhook mode (production on Railway) ──
    for (const bot of bots) {
      const token       = bot.agentConfig.token;
      const webhookPath = `/webhook/${token}`;
      const webhookUrl  = `${webhookBase}${webhookPath}`;

      app.use(webhookPath, bot.webhookCallback(webhookPath));

      try {
        await bot.telegram.setWebhook(webhookUrl);
        console.log(`[${bot.agentConfig.id}] Webhook set → ${webhookUrl}`);
      } catch (err) {
        console.error(`[${bot.agentConfig.id}] Failed to set webhook:`, err.message);
      }
    }

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } else {
    // ── Long-polling mode (local development) ──
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} (dev/polling mode)`);
    });

    for (const bot of bots) {
      await bot.launch();
      console.log(`[${bot.agentConfig.id}] Bot launched in polling mode`);
    }

    // Graceful shutdown
    const stop = (signal) => {
      console.log(`\nReceived ${signal}, stopping bots...`);
      for (const bot of bots) bot.stop(signal);
      process.exit(0);
    };
    process.once('SIGINT',  () => stop('SIGINT'));
    process.once('SIGTERM', () => stop('SIGTERM'));
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
