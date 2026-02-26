// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://你的GitHub用户名.github.io',
  base: '/portfolio',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()]
  }
});