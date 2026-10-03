// tools/audit.mjs, мобильное меню.
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();
await page.goto(base + '/ru', { waitUntil: 'networkidle' });

ok('меню изначально скрыто', await page.isHidden('[data-menu-panel]'));

await page.click('[data-menu-open]');
await page.waitForTimeout(200);
const opened = await page.isVisible('[data-menu-panel]');
ok('меню открывается', opened);
ok('aria-expanded становится true', (await page.getAttribute('[data-menu-open]', 'aria-expanded')) === 'true');
ok('фон заблокирован от прокрутки', (await page.evaluate(() => document.body.style.overflow)) === 'hidden');

await page.keyboard.press('Escape');
await page.waitForTimeout(200);
ok('Esc закрывает меню', await page.isHidden('[data-menu-panel]'));
ok('прокрутка возвращается', (await page.evaluate(() => document.body.style.overflow)) === '');

if (opened) {
  await page.click('[data-menu-open]');
  await page.waitForTimeout(200);
  await page.click('.mobile-menu__list a');
  await page.waitForLoadState('networkidle');
  ok('переход по ссылке закрывает меню', await page.isHidden('[data-menu-panel]'));
}
