// tools/site-test.mjs, раздел «Разметка страниц». Обходит каждую страницу из карты сайта.
for (const path of pages) {
  await page.goto(base + path, { waitUntil: 'domcontentloaded' });

  const info = await page.evaluate(() => {
    const $ = (s) => document.querySelector(s);
    const all = (s) => [...document.querySelectorAll(s)];

    // h1 → h3 без h2 между ними ломает оглавление у программ чтения с экрана.
    const levels = all('main h1, main h2, main h3, main h4').map((h) => Number(h.tagName[1]));
    const skipped = levels.some((level, i) => i > 0 && level - levels[i - 1] > 1);

    return {
      lang: document.documentElement.lang,
      h1: all('h1').length,
      skipped: skipped ? levels.join('') : '',
      title: document.title.trim(),
      description: $('meta[name="description"]')?.content.trim() ?? '',
      canonical: $('link[rel="canonical"]')?.href ?? '',
      hreflang: all('link[rel="alternate"][hreflang]').map((l) => [l.hreflang, new URL(l.href).pathname]),
    };
  });

  if (info.lang !== path.split('/')[1]) problems.lang.push(`${path}: ${info.lang}`);
  if (info.h1 !== 1) problems.h1.push(`${path}: ${info.h1}`);
  if (info.skipped) problems.headings.push(`${path}: ${info.skipped}`);
  // Длиннее ~200 знаков поисковик обрезает описание на полуслове.
  if (info.description.length < 50 || info.description.length > 200) {
    problems.description.push(`${path}: ${info.description.length} знаков`);
  }
  if (info.canonical !== SITE + path) problems.canonical.push(`${path}: ${info.canonical}`);

  const langs = info.hreflang.map(([lang]) => lang).sort().join(',');
  if (langs !== 'en,ru,x-default') problems.hreflang.push(`${path}: ${langs}`);
}

check('язык документа совпадает с языком адреса', !problems.lang.length, list(problems.lang));
check('на каждой странице ровно один h1', !problems.h1.length, list(problems.h1));
check('уровни заголовков не перескакивают', !problems.headings.length, list(problems.headings));
check('описание для поиска от 50 до 200 знаков', !problems.description.length, list(problems.description));
check('canonical указывает на саму страницу', !problems.canonical.length, list(problems.canonical));
check('hreflang ru, en и x-default ведут на существующие страницы', !problems.hreflang.length, list(problems.hreflang));
