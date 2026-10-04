import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

// Снимки с рабочего сайта, а не с макетов: в портфолио должен попасть
// именно тот вид, который видят покупатели салона.
const SITE = 'https://brandgalleryhome.ru';
const OUT = resolve(import.meta.dirname, '..', 'public', 'media', 'brandgalleryhome');

const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1.5 };
const MOBILE = { width: 390, height: 844, deviceScaleFactor: 3 };

const SHOTS = [
  { file: 'cover.jpg', path: '/', viewport: DESKTOP },
  { file: 'desktop-2.jpg', path: '/catalog/', viewport: DESKTOP },
  { file: 'desktop-3.jpg', path: '/fabriki/', viewport: DESKTOP },
  { file: 'mobile.jpg', path: '/catalog/', viewport: MOBILE },
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

for (const shot of SHOTS) {
  const context = await browser.newContext({
    viewport: { width: shot.viewport.width, height: shot.viewport.height },
    deviceScaleFactor: shot.viewport.deviceScaleFactor,
    locale: 'ru-RU',
  });

  const page = await context.newPage();
  await page.goto(SITE + shot.path, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  // Плашка о cookie закрывает низ экрана — на снимке она не нужна.
  await page.addStyleTag({ content: '[class*="cookie"]{display:none!important}' });
  await page.waitForTimeout(1200);

  const png = await page.screenshot({ type: 'png' });
  await context.close();

  const info = await sharp(png)
    .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(join(OUT, shot.file));

  console.log(`  ✓ ${shot.file.padEnd(14)} ${info.width}x${info.height} ${Math.round(info.size / 1024)} КБ`);
}

await browser.close();
