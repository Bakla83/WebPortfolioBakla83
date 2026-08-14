import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
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

const rawHeaders = await readFile(join(DIST, '_headers'), 'utf8');
const headerRules = [];
{
  let current = null;
  for (const line of rawHeaders.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    if (/^\S/.test(line)) {
      current = { pattern: line.trim(), headers: {} };
      headerRules.push(current);
      continue;
    }
    if (!current) continue;

    const match = line.match(/^\s+([A-Za-z-]+):\s*(.+)$/);
    if (match) current.headers[match[1]] = match[2];
  }
}

function matches(pattern, path) {
  const rx = new RegExp(
    '^' + pattern.split('*').map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$',
  );
  return rx.test(path);
}

function headersFor(path) {
  const out = {};
  for (const rule of headerRules) {
    if (matches(rule.pattern, path)) Object.assign(out, rule.headers);
  }
  return out;
}

console.log('Правил в _headers:', headerRules.map((r) => r.pattern).join(', '));

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);

  const headers = headersFor(path);

  for (const candidate of [path, `${path}.html`, join(path, 'index.html')]) {
    const file = normalize(join(DIST, candidate));
    if (!file.startsWith(DIST)) continue;
    try {
      const body = await readFile(file);
      res.writeHead(200, {
        ...headers,
        'Content-Type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
      });
      return res.end(body);
    } catch {

    }
  }
  res.writeHead(404, { ...headers, 'Content-Type': 'text/html' }).end('404');
});

await new Promise((resolve) => server.listen(PORT, resolve));
const base = `http://127.0.0.1:${PORT}`;
const browser = await chromium.launch();

const pass = [];
const fail = [];
const ok = (name, cond, detail = '') =>
  (cond ? pass : fail).push(`${name}${detail ? ' — ' + detail : ''}`);

for (const [locale, expected] of [
  ['en-US', '/en'],
  ['ru-RU', '/ru'],

  ['fr-FR', '/ru'],
]) {
  const ctx = await browser.newContext({ locale });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const got = new URL(page.url()).pathname;
  ok(`язык браузера ${locale} → ${expected}`, got === expected, `получили ${got}`);
  await ctx.close();
}

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

{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + '/ru', { waitUntil: 'networkidle' });

  await page.click('[data-dropdown] > summary');
  ok('список разделов открывается', await page.isVisible('.dropdown__panel'));

  const items = await page.locator('.dropdown__panel a:not(.dropdown__item--wip)').count();
  ok('в списке шесть разделов', items === 6, `нашли ${items}`);

  const wip = page.locator('.dropdown__item--wip');
  ok('пункт «в процессе создания» на месте', (await wip.count()) === 1);
  ok(
    'пункт ведёт на страницу работы в производстве',
    (await wip.getAttribute('href')) === '/ru/in-progress',
    (await wip.getAttribute('href')) ?? '(нет href)',
  );

  await page.mouse.click(700, 500);
  ok('клик мимо закрывает список', !(await page.isVisible('.dropdown__panel')));

  await page.click('[data-dropdown] > summary');
  await page.keyboard.press('Escape');
  ok('Esc закрывает список', !(await page.isVisible('.dropdown__panel')));
  await ctx.close();
}

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

  const cards = await page.locator('.card').count();
  const visible = await page.locator('.card.is-visible').count();
  ok('все карточки проявились', visible === cards, `${visible} из ${cards}`);
  await ctx.close();
}

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

    await page.evaluate(async () => {
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;

      root.style.scrollBehavior = 'auto';

      const step = window.innerHeight;
      const bottom = Math.max(document.body.scrollHeight, root.scrollHeight);
      for (let y = 0; y < bottom; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }

      window.scrollTo(0, 0);
      root.style.scrollBehavior = previous;
    });
    await page.waitForLoadState('networkidle');

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

{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(base + '/ru/work/landings/nonexistent');
  ok('несуществующая страница отдаёт 404', (await page.content()).includes('404'));

  ok('карта сайта на месте', (await page.goto(base + '/sitemap-index.xml')).status() === 200);
  ok('robots.txt на месте', (await page.goto(base + '/robots.txt')).status() === 200);
  await ctx.close();
}

