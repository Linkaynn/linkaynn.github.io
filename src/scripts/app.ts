// ───────────────────────────────────────────────────────────
// Portfolio — Terminal Minimal interactivity.
// Re-implementation of the design's React behaviors in vanilla TS.
//   theme + lang toggles · typewriter · scramble · magnetic
//   spotlight · reveal · breathing dot (7× egg)
//   command palette (/, ⌘K) · konami → CRT · "coffee" → ASCII burst
//   achievement tracking
// ───────────────────────────────────────────────────────────

type Lang = "en" | "es";
type Theme = "light" | "dark";

const ACHIEVEMENTS: ReadonlyArray<string> = [
  "command-line",
  "caffeinated",
  "vintage-mode",
  "pixel-pusher",
];

const SCR_CHARS = "▓▒░·*+=<>/\\|abcdef0123456789{}[]()";

// ── One-time global (window/document) listeners ──
// These attach once per script-module load and survive Astro page swaps,
// so we must NOT re-add them in boot().
let globalsBound = false;
function initGlobals() {
  if (globalsBound) return;
  globalsBound = true;
  initSpotlight();
  initKonami();
  initCoffeeListener();
  initPalette();
}

// ── Per-page boot (idempotent within a single DOM) ──
let pageBooted = false;
function boot() {
  if (pageBooted) return;
  pageBooted = true;

  applyLang(getLang());
  applyTheme(getTheme());

  initMagnetic();
  initScrambles();
  initReveals();
  initSmoothAnchors();

  initHeroTypewriter();
  initLiveClock();
  initGreeting();
  initNowHover();

  initLangToggle();
  initThemeToggle();
  initLogoDot();

  initAchievementsFooter();
  initHintChip();
}

// ── Persisted state ─────────────────────────────────────────
const LS_THEME = "jr.theme";
const LS_LANG = "jr.lang";
const LS_ACH = "jr.achievements";

function systemPrefersDark(): boolean {
  try {
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  } catch { return false; }
}
function getTheme(): Theme {
  // 1) explicit user choice in localStorage wins,
  // 2) otherwise the data-theme set by the FOUC inline script (already mirrors OS),
  // 3) finally fall back to matchMedia in case the dataset got stomped.
  try {
    const stored = localStorage.getItem(LS_THEME);
    if (stored === "dark" || stored === "light") return stored;
  } catch {}
  const t = document.documentElement.dataset.theme as Theme | undefined;
  if (t === "dark" || t === "light") return t;
  return systemPrefersDark() ? "dark" : "light";
}
function setTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem(LS_THEME, t); } catch {}
  applyTheme(t);
}
function applyTheme(t: Theme) {
  const icon = document.getElementById("theme-icon");
  if (icon) icon.textContent = t === "dark" ? "☾" : "☀";
}

