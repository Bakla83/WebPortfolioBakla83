/**
 * Проверки сайта, которых нет в tools/audit.mjs.
 *
 * Аудит ходит по сайту на ширине ноутбука и смотрит, что всё открывается.
 * Здесь проверяется остальное: данные проектов и словари до сборки,
 * разметка каждой собранной страницы, узкие экраны, клавиатура и
 * раздел «Тестирование».
 *
 * Запуск после сборки:
 *
 *     npm run build
 *     npm test
 */

import { readFile, readdir, access } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { DIST, serveDist } from './serve-dist.mjs';

const ROOT = join(import.meta.dirname, '..');
const PUBLIC = join(ROOT, 'public');
const SITE = 'https://webportfoliobakla83.pages.dev';
const PORT = 4623;

const { PROJECTS } = await import('../src/data/projects.ts');
const { SECTIONS } = await import('../src/data/sections.ts');
const { t } = await import('../src/i18n/ui.ts');

let fails = 0;
let passes = 0;

function check(name, ok, detail = '') {
  if (ok) {
    passes++;
    console.log(`  ок     ${name}`);
    return;
  }

  fails++;
  console.log(`  ПРОВАЛ ${name}${detail ? ': ' + detail : ''}`);
}

const list = (items, limit = 4) =>
  items.length > limit ? `${items.slice(0, limit).join('; ')} и ещё ${items.length - limit}` : items.join('; ');

const exists = (path) =>
  access(path).then(
    () => true,
    () => false,
  );

/* ------------------------------------------------------------ данные */

console.log('Данные проектов');

{
  const slugs = PROJECTS.map((p) => p.slug);
  const twins = slugs.filter((slug, i) => slugs.indexOf(slug) !== i);
  check('адреса проектов не повторяются', twins.length === 0, list(twins));

  const sectionSlugs = new Set(SECTIONS.map((s) => s.slug));
  const lost = PROJECTS.filter((p) => !sectionSlugs.has(p.section)).map((p) => `${p.slug} → ${p.section}`);
  check('каждый проект лежит в существующем разделе', lost.length === 0, list(lost));

  const files = [];
  for (const p of PROJECTS) {
    if (p.cover) files.push([p.slug, p.cover.src]);
    for (const img of p.gallery ?? []) files.push([p.slug, img.src]);
    for (const model of p.models ?? []) {
      files.push([p.slug, model.src]);
      if (model.poster) files.push([p.slug, model.poster]);
    }
    if (p.demo) files.push([p.slug, p.demo.src.split('#')[0].split('?')[0]]);
  }
  const missing = [];
  for (const [slug, src] of files) {
    if (/^https?:/.test(src)) continue;
    if (!(await exists(join(PUBLIC, src)))) missing.push(`${slug}: ${src}`);
  }
  check(`все ${files.length} файлов картинок, моделей и копий на месте`, missing.length === 0, list(missing));

  const untranslated = [];
  for (const p of PROJECTS) {
    for (const field of ['title', 'teaser', 'summary']) {
      if (!p[field]?.en?.trim()) untranslated.push(`${p.slug}.${field}`);
    }
    if (p.highlights && p.highlights.ru.length !== (p.highlights.en ?? []).length) {
      untranslated.push(`${p.slug}.highlights: ${p.highlights.ru.length} ru, ${(p.highlights.en ?? []).length} en`);
    }
    for (const img of [p.cover, ...(p.gallery ?? [])].filter(Boolean)) {
      if (!img.alt?.ru?.trim() || !img.alt?.en?.trim()) untranslated.push(`${p.slug}: alt ${img.src}`);
    }
  }
  check('у каждого проекта есть английский текст и alt на обоих языках', untranslated.length === 0, list(untranslated));
}

console.log('\nСловари интерфейса');

{
  const keys = (obj, prefix = '') =>
    Object.entries(obj).flatMap(([key, value]) =>
      value && typeof value === 'object' && !Array.isArray(value) ? keys(value, `${prefix}${key}.`) : [`${prefix}${key}`],
    );

  const ru = keys(t('ru'));
  const en = keys(t('en'));
  const onlyRu = ru.filter((k) => !en.includes(k));
  const onlyEn = en.filter((k) => !ru.includes(k));
  check('в английском словаре те же ключи, что в русском', !onlyRu.length && !onlyEn.length, list([...onlyRu, ...onlyEn]));

  const empty = en.filter((k) => !String(k.split('.').reduce((o, part) => o[part], t('en'))).trim());
  check('в английском словаре нет пустых строк', empty.length === 0, list(empty));
}

