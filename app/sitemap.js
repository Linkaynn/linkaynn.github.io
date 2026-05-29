import { getAllSlugs } from '@/lib/posts';
import { SITE_ORIGIN } from '@/lib/i18n';
import { LANGS } from '@/lib/lang';

// Emits both locales for every page, with hreflang alternates, so search
// engines index /es and /en as distinct localized URLs.
export default function sitemap() {
  const langAlternates = (path) => ({
    languages: {
      es: `${SITE_ORIGIN}/es${path}`,
      en: `${SITE_ORIGIN}/en${path}`,
    },
  });

  const staticPaths = ['', '/blog'];
  const entries = [];

  for (const path of staticPaths) {
    for (const lang of LANGS) {
      entries.push({
        url: `${SITE_ORIGIN}/${lang}${path}`,
        changeFrequency: 'monthly',
        priority: path === '' ? 1 : 0.8,
        alternates: langAlternates(path),
      });
    }
  }

  for (const slug of getAllSlugs()) {
    for (const lang of LANGS) {
      entries.push({
        url: `${SITE_ORIGIN}/${lang}/blog/${slug}`,
        changeFrequency: 'yearly',
        priority: 0.6,
        alternates: langAlternates(`/blog/${slug}`),
      });
    }
  }

  return entries;
}