function getLang(): Lang {
  try {
    const stored = localStorage.getItem(LS_LANG);
    if (stored === "en" || stored === "es") return stored;
  } catch {}
  const l = (document.documentElement.dataset.lang as Lang) || "en";
  return l === "es" ? "es" : "en";
}
function setLang(l: Lang) {
  document.documentElement.dataset.lang = l;
  try { localStorage.setItem(LS_LANG, l); } catch {}
  applyLang(l);
}
function applyLang(l: Lang) {
  // Show/hide dual-rendered spans
  document.querySelectorAll<HTMLElement>("[data-lang]").forEach((el) => {
    const want = el.getAttribute("data-lang");
    el.hidden = want !== l;
  });
  // Inline text via data-i18n-en/es
  document.querySelectorAll<HTMLElement>("[data-i18n-en]").forEach((el) => {
    const en = el.getAttribute("data-i18n-en") || "";
    const es = el.getAttribute("data-i18n-es") || en;
    el.textContent = l === "es" ? es : en;
  });
  // Placeholders
  document.querySelectorAll<HTMLInputElement>("[data-i18n-placeholder-en]").forEach((el) => {
    const en = el.getAttribute("data-i18n-placeholder-en") || "";
    const es = el.getAttribute("data-i18n-placeholder-es") || en;
    el.placeholder = l === "es" ? es : en;
  });
  // Scramble text targets (data-text-en / data-text-es) refresh
  document.querySelectorAll<HTMLElement>(".scramble[data-text-en]").forEach((el) => {
    const en = el.getAttribute("data-text-en") || "";
    const es = el.getAttribute("data-text-es") || en;
    const next = l === "es" ? es : en;
    el.setAttribute("data-text", next);
    el.textContent = next;
  });
  // Achievement label/hint
  document.querySelectorAll<HTMLElement>("#ach-list li").forEach((li) => {
    const label = li.querySelector<HTMLElement>(".label");
    const hint = li.querySelector<HTMLElement>(".hint");
    if (label) {
      const en = label.getAttribute("data-label-en") || "";
      const es = label.getAttribute("data-label-es") || en;
      const text = l === "es" ? es : en;
      if (li.classList.contains("unlocked")) label.textContent = text;
      else label.innerHTML = redactLabel(text);
    }
    if (hint) {
      const isUnlocked = li.classList.contains("unlocked");
      if (isUnlocked) {
        hint.textContent = l === "es" ? "encontrado." : "found.";
      } else {
        const en = hint.getAttribute("data-hint-en") || "";
        const es = hint.getAttribute("data-hint-es") || en;
        hint.textContent = l === "es" ? es : en;
      }
    }
  });
  // "Now" values use data-en / data-es directly (not data-i18n-en/es) so they
  // remain swappable on hover-scramble. Sync them here too.
  document.querySelectorAll<HTMLElement>(".now-val").forEach((dd) => {
    const en = dd.getAttribute("data-en") || "";
    const es = dd.getAttribute("data-es") || en;
    const text = l === "es" ? es : en;
    dd.setAttribute("data-text", text);
    dd.textContent = text;
  });
  // Achievement count text
  refreshAchUI();
  // Greeting refresh
  refreshGreeting();
}

function redactLabel(text: string): string {
  let out = "";
  for (const c of text) out += (c === "-" || c === " ") ? c : "█";
  return out;
}

// ── Achievements ────────────────────────────────────────────
function loadAch(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_ACH);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return new Set(arr);
  } catch {}
  return new Set();
}
function saveAch(s: Set<string>) {
  try { localStorage.setItem(LS_ACH, JSON.stringify([...s])); } catch {}
}

const achState = loadAch();

function unlock(id: string) {
  if (!ACHIEVEMENTS.includes(id)) return;
  if (achState.has(id)) return;
  achState.add(id);
  saveAch(achState);
  refreshAchUI();
  // Auto-open drawer the first time something unlocks
  if (achState.size === 1) {
    const btn = document.getElementById("achievements-toggle");
    btn?.click?.();
  }
}

function refreshAchUI() {
  const lang = getLang();
  const total = ACHIEVEMENTS.length;
  const count = achState.size;

  const btn = document.getElementById("achievements-toggle");
  const counter = document.getElementById("ach-count");
  if (counter) counter.textContent = `☆ ${count}/${total}`;
  btn?.classList.toggle("has-unlocks", count > 0);

  document.querySelectorAll<HTMLElement>("#ach-list li").forEach((li) => {
    const id = li.getAttribute("data-id") || "";
    const isUnlocked = achState.has(id);
    li.classList.toggle("unlocked", isUnlocked);
    const mark = li.querySelector<HTMLElement>(".mark");
    if (mark) mark.textContent = isUnlocked ? "✓" : "□";

    const label = li.querySelector<HTMLElement>(".label");
    const hint = li.querySelector<HTMLElement>(".hint");
    if (label) {
      const en = label.getAttribute("data-label-en") || "";
      const es = label.getAttribute("data-label-es") || en;
      const text = lang === "es" ? es : en;
      if (isUnlocked) label.textContent = text;
      else label.innerHTML = redactLabel(text);
    }
    if (hint) {
      if (isUnlocked) {
        hint.textContent = lang === "es" ? "encontrado." : "found.";
      } else {
        const en = hint.getAttribute("data-hint-en") || "";
        const es = hint.getAttribute("data-hint-es") || en;
        hint.textContent = lang === "es" ? es : en;
      }
    }
  });

  const tally = document.getElementById("ach-tally");
  if (tally) {
    if (count === 0) { tally.hidden = true; }
    else {
      tally.hidden = false;
      tally.textContent = count === total
        ? (lang === "es" ? "los cuatro. eres minucioso — gracias por quedarte." : "all four found. you're thorough — thanks for staying.")
        : (lang === "es" ? `quedan ${total - count}.` : `${total - count} left.`);
    }
  }
}

