import { defineConfig } from 'astro/config';

// SITE and BASE are set by the GitHub Pages workflow
export default defineConfig({
  site: process.env.SITE,
  base: process.env.BASE ?? '/',
});