{

  const wipHtml = await readFile(join(DIST, 'ru', 'in-progress.html'), 'utf8').catch(() => '');
  const wipSlugs = new Set([...wipHtml.matchAll(/\/play\/([^/"'\s]+)\//g)].map((m) => m[1]));

  const demos = [];
  for (const dir of await readdir(join(DIST, 'play'), { withFileTypes: true }).catch(() => [])) {
    if (!dir.isDirectory()) continue;

    let section = null;
    for (const candidate of await readdir(join(DIST, 'ru', 'work'), { withFileTypes: true }).catch(() => [])) {
      if (!candidate.isDirectory()) continue;
      const page = join(DIST, 'ru', 'work', candidate.name, `${dir.name}.html`);
      try {
        await readFile(page);
        section = candidate.name;
        break;
      } catch {

      }
    }

    demos.push({
      slug: dir.name,
      src: `/play/${dir.name}/index.html`,
      section,
      wip: wipSlugs.has(dir.name),
    });
  }

  ok('в сборке есть запускаемые работы', demos.length > 0, `нашли ${demos.length}`);
  ok(
    'у каждой копии есть своя страница проекта',
    demos.every((d) => d.section || d.wip),
    demos.filter((d) => !d.section && !d.wip).map((d) => d.slug).join(', ') || 'все на месте',
  );

  for (const demo of demos) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const problems = [];
    page.on('console', (m) => {
      const text = m.text();

      if (m.type() === 'error') problems.push(text);
    });
    page.on('pageerror', (e) => problems.push(e.message));

    const response = await page.goto(base + demo.src, { waitUntil: 'networkidle' });
    ok(`копия ${demo.slug} отдаётся`, response?.status() === 200, `статус ${response?.status()}`);

    const headers = response?.headers() ?? {};
    ok(
      `копия ${demo.slug}: CSP разрешает свои скрипты`,
      (headers['content-security-policy'] ?? '').includes("script-src 'self'"),
    );
    ok(
      `копия ${demo.slug}: рамка со своего домена разрешена`,
      (headers['x-frame-options'] ?? '').toUpperCase() === 'SAMEORIGIN',
      headers['x-frame-options'] ?? '(нет)',
    );

    ok(`копия ${demo.slug} без ошибок`, problems.length === 0, problems.slice(0, 2).join('; '));

    const alive = await page.evaluate(() => {
      if (document.body && document.body.innerHTML.length > 200) return true;

      return [...document.querySelectorAll('canvas')].some((c) => c.width > 300 || c.height > 150);
    });
    ok(`копия ${demo.slug} что-то отрисовала`, Boolean(alive));

    await ctx.close();
  }

  const framed = demos.filter((d) => d.section);
  if (framed.length) {
    const demo = framed[0];
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const url = `${base}/ru/work/${demo.section}/${demo.slug}`;
    await page.goto(url, { waitUntil: 'networkidle' });

    const start = page.locator('[data-demo-start]');
    ok(`на странице ${demo.slug} есть кнопка запуска`, (await start.count()) === 1);

    if (await start.count()) {
      await start.click();
      await page.waitForTimeout(1200);
      const frames = page.frames().filter((f) => f.url().includes('/play/'));
      ok('рамка с копией открывается', frames.length === 1, `кадров: ${frames.length}`);

      const inner = frames[0] ? await frames[0].evaluate(() => document.title || document.body?.innerHTML.length) : null;
      ok('внутри рамки загрузилась страница', Boolean(inner), String(inner).slice(0, 40));
    }

    await ctx.close();
  }
}

{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  for (const path of ['/ru', '/ru/about', '/en', '/']) {
    const response = await page.goto(base + path, { waitUntil: 'domcontentloaded' });
    const csp = response?.headers()['content-security-policy'] ?? '';
    ok(`${path}: строгая CSP на месте`, csp.includes("script-src 'self';"), csp ? 'есть' : '(нет)');
    ok(
      `${path}: рамка со своего домена разрешена`,
      csp.includes("frame-src 'self'"),
      csp.includes('frame-src') ? 'frame-src есть' : '(нет frame-src)',
    );
  }
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
