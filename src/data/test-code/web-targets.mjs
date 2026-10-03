// tools/site-test.mjs, раздел «Размер целей касания (WCAG 2.5.8)».
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
        // Ссылки внутри текста — исключение из критерия, их не считаем.
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
