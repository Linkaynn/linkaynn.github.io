// ───────────────────────────────────────────────────────────
// Portfolio — Terminal Minimal interactivity (ported from src/scripts/app.ts).
//
// Vanilla DOM behaviors driven from a React client component. `initEffects()`
// binds everything and returns a cleanup that removes every listener / interval
// / observer it added, so it can re-run safely on every client navigation.
//
// Locale is now route-based: there is no language toggle / DOM swap here. The
// active language for runtime-generated text is read from
// `document.documentElement.lang` ('es' | 'en'), set server-side.
// ───────────────────────────────────────────────────────────

const ACHIEVEMENTS = ['command-line', 'caffeinated', 'vintage-mode', 'pixel-pusher'];

const SCR_CHARS = '▓▒░·*+=<>/\\|abcdef0123456789{}[]()';

const LS_THEME = 'jr.theme';
const LS_ACH = 'jr.achievements';

const HOME_TZ = 'Atlantic/Canary';

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a',
];

// ── Helpers ─────────────────────────────────────────────────
function getLang() {
  const l = document.documentElement.lang;
  return l === 'es' ? 'es' : 'en';
}

function systemPrefersDark() {
  try {
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  } catch {
    return false;
  }
}

// Touch-only device (no fine pointer + no hover capability).
function isTouchDevice() {
  try {
    return !!(window.matchMedia &&
      window.matchMedia('(hover: none) and (pointer: coarse)').matches);
  } catch {
    return false;
  }
}

function getTheme() {
  try {
    const stored = localStorage.getItem(LS_THEME);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {}
  const t = document.documentElement.dataset.theme;
  if (t === 'dark' || t === 'light') return t;
  return systemPrefersDark() ? 'dark' : 'light';
}
function applyTheme(t) {
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = t === 'dark' ? '☾' : '☀';
}
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem(LS_THEME, t); } catch {}
  applyTheme(t);
}

function redactLabel(text) {
  let out = '';
  for (const c of text) out += (c === '-' || c === ' ') ? c : '█';
  return out;
}

// Pick the right achievement hint for the device (touch → palette-command hint).
function pickHint(el) {
  if (isTouchDevice()) {
    const tch = el.getAttribute('data-hint-touch');
    if (tch) return tch;
  }
  return el.getAttribute('data-hint') || '';
}

// ── Achievements state ──────────────────────────────────────
function loadAch() {
  try {
    const raw = localStorage.getItem(LS_ACH);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return new Set(arr);
  } catch {}
  return new Set();
}
function saveAch(s) {
  try { localStorage.setItem(LS_ACH, JSON.stringify([...s])); } catch {}
}

// ── Scramble ────────────────────────────────────────────────
function scrambleOnce(el, duration = 600) {
  const text = el.getAttribute('data-text') || el.textContent || '';
  const start = performance.now();
  let raf = 0;
  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const revealUpTo = Math.floor(p * text.length);
    let s = '';
    for (let i = 0; i < text.length; i++) {
      if (i < revealUpTo) s += text[i];
      else if (text[i] === ' ') s += ' ';
      else s += SCR_CHARS[Math.floor(Math.random() * SCR_CHARS.length)];
    }
    el.textContent = s;
    if (p < 1) raf = requestAnimationFrame(tick);
    else el.textContent = text;
  };
  raf = requestAnimationFrame(tick);
  return raf;
}

