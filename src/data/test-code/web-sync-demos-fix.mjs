// tools/sync-demos.mjs
const DEMOS = [
  {
    slug: 'brandgalleryhome',
    // Было 'brandgalleryhome/design': 16.08 макеты переехали в отдельную папку,
    // и копия, которую заказчица открывает по ссылке, месяц не обновлялась.
    from: 'brandgalleryhomeDesign/design',
    // ...
  },
];

// Конец файла. Раньше пропущенный источник давал только предупреждение
// и код выхода 0, поэтому проверка перед выкладкой его не замечала.
if (missing) {
  console.error(`\nПропущено работ: ${missing}. Их копии на сайте остались от прошлой синхронизации и больше не обновляются.`);
}
if (failed) {
  console.error(`\nНе найдено файлов: ${failed}`);
}
if (missing || failed) process.exit(1);
