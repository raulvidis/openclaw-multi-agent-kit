import Layout from '../../components/Layout';

export default function VercelHosting({ navTree }) {
  return (
    <Layout navTree={navTree}>
      <article className="prose">
        <h1>Deploy Docs Site to Vercel</h1>
        <p>
          This documentation site is a Next.js app that lives at the repo root. Vercel
          auto-detects Next.js and deploys it with zero configuration. The site statically
          generates all pages from the markdown files in the repo.
        </p>

        <h2>Prerequisites</h2>
        <ul>
          <li>A <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">Vercel account</a> (free tier works)</li>
          <li>This repo pushed to GitHub</li>
        </ul>

        <h2>Step-by-Step</h2>
        <ol className="step-list">
          <li>
            <div>
              <strong>Import the repository</strong>
              <br />
              Go to <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer">vercel.com/new</a> → &ldquo;Import Git Repository&rdquo; → select this repo.
            </div>
          </li>
          <li>
            <div>
              <strong>Accept defaults</strong>
              <br />
              Vercel auto-detects Next.js. The <code>vercel.json</code> in the repo root configures the build.
              No changes needed — just click <strong>Deploy</strong>.
            </div>
          </li>
          <li>
            <div>
              <strong>Your site is live</strong>
              <br />
              Vercel provides a <code>*.vercel.app</code> URL immediately. You can add a custom domain
              under <em>Project Settings → Domains</em>.
            </div>
          </li>
          <li>
            <div>
              <strong>Auto-deploys on push</strong>
              <br />
              Every push to your main branch triggers a new deployment. Preview deployments are
              created for pull requests automatically.
            </div>
          </li>
        </ol>

        <h2>How the Docs Site Works</h2>
        <p>
          The site uses Next.js static generation (<code>getStaticProps</code> / <code>getStaticPaths</code>).
          At build time it:
        </p>
        <ol>
          <li>Scans <code>docs/</code>, <code>templates/soul/</code>, <code>templates/workspace/</code>,
            <code>templates/identity/</code>, and <code>examples/</code> for <code>.md</code> and <code>.json</code> files</li>
          <li>Generates a static page for each file at <code>/docs/&#123;section&#125;/&#123;filename&#125;</code></li>
          <li>Renders markdown to HTML using <strong>marked</strong> with syntax highlighting via <strong>highlight.js</strong></li>
          <li>Builds the sidebar navigation automatically from the same file list</li>
        </ol>

        <div className="callout callout-info">
          <div className="callout-title">No environment variables required</div>
          The docs site is purely static — it reads files at build time and produces pre-rendered HTML.
          No runtime secrets or API keys are needed on Vercel.
        </div>

        <h2>Customization</h2>
        <p>
          To add a new section to the docs, simply add a <code>.md</code> file to one of the scanned
          directories. The sidebar and static paths update automatically on the next build.
        </p>
        <p>
          To change the site&apos;s appearance, edit <code>styles/globals.css</code>. The design uses
          CSS custom properties for the color scheme — swap the values in <code>:root</code> to retheme.
        </p>

        <h2>Monorepo Note</h2>
        <p>
          This repo serves both the Vercel docs site (root) and the Railway backend (<code>server/</code>).
          Vercel only builds the Next.js app at root; it ignores the <code>server/</code> directory.
          Railway only builds from <code>server/</code>; it ignores the Next.js files.
        </p>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1rem', marginTop: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', lineHeight: '1.7' }}>
          <div style={{ color: 'var(--text-muted)' }}># Monorepo structure</div>
          <div><span style={{ color: 'var(--green)' }}>/ (root)</span>         ← Next.js app → <strong>Vercel</strong></div>
          <div><span style={{ color: 'var(--accent)' }}>server/</span>         ← Node.js bot → <strong>Railway</strong></div>
          <div><span style={{ color: 'var(--text-muted)' }}>docs/</span>           ← Markdown content (used by Vercel at build time)</div>
          <div><span style={{ color: 'var(--text-muted)' }}>templates/</span>      ← Soul templates (used by both)</div>
          <div><span style={{ color: 'var(--text-muted)' }}>examples/</span>       ← Config examples</div>
        </div>
      </article>
    </Layout>
  );
}