console.log('\nКод в разделе «Тестирование»');

{
  const source = await readFile(join(ROOT, 'src/data/test-cases.ts'), 'utf8');
  const imported = [...source.matchAll(/from '\.\/test-code\/([^']+)\?raw'/g)].map((m) => m[1]);
  const onDisk = await readdir(join(ROOT, 'src/data/test-code'));

  check('все подключённые файлы с кодом существуют', imported.every((f) => onDisk.includes(f)), list(imported.filter((f) => !onDisk.includes(f))));
  check('в папке нет файлов с кодом, которые никто не показывает', onDisk.every((f) => imported.includes(f)), list(onDisk.filter((f) => !imported.includes(f))));

  const ids = [...source.matchAll(/id: '(TC-[A-Z]+-\d+)'/g)].map((m) => m[1]);
  check('номера тест-кейсов не повторяются', new Set(ids).size === ids.length, list(ids.filter((id, i) => ids.indexOf(id) !== i)));
}

/* -------------------------------------------------- собранные страницы */

const { base, server } = await serveDist(PORT);
const browser = await chromium.launch();

const sitemapXml = await readFile(join(DIST, 'sitemap-0.xml'), 'utf8');
const sitemap = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
/* Корень только выбирает язык и закрыт от поиска (noindex), поэтому
   правила обычных страниц к нему не относятся. Его проверка — ниже. */
const pages = sitemap.filter((p) => p !== '/');

console.log(`\nРазметка страниц (${pages.length})`);

