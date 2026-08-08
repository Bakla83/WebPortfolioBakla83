import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Меняется на свой домен после его подключения — больше нигде адрес не зашит.
export default defineConfig({
  site: 'https://webportfoliobakla83.pages.dev',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      // Страница работы в производстве показывается заказчице по прямой
      // ссылке и закрыта от индексации (noindex в самой странице). В карте
      // сайта ей делать нечего: карта — это приглашение обойти всё, а сюда
      // ведёт только пункт «В процессе создания» в меню.
      filter: (page) => !page.includes('/in-progress'),
    }),
  ],
  build: {
    // Мелкие стили инлайнятся в HTML: меньше запросов на мобильном.
    // Для стилей это безопасно — CSP разрешает style-src 'unsafe-inline'.
    inlineStylesheets: 'auto',

    // 'file' кладёт страницу как /ru/about.html, а не /ru/about/index.html.
    // Иначе Cloudflare на каждый адрес отвечает 308-редиректом, добавляя
    // слеш (/ru/about → /ru/about/), и все canonical, hreflang и ссылки
    // из карты сайта ведут на редирект вместо самой страницы.
    format: 'file',
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
