/*
  BrandGallery D — вариант, который я советую собрать.

  Это вариант A целиком: те же стили (css/site.css) и тот же скрипт
  (js/site.js). Сверху добавлены две вещи, взятые у соседей:

    1. Лента фабрик на главной — из варианта B. В A на страницы фабрик
       вела сетка логотипов внизу страницы, и на неё почти не нажимали.
    2. Липкий блок цены в карточке товара — из варианта C. Пока человек
       читает описание и характеристики, цена, наличие и кнопки остаются
       на экране.

  Третье заимствование — плотный каталог — сделано без скрипта, классом
  grid--4 прямо в catalog.html.

  Файл маленький намеренно: всё остальное берётся из site.js, и общая
  правка приходит в D сама. Скрипт подключён после site.js, поэтому
  разметка страницы к этому моменту уже построена.
*/
(function () {
  'use strict';

  var D = window.DEMO;
  var S = window.SITE;
  if (!D || !S) return;

  /* ------------------------------------------------------ лента фабрик */

  function initStrips() {
    var box = document.getElementById('fstrips');
    if (!box) return;

    // Фабрики без единой позиции в ленту не попадают: полоса с пустой
    // строкой товаров выглядит хуже, чем отсутствие полосы.
    var names = Object.keys(D.FACTORIES).filter(function (n) {
      return D.products.some(function (p) { return p.factory === n; });
    });

    box.innerHTML = names.map(function (n) {
      var all = D.products.filter(function (p) { return p.factory === n; });
      var inStock = all.filter(function (p) { return p.stock !== 'order'; });

      return '<div class="fstrip reveal">' +
        '<div class="fstrip__txt">' +
          '<span class="eyebrow">' + S.esc(D.FACTORIES[n].country) + '</span>' +
          '<h3 class="fstrip__name"><a href="factory.html?f=' +
            encodeURIComponent(n) + '">' + S.esc(n) + '</a></h3>' +
          '<p class="fstrip__text">' + S.esc(D.FACTORIES[n].text) + '</p>' +
          '<div class="fstrip__meta">' +
            '<span>' + all.length + ' ' +
              S.plural(all.length, ['позиция', 'позиции', 'позиций']) + '</span>' +
            (inStock.length
              ? '<b>' + inStock.length + ' в наличии</b>'
              : '<span>под заказ</span>') +
          '</div>' +
        '</div>' +
        '<div class="fstrip__row">' + all.slice(0, 3).map(function (p) {
          return '<a href="product.html?id=' + p.id + '">' +
            S.ph(p.type, p.id) +
            '<span class="fstrip__cap">' + S.esc(p.name) + '</span></a>';
        }).join('') + '</div>' +
        '</div>';
    }).join('');

    /* site.js развешивает появление один раз при старте, а лента добавлена
       уже после него — поэтому показываем её сами. */
    var items = Array.prototype.slice.call(box.querySelectorAll('.reveal'));
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (rows) {
      rows.forEach(function (r) {
        if (r.isIntersecting) { r.target.classList.add('is-in'); io.unobserve(r.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------- липкий блок цены в товаре */

  /*
    Карточку рисует site.js, поэтому обёртку добавляем после него: цена,
    наличие, короткие ответы и кнопки собираются в один блок, который
    остаётся на экране, пока человек читает описание и характеристики.

    В варианте A липкой была вся правая колонка целиком, а толку от этого
    нет: она и есть самая длинная часть страницы, и прилипать ей некуда.
  */
  function initBuy() {
    var side = document.querySelector('.prod__side');
    if (!side) return;

    var price = side.querySelector('.prod__price');
    if (!price) return;

    // Собираем всё от цены до первого длинного блока: наличие, короткие
    // ответы, кнопки. Границу задаёт разметка, а не счёт элементов, —
    // добавится строка, и блок подхватит её сам.
    var parts = [price];
    var node = price.nextElementSibling;
    while (node && !node.classList.contains('prod__block')) {
      parts.push(node);
      node = node.nextElementSibling;
    }

    var buy = document.createElement('div');
    buy.className = 'dbuy';
    price.before(buy);
    parts.forEach(function (el) { buy.append(el); });

    /* Черта под блоком нужна только когда он реально прилип: в обычном
       положении она бы делила карточку пополам без причины. Ловим момент
       так: наблюдаем за блоком, отступив сверху ровно на высоту прилипания,
       и как только он перестал помещаться целиком — он прилип. */
    if (!('IntersectionObserver' in window)) return;
    var top = parseInt(getComputedStyle(buy).top, 10) || 0;
    new IntersectionObserver(function (rows) {
      buy.classList.toggle('is-stuck', rows[0].intersectionRatio < 1);
    }, { threshold: [1], rootMargin: -(top + 1) + 'px 0px 0px 0px' }).observe(buy);
  }

  initStrips();
  initBuy();
})();
