import { defineConfig } from 'astro/config';

// https://astro.build/config
//
// This is a user/org GitHub Pages site (repo: linkaynn.github.io) served from
// the custom domain jeseromero.com — so `base` MUST be "/". Setting it to
// "linkaynn.github.io" would emit asset URLs that GH Pages 301-redirects to
// `http://` (mixed content blocked by the browser).
export default defineConfig({
  site: 'https://www.jeseromero.com',
});
