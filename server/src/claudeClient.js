const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Simple in-memory conversation history keyed by (chatId:topicId:agentId)
const history = new Map();
const MAX_HISTORY = 20;

/**
 * Calls Claude with the agent's system prompt and conversation history.
 * @param {string} agentId
 * @param {string} systemPrompt  - SOUL.md content
 * @param {string} userText      - The user's message
 * @param {string} model         - Anthropic model ID
 * @param {string} historyKey    - Unique key for conversation context
 * @returns {Promise<string>}
 */
async function callAgent(agentId, systemPrompt, userText, model, historyKey) {
  const messages = history.get(historyKey) || [];

  messages.push({ role: 'user', content: userText });

  const response = await client.messages.create({
    model,
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const reply = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  messages.push({ role: 'assistant', content: reply });

  // Trim history to last MAX_HISTORY turns
  if (messages.length > MAX_HISTORY * 2) {
    messages.splice(0, messages.length - MAX_HISTORY * 2);
  }

  history.set(historyKey, messages);

  return reply;
}

module.exports = { callAgent };