{
  const problems = {
    lang: [],
    h1: [],
    headings: [],
    title: [],
    description: [],
    canonical: [],
    hreflang: [],
    ids: [],
    refs: [],
    blank: [],
    imgSize: [],
    names: [],
  };
  const titles = new Map();

  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();

  for (const path of pages) {
    await page.goto(base + path, { waitUntil: 'domcontentloaded' });

    const info = await page.evaluate(() => {
      const $ = (s) => document.querySelector(s);
      const all = (s) => [...document.querySelectorAll(s)];

      const levels = all('main h1, main h2, main h3, main h4').map((h) => Number(h.tagName[1]));
      const skipped = levels.some((level, i) => i > 0 && level - levels[i - 1] > 1);

      const ids = all('[id]').map((el) => el.id);
      const twins = ids.filter((id, i) => ids.indexOf(id) !== i);

      const refs = [];
      for (const el of all('[aria-labelledby], [aria-controls], [aria-describedby], label[for]')) {
        for (const attr of ['aria-labelledby', 'aria-controls', 'aria-describedby', 'for']) {
          for (const id of (el.getAttribute(attr) ?? '').split(/\s+/).filter(Boolean)) {
            if (!document.getElementById(id)) refs.push(`${attr}=${id}`);
          }
        }
      }
      for (const a of all('a[href^="#"]')) {
        const id = decodeURIComponent(a.getAttribute('href').slice(1));
        if (id && !document.getElementById(id)) refs.push(`href=#${id}`);
      }

      const blank = all('a[target="_blank"]')
        .filter((a) => !/noopener/.test(a.rel))
        .map((a) => a.href);

      const imgSize = all('img')
        .filter((img) => !img.getAttribute('width') || !img.getAttribute('height'))
        .map((img) => img.getAttribute('src'));

      const names = all('a, button, summary, [role="button"]')
        .filter((el) => el.offsetParent !== null || el.closest('details'))
        .filter((el) => {
          const name =
            el.getAttribute('aria-label') ||
            (el.getAttribute('aria-labelledby') ?? '')
              .split(/\s+/)
              .map((id) => document.getElementById(id)?.textContent ?? '')
              .join('') ||
            el.textContent ||
            el.querySelector('img[alt]')?.getAttribute('alt') ||
            el.getAttribute('title');
          return !name || !name.trim();
        })
        .map((el) => el.outerHTML.slice(0, 80));

      return {
        lang: document.documentElement.lang,
        h1: all('h1').length,
        skipped: skipped ? levels.join('') : '',
        title: document.title.trim(),
        description: $('meta[name="description"]')?.content.trim() ?? '',
        canonical: $('link[rel="canonical"]')?.href ?? '',
        hreflang: all('link[rel="alternate"][hreflang]').map((l) => [l.hreflang, new URL(l.href).pathname]),
        twins,
        refs,
        blank,
        imgSize,
        names,
      };
    });

    const expectedLang = path.split('/')[1];
    if (info.lang !== expectedLang) problems.lang.push(`${path}: ${info.lang}`);
    if (info.h1 !== 1) problems.h1.push(`${path}: ${info.h1}`);
    if (info.skipped) problems.headings.push(`${path}: ${info.skipped}`);
    if (!info.title) problems.title.push(path);
    titles.set(info.title, [...(titles.get(info.title) ?? []), path]);
    if (info.description.length < 50 || info.description.length > 200) {
      problems.description.push(`${path}: ${info.description.length} знаков`);
    }
    if (info.canonical !== SITE + path) problems.canonical.push(`${path}: ${info.canonical}`);

    const langs = info.hreflang.map(([lang]) => lang).sort().join(',');
    if (langs !== 'en,ru,x-default') problems.hreflang.push(`${path}: ${langs}`);
    for (const [, target] of info.hreflang) {
      if (target !== '/' && !pages.includes(target) && !sitemap.includes(target)) problems.hreflang.push(`${path} → ${target}`);
    }

    if (info.twins.length) problems.ids.push(`${path}: ${[...new Set(info.twins)].join(', ')}`);
    if (info.refs.length) problems.refs.push(`${path}: ${info.refs.join(', ')}`);
    if (info.blank.length) problems.blank.push(`${path}: ${info.blank[0]}`);
    if (info.imgSize.length) problems.imgSize.push(`${path}: ${info.imgSize[0]}`);
    if (info.names.length) problems.names.push(`${path}: ${info.names[0]}`);
  }

  const sameTitle = [...titles.entries()].filter(([, paths]) => paths.length > 1).map(([title, paths]) => `«${title}»: ${paths.join(', ')}`);

  check('язык документа совпадает с языком адреса', !problems.lang.length, list(problems.lang));
  check('на каждой странице ровно один h1', !problems.h1.length, list(problems.h1));
  check('уровни заголовков не перескакивают', !problems.headings.length, list(problems.headings));
  check('у каждой страницы есть заголовок', !problems.title.length, list(problems.title));
  check('заголовки страниц не повторяются', !sameTitle.length, list(sameTitle));
  check('описание для поиска от 50 до 200 знаков', !problems.description.length, list(problems.description));
  check('canonical указывает на саму страницу', !problems.canonical.length, list(problems.canonical));
  check('hreflang ru, en и x-default ведут на существующие страницы', !problems.hreflang.length, list(problems.hreflang));
  check('id на странице не повторяются', !problems.ids.length, list(problems.ids));
  check('aria-ссылки и якоря ведут на существующие id', !problems.refs.length, list(problems.refs));
  check('ссылки в новой вкладке с rel=noopener', !problems.blank.length, list(problems.blank));
  check('у картинок заданы размеры, вёрстка не прыгает', !problems.imgSize.length, list(problems.imgSize));
  check('у ссылок и кнопок есть доступное имя', !problems.names.length, list(problems.names));

  await ctx.close();
}

console.log('\nКарта сайта');

{
  const built = [];
  const walk = async (dir, prefix) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) await walk(join(dir, entry.name), `${prefix}/${entry.name}`);
      else if (entry.name.endsWith('.html')) built.push(`${prefix}/${entry.name.replace(/\.html$/, '')}`);
    }
  };
  await walk(join(DIST, 'ru'), '/ru');
  await walk(join(DIST, 'en'), '/en');
  built.push('/ru', '/en');

  const notListed = built.filter((p) => !sitemap.includes(p));
  check('в карте сайта все собранные страницы', !notListed.length, list(notListed));

  const rootHtml = await readFile(join(DIST, 'index.html'), 'utf8');
  const rootNoindex = /<meta name="robots" content="noindex/.test(rootHtml);
  check('корень закрыт от поиска и поэтому не стоит в карте сайта', rootNoindex && !sitemap.includes('/'),
    `noindex: ${rootNoindex}, в карте: ${sitemap.includes('/')}`);
}

console.log('\nИконки сайта');

