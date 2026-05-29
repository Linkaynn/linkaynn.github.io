import { notFound } from 'next/navigation';
import { isLang, DEFAULT_LANG, LANGS, t } from '@/lib/lang';
import { I18N, SITE_ORIGIN } from '@/lib/i18n';
import { getAllSlugs, getPost } from '@/lib/posts';
import BlogPost from '@/components/BlogPost';

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return LANGS.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }) {
  const { lang: raw, slug } = await params;
  const lang = isLang(raw) ? raw : DEFAULT_LANG;
  const post = getPost(slug, lang);
  if (!post) return {};
  return {
    title: `${post.title} — Jesé Romero`,
    description: post.excerpt,
    keywords: (post.tags ?? []).join(', '),
    alternates: {
      canonical: `${SITE_ORIGIN}/${lang}/blog/${slug}`,
      languages: {
        es: `${SITE_ORIGIN}/es/blog/${slug}`,
        en: `${SITE_ORIGIN}/en/blog/${slug}`,
        'x-default': `${SITE_ORIGIN}/es/blog/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `${SITE_ORIGIN}/${lang}/blog/${slug}`,
      siteName: 'Jesé Romero',
      images: ['/blog.png'],
    },
    twitter: { card: 'summary_large_image', images: ['/blog.png'] },
  };
}

export default async function BlogPostPage({ params }) {
  const { lang: raw, slug } = await params;
  const lang = isLang(raw) ? raw : DEFAULT_LANG;
  const post = getPost(slug, lang);
  if (!post) notFound();
  return <BlogPost lang={lang} post={post} />;
}
