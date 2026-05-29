import { I18N } from '@/lib/i18n';
import { t } from '@/lib/lang';
import { shortDate } from '@/lib/posts';
import './blog.css';

// Blog index for a single locale. Mirrors the home "writing" section's markup
// (.section-h / .slashes / .scramble, .post-list / .post-row) but adds an
// excerpt line and a back-to-home link. Server component.
export default function BlogList({ lang, posts }) {
  const title = t(I18N.writing.title, lang);

  return (
    <section className="writing">
      <a href={`/${lang}`} className="back-link">← home</a>

      <h2 className="section-h reveal" data-blur="0" data-y="6">
        <span className="slashes">//</span>
        <span className="scramble" data-trigger="mount" data-text={title}>{title}</span>
      </h2>

      <ul className="post-list">
        {posts.map((p, i) => (
          <li key={p.slug} className="reveal" data-delay={60 + i * 60} data-blur="0" data-y="6">
            <a className="post-row" href={`/${lang}/blog/${p.slug}`}>
              <span className="post-arrow">→</span>
              <span className="post-date">{shortDate(p.date)}</span>
              <span className="post-main">
                <span className="post-title">{p.title}</span>
                {p.excerpt && <span className="excerpt">{p.excerpt}</span>}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
