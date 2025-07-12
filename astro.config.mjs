import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.jeseromero.com',
  base: process.env.NODE_ENV === 'production' ? 'linkaynn.github.io' : '/'
});
