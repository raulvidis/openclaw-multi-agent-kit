const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = path.join(process.cwd());

// Map of slug prefixes to file system paths
const DOC_SOURCES = [
  { prefix: 'docs',       dir: 'docs',                   ext: '.md' },
  { prefix: 'soul',       dir: 'templates/soul',          ext: '.md' },
  { prefix: 'workspace',  dir: 'templates/workspace',     ext: '.md' },
  { prefix: 'identity',   dir: 'templates/identity',      ext: '.md' },
  { prefix: 'examples',   dir: 'examples',                ext: '.json' },
];

// Top-level singleton files exposed as docs
const SINGLETON_DOCS = [
  { slug: 'readme',       file: 'README.md',              title: 'Overview' },
  { slug: 'instructions', file: 'INSTRUCTIONS.md',        title: 'Setup Guide' },
];

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function titleFromFilename(filename) {
  return filename
    .replace(/\.(md|json)$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Returns all navigable docs for static path generation */
function getAllDocSlugs() {
  const slugs = [];

  // Singleton docs
  for (const doc of SINGLETON_DOCS) {
    slugs.push([doc.slug]);
  }

  // Directory sources
  for (const source of DOC_SOURCES) {
    const dir = path.join(ROOT, source.dir);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(source.ext));
    for (const file of files) {
      const name = file.replace(source.ext, '');
      slugs.push([source.prefix, name]);
    }
  }

  return slugs;
}

/** Loads a single doc by slug array, returns { title, content, raw, isJson } */
function getDocBySlug(slugArray) {
  const slugStr = slugArray.join('/');

  // Check singletons first
  const singleton = SINGLETON_DOCS.find((d) => d.slug === slugStr);
  if (singleton) {
    const raw = readFileSafe(path.join(ROOT, singleton.file));
    if (!raw) return null;
    const { data, content } = matter(raw);
    return {
      title: data.title || singleton.title,
      content,
      raw,
      isJson: false,
      slug: slugArray,
    };
  }

  // Directory sources
  if (slugArray.length === 2) {
    const [prefix, name] = slugArray;
    const source = DOC_SOURCES.find((s) => s.prefix === prefix);
    if (!source) return null;

    const filePath = path.join(ROOT, source.dir, `${name}${source.ext}`);
    const raw = readFileSafe(filePath);
    if (!raw) return null;

    if (source.ext === '.json') {
      return {
        title: titleFromFilename(name),
        content: raw,
        raw,
        isJson: true,
        slug: slugArray,
      };
    }

    const { data, content } = matter(raw);
    return {
      title: data.title || titleFromFilename(name),
      content,
      raw,
      isJson: false,
      slug: slugArray,
    };
  }

  return null;
}

/** Builds the navigation tree for the sidebar */
function getNavTree() {
  const tree = [
    {
      label: 'Getting Started',
      items: [
        { slug: 'readme',       label: 'Overview' },
        { slug: 'instructions', label: 'Setup Guide (8 Phases)' },
      ],
    },
    {
      label: 'Documentation',
      items: getItemsForSource('docs'),
    },
    {
      label: 'Agent Souls',
      items: getItemsForSource('soul'),
    },
    {
      label: 'Workspace Templates',
      items: getItemsForSource('workspace'),
    },
    {
      label: 'Identity Template',
      items: getItemsForSource('identity'),
    },
    {
      label: 'Examples',
      items: getItemsForSource('examples'),
    },
    {
      label: 'Hosting',
      items: [
        { slug: 'hosting/railway', label: 'Railway (Backend)' },
        { slug: 'hosting/vercel',  label: 'Vercel (Docs Site)' },
      ],
    },
  ];

  return tree;
}

function getItemsForSource(prefix) {
  const source = DOC_SOURCES.find((s) => s.prefix === prefix);
  if (!source) return [];

  const dir = path.join(ROOT, source.dir);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(source.ext))
    .map((f) => {
      const name = f.replace(source.ext, '');
      return {
        slug: `${prefix}/${name}`,
        label: titleFromFilename(name),
      };
    });
}

module.exports = { getAllDocSlugs, getDocBySlug, getNavTree };