function initAchievementsFooter() {
  const btn = document.getElementById("achievements-toggle");
  const drawer = document.getElementById("ach-drawer");
  if (!btn || !drawer) return;
  drawer.hidden = false; // visibility now controlled by .open class + max-height
  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", expanded ? "false" : "true");
    drawer.classList.toggle("open", !expanded);
    if (!expanded) {
      // staggered pop-in
      drawer.querySelectorAll<HTMLElement>("#ach-list li").forEach((li, i) => {
        li.classList.remove("pop-in");
        // restart animation
        void li.offsetWidth;
        li.style.animationDelay = `${i * 60}ms`;
        li.classList.add("pop-in");
      });
    }
  });
  refreshAchUI();
}

// ── Spotlight ───────────────────────────────────────────────
function initSpotlight() {
  const sp = document.getElementById("spotlight");
  if (!sp) return;
  const onMove = (e: MouseEvent) => {
    document.body.classList.add("spotlight-on");
    sp.style.setProperty("--mx", `${e.clientX}px`);
    sp.style.setProperty("--my", `${e.clientY}px`);
  };
  const onLeave = () => document.body.classList.remove("spotlight-on");
  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mouseleave", onLeave);
}

// ── Magnetic ────────────────────────────────────────────────
function initMagnetic() {
  document.querySelectorAll<HTMLElement>(".magnetic").forEach((el) => {
    const strength = parseFloat(el.getAttribute("data-strength") || "0.35");
    const radius = parseFloat(el.getAttribute("data-radius") || "120");
    el.style.display = el.style.display || "inline-block";
    el.style.willChange = "transform";
    el.style.transition = el.style.transition || "transform .35s cubic-bezier(.2,.7,.2,1)";

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) {
        el.style.transform = "translate3d(0,0,0)";
        return;
      }
      el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
    };
    const onLeave = () => { el.style.transform = "translate3d(0,0,0)"; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
  });
}

