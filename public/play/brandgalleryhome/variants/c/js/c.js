/*
  BrandGallery C — «салон-магазин». Логика страниц.

  Планировка построена вокруг каталога: короткая главная, поиск в шапке
  строкой, каталог с постоянно развёрнутой колонкой фильтров и чипами
  активных условий, карточка товара с липким блоком цены и наличия.

  Отличие от BrandGallery A и B в планировке: страницы фабрик не отдельные
  лендинги, а полка марок над каталогом — при выборе марки над сеткой
  разворачивается её описание. Это быстрее наполнять, но слабее работает
  на марочные запросы. Разбор в docs/variants.md.
*/
(function () {
  'use strict';

  var V = window.VLIB, D = V.D;
  var $ = V.$, $$ = V.$$, esc = V.esc, money = V.money, plural = V.plural, ph = V.ph;

  /* Контакты салона — в одном месте: они уходят в шапку, подвал и подвальные
     реквизиты, расходиться между собой не должны. */
  var PHONE = '+7 918 657-50-27';
  var TEL = '+79186575027';
  var EMAIL = 'studia_interior_krd@mail.ru';
  var ADDRESS = 'Краснодар, ул. Бабушкина, 285, 3 этаж, БЦ Full House';
  var ADDRESS_SHORT = 'Краснодар, ул. Бабушкина, 285';
  var HOURS = 'пн–сб 11:00–18:00';
  var HOURS_FULL = 'пн–сб 11:00–18:00, вс выходной';

  var ICONS = {
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M5 7h14l-1.2 13H6.2z"/><path d="M9 7V5.5a3 3 0 0 1 6 0V7"/></svg>',
  };

  var NAV = [
    ['catalog.html', 'Весь каталог'],
    ['catalog.html?stock=in', 'В наличии', 'stock'],
    ['catalog.html?type=divany', 'Диваны'],
    ['catalog.html?room=garderobnye', 'Гардеробные'],
    ['catalog.html?type=stoly', 'Столы и стулья'],
    ['catalog.html?room=kuhni', 'Кухни'],
    ['catalog.html#brands', 'Фабрики'],
    ['#', 'Дизайнерам'],
    ['#', 'Статьи'],
    ['#', 'Контакты'],
  ];

  function chrome() {
    var here = (location.pathname.split('/').pop() || 'index.html') + location.search;

    var head = '<header class="head">' +
      '<div class="head__top"><div class="wrap">' +
        '<span>' + ADDRESS_SHORT + ' · ' + HOURS + '</span>' +
        '<span><a href="request.html?showroom=1">Записаться в шоурум</a>' +
        '<a class="head__mail" href="mailto:' + EMAIL + '">' + EMAIL + '</a>' +
        '<a href="tel:' + TEL + '">' + PHONE + '</a></span>' +
      '</div></div>' +

      '<div class="wrap"><div class="head__row">' +
        '<div class="head__left">' +
          '<button class="burger" id="burger" aria-label="Меню" aria-expanded="false">' +
            '<span></span><span></span><span></span></button>' +
          '<a class="logo" href="index.html"><span class="logo__name">Brand Gallery</span>' +
          '<span class="logo__sub">Итальянская мебель · Краснодар</span></a>' +
        '</div>' +

        /* Поиск строкой в шапке, а не за иконкой: в этом варианте
           это вход номер один на всех страницах. */
        '<div class="qbox">' +
          '<svg class="qbox__ico" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/>' +
          '<path d="M16 16l5 5"/></svg>' +
          '<input type="search" id="q" autocomplete="off" ' +
            'placeholder="Диван, фабрика или артикул">' +
          '<div class="qhits" id="qhits"></div>' +
        '</div>' +

        '<div class="head__right">' +
          '<a class="iconbtn" href="request.html">' + ICONS.bag +
            '<span>Подборка</span><span class="iconbtn__n is-zero" data-count>0</span></a>' +
        '</div>' +
      '</div>' +

      '<nav class="nav" id="nav">' + NAV.map(function (n) {
        var cls = [];
        if (n[0] === here) cls.push('is-on');
        if (n[2] === 'stock') cls.push('is-stock');
        return '<a href="' + n[0] + '"' + (cls.length ? ' class="' + cls.join(' ') + '"' : '') +
          '>' + n[1] + '</a>';
      }).join('') + '</nav>' +
      '</div></header>';

    var rooms = Object.keys(D.ROOMS).slice(0, 6).map(function (k) {
      return '<li><a href="catalog.html?room=' + k + '">' + D.ROOMS[k] + '</a></li>';
    }).join('');

    var marks = Object.keys(D.FACTORIES).slice(0, 6).map(function (n) {
      return '<li><a href="catalog.html?factory=' + encodeURIComponent(n) + '">' + esc(n) + '</a></li>';
    }).join('');

    var foot = '<footer class="foot"><div class="wrap">' +
      '<div class="foot__cols">' +
        '<div><a class="logo" href="index.html"><span class="logo__name">Brand Gallery</span></a>' +
          '<p style="margin-top:14px;max-width:36ch">Салон итальянской мебели премиум-класса. ' +
          'Прямые поставки с фабрик Италии, шоурум в Краснодаре.</p></div>' +
        '<div><h4>По помещению</h4><ul>' + rooms + '</ul></div>' +
        '<div><h4>Фабрики</h4><ul>' + marks + '</ul></div>' +
        '<div><h4>Шоурум в Краснодаре</h4><ul>' +
          '<li>' + ADDRESS + '</li><li>' + HOURS_FULL + '</li>' +
          '<li><a href="tel:' + TEL + '">' + PHONE + '</a></li>' +
          '<li><a href="mailto:' + EMAIL + '">' + EMAIL + '</a></li>' +
          '<li><a href="request.html?showroom=1">Записаться на визит</a></li></ul></div>' +
      '</div>' +
      '<div class="foot__legal">' +
        '<p>ООО «Наименование» · ИНН 0000000000 · ОГРН 0000000000000 · ' + ADDRESS + '</p>' +
        '<p><a href="#">Политика обработки персональных данных</a> · ' +
        '<a href="#">Уведомление об использовании cookie</a></p>' +
        '<p>Информация на сайте не является публичной офертой. Окончательная стоимость, ' +
        'комплектация и срок поставки подтверждаются менеджером салона.</p>' +
      '</div></div></footer>';

    document.body.insertAdjacentHTML('afterbegin', head);
    document.body.insertAdjacentHTML('beforeend', foot);

    var burger = $('#burger'), nav = $('#nav');
    burger.addEventListener('click', function () {
      var on = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', on ? 'true' : 'false');
      document.body.style.overflow = on ? 'hidden' : '';
    });

    V.initSearch({ input: '#q', hits: '#qhits', product: 'product.html' });
    V.paintCount();
  }

  /* ------------------------------------------------------------ карточка */

  function card(p) {
    var inPick = V.picked().indexOf(p.id) !== -1;
    var badge = p.stock === 'order'
      ? '<span class="badge badge--order">Под заказ</span>'
      : '<span class="badge">' + D.STOCK[p.stock] + '</span>';

    return '<article class="card">' +
      '<a class="card__media" href="product.html?id=' + p.id + '">' + badge + ph(p.type, p.id) + '</a>' +
      '<div class="card__body">' +
        '<a class="card__brand" href="catalog.html?factory=' + encodeURIComponent(p.factory) + '">' +
          esc(p.factory) + '</a>' +
        '<a class="card__name" href="product.html?id=' + p.id + '">' + esc(p.name) + '</a>' +
        '<div class="card__lead">' + (p.lead ? 'Срок ' + p.lead : 'Готов к отгрузке') + '</div>' +
        '<div class="card__price">' + (p.price ? money(p.price) : '<em>Цена по запросу</em>') + '</div>' +
        '<button class="card__add' + (inPick ? ' is-in' : '') + '" data-add="' + p.id + '">' +
          (inPick ? 'В подборке' : 'В подборку') + '</button>' +
      '</div></article>';
  }

  /* ------------------------------------------------------------- главная */

  function initHome() {
    var hot = $('#hot');
    if (!hot) return;

    // Восемь позиций, а не четыре: в этом варианте товар должен начинаться
    // сразу и заполнять первый экран прокрутки.
    var inStock = D.products.filter(function (p) { return p.stock !== 'order'; }).slice(0, 8);
    hot.innerHTML = inStock.map(card).join('');
    V.bindAdd(hot);

    $('#rooms').innerHTML = Object.keys(D.ROOMS).map(function (k, i) {
      var n = D.products.filter(function (p) { return p.room === k; }).length;
      if (!n) return '';
      return '<a href="catalog.html?room=' + k + '">' +
        ph(V.ROOM_ART[k] || 'interior', i + 1) +
        '<span>' + D.ROOMS[k] + '<b>' + n + ' ' +
        plural(n, ['позиция', 'позиции', 'позиций']) + '</b></span></a>';
    }).join('');

    $('#brands').innerHTML = Object.keys(D.FACTORIES).map(function (n) {
      var cnt = D.products.filter(function (p) { return p.factory === n; }).length;
      if (!cnt) return '';
      return '<a href="catalog.html?factory=' + encodeURIComponent(n) + '">' + esc(n) +
        '<span>' + cnt + '</span></a>';
    }).join('');

    $('#showroomart').innerHTML = ph('interior', 3);

    var POSTS = [
      ['Как выбрать итальянский диван и не ошибиться с размером', 'Разбор на примерах из зала'],
      ['Сколько на самом деле ждать мебель из Италии', 'Что влияет на срок и как его сократить'],
      ['Чем отличается массив от шпона в мебели премиум-класса', 'Материалы и уход'],
    ];
    $('#posts').innerHTML = POSTS.map(function (a, i) {
      return '<a href="#">' + ph('frame', i + 4) + '<h3>' + a[0] + '</h3>' +
        '<span>' + a[1] + '</span></a>';
    }).join('');
  }

  /* ------------------------------------------------------------- каталог */

  function initCatalog() {
    if (!$('#grid')) return;

    V.catalog({
      grid: '#grid', filters: '#filters', found: '#found',
      title: '#ctitle', crumbs: '#ccrumbs', sort: '#sort', chips: '#chips',
      open: '#fopen', close: '#fclose',
      card: card,
      after: paintBrands,
    });

    /* Полка марок и есть «страница фабрики» этого варианта: выбрана одна
       марка — над сеткой разворачивается её описание и счётчик наличия. */
    function paintBrands(state, api) {
      var bar = $('#brandbar');
      if (!bar) return;

      var names = Object.keys(D.FACTORIES).filter(function (n) {
        return D.products.some(function (p) { return p.factory === n; });
      });

      bar.innerHTML = names.map(function (n) {
        var cnt = D.products.filter(function (p) { return p.factory === n; }).length;
        return '<a href="catalog.html?factory=' + encodeURIComponent(n) + '"' +
          (state.factory.indexOf(n) !== -1 ? ' class="is-on"' : '') +
          ' data-mark="' + esc(n) + '">' + esc(n) + '<span>' + cnt + '</span></a>';
      }).join('');

      $$('[data-mark]', bar).forEach(function (a) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          var n = a.dataset.mark;
          state.factory = state.factory.indexOf(n) !== -1 ? [] : [n];
          api.render();
        });
      });

      var box = $('#brandcard');
      var one = state.factory.length === 1 ? state.factory[0] : '';
      box.classList.toggle('is-on', !!one);
      if (!one) { box.innerHTML = ''; return; }

      var f = D.FACTORIES[one] || { country: '', text: '' };
      var all = D.products.filter(function (p) { return p.factory === one; });
      var inS = all.filter(function (p) { return p.stock !== 'order'; }).length;

      box.innerHTML = ph('frame', 2) +
        '<div><h2>' + esc(one) + '</h2><p>' + esc(f.country) + ' · ' + esc(f.text) + '</p></div>' +
        '<div class="brandcard__n"><b>' + inS + '</b>в наличии из ' + all.length + '</div>';
    }
  }

  /* -------------------------------------------------------- карточка товара */

  function initProduct() {
    var box = $('#product');
    if (!box) return;

    var id = Number(new URLSearchParams(location.search).get('id')) || 1;
    var p = V.byId(id) || D.products[0];
    var inPick = V.picked().indexOf(p.id) !== -1;

    document.title = p.name + ', ' + p.factory + ' — Brand Gallery, Краснодар';

    $('#pcrumbs').innerHTML = '<a href="index.html">Главная</a><span>·</span>' +
      '<a href="catalog.html">Каталог</a><span>·</span>' +
      '<a href="catalog.html?room=' + p.room + '">' + D.ROOMS[p.room] + '</a>' +
      '<span>·</span>' + esc(p.name);

    box.innerHTML =
      '<div class="prod__gal">' +
        '<div class="prod__thumbs">' + [0, 1, 2, 3].map(function (i) {
          return ph(i === 0 ? p.type : 'frame', p.id + i, i === 0 ? 'is-on' : '');
        }).join('') + '</div>' +
        '<div class="prod__main" id="galmain">' + ph(p.type, p.id) + '</div>' +
      '</div>' +

      /* Липкий блок покупки: цена, наличие и срок остаются на экране,
         пока человек листает характеристики. */
      '<div class="buy">' +
        '<a class="buy__brand" href="catalog.html?factory=' + encodeURIComponent(p.factory) + '">' +
          esc(p.factory) + ' · ' + esc(p.country) + '</a>' +
        '<h1>' + esc(p.name) + '</h1>' +
        '<div class="buy__price">' + (p.price ? money(p.price) : '<em>Цена по запросу</em>') + '</div>' +
        '<div class="buy__stock' + (p.stock === 'order' ? ' is-order' : '') + '">' +
          D.STOCK[p.stock] + '</div>' +
        '<div class="buy__facts">' +
          '<div><b>Срок поставки</b><span>' + (p.lead || 'Готов к отгрузке') + '</span></div>' +
          '<div><b>Отделка</b><span>' + esc(p.material) + '</span></div>' +
          '<div><b>Цвет</b><span>' + esc(p.color) + '</span></div>' +
          '<div><b>Размеры, см</b><span>' + esc(p.size) + '</span></div>' +
          '<div><b>Артикул</b><span>' + esc(p.sku) + '</span></div>' +
        '</div>' +
        '<div class="btn-row">' +
          '<button class="btn btn--solid" data-add="' + p.id + '">' +
            (inPick ? 'Уже в подборке' : 'Добавить в подборку') + '</button>' +
          '<a class="btn" href="request.html?showroom=1">Посмотреть в шоуруме</a>' +
        '</div>' +
        '<p class="buy__note">Информация о товаре не является публичной офертой. ' +
        'Цена, комплектация и срок производства подтверждаются менеджером салона.</p>' +
      '</div>';

    V.bindAdd(box, ['Добавить в подборку', 'Уже в подборке']);

    var main = $('#galmain');
    $$('.prod__thumbs .ph').forEach(function (t) {
      t.addEventListener('click', function () {
        $$('.prod__thumbs .ph').forEach(function (x) { x.classList.remove('is-on'); });
        t.classList.add('is-on');
        main.innerHTML = '<div class="' + t.className.replace('is-on', '').trim() + '">' +
          t.innerHTML + '</div>';
      });
    });

    $('#specs').innerHTML =
      '<h2 class="t-h2" style="margin-bottom:14px">Характеристики</h2>' +
      '<table class="specs">' +
        row('Артикул', p.sku) + row('Фабрика', p.factory) + row('Страна', p.country) +
        row('Тип мебели', D.TYPES[p.type]) + row('Материал', p.material) +
        row('Цвет', p.color) + row('Размеры, см', p.size) + row('Стиль', p.style) +
      '</table>' +
      '<h2 class="t-h2" style="margin:30px 0 10px">Описание</h2>' +
      '<p class="muted">Пишется под каждую позицию человеческим языком: для кого эта вещь, ' +
      'как ей пользуются, в какой отделке берут чаще. Копия с сайта фабрики даст ' +
      'поисковый дубль и понизит страницу в выдаче.</p>';

    /* Похожее в наличии — этот вариант всегда предлагает то, что можно
       забрать сейчас: ловит тех, кто не готов ждать поставку. */
    var same = D.products.filter(function (x) {
      return x.id !== p.id && x.type === p.type && x.stock !== 'order';
    }).slice(0, 4);

    if (same.length) {
      $('#similar').innerHTML =
        '<div class="sect__head"><h2 class="t-h2">' +
        (p.stock === 'order' ? 'Похожее в наличии' : 'Смотрят вместе с этим') + '</h2>' +
        '<a class="linkline" href="catalog.html?stock=in&type=' + p.type + '">' +
        'Весь раздел в наличии</a></div>' +
        '<div class="grid grid--4">' + same.map(card).join('') + '</div>';
      V.bindAdd($('#similar'));
    }
  }

  function row(k, v) {
    return '<tr><td>' + esc(k) + '</td><td>' + esc(v) + '</td></tr>';
  }

  /* --------------------------------------------------------------- старт */

  chrome();
  initHome();
  initCatalog();
  initProduct();
  V.request({ picked: '#picked', sum: '#sum', form: '#reqform', sent: '#sent' });
  V.reveal();
  V.switcher('C');
})();
