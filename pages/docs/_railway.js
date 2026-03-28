import Layout from '../../components/Layout';

export default function RailwayHosting({ navTree }) {
  return (
    <Layout navTree={navTree}>
      <article className="prose">
        <h1>Deploy Agent Backend to Railway</h1>
        <p>
          The <code>server/</code> directory contains a Node.js multi-agent Telegram bot server
          that implements the OpenClaw routing pattern. Deploy it to Railway for a managed,
          always-on backend with automatic HTTPS (required for Telegram webhooks).
        </p>

        <h2>Prerequisites</h2>
        <ul>
          <li>A <a href="https://railway.app" target="_blank" rel="noopener noreferrer">Railway account</a></li>
          <li>An <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer">Anthropic API key</a></li>
          <li>One or more Telegram bot tokens from <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer">@BotFather</a></li>
          <li>This repo pushed to GitHub</li>
        </ul>

        <h2>Step-by-Step</h2>
        <ol className="step-list">
          <li>
            <div>
              <strong>Create a new Railway project</strong>
              <br />
              Go to <a href="https://railway.app/new" target="_blank" rel="noopener noreferrer">railway.app/new</a> → &ldquo;Deploy from GitHub repo&rdquo; → select this repo.
            </div>
          </li>
          <li>
            <div>
              <strong>Set the Root Directory</strong>
              <br />
              In your Railway service settings → <em>Source</em> → set <strong>Root Directory</strong> to <code>server</code>.
              Railway will then use <code>server/package.json</code> to build and start the service.
              <br />
              <em>(Alternatively, the root <code>railway.json</code> overrides this with <code>cd server &amp;&amp; npm start</code>.)</em>
            </div>
          </li>
          <li>
            <div>
              <strong>Add environment variables</strong>
              <br />
              In the Railway service → <em>Variables</em> tab, add:

              <table className="env-table" style={{ marginTop: '0.75rem' }}>
                <thead>
                  <tr><th>Variable</th><th>Value</th><th>Required</th></tr>
                </thead>
                <tbody>
                  <tr><td><code>ANTHROPIC_API_KEY</code></td><td>Your Anthropic API key</td><td>✅ Yes</td></tr>
                  <tr><td><code>BOT_TOKEN_ORCHESTRATOR</code></td><td>Orchestrator bot token from @BotFather</td><td>✅ Yes</td></tr>
                  <tr><td><code>BOT_TOKEN_CODER</code></td><td>Coder bot token</td><td>Optional</td></tr>
                  <tr><td><code>BOT_TOKEN_QA</code></td><td>QA bot token</td><td>Optional</td></tr>
                  <tr><td><code>BOT_TOKEN_DEVOPS</code></td><td>DevOps bot token</td><td>Optional</td></tr>
                  <tr><td><code>BOT_TOKEN_RESEARCHER</code></td><td>Researcher bot token</td><td>Optional</td></tr>
                  <tr><td><code>BOT_TOKEN_GROWTH</code></td><td>Growth bot token</td><td>Optional</td></tr>
                  <tr><td><code>BOT_TOKEN_CONTENT</code></td><td>Content bot token</td><td>Optional</td></tr>
                  <tr><td><code>BOT_TOKEN_COMMUNITY</code></td><td>Community bot token</td><td>Optional</td></tr>
                  <tr><td><code>BOT_TOKEN_LEADGEN</code></td><td>Lead Gen bot token</td><td>Optional</td></tr>
                  <tr><td><code>BOT_TOKEN_OPS</code></td><td>Ops bot token</td><td>Optional</td></tr>
                  <tr><td><code>TELEGRAM_GROUP_ID</code></td><td>Your Telegram supergroup ID (negative number)</td><td>✅ Yes</td></tr>
                  <tr><td><code>TOPIC_BUILD</code></td><td>Topic thread ID for Build team</td><td>Optional</td></tr>
                  <tr><td><code>TOPIC_RESEARCH</code></td><td>Topic thread ID for Research team</td><td>Optional</td></tr>
                  <tr><td><code>TOPIC_SOCIAL</code></td><td>Topic thread ID for Social team</td><td>Optional</td></tr>
                  <tr><td><code>TOPIC_LEADS</code></td><td>Topic thread ID for Leads team</td><td>Optional</td></tr>
                  <tr><td><code>TOPIC_OPS</code></td><td>Topic thread ID for Ops team</td><td>Optional</td></tr>
                  <tr><td><code>WEBHOOK_URL</code></td><td>Your Railway public URL (auto-set after first deploy)</td><td>✅ Yes</td></tr>
                  <tr><td><code>PORT</code></td><td>Railway sets this automatically</td><td>Auto</td></tr>
                </tbody>
              </table>
            </div>
          </li>
          <li>
            <div>
              <strong>Deploy and get your URL</strong>
              <br />
              Railway will auto-deploy. Once live, go to <em>Settings → Networking → Generate Domain</em>
              to get your public HTTPS URL (e.g. <code>https://your-app.up.railway.app</code>).
            </div>
          </li>
          <li>
            <div>
              <strong>Set WEBHOOK_URL and redeploy</strong>
              <br />
              Add <code>WEBHOOK_URL=https://your-app.up.railway.app</code> as an environment variable.
              Railway will trigger a redeploy automatically. The server will register all webhook URLs
              with Telegram on startup.
            </div>
          </li>
          <li>
            <div>
              <strong>Verify health check</strong>
              <br />
              Visit <code>https://your-app.up.railway.app/health</code> — you should see:
              <pre style={{ marginTop: '0.5rem', background: 'var(--bg-surface-2)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem' }}>{`{ "status": "ok", "agents": [...], "timestamp": "..." }`}</pre>
            </div>
          </li>
        </ol>

        <h2>How the Server Works</h2>
        <p>
          The server reads environment variables for bot tokens. For each token provided, it creates
          a Telegraf bot instance and registers a Telegram webhook at <code>/webhook/&#123;token&#125;</code>.
        </p>
        <p>
          When a message arrives:
        </p>
        <ol>
          <li>The server identifies which bot received it (and therefore which agent)</li>
          <li>It checks <code>requireMention</code> based on the topic ID</li>
          <li>If the agent should respond, it loads the agent&apos;s <code>SOUL.md</code> as the Claude system prompt</li>
          <li>Calls the Anthropic API with the appropriate model</li>
          <li>Replies in the same Telegram topic thread</li>
        </ol>

        <div className="callout callout-info" style={{ marginTop: '1.5rem' }}>
          <div className="callout-title">Minimal setup</div>
          Only <code>BOT_TOKEN_ORCHESTRATOR</code> is required to run a single-agent setup.
          Add more bot tokens incrementally as you expand your team.
        </div>

        <div className="callout callout-warn" style={{ marginTop: '1rem' }}>
          <div className="callout-title">Telegram webhook requirement</div>
          Telegram webhooks require HTTPS. Railway provides this automatically. For local development,
          the server falls back to long-polling mode when <code>WEBHOOK_URL</code> is not set.
        </div>

        <h2>Local Development</h2>
        <pre style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1rem', fontSize: '0.85rem', overflowX: 'auto' }}>{`cd server
cp .env.example .env
# Fill in .env with your tokens
npm install
npm run dev   # Uses long-polling, no webhook needed`}</pre>
      </article>
    </Layout>
  );
}
