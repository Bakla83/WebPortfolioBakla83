import { chromium } from 'playwright';
import sharp from 'sharp';
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const PUBLIC = join(ROOT, 'public');

const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1.5 };
const MOBILE = { width: 585, height: 1266, deviceScaleFactor: 2 };

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

      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
      }, shot.at);
    }

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
