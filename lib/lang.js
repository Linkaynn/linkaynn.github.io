// Locale helpers. The site is bilingual (es default, en) and uses
// route-based locales (/es, /en) — the active language comes from the URL,
// not client state, so each locale is its own server-rendered, indexable page.

export const LANGS = ['es', 'en'];
export const DEFAULT_LANG = 'es';

export function isLang(value) {
  return value === 'es' || value === 'en';
}

export function otherLang(lang) {
  return lang === 'es' ? 'en' : 'es';
}

// Pick a localized value out of a { es, en } node. Plain strings/arrays pass
// through unchanged. Falls back es → en so a missing translation never blanks.
export function t(node, lang) {
  if (node == null) return '';
  if (typeof node === 'string' || typeof node === 'number' || Array.isArray(node)) return node;
  return node[lang] ?? node[DEFAULT_LANG] ?? node.en ?? '';
}
