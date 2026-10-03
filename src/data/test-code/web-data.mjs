// tools/site-test.mjs, разделы «Данные проектов» и «Словари интерфейса».
// Node 22 читает TypeScript напрямую, поэтому данные проверяются до сборки.
const { PROJECTS } = await import('../src/data/projects.ts');
const { SECTIONS } = await import('../src/data/sections.ts');
const { t } = await import('../src/i18n/ui.ts');

const slugs = PROJECTS.map((p) => p.slug);
const twins = slugs.filter((slug, i) => slugs.indexOf(slug) !== i);
check('адреса проектов не повторяются', twins.length === 0, list(twins));

const sectionSlugs = new Set(SECTIONS.map((s) => s.slug));
const lost = PROJECTS.filter((p) => !sectionSlugs.has(p.section)).map((p) => `${p.slug} → ${p.section}`);
check('каждый проект лежит в существующем разделе', lost.length === 0, list(lost));

const missing = [];
for (const [slug, src] of files) {
  if (/^https?:/.test(src)) continue;
  if (!(await exists(join(PUBLIC, src)))) missing.push(`${slug}: ${src}`);
}
check(`все ${files.length} файлов картинок, моделей и копий на месте`, missing.length === 0, list(missing));

const keys = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === 'object' && !Array.isArray(value) ? keys(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  );

const ru = keys(t('ru'));
const en = keys(t('en'));
const onlyRu = ru.filter((k) => !en.includes(k));
const onlyEn = en.filter((k) => !ru.includes(k));
check('в английском словаре те же ключи, что в русском', !onlyRu.length && !onlyEn.length, list([...onlyRu, ...onlyEn]));
