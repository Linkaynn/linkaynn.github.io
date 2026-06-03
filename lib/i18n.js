// Central bilingual string table for everything rendered on the server.
// Pick values with t(node, lang) from lib/lang.js. Client-only copy that the
// interactive layer generates at runtime (command-palette output, the
// time-aware greeting, the achievements tally) lives inside the effects
// module, which reads the active locale from <html lang>.

export const I18N = {
  nav: {
    projects: { es: 'proyectos', en: 'projects' },
    writing: { es: 'escritos', en: 'writing' },
    sayHi: { es: 'saluda', en: 'say hi' },
  },

  hero: {
    you: { es: 'tú', en: 'you' },
    place: { es: 'Gran Canaria, ES', en: 'Gran Canaria, ES' },
    // The bio is a rich sentence with inline scramble links; rendered as a
    // small component per locale. The link labels are scrambled.
    bio: {
      es: {
        pre: 'Ingeniero de software. A veces me encontrarás desarrollando una nueva ',
        idea: 'idea',
        mid: ', o escribiendo ',
        articles: 'artículos técnicos',
        mid2: ' (sinceramente, hace ya un tiempo). El resto del tiempo ando de senderismo, dirigiendo partidas de rol, aprendiendo una nueva pieza al piano o contribuyendo al ',
        oss: 'open source',
        post: '.',
      },
      en: {
        pre: 'Software engineer. You can find me sometimes developing a new ',
        idea: 'idea',
        mid: ', and writing ',
        articles: 'technical articles',
        mid2: " (honestly, it's been a while). The rest of the time you'll find me hiking, running tabletop campaigns, learning a new piece on the piano or contributing to ",
        oss: 'open-source',
        post: '.',
      },
    },
  },

  now: {
    title: { es: 'ahora', en: 'now' },
    items: [
      { k: { es: 'cocinando', en: 'cooking' }, v: { es: 'con ciencia', en: 'with science' } },
      { k: { es: 'estudiando', en: 'studying' }, v: { es: 'física — desde primeros principios', en: 'physics — from first principles' } },
      { k: { es: 'al piano', en: 'at the piano' }, v: { es: '~7 años aporreándolo, sigo lento', en: '~7 years in, still slow' } },
      { k: { es: 'dirigiendo', en: 'GM-ing' }, v: { es: 'campañas de rol de mesa', en: 'tabletop RPG campaigns' } },
    ],
  },

  projects: {
    title: { es: 'proyectos', en: 'projects' },
    archived: { es: 'archivado', en: 'archived' },
    list: [
      {
        id: 'benkyou',
        name: 'Benkyou 勉強',
        year: '2026 — now',
        tagline: { es: 'Plataforma amable para empezar con el japonés (N5) — hiragana y katakana con repaso espaciado. Sin cuenta y offline.', en: 'Friendly platform to get started with Japanese (N5) — hiragana and katakana with gentle spaced repetition. No account, offline.' },
        stack: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'zustand', 'PWA'],
        url: 'benkyou.jeseromero.com',
      },
      {
        id: 'mymedesp',
        name: 'Mymedesp',
        year: '2026 — now',
        tagline: { es: 'App para gestionar recetario, lista de la compra y despensa.', en: 'App to manage your recipe book, shopping list and pantry.' },
        stack: ['React', 'TypeScript', 'MobX', 'styled-components', 'NestJS', 'Supabase'],
        url: 'mymedesp.com',
      },
      {
        id: 'characters-vault',
        name: 'Characters Vault',
        year: '2026 — now',
        tagline: { es: 'Gestor de fichas en la nube para rol de mesa.', en: 'Cloud-based character sheet manager for tabletop RPGs.' },
        stack: ['TypeScript', 'NestJS', 'MobX', 'React', 'Node', 'Docker', 'Supabase'],
        url: 'charactersvault.com',
      },
      {
        id: 'animabf',
        name: 'Anima Beyond Foundry',
        year: '2021 — now',
        tagline: { es: 'Sistema open source para Foundry VTT — Anima Beyond Fantasy.', en: 'Open-source game system for Foundry VTT — Anima Beyond Fantasy.' },
        stack: ['JavaScript', 'TypeScript', 'WebRTC', 'P2P'],
        url: 'foundryvtt.com/packages/animabf',
      },
      {
        id: 'aristeia',
        name: 'Aristeia App',
        year: '2020 — 2022',
        tagline: { es: 'App para gestionar entrenamientos, usuarios y facturación de un club deportivo.', en: 'App to manage training, users and billing for a sports club.' },
        stack: ['Android', 'iOS', 'Flutter', 'GCP', 'Firebase'],
        url: 'aristeiaclub.com',
        archived: true,
      },
    ],
  },

  writing: {
    title: { es: 'escritos', en: 'writing' },
  },

  contact: {
    title: { es: 'saluda', en: 'say hi' },
    text: {
      es: '¿Un side project, picor de open source que rascar, un one-shot que dirigir o subir al Roque Nublo? Escríbeme y te respondo.',
      en: 'Got a side project, an open-source itch to scratch, a one-shot to run, or want to climb Roque Nublo? Drop me a line and I’ll reply.',
    },
    fields: {
      name: { es: 'nombre', en: 'name' },
      email: { es: 'email', en: 'email' },
      message: { es: 'mensaje', en: 'message' },
    },
    placeholder: {
      name: { es: 'cómo te llamas', en: 'your name' },
      email: { es: 'dónde te respondo', en: 'where I reply' },
      message: { es: 'cuéntame', en: 'tell me' },
    },
    send: { es: 'enviar', en: 'send' },
    sending: { es: 'enviando…', en: 'sending…' },
    or: { es: 'o por ', en: 'or on ' },
    linkedin: { es: 'LinkedIn', en: 'LinkedIn' },
    feedback: {
      sent: { es: '✓ enviado. te respondo pronto.', en: '✓ sent. I’ll get back to you soon.' },
      invalid: { es: 'revisa los campos e inténtalo de nuevo.', en: 'check the fields and try again.' },
      too_fast: { es: 'demasiado rápido — ¿eres un bot?', en: 'too fast — are you a bot?' },
      rate_limited: { es: 'demasiados envíos. prueba más tarde.', en: 'too many messages. try again later.' },
      send_failed: { es: 'no se pudo enviar. escríbeme por LinkedIn.', en: 'couldn’t send. reach me on LinkedIn.' },
    },
  },

  footer: {
    press: { es: 'pulsa ', en: 'press ' },
    orKey: { es: ' o ', en: ' or ' },
    openTerminal: { es: 'abrir terminal', en: 'open terminal' },
    achievements: { es: ' logros', en: ' achievements' },
    achHead: {
      es: '// cosas escondidas en la página — encuéntralas, sin prisa',
      en: '// hidden things on this page — find them, no pressure',
    },
  },

  // Achievement labels + hints (rendered server-side; the client redacts
  // labels with █ until unlocked, and swaps to the touch hint on coarse
  // pointers). IDs match the effects module + localStorage('jr.achievements').
  achievements: [
    {
      id: 'command-line',
      label: { es: 'línea-de-comandos', en: 'command-line' },
      hint: { es: 'invoca la terminal — una tecla, un símbolo', en: 'summon the terminal — one keystroke, one symbol' },
      hintTouch: { es: 'pulsa el botón de abrir terminal abajo', en: 'tap the open-terminal button below' },
    },
    {
      id: 'caffeinated',
      label: { es: 'cafeinado', en: 'caffeinated' },
      hint: { es: 'escribe en inglés una bebida de 6 letras, en cualquier sitio', en: 'type a 6-letter beverage, anywhere' },
      hintTouch: { es: 'escribe `coffee` en la terminal', en: 'type `coffee` in the terminal' },
    },
    {
      id: 'vintage-mode',
      label: { es: 'modo-vintage', en: 'vintage-mode' },
      hint: { es: 'pulsa ↑ ↑ ↓ ↓ ← → ← → B A (el código Konami)', en: 'press ↑ ↑ ↓ ↓ ← → ← → B A (the Konami code)' },
      hintTouch: { es: 'escribe `vintage` en la terminal', en: 'type `vintage` in the terminal' },
    },
    {
      id: 'pixel-pusher',
      label: { es: 'buscalíos', en: 'pixel-pusher' },
      hint: { es: 'pulsa el punto verde · siete veces exactas', en: 'poke the green dot · seven times exactly' },
    },
  ],

  palette: {
    placeholder: { es: 'escribe un comando…', en: 'type a command…' },
  },

  // Per-page <head> metadata.
  meta: {
    home: {
      title: { es: 'Jesé Romero — Ingeniero de Software', en: 'Jesé Romero — Software Engineer' },
      description: {
        es: 'Ingeniero de software en Gran Canaria. Side projects, open source, rol de mesa, piano y física.',
        en: 'Software engineer based in Gran Canaria. Side projects, open source, tabletop RPG, piano and physics.',
      },
      keywords: {
        es: 'ingeniero de software, TypeScript, React, NestJS, Foundry VTT, Gran Canaria, Islas Canarias',
        en: 'software engineer, TypeScript, React, NestJS, Foundry VTT, Gran Canaria, Canary Islands',
      },
    },
    blog: {
      title: { es: 'Escritos — Jesé Romero', en: 'Writing — Jesé Romero' },
      description: {
        es: 'Notas y artículos sobre ingeniería de software, IA y oficio.',
        en: 'Notes and articles on software engineering, AI and craft.',
      },
    },
  },
};

// Social links (language-independent).
export const SOCIALS = [
  { id: 'github', label: 'github', url: 'https://github.com/linkaynn' },
  { id: 'twitter', label: 'twitter', url: 'https://x.com/jeseromero' },
  { id: 'linkedin', label: 'linkedin', url: 'https://linkedin.com/in/jese-romero' },
  { id: 'instagram', label: 'instagram', url: 'https://instagram.com/jeseromeroarbelo' },
];

export const LINKEDIN_URL = 'https://linkedin.com/in/jese-romero';
export const GITHUB_URL = 'https://github.com/linkaynn';
export const SITE_ORIGIN = 'https://www.jeseromero.com';
