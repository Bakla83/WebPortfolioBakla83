/**
 * Функциональная проверка собранного сайта.
 *
 * Проверяет то, чего не видно на скриншоте и что легко сломать незаметно:
 * переключатели темы и языка, мобильное меню, выпадающий список, всплывающие
 * описания карточек, целостность всех внутренних ссылок и картинок.
 *
 * Главное: сервер отдаёт страницы с теми же заголовками, что и Cloudflare,
 * включая строгую CSP из public/_headers. Локальный `npm run dev` их не
 * применяет, поэтому поломка из-за CSP видна только после деплоя — а этот
 * скрипт ловит её заранее. Именно так нашёлся инлайновый скрипт, который
 * Astro вшивал в HTML: на Cloudflare он блокировался, и вместе с ним
 * переставали работать меню, тема и появление карточек.
 *
 * Запуск:
 *   npm run build
 *   npm run audit
 *
 * Нужен playwright (в devDependencies). Браузер ставится один раз:
 *   npx playwright install chromium
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const DIST = join(import.meta.dirname, '..', 'dist');
const PORT = 4622;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

/** Разбирает блок `/*` из public/_headers и навешивает его на все ответы. */
const rawHeaders = await readFile(join(DIST, '_headers'), 'utf8');
const globalHeaders = {};
{
  let inGlobal = false;
  for (const line of rawHeaders.split(/\r?\n/)) {
    if (/^\S/.test(line)) {
      inGlobal = line.trim() === '/*';
      continue;
    }
    if (!inGlobal) continue;
    const match = line.match(/^\s+([A-Za-z-]+):\s*(.+)$/);
    if (match) globalHeaders[match[1]] = match[2];
  }
}
console.log('Заголовки Cloudflare применены:', Object.keys(globalHeaders).join(', '));

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  for (const candidate of [path, `${path}.html`, join(path, 'index.html')]) {
    const file = normalize(join(DIST, candidate));
    if (!file.startsWith(DIST)) continue;
    try {
      const body = await readFile(file);
      res.writeHead(200, {
        ...globalHeaders,
        'Content-Type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
      });
      return res.end(body);
    } catch {
      /* пробуем следующий вариант пути */
    }
  }
  res.writeHead(404, { ...globalHeaders, 'Content-Type': 'text/html' }).end('404');
});

await new Promise((resolve) => server.listen(PORT, resolve));
const base = `http://127.0.0.1:${PORT}`;
const browser = await chromium.launch();

const pass = [];
const fail = [];
const ok = (name, cond, detail = '') =>
  (cond ? pass : fail).push(`${name}${detail ? ' — ' + detail : ''}`);

/* ------------------------------------------- 1. автоопределение языка на / */
for (const [locale, expected] of [
  ['en-US', '/en'],
  ['ru-RU', '/ru'],
  // Языка нет среди включённых — должен сработать запасной
  ['fr-FR', '/ru'],
]) {
  const ctx = await browser.newContext({ locale });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const got = new URL(page.url()).pathname;
  ok(`язык браузера ${locale} → ${expected}`, got === expected, `получили ${got}`);
  await ctx.close();
}

/* ------------------------------------------------------------------ 2. тема */
{
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto(base + '/ru', { waitUntil: 'networkidle' });

  const before = await page.getAttribute('html', 'data-theme');
  await page.click('[data-theme-toggle]');
  const after = await page.getAttribute('html', 'data-theme');
  ok('переключатель темы меняет тему', before !== after, `${before} → ${after}`);

  await page.reload({ waitUntil: 'networkidle' });
  const persisted = await page.getAttribute('html', 'data-theme');
  ok('тема сохраняется после перезагрузки', persisted === after, `получили ${persisted}`);

  const label = await page.getAttribute('[data-theme-toggle]', 'aria-label');
  ok('подпись кнопки темы обновляется', Boolean(label), label ?? '(пусто)');
  await ctx.close();
}

/* ------------------------------------------------------------------ 3. язык */
{
  const ctx = await browser.newContext({ locale: 'ru-RU' });
  const page = await ctx.newPage();
  await page.goto(base + '/ru/about', { waitUntil: 'networkidle' });
  await page.click('[data-lang-switcher] a[data-lang="en"]');
  await page.waitForLoadState('networkidle');
  ok(
    'переключение языка остаётся на той же странице',
    new URL(page.url()).pathname === '/en/about',
    new URL(page.url()).pathname,
  );

  await page.goto(base + '/', { waitUntil: 'networkidle' });
  ok(
    'выбор языка запоминается для корня',
    new URL(page.url()).pathname === '/en',
    new URL(page.url()).pathname,
  );
  await ctx.close();
}

