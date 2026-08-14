import { readFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import { PROJECTS } from '../src/data/projects.ts';

const ROOT = join(import.meta.dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');

async function loadEnv() {
  try {
    const raw = await readFile(join(ROOT, '.env'), 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!match) continue;
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (value && !process.env[match[1]]) process.env[match[1]] = value;
    }
  } catch {

  }
}

await loadEnv();

const PROJECT_ID = process.env.SANITY_PROJECT_ID;
const DATASET = process.env.SANITY_DATASET ?? 'production';
const TOKEN = process.env.SANITY_WRITE_TOKEN;
const API = '2024-10-01';

if (!PROJECT_ID) {
  console.error('Нет SANITY_PROJECT_ID. Создайте .env в корне проекта — образец в .env.example.');
  process.exit(1);
}
if (!TOKEN && !DRY_RUN) {
  console.error(
    'Нет SANITY_WRITE_TOKEN.\n' +
      'Возьмите его в sanity.io/manage → ваш проект → API → Tokens → Add token,\n' +
      'права Editor. Впишите в .env. В git он не попадёт и на сайт тоже.',
  );
  process.exit(1);
}

let keyCounter = 0;

const key = () => `k${(++keyCounter).toString(36)}${Date.now().toString(36).slice(-4)}`;

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

const uploaded = new Map();

async function uploadImage(publicPath) {
  if (uploaded.has(publicPath)) return uploaded.get(publicPath);

  const file = join(ROOT, 'public', publicPath.replace(/^\//, ''));
  const bytes = await readFile(file);
  const type = MIME[extname(file).toLowerCase()] ?? 'application/octet-stream';

  if (DRY_RUN) {
    const fake = `image-dryrun-${basename(file)}`;
    uploaded.set(publicPath, fake);
    console.log(`    [dry-run] загрузил бы ${publicPath} (${Math.round(bytes.length / 1024)}KB)`);
    return fake;
  }

  const url =
    `https://${PROJECT_ID}.api.sanity.io/v${API}/assets/images/${DATASET}` +
    `?filename=${encodeURIComponent(basename(file))}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': type },
    body: bytes,
  });

  if (!response.ok) {
    throw new Error(`загрузка ${publicPath} не удалась: ${response.status} ${await response.text()}`);
  }

  const body = await response.json();
  const id = body.document._id;
  uploaded.set(publicPath, id);
  console.log(`    ${publicPath} → ${id}`);
  return id;
}

const locale = (value, type) => {
  if (!value) return undefined;
  const out = { _type: type };
  for (const lang of ['ru', 'en', 'fr', 'es']) {
    if (value[lang] !== undefined) out[lang] = value[lang];
  }
  return out;
};

async function imageField(image, memberType) {
  if (!image) return undefined;
  const assetId = await uploadImage(image.src);
  return {
    ...(memberType ? { _type: memberType, _key: key() } : { _type: 'image' }),
    asset: { _type: 'reference', _ref: assetId },
    alt: locale(image.alt, 'localeString'),
    caption: locale(image.caption, 'localeString'),
  };
}

const documents = [];

for (const project of PROJECTS) {
  console.log(`\n${project.slug}`);

  const doc = {

    _id: `project-${project.slug}`,
    _type: 'project',
    title: locale(project.title, 'localeString'),
    slug: { _type: 'slug', current: project.slug },
    section: project.section,
    year: project.year,
    tech: project.tech,
    featured: project.featured ?? false,
    order: project.order,
    teaser: locale(project.teaser, 'localeText'),
    summary: locale(project.summary, 'localeText'),
    highlights: locale(project.highlights, 'localeStringList'),
    role: locale(project.role, 'localeString'),
    status: locale(project.status, 'localeString'),
    cover: await imageField(project.cover),
  };

  if (project.gallery?.length) {
    doc.gallery = [];
    for (const image of project.gallery) {
      doc.gallery.push(await imageField(image, 'galleryImage'));
    }
  }

  if (project.videos?.length) {
    doc.videos = project.videos.map((video) => ({
      _type: 'video',
      _key: key(),
      provider: video.provider,
      videoId: video.id,
      title: locale(video.title, 'localeString'),
    }));
  }

  if (project.links?.length) {
    doc.links = project.links.map((link) => ({
      _type: 'link',
      _key: key(),
      kind: link.kind,
      url: link.url,
      label: locale(link.label, 'localeString'),
    }));
  }

  documents.push(JSON.parse(JSON.stringify(doc)));
}

console.log(`\nПодготовлено документов: ${documents.length}`);

if (DRY_RUN) {
  console.log('Пробный прогон — в Sanity ничего не отправлено.');
  process.exit(0);
}

const mutateUrl = `https://${PROJECT_ID}.api.sanity.io/v${API}/data/mutate/${DATASET}`;
const response = await fetch(mutateUrl, {
  method: 'POST',
  headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ mutations: documents.map((doc) => ({ createOrReplace: doc })) }),
});

if (!response.ok) {
  console.error(`Запись не удалась: ${response.status}`);
  console.error(await response.text());
  process.exit(1);
}

console.log('Готово. Откройте админку — все работы на месте и доступны для правки.');