// ── Scramble ────────────────────────────────────────────────
function scrambleOnce(el: HTMLElement, duration = 600) {
  const text = el.getAttribute("data-text") || el.textContent || "";
  const start = performance.now();
  let raf = 0;
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    const revealUpTo = Math.floor(p * text.length);
    let s = "";
    for (let i = 0; i < text.length; i++) {
      if (i < revealUpTo) s += text[i];
      else if (text[i] === " ") s += " ";
      else s += SCR_CHARS[Math.floor(Math.random() * SCR_CHARS.length)];
    }
    el.textContent = s;
    if (p < 1) raf = requestAnimationFrame(tick);
    else el.textContent = text;
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

function initScrambles() {
  document.querySelectorAll<HTMLElement>(".scramble").forEach((el) => {
    const trigger = el.getAttribute("data-trigger") || "hover";
    if (!el.getAttribute("data-text")) {
      // fallback: use current text
      el.setAttribute("data-text", el.textContent || "");
    }
    if (trigger === "auto") {
      scrambleOnce(el, 600);
    } else if (trigger === "mount") {
      // Run once when revealed by IO; we attach via reveal observer
      el.dataset.scrambleOnReveal = "1";
    } else {
      // hover
      el.addEventListener("mouseenter", () => scrambleOnce(el, 400));
    }
  });
}

// ── Reveal-on-mount (sequential) and IntersectionObserver fallback ──
function initReveals() {
  const reveals = document.querySelectorAll<HTMLElement>(".reveal");
  reveals.forEach((el) => {
    const y = parseFloat(el.getAttribute("data-y") || "12");
    const blur = parseFloat(el.getAttribute("data-blur") || "8");
    el.style.setProperty("--ry", `${y}px`);
    el.style.setProperty("--rb", `${blur}px`);
  });

  const show = (el: HTMLElement) => {
    if (el.classList.contains("shown")) return;
    el.classList.add("shown");
    // trigger scramble-on-reveal for descendants
    el.querySelectorAll<HTMLElement>('.scramble[data-scramble-on-reveal="1"]').forEach((s) => {
      scrambleOnce(s, 500);
      s.removeAttribute("data-scramble-on-reveal");
    });
  };

  // For elements with explicit delay (hero etc.) show on a timer.
  // For others, use IntersectionObserver.
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const t = e.target as HTMLElement;
          show(t);
          io.unobserve(t);
        }
      });
    },
    { rootMargin: "0px 0px -40px 0px", threshold: 0.05 }
  );

  reveals.forEach((el) => {
    const delay = parseInt(el.getAttribute("data-delay") || "-1", 10);
    if (delay >= 0) {
      window.setTimeout(() => show(el), delay);
    } else {
      io.observe(el);
    }
  });
}

// ── Hero typewriter ─────────────────────────────────────────
function initHeroTypewriter() {
  const target = document.getElementById("typed-name");
  const dot = document.getElementById("name-dot");
  const caret = document.getElementById("name-caret");
  if (!target) return;
  const full = "Jesé Romero";
  let i = 0;
  const id = window.setInterval(() => {
    i++;
    target.textContent = full.slice(0, i);
    if (i >= full.length) {
      window.clearInterval(id);
      dot?.classList.add("show");
      caret?.classList.add("done");
    }
  }, 65);
}

// ── Live clock(s) ───────────────────────────────────────────
// Always show Jesé's clock (Atlantic/Canary). If the visitor is in a
// different timezone, reveal a second clock + city for them.
let clockTimer = 0;
const HOME_TZ = "Atlantic/Canary";

function prettyCityFromTZ(tz: string): string {
  // "Europe/London" → "London"; "America/New_York" → "New York"
  const tail = tz.split("/").pop() || tz;
  return tail.replace(/_/g, " ");
}

function initLiveClock() {
  const home = document.getElementById("live-clock");
  if (!home) return;

  const fmtHome = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    timeZone: HOME_TZ, hour12: false,
  });

  // Visitor's timezone (best-effort, no permission prompt).
  let visitorTZ = "";
  try {
    visitorTZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {}

  const visitorWrap = document.getElementById("visitor-clock");
  const visitorTime = document.getElementById("visitor-time");
  const visitorPlace = document.getElementById("visitor-place");

  const isElsewhere = !!visitorTZ && visitorTZ !== HOME_TZ;
  if (visitorWrap) visitorWrap.hidden = !isElsewhere;

  let fmtVisitor: Intl.DateTimeFormat | null = null;
  if (isElsewhere) {
    try {
      fmtVisitor = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        timeZone: visitorTZ, hour12: false,
      });
      if (visitorPlace) visitorPlace.textContent = prettyCityFromTZ(visitorTZ);
    } catch {
      if (visitorWrap) visitorWrap.hidden = true;
    }
  }

  const tick = () => {
    const now = new Date();
    home.textContent = fmtHome.format(now);
    if (fmtVisitor && visitorTime) visitorTime.textContent = fmtVisitor.format(now);
  };
  tick();
  if (clockTimer) window.clearInterval(clockTimer);
  clockTimer = window.setInterval(tick, 1000);
}

