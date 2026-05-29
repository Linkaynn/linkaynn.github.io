import { isLang, DEFAULT_LANG, t } from '@/lib/lang';
import { I18N, SITE_ORIGIN } from '@/lib/i18n';
import { getPostsByLang } from '@/lib/posts';
import BlogList from '@/components/BlogList';

export async function generateMetadata({ params }) {
  const { lang: raw } = await params;
  const lang = isLang(raw) ? raw : DEFAULT_LANG;
  return {
    title: t(I18N.meta.blog.title, lang),
    description: t(I18N.meta.blog.description, lang),
    alternates: {
      canonical: `${SITE_ORIGIN}/${lang}/blog`,
      languages: {
        es: `${SITE_ORIGIN}/es/blog`,
        en: `${SITE_ORIGIN}/en/blog`,
        'x-default': `${SITE_ORIGIN}/es/blog`,
      },
    },
    openGraph: {
      type: 'website',
      title: t(I18N.meta.blog.title, lang),
      description: t(I18N.meta.blog.description, lang),
      url: `${SITE_ORIGIN}/${lang}/blog`,
      siteName: 'Jesé Romero',
      images: ['/blog.png'],
    },
    twitter: { card: 'summary_large_image', images: ['/blog.png'] },
  };
}

export default async function BlogPage({ params }) {
  const { lang: raw } = await params;
  const lang = isLang(raw) ? raw : DEFAULT_LANG;
  const posts = getPostsByLang(lang).map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    excerpt: p.excerpt,
    readtime: p.readtime,
  }));
  return <BlogList lang={lang} posts={posts} />;
}
