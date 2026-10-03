// tools/site-test.mjs, раздел «Узкие экраны», для каждой ширины 320, 360 и 390.
// Текст может вылезти из своего блока поверх соседей, а страница шире экрана
// при этом не станет. Проверка на горизонтальную прокрутку такое пропускает.
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
