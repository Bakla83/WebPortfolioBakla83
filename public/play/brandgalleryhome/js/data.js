window.DEMO = (function () {
  'use strict';

  const P = [

    ['Диван Gatsby', 'CAVIO CASA', 'gostinaya', 'divany', 290000, 'krasnodar', '', 'ткань, велюр', 'песочный', 'классический', '320 × 105 × 68'],
    ['Диван Sidney', 'Giorgio Casa', 'gostinaya', 'divany', 320000, 'moscow', '', 'кожа', 'графитовый', 'современный', '280 × 98 × 72'],
    ['Диван Benedetta', 'CAVIO CASA', 'gostinaya', 'divany', null, 'order', '10–12 недель', 'ткань', 'на выбор', 'классический', '300 × 100 × 70'],
    ['Банкетка Verona', 'CAVIO CASA', 'gostinaya', 'divany', 145000, 'krasnodar', '', 'велюр', 'изумрудный', 'классический', '120 × 45 × 48'],
    ['Буфет Rimini', 'CAVIO CASA', 'gostinaya', 'shkafy', 240000, 'moscow', '', 'массив ореха', 'орех', 'классический', '190 × 52 × 105'],
    ['Витрина Gatsby', 'CAVIO CASA', 'gostinaya', 'shkafy', null, 'order', '12–14 недель', 'массив, стекло', 'на выбор', 'классический', '110 × 45 × 200'],
    ['Буфет Chelsea', 'Giorgio Casa', 'gostinaya', 'shkafy', 275000, 'moscow', '', 'массив дуба', 'дуб', 'современный', '200 × 50 × 90'],
    ['Журнальный стол Sidney', 'Giorgio Casa', 'gostinaya', 'stoly', 210000, 'krasnodar', '', 'стекло, металл', 'бронза', 'современный', '120 × 70 × 40'],
    ['Буфет-бар Benedetta', 'CAVIO CASA', 'gostinaya', 'shkafy', null, 'order', '10–12 недель', 'массив, зеркало', 'на выбор', 'классический', '140 × 48 × 190'],

    ['Спальный гарнитур Nostalgia', 'CAVIO CASA', 'spalnya', 'krovati', 360000, 'moscow', '', 'массив ясеня', 'слоновая кость', 'классический', '—'],
    ['Спальный гарнитур Torriani', 'Giorgio Casa', 'spalnya', 'krovati', null, 'order', '14–16 недель', 'массив', 'на выбор', 'классический', '—'],
    ['Спальный гарнитур Verdi', 'CAVIO CASA', 'spalnya', 'krovati', 390000, 'moscow', '', 'массив, шпон', 'орех', 'классический', '—'],
    ['Кровать Sidney', 'Giorgio Casa', 'spalnya', 'krovati', 260000, 'krasnodar', '', 'кожа', 'песочный', 'современный', '180 × 200'],
    ['Кровать Casa dei Sogni', 'Giorgio Casa', 'spalnya', 'krovati', null, 'order', '12–14 недель', 'ткань', 'на выбор', 'современный', '160 × 200'],

    ['Стол Infinity Round', 'Giorgio Collection', 'stolovaya', 'stoly', 340000, 'moscow', '', 'шпон, лак', 'графитовый', 'современный', 'Ø 150 × 75'],
    ['Стол Mirage Round Marble Top', 'Giorgio Collection', 'stolovaya', 'stoly', null, 'order', '10–12 недель', 'мрамор, металл', 'на выбор', 'современный', 'Ø 140 × 75'],
    ['Стол Mirage', 'Giorgio Collection', 'stolovaya', 'stoly', 310000, 'moscow', '', 'мрамор, металл', 'белый', 'современный', '220 × 110 × 75'],
    ['Барный стул Noli', 'Fratelli Barri', 'stolovaya', 'stulya', 86000, 'krasnodar', '', 'велюр, латунь', 'изумрудный', 'современный', '45 × 45 × 105'],
    ['Стул Fratelli Barri', 'Fratelli Barri', 'stolovaya', 'stulya', 74000, 'krasnodar', '', 'велюр', 'песочный', 'классический', '50 × 55 × 95'],

    ['Кухня Castagna Cucine', 'Castagna Cucine', 'kuhni', 'kuhni', null, 'order', '14–18 недель', 'массив, лак', 'на выбор', 'классический', 'по проекту'],
    ['Кухня Aster Cucine Avenue 10', 'Aster Cucine', 'kuhni', 'kuhni', null, 'order', '16–20 недель', 'шпон, стекло', 'на выбор', 'современный', 'по проекту'],
    ['Кухня Arcari Solferino Luxury', 'Arcari', 'kuhni', 'kuhni', null, 'order', '16–20 недель', 'массив', 'на выбор', 'классический', 'по проекту'],
    ['Кухня Binova Scava', 'Binova', 'kuhni', 'kuhni', null, 'order', '14–16 недель', 'лак, камень', 'на выбор', 'современный', 'по проекту'],

    ['Гардеробная система Open', 'Giorgio Collection', 'garderobnye', 'shkafy', null, 'order', '12–14 недель', 'алюминий, стекло', 'на выбор', 'современный', 'по проекту'],

    ['Кресло Tuka', 'Fratelli Barri', 'kabinet', 'kresla', 168000, 'krasnodar', '', 'кожа', 'коньячный', 'современный', '70 × 75 × 105'],
    ['Кресло Academia', 'Fratelli Barri', 'kabinet', 'kresla', 195000, 'moscow', '', 'кожа, дерево', 'графитовый', 'классический', '72 × 78 × 110'],

    ['Светильник подвесной Ohay', 'Giorgio Collection', 'svet', 'svet', 128000, 'krasnodar', '', 'латунь, стекло', 'латунь', 'современный', 'Ø 60'],
    ['Светильник подвесной Alladin', 'Giorgio Collection', 'svet', 'svet', null, 'order', '8–10 недель', 'хрусталь, латунь', 'на выбор', 'классический', 'Ø 80'],
    ['Настольная лампа Valentina', 'CAVIO CASA', 'svet', 'svet', 62000, 'krasnodar', '', 'керамика, ткань', 'слоновая кость', 'классический', '35 × 55'],

    ['Baccarat, ваза Eye', 'Baccarat', 'aksessuary', 'aksessuary', 118000, 'krasnodar', '', 'хрусталь', 'прозрачный', 'современный', '25 × 25 × 30'],
    ['Набор из 4 бокалов Château Baccarat', 'Baccarat', 'aksessuary', 'aksessuary', 96000, 'krasnodar', '', 'хрусталь', 'прозрачный', 'классический', '—'],

    ['Пуф Adley Pouf', 'Fratelli Barri', 'prihozhaya', 'kresla', 54000, 'krasnodar', '', 'велюр', 'песочный', 'современный', '60 × 60 × 42'],

    ['Детская кроватка 3783', 'CAVIO CASA', 'detskaya', 'krovati', null, 'order', '10–12 недель', 'массив', 'на выбор', 'классический', '70 × 140'],

    ['Уличный шезлонг The Secret Garden', 'Giorgio Collection', 'ulichnaya', 'kresla', 240000, 'moscow', '', 'тик, ткань', 'натуральный', 'современный', '200 × 70 × 40'],

    ['Стиральная машина Miele WWD120', 'Miele', 'tehnika', 'tehnika', 185000, 'krasnodar', '', '—', 'белый', '—', '60 × 63 × 85'],
    ['Пылесос Miele 41GDA300RU', 'Miele', 'tehnika', 'tehnika', 78000, 'krasnodar', '', '—', 'белый', '—', '—'],
    ['Стайлер для одежды V-ZUG RefreshButler', 'V-ZUG', 'tehnika', 'tehnika', null, 'order', '8–10 недель', '—', 'на выбор', '—', '60 × 60 × 190'],
  ];

  const products = P.map(function (r, i) {
    return {
      id: i + 1,
      slug: 'p' + (i + 1),
      name: r[0],
      factory: r[1],
      room: r[2],
      type: r[3],
      price: r[4],
      stock: r[5],
      lead: r[6],
      material: r[7],
      color: r[8],
      style: r[9],
      size: r[10],
      sku: 'BGH-' + String(1000 + i * 7),
      country: r[1] === 'Miele' ? 'Германия' : (r[1] === 'V-ZUG' ? 'Швейцария' : (r[1] === 'Baccarat' ? 'Франция' : 'Италия')),
    };
  });

  const ROOMS = {
    gostinaya: 'Гостиная', spalnya: 'Спальня', stolovaya: 'Столовая',
    kuhni: 'Кухни', garderobnye: 'Гардеробные', kabinet: 'Кабинет',
    detskaya: 'Детская', prihozhaya: 'Прихожая', svet: 'Свет',
    aksessuary: 'Аксессуары', ulichnaya: 'Уличная мебель', tehnika: 'Техника',
  };

  const TYPES = {
    divany: 'Диваны', kresla: 'Кресла и пуфы', stoly: 'Столы',
    stulya: 'Стулья', krovati: 'Кровати', shkafy: 'Шкафы и буфеты',
    kuhni: 'Кухни', svet: 'Свет', aksessuary: 'Аксессуары',
    tehnika: 'Техника',
  };

  const STOCK = {
    krasnodar: 'В наличии, Краснодар',
    moscow: 'На складе в Москве',
    order: 'Под заказ',
  };

  const FACTORIES = {
    'CAVIO CASA': { country: 'Италия', text: 'Семейная мануфактура из Венето. Классическая мебель из массива с ручной резьбой и патинированием. Работают с 1970-х годов.' },
    'Giorgio Collection': { country: 'Италия', text: 'Милан. Современная роскошь: шпон корня, лак высокого глянца, латунь. Один из самых узнаваемых итальянских брендов в сегменте.' },
    'Giorgio Casa': { country: 'Италия', text: 'Классические спальни и гостиные из массива. Известны сочетанием традиционных форм со сдержанной отделкой.' },
    'Castagna Cucine': { country: 'Италия', text: 'Кухни ручной сборки из массива. Каждый проект рассчитывается индивидуально.' },
    'Aster Cucine': { country: 'Италия', text: 'Современные кухни, известны системами хранения и работой с натуральным камнем.' },
    'Arcari': { country: 'Италия', text: 'Кухни в классическом стиле, массив и ручная отделка.' },
    'Binova': { country: 'Италия', text: 'Кухни с минималистичной геометрией, лак и натуральный камень.' },
    'Fratelli Barri': { country: 'Италия', text: 'Мягкая мебель и стулья. Велюр, латунь, узнаваемая цветовая палитра.' },
    'Baccarat': { country: 'Франция', text: 'Хрусталь ручной работы с 1764 года. Вазы, бокалы, предметы интерьера.' },
    'Miele': { country: 'Германия', text: 'Встраиваемая и отдельностоящая техника премиум-класса.' },
    'V-ZUG': { country: 'Швейцария', text: 'Швейцарская бытовая техника премиум-сегмента.' },
  };

  return { products: products, ROOMS: ROOMS, TYPES: TYPES, STOCK: STOCK, FACTORIES: FACTORIES };
})();
