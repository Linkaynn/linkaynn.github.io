import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

// Blog posts live as content/blog/{slug}/{es,en}.md — one file per language,
// each with its own frontmatter (title, date, excerpt, readtime, tags, lang,
// draft) and body. This mirrors the Astro content collection 1:1 and maps
// cleanly onto the locale routes (/es/blog/..., /en/blog/...): each locale
// page reads its own markdown file server-side.

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  return { data: yaml.load(match[1]) || {}, content: match[2] };
}

function readPostFile(slug, lang) {
  const file = path.join(BLOG_DIR, slug, `${lang}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = parseFrontmatter(fs.readFileSync(file, 'utf8'));
  return { slug, lang, ...data, content };
}

// All slugs that have BOTH languages present, drafts included. Used for
// static generation: the blog route has dynamicParams = false, so a slug
// missing here 404s outright — a draft still needs a working direct URL,
// it just shouldn't be listed anywhere (see getPublishedSlugs).
export function getAllSlugs() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((slug) => {
      const es = readPostFile(slug, 'es');
      const en = readPostFile(slug, 'en');
      return Boolean(es && en);
    });
}

// Slugs safe to surface — the blog index and the sitemap read this, never
// getAllSlugs, so a draft never appears in a listing in any environment,
// even though its direct URL renders fine (see getPost).
export function getPublishedSlugs() {
  return getAllSlugs().filter((slug) => {
    const es = readPostFile(slug, 'es');
    const en = readPostFile(slug, 'en');
    return !es.draft && !en.draft;
  });
}

// One post in a given language (body + frontmatter). null if missing.
// Does not hide drafts: reaching this by direct URL is the point of a draft.
export function getPost(slug, lang) {
  return readPostFile(slug, lang);
}

// All published posts for a locale's blog list, newest first.
export function getPostsByLang(lang) {
  return getPublishedSlugs()
    .map((slug) => readPostFile(slug, lang))
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Date formatters matching the Astro site.
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function shortDate(value) {
  const d = new Date(value);
  return `${MONTHS_EN[d.getMonth()]} ${d.getDate()}`;
}

export function fullDate(value) {
  const d = new Date(value);
  return d
    .toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    .replace(/\//g, ' · ');
}
