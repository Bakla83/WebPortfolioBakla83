import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..');
const NEIGHBOURS = resolve(ROOT, '..');
const TARGET = join(ROOT, 'public', 'play');

const DEMOS = [
  { slug: 'hrebet', from: 'hrebet', include: ['index.html', 'css', 'js'] },
  { slug: 'stroy-opora', from: 'stroy-opora', include: ['index.html'] },
  { slug: 'chto-prigotovit', from: 'chto-prigotovit', include: ['index.html'] },

  { slug: 'salt-run', from: 'salt-run/dist', include: ['index.html', 'assets'] },
  { slug: 'pervotsvet', from: 'pervotsvet', include: ['index.html', 'css', 'js'] },
  { slug: 'kluchi-ot-goroda', from: 'kluchi-ot-goroda', include: ['index.html', 'css', 'js'] },
  { slug: 'oktava', from: 'oktava', include: ['index.html', 'css', 'js'] },
  { slug: 'partitura', from: 'partitura', include: ['index.html', 'css', 'js'] },
  { slug: 'vetka', from: 'vetka', include: ['index.html', 'css', 'js'] },

  {
    slug: 'centipede-repaints',
    from: 'centipede-repaints',
    include: ['index.html', 'css', 'js', 'img'],
  },

  {
    slug: 'brandgalleryhome',
    from: 'brandgalleryhome/design',
    include: [
      'index.html',
      'catalog.html',
      'product.html',
      'factory.html',
      'request.html',
      'about.html',
      'designers.html',
      'articles.html',
      'article.html',
      'contacts.html',
      'css',
      'js',
      'fonts',
      'favicon.svg',
      'variants',
    ],
  },
];

const checkOnly = process.argv.includes('--check');

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function dirSize(dir) {
  const files = await walk(dir);
  const sizes = await Promise.all(files.map(async (f) => (await stat(f)).size));
  return sizes.reduce((a, b) => a + b, 0);
}

async function externaliseInlineScripts(htmlPath) {
  const html = await readFile(htmlPath, 'utf8');
  const dir = dirname(htmlPath);
  const extracted = [];

  let index = 0;
  const next = html.replace(
    /<script([^>]*)>([\s\S]*?)<\/script>/gi,
    (whole, rawAttrs, body) => {
      const attrs = rawAttrs.trim();
      if (/\bsrc\s*=/i.test(attrs)) return whole;

      const type = attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i)?.[1]?.toLowerCase();
      const isScript = !type || type === 'text/javascript' || type === 'module';
      if (!isScript) return whole;
      if (!body.trim()) return whole;

      const name = `inline-${++index}.js`;
      extracted.push({ name, body });

      const rest = attrs
        .replace(/\btype\s*=\s*(["'])[^"']*\1/i, '')
        .replace(/\btype\s*=\s*[^\s>]+/i, '')
        .trim();

      const parts = ['<script'];
      if (type === 'module') parts.push(' type="module"');
      if (rest) parts.push(' ' + rest);
      parts.push(` src="${name}"></script>`);
      return parts.join('');
    },
  );

  if (!extracted.length) return 0;

  await Promise.all(extracted.map((s) => writeFile(join(dir, s.name), s.body, 'utf8')));
  await writeFile(htmlPath, next, 'utf8');
  return extracted.length;
}

const IMAGE_MAX_WIDTH = 1800;
const IMAGE_MAX_BYTES = 320 * 1024;
const RASTER = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function shrinkImages(dir) {
  let saved = 0;
  let touched = 0;

  for (const file of await walk(dir)) {
    const ext = extname(file).toLowerCase();
    if (!RASTER.has(ext)) continue;

    const input = await readFile(file);
    const before = input.length;

    let meta;
    try {
      meta = await sharp(input).metadata();
    } catch {
      continue;
    }

    const wide = (meta.width ?? 0) > IMAGE_MAX_WIDTH;
    if (!wide && before <= IMAGE_MAX_BYTES) continue;

    let pipe = sharp(input).rotate();
    if (wide) pipe = pipe.resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true });

    if (ext === '.png') pipe = pipe.png({ compressionLevel: 9 });
    else if (ext === '.webp') pipe = pipe.webp({ quality: 82 });
    else pipe = pipe.jpeg({ quality: 82, mozjpeg: true });

    const next = await pipe.toBuffer();
    if (next.length >= before) continue;

    await writeFile(file, next);
    saved += before - next.length;
    touched++;
  }

  return { saved, touched };
}

let missing = 0;
let failed = 0;

for (const demo of DEMOS) {
  const source = join(NEIGHBOURS, demo.from);
  const dest = join(TARGET, demo.slug);

  if (!(await exists(source))) {
    console.warn(`  ⚠ ${demo.slug}: нет источника ${relative(ROOT, source)} — пропущено`);
    missing++;
    continue;
  }

  if (checkOnly) {
    console.log(`  ✓ ${demo.slug}: источник на месте`);
    continue;
  }

  await rm(dest, { recursive: true, force: true });
  await mkdir(dest, { recursive: true });

  let copied = 0;
  for (const item of demo.include) {
    const from = join(source, item);
    if (!(await exists(from))) {
      console.warn(`  ⚠ ${demo.slug}: нет ${item}`);
      failed++;
      continue;
    }
    await cp(from, join(dest, item), { recursive: true });
    copied++;
  }

  if (!copied) continue;

  let scripts = 0;
  for (const file of await walk(dest)) {
    if (extname(file).toLowerCase() === '.html') {
      scripts += await externaliseInlineScripts(file);
    }
  }

  const { saved, touched } = await shrinkImages(dest);

  const kb = Math.round((await dirSize(dest)) / 1024);
  console.log(
    `  ✓ ${demo.slug.padEnd(18)} ${String(kb).padStart(5)} КБ` +
      (scripts ? `, скриптов вынесено: ${scripts}` : '') +
      (touched ? `, картинок ужато: ${touched} (−${Math.round(saved / 1024)} КБ)` : ''),
  );
}

if (missing) {
  console.log(`\nПропущено работ: ${missing}. Ссылки на них со страниц проектов не сработают.`);
}
if (failed) {
  console.error(`\nНе найдено файлов: ${failed}`);
  process.exit(1);
}
