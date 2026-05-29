import { Analytics } from '@vercel/analytics/next';
import '../globals.css';
import { isLang, DEFAULT_LANG, LANGS } from '@/lib/lang';
import { I18N, SITE_ORIGIN } from '@/lib/i18n';
import { t } from '@/lib/lang';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Interactions from '@/components/Interactions';

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang: raw } = await params;
  const lang = isLang(raw) ? raw : DEFAULT_LANG;
  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: t(I18N.meta.home.title, lang),
    description: t(I18N.meta.home.description, lang),
    icons: { icon: '/favicon.svg' },
  };
}

// Apply the saved theme before paint to avoid a flash. The locale is already
// correct from SSR (<html lang>), so only the theme needs the inline script.
const THEME_INIT = `(function(){try{var r=document.documentElement;var s=localStorage.getItem('jr.theme');if(s==='dark'||s==='light'){r.dataset.theme=s;}else if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches){r.dataset.theme='dark';}}catch(e){}})();`;

export default async function RootLayout({ children, params }) {
  const { lang: raw } = await params;
  const lang = isLang(raw) ? raw : DEFAULT_LANG;

  return (
    <html lang={lang} data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <div id="spotlight" aria-hidden="true" />
        <Header lang={lang} />
        <main>{children}</main>
        <Footer lang={lang} />

        {/* CRT vintage overlay */}
        <div id="crt" aria-hidden="true" hidden>
          <div className="crt-scan" />
          <div className="crt-vignette" />
          <div className="crt-tint" />
          <div className="crt-badge">● rec · vintage mode</div>
        </div>

        {/* Coffee easter-egg container (filled by the effects layer) */}
        <div id="coffee-host" aria-hidden="true" />

        {/* Command palette overlay */}
        <div id="palette" hidden>
          <div className="palette-backdrop" />
          <div className="palette-window" role="dialog" aria-modal="true" aria-label="terminal">
            <div className="palette-head">
              <span>terminal · jese@portfolio</span>
              <span>
                <kbd>esc</kbd>
              </span>
            </div>
            <div className="palette-log" id="palette-log" />
            <form className="palette-form" id="palette-form" autoComplete="off">
              <span className="palette-prompt">$</span>
              <input
                id="palette-input"
                type="text"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                placeholder={t(I18N.palette.placeholder, lang)}
              />
              <span className="palette-caret">▌</span>
            </form>
          </div>
        </div>

        {/* Floating hint chip */}
        <button id="hint-chip" type="button" aria-label="open terminal">
          <span className="hc-dollar">$</span>
          <kbd>/</kbd>
          <span>{t(I18N.footer.openTerminal, lang)}</span>
        </button>

        <Interactions lang={lang} />
        <Analytics />
      </body>
    </html>
  );
}
