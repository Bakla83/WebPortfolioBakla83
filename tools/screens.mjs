/**
 * Готовит снимки экрана Android-приложения «Что приготовить» для сайта.
 *
 * Исходники — вертикальные JPEG 1280×2500 из папки с проектами. Скрипт делает
 * из них две вещи:
 *   1) три WebP для галереи на странице работы (ширина 1080, вес втрое меньше);
 *   2) обложку 2160×1350 — три экрана на тёмной подложке.
 *
 * Обложка собирается, а не берётся одним снимком, потому что карточка в списке
 * работ показывает картинку в пропорции 16/10 с object-fit: cover. Вертикальный
 * снимок телефона она обрезала бы до узкой полосы из середины экрана — от
 * приложения не осталось бы ничего узнаваемого.
 *
 * Запуск:  npm run screens
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

// Пути относительные: папку с проектами можно перенести, скрипт не сломается.
// Исходники лежат в самом приложении, а не рядом с сайтом: снимки — часть той
// работы, а не сайта, и в корне проектов от них не остаётся мусора.
const SRC = join(import.meta.dirname, '..', '..', 'chto-prigotovit-android', 'screenshots');
const OUT = join(import.meta.dirname, '..', 'public', 'media', 'chto-prigotovit-android');

/** [файл-исходник, имя на сайте, высота на обложке] */
const SCREENS = [
  ['mobile app choose.jpg', 'products', 1010],
  // Тёмная тема стоит в середине и выше остальных: на тёмной подложке она
  // иначе теряется, а так светлые экраны работают ей рамкой.
  ['mobile app dark theme.jpg', 'recipes-dark', 1160],
  ['mobile app.jpg', 'recipe', 1010],
];

const W = 2160;
const H = 1350;
const GAP = 52;
const RADIUS = 30;

await mkdir(OUT, { recursive: true });

/* --------------------------------------------------------- 1. галерея (WebP) */
for (const [file, name] of SCREENS) {
  const out = await sharp(join(SRC, file))
    .resize({ width: 1080, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(join(OUT, `${name}.webp`));

  console.log(
    `${name.padEnd(14)} ${out.width}x${out.height} ${Math.round(out.size / 1024)}KB`,
  );
}

/* ------------------------------------------------------------- 2. обложка */

/** Снимок нужной высоты со скруглёнными углами и тонкой светлой рамкой. */
async function phone(file, height) {
  const body = await sharp(join(SRC, file)).resize({ height }).png().toBuffer();
  const { width } = await sharp(body).metadata();

  const mask = Buffer.from(
    `<svg width="${width}" height="${height}">` +
      `<rect width="${width}" height="${height}" rx="${RADIUS}" ry="${RADIUS}" fill="#fff"/></svg>`,
  );
  // Рамка рисуется поверх: без неё тёмный экран сливается с подложкой
  const stroke = Buffer.from(
    `<svg width="${width}" height="${height}">` +
      `<rect x="0.75" y="0.75" width="${width - 1.5}" height="${height - 1.5}" ` +
      `rx="${RADIUS}" ry="${RADIUS}" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/></svg>`,
  );

  const image = await sharp(body)
    .composite([
      { input: mask, blend: 'dest-in' },
      { input: stroke, blend: 'over' },
    ])
    .png()
    .toBuffer();

  // Тень — размытый чёрный прямоугольник той же формы, со сдвигом вниз
  const shadow = await sharp({
    create: { width: width + 120, height: height + 120, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      {
        input: Buffer.from(
          `<svg width="${width}" height="${height}">` +
            `<rect width="${width}" height="${height}" rx="${RADIUS}" ry="${RADIUS}" fill="rgba(0,0,0,0.55)"/></svg>`,
        ),
        top: 60,
        left: 60,
      },
    ])
    .blur(30)
    .png()
    .toBuffer();

  return { image, shadow, width, height };
}

const phones = [];
for (const [file, , height] of SCREENS) phones.push(await phone(file, height));

const totalWidth = phones.reduce((sum, p) => sum + p.width, 0) + GAP * (phones.length - 1);
let x = Math.round((W - totalWidth) / 2);

const layers = [];
for (const p of phones) {
  const top = Math.round((H - p.height) / 2);
  // Тень холст шире картинки на 60px с каждой стороны — на столько же сдвигаем
  layers.push({ input: p.shadow, top: top - 60 + 18, left: x - 60 });
  layers.push({ input: p.image, top, left: x });
  x += p.width + GAP;
}

const background = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
     <defs>
       <linearGradient id="base" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0" stop-color="#12121a"/>
         <stop offset="1" stop-color="#08080b"/>
       </linearGradient>
       <radialGradient id="accent" cx="0.26" cy="0.08" r="0.8">
         <stop offset="0" stop-color="#a177f5" stop-opacity="0.26"/>
         <stop offset="1" stop-color="#a177f5" stop-opacity="0"/>
       </radialGradient>
     </defs>
     <rect width="${W}" height="${H}" fill="url(#base)"/>
     <rect width="${W}" height="${H}" fill="url(#accent)"/>
   </svg>`,
);

/*
  Обложка — JPEG, а не PNG и не WebP. PNG на такой картинке весит больше
  мегабайта (плавная подложка сжимается плохо, а палитра из 256 цветов даёт
  вокруг снимков пятнистый ореол). WebP был бы легче, но эта же картинка идёт
  в og:image, а его читают чужие сборщики превью — не все понимают WebP.
  Цветность не прореживаем: на обложке мелкий текст интерфейса.
*/
const cover = await sharp(background)
  .composite(layers)
  .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' })
  .toFile(join(OUT, 'cover.jpg'));

console.log(`cover          ${cover.width}x${cover.height} ${Math.round(cover.size / 1024)}KB`);
