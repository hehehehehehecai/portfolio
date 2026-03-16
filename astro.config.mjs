// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://portfolio-five-beige-92.vercel.app/',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});