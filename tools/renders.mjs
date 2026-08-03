/**
 * Готовит рендеры из Blender для сайта.
 *
 * Исходные PNG весят 1–6 МБ каждый — столько на страницу отдавать нельзя.
 * Скрипт делает из каждого два WebP:
 *   cover — 900px, для карточки в списке раздела
 *   full  — 1920px, для галереи на странице работы
 *
 * Два размера, а не один: страница раздела показывает семь карточек сразу,
 * и полноразмерные картинки там превратились бы в лишние мегабайты на телефоне.
 *
 * Запуск:  node tools/renders.mjs
 * Новые рендеры — дописать строку в FILES и добавить работу в src/data/projects.ts.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

// Пути относительные, а не абсолютные: папку с проектами можно переименовать
// или перенести, и скрипт не сломается. Ожидается, что «folder for render pic»
// лежит рядом с папкой сайта.
const SRC = join(import.meta.dirname, '..', '..', 'folder for render pic');
const OUT = join(import.meta.dirname, '..', 'public', 'media', 'renders');

/** [имя файла в папке рендеров, slug работы на сайте] */
const FILES = [
  ['жук5Cyc.png', 'beetle'],
  ['sea boat.png', 'sea-boat'],
  ['place from dream.png', 'dream-place'],
  ['автомат по продаже напитков .png', 'vending-machine'],
  ['заьмение3.png', 'eclipse'],
  ['пистолет.png', 'sci-fi-pistol'],
  ['бомба8.png', 'mine'],
];

for (const [file, slug] of FILES) {
  const dir = join(OUT, slug);
  await mkdir(dir, { recursive: true });
  const input = join(SRC, file);

  const meta = await sharp(input).metadata();

  const cover = await sharp(input)
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(join(dir, 'cover.webp'));

  const full = await sharp(input)
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(join(dir, 'full.webp'));

  console.log(
    `${slug.padEnd(16)} ${meta.width}x${meta.height} → ` +
      `cover ${cover.width}x${cover.height} ${Math.round(cover.size / 1024)}KB, ` +
      `full ${full.width}x${full.height} ${Math.round(full.size / 1024)}KB`,
  );
}
