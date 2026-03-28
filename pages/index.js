import Link from 'next/link';
import Layout from '../components/Layout';
import { getNavTree } from '../lib/docs';

const AGENTS = [
  { id: 'orchestrator', icon: '🎯', label: 'Orchestrator',  desc: 'Coordinates the team, owns General topic',        model: 'sonnet-4-6'  },
  { id: 'coder',        icon: '💻', label: 'Coder',         desc: 'Ships working code, primary of Build topic',       model: 'sonnet-4-6'  },
  { id: 'qa',           icon: '🧪', label: 'QA',            desc: 'Evidence-based testing and quality assurance',     model: 'haiku-4-5'   },
  { id: 'devops',       icon: '🚀', label: 'DevOps',        desc: 'Zero-downtime deploys and infra automation',       model: 'haiku-4-5'   },
  { id: 'researcher',   icon: '🔭', label: 'Researcher',    desc: 'Market intelligence, signal over noise',           model: 'sonnet-4-6'  },
  { id: 'growth',       icon: '📈', label: 'Growth',        desc: 'Data-driven experiments and analytics',            model: 'haiku-4-5'   },
  { id: 'content',      icon: '✍️',  label: 'Content',       desc: 'Punchy social posts, authenticity over virality', model: 'sonnet-4-6'  },
  { id: 'community',    icon: '🤝', label: 'Community',     desc: '90/10 rule — earn trust on Reddit & forums',       model: 'haiku-4-5'   },
  { id: 'leadgen',      icon: '🎣', label: 'Lead Gen',      desc: 'Prospect research, quality over quantity',         model: 'sonnet-4-6'  },
  { id: 'ops',          icon: '📋', label: 'Ops',           desc: 'Email, calendar, data — ruthlessly efficient',     model: 'haiku-4-5'   },
];

const TEAMS = [
  { topic: 'General',  primary: 'Orchestrator',  secondary: '—'                },
  { topic: 'Build',    primary: 'Coder',          secondary: 'QA, DevOps'       },
  { topic: 'Research', primary: 'Researcher',     secondary: 'Growth'           },
  { topic: 'Social',   primary: 'Content',        secondary: 'Community'        },
  { topic: 'Leads',    primary: 'Lead Gen',       secondary: '—'                },
  { topic: 'Ops',      primary: 'Ops',            secondary: '—'                },
];

export default function Home({ navTree }) {
  return (
    <Layout navTree={navTree}>
      <section className="hero">
        <h1>OpenClaw Multi-Agent Kit</h1>
        <p>
          Production-tested templates for coordinating up to 10 AI agents through Telegram
          supergroup topics — powered by Claude and OpenClaw.
        </p>
        <div className="btn-group">
          <Link href="/docs/instructions" className="btn btn-primary">
            Get Started →
          </Link>
          <Link href="/docs/readme" className="btn btn-secondary">
            Read the Docs
          </Link>
          <Link href="/docs/hosting/railway" className="btn btn-secondary">
            Deploy to Railway
          </Link>
        </div>
      </section>

      {/* Team layout */}
      <section className="section">
        <h2>Default Team Layout</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Team / Topic</th>
                <th>Primary Agent</th>
                <th>Secondary Agents</th>
              </tr>
            </thead>
            <tbody>
              {TEAMS.map((t) => (
                <tr key={t.topic}>
                  <td><strong>{t.topic}</strong></td>
                  <td>{t.primary}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{t.secondary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Agent roster */}
      <section className="section">
        <h2>10 Specialist Agents</h2>
        <div className="card-grid">
          {AGENTS.map((a) => (
            <Link
              key={a.id}
              href={`/docs/soul/${a.id === 'coder' ? 'coding-agent' : a.id === 'researcher' ? 'research-agent' : `${a.id}-agent`}`}
              className="card"
              style={{ display: 'block' }}
            >
              <div className="card-icon">{a.icon}</div>
              <div className="card-title">{a.label}</div>
              <div className="card-desc">{a.desc}</div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                {a.model}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Key concepts */}
      <section className="section">
        <h2>Key Concepts</h2>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {[
            { icon: '💬', title: 'Telegram Supergroups',   desc: 'One topic per team. Agents read and respond in their assigned topic channels.' },
            { icon: '🔗', title: 'Bot-to-Bot Handoff',     desc: 'sessions_send bridges agents — Telegram bots cannot see each other directly.' },
            { icon: '📄', title: 'Shared Markdown Context', desc: 'THESIS.md, SIGNALS.md, and FEEDBACK-LOG.md coordinate agents without an API.' },
            { icon: '📣', title: 'requireMention',          desc: 'Multi-agent topics need requireMention: true to prevent double-responses.' },
          ].map((c) => (
            <div key={c.title} className="card">
              <div className="card-icon">{c.icon}</div>
              <div className="card-title">{c.title}</div>
              <div className="card-desc">{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Hosting */}
      <section className="section">
        <h2>Hosting</h2>
        <div className="card-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <Link href="/docs/hosting/railway" className="card">
            <div className="card-icon">🚂</div>
            <div className="card-title">Railway — Agent Backend</div>
            <div className="card-desc">
              Node.js multi-agent Telegram bot server. Reads SOUL.md templates, routes
              messages, calls Claude API.
            </div>
          </Link>
          <Link href="/docs/hosting/vercel" className="card">
            <div className="card-icon">▲</div>
            <div className="card-title">Vercel — Docs Site</div>
            <div className="card-desc">
              This documentation site. Auto-deploys from GitHub. Zero config needed.
            </div>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const navTree = getNavTree();
  return { props: { navTree } };
}
