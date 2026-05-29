import { I18N } from '@/lib/i18n';
import { t } from '@/lib/lang';
import LangToggle from './LangToggle';
import './header.css';

// Sticky minimal nav: breathing-dot logo, anchor links, ES/EN + ☀/☾ toggles.
export default function Header({ lang }) {
  const projects = t(I18N.nav.projects, lang);
  const writing = t(I18N.nav.writing, lang);
  const sayHi = t(I18N.nav.sayHi, lang);

  return (
    <header className="site-header">
      <div className="hdr-inner">
        <a href={`/${lang}/#home`} className="logo magnetic" data-strength="0.3">
          <button type="button" className="dot" id="logo-dot" aria-label="status"></button>
          <span>jesé romero</span>
        </a>
        <nav>
          <a href={`/${lang}/#projects`} className="ulink magnetic" data-strength="0.25" data-smooth>
            <span className="scramble" data-text={projects}>{projects}</span>
          </a>
          <a href={`/${lang}/#writing`} className="ulink magnetic" data-strength="0.25" data-smooth>
            <span className="scramble" data-text={writing}>{writing}</span>
          </a>
          <a href={`/${lang}/#contact`} className="ulink magnetic" data-strength="0.25" data-smooth>
            <span className="scramble" data-text={sayHi}>{sayHi}</span>
          </a>
          <span className="dotsep">·</span>
          <LangToggle lang={lang} />
          <button className="mini magnetic" data-strength="0.25" id="theme-toggle" aria-label="theme">
            <span id="theme-icon">☀</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
