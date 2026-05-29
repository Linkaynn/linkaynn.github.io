import { renderMarkdown } from '@/lib/markdown';
import { fullDate } from '@/lib/posts';
import './post.css';

// Single-locale blog post page. Server component: renders the markdown body to
// HTML at request/build time. The lightbox markup is wired by the effects layer
// (Interactions) — no inline script here. The back link's scramble + .post-head
// reveal are also driven by the effects layer.
export default async function BlogPost({ lang, post }) {
  const html = await renderMarkdown(post.content);
  const backText = lang === 'es' ? 'volver' : 'back';

  return (
    <>
      <article className="post">
        <header className="post-head reveal" data-blur="0" data-y="6">
          <a href={`/${lang}`} className="back-link">
            ← <span className="scramble" data-text={backText}>{backText}</span>
          </a>
          <h1>{post.title}</h1>
          <div className="post-meta">
            <time dateTime={new Date(post.date).toISOString()}>{fullDate(post.date)}</time>
            <span className="dotsep">·</span>
            <span>{post.readtime}</span>
          </div>
        </header>
        <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />
      </article>

      {/* ───────── Image lightbox ───────── */}
      <div id="lightbox" className="lightbox" hidden aria-hidden="true" role="dialog">
        <button type="button" className="lightbox-close" aria-label="Close">×</button>
        <img className="lightbox-img" alt="" />
        <figcaption className="lightbox-cap" hidden></figcaption>
      </div>
    </>
  );
}
