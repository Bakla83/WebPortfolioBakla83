import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://webportfoliobakla83.pages.dev',
  trailingSlash: 'never',
  integrations: [
    sitemap({

      filter: (page) => !page.includes('/in-progress'),
    }),
  ],
  build: {

    inlineStylesheets: 'auto',

    format: 'file',
  },

  vite: {
    build: {

      assetsInlineLimit: 0,
    },
  },
  image: {

    domains: ['cdn.sanity.io'],
  },
});
