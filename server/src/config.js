const fs = require('fs');
const path = require('path');

// Maps agent IDs to their SOUL.md filenames
const SOUL_FILE_MAP = {
  orchestrator: 'orchestrator.md',
  coder:        'coding-agent.md',
  qa:           'qa-agent.md',
  devops:       'devops-agent.md',
  researcher:   'research-agent.md',
  growth:       'growth-agent.md',
  content:      'content-agent.md',
  community:    'community-agent.md',
  leadgen:      'leadgen-agent.md',
  ops:          'ops-agent.md',
};

// Maps agent IDs to Anthropic model IDs
const MODEL_MAP = {
  'anthropic/claude-sonnet-4-6':        'claude-sonnet-4-6',
  'anthropic/claude-opus-4-6':          'claude-opus-4-6',
  'anthropic/claude-haiku-4-5':         'claude-haiku-4-5-20251001',
  'claude-sonnet-4-6':                  'claude-sonnet-4-6',
  'claude-opus-4-6':                    'claude-opus-4-6',
  'claude-haiku-4-5':                   'claude-haiku-4-5-20251001',
  'claude-haiku-4-5-20251001':          'claude-haiku-4-5-20251001',
};

const TEMPLATES_DIR = path.join(__dirname, '../../templates/soul');

/**
 * Builds agent configurations from environment variables.
 * Each agent that has a BOT_TOKEN_<NAME> env var is activated.
 */
function buildAgentConfigs() {
  const groupId    = process.env.TELEGRAM_GROUP_ID || '';
  const topicBuild    = process.env.TOPIC_BUILD    || null;
  const topicResearch = process.env.TOPIC_RESEARCH || null;
  const topicSocial   = process.env.TOPIC_SOCIAL   || null;
  const topicLeads    = process.env.TOPIC_LEADS    || null;
  const topicOps      = process.env.TOPIC_OPS      || null;

  const agents = [
    {
      id:    'orchestrator',
      token: process.env.BOT_TOKEN_ORCHESTRATOR,
      model: 'claude-sonnet-4-6',
      // Orchestrator owns General (topic 1 / no thread) and is disabled in team topics
      topics: {
        [groupId]: {
          defaultEnabled:       true,
          defaultRequireMention: false,
          topicOverrides: {
            ...(topicBuild    ? { [topicBuild]:    { enabled: false } } : {}),
            ...(topicResearch ? { [topicResearch]: { enabled: false } } : {}),
            ...(topicSocial   ? { [topicSocial]:   { enabled: false } } : {}),
            ...(topicLeads    ? { [topicLeads]:    { enabled: false } } : {}),
            ...(topicOps      ? { [topicOps]:      { enabled: false } } : {}),
          },
        },
      },
    },
    {
      id:    'coder',
      token: process.env.BOT_TOKEN_CODER,
      model: 'claude-sonnet-4-6',
      topics: {
        [groupId]: {
          defaultEnabled:        false,
          defaultRequireMention: true,
          topicOverrides: topicBuild ? { [topicBuild]: { enabled: true, requireMention: true } } : {},
        },
      },
    },
    {
      id:    'qa',
      token: process.env.BOT_TOKEN_QA,
      model: 'claude-haiku-4-5-20251001',
      topics: {
        [groupId]: {
          defaultEnabled:        false,
          defaultRequireMention: true,
          topicOverrides: topicBuild ? { [topicBuild]: { enabled: true, requireMention: true } } : {},
        },
      },
    },
    {
      id:    'devops',
      token: process.env.BOT_TOKEN_DEVOPS,
      model: 'claude-haiku-4-5-20251001',
      topics: {
        [groupId]: {
          defaultEnabled:        false,
          defaultRequireMention: true,
          topicOverrides: topicBuild ? { [topicBuild]: { enabled: true, requireMention: true } } : {},
        },
      },
    },
    {
      id:    'researcher',
      token: process.env.BOT_TOKEN_RESEARCHER,
      model: 'claude-sonnet-4-6',
      topics: {
        [groupId]: {
          defaultEnabled:        false,
          defaultRequireMention: true,
          topicOverrides: topicResearch ? { [topicResearch]: { enabled: true, requireMention: false } } : {},
        },
      },
    },
    {
      id:    'growth',
      token: process.env.BOT_TOKEN_GROWTH,
      model: 'claude-haiku-4-5-20251001',
      topics: {
        [groupId]: {
          defaultEnabled:        false,
          defaultRequireMention: true,
          topicOverrides: topicResearch ? { [topicResearch]: { enabled: true, requireMention: true } } : {},
        },
      },
    },
    {
      id:    'content',
      token: process.env.BOT_TOKEN_CONTENT,
      model: 'claude-sonnet-4-6',
      topics: {
        [groupId]: {
          defaultEnabled:        false,
          defaultRequireMention: true,
          topicOverrides: topicSocial ? { [topicSocial]: { enabled: true, requireMention: false } } : {},
        },
      },
    },
    {
      id:    'community',
      token: process.env.BOT_TOKEN_COMMUNITY,
      model: 'claude-haiku-4-5-20251001',
      topics: {
        [groupId]: {
          defaultEnabled:        false,
          defaultRequireMention: true,
          topicOverrides: topicSocial ? { [topicSocial]: { enabled: true, requireMention: true } } : {},
        },
      },
    },
    {
      id:    'leadgen',
      token: process.env.BOT_TOKEN_LEADGEN,
      model: 'claude-sonnet-4-6',
      topics: {
        [groupId]: {
          defaultEnabled:        false,
          defaultRequireMention: true,
          topicOverrides: topicLeads ? { [topicLeads]: { enabled: true, requireMention: false } } : {},
        },
      },
    },
    {
      id:    'ops',
      token: process.env.BOT_TOKEN_OPS,
      model: 'claude-haiku-4-5-20251001',
      topics: {
        [groupId]: {
          defaultEnabled:        false,
          defaultRequireMention: true,
          topicOverrides: topicOps ? { [topicOps]: { enabled: true, requireMention: false } } : {},
        },
      },
    },
  ];

  // Only return agents that have a valid token
  return agents.filter(
    (a) => a.token && !a.token.startsWith('YOUR_') && a.token.length > 10
  );
}

