/*
  brandgalleryhome.ru — дизайн-макет, общая логика.

  Макет статический, без сервера: подборка живёт в localStorage, товары
  берутся из data.js. Этого достаточно, чтобы пройти путь целиком —
  главная, каталог с фильтрами, карточка, фабрика, заявка — и увидеть
  оформление в работе, а не на картинке.

  Фотографий пока нет, поэтому на их месте рисуется контур предмета
  по типу товара. Когда придут снимки, заглушка меняется на <img>
  внутри того же блока — вёрстку это не трогает.

  Фильтры пишутся в адрес страницы: заказчице нужна возможность собрать
  подборку фильтрами и отправить клиенту ссылку (раздел 4 в docs/tz.md).
*/
(function () {
  'use strict';

  var D = window.DEMO;
  var KEY = 'bgh-picked';

  /* ------------------------------------------------------------ утилиты */

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function money(v) { return v == null ? null : v.toLocaleString('ru-RU') + ' ₽'; }

  function plural(n, f) {
    var a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return f[0];
    if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return f[1];
    return f[2];
  }

  function picked() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }

  function setPicked(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
    paintCount();
  }

  function toggle(id) {
    var list = picked(), i = list.indexOf(id);
    if (i === -1) list.push(id); else list.splice(i, 1);
    setPicked(list);
    return list.indexOf(id) !== -1;
  }

  function byId(id) {
    return D.products.filter(function (p) { return p.id === id; })[0];
  }

  /* ------------------------------------------------- контуры для заглушек */

  /* Рисунки намеренно простые и в одну линию: это подложка под будущую
     фотографию, а не иллюстрация. Она должна намекать на предмет
     и не спорить с набором. */
  var ART = {
    divany:
      '<path d="M22 52V34a6 6 0 0 1 6-6h64a6 6 0 0 1 6 6v18"/>' +
      '<path d="M12 62V47a5 5 0 0 1 10 0v15"/>' +
      '<path d="M98 62V47a5 5 0 0 1 10 0v15"/>' +
      '<path d="M22 62h76v-9a4 4 0 0 0-4-4H26a4 4 0 0 0-4 4z"/>' +
      '<path d="M18 62v8M102 62v8"/>',
    kresla:
      '<path d="M40 54V36a6 6 0 0 1 6-6h28a6 6 0 0 1 6 6v18"/>' +
      '<path d="M32 64V50a4 4 0 0 1 8 0v14"/>' +
      '<path d="M80 64V50a4 4 0 0 1 8 0v14"/>' +
      '<path d="M40 64h40v-8a4 4 0 0 0-4-4H44a4 4 0 0 0-4 4z"/>' +
      '<path d="M37 64v8M83 64v8"/>',
    stoly:
      '<path d="M14 42h92v6H14z"/>' +
      '<path d="M28 48v24M92 48v24"/>' +
      '<path d="M28 66h64"/>',
    stulya:
      '<path d="M44 56V20h32v36"/>' +
      '<path d="M44 32h32M44 43h32"/>' +
      '<path d="M36 56h48v6H36z"/>' +
      '<path d="M41 62v14M79 62v14"/>',
    krovati:
      '<path d="M26 46V30a5 5 0 0 1 5-5h58a5 5 0 0 1 5 5v16"/>' +
      '<path d="M16 46h88a3 3 0 0 1 3 3v10H13V49a3 3 0 0 1 3-3z"/>' +
      '<path d="M13 59h94v6H13z"/>' +
      '<path d="M18 65v8M102 65v8"/>' +
      '<path d="M36 37h22v9H36z"/>',
    shkafy:
      '<path d="M28 18h64v54H28z"/>' +
      '<path d="M60 18v54"/>' +
      '<path d="M34 34h20M66 34h20M34 51h20M66 51h20"/>' +
      '<path d="M56 42v7M64 42v7"/>' +
      '<path d="M34 72v6M86 72v6"/>',
    kuhni:
      '<path d="M20 16h34v18H20zM66 16h34v18H66z"/>' +
      '<path d="M14 44h92v5H14z"/>' +
      '<path d="M20 49h80v25H20z"/>' +
      '<path d="M60 49v25"/>' +
      '<path d="M42 58h10M68 58h10"/>',
    svet:
      '<path d="M60 10v18"/>' +
      '<path d="M42 58l11-30h14l11 30z"/>' +
      '<path d="M42 58h36"/>' +
      '<path d="M50 66l-5 8M60 68v9M70 66l5 8"/>',
    aksessuary:
      '<path d="M50 22h20v8c9 7 14 17 14 27 0 12-10 21-24 21s-24-9-24-21c0-10 5-20 14-27z"/>' +
      '<path d="M50 30h20"/>',
    tehnika:
      '<path d="M34 16h52v58H34z"/>' +
      '<path d="M34 30h52"/>' +
      '<circle cx="60" cy="52" r="15"/>' +
      '<circle cx="60" cy="52" r="8"/>' +
      '<path d="M42 23h11M76 23h5"/>',
    /* Интерьер: для плиток разделов, шоурума и первого экрана */
    interior:
      '<path d="M6 74h108"/>' +
      '<path d="M16 74V38a13 13 0 0 1 26 0v36"/>' +
      '<path d="M16 52h26M29 39v35"/>' +
      '<path d="M58 74V58a4 4 0 0 1 4-4h38a4 4 0 0 1 4 4v16"/>' +
      '<path d="M58 64h46"/>' +
      '<path d="M86 18v11"/>' +
      '<path d="M77 40l9-11 9 11z"/>',
    /* Рамка-пейзаж: статьи и всё, у чего нет своего предмета */
    frame:
      '<path d="M22 22h76v46H22z"/>' +
      '<path d="M22 58l19-17 14 12 13-15 30 24"/>' +
      '<circle cx="76" cy="34" r="5"/>',
  };

  /* Какой предмет рисовать для помещения. Без этой таблицы все двенадцать
     разделов на главной получили бы один и тот же контур интерьера
     и ряд читался бы как обои. */
  var ROOM_ART = {
    gostinaya: 'divany', spalnya: 'krovati', stolovaya: 'stoly',
    kuhni: 'kuhni', garderobnye: 'shkafy', kabinet: 'kresla',
    detskaya: 'krovati', prihozhaya: 'kresla', svet: 'svet',
    aksessuary: 'aksessuary', ulichnaya: 'kresla', tehnika: 'tehnika',
  };

  function art(key) {
    return '<svg viewBox="0 0 120 90" aria-hidden="true">' + (ART[key] || ART.frame) + '</svg>';
  }

  /* Заглушка: тёплая подложка + контур. Оттенок закреплён за товаром,
     чтобы список не мерцал разными фонами при перерисовке. */
  function ph(key, seed, cls) {
    var t = (Math.abs(seed || 0) % 5) + 1;
    return '<div class="ph ph--' + t + (cls ? ' ' + cls : '') + '">' + art(key) + '</div>';
  }

  /* ------------------------------------------------------ шапка и подвал */

  var ICONS = {
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M5 7h14l-1.2 13H6.2z"/><path d="M9 7V5.5a3 3 0 0 1 6 0V7"/></svg>',
  };

  var NAV = [
    ['catalog.html', 'Каталог'],
    ['catalog.html?stock=in', 'В наличии'],
    ['factory.html', 'Фабрики'],
    ['#', 'Дизайнерам'],
    ['#', 'О салоне'],
    ['#', 'Статьи'],
    ['#', 'Контакты'],
  ];

  /* Контакты салона. Держим в одном месте: они уходят в шапку, подвал,
     блок шоурума и микроразметку, и расходиться между ними не должны —
     единообразие названия, адреса и телефона влияет на локальную выдачу. */
  var PHONE = '+7 918 657-50-27';
  var TEL = '+79186575027';
  var EMAIL = 'studia_interior_krd@mail.ru';
  var ADDRESS = 'Краснодар, ул. Бабушкина, 285, 3 этаж, БЦ Full House';
  var ADDRESS_SHORT = 'Краснодар, ул. Бабушкина, 285';
  var HOURS = 'пн–сб 11:00–18:00';
  var HOURS_FULL = 'пн–сб 11:00–18:00, вс выходной';

  function logo(sub) {
    return '<a class="logo" href="index.html">' +
      '<span class="logo__name">Brand Gallery</span>' +
      (sub === false ? '' : '<span class="logo__sub">Итальянская мебель · Краснодар</span>') +
      '</a>';
  }

  function chrome() {
    var here = location.pathname.split('/').pop() || 'index.html';

    var top = '<div class="topbar"><div class="wrap">' +
      '<span class="topbar__geo">' + ADDRESS_SHORT + ' · ' + HOURS + '</span>' +
      '<span class="topbar__right">' +
        '<a href="request.html?showroom=1">Записаться в шоурум</a>' +
        '<a class="topbar__mail" href="mailto:' + EMAIL + '">' + EMAIL + '</a>' +
        '<a href="tel:' + TEL + '">' + PHONE + '</a>' +
      '</span>' +
      '</div></div>';

    var head = '<header class="head" id="head">' +
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
      '</div>' +
      '<nav class="nav" id="nav">' + NAV.map(function (n) {
        var on = n[0] === here || (here === 'catalog.html' && n[0] === 'catalog.html');
        return '<a href="' + n[0] + '"' + (on ? ' class="is-on"' : '') + '>' + n[1] + '</a>';
      }).join('') + '</nav>' +
      '</div>' +
      '<div class="searchpanel" id="qpanel">' +
        '<div class="wrap"><div class="searchpanel__in">' +
          '<input type="search" id="q" autocomplete="off" ' +
            'placeholder="Название, фабрика или артикул">' +
          '<div class="qhits" id="qhits"></div>' +
        '</div></div>' +
      '</div>' +
      '</header>';

    var rooms = Object.keys(D.ROOMS).slice(0, 6).map(function (k) {
      return '<li><a href="catalog.html?room=' + k + '">' + D.ROOMS[k] + '</a></li>';
    }).join('');

    var types = Object.keys(D.TYPES).slice(0, 6).map(function (k) {
      return '<li><a href="catalog.html?type=' + k + '">' + D.TYPES[k] + '</a></li>';
    }).join('');

    var foot = '<footer class="foot"><div class="wrap">' +
      '<div class="foot__cols">' +
        '<div class="foot__logo">' + logo() +
          '<p class="small">Салон итальянской мебели премиум-класса. Прямые поставки ' +
          'с фабрик Италии, шоурум в Краснодаре.</p></div>' +
        '<div><h4>По помещению</h4><ul>' + rooms + '</ul></div>' +
        '<div><h4>По типу мебели</h4><ul>' + types + '</ul></div>' +
        '<div><h4>Шоурум в Краснодаре</h4><ul>' +
          '<li>' + ADDRESS + '</li>' +
          '<li>' + HOURS_FULL + '</li>' +
          '<li><a href="tel:' + TEL + '">' + PHONE + '</a></li>' +
          '<li><a href="mailto:' + EMAIL + '">' + EMAIL + '</a></li>' +
          '<li><a href="request.html?showroom=1">Записаться на визит</a></li>' +
        '</ul></div>' +
      '</div>' +
      '<div class="foot__legal">' +
        '<p>ООО «Наименование» · ИНН 0000000000 · ОГРН 0000000000000 · ' +
        ADDRESS + '</p>' +
        '<p><a href="#">Политика обработки персональных данных</a> · ' +
        '<a href="#">Уведомление об использовании cookie</a></p>' +
        '<p>Информация на сайте не является публичной офертой. Окончательная ' +
        'стоимость, комплектация и срок поставки подтверждаются менеджером салона.</p>' +
      '</div>' +
      '<div class="mockbar"><span>Макет:</span>' +
        '<a href="index.html">главная</a>' +
        '<a href="catalog.html">каталог</a>' +
        '<a href="product.html?id=1">карточка товара</a>' +
        '<a href="factory.html">фабрики</a>' +
        '<a href="request.html">подборка и заявка</a>' +
        '<a href="variants/index.html">все три варианта</a>' +
      '</div>' +
      '</div></footer>';

    document.body.insertAdjacentHTML('afterbegin', top + head);
    document.body.insertAdjacentHTML('beforeend', foot);

    var burger = $('#burger'), nav = $('#nav');
    burger.addEventListener('click', function () {
      var on = nav.classList.toggle('is-open');
      burger.classList.toggle('is-on', on);
      burger.setAttribute('aria-expanded', on ? 'true' : 'false');
      document.body.style.overflow = on ? 'hidden' : '';
    });

    initSearch();
    initSticky();
    paintCount();
  }

  function paintCount() {
    var n = picked().length;
    $$('[data-count]').forEach(function (el) {
      el.textContent = n;
      el.classList.toggle('is-zero', n === 0);
    });
  }

  /* Тонкая линия под шапкой появляется только когда страница прокручена:
     на первом экране лишняя линия рвёт композицию. */
  function initSticky() {
    var head = $('#head');
    var onScroll = function () { head.classList.toggle('is-stuck', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------------------------------------------- поиск */

  function initSearch() {
    var open = $('#qopen'), panel = $('#qpanel'), input = $('#q'), hits = $('#qhits');
    if (!open) return;

    function show(on) {
      panel.classList.toggle('is-open', on);
      if (on) setTimeout(function () { input.focus(); }, 120);
    }

    open.addEventListener('click', function (e) {
      e.stopPropagation();
      show(!panel.classList.contains('is-open'));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') show(false);
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('#qpanel') && !e.target.closest('#qopen')) show(false);
    });

    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      if (q.length < 2) { hits.innerHTML = ''; return; }

      // Ищем по названию, фабрике, артикулу и материалу — так же,
      // как должен работать поиск на рабочем сайте.
      var found = D.products.filter(function (p) {
        return (p.name + ' ' + p.factory + ' ' + p.sku + ' ' + p.material)
          .toLowerCase().indexOf(q) !== -1;
      }).slice(0, 6);

      if (!found.length) {
        hits.innerHTML = '<p class="muted small">Ничего не нашлось. ' +
          'На рабочем сайте здесь предложим близкие разделы и форму запроса.</p>';
        return;
      }

      hits.innerHTML = found.map(function (p) {
        return '<a href="product.html?id=' + p.id + '">' +
          ph(p.type, p.id) +
          '<span><span class="qhits__name">' + esc(p.name) + '</span>' +
          '<span class="qhits__meta">' + esc(p.factory) + '</span></span>' +
          '<span class="qhits__price">' + (p.price ? money(p.price) : 'по запросу') + '</span>' +
          '</a>';
      }).join('');
    });
  }

  /* ------------------------------------------------- карточка товара в списке */

  function cardHTML(p) {
    var inPick = picked().indexOf(p.id) !== -1;
    var badge = p.stock === 'order'
      ? '<span class="badge badge--order">Под заказ</span>'
      : '<span class="badge badge--in">' + D.STOCK[p.stock] + '</span>';

    return '<article class="card">' +
      '<a class="card__media" href="product.html?id=' + p.id + '">' +
        badge + ph(p.type, p.id) +
      '</a>' +
      '<div class="card__brand"><a href="factory.html?f=' + encodeURIComponent(p.factory) + '">' +
        esc(p.factory) + '</a></div>' +
      '<a class="card__name" href="product.html?id=' + p.id + '">' + esc(p.name) + '</a>' +
      '<div class="card__lead">' + (p.lead ? 'Срок ' + p.lead : 'Готов к отгрузке') + '</div>' +
      '<div class="card__price">' +
        (p.price ? money(p.price) : '<em>Цена по запросу</em>') + '</div>' +
      '<button class="card__add' + (inPick ? ' is-in' : '') + '" data-add="' + p.id + '">' +
        (inPick ? 'В подборке' : 'В подборку') + '</button>' +
      '</article>';
  }

  function bindAdd(root) {
    $$('[data-add]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        var on = toggle(Number(b.dataset.add));
        b.classList.toggle('is-in', on);
        if (b.classList.contains('card__add')) b.textContent = on ? 'В подборке' : 'В подборку';
        else b.textContent = on ? 'Уже в подборке' : 'Добавить в подборку';
      });
    });
  }

  /* ---------------------------------------------------------- появление */

  function initReveal() {
    var items = $$('.reveal');
    if (!items.length || !('IntersectionObserver' in window)) {
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

  /* ---------------------------------------------------------------- главная */

  function initHome() {
    var hot = $('#hot');
    if (!hot) return;

    $('#heroart').innerHTML = ART.interior;

    var inStock = D.products.filter(function (p) { return p.stock !== 'order'; }).slice(0, 4);
    hot.innerHTML = inStock.map(cardHTML).join('');
    bindAdd(hot);

    /* Категории-лидеры по брифу: диваны, гардеробные, столы и стулья.
       Первая плитка крупная — лидер должен быть заметнее остальных,
       а не одним из восьми одинаковых квадратов. */
    var LEAD = [
      { title: 'Диваны', art: 'divany', by: 'type', val: 'divany', big: true },
      { title: 'Гардеробные', art: 'shkafy', by: 'room', val: 'garderobnye' },
      { title: 'Столы', art: 'stoly', by: 'type', val: 'stoly' },
      { title: 'Стулья', art: 'stulya', by: 'type', val: 'stulya' },
      { title: 'Спальни', art: 'krovati', by: 'room', val: 'spalnya' },
    ];

    $('#lead').innerHTML = LEAD.map(function (t, i) {
      var n = D.products.filter(function (p) { return p[t.by] === t.val; }).length;
      var href = 'catalog.html?' + t.by + '=' + t.val;
      return '<a class="tile' + (t.big ? ' tile--big' : '') + '" href="' + href + '">' +
        '<div class="tile__box">' + ph(t.art, i + 2) + '</div>' +
        '<div class="tile__cap"><span>' + n + ' ' +
          plural(n, ['позиция', 'позиции', 'позиций']) + '</span>' +
          '<h3>' + t.title + '</h3></div>' +
        '</a>';
    }).join('');

    $('#rooms').innerHTML = Object.keys(D.ROOMS).map(function (k, i) {
      var n = D.products.filter(function (p) { return p.room === k; }).length;
      if (!n) return '';
      return '<a class="tile" href="catalog.html?room=' + k + '">' +
        '<div class="tile__box">' + ph(ROOM_ART[k] || 'interior', i + 1) + '</div>' +
        '<div class="tile__cap"><span>' + n + ' ' +
          plural(n, ['позиция', 'позиции', 'позиций']) + '</span>' +
          '<h3>' + D.ROOMS[k] + '</h3></div>' +
        '</a>';
    }).join('');

    // Одиннадцать фабрик плюс ссылка на общий список: ровно двенадцать
    // ячеек, сетка не обрывается ни на одном разрешении.
    $('#brands').innerHTML = Object.keys(D.FACTORIES).slice(0, 11).map(function (n) {
      return '<a href="factory.html?f=' + encodeURIComponent(n) + '">' +
        '<b>' + esc(n) + '</b><span>' + esc(D.FACTORIES[n].country) + '</span></a>';
    }).join('') +
      '<a href="factory.html"><b>Все фабрики</b><span>список целиком</span></a>';

    $('#showroomart').innerHTML = ph('interior', 3);

    var POSTS = [
      ['Как выбрать итальянский диван и не ошибиться с размером', 'Разбор на примерах из зала'],
      ['Сколько на самом деле ждать мебель из Италии', 'Что влияет на срок и как его сократить'],
      ['Чем отличается массив от шпона в мебели премиум-класса', 'Материалы и уход'],
    ];
    $('#posts').innerHTML = POSTS.map(function (a, i) {
      return '<a class="post" href="#">' +
        '<div class="post__box">' + ph('frame', i + 4) + '</div>' +
        '<h3>' + a[0] + '</h3>' +
        '<div class="tiny">' + a[1] + '</div></a>';
    }).join('');
  }

  /* ---------------------------------------------------------------- каталог */

  function initCatalog() {
    var grid = $('#grid');
    if (!grid) return;

    var params = new URLSearchParams(location.search);
    var state = {
      stock: params.get('stock') || 'all',
      room: params.get('room') || '',
      type: params.get('type') || '',
      factory: (params.get('factory') || '').split(',').filter(Boolean),
      material: (params.get('material') || '').split(',').filter(Boolean),
      color: (params.get('color') || '').split(',').filter(Boolean),
      style: (params.get('style') || '').split(',').filter(Boolean),
      min: Number(params.get('min') || 0),
      max: Number(params.get('max') || 0),
      sort: params.get('sort') || 'default',
    };

    var prices = D.products.filter(function (p) { return p.price; })
      .map(function (p) { return p.price; });
    var LO = Math.min.apply(null, prices);
    var HI = Math.max.apply(null, prices);
    if (!state.min) state.min = LO;
    if (!state.max) state.max = HI;

    function match(p, skip) {
      if (state.stock === 'in' && p.stock === 'order') return false;
      if (state.stock === 'order' && p.stock !== 'order') return false;
      if (state.room && p.room !== state.room) return false;
      if (state.type && p.type !== state.type) return false;
      if (skip !== 'factory' && state.factory.length && state.factory.indexOf(p.factory) === -1) return false;
      if (skip !== 'material' && state.material.length && state.material.indexOf(p.material) === -1) return false;
      if (skip !== 'color' && state.color.length && state.color.indexOf(p.color) === -1) return false;
      if (skip !== 'style' && state.style.length && state.style.indexOf(p.style) === -1) return false;
      // Товары без цены из ценового диапазона не выкидываем: «по запросу»
      // не значит «дороже максимума», и прятать их было бы враньём.
      if (p.price && (p.price < state.min || p.price > state.max)) return false;
      return true;
    }

    function facet(field) {
      var counts = {};
      D.products.forEach(function (p) {
        if (!match(p, field)) return;
        counts[p[field]] = (counts[p[field]] || 0) + 1;
      });
      return counts;
    }

    /* Больше восьми пунктов сворачиваем. Отмеченные показываем всегда:
       иначе человек не увидит, по чему у него сейчас отфильтровано. */
    var FLIMIT = 8;

    function checks(field, title) {
      var counts = facet(field);
      var keys = Object.keys(counts).sort();
      if (!keys.length) return '';

      var body = keys.map(function (v, i) {
        var on = state[field].indexOf(v) !== -1;
        var extra = i >= FLIMIT && !on ? ' class="is-extra"' : '';
        return '<label' + extra + '><input type="checkbox" data-f="' + field +
          '" value="' + esc(v) + '"' + (on ? ' checked' : '') + '>' +
          '<span>' + esc(v) + '</span><span class="n">' + counts[v] + '</span></label>';
      }).join('');

      var more = keys.length > FLIMIT
        ? '<button class="fmore" type="button" data-more>Показать все · ' + keys.length + '</button>'
        : '';

      return '<div class="fgroup"><b>' + title + '</b>' + body + more + '</div>';
    }

    /* Разделы каталога — помещение и тип мебели. Это навигация, а не фильтр:
       товар лежит ровно в одном помещении и относится ровно к одному типу,
       поэтому выбор одиночный. */
    function radios(field, title, dict) {
      var counts = facet(field);
      var keys = Object.keys(dict).filter(function (k) { return counts[k]; });
      if (!keys.length) return '';

      var total = D.products.filter(function (p) {
        var saved = state[field];
        state[field] = '';
        var ok = match(p, field);
        state[field] = saved;
        return ok;
      }).length;

      return '<div class="fgroup fgroup--nav"><b>' + title + '</b>' +
        '<label><input type="radio" name="r-' + field + '" data-r="' + field + '" value=""' +
          (state[field] ? '' : ' checked') + '><span>Все</span>' +
          '<span class="n">' + total + '</span></label>' +
        keys.map(function (k) {
          return '<label><input type="radio" name="r-' + field + '" data-r="' + field +
            '" value="' + k + '"' + (state[field] === k ? ' checked' : '') + '>' +
            '<span>' + esc(dict[k]) + '</span><span class="n">' + counts[k] + '</span></label>';
        }).join('') + '</div>';
    }

    function url() {
      var u = new URLSearchParams();
      if (state.stock !== 'all') u.set('stock', state.stock);
      if (state.room) u.set('room', state.room);
      if (state.type) u.set('type', state.type);
      ['factory', 'material', 'color', 'style'].forEach(function (f) {
        if (state[f].length) u.set(f, state[f].join(','));
      });
      if (state.min !== LO) u.set('min', state.min);
      if (state.max !== HI) u.set('max', state.max);
      if (state.sort !== 'default') u.set('sort', state.sort);
      var s = u.toString();
      // Часть браузеров запрещает менять адрес у страницы, открытой с диска.
      // Каталог из-за этого падать не должен: адрес здесь удобство,
      // а не условие работы.
      try {
        history.replaceState(null, '', s ? '?' + s : location.pathname);
      } catch (e) {}
    }

    function render() {
      var list = D.products.filter(function (p) { return match(p); });

      if (state.sort === 'cheap') list.sort(function (a, b) { return (a.price || 1e12) - (b.price || 1e12); });
      if (state.sort === 'rich') list.sort(function (a, b) { return (b.price || 0) - (a.price || 0); });
      if (state.sort === 'stock') list.sort(function (a, b) { return (a.stock === 'order') - (b.stock === 'order'); });

      grid.innerHTML = list.length
        ? list.map(cardHTML).join('')
        : '<div class="empty"><h3 class="t-h3">По этим условиям ничего нет</h3>' +
          '<p class="muted">Попробуйте снять часть фильтров или расширить диапазон цены.</p></div>';
      grid.classList.toggle('grid--3', list.length > 0);
      bindAdd(grid);

      $('#found').textContent = list.length + ' ' +
        plural(list.length, ['позиция', 'позиции', 'позиций']);

      $('#filters').innerHTML =
        radios('room', 'Помещение', D.ROOMS) +
        radios('type', 'Тип мебели', D.TYPES) +
        '<div class="fgroup"><b>Цена, ₽</b>' +
          '<div class="price-row">' +
            '<input type="number" id="pmin" value="' + state.min + '" step="10000" aria-label="Цена от">' +
            '<span>—</span>' +
            '<input type="number" id="pmax" value="' + state.max + '" step="10000" aria-label="Цена до">' +
          '</div>' +
          '<input class="price-slider" type="range" id="prange" min="' + LO + '" max="' + HI +
            '" step="10000" value="' + state.max + '" aria-label="Верхняя граница цены">' +
          '<div class="tiny" style="margin-top:10px">Позиции «по запросу» показываются всегда</div>' +
        '</div>' +
        checks('factory', 'Фабрика') +
        checks('material', 'Материал') +
        checks('color', 'Цвет') +
        checks('style', 'Стиль') +
        '<button class="freset" id="freset">Сбросить фильтры</button>';

      bindFilters();
      paintTitle();
      url();
    }

    /* Заголовок и крошки идут за выбранным разделом: человек должен видеть,
       где он находится, а поисковик — получать осмысленный H1 на каждую
       комбинацию раздела и фильтра. */
    function paintTitle() {
      var parts = [];
      if (state.room) parts.push(D.ROOMS[state.room]);
      if (state.type) parts.push(D.TYPES[state.type]);

      var title = parts.length ? parts.join(' · ') : 'Каталог';
      if (state.stock === 'in') title += ' в наличии';
      if (state.stock === 'order') title += ' под заказ';
      $('#ctitle').textContent = title;
      document.title = title + ' — Brand Gallery, Краснодар';

      var crumbs = '<a href="index.html">Главная</a><span>·</span>' +
        '<a href="catalog.html">Каталог</a>';
      if (state.room) crumbs += '<span>·</span><a href="catalog.html?room=' + state.room + '">' +
        D.ROOMS[state.room] + '</a>';
      if (state.type) crumbs += '<span>·</span>' + D.TYPES[state.type];
      $('#ccrumbs').innerHTML = crumbs;
    }

    function bindFilters() {
      var box = $('#filters');

      $$('[data-r]', box).forEach(function (rb) {
        rb.addEventListener('change', function () {
          state[rb.dataset.r] = rb.value;
          render();
        });
      });

      $$('[data-f]', box).forEach(function (cb) {
        cb.addEventListener('change', function () {
          var f = cb.dataset.f, i = state[f].indexOf(cb.value);
          if (cb.checked && i === -1) state[f].push(cb.value);
          if (!cb.checked && i !== -1) state[f].splice(i, 1);
          render();
        });
      });

      $$('[data-more]', box).forEach(function (b) {
        b.addEventListener('click', function () {
          var g = b.closest('.fgroup');
          var on = g.classList.toggle('is-open');
          b.textContent = on ? 'Свернуть' : 'Показать все · ' +
            $$('label', g).length;
        });
      });

      var pmin = $('#pmin'), pmax = $('#pmax'), pr = $('#prange');
      [pmin, pmax].forEach(function (el) {
        el.addEventListener('change', function () {
          state.min = Number(pmin.value) || LO;
          state.max = Number(pmax.value) || HI;
          render();
        });
      });
      pr.addEventListener('input', function () { pmax.value = this.value; });
      pr.addEventListener('change', function () { state.max = Number(this.value); render(); });

      // Раздел при сбросе сохраняем: это навигация, а не фильтр. Человек,
      // сбрасывая фильтры в «Кухнях», ожидает остаться в кухнях.
      $('#freset').addEventListener('click', function () {
        state.factory = []; state.material = []; state.color = []; state.style = [];
        state.min = LO; state.max = HI; state.stock = 'all';
        paintSwitch();
        render();
      });
    }

    function paintSwitch() {
      $$('[data-stock]').forEach(function (b) {
        b.classList.toggle('is-on', b.dataset.stock === state.stock);
      });
    }

    $$('[data-stock]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.stock = b.dataset.stock;
        paintSwitch();
        render();
      });
    });

    $('#sort').addEventListener('change', function () { state.sort = this.value; render(); });

    $('#fopen').addEventListener('click', function () {
      $('#filters').classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
    $('#fclose').addEventListener('click', function () {
      $('#filters').classList.remove('is-open');
      document.body.style.overflow = '';
    });

    paintSwitch();
    $('#sort').value = state.sort;
    render();
  }

  /* ---------------------------------------------------------- карточка товара */

  function initProduct() {
    var box = $('#product');
    if (!box) return;

    var id = Number(new URLSearchParams(location.search).get('id')) || 1;
    var p = byId(id) || D.products[0];
    var inPick = picked().indexOf(p.id) !== -1;

    document.title = p.name + ', ' + p.factory + ' — Brand Gallery, Краснодар';

    $('#pcrumbs').innerHTML = '<a href="index.html">Главная</a><span>·</span>' +
      '<a href="catalog.html">Каталог</a><span>·</span>' +
      '<a href="catalog.html?room=' + p.room + '">' + D.ROOMS[p.room] + '</a>' +
      '<span>·</span>' + esc(p.name);

    var thumbs = [0, 1, 2, 3].map(function (i) {
      return ph(i === 0 ? p.type : 'frame', p.id + i, i === 0 ? 'is-on' : '');
    }).join('');

    box.innerHTML =
      '<div>' +
        '<div class="gal__main" id="galmain">' + ph(p.type, p.id) + '</div>' +
        '<div class="gal__row">' + thumbs + '</div>' +
        '<p class="tiny" style="margin-top:16px">Первый кадр — предмет целиком на ровном ' +
        'фоне, дальше отделка, механизм и фактура. От трёх до шести снимков на позицию.</p>' +
      '</div>' +

      '<div class="prod__side">' +
        '<a class="eyebrow eyebrow--bronze prod__brand" href="factory.html?f=' +
          encodeURIComponent(p.factory) + '">' + esc(p.factory) + ' · ' + esc(p.country) + '</a>' +
        '<h1 class="t-h1">' + esc(p.name) + '</h1>' +

        '<div class="prod__price">' +
          (p.price ? money(p.price) : '<em>Цена по запросу</em>') + '</div>' +
        '<div class="prod__stock ' + (p.stock === 'order' ? 'order' : 'in') + '">' +
          D.STOCK[p.stock] + '</div>' +

        /* Срок поставки и отделка — первое, что спрашивают по брифу,
           поэтому они стоят рядом с ценой, а не в таблице внизу. */
        '<div class="answers">' +
          '<div><b>Срок поставки</b><span>' +
            (p.lead || 'Готов к отгрузке со склада') + '</span></div>' +
          '<div><b>Отделка</b><span>' + esc(p.material) + ' · ' + esc(p.color) + '</span></div>' +
          '<div><b>Размеры, см</b><span>' + esc(p.size) + '</span></div>' +
        '</div>' +

        '<div class="btn-row btn-row--stack">' +
          '<button class="btn btn--solid" data-add="' + p.id + '">' +
            (inPick ? 'Уже в подборке' : 'Добавить в подборку') + '</button>' +
          '<a class="btn" href="request.html?showroom=1">Посмотреть в шоуруме</a>' +
        '</div>' +

        '<div class="prod__block">' +
          '<h2 class="t-h3">Описание</h2>' +
          '<p>Пишется под каждую позицию человеческим языком: для кого эта вещь, ' +
          'как ей пользуются, в какой отделке берут чаще. Копия с сайта фабрики ' +
          'даст поисковый дубль и понизит страницу в выдаче.</p>' +
        '</div>' +

        '<div class="prod__block">' +
          '<h2 class="t-h3">Характеристики</h2>' +
          '<table class="specs">' +
            row('Артикул', p.sku) + row('Фабрика', p.factory) + row('Страна', p.country) +
            row('Тип мебели', D.TYPES[p.type]) + row('Материал', p.material) +
            row('Цвет', p.color) + row('Размеры, см', p.size) + row('Стиль', p.style) +
          '</table>' +
        '</div>' +

        '<p class="offer-note">Информация о товаре не является публичной офертой. ' +
        'Цена, комплектация и срок производства подтверждаются менеджером салона ' +
        'после обращения.</p>' +
      '</div>';

    bindAdd(box);

    // Миниатюры переключают подложку: показывают, как будет вести себя
    // галерея, когда появятся настоящие снимки.
    var main = $('#galmain');
    $$('.gal__row .ph').forEach(function (t) {
      t.addEventListener('click', function () {
        $$('.gal__row .ph').forEach(function (x) { x.classList.remove('is-on'); });
        t.classList.add('is-on');
        main.innerHTML = '<div class="' + t.className.replace('is-on', '').trim() + '">' +
          t.innerHTML + '</div>';
      });
    });

    /* «Есть похожее в наличии» — ловит тех, кто не готов ждать поставку.
       Показываем только когда сам товар под заказ. */
    var same = D.products.filter(function (x) {
      return x.id !== p.id && x.type === p.type && x.stock !== 'order';
    }).slice(0, 4);

    if (p.stock === 'order' && same.length) {
      $('#similar').innerHTML =
        '<div class="section__head"><div><span class="eyebrow">Не хотите ждать</span>' +
        '<h2 class="t-h2">Похожее в наличии</h2></div>' +
        '<a class="linkline" href="catalog.html?stock=in&type=' + p.type + '">' +
        'Весь раздел в наличии</a></div>' +
        '<div class="grid grid--4">' + same.map(cardHTML).join('') + '</div>';
      bindAdd($('#similar'));
    }
  }

  function row(k, v) {
    return '<tr><td>' + esc(k) + '</td><td>' + esc(v) + '</td></tr>';
  }

  /* ------------------------------------------------------------- фабрики */

  function initFactory() {
    var box = $('#factory');
    if (!box) return;

    var name = new URLSearchParams(location.search).get('f');
    var names = Object.keys(D.FACTORIES);

    if (!name) {
      $('#fcrumbs').innerHTML = '<a href="index.html">Главная</a><span>·</span>Фабрики';
      box.innerHTML =
        '<div class="section__head"><div><span class="eyebrow">Прямые поставки</span>' +
        '<h1 class="t-h1">Фабрики</h1></div></div>' +
        '<p class="lede" style="margin-bottom:48px">За фабриками приходят по имени: ' +
        'человек знает марку и ищет её вместе с городом. У каждой — своя страница ' +
        'с историей, стилем и наличием.</p>' +
        '<div class="grid grid--3">' + names.map(function (n, i) {
          var cnt = D.products.filter(function (p) { return p.factory === n; }).length;
          var inS = D.products.filter(function (p) { return p.factory === n && p.stock !== 'order'; }).length;
          return '<a class="card" href="factory.html?f=' + encodeURIComponent(n) + '">' +
            '<div class="card__media" style="aspect-ratio:16/10">' + ph('frame', i + 1) + '</div>' +
            '<div class="card__brand">' + esc(D.FACTORIES[n].country) + '</div>' +
            '<span class="card__name">' + esc(n) + '</span>' +
            '<div class="card__lead">' + cnt + ' ' +
              plural(cnt, ['позиция', 'позиции', 'позиций']) +
              (inS ? ' · ' + inS + ' в наличии' : '') + '</div>' +
            '</a>';
        }).join('') + '</div>';
      return;
    }

    var f = D.FACTORIES[name] || { country: '', text: '' };
    var all = D.products.filter(function (p) { return p.factory === name; });
    var inStock = all.filter(function (p) { return p.stock !== 'order'; });

    document.title = name + ' в Краснодаре — Brand Gallery';
    $('#fcrumbs').innerHTML = '<a href="index.html">Главная</a><span>·</span>' +
      '<a href="factory.html">Фабрики</a><span>·</span>' + esc(name);

    /* Не список товаров, а мини-лендинг: кто это, чем известны,
       в каком стиле работают. Это и есть страница под марочный запрос. */
    box.innerHTML =
      '<div class="fab__head">' +
        '<div class="fab__mark">' + ph('frame', 2) + '</div>' +
        '<div>' +
          '<span class="eyebrow">' + esc(f.country) + ' · официальный поставщик</span>' +
          '<div class="fab__name">' + esc(name) + '</div>' +
          '<p class="fab__text">' + esc(f.text) + '</p>' +
          '<div class="fab__stats">' +
            '<div><b>' + all.length + '</b><span>позиций в каталоге</span></div>' +
            '<div><b>' + inStock.length + '</b><span>в наличии сейчас</span></div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      (inStock.length
        ? '<section class="section"><div class="section__head">' +
          '<div><span class="eyebrow">Не нужно ждать поставку</span>' +
          '<h2 class="t-h2">' + esc(name) + ' в наличии</h2></div>' +
          '<a class="linkline" href="catalog.html?stock=in&factory=' +
            encodeURIComponent(name) + '">Смотреть в каталоге</a></div>' +
          '<div class="grid grid--4">' + inStock.slice(0, 4).map(cardHTML).join('') +
          '</div></section>'
        : '') +

      '<section class="section"><div class="section__head">' +
        '<div><span class="eyebrow">Полный ассортимент</span>' +
        '<h2 class="t-h2">Весь каталог ' + esc(name) + '</h2></div>' +
        '<a class="linkline" href="catalog.html?factory=' + encodeURIComponent(name) + '">' +
        'Открыть с фильтрами</a></div>' +
        '<div class="grid grid--4">' + all.map(cardHTML).join('') + '</div></section>';

    bindAdd(box);
  }

  /* --------------------------------------------------------- подборка и заявка */

  function initRequest() {
    var box = $('#picked');
    if (!box) return;

    function paint() {
      var list = picked().map(byId).filter(Boolean);

      if (!list.length) {
        box.innerHTML = '<div class="picked__empty">' +
          '<h3 class="t-h3" style="margin-bottom:14px">Подборка пуста</h3>' +
          '<p class="muted" style="margin-bottom:26px">Отметьте в каталоге всё, ' +
          'что хотите обсудить, и отправьте одной заявкой.</p>' +
          '<a class="btn" href="catalog.html">Перейти в каталог</a></div>';
        $('#sum').innerHTML = '';
        return;
      }

      box.innerHTML = list.map(function (p) {
        return '<div class="picked__row">' +
          ph(p.type, p.id) +
          '<div>' +
            '<a class="picked__name" href="product.html?id=' + p.id + '">' +
              esc(p.name) + '</a>' +
            '<div class="picked__meta">' + esc(p.factory) + ' · ' + D.STOCK[p.stock] +
              (p.lead ? ' · ' + p.lead : '') + '</div>' +
          '</div>' +
          '<div class="picked__price">' +
            (p.price ? money(p.price) : '<span class="muted">по запросу</span>') + '</div>' +
          '<button class="picked__x" data-del="' + p.id + '" ' +
            'aria-label="Убрать из подборки">×</button>' +
          '</div>';
      }).join('');

      var known = list.filter(function (p) { return p.price; });
      var total = known.reduce(function (s, p) { return s + p.price; }, 0);

      $('#sum').innerHTML = known.length
        ? '<span class="eyebrow">С известной ценой</span><b>' + money(total) + '</b>' +
          (known.length < list.length
            ? '<span class="tiny">по остальным ' + (list.length - known.length) + ' ' +
              plural(list.length - known.length, ['позиции', 'позициям', 'позициям']) +
              ' цену уточним в ответе</span>'
            : '')
        : '<span class="tiny">Цены по всем позициям уточним в ответе</span>';

      $$('[data-del]', box).forEach(function (b) {
        b.addEventListener('click', function () {
          toggle(Number(b.dataset.del));
          paint();
        });
      });
    }

    paint();

    if (new URLSearchParams(location.search).get('showroom')) {
      var cb = $('input[value="Записаться в шоурум"]');
      if (cb) cb.checked = true;
    }

    var form = $('#reqform');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.hidden = true;
      $('#sent').hidden = false;
      $('#sent').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------------------------------------------------------------- старт */

  chrome();
  initHome();
  initCatalog();
  initProduct();
  initFactory();
  initRequest();
  initReveal();
})();
