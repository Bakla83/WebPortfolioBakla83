// tools/site-test.mjs, раздел «Узкие экраны (WCAG 1.4.10)».
// Аудит смотрит сайт на ширине ноутбука, поэтому вылет на телефоне он не видит.
for (const width of [320, 360, 390]) {
  const ctx = await browser.newContext({ viewport: { width, height: 800 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const wide = [];

  for (const path of pages) {
    await page.goto(base + path, { waitUntil: 'domcontentloaded' });
    const overflow = await page.evaluate(() => {
      const extra = document.documentElement.scrollWidth - window.innerWidth;
      if (extra <= 0) return null;

      // Называем виновника, чтобы не искать его руками в DevTools.
      const culprit = [...document.querySelectorAll('body *')].find((el) => el.getBoundingClientRect().right > window.innerWidth + 1);
      return `${extra}px, ${culprit ? culprit.tagName.toLowerCase() + '.' + [...culprit.classList].join('.') : '?'}`;
    });
    if (overflow) wide.push(`${path}: ${overflow}`);
  }

  check(`${width}px: страницы без горизонтальной прокрутки`, !wide.length, list(wide));
  await ctx.close();
}
