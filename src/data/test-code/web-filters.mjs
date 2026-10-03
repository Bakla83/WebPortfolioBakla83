// tools/site-test.mjs, раздел «Тестирование».
await page.goto(base + '/ru/testing', { waitUntil: 'networkidle' });

const total = await page.locator('[data-test-case]').count();
const shown = () => page.textContent('[data-qa-shown]').then(Number);
const visibleCards = () => page.locator('[data-test-case]:visible').count();

await page.click('[data-filter="project"][data-value="thl"]');
await page.click('[data-filter="kind"][data-value="manual"]');
const thlManual = await visibleCards();
// Сверяем то, что видно глазу, со счётчиком: счётчик считал верно, а карточки не прятались.
check('фильтр «игра + ручные» оставляет только ручные кейсы игры',
  thlManual > 0 && thlManual === (await shown()) && (await page.locator('[data-qa-project="bgh"]').isHidden()),
  `видно ${thlManual}`);
check('у ручных кейсов нет пометки «Автотест»',
  (await page.locator('[data-test-case]:visible[data-kind="auto"]').count()) === 0);

await page.click('[data-filter="project"][data-value="bgh"]');
check('пустой фильтр показывает подсказку и счётчик 0',
  (await shown()) === 0 && (await page.isVisible('[data-qa-project="bgh"] [data-qa-empty]')));

await page.click('[data-filter="project"][data-value="all"]');
await page.click('[data-filter="kind"][data-value="all"]');
check('сброс фильтров возвращает все карточки', (await visibleCards()) === total && (await shown()) === total);

// Без JavaScript фильтры бесполезны: их нет, а карточки видны все.
const noJs = await browser.newContext({ javaScriptEnabled: false });
const plain = await noJs.newPage();
await plain.goto(base + '/en/testing');
check('без JavaScript видны все карточки, а фильтры спрятаны',
  (await plain.locator('[data-test-case]:visible').count()) === total && (await plain.isHidden('[data-qa-filters]')));