{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const broken = [];

  for (const path of ['/', '/ru', '/en/testing']) {
    await page.goto(base + path, { waitUntil: 'domcontentloaded' });
    const icons = await page.evaluate(() =>
      [...document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]')].map((l) => ({
        href: l.getAttribute('href'),
        sizes: l.getAttribute('sizes') ?? '',
      })),
    );
    if (!icons.length) broken.push(`${path}: иконок нет`);

    for (const icon of icons) {
      const response = await page.request.get(base + icon.href);
      const type = response.headers()['content-type'] ?? '';
      if (response.status() !== 200 || !type.startsWith('image/')) {
        broken.push(`${path}: ${icon.href} → ${response.status()} ${type}`);
        continue;
      }

      /* Заявленный размер должен совпадать с настоящим, иначе браузер возьмёт не тот файл. */
      const declared = icon.sizes.match(/^(\d+)x\d+$/);
      if (declared) {
        const actual = await page.evaluate(async (src) => {
          const img = new Image();
          img.src = src;
          await img.decode();
          return img.naturalWidth;
        }, icon.href);
        if (actual !== Number(declared[1])) broken.push(`${icon.href}: заявлено ${declared[1]}, на деле ${actual}`);
      }
    }
  }

  check('все иконки из head отдаются картинками заявленного размера', !broken.length, list(broken));
  await ctx.close();
}

console.log('\nУзкие экраны (WCAG 1.4.10)');