// ───────────────────────────────────────────────────────────
// initEffects — binds everything, returns a cleanup function.
// ───────────────────────────────────────────────────────────
export function initEffects() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  // Things to tear down on cleanup.
  const cleanups = [];
  const rafs = new Set();
  const intervals = new Set();
  const timeouts = new Set();
  const observers = new Set();

  const addListener = (target, type, handler, opts) => {
    target.addEventListener(type, handler, opts);
    cleanups.push(() => target.removeEventListener(type, handler, opts));
  };
  const setIntervalT = (fn, ms) => {
    const id = window.setInterval(fn, ms);
    intervals.add(id);
    return id;
  };
  const setTimeoutT = (fn, ms) => {
    const id = window.setTimeout(() => {
      timeouts.delete(id);
      fn();
    }, ms);
    timeouts.add(id);
    return id;
  };
  const addRaf = (fn) => {
    const id = requestAnimationFrame(fn);
    rafs.add(id);
    return id;
  };
  const observe = (obs) => {
    observers.add(obs);
    return obs;
  };

  // Wrap scrambleOnce so its rAF is tracked.
  const scramble = (el, duration) => {
    const id = scrambleOnce(el, duration);
    rafs.add(id);
  };

  // ── Achievements UI ───────────────────────────────────────
  const achState = loadAch();

  function refreshAchUI() {
    const lang = getLang();
    const total = ACHIEVEMENTS.length;
    const count = achState.size;

    const btn = document.getElementById('achievements-toggle');
    const counter = document.getElementById('ach-count');
    if (counter) counter.textContent = `${count > 0 ? '★' : '☆'} ${count}/${total}`;
    if (btn) btn.classList.toggle('has-unlocks', count > 0);

    document.querySelectorAll('#ach-list li').forEach((li) => {
      const id = li.getAttribute('data-id') || '';
      const isUnlocked = achState.has(id);
      li.classList.toggle('unlocked', isUnlocked);
      const mark = li.querySelector('.mark');
      if (mark) mark.textContent = isUnlocked ? '✓' : '□';

      const label = li.querySelector('.label');
      const hint = li.querySelector('.hint');
      if (label) {
        const text = label.getAttribute('data-label') || '';
        if (isUnlocked) label.textContent = text;
        else label.innerHTML = redactLabel(text);
      }
      if (hint) {
        if (isUnlocked) hint.textContent = lang === 'es' ? 'encontrado.' : 'found.';
        else hint.textContent = pickHint(hint);
      }
    });

    const tally = document.getElementById('ach-tally');
    if (tally) {
      if (count === 0) {
        tally.hidden = true;
      } else {
        tally.hidden = false;
        tally.textContent = count === total
          ? (lang === 'es'
            ? 'los cuatro. eres minucioso — gracias por quedarte.'
            : "all four found. you're thorough — thanks for staying.")
          : (lang === 'es' ? `quedan ${total - count}.` : `${total - count} left.`);
      }
    }
  }

  function unlock(id) {
    if (!ACHIEVEMENTS.includes(id)) return;
    if (achState.has(id)) return;
    achState.add(id);
    saveAch(achState);
    refreshAchUI();
    // Auto-open drawer the first time something unlocks.
    if (achState.size === 1) {
      const btn = document.getElementById('achievements-toggle');
      if (btn && btn.click) btn.click();
    }
  }

  function initAchievementsFooter() {
    const btn = document.getElementById('achievements-toggle');
    const drawer = document.getElementById('ach-drawer');
    if (!btn || !drawer) return;
    drawer.hidden = false; // visibility controlled by .open class + max-height
    addListener(btn, 'click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      drawer.classList.toggle('open', !expanded);
      if (!expanded) {
        drawer.querySelectorAll('#ach-list li').forEach((li, i) => {
          li.classList.remove('pop-in');
          void li.offsetWidth; // restart animation
          li.style.animationDelay = `${i * 60}ms`;
          li.classList.add('pop-in');
        });
      }
    });
    refreshAchUI();
  }

  // ── Spotlight ─────────────────────────────────────────────
  function initSpotlight() {
    const sp = document.getElementById('spotlight');
    if (!sp) return;
    const onMove = (e) => {
      document.body.classList.add('spotlight-on');
      sp.style.setProperty('--mx', `${e.clientX}px`);
      sp.style.setProperty('--my', `${e.clientY}px`);
    };
    const onLeave = () => document.body.classList.remove('spotlight-on');
    addListener(window, 'mousemove', onMove, { passive: true });
    addListener(window, 'mouseleave', onLeave);
  }

  // ── Magnetic ──────────────────────────────────────────────
  function initMagnetic() {
    document.querySelectorAll('.magnetic').forEach((el) => {
      const strength = parseFloat(el.getAttribute('data-strength') || '0.35');
      const radius = parseFloat(el.getAttribute('data-radius') || '120');
      // Transforms don't apply to plain inline elements, so upgrade only those
      // to inline-block. Leave inline-flex/flex/block as-is — forcing
      // inline-block here was clobbering the logo's `display:inline-flex` and
      // killing its gap (dot stuck to the name).
      if (getComputedStyle(el).display === 'inline') {
        el.style.display = 'inline-block';
      }
      el.style.willChange = 'transform';
      el.style.transition = el.style.transition || 'transform .35s cubic-bezier(.2,.7,.2,1)';

      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > radius) {
          el.style.transform = 'translate3d(0,0,0)';
          return;
        }
        el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
      };
      const onLeave = () => { el.style.transform = 'translate3d(0,0,0)'; };
      addListener(el, 'mousemove', onMove);
      addListener(el, 'mouseleave', onLeave);
    });
  }

  // ── Scramble ──────────────────────────────────────────────
  function initScrambles() {
    document.querySelectorAll('.scramble').forEach((el) => {
      const trigger = el.getAttribute('data-trigger') || 'hover';
      if (!el.getAttribute('data-text')) {
        el.setAttribute('data-text', el.textContent || '');
      }
      if (trigger === 'auto') {
        scramble(el, 600);
      } else if (trigger === 'mount') {
        el.dataset.scrambleOnReveal = '1';
      } else {
        addListener(el, 'mouseenter', () => scramble(el, 400));
      }
    });
  }

  // ── Reveal-on-mount + IntersectionObserver ────────────────
  function initReveals() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el) => {
      const y = parseFloat(el.getAttribute('data-y') || '12');
      const blur = parseFloat(el.getAttribute('data-blur') || '8');
      el.style.setProperty('--ry', `${y}px`);
      el.style.setProperty('--rb', `${blur}px`);
    });

    const show = (el) => {
      if (el.classList.contains('shown')) return;
      el.classList.add('shown');
      el.querySelectorAll('.scramble[data-scramble-on-reveal="1"]').forEach((s) => {
        scramble(s, 500);
        s.removeAttribute('data-scramble-on-reveal');
      });
    };

    const io = observe(new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.05 }
    ));

    reveals.forEach((el) => {
      const delay = parseInt(el.getAttribute('data-delay') || '-1', 10);
      if (delay >= 0) setTimeoutT(() => show(el), delay);
      else io.observe(el);
    });
  }

  // ── Hero typewriter ───────────────────────────────────────
  function initHeroTypewriter() {
    const target = document.getElementById('typed-name');
    const dot = document.getElementById('name-dot');
    const caret = document.getElementById('name-caret');
    if (!target) return;
    const full = 'Jesé Romero';
    let i = 0;
    const id = setIntervalT(() => {
      i++;
      target.textContent = full.slice(0, i);
      if (i >= full.length) {
        window.clearInterval(id);
        intervals.delete(id);
        if (dot) dot.classList.add('show');
        if (caret) caret.classList.add('done');
      }
    }, 65);
  }

  // ── Live clock(s) ─────────────────────────────────────────
  function prettyCityFromTZ(tz) {
    const tail = tz.split('/').pop() || tz;
    return tail.replace(/_/g, ' ');
  }

  function initLiveClock() {
    const home = document.getElementById('live-clock');
    if (!home) return;

    const fmtHome = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      timeZone: HOME_TZ, hour12: false,
    });

    let visitorTZ = '';
    try {
      visitorTZ = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch {}

    const visitorWrap = document.getElementById('visitor-clock');
    const visitorTime = document.getElementById('visitor-time');
    const visitorPlace = document.getElementById('visitor-place');

    const isElsewhere = !!visitorTZ && visitorTZ !== HOME_TZ;
    if (visitorWrap) visitorWrap.hidden = !isElsewhere;

    let fmtVisitor = null;
    if (isElsewhere) {
      try {
        fmtVisitor = new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit', minute: '2-digit', second: '2-digit',
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
    setIntervalT(tick, 1000);
  }

  // ── Greeting (time-aware, bilingual) ──────────────────────
  function refreshGreeting() {
    const el = document.getElementById('greeting');
    if (!el) return;
    const lang = getLang();
    const h = new Date().getHours();
    const map = {
      0: { en: 'late night', es: 'trasnochando' },
      5: { en: 'early bird', es: 'madrugando' },
      8: { en: 'good morning', es: 'buenos días' },
      12: { en: 'good afternoon', es: 'buenas tardes' },
      18: { en: 'good evening', es: 'buenas tardes' },
      22: { en: 'late night', es: 'trasnochando' },
    };
    const keys = Object.keys(map).map(Number).sort((a, b) => a - b);
    let key = keys[0];
    for (const k of keys) if (k <= h) key = k;
    const text = map[key][lang];
    el.setAttribute('data-text', text);
    el.textContent = text;
  }
  function initGreeting() {
    refreshGreeting();
    setIntervalT(refreshGreeting, 60000);
  }

  // ── Now value hover-scramble ──────────────────────────────
  function initNowHover() {
    document.querySelectorAll('.now-val').forEach((dd) => {
      if (!dd.getAttribute('data-text')) {
        dd.setAttribute('data-text', dd.textContent || '');
      }
      addListener(dd, 'mouseenter', () => scramble(dd, 350));
    });
  }

  // ── Smooth anchor scroll ──────────────────────────────────
  function initSmoothAnchors() {
    document.querySelectorAll('a[data-smooth]').forEach((a) => {
      addListener(a, 'click', (e) => {
        const href = a.getAttribute('href') || '';
        if (!href.includes('#')) return;
        const hash = href.substring(href.indexOf('#'));
        const el = document.querySelector(hash);
        if (!el) return;
        e.preventDefault();
        window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
        history.replaceState(null, '', hash);
      });
    });
  }

  // ── Theme toggle ──────────────────────────────────────────
  function initThemeToggle() {
    // Re-assert the persisted theme on every init. Client-side locale
    // switches (/es <-> /en) re-render the layout, and the inline anti-FOUC
    // script only runs on full loads — so without this, navigating could drop
    // back to the default theme. initEffects re-runs on each navigation.
    setTheme(getTheme());
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    addListener(btn, 'click', () => {
      setTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  // ── Logo breathing dot — 7× click egg ─────────────────────
  function initLogoDot() {
    const dot = document.getElementById('logo-dot');
    if (!dot) return;
    let clicks = 0;
    addListener(dot, 'click', (e) => {
      e.preventDefault();
      clicks++;
      dot.style.transform = `scale(${1 + Math.min(clicks, 7) * 0.05})`;
      if (clicks >= 7) {
        dot.style.background = 'var(--accent-2)';
        unlock('pixel-pusher');
      }
    });
  }

  // ── CRT ───────────────────────────────────────────────────
  function toggleCRT(force) {
    const el = document.getElementById('crt');
    if (!el) return;
    const next = typeof force === 'boolean' ? force : !!el.hidden;
    el.hidden = !next;
  }
  function isCRTOn() {
    const el = document.getElementById('crt');
    return !!el && !el.hidden;
  }

  // ── Konami ────────────────────────────────────────────────
  function initKonami() {
    let i = 0;
    addListener(window, 'keydown', (e) => {
      const want = KONAMI[i];
      const got = e.key === want || e.key.toLowerCase() === want;
      if (got) {
        i++;
        if (i === KONAMI.length) {
          toggleCRT();
          unlock('vintage-mode');
          i = 0;
        }
      } else {
        i = 0;
      }
    });
  }

  // ── "coffee" key sequence ─────────────────────────────────
  function triggerCoffee() {
    const host = document.getElementById('coffee-host');
    if (!host) return;
    const node = document.createElement('div');
    node.className = 'coffee-burst';
    node.innerHTML = `<pre>${'     )  (\n    (   ) )\n     ) ( (\n   _______)_\n.-\'---------|\n( C|/\\/\\/\\/|\n \'-./\\/\\/\\/|\n   \'_______\''}</pre><div class="coffee-brewed">brewed.</div>`;
    host.appendChild(node);
    unlock('caffeinated');
    setTimeoutT(() => node.remove(), 4000);
  }

  function initCoffeeListener() {
    const word = 'coffee';
    let buf = '';
    addListener(window, 'keydown', (e) => {
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key.length === 1) {
        buf = (buf + e.key.toLowerCase()).slice(-word.length);
        if (buf === word) {
          triggerCoffee();
          buf = '';
        }
      } else if (e.key === 'Escape') {
        buf = '';
      }
    });
  }

  // ── Command palette ───────────────────────────────────────
  const paletteHistory = [];

  function paletteOpen() {
    const el = document.getElementById('palette');
    return !!el && !el.hidden;
  }
  function pushPaletteRow(row) {
    paletteHistory.push(row);
    const log = document.getElementById('palette-log');
    if (!log) return;
    const div = document.createElement('div');
    div.className = `row ${row.kind}`;
    div.textContent = row.text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }
  function setPaletteOpen(open) {
    const el = document.getElementById('palette');
    if (!el) return;
    el.hidden = !open;
    if (open) {
      const input = document.getElementById('palette-input');
      setTimeoutT(() => { if (input) input.focus(); }, 60);
      if (paletteHistory.length === 0) {
        const lang = getLang();
        pushPaletteRow({
          kind: 'info',
          text: lang === 'es'
            ? 'escribe `help` para ver comandos · esc para cerrar'
            : 'type `help` for a list of commands · esc to close',
        });
      }
    }
  }

  function execCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    pushPaletteRow({ kind: 'cmd', text: cmd });
    const [head, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(' ');
    const lang = getLang();

    switch (head.toLowerCase()) {
      case 'help':
        pushPaletteRow({ kind: 'out', text:
`available commands:
  help                show this list
  ls                  list sections of this site
  whoami              about me
  projects            jump to projects
  writing | blog      jump to writing
  contact             jump to contact
  open <name>         open a project (benkyou, mymedesp, characters-vault, animabf, aristeia)
  social <name>       open a social (github, twitter, linkedin, instagram)
  theme [dark|light]  toggle theme
  lang  [en|es]       toggle language
  coffee              ☕
  vintage             toggle CRT mode (or try ↑↑↓↓←→←→BA)
  hire | sudo hire-me see if I'm taking new work
  hints | achievements  list the hidden things on this page
  clear               wipe the buffer
  exit                close the terminal` });
        break;

      case 'hints':
      case 'achievements':
      case 'todo': {
        const labelEn = {
          'command-line': 'command-line',
          'caffeinated': 'caffeinated',
          'vintage-mode': 'vintage-mode',
          'pixel-pusher': 'pixel-pusher',
        };
        const labelEs = {
          'command-line': 'línea-de-comandos',
          'caffeinated': 'cafeinado',
          'vintage-mode': 'modo-vintage',
          'pixel-pusher': 'buscalíos',
        };
        const hintEn = {
          'command-line': 'summon the terminal — one keystroke, one symbol',
          'caffeinated': 'type a 6-letter beverage, anywhere',
          'vintage-mode': 'press ↑ ↑ ↓ ↓ ← → ← → B A (the Konami code)',
          'pixel-pusher': 'poke the green dot · seven times exactly',
        };
        const hintEs = {
          'command-line': 'invoca la terminal — una tecla, un símbolo',
          'caffeinated': 'escribe en inglés una bebida de 6 letras, en cualquier sitio',
          'vintage-mode': 'pulsa ↑ ↑ ↓ ↓ ← → ← → B A (el código Konami)',
          'pixel-pusher': 'pulsa el punto verde · siete veces exactas',
        };
        const hintEnTouch = {
          'command-line': 'tap the open-terminal button below',
          'caffeinated': 'type `coffee` in this terminal',
          'vintage-mode': 'type `vintage` in this terminal',
          'pixel-pusher': 'tap the green dot · seven times exactly',
        };
        const hintEsTouch = {
          'command-line': 'pulsa el botón de abrir terminal abajo',
          'caffeinated': 'escribe `coffee` en esta terminal',
          'vintage-mode': 'escribe `vintage` en esta terminal',
          'pixel-pusher': 'pulsa el punto verde · siete veces exactas',
        };
        const touch = isTouchDevice();
        const hintsMap = touch
          ? (lang === 'es' ? hintEsTouch : hintEnTouch)
          : (lang === 'es' ? hintEs : hintEn);
        const lines = ACHIEVEMENTS.map((id) => {
          const lbl = (lang === 'es' ? labelEs : labelEn)[id].padEnd(22);
          const hnt = hintsMap[id];
          return `  ☐ ${lbl} ${hnt}`;
        }).join('\n');
        pushPaletteRow({ kind: 'out', text:
`hidden things on this page:\n${lines}\n\nscroll to the footer to track what you've found.` });
        break;
      }

      case 'ls':
        pushPaletteRow({ kind: 'out', text:
`drwxr-xr-x  home/
drwxr-xr-x  projects/
drwxr-xr-x  writing/
drwxr-xr-x  contact/
-rw-r--r--  .easter-eggs (hidden)` });
        break;

      case 'whoami':
        pushPaletteRow({ kind: 'out', text: lang === 'es'
          ? 'jesé romero — ingeniero de software, gran canaria. construyo mymedesp y characters vault. me gustan las montañas.'
          : 'jesé romero — software engineer, gran canaria. building mymedesp & characters vault. likes mountains.' });
        break;

      case 'projects':
      case 'writing':
      case 'blog':
      case 'contact': {
        const target = head === 'blog' ? 'writing' : head;
        pushPaletteRow({ kind: 'out', text: `→ scrolling to #${target}` });
        setTimeoutT(() => {
          const el = document.getElementById(target);
          if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
          setPaletteOpen(false);
        }, 200);
        break;
      }

      case 'open': {
        const projectsUrls = {
          'benkyou': 'benkyou.jeseromero.com',
          'mymedesp': 'mymedesp.com',
          'characters-vault': 'charactersvault.com',
          'animabf': 'foundryvtt.com/packages/animabf',
          'aristeia': 'aristeiaclub.com',
        };
        const hit = Object.keys(projectsUrls).find((k) => k === arg || k.startsWith(arg));
        if (!hit) pushPaletteRow({ kind: 'err', text: `no project named "${arg}"` });
        else {
          pushPaletteRow({ kind: 'out', text: `opening ${hit} ↗ ${projectsUrls[hit]}` });
          window.open('https://' + projectsUrls[hit], '_blank');
        }
        break;
      }

      case 'theme': {
        const want = arg === 'dark' ? 'dark'
          : arg === 'light' ? 'light'
          : (getTheme() === 'dark' ? 'light' : 'dark');
        setTheme(want);
        pushPaletteRow({ kind: 'out', text: `theme → ${want}` });
        break;
      }

      case 'lang': {
        // Locale is route-based now: NAVIGATE to the other locale instead of
        // swapping the DOM. `lang es` / `lang en` force a target.
        const cur = getLang();
        const v = arg || (cur === 'en' ? 'es' : 'en');
        const want = v === 'es' ? 'es' : 'en';
        pushPaletteRow({ kind: 'out', text: `lang → ${want}` });
        const path = window.location.pathname.replace(/^\/(es|en)(?=\/|$)/, `/${want}`);
        const next = /^\/(es|en)(\/|$)/.test(window.location.pathname)
          ? path
          : `/${want}${window.location.pathname}`;
        window.location.href = next + window.location.hash;
        break;
      }

      case 'coffee':
      case 'café':
        pushPaletteRow({ kind: 'out', text: '☕ brewing…' });
        triggerCoffee();
        break;

      case 'vintage':
      case 'crt': {
        const wasOn = isCRTOn();
        toggleCRT(!wasOn);
        unlock('vintage-mode');
        pushPaletteRow({ kind: 'out', text: wasOn ? 'vintage off' : 'vintage on · scanlines engaged' });
        break;
      }

      case 'hire':
        pushPaletteRow({ kind: 'out', text: lang === 'es'
          ? 'ahora mismo enviando side projects, pero siempre abierto a conversaciones interesantes.\n→ instagram.com/jeseromeroarbelo\n→ x.com/jeseromero\n→ linkedin.com/in/jese-romero'
          : 'currently shipping side projects, but always open to interesting conversations.\n→ instagram.com/jeseromeroarbelo\n→ x.com/jeseromero\n→ linkedin.com/in/jese-romero' });
        break;

      case 'sudo':
        if (rest[0] !== 'hire-me') {
          pushPaletteRow({ kind: 'err', text: `sudo: command not found: ${rest.join(' ')}` });
          break;
        }
        pushPaletteRow({ kind: 'out', text: lang === 'es'
          ? 'ahora mismo enviando side projects, pero siempre abierto a conversaciones interesantes.\n→ instagram.com/jeseromeroarbelo\n→ x.com/jeseromero\n→ linkedin.com/in/jese-romero'
          : 'currently shipping side projects, but always open to interesting conversations.\n→ instagram.com/jeseromeroarbelo\n→ x.com/jeseromero\n→ linkedin.com/in/jese-romero' });
        break;

      case 'social': {
        const socials = {
          github: 'https://github.com/linkaynn',
          twitter: 'https://x.com/jeseromero',
          x: 'https://x.com/jeseromero',
          linkedin: 'https://linkedin.com/in/jese-romero',
          instagram: 'https://instagram.com/jeseromeroarbelo',
          ig: 'https://instagram.com/jeseromeroarbelo',
        };
        if (!arg) {
          pushPaletteRow({ kind: 'out', text: 'usage: social <github|twitter|linkedin|instagram>' });
          break;
        }
        const hit = socials[arg.toLowerCase()];
        if (!hit) pushPaletteRow({ kind: 'err', text: `no social named "${arg}"` });
        else {
          pushPaletteRow({ kind: 'out', text: `opening ${arg} ↗ ${hit}` });
          window.open(hit, '_blank');
        }
        break;
      }

      case 'clear': {
        paletteHistory.length = 0;
        const log = document.getElementById('palette-log');
        if (log) log.innerHTML = '';
        pushPaletteRow({ kind: 'info', text: lang === 'es' ? 'buffer limpio' : 'buffer cleared' });
        return;
      }

      case 'exit':
      case 'q':
      case 'quit':
        setPaletteOpen(false);
        return;

      default:
        pushPaletteRow({ kind: 'err', text: `command not found: ${head}. try \`help\`.` });
    }
  }

  function initPalette() {
    const el = document.getElementById('palette');
    const form = document.getElementById('palette-form');
    const input = document.getElementById('palette-input');
    const backdrop = el ? el.querySelector('.palette-backdrop') : null;
    if (!el || !form || !input) return;

    addListener(window, 'keydown', (e) => {
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        if (e.key === 'Escape' && paletteOpen()) setPaletteOpen(false);
        return;
      }
      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setPaletteOpen(!paletteOpen());
        unlock('command-line');
      } else if (e.key === 'Escape') {
        setPaletteOpen(false);
      }
    });

    addListener(form, 'submit', (e) => {
      e.preventDefault();
      const v = input.value;
      input.value = '';
      execCommand(v);
    });

    if (backdrop) addListener(backdrop, 'click', () => setPaletteOpen(false));
  }

  // ── Terminal CTAs: hint chip + footer button ──────────────
  function initTerminalCTAs() {
    const open = () => { setPaletteOpen(true); unlock('command-line'); };
    const chip = document.getElementById('hint-chip');
    const footerBtn = document.getElementById('footer-open-terminal');
    if (chip) addListener(chip, 'click', open);
    if (footerBtn) addListener(footerBtn, 'click', open);
  }

  // ── Portrait crossfade (hover desktop / tap touch) ────────
  function initPortrait() {
    const el = document.getElementById('portrait');
    if (!el) return;
    const hint = document.getElementById('portrait-hint');
    const nameEl = el.querySelector('.portrait-name');
    const coarse = (() => {
      try {
        return window.matchMedia
          ? window.matchMedia('(hover: none), (pointer: coarse)').matches
          : false;
      } catch { return false; }
    })();
    if (hint) hint.textContent = coarse ? 'tap ↻' : 'hover ↻';
    let seen = false;
    const setFun = (v) => {
      el.classList.toggle('fun', v);
      if (nameEl) nameEl.textContent = v ? 'UD.JPG' : 'jese.jpg';
      el.setAttribute('aria-label', v
        ? (el.getAttribute('data-alt-fun') || '')
        : (el.getAttribute('data-alt-default') || ''));
      if (!seen) { seen = true; if (hint) hint.classList.add('seen'); }
    };
    if (coarse) {
      addListener(el, 'click', () => setFun(!el.classList.contains('fun')));
      addListener(el, 'keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setFun(!el.classList.contains('fun'));
        }
      });
    } else {
      addListener(el, 'mouseenter', () => setFun(true));
      addListener(el, 'mouseleave', () => setFun(false));
    }
  }

  // ── Image lightbox (blog posts) ───────────────────────────
  // Move #lightbox to document.body so it escapes any stacking context, then
  // wire .post-body images. Cleanup restores it / removes added classes.
  function initLightbox() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    const lbImg = lb.querySelector('.lightbox-img');
    const lbCap = lb.querySelector('.lightbox-cap');
    const closeBtn = lb.querySelector('.lightbox-close');
    if (!lbImg || !lbCap || !closeBtn) return;

    const originalParent = lb.parentElement;
    const movedToBody = originalParent !== document.body;
    if (movedToBody) document.body.appendChild(lb);
    cleanups.push(() => {
      // Put it back so React can manage / remove it cleanly on unmount.
      if (movedToBody && originalParent && originalParent.isConnected) {
        originalParent.appendChild(lb);
      }
    });

    const open = (src, alt, caption) => {
      lbImg.src = src;
      lbImg.alt = alt;
      if (caption) {
        lbCap.textContent = caption;
        lbCap.hidden = false;
      } else {
        lbCap.hidden = true;
      }
      lb.hidden = false;
      lb.setAttribute('aria-hidden', 'false');
      addRaf(() => lb.classList.add('open'));
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeoutT(() => { lb.hidden = true; lbImg.src = ''; }, 200);
    };

    document.querySelectorAll('.post-body img').forEach((img) => {
      img.classList.add('zoomable');
      const onClick = () => {
        const fig = img.closest('figure');
        const capEl = fig ? fig.querySelector('figcaption') : null;
        const cap = capEl && capEl.textContent ? capEl.textContent.trim() : null;
        open(img.currentSrc || img.src, img.alt, cap);
      };
      addListener(img, 'click', onClick);
      cleanups.push(() => img.classList.remove('zoomable'));
    });

    addListener(lb, 'click', (e) => {
      if (e.target === lb || e.target === closeBtn) close();
    });
    addListener(document, 'keydown', (e) => {
      if (e.key === 'Escape' && !lb.hidden) close();
    });
  }

  // ── OS theme follow (only if user hasn't picked) ──────────
  function initSystemThemeFollow() {
    try {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const onSysChange = (e) => {
        try {
          const stored = localStorage.getItem(LS_THEME);
          if (stored === 'dark' || stored === 'light') return;
        } catch {}
        const next = e.matches ? 'dark' : 'light';
        document.documentElement.dataset.theme = next;
        applyTheme(next);
      };
      if (mq.addEventListener) {
        mq.addEventListener('change', onSysChange);
        cleanups.push(() => mq.removeEventListener('change', onSysChange));
      } else if (mq.addListener) {
        mq.addListener(onSysChange);
        cleanups.push(() => mq.removeListener(onSysChange));
      }
    } catch {}
  }

  // ── Boot ──────────────────────────────────────────────────
  applyTheme(getTheme());

  initSpotlight();
  initKonami();
  initCoffeeListener();
  initPalette();
  initSystemThemeFollow();

  initMagnetic();
  // Greeting must set #greeting's data-text BEFORE initScrambles() captures
  // it, otherwise the auto-scramble animates toward the placeholder "—".
  initGreeting();
  initScrambles();
  initReveals();
  initSmoothAnchors();

  initHeroTypewriter();
  initLiveClock();
  initNowHover();

  initThemeToggle();
  initLogoDot();

  initAchievementsFooter();
  initTerminalCTAs();
  initPortrait();

  initLightbox();

  // ── Cleanup ───────────────────────────────────────────────
  return () => {
    cleanups.forEach((fn) => { try { fn(); } catch {} });
    rafs.forEach((id) => cancelAnimationFrame(id));
    intervals.forEach((id) => window.clearInterval(id));
    timeouts.forEach((id) => window.clearTimeout(id));
    observers.forEach((obs) => { try { obs.disconnect(); } catch {} });
    cleanups.length = 0;
    rafs.clear();
    intervals.clear();
    timeouts.clear();
    observers.clear();
  };
}
