import { marked } from 'marked';
import hljs from 'highlight.js';
import Layout from '../../components/Layout';
import { getAllDocSlugs, getDocBySlug, getNavTree } from '../../lib/docs';
import RailwayHosting from './_railway';
import VercelHosting from './_vercel';

// Configure marked with syntax highlighting
marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: false,
  gfm: true,
});

export default function DocPage({ doc, navTree, isHostingPage, hostingSlug }) {
  if (isHostingPage) {
    if (hostingSlug === 'railway') return <RailwayHosting navTree={navTree} />;
    if (hostingSlug === 'vercel')  return <VercelHosting navTree={navTree} />;
  }

  if (!doc) {
    return (
      <Layout navTree={navTree}>
        <h1 style={{ color: 'var(--red)' }}>404 — Page not found</h1>
      </Layout>
    );
  }

  const html = doc.isJson
    ? null
    : marked(doc.content || '');

  return (
    <Layout navTree={navTree}>
      {doc.isJson ? (
        <>
          <h1 style={{ marginBottom: '1rem' }}>{doc.title}</h1>
          <pre className="json-block">{doc.content}</pre>
        </>
      ) : (
        <article
          className="prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </Layout>
  );
}

export async function getStaticPaths() {
  const slugs = getAllDocSlugs();
  // Add hosting pages
  slugs.push(['hosting', 'railway']);
  slugs.push(['hosting', 'vercel']);

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const navTree = getNavTree();
  const slug = params.slug;

  // Hosting pages are rendered as dedicated components
  if (slug[0] === 'hosting') {
    return {
      props: {
        doc: null,
        navTree,
        isHostingPage: true,
        hostingSlug: slug[1] || 'railway',
      },
    };
  }

  const doc = getDocBySlug(slug);
  return {
    props: {
      doc,
      navTree,
      isHostingPage: false,
      hostingSlug: null,
    },
  };
}
