import { Fragment } from 'react';
import { I18N, SOCIALS, GITHUB_URL } from '@/lib/i18n';
import { t } from '@/lib/lang';
import { shortDate } from '@/lib/posts';
import ContactForm from './ContactForm';
import './home.css';

const NOW_DELAYS = [80, 120, 150, 190, 220, 260, 290, 330];

export default function Home({ lang, posts = [] }) {
  const bio = I18N.hero.bio[lang];
  const altDefault = 'Jesé en el campo, con paisaje canario detrás';
  const altFun = 'Jesé en el estadio de Las Palmas con colmillos de vampiro';

  return (
    <>
      {/* ───────────────────── Hero ───────────────────── */}
      <section id="home" className="hero">
        {/* Portrait: hover (desktop) / tap (mobile) crossfades between two photos. */}
        <div
          id="portrait"
          className="portrait"
          role="button"
          tabIndex={0}
          aria-label="Jesé en el campo, con paisaje canario detrás. Pasa el ratón o toca para cambiar."
          data-alt-default={altDefault}
          data-alt-fun={altFun}
        >
          <div className="portrait-frame">
            <img className="portrait-img portrait-default" src="/assets/jese-serious.jpg" alt="" loading="eager" decoding="async" />
            <img className="portrait-img portrait-fun" src="/assets/UD.JPG" alt="" loading="eager" decoding="async" />
            <span className="portrait-scan" aria-hidden="true"></span>
            <span className="portrait-corner tl"></span>
            <span className="portrait-corner tr"></span>
            <span className="portrait-corner bl"></span>
            <span className="portrait-corner br"></span>
          </div>
          <div className="portrait-caption" aria-hidden="true">
            <span className="portrait-name">jese.jpg</span>
            <span className="portrait-hint" id="portrait-hint">hover ↻</span>
          </div>
        </div>

        <div className="hero-meta reveal" data-blur="0" data-y="6">
          <span className="hero-prompt">$</span>
          <span className="scramble" id="greeting" data-trigger="auto" data-text="—">—</span>
          <span className="dotsep">·</span>
          <span className="clock" id="live-clock">00:00:00</span>
          <span> · {t(I18N.hero.place, lang)}</span>
          <span className="visitor-clock" id="visitor-clock" hidden>
            <span className="dotsep">·</span>
            <span>{t(I18N.hero.you, lang)}</span>
            <span className="dotsep">·</span>
            <span className="clock" id="visitor-time">00:00:00</span>
            <span> · </span>
            <span id="visitor-place"></span>
          </span>
        </div>

        <h1 className="hero-name">
          <span id="typed-name"></span><span className="dot" id="name-dot"></span><span className="caret-blink" id="name-caret">▌</span>
        </h1>

        <p className="hero-bio reveal" data-delay="850" data-blur="0" data-y="8">
          {bio.pre}
          <a href={`/${lang}/#projects`} className="ulink magnetic project-inline" data-strength="0.3" data-smooth>
            <span className="scramble" data-text={bio.idea}>{bio.idea}</span>
          </a>{bio.mid}
          <a href={`/${lang}/#writing`} className="ulink magnetic project-inline" data-strength="0.3" data-smooth>
            <span className="scramble" data-text={bio.articles}>{bio.articles}</span>
          </a>
          {bio.mid2}
          <a href={GITHUB_URL} className="ulink magnetic project-inline" data-strength="0.3">
            <span className="scramble" data-text={bio.oss}>{bio.oss}</span>
          </a>{bio.post}
        </p>

        <div className="hero-socials reveal" data-delay="1170" data-blur="0" data-y="8">
          {SOCIALS.map((s) => (
            <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="ulink magnetic" data-strength="0.4" data-radius="100">
              <span className="scramble" data-text={s.label}>{s.label}</span> ↗
            </a>
          ))}
        </div>
      </section>

      {/* ───────────────────── Now ───────────────────── */}
      <section className="now">
        <h2 className="section-h reveal" data-blur="0" data-y="6">
          <span className="slashes">//</span>
          <span className="scramble" data-trigger="mount" data-text={t(I18N.now.title, lang)}>{t(I18N.now.title, lang)}</span>
          <span className="now-live">
            <i className="now-pulse"></i>live
          </span>
        </h2>

        <dl className="now-grid">
          {I18N.now.items.map((item, i) => (
            <Fragment key={i}>
              <dt className="reveal" data-delay={NOW_DELAYS[i * 2]} data-blur="0" data-y="4">{t(item.k, lang)}</dt>
              <dd className="now-val reveal" data-delay={NOW_DELAYS[i * 2 + 1]} data-blur="0" data-y="4">{t(item.v, lang)}</dd>
            </Fragment>
          ))}
        </dl>
      </section>

      {/* ───────────────────── Projects ───────────────────── */}
      <section id="projects" className="projects">
        <h2 className="section-h reveal" data-blur="0" data-y="6">
          <span className="slashes">//</span>
          <span className="scramble" data-trigger="mount" data-text={t(I18N.projects.title, lang)}>{t(I18N.projects.title, lang)}</span>
        </h2>
        <ul className="proj-list">
          {I18N.projects.list.map((p, i) => {
            const inner = (
              <>
                <span className="proj-arrow">→</span>
                <div className="proj-head">
                  <div>
                    <span className="proj-name">{p.name}</span>
                    <span className="proj-tag">— {t(p.tagline, lang)}</span>
                  </div>
                  <span className="proj-year">
                    {p.archived && (
                      <span className="proj-archived">{t(I18N.projects.archived, lang)}</span>
                    )}
                    {p.year.split(' — ')[0]}
                  </span>
                </div>
                <div className="proj-stack">
                  {p.stack.map((s, j) => (
                    <span key={j} className="chip" style={{ transitionDelay: `${j * 30}ms` }}>{s}</span>
                  ))}
                </div>
              </>
            );
            return (
              <li key={p.id} className="reveal" data-delay={60 + i * 60} data-blur="0" data-y="6">
                {p.archived ? (
                  <div className="proj-row archived">{inner}</div>
                ) : (
                  <a className="proj-row" href={`https://${p.url}`} target="_blank" rel="noopener noreferrer">{inner}</a>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* ───────────────────── Writing ───────────────────── */}
      <section id="writing" className="writing">
        <h2 className="section-h reveal" data-blur="0" data-y="6">
          <span className="slashes">//</span>
          <span className="scramble" data-trigger="mount" data-text={t(I18N.writing.title, lang)}>{t(I18N.writing.title, lang)}</span>
        </h2>
        <ul className="post-list">
          {posts.map((p, i) => (
            <li key={p.slug} className="reveal" data-delay={60 + i * 60} data-blur="0" data-y="6">
              <a className="post-row" href={`/${lang}/blog/${p.slug}`}>
                <span className="post-arrow">→</span>
                <span className="post-date">{shortDate(p.date)}</span>
                <span className="post-title">{p.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────────────────── Contact ───────────────────── */}
      <section id="contact" className="contact">
        <h2 className="section-h reveal" data-blur="0" data-y="6">
          <span className="slashes">//</span>
          <span className="scramble" data-trigger="mount" data-text={t(I18N.contact.title, lang)}>{t(I18N.contact.title, lang)}</span>
        </h2>
        <p className="contact-text reveal" data-delay="80" data-blur="0" data-y="6">{t(I18N.contact.text, lang)}</p>
        <ContactForm lang={lang} />
      </section>
    </>
  );
}
