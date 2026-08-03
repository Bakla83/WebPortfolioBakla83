import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Меняется на свой домен после его подключения — больше нигде адрес не зашит.
export default defineConfig({
  site: 'https://webportfoliobakla83.pages.dev',
  trailingSlash: 'never',
  integrations: [sitemap()],
  build: {
    // Мелкие стили инлайнятся в HTML: меньше запросов на мобильном.
    // Для стилей это безопасно — CSP разрешает style-src 'unsafe-inline'.
    inlineStylesheets: 'auto',
  },

  vite: {
    build: {
      // Ноль запрещает вшивать бандлы в HTML. Без этого Astro инлайнит
      // маленький скрипт site.ts прямо в страницу, а строгая CSP
      // (script-src 'self', без 'unsafe-inline') его блокирует — и на
      // задеплоенном сайте перестают работать меню, тема и появление
      // карточек. Локально это не видно: _headers применяет только Cloudflare.
      assetsInlineLimit: 0,
    },
  },
  image: {
    // Ограничиваем источники картинок: удалённые URL из CMS разрешены только с CDN Sanity.
    domains: ['cdn.sanity.io'],
  },
});