for (const width of [320, 360, 390]) {
  const ctx = await browser.newContext({ viewport: { width, height: 800 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const wide = [];

  for (const path of pages) {
    await page.goto(base + path, { waitUntil: 'domcontentloaded' });
    const overflow = await page.evaluate(() => {
      const extra = document.documentElement.scrollWidth - window.innerWidth;
      if (extra <= 0) return null;

      const culprit = [...document.querySelectorAll('body *')].find((el) => el.getBoundingClientRect().right > window.innerWidth + 1);
      return `${extra}px, ${culprit ? culprit.tagName.toLowerCase() + '.' + [...culprit.classList].join('.') : '?'}`;
    });
    if (overflow) wide.push(`${path}: ${overflow}`);
  }

  check(`${width}px: страницы без горизонтальной прокрутки`, !wide.length, list(wide));

  /* Текст может вылезти из своего блока поверх соседей, а страница
     шире экрана при этом не станет. В шапке это видно сразу. */
  await page.goto(base + '/ru', { waitUntil: 'domcontentloaded' });
  const overlap = await page.evaluate(() => {
    const found = [];
    for (const el of document.querySelectorAll('.site-header *')) {
      if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX === 'visible' && el.clientWidth > 0) {
        found.push(`${el.className}: текст ${el.scrollWidth}px в блоке ${el.clientWidth}px`);
      }
    }
    const brand = document.querySelector('.brand')?.getBoundingClientRect();
    const tools = document.querySelector('.site-header__tools')?.getBoundingClientRect();
    if (brand && tools && brand.right > tools.left) found.push(`бренд заходит на кнопки на ${Math.round(brand.right - tools.left)}px`);
    return found;
  });
  check(`${width}px: в шапке ничего не налезает друг на друга`, !overlap.length, list(overlap));
  await ctx.close();
}

console.log('\nРазмер целей касания (WCAG 2.5.8)');

{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const small = [];

  for (const path of ['/ru', '/ru/about', '/ru/contacts', '/ru/testing', '/ru/work/landings', '/ru/work/pc-games/the-hidden-library']) {
    await page.goto(base + path, { waitUntil: 'domcontentloaded' });
    const found = await page.evaluate(() =>
      [...document.querySelectorAll('a, button, summary, input, select')]
        .filter((el) => {
          const box = el.getBoundingClientRect();
          if (!box.width || !box.height) return false;
          if (getComputedStyle(el).display === 'inline' && el.closest('p, li, dd')) return false;
          return box.width < 24 || box.height < 24;
        })
        .map((el) => {
          const box = el.getBoundingClientRect();
          return `${el.tagName.toLowerCase()} «${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 20)}» ${Math.round(box.width)}×${Math.round(box.height)}`;
        }),
    );
    for (const item of found) small.push(`${path}: ${item}`);
  }

  check('кнопки и ссылки вне текста не меньше 24×24', !small.length, list(small));
  await ctx.close();
}

console.log('\nКлавиатура');

{
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + '/ru/about', { waitUntil: 'networkidle' });

  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => document.activeElement?.className ?? '');
  check('первый Tab попадает на ссылку «Перейти к содержимому»', first.includes('skip-link'), first);

  const skipVisible = await page.evaluate(() => document.activeElement.getBoundingClientRect().top >= 0);
  check('ссылка пропуска видна в фокусе', skipVisible);

  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  const inMain = await page.evaluate(() => Boolean(document.activeElement?.closest('main')));
  check('после пропуска следующий Tab уже внутри main', inMain);

  await page.goto(base + '/ru', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  check('у элемента в фокусе видна рамка', outline !== 'none', outline);

  await ctx.close();
}

console.log('\nРаздел «Тестирование»');

{
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

  await page.goto(base + '/ru/testing', { waitUntil: 'networkidle' });

  const total = await page.locator('[data-test-case]').count();
  const shown = () => page.textContent('[data-qa-shown]').then(Number);
  const visibleCards = () => page.locator('[data-test-case]:visible').count();

  check('панель фильтров появляется', await page.isVisible('[data-qa-filters]'));
  check('счётчик совпадает с числом карточек', (await shown()) === total, `${await shown()} из ${total}`);

  await page.click('[data-filter="project"][data-value="thl"]');
  await page.click('[data-filter="kind"][data-value="manual"]');
  const thlManual = await visibleCards();
  check('фильтр «игра + ручные» оставляет только ручные кейсы игры',
    thlManual > 0 && thlManual === (await shown()) && (await page.locator('[data-qa-project="bgh"]').isHidden()),
    `видно ${thlManual}`);
  check('у ручных кейсов нет пометки «Автотест»',
    (await page.locator('[data-test-case]:visible[data-kind="auto"]').count()) === 0);

  await page.click('[data-filter="project"][data-value="bgh"]');
  check('пустой фильтр показывает подсказку и счётчик 0',
    (await shown()) === 0 && (await page.isVisible('[data-qa-project="bgh"] [data-qa-empty]')));

  const pressed = await page.locator('[data-filter="project"][aria-pressed="true"]').allTextContents();
  check('нажата ровно одна кнопка проекта', pressed.length === 1 && pressed[0].includes('BrandGallery'), pressed.join(', '));

  await page.click('[data-filter="project"][data-value="all"]');
  await page.click('[data-filter="kind"][data-value="all"]');
  check('сброс фильтров возвращает все карточки', (await visibleCards()) === total && (await shown()) === total);

  const codeShown = await page.locator('[data-test-case] details[open] pre').count();
  check('у кейсов с тестом код раскрыт сразу', codeShown > 0, `раскрыто ${codeShown}`);

  /* Номер берётся заранее: после клика блок перестаёт подходить
     под :not([open]), и ленивый локатор ушёл бы на следующий. */
  const closedIndex = await page.evaluate(() =>
    [...document.querySelectorAll('[data-test-case] details')].findIndex((d) => !d.open),
  );
  const closed = page.locator('[data-test-case] details').nth(closedIndex);
  await closed.locator('summary').click();
  check('свёрнутый код раскрывается по клику', await closed.locator('pre').isVisible());

  check('на странице нет ошибок в консоли', !errors.length, list(errors));
  await ctx.close();

  /* На сайте плавная прокрутка, по длинной странице она идёт секунду
     и больше. С «уменьшением движения» сайт прыгает к якорю сразу. */
  const still = await browser.newContext({ viewport: { width: 1366, height: 900 }, reducedMotion: 'reduce' });
  const anchorPage = await still.newPage();
  await anchorPage.goto(base + '/ru/testing#tc-bgh-03', { waitUntil: 'load' });
  await anchorPage.waitForTimeout(300);
  const anchored = await anchorPage.evaluate(() => {
    const card = document.getElementById('tc-bgh-03').getBoundingClientRect();
    const covers = [...document.querySelectorAll('.site-header, [data-qa-filters]')]
      .filter((el) => getComputedStyle(el).position === 'sticky')
      .map((el) => el.getBoundingClientRect().bottom);
    return { top: Math.round(card.top), covered: Math.round(Math.max(0, ...covers)) };
  });
  check('ссылка на кейс прокручивает к нему, а не под шапку и фильтры',
    anchored.top >= anchored.covered && anchored.top < 450, `карточка на ${anchored.top}px, закрыто до ${anchored.covered}px`);
  await still.close();

  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const plain = await noJs.newPage();
  await plain.goto(base + '/en/testing');
  check('без JavaScript видны все карточки, а фильтры спрятаны',
    (await plain.locator('[data-test-case]:visible').count()) === total && (await plain.isHidden('[data-qa-filters]')));
  check('английская версия переведена', (await plain.textContent('h1')).trim() === 'Testing');
  await noJs.close();
}

await browser.close();
server.close();

console.log(fails ? `\nПРОВАЛОВ: ${fails} из ${passes + fails}` : `\nВсё сошлось: ${passes} проверок.`);
process.exit(fails ? 1 : 0);
