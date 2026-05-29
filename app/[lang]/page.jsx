import { isLang, DEFAULT_LANG, t } from '@/lib/lang';
import { I18N, SITE_ORIGIN } from '@/lib/i18n';
import { getPostsByLang } from '@/lib/posts';
import Home from '@/components/Home';

export async function generateMetadata({ params }) {
  const { lang: raw } = await params;
  const lang = isLang(raw) ? raw : DEFAULT_LANG;
  return {
    title: t(I18N.meta.home.title, lang),
    description: t(I18N.meta.home.description, lang),
    keywords: t(I18N.meta.home.keywords, lang),
    alternates: {
      canonical: `${SITE_ORIGIN}/${lang}`,
      languages: {
        es: `${SITE_ORIGIN}/es`,
        en: `${SITE_ORIGIN}/en`,
        'x-default': `${SITE_ORIGIN}/es`,
      },
    },
    openGraph: {
      type: 'website',
      title: t(I18N.meta.home.title, lang),
      description: t(I18N.meta.home.description, lang),
      url: `${SITE_ORIGIN}/${lang}`,
      siteName: 'Jesé Romero',
      images: ['/home.png'],
    },
    twitter: { card: 'summary_large_image', images: ['/home.png'] },
  };
}

export default async function HomePage({ params }) {
  const { lang: raw } = await params;
  const lang = isLang(raw) ? raw : DEFAULT_LANG;
  const posts = getPostsByLang(lang).map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
  }));
  return <Home lang={lang} posts={posts} />;
}
