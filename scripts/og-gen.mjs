// Generate OG images that match the terminal-minimal design.
// Usage: node scripts/og-gen.mjs
//
// Writes public/home.png and public/blog.png (1200×630, the canonical
// LinkedIn/Twitter share size).

import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const W = 1200;
const H = 630;

// Dark-theme palette from src/styles/global.css
const BG = "#0a0c08";
const INK = "#e8ecd9";
const INK_2 = "#c5cab2";
const MUTED = "#6b7263";
const ACCENT = "#84e0a0"; // phosphor green (~ oklch(0.85 0.2 145))

// Common monospace fallback chain. librsvg/sharp will pick whatever it has;
// "monospace" guarantees something landing.
const MONO = "JetBrains Mono, Menlo, Consolas, monospace";

function svg({ kicker, name, role, footer }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>

  <!-- top-left: phosphor square + handle -->
  <rect x="80" y="78" width="18" height="18" fill="${ACCENT}"/>
  <text x="112" y="94" font-family="${MONO}" font-size="20" fill="${INK_2}">jesé romero</text>

  <!-- top-right: section kicker -->
  <text x="${W - 80}" y="94" font-family="${MONO}" font-size="18" fill="${MUTED}" text-anchor="end">${kicker}</text>

  <!-- centered hero -->
  <text x="80" y="330" font-family="${MONO}" font-size="92" font-weight="500" fill="${INK}" letter-spacing="-2">${name}<tspan fill="${ACCENT}">.</tspan></text>
  <text x="80" y="395" font-family="${MONO}" font-size="32" fill="${INK_2}">${role}</text>

  <!-- footer line: prompt + meta -->
  <line x1="80" y1="510" x2="${W - 80}" y2="510" stroke="#1f231b" stroke-width="1"/>
  <text x="80" y="555" font-family="${MONO}" font-size="20" fill="${MUTED}"><tspan fill="${ACCENT}">$</tspan> ${footer}</text>
</svg>`;
}

async function render(filename, opts) {
  const buffer = Buffer.from(svg(opts));
  const out = await sharp(buffer, { density: 144 })
    .resize(W, H, { fit: "contain", background: BG })
    .png({ quality: 92, compressionLevel: 9 })
    .toBuffer();
  await writeFile(`public/${filename}`, out);
  console.log(`✓ public/${filename}`);
}

await render("home.png", {
  kicker: "// portfolio",
  name: "Jesé Romero",
  role: "Software Engineer",
  footer: "Gran Canaria, ES   ·   jeseromero.com",
});

await render("blog.png", {
  kicker: "// writing",
  name: "Jesé Romero",
  role: "Notes &amp; articles",
  footer: "Gran Canaria, ES   ·   jeseromero.com/blog",
});
