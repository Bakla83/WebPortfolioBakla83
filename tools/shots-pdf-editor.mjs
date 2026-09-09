/**
 * Снимки для карточки «Правка PDF».
 *
 * Общему tools/shots.mjs эта работа не подходит: приложение показывает пустой
 * экран, пока в него не загрузили документ, — снимать нужно уже с открытым
 * примером и после правки абзаца.
 */

import { chromium } from 'playwright';
import sharp from 'sharp';
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { mkdir, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const PUBLIC = join(ROOT, 'public');
const OUT = join(PUBLIC, 'media', 'pdf-editor');

const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1.5 };
const MOBILE = { width: 585, height: 1266, deviceScaleFactor: 2 };

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

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

async function open(browser, url, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.deviceScaleFactor,
    locale: 'ru-RU',
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.click('#pickSample');
  await page.waitForFunction(() => document.querySelectorAll('.blk').length > 0, null, {
    timeout: 30000,
  });
  await page.waitForTimeout(1200);
  return { context, page };
}

async function save(png, file) {
  const info = await sharp(png).png({ compressionLevel: 9, palette: true }).toFile(join(OUT, file));
  console.log(`  ✓ ${file.padEnd(14)} ${info.width}x${info.height} ${Math.round(info.size / 1024)} КБ`);
}

await mkdir(OUT, { recursive: true });
const { server, port } = await serve();
const browser = await chromium.launch();
const url = `http://127.0.0.1:${port}/play/pdf-editor/index.html`;

/* Обложка: документ открыт, абзац выделен — видно панель блока. */
{
  const { context, page } = await open(browser, url, DESKTOP);
  await page.locator('.blk').nth(1).click();
  await page.waitForTimeout(600);
  await save(await page.screenshot({ type: 'png' }), 'cover.png');
  await context.close();
}

/* Второй кадр: абзац удлинён, строки перенеслись, соседи уехали вниз. */
{
  const { context, page } = await open(browser, url, DESKTOP);
  const body = page.locator('.blk').nth(1).locator('.blk-body');
  await body.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.type(
    'Исполнитель обязуется оказать услуги по разработке макета в согласованные сроки, ' +
      'а Заказчик обязуется принять результат работ и оплатить его в течение десяти ' +
      'банковских дней с момента подписания акта.',
    { delay: 4 },
  );
  await page.keyboard.press('Escape');
  await page.waitForTimeout(900);
  await save(await page.screenshot({ type: 'png' }), 'desktop-2.png');
  await context.close();
}

/* Телефон: узкий экран прячет боковые панели, остаётся документ. */
{
  const { context, page } = await open(browser, url, MOBILE);
  await save(await page.screenshot({ type: 'png' }), 'mobile.png');
  await context.close();
}

await browser.close();
server.close();
