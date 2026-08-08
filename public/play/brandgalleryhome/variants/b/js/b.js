/*
  BrandGallery B — «дом фабрик». Логика страниц.

  Планировка отличается от BrandGallery A принципиально: главный вход —
  не помещение, а марка. Главная это лента фабрик, каталог фильтруется
  прежде всего лентой марок над сеткой, у каждой фабрики полноценный
  разворот с историей и цифрами.

  Фильтры, поиск и подборка берутся из общего слоя (../js/vlib.js):
  функциональность у всех трёх вариантов одинаковая, различается только
  оформление и порядок.
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

  /* «Фабрики» стоит первым и выделен: в этом варианте это главный раздел,
     а не сноска в конце меню. */
  var NAV = [
    ['factory.html', 'Фабрики', true],
    ['catalog.html', 'Каталог'],
    ['catalog.html?stock=in', 'В наличии'],
    ['#', 'Дизайнерам'],
    ['#', 'О салоне'],
    ['#', 'Статьи'],
    ['#', 'Контакты'],
  ];

  function logo() {
    return '<a class="logo" href="index.html">' +
      '<span class="logo__name">Brand Gallery</span>' +
      '<span class="logo__sub">Итальянская мебель · Краснодар</span></a>';
  }

  function chrome() {
    var here = location.pathname.split('/').pop() || 'index.html';

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
          '<button class="iconbtn" id="qopen" aria-label="Поиск по сайту">' +
            ICONS.search + '<span>Поиск</span></button>' +
        '</div>' +
        logo() +
        '<div class="head__right">' +
          '<a class="iconbtn" href="request.html">' + ICONS.bag +
            '<span>Подборка</span><span class="iconbtn__n is-zero" data-count>0</span></a>' +
        '</div>' +
      '</div></div>' +

      '<nav class="nav" id="nav">' + NAV.map(function (n) {
        var on = n[0] === here;
        return '<a href="' + n[0] + '"' +
          (on ? ' class="is-on"' : (n[2] ? ' class="is-key"' : '')) + '>' + n[1] + '</a>';
      }).join('') + '</nav>' +

      '<div class="searchpanel" id="qpanel"><div class="wrap"><div class="searchpanel__in">' +
        '<input type="search" id="q" autocomplete="off" placeholder="Название, фабрика или артикул">' +
        '<div class="qhits" id="qhits"></div>' +
      '</div></div></div>' +
      '</header>';

    var marks = Object.keys(D.FACTORIES).slice(0, 6).map(function (n) {
      return '<li><a href="factory.html?f=' + encodeURIComponent(n) + '">' + esc(n) + '</a></li>';
    }).join('');

    var rooms = Object.keys(D.ROOMS).slice(0, 6).map(function (k) {
      return '<li><a href="catalog.html?room=' + k + '">' + D.ROOMS[k] + '</a></li>';
    }).join('');

    var foot = '<footer class="foot"><div class="wrap">' +
      '<div class="foot__cols">' +
        '<div>' + logo() +
          '<p style="margin-top:18px;max-width:34ch">Салон итальянской мебели ' +
          'премиум-класса. Прямые поставки с фабрик Италии, шоурум в Краснодаре.</p></div>' +
        '<div><h4>Фабрики</h4><ul>' + marks +
          '<li><a href="factory.html">Все фабрики</a></li></ul></div>' +
        '<div><h4>По помещению</h4><ul>' + rooms + '</ul></div>' +
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
      '</div>' +
      '</div></footer>';

    document.body.insertAdjacentHTML('afterbegin', head);
    document.body.insertAdjacentHTML('beforeend', foot);

    var burger = $('#burger'), nav = $('#nav');
    burger.addEventListener('click', function () {
      var on = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', on ? 'true' : 'false');
      document.body.style.overflow = on ? 'hidden' : '';
    });

    V.initSearch({ open: '#qopen', panel: '#qpanel', input: '#q', hits: '#qhits', product: 'product.html' });
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
      '<div class="card__brand"><a href="factory.html?f=' + encodeURIComponent(p.factory) + '">' +
        esc(p.factory) + '</a></div>' +
      '<a class="card__name" href="product.html?id=' + p.id + '">' + esc(p.name) + '</a>' +
      '<div class="card__lead">' + (p.lead ? 'Срок ' + p.lead : 'Готов к отгрузке') + '</div>' +
      '<div class="card__price">' + (p.price ? money(p.price) : '<em>Ещё нет цены</em>') + '</div>' +
      '<button class="card__add' + (inPick ? ' is-in' : '') + '" data-add="' + p.id + '">' +
        (inPick ? 'В подборке' : 'В подборку') + '</button>' +
      '</article>';
  }

  /* ------------------------------------------------------------- главная */

  function initHome() {
    var box = $('#fstrips');
    if (!box) return;

    /* Первый экран: шесть марок сразу, без фотографий и без цен.
       Сообщение «мы возим именно это» должно прочитаться раньше витрины. */
    $('#manifestmarks').innerHTML = Object.keys(D.FACTORIES).slice(0, 6).map(function (n) {
      return '<a href="factory.html?f=' + encodeURIComponent(n) + '">' + esc(n) +
        '<span>' + esc(D.FACTORIES[n].country) + '</span></a>';
    }).join('');

    /* Лента фабрик. Каждая марка — отдельная полоса: имя, рассказ,
       наличие и три позиции. Это одновременно и навигация, и то, ради чего
       человек пришёл по запросу с названием марки. */
    var names = Object.keys(D.FACTORIES).filter(function (n) {
      return D.products.some(function (p) { return p.factory === n; });
    });

    box.innerHTML = names.map(function (n, i) {
      var all = D.products.filter(function (p) { return p.factory === n; });
      var inS = all.filter(function (p) { return p.stock !== 'order'; });
      var show = all.slice(0, 3);

      return '<div class="fstrip reveal">' +
        '<div>' +
          '<span class="eyebrow">' + esc(D.FACTORIES[n].country) + '</span>' +
          '<h3 class="fstrip__name"><a href="factory.html?f=' + encodeURIComponent(n) + '">' +
            esc(n) + '</a></h3>' +
          '<p class="fstrip__text">' + esc(D.FACTORIES[n].text) + '</p>' +
          '<div class="fstrip__meta">' +
            '<span>' + all.length + ' ' + plural(all.length, ['позиция', 'позиции', 'позиций']) + '</span>' +
            (inS.length ? '<b>' + inS.length + ' в наличии</b>' : '<span>под заказ</span>') +
          '</div>' +
        '</div>' +
        '<div class="fstrip__row">' + show.map(function (p) {
          return '<a href="product.html?id=' + p.id + '">' + ph(p.type, p.id) +
            '<span>' + esc(p.name) + '</span></a>';
        }).join('') + '</div>' +
        '</div>';
    }).join('');

    var inStock = D.products.filter(function (p) { return p.stock !== 'order'; }).slice(0, 4);
    $('#hot').innerHTML = inStock.map(card).join('');
    V.bindAdd($('#hot'));

    $('#rooms').innerHTML = Object.keys(D.ROOMS).map(function (k) {
      var n = D.products.filter(function (p) { return p.room === k; }).length;
      if (!n) return '';
      return '<a href="catalog.html?room=' + k + '">' + D.ROOMS[k] + '<span>' + n + '</span></a>';
    }).join('');

    $('#showroomart').innerHTML = ph('interior', 3);
  }

  /* ------------------------------------------------------------- каталог */

  function initCatalog() {
    if (!$('#grid')) return;

    var fbtn = $('#fopen'), fbox = $('#filters');

    V.catalog({
      grid: '#grid', filters: '#filters', found: '#found',
      title: '#ctitle', crumbs: '#ccrumbs', sort: '#sort',
      card: card,
      after: paintMarks,
    });

    /* Лента марок над сеткой — главный фильтр этого варианта.
       Ссылки настоящие: страница фабрики в каталоге должна открываться
       и по прямому адресу, это марочный поисковый трафик. */
    function paintMarks(state, api) {
      var box = $('#marks');
      if (!box) return;

      var names = Object.keys(D.FACTORIES).filter(function (n) {
        return D.products.some(function (p) { return p.factory === n; });
      });

      box.innerHTML = '<a href="catalog.html"' +
        (state.factory.length ? '' : ' class="is-on"') + ' data-mark="">Все марки</a>' +
        names.map(function (n) {
          var cnt = D.products.filter(function (p) { return p.factory === n; }).length;
          return '<a href="catalog.html?factory=' + encodeURIComponent(n) + '"' +
            (state.factory.indexOf(n) !== -1 ? ' class="is-on"' : '') +
            ' data-mark="' + esc(n) + '">' + esc(n) + '<span>' + cnt + '</span></a>';
        }).join('');

      $$('[data-mark]', box).forEach(function (a) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          var n = a.dataset.mark;
          state.factory = !n || state.factory.indexOf(n) !== -1 ? [] : [n];
          api.render();
        });
      });
    }

    /* Фильтры раскрываются строкой на всю ширину, на телефоне — панелью
       на весь экран. Кнопка одна и та же. */
    fbtn.addEventListener('click', function () {
      var on = fbox.classList.toggle('is-shown');
      fbtn.textContent = on ? 'Скрыть фильтры' : 'Фильтры';
      if (window.matchMedia('(max-width: 760px)').matches) {
        fbox.classList.toggle('is-open', on);
        document.body.style.overflow = on ? 'hidden' : '';
      }
    });

    $('#fclose').addEventListener('click', function () {
      fbox.classList.remove('is-open');
      fbox.classList.remove('is-shown');
      fbtn.textContent = 'Фильтры';
      document.body.style.overflow = '';
    });
  }

  /* ------------------------------------------------------------- фабрика */

  function initFactory() {
    var box = $('#factory');
    if (!box) return;

    var name = new URLSearchParams(location.search).get('f');
    var names = Object.keys(D.FACTORIES);

    if (!name) {
      box.innerHTML =
        '<div class="fab__cover"><div class="wrap" style="grid-template-columns:1fr">' +
          '<div><span class="eyebrow eyebrow--dark">Прямые поставки</span>' +
          '<h1 class="fab__title">Фабрики</h1>' +
          '<p class="fab__text">За фабриками приходят по имени: человек знает марку ' +
          'и ищет её вместе с городом. У каждой — своя страница с историей, стилем ' +
          'и тем, что есть в наличии.</p></div>' +
        '</div></div>' +
        '<div class="wrap" style="padding-top:60px;padding-bottom:90px">' +
        '<div class="fab__list">' + names.map(function (n) {
          var cnt = D.products.filter(function (p) { return p.factory === n; }).length;
          var inS = D.products.filter(function (p) { return p.factory === n && p.stock !== 'order'; }).length;
          return '<a href="factory.html?f=' + encodeURIComponent(n) + '">' +
            '<b>' + esc(n) + '</b><span>' + esc(D.FACTORIES[n].country) + ' · ' + cnt + ' ' +
            plural(cnt, ['позиция', 'позиции', 'позиций']) +
            (inS ? ' · ' + inS + ' в наличии' : '') + '</span></a>';
        }).join('') + '</div></div>';
      return;
    }

    var f = D.FACTORIES[name] || { country: '', text: '' };
    var all = D.products.filter(function (p) { return p.factory === name; });
    var inStock = all.filter(function (p) { return p.stock !== 'order'; });

    document.title = name + ' в Краснодаре — Brand Gallery';

    box.innerHTML =
      '<div class="fab__cover"><div class="wrap">' +
        '<div>' +
          '<span class="eyebrow eyebrow--dark">' + esc(f.country) + ' · официальный поставщик</span>' +
          '<h1 class="fab__title">' + esc(name) + '</h1>' +
          '<p class="fab__text">' + esc(f.text) + '</p>' +
          '<div class="fab__stats">' +
            '<div><b>' + all.length + '</b><span>позиций</span></div>' +
            '<div><b>' + inStock.length + '</b><span>в наличии</span></div>' +
          '</div>' +
        '</div>' +
        '<div>' + ph('frame', 2) + '</div>' +
      '</div></div>' +

      '<div class="wrap" style="padding-top:20px">' +
        '<nav class="crumbs" style="margin-top:24px"><a href="index.html">Главная</a><span>·</span>' +
        '<a href="factory.html">Фабрики</a><span>·</span>' + esc(name) + '</nav>' +
      '</div>' +

      (inStock.length
        ? '<section class="strip"><div class="wrap">' +
          '<div class="strip__head"><div><span class="eyebrow">Не нужно ждать поставку</span>' +
          '<h2 class="t-h2">' + esc(name) + ' в наличии</h2></div>' +
          '<a class="linkline" href="catalog.html?stock=in&factory=' + encodeURIComponent(name) +
          '">Смотреть в каталоге</a></div>' +
          '<div class="grid grid--4">' + inStock.slice(0, 4).map(card).join('') + '</div>' +
          '</div></section>'
        : '') +

      '<section class="strip strip--paper2"><div class="wrap">' +
        '<div class="strip__head"><div><span class="eyebrow">Полный ассортимент</span>' +
        '<h2 class="t-h2">Весь каталог ' + esc(name) + '</h2></div>' +
        '<a class="linkline" href="catalog.html?factory=' + encodeURIComponent(name) +
        '">Открыть с фильтрами</a></div>' +
        '<div class="grid grid--4">' + all.map(card).join('') + '</div>' +
      '</div></section>';

    V.bindAdd(box);
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
      '<a href="factory.html">Фабрики</a><span>·</span>' +
      '<a href="factory.html?f=' + encodeURIComponent(p.factory) + '">' + esc(p.factory) +
      '</a><span>·</span>' + esc(p.name);

    box.innerHTML =
      '<div class="prod__gal">' + ph(p.type, p.id) +
        '<div class="prod__thumbs">' + [1, 2, 3].map(function (i) {
          return ph('frame', p.id + i);
        }).join('') + '</div>' +
      '</div>' +

      '<div class="prod__side">' +
        '<a class="eyebrow eyebrow--terra" href="factory.html?f=' + encodeURIComponent(p.factory) +
          '">' + esc(p.factory) + ' · ' + esc(p.country) + '</a>' +
        '<h1 class="t-h1">' + esc(p.name) + '</h1>' +
        '<div class="prod__price">' + (p.price ? money(p.price) : '<em>Ещё нет цены</em>') + '</div>' +
        '<div class="prod__stock' + (p.stock === 'order' ? ' is-order' : '') + '">' +
          D.STOCK[p.stock] + '</div>' +

        '<div class="answers">' +
          '<div><b>Срок поставки</b><span>' + (p.lead || 'Готов к отгрузке со склада') + '</span></div>' +
          '<div><b>Отделка</b><span>' + esc(p.material) + ' · ' + esc(p.color) + '</span></div>' +
          '<div><b>Размеры, см</b><span>' + esc(p.size) + '</span></div>' +
          '<div><b>Артикул</b><span>' + esc(p.sku) + '</span></div>' +
        '</div>' +

        '<div class="btn-row" style="margin:30px 0">' +
          '<button class="btn btn--solid" data-add="' + p.id + '">' +
            (inPick ? 'Уже в подборке' : 'Добавить в подборку') + '</button>' +
          '<a class="btn" href="request.html?showroom=1">Посмотреть в шоуруме</a>' +
        '</div>' +

        '<h2 class="t-h3" style="margin-bottom:10px">Описание</h2>' +
        '<p class="muted">Пишется под каждую позицию человеческим языком: для кого эта ' +
        'вещь, как ей пользуются, в какой отделке берут чаще. Копия с сайта фабрики ' +
        'даст поисковый дубль и понизит страницу в выдаче.</p>' +

        '<p class="tiny" style="margin-top:26px">Информация о товаре не является ' +
        'публичной офертой. Цена, комплектация и срок производства подтверждаются ' +
        'менеджером салона после обращения.</p>' +
      '</div>';

    V.bindAdd(box, ['Добавить в подборку', 'Уже в подборке']);

    /* «Ещё у этой фабрики» — в этом варианте перелинковка идёт по марке,
       а не по типу мебели: так собирается вес на страницу фабрики. */
    var same = D.products.filter(function (x) { return x.id !== p.id && x.factory === p.factory; }).slice(0, 4);
    if (same.length) {
      $('#more').innerHTML =
        '<div class="strip__head"><div><span class="eyebrow">Та же фабрика</span>' +
        '<h2 class="t-h2">Ещё ' + esc(p.factory) + '</h2></div>' +
        '<a class="linkline" href="factory.html?f=' + encodeURIComponent(p.factory) +
        '">Страница фабрики</a></div>' +
        '<div class="grid grid--4">' + same.map(card).join('') + '</div>';
      V.bindAdd($('#more'));
    }
  }

  /* --------------------------------------------------------------- старт */

  chrome();
  initHome();
  initCatalog();
  initFactory();
  initProduct();
  V.request({ picked: '#picked', sum: '#sum', form: '#reqform', sent: '#sent' });
  V.reveal();
})();