// ── Greeting (time-aware, bilingual) ────────────────────────
let greetingTimer = 0;
function refreshGreeting() {
  const el = document.getElementById("greeting");
  if (!el) return;
  const lang = getLang();
  const h = new Date().getHours();
  const map: Record<number, { en: string; es: string }> = {
    0:  { en: "late night",    es: "trasnochando" },
    5:  { en: "early bird",    es: "madrugando" },
    8:  { en: "good morning",  es: "buenos días" },
    12: { en: "good afternoon", es: "buenas tardes" },
    18: { en: "good evening",  es: "buenas tardes" },
    22: { en: "late night",    es: "trasnochando" },
  };
  const keys = Object.keys(map).map(Number).sort((a, b) => a - b);
  let key = keys[0];
  for (const k of keys) if (k <= h) key = k;
  const text = map[key][lang];
  el.setAttribute("data-text", text);
  el.textContent = text;
}
function initGreeting() {
  refreshGreeting();
  if (greetingTimer) window.clearInterval(greetingTimer);
  greetingTimer = window.setInterval(refreshGreeting, 60000);
}

// ── Now value hover-scramble ────────────────────────────────
function initNowHover() {
  document.querySelectorAll<HTMLElement>(".now-val").forEach((dd) => {
    const update = () => {
      const lang = getLang();
      const en = dd.getAttribute("data-en") || "";
      const es = dd.getAttribute("data-es") || en;
      const text = lang === "es" ? es : en;
      dd.setAttribute("data-text", text);
      dd.textContent = text;
    };
    update();
    dd.addEventListener("mouseenter", () => scrambleOnce(dd, 350));
    // re-apply translation on lang switch via mutation observer is overkill;
    // we just reapply on click of toggle (see initLangToggle which calls applyLang -> not now-val).
    // For correctness, override applyLang side-effect by re-syncing now-vals on language change events:
    window.addEventListener("jr:langchange", update);
  });
}

// ── Smooth anchor scroll ────────────────────────────────────
function initSmoothAnchors() {
  document.querySelectorAll<HTMLAnchorElement>("a[data-smooth]").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";
      if (!href.includes("#")) return;
      const hash = href.substring(href.indexOf("#"));
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
      history.replaceState(null, "", hash);
    });
  });
}

// ── Lang toggle ─────────────────────────────────────────────
function initLangToggle() {
  const btn = document.getElementById("lang-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const next: Lang = getLang() === "en" ? "es" : "en";
    setLang(next);
    window.dispatchEvent(new Event("jr:langchange"));
  });
}

// ── Theme toggle ────────────────────────────────────────────
function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    setTheme(getTheme() === "dark" ? "light" : "dark");
  });
}

// ── Logo breathing dot — 7× click egg ──────────────────────
function initLogoDot() {
  const dot = document.getElementById("logo-dot");
  if (!dot) return;
  let clicks = 0;
  dot.addEventListener("click", (e) => {
    e.preventDefault();
    clicks++;
    (dot as HTMLElement).style.transform = `scale(${1 + Math.min(clicks, 7) * 0.05})`;
    if (clicks >= 7) {
      (dot as HTMLElement).style.background = "var(--accent-2)";
      unlock("pixel-pusher");
    }
  });
}

// ── Konami ──────────────────────────────────────────────────
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
function initKonami() {
  let i = 0;
  window.addEventListener("keydown", (e) => {
    const want = KONAMI[i];
    const got = e.key === want || e.key.toLowerCase() === want;
    if (got) {
      i++;
      if (i === KONAMI.length) {
        toggleCRT();
        unlock("vintage-mode");
        i = 0;
      }
    } else {
      i = 0;
    }
  });
}
function toggleCRT(force?: boolean) {
  const el = document.getElementById("crt");
  if (!el) return;
  const next = typeof force === "boolean" ? force : !!el.hidden;
  el.hidden = !next;
}
function isCRTOn(): boolean {
  const el = document.getElementById("crt");
  return !!el && !el.hidden;
}

