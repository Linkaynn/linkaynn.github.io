import { defineConfig } from 'astro/config';

// https://astro.build/config
//
// This is a user/org GitHub Pages site (repo: linkaynn.github.io) served from
// the custom domain jeseromero.com — so `base` MUST be "/". Setting it to
// "linkaynn.github.io" would emit asset URLs that GH Pages 301-redirects to
// `http://` (mixed content blocked by the browser).
export default defineConfig({
  site: 'https://www.jeseromero.com',
  markdown: {
    shikiConfig: {
      // Two themes so code blocks adapt to the global data-theme attribute.
      // Astro emits both color sets and the prefers-color-scheme media query
      // picks the right one — we override it below with a CSS rule that keys
      // off our explicit data-theme.
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});
