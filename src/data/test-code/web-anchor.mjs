// tools/site-test.mjs, раздел «Тестирование».
// На сайте плавная прокрутка, по длинной странице она идёт секунду и больше.
// С «уменьшением движения» сайт прыгает к якорю сразу, это заодно проверяет и его.
const still = await browser.newContext({ viewport: { width: 1366, height: 900 }, reducedMotion: 'reduce' });
const anchorPage = await still.newPage();
await anchorPage.goto(base + '/ru/testing#tc-bgh-03', { waitUntil: 'load' });
await anchorPage.waitForTimeout(300);

const anchored = await anchorPage.evaluate(() => {
  const card = document.getElementById('tc-bgh-03').getBoundingClientRect();
  // Всё липкое сверху: шапка сайта и панель фильтров.
  const covers = [...document.querySelectorAll('.site-header, [data-qa-filters]')]
    .filter((el) => getComputedStyle(el).position === 'sticky')
    .map((el) => el.getBoundingClientRect().bottom);
  return { top: Math.round(card.top), covered: Math.round(Math.max(0, ...covers)) };
});
check('ссылка на кейс прокручивает к нему, а не под шапку и фильтры',
  anchored.top >= anchored.covered && anchored.top < 450, `карточка на ${anchored.top}px, закрыто до ${anchored.covered}px`);
