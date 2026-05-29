// Markdown → HTML pipeline for blog posts. Runs server-side at render time.
// remark-parse → remark-gfm → remark-rehype (allowing raw HTML) → rehype-raw
// (so inline <figure>/<img> in the .md survives) → rehype-pretty-code (Shiki
// syntax highlighting with light/dark themes) → rehype-stringify.
//
// rehype-pretty-code emits <pre class="shiki …"> with token spans carrying
// CSS vars --shiki-light / --shiki-dark; keepBackground:false drops the
// inline theme bg so the site's own .post-body pre background shows through,
// and the data-theme rules in post.css switch token colors.

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';

export async function renderMarkdown(md) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypePrettyCode, {
      theme: { light: 'github-light', dark: 'github-dark' },
      keepBackground: false,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(md);

  return String(file);
}
