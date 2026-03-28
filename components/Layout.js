import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children, navTree = [] }) {
  const router = useRouter();

  function isActive(slug) {
    const href = slug.startsWith('http') ? slug : `/docs/${slug}`;
    return router.asPath === href || router.asPath === href + '/';
  }

  return (
    <div className="layout">
      <header className="header">
        <Link href="/" className="header-logo">
          <span className="claw">⚡</span>
          <span>OpenClaw</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Multi-Agent Kit</span>
        </Link>
        <nav className="header-nav">
          <Link href="/docs/readme">Docs</Link>
          <Link href="/docs/instructions">Setup</Link>
          <Link href="/docs/hosting/railway">Hosting</Link>
          <a
            href="https://github.com/n4t24wpz7g-coder/openclaw-multi-agent-kit"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <span className="badge">Templates</span>
        </nav>
      </header>

      <div className="page-body">
        <nav className="sidebar">
          {navTree.map((section) => (
            <div key={section.label} className="sidebar-section">
              <div className="sidebar-section-label">{section.label}</div>
              {section.items.map((item) => (
                <Link
                  key={item.slug}
                  href={item.slug.startsWith('http') ? item.slug : `/docs/${item.slug}`}
                  className={`sidebar-item${isActive(item.slug) ? ' active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
