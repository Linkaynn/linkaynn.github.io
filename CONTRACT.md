# Migration build contract (Astro → Next)

Shared rules so independently-built components, the effects layer, blog and
contact all line up. **The original Astro source files are the source of truth
for markup, class names, ids, data-attributes and CSS.** Reproduce them
verbatim in JSX, applying only the adaptations below.

## Stack / conventions
- Next 16 App Router, React 18, **JavaScript/JSX** (no TS). pnpm. Alias `@/*` → repo root.
- Routes live under `app/[lang]/...`; `lang ∈ ['es','en']`, default `es`.
- Import co-located plain `.css` files from components (App Router treats them as global). Put each component's styles next to it (e.g. `components/header.css`), ported verbatim from the matching `.astro` `<style>` block. Base tokens + global chrome already live in `app/globals.css` — do **not** redefine tokens/keyframes.
- JSX: `class` → `className`, `for` → `htmlFor`, self-close void tags, `tabindex` → `tabIndex`, inline `style="x:y"` → `style={{ x: 'y' }}`.

## Locale adaptation (the ONE behavioral change)
The Astro site rendered BOTH languages in the DOM (`<span data-lang="en">` / `data-lang="es"`, plus `data-i18n-en/es`, `data-text-en/es`, `data-label-en/es`, `data-hint-en/es`) and toggled client-side. **We no longer do that.** Each locale is its own server-rendered route. So:
- Render only the **active locale's** text, pulled from `@/lib/i18n` via `t(node, lang)`.
- Collapse bilingual attribute pairs to a single attribute holding the active-locale value:
  - `data-text-en/es` → `data-text={t(x, lang)}`
  - `data-label-en/es` → `data-label={t(x, lang)}`
  - `data-hint-en/es` (+ `-en-touch/-es-touch`) → `data-hint={t(hint, lang)}` and `data-hint-touch={t(hintTouch, lang)}`
- The **language toggle** is no longer a button that swaps the DOM — it is a `<Link>` (client component `LangToggle`, uses `usePathname()`) to the same path under the other locale.
- `<html lang={lang}>` is set server-side; the effects layer reads `document.documentElement.lang` for the greeting / palette language.

## Selector contract (effects layer binds to these — keep them EXACT)
From `src/layouts/Header.astro`, `Footer.astro`, `Layout.astro`, `src/pages/index.astro`, `src/pages/blog/[slug].astro`:

- **Theme toggle**: `<button id="theme-toggle">` containing `<span id="theme-icon">☀</span>`.
- **Logo dot**: `<button class="dot magnetic?" id="logo-dot">` (7×-click easter egg).
- **Magnetic**: any element with class `magnetic`, optional `data-strength`, `data-radius`.
- **Scramble**: `<span class="scramble" data-text="…" [data-trigger="auto|mount|hover"]>…</span>`.
- **Reveal**: elements with class `reveal`, optional `data-delay`, `data-y`, `data-blur`.
- **Smooth scroll**: anchors with `data-smooth` (hash links like `/#projects`).
- **Hero**: `#greeting` (scramble, `data-trigger="auto"`), `#live-clock`, `#visitor-clock` (hidden), `#visitor-time`, `#visitor-place`; name typewriter `#typed-name`, `#name-dot`, `#name-caret`.
- **Portrait**: `#portrait` (role=button, tabindex 0, `data-alt-default`, `data-alt-fun`), children `.portrait-default`, `.portrait-fun`, caption `.portrait-name`, `#portrait-hint`. Toggles `.fun` class.
- **Now**: `.now-val` elements with `data-en`/`data-es` → collapse to `data-text`? NO — `.now-val` scrambles on hover reading its own text. Render the active-locale text as the element's text content (no data-* needed) and keep class `.now-val scramble`? Original used `.now-val` with `data-en`/`data-es` and a hover handler. Effects: hover-scramble `.now-val` using its text content. Render text content in active locale; drop `data-en/es`.
- **Footer terminal CTA**: `#footer-open-terminal`. **Achievements**: `#achievements-toggle` (aria-expanded), `#ach-count`, `#ach-caret`, `#ach-drawer`, `#ach-list` with `<li data-id="command-line|caffeinated|vintage-mode|pixel-pusher">` each containing `.mark`, `.label[data-label]`, `.hint[data-hint][data-hint-touch]`, `#ach-tally`. localStorage key `jr.achievements` (JSON array of ids).
- **Global chrome** (already in `app/[lang]/layout.jsx`): `#spotlight`, `#crt` (+ `.crt-*`), `#coffee-host`, `#palette` (`#palette-log`, `#palette-form`, `#palette-input`, `.palette-caret`), `#hint-chip`.
- **Blog post**: `.post-body` (markdown), images get `.zoomable` + lightbox via `#lightbox` (`.lightbox-img`, `.lightbox-cap`, `.lightbox-close`). Back link uses a `.scramble`.
- **localStorage**: theme `jr.theme`, achievements `jr.achievements`. (No `jr.lang` — locale is the URL now.)

## Components to exist (import paths the routes already use)
- `@/components/Header` (props `{lang}`), `@/components/Footer` (`{lang}`)
- `@/components/Home` (`{lang, posts:[{slug,title,date}]}`) — renders all home sections incl. `<ContactForm lang/>`
- `@/components/BlogList` (`{lang, posts:[{slug,title,date,excerpt,readtime}]}`)
- `@/components/BlogPost` (`{lang, post}`) — server-renders markdown
- `@/components/ContactForm` (`{lang}`) — `'use client'`
- `@/components/Interactions` (`{lang}`) — `'use client'`, runs the ported effects on mount
- `@/components/LangToggle` (`{lang}`) — `'use client'`

`post` shape from `lib/posts`: `{ slug, lang, title, date, excerpt, readtime, tags, content }`.
