const { loadSoul, resolveModel, shouldAgentRespond } = require('./config');
const { callAgent } = require('./claudeClient');

/**
 * Handles an incoming Telegram message for a specific agent.
 *
 * @param {object} ctx          - Telegraf context
 * @param {object} agentConfig  - Agent config object from buildAgentConfigs()
 */
async function routeMessage(ctx, agentConfig) {
  const msg = ctx.message || ctx.channelPost;
  if (!msg) return;

  const text = msg.text || msg.caption;
  if (!text || text.trim().length === 0) return;

  // Ignore messages from bots
  if (msg.from?.is_bot) return;

  const chatId  = String(msg.chat.id);
  const topicId = msg.message_thread_id ? String(msg.message_thread_id) : null;

  // Fetch bot username for mention detection (cached on ctx.botInfo by Telegraf)
  const botInfo    = ctx.botInfo;
  const botUsername = botInfo?.username || '';

  const { shouldRespond } = shouldAgentRespond(
    agentConfig,
    chatId,
    topicId,
    botUsername,
    text
  );

  if (!shouldRespond) return;

  const soul       = loadSoul(agentConfig.id);
  const model      = resolveModel(agentConfig.model);
  const historyKey = `${chatId}:${topicId || '0'}:${agentConfig.id}`;

  // Include sender context in the user message
  const senderName = msg.from?.username
    ? `@${msg.from.username}`
    : msg.from?.first_name || 'User';

  const userText = `${senderName}: ${text}`;

  try {
    await ctx.sendChatAction('typing');

    const reply = await callAgent(agentConfig.id, soul, userText, model, historyKey);

    await ctx.reply(reply, {
      message_thread_id: msg.message_thread_id,
      parse_mode: 'Markdown',
    }).catch(() =>
      // Fallback without markdown if parsing fails
      ctx.reply(reply, { message_thread_id: msg.message_thread_id })
    );
  } catch (err) {
    console.error(`[${agentConfig.id}] Claude error:`, err.message);
    await ctx.reply(
      `⚠️ ${agentConfig.id} agent is temporarily unavailable.`,
      { message_thread_id: msg.message_thread_id }
    );
  }
}

module.exports = { routeMessage };