function loadSoul(agentId) {
  const filename = SOUL_FILE_MAP[agentId];
  if (!filename) return `You are ${agentId}, a helpful AI assistant.`;

  const filePath = path.join(TEMPLATES_DIR, filename);
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return `You are the ${agentId} agent in an OpenClaw multi-agent team. Be helpful and focused.`;
  }
}

function resolveModel(modelId) {
  return MODEL_MAP[modelId] || 'claude-haiku-4-5-20251001';
}

/**
 * Determines whether an agent should respond to a message.
 * Returns { shouldRespond: bool, requireMention: bool }
 */
function shouldAgentRespond(agentConfig, chatId, topicId, botUsername, messageText) {
  const groupConfig = agentConfig.topics[String(chatId)];
  if (!groupConfig) return { shouldRespond: false };

  let enabled        = groupConfig.defaultEnabled;
  let requireMention = groupConfig.defaultRequireMention;

  if (topicId && groupConfig.topicOverrides?.[String(topicId)]) {
    const override = groupConfig.topicOverrides[String(topicId)];
    if (override.enabled !== undefined) enabled = override.enabled;
    if (override.requireMention !== undefined) requireMention = override.requireMention;
  }

  if (!enabled) return { shouldRespond: false };

  if (requireMention) {
    const mentioned =
      (botUsername && messageText.includes(`@${botUsername}`)) ||
      messageText.includes(`@${agentConfig.id}`);
    if (!mentioned) return { shouldRespond: false };
  }

  return { shouldRespond: true };
}

module.exports = { buildAgentConfigs, loadSoul, resolveModel, shouldAgentRespond };
