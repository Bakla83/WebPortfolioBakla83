/**
 * Пересъёмка снимков лендингов для карточек и галерей на страницах работ.
 *
 * Снимки — не декорация: на странице работы они показывают, как лендинг
 * выглядит на самом деле. Как только текст на лендинге меняется, снимок
 * начинает врать, и его надо переснять. Руками это делается долго и каждый
 * раз с новым кадрированием, поэтому кадры описаны здесь: секция, размер
 * окна и имя файла.
 *
 * Снимает Playwright по копии из `public/play/<slug>/` — той самой, что
 * уезжает на сайт. Копию отдаёт локальный сервер, а не file://: страница
 * тянет шрифты и работает с localStorage, и по file:// часть этого молча
 * отваливается.
 *
 * Размеры окна взяты под 2160×1350 (16/10 — пропорция карточки в списке
 * работ) и 1170×2532 (телефон). Множитель 2 не для красоты: на снимке
 * читается мелкий текст интерфейса, а он снят с экрана без ретины выглядит
 * мылом.
 *
 * Запуск:
 *   npm run shots                 — переснять все описанные работы
 *   npm run shots centipede-repaints  — только одну
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const PUBLIC = join(ROOT, 'public');

// Ширина окна — ноутбучные 1440: у`wrap` есть предел, и на более узком окне
// содержимое упирается в края, а на снимке пропадают поля, по которым
// страница и читается как страница, а не как скриншот вёрстки.
const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1.5 };
const MOBILE = { width: 585, height: 1266, deviceScaleFactor: 2 };

/**
 * `at` — селектор секции, к которой прокручивается страница. Секция встаёт
 * верхним краем к верху окна: её собственный отступ сверху как раз оставляет
 * заголовку воздух, а шапка остаётся видимой.
 */
const JOBS = [
  {
    slug: 'centipede-repaints',
    shots: [
      { file: 'cover.jpg', at: null, viewport: DESKTOP },
      { file: 'desktop-2.jpg', at: '#works', viewport: DESKTOP },
      { file: 'desktop-3.jpg', at: '#studio', viewport: DESKTOP },
      { file: 'desktop-4.jpg', at: '#zita', viewport: DESKTOP },
      { file: 'mobile.jpg', at: null, viewport: MOBILE },
    ],
  },
];

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

/** Отдаёт public/ как есть: без индексов каталогов и без обработки — только файлы. */
function serve() {
  const server = createServer(async (req, res) => {
    const path = join(PUBLIC, decodeURIComponent(req.url.split('?')[0]));
    if (!path.startsWith(PUBLIC)) {
      res.writeHead(403).end();
      return;
    }
    try {
      const info = await stat(path);
      if (!info.isFile()) throw new Error('not a file');
    } catch {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream' });
    createReadStream(path).pipe(res);
  });

  return new Promise((ok) => {
    server.listen(0, '127.0.0.1', () => ok({ server, port: server.address().port }));
  });
}

const only = process.argv.slice(2);
const jobs = only.length ? JOBS.filter((j) => only.includes(j.slug)) : JOBS;

if (!jobs.length) {
  console.error(`Нет такой работы. Известны: ${JOBS.map((j) => j.slug).join(', ')}`);
  process.exit(1);
}

const { server, port } = await serve();
const browser = await chromium.launch();

for (const job of jobs) {
  const url = `http://127.0.0.1:${port}/play/${job.slug}/index.html`;
  const out = join(PUBLIC, 'media', job.slug);

  for (const shot of job.shots) {
    const context = await browser.newContext({
      viewport: { width: shot.viewport.width, height: shot.viewport.height },
      deviceScaleFactor: shot.viewport.deviceScaleFactor,
      locale: 'ru-RU',
    });

    // Язык и палитра выставляются до первой отрисовки — ровно так же, как это
    // делает сама страница. Иначе снимок ловит момент до переключения.
    await context.addInitScript(() => {
      try {
        localStorage.setItem('centipede-lang', 'ru');
        localStorage.setItem('centipede-palette', 'bay');
        localStorage.setItem('centipede-calm', '0');
      } catch (e) {}
    });

    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    if (shot.at) {
      // scrollTo, а не scrollIntoView: у секций задан scroll-margin под
      // якорную навигацию, и он увёл бы кадр вниз от заголовка.
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
      }, shot.at);
    }

    // Появление блоков по прокрутке длится около секунды; снимок раньше
    // поймал бы полупрозрачный, наполовину сдвинутый текст.
    await page.waitForTimeout(1600);

    const png = await page.screenshot({ type: 'png' });
    await context.close();

    const file = join(out, shot.file);
    const info = await sharp(png)
      .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(file);

    console.log(
      `  ✓ ${job.slug}/${shot.file.padEnd(14)} ${info.width}x${info.height} ` +
        `${Math.round(info.size / 1024)} КБ`,
    );
  }
}

await browser.close();
server.close();
