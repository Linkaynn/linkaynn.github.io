import { I18N } from '@/lib/i18n';
import { t } from '@/lib/lang';
import './footer.css';

export default function Footer({ lang }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="row">
        <span>© {year} — jesé romero</span>
      </div>

      <div className="row hints-row">
        <button
          id="footer-open-terminal"
          type="button"
          className="terminal-cta"
          title="open terminal"
          aria-label="open terminal"
        >
          <span className="kbd-hint">
            <span>{t(I18N.footer.press, lang)}</span>
            <kbd>/</kbd>
            <span>{t(I18N.footer.orKey, lang)}</span>
            <kbd>⌘K</kbd>
          </span>
          <span className="touch-cta">
            <span className="cta-dollar">$</span>
            <span>{t(I18N.footer.openTerminal, lang)}</span>
          </span>
        </button>
        <button id="achievements-toggle" type="button" aria-expanded="false">
          <span id="ach-count">☆ 0/4</span>
          <span>{t(I18N.footer.achievements, lang)}</span>
          <span className="caret-down" id="ach-caret">↓</span>
        </button>
      </div>

      <div className="ach-drawer" id="ach-drawer" hidden>
        <div className="ach-box">
          <div className="ach-head">{t(I18N.footer.achHead, lang)}</div>
          <ul className="ach-list" id="ach-list">
            {I18N.achievements.map((a) => (
              <li key={a.id} data-id={a.id}>
                <span className="mark">□</span>
                <span className="label" data-label={t(a.label, lang)}></span>
                <span
                  className="hint"
                  data-hint={t(a.hint, lang)}
                  data-hint-touch={a.hintTouch ? t(a.hintTouch, lang) : undefined}
                ></span>
              </li>
            ))}
          </ul>
          <div className="ach-tally" id="ach-tally" hidden></div>
        </div>
      </div>
    </footer>
  );
}