/* ------------------------------------------------------- 4. мобильное меню */
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto(base + '/ru', { waitUntil: 'networkidle' });

  ok('меню изначально скрыто', await page.isHidden('[data-menu-panel]'));

  await page.click('[data-menu-open]');
  await page.waitForTimeout(200);
  const opened = await page.isVisible('[data-menu-panel]');
  ok('меню открывается', opened);
  ok(
    'aria-expanded становится true',
    (await page.getAttribute('[data-menu-open]', 'aria-expanded')) === 'true',
  );
  ok(
    'фон заблокирован от прокрутки',
    (await page.evaluate(() => document.body.style.overflow)) === 'hidden',
  );

  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  ok('Esc закрывает меню', await page.isHidden('[data-menu-panel]'));
  ok(
    'прокрутка возвращается',
    (await page.evaluate(() => document.body.style.overflow)) === '',
  );

  if (opened) {
    await page.click('[data-menu-open]');
    await page.waitForTimeout(200);
    await page.click('.mobile-menu__list a');
    await page.waitForLoadState('networkidle');
    ok('переход по ссылке закрывает меню', await page.isHidden('[data-menu-panel]'));
  }
  await ctx.close();
}

/* ---------------------------------------------------- 5. выпадающий список */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + '/ru', { waitUntil: 'networkidle' });

  await page.click('[data-dropdown] > summary');
  ok('список разделов открывается', await page.isVisible('.dropdown__panel'));
  const items = await page.locator('.dropdown__panel a').count();
  ok('в списке шесть разделов', items === 6, `нашли ${items}`);

  await page.mouse.click(700, 500);
  ok('клик мимо закрывает список', !(await page.isVisible('.dropdown__panel')));

  await page.click('[data-dropdown] > summary');
  await page.keyboard.press('Escape');
  ok('Esc закрывает список', !(await page.isVisible('.dropdown__panel')));
  await ctx.close();
}

/* -------------------------------------------- 6. карточки работ и появление */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + '/ru/work/landings', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const overlay = page.locator('.card').first().locator('.card__overlay');
  const before = await overlay.evaluate((el) => getComputedStyle(el).opacity);
  await page.locator('.card').first().hover();
  await page.waitForTimeout(500);
  const after = await overlay.evaluate((el) => getComputedStyle(el).opacity);
  ok('описание всплывает при наведении', Number(after) > Number(before), `${before} → ${after}`);

  // Карточки стартуют с opacity 0 и показываются скриптом. Если JS не
  // отработал, они останутся невидимыми — на глаз это «пустая страница».
  const cards = await page.locator('.card').count();
  const visible = await page.locator('.card.is-visible').count();
  ok('все карточки проявились', visible === cards, `${visible} из ${cards}`);
  await ctx.close();
}

/* ------------------------- 7. обход всех страниц: ссылки, картинки, консоль */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const consoleErrors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => consoleErrors.push(String(e.message)));

  const seen = new Set();
  const queue = ['/ru', '/en'];
  const brokenLinks = [];
  const brokenImages = [];
  const missingAlt = [];

  while (queue.length) {
    const path = queue.shift();
    if (seen.has(path)) continue;
    seen.add(path);

    const response = await page.goto(base + path, { waitUntil: 'networkidle' });
    if (!response || response.status() >= 400) {
      brokenLinks.push(`${path} → ${response ? response.status() : 'нет ответа'}`);
      continue;
    }

    const images = await page.evaluate(() =>
      Array.from(document.images).map((img) => ({
        src: img.getAttribute('src'),
        loaded: img.complete && img.naturalWidth > 0,
        alt: img.getAttribute('alt'),
      })),
    );
    for (const img of images) {
      if (!img.loaded) brokenImages.push(`${path}: ${img.src}`);
      if (img.alt === null) missingAlt.push(`${path}: ${img.src}`);
    }

    const links = await page.evaluate(() =>
      Array.from(document.querySelectorAll('a[href]'))
        .map((a) => a.getAttribute('href'))
        .filter((href) => href && href.startsWith('/') && !href.startsWith('//')),
    );
    for (const link of links) {
      const clean = link.split('#')[0];
      if (clean && !seen.has(clean)) queue.push(clean);
    }
  }

  ok(`обойдено страниц: ${seen.size}`, true);
  ok('битых внутренних ссылок нет', brokenLinks.length === 0, brokenLinks.join('; '));
  ok('все картинки загрузились', brokenImages.length === 0, brokenImages.join('; '));
  ok('у всех картинок есть alt', missingAlt.length === 0, missingAlt.join('; '));
  ok('нет ошибок в консоли', consoleErrors.length === 0, consoleErrors.slice(0, 3).join('; '));
  await ctx.close();
}

/* ------------------------------------------------------- 8. служебные файлы */
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(base + '/ru/work/landings/nonexistent');
  ok('несуществующая страница отдаёт 404', (await page.content()).includes('404'));

  ok('карта сайта на месте', (await page.goto(base + '/sitemap-index.xml')).status() === 200);
  ok('robots.txt на месте', (await page.goto(base + '/robots.txt')).status() === 200);
  await ctx.close();
}

await browser.close();
server.close();

console.log('\n===== ПРОШЛО =====');
pass.forEach((line) => console.log('  ok  ' + line));
console.log('\n===== НЕ ПРОШЛО =====');
if (!fail.length) console.log('  (пусто)');
fail.forEach((line) => console.log('  X   ' + line));
console.log(`\nИтого: ${pass.length} ok, ${fail.length} проблем`);

process.exit(fail.length ? 1 : 0);