// ── "coffee" key sequence ───────────────────────────────────
function triggerCoffee() {
  const host = document.getElementById("coffee-host");
  if (!host) return;
  const node = document.createElement("div");
  node.className = "coffee-burst";
  node.innerHTML = `<pre>${"     )  (\n    (   ) )\n     ) ( (\n   _______)_\n.-'---------|\n( C|/\\/\\/\\/|\n '-./\\/\\/\\/|\n   '_______'"}</pre><div class="coffee-brewed">brewed.</div>`;
  host.appendChild(node);
  unlock("caffeinated");
  window.setTimeout(() => node.remove(), 4000);
}

function initCoffeeListener() {
  const word = "coffee";
  let buf = "";
  window.addEventListener("keydown", (e) => {
    const tag = ((e.target as HTMLElement)?.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (e.key.length === 1) {
      buf = (buf + e.key.toLowerCase()).slice(-word.length);
      if (buf === word) {
        triggerCoffee();
        buf = "";
      }
    } else if (e.key === "Escape") {
      buf = "";
    }
  });
}

// ── Command palette ─────────────────────────────────────────
type Row = { kind: "info" | "cmd" | "out" | "err"; text: string };
const paletteHistory: Row[] = [];

function paletteOpen(): boolean {
  const el = document.getElementById("palette");
  return !!el && !el.hidden;
}
function setPaletteOpen(open: boolean) {
  const el = document.getElementById("palette");
  if (!el) return;
  el.hidden = !open;
  if (open) {
    const input = document.getElementById("palette-input") as HTMLInputElement | null;
    window.setTimeout(() => input?.focus(), 60);
    if (paletteHistory.length === 0) {
      const lang = getLang();
      pushPaletteRow({
        kind: "info",
        text: lang === "es"
          ? "escribe `help` para ver comandos · esc para cerrar"
          : "type `help` for a list of commands · esc to close",
      });
    }
  }
}

function pushPaletteRow(row: Row) {
  paletteHistory.push(row);
  const log = document.getElementById("palette-log");
  if (!log) return;
  const div = document.createElement("div");
  div.className = `row ${row.kind}`;
  div.textContent = row.text;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function execCommand(raw: string) {
  const cmd = raw.trim();
  if (!cmd) return;
  pushPaletteRow({ kind: "cmd", text: cmd });
  const [head, ...rest] = cmd.split(/\s+/);
  const arg = rest.join(" ");
  const lang = getLang();

  switch (head.toLowerCase()) {
    case "help":
      pushPaletteRow({ kind: "out", text:
`available commands:
  help                show this list
  ls                  list sections of this site
  whoami              about me
  projects            jump to projects
  writing | blog      jump to writing
  contact             jump to contact
  open <name>         open a project (mymedesp, characters-vault, animabf, aristeia)
  theme [dark|light]  toggle theme
  lang  [en|es]       toggle language
  coffee              ☕
  vintage             toggle CRT mode (or try ↑↑↓↓←→←→BA)
  hire | sudo hire-me see if I'm taking new work
  hints | achievements  list the hidden things on this page
  clear               wipe the buffer
  exit                close the terminal` });
      break;

    case "hints":
    case "achievements":
    case "todo": {
      const lines = ACHIEVEMENTS.map((id) => {
        const labelEn: Record<string, string> = {
          "command-line": "command-line",
          "caffeinated": "caffeinated",
          "vintage-mode": "vintage-mode",
          "pixel-pusher": "pixel-pusher",
        };
        const labelEs: Record<string, string> = {
          "command-line": "línea-de-comandos",
          "caffeinated": "cafeinado",
          "vintage-mode": "modo-vintage",
          "pixel-pusher": "buscalíos",
        };
        const hintEn: Record<string, string> = {
          "command-line": "summon the terminal — one keystroke, one symbol",
          "caffeinated": "type a 6-letter beverage, anywhere",
          "vintage-mode": "press ↑ ↑ ↓ ↓ ← → ← → B A (the Konami code)",
          "pixel-pusher": "poke the green dot · seven times exactly",
        };
        const hintEs: Record<string, string> = {
          "command-line": "invoca la terminal — una tecla, un símbolo",
          "caffeinated": "escribe una bebida de 6 letras, en cualquier sitio",
          "vintage-mode": "pulsa ↑ ↑ ↓ ↓ ← → ← → B A (el código Konami)",
          "pixel-pusher": "pulsa el punto verde · siete veces exactas",
        };
        const lbl = (lang === "es" ? labelEs : labelEn)[id].padEnd(22);
        const hnt = (lang === "es" ? hintEs : hintEn)[id];
        return `  ☐ ${lbl} ${hnt}`;
      }).join("\n");
      pushPaletteRow({ kind: "out", text:
`hidden things on this page:\n${lines}\n\nscroll to the footer to track what you've found.` });
      break;
    }

    case "ls":
      pushPaletteRow({ kind: "out", text:
`drwxr-xr-x  home/
drwxr-xr-x  projects/
drwxr-xr-x  writing/
drwxr-xr-x  contact/
-rw-r--r--  .easter-eggs (hidden)` });
      break;

    case "whoami":
      pushPaletteRow({ kind: "out", text: lang === "es"
        ? "jesé romero — ingeniero de software, madrid. construyo mymedesp y characters vault. me gustan las montañas."
        : "jesé romero — software engineer, madrid. building mymedesp & characters vault. likes mountains." });
      break;

    case "projects":
    case "writing":
    case "blog":
    case "contact": {
      const target = head === "blog" ? "writing" : head;
      pushPaletteRow({ kind: "out", text: `→ scrolling to #${target}` });
      window.setTimeout(() => {
        const el = document.getElementById(target);
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
        setPaletteOpen(false);
      }, 200);
      break;
    }

    case "open": {
      const projectsUrls: Record<string, string> = {
        "mymedesp": "mymedesp.com",
        "characters-vault": "charactersvault.com",
        "animabf": "foundryvtt.com/packages/animabf",
        "aristeia": "aristeiaclub.com",
      };
      const hit = Object.keys(projectsUrls).find((k) => k === arg || k.startsWith(arg));
      if (!hit) pushPaletteRow({ kind: "err", text: `no project named "${arg}"` });
      else {
        pushPaletteRow({ kind: "out", text: `opening ${hit} ↗ ${projectsUrls[hit]}` });
        window.open("https://" + projectsUrls[hit], "_blank");
      }
      break;
    }

    case "theme": {
      const want: Theme = arg === "dark" ? "dark" : arg === "light" ? "light" : (getTheme() === "dark" ? "light" : "dark");
      setTheme(want);
      pushPaletteRow({ kind: "out", text: `theme → ${want}` });
      break;
    }

    case "lang": {
      const v = arg || (getLang() === "en" ? "es" : "en");
      const want: Lang = v === "es" ? "es" : "en";
      setLang(want);
      window.dispatchEvent(new Event("jr:langchange"));
      pushPaletteRow({ kind: "out", text: `lang → ${want}` });
      break;
    }

    case "coffee":
    case "café":
      pushPaletteRow({ kind: "out", text: "☕ brewing…" });
      triggerCoffee();
      break;

    case "vintage":
    case "crt": {
      const wasOn = isCRTOn();
      toggleCRT(!wasOn);
      unlock("vintage-mode");
      pushPaletteRow({ kind: "out", text: wasOn ? "vintage off" : "vintage on · scanlines engaged" });
      break;
    }

    case "hire":
      pushPaletteRow({ kind: "out", text: lang === "es"
        ? "ahora mismo enviando side projects, pero siempre abierto a conversaciones interesantes.\n→ jeseromeroarbelo@gmail.com"
        : "currently shipping side projects, but always open to interesting conversations.\n→ jeseromeroarbelo@gmail.com" });
      break;

    case "sudo":
      if (rest[0] !== "hire-me") {
        pushPaletteRow({ kind: "err", text: `sudo: command not found: ${rest.join(" ")}` });
        break;
      }
      pushPaletteRow({ kind: "out", text: lang === "es"
        ? "ahora mismo enviando side projects, pero siempre abierto a conversaciones interesantes.\n→ jeseromeroarbelo@gmail.com"
        : "currently shipping side projects, but always open to interesting conversations.\n→ jeseromeroarbelo@gmail.com" });
      break;

    case "clear": {
      paletteHistory.length = 0;
      const log = document.getElementById("palette-log");
      if (log) log.innerHTML = "";
      pushPaletteRow({ kind: "info", text: lang === "es" ? "buffer limpio" : "buffer cleared" });
      return;
    }

    case "exit":
    case "q":
    case "quit":
      setPaletteOpen(false);
      return;

    default:
      pushPaletteRow({ kind: "err", text: `command not found: ${head}. try \`help\`.` });
  }
}

function initPalette() {
  const el = document.getElementById("palette");
  const form = document.getElementById("palette-form") as HTMLFormElement | null;
  const input = document.getElementById("palette-input") as HTMLInputElement | null;
  const backdrop = el?.querySelector(".palette-backdrop") as HTMLElement | null;
  if (!el || !form || !input) return;

  window.addEventListener("keydown", (e) => {
    const tag = ((e.target as HTMLElement)?.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") {
      if (e.key === "Escape" && paletteOpen()) setPaletteOpen(false);
      return;
    }
    if (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
      e.preventDefault();
      setPaletteOpen(!paletteOpen());
      unlock("command-line");
    } else if (e.key === "Escape") {
      setPaletteOpen(false);
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = "";
    execCommand(v);
  });

  backdrop?.addEventListener("click", () => setPaletteOpen(false));
}

// ── Terminal CTAs: floating hint chip + footer button ──────
function initHintChip() {
  const open = () => { setPaletteOpen(true); unlock("command-line"); };
  document.getElementById("hint-chip")?.addEventListener("click", open);
  document.getElementById("footer-open-terminal")?.addEventListener("click", open);
}

// ── Init on DOM ready + on Astro page swaps ─────────────────
// Global (window) listeners are bound once at script load.
initGlobals();

// Per-page handlers are (re-)bound when the DOM is ready and on every nav.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
// Reset the per-page flag before Astro swaps the DOM, then re-run on load.
document.addEventListener("astro:before-swap", () => { pageBooted = false; });

// Astro's view transitions replace the <html> attributes with whatever the new
// page hardcodes (data-theme="light"). Restore the user's preference from
// localStorage BEFORE paint so the new page doesn't flash light first.
// If no explicit preference, fall back to the OS's prefers-color-scheme.
document.addEventListener("astro:after-swap", () => {
  try {
    const root = document.documentElement;
    const t = localStorage.getItem(LS_THEME);
    const l = localStorage.getItem(LS_LANG);
    if (t === "dark" || t === "light") root.dataset.theme = t;
    else if (systemPrefersDark()) root.dataset.theme = "dark";
    else root.dataset.theme = "light";
    if (l === "en" || l === "es") root.dataset.lang = l;
  } catch {}
});

// Follow live OS theme changes, but only if the user hasn't picked one.
try {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onSysChange = (e: MediaQueryListEvent) => {
    try {
      if (localStorage.getItem(LS_THEME) === "dark" || localStorage.getItem(LS_THEME) === "light") return;
    } catch {}
    const next: Theme = e.matches ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    applyTheme(next);
  };
  // Modern + old Safari fallback.
  if (mq.addEventListener) mq.addEventListener("change", onSysChange);
  else (mq as any).addListener?.(onSysChange);
} catch {}

document.addEventListener("astro:page-load", boot);
