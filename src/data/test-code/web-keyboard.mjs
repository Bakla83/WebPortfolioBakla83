// tools/site-test.mjs, раздел «Клавиатура».
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
