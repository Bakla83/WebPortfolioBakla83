import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Меняется на свой домен после его подключения — больше нигде адрес не зашит.
export default defineConfig({
  site: 'https://webportfoliobakla83.pages.dev',
  trailingSlash: 'never',
  integrations: [sitemap()],
  build: {
    // Мелкие стили инлайнятся в HTML: меньше запросов на мобильном.
    inlineStylesheets: 'auto',
  },
  image: {
    // Ограничиваем источники картинок: удалённые URL из CMS разрешены только с CDN Sanity.
    domains: ['cdn.sanity.io'],
  },
});
