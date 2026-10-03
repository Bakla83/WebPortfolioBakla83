// tools/site-test.mjs, раздел «Карта сайта».
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

const notListed = built.filter((p) => !p.endsWith('/in-progress') && !sitemap.includes(p));
check('в карте сайта все собранные страницы', !notListed.length, list(notListed));
check('страница «В процессе создания» не попала в карту сайта', !sitemap.some((p) => p.endsWith('/in-progress')));

// Страница с noindex в карте сайта — противоречие, на которое ругается Search Console.
const rootHtml = await readFile(join(DIST, 'index.html'), 'utf8');
const rootNoindex = /<meta name="robots" content="noindex/.test(rootHtml);
check('корень закрыт от поиска и поэтому не стоит в карте сайта', rootNoindex && !sitemap.includes('/'),
  `noindex: ${rootNoindex}, в карте: ${sitemap.includes('/')}`);
