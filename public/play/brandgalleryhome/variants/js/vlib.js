/*
  Общий слой для вариантов дизайна.

  Три варианта показываются на одних и тех же данных (design/js/data.js)
  и с одной и той же логикой фильтров — иначе сравнение получится нечестным:
  разница между вариантами должна быть в оформлении и планировке,
  а не в том, что где-то каталог удобнее просто потому, что его писали
  вторым.

  Разметка фильтров у всех вариантов одинаковая, различается только
  оформлением в css. Так проверяется главное: одна и та же функциональность
  выглядит по-разному, а не «в одном варианте фильтр есть, в другом нет».

  Подборка живёт в localStorage под общим ключом: товар, отмеченный
  в BrandGallery B, виден и в BrandGallery C. Для показа заказчице это удобнее,
  чем три независимые корзины.
*/
window.VLIB = (function () {
  'use strict';

  var D = window.DEMO;
  var KEY = 'bgh-picked';

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

  function paintCount() {
    var n = picked().length;
    $$('[data-count]').forEach(function (el) {
      el.textContent = n;
      el.classList.toggle('is-zero', n === 0);
    });
  }

  function byId(id) {
    return D.products.filter(function (p) { return p.id === id; })[0];
  }

  function bindAdd(root, labels) {
    var L = labels || ['В подборку', 'В подборке'];
    $$('[data-add]', root).forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        var on = toggle(Number(b.dataset.add));
        b.classList.toggle('is-in', on);
        b.textContent = on ? L[1] : L[0];
      });
    });
  }

  /* ------------------------------------------------- контуры для заглушек */

  /* Своих фотографий пока нет. Серый прямоугольник на их месте убивает
     впечатление от любого варианта одинаково, поэтому вместо него —
     тёплая подложка и контур предмета по типу товара. */
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
    interior:
      '<path d="M6 74h108"/>' +
      '<path d="M16 74V38a13 13 0 0 1 26 0v36"/>' +
      '<path d="M16 52h26M29 39v35"/>' +
      '<path d="M58 74V58a4 4 0 0 1 4-4h38a4 4 0 0 1 4 4v16"/>' +
      '<path d="M58 64h46"/>' +
      '<path d="M86 18v11"/>' +
      '<path d="M77 40l9-11 9 11z"/>',
    frame:
      '<path d="M22 22h76v46H22z"/>' +
      '<path d="M22 58l19-17 14 12 13-15 30 24"/>' +
      '<circle cx="76" cy="34" r="5"/>',
  };

  var ROOM_ART = {
    gostinaya: 'divany', spalnya: 'krovati', stolovaya: 'stoly',
    kuhni: 'kuhni', garderobnye: 'shkafy', kabinet: 'kresla',
    detskaya: 'krovati', prihozhaya: 'kresla', svet: 'svet',
    aksessuary: 'aksessuary', ulichnaya: 'kresla', tehnika: 'tehnika',
  };

  function art(key) {
    return '<svg viewBox="0 0 120 90" aria-hidden="true">' + (ART[key] || ART.frame) + '</svg>';
  }

  /* Оттенок подложки закреплён за товаром, чтобы список не мерцал
     разными фонами при перерисовке фильтров. */
  function ph(key, seed, cls) {
    var t = (Math.abs(seed || 0) % 5) + 1;
    return '<div class="ph ph--' + t + (cls ? ' ' + cls : '') + '">' + art(key) + '</div>';
  }

  /* ------------------------------------------------------- поиск по сайту */

  /* Поиск обязателен по техническому заданию и должен быть на всех
     страницах в каждом варианте. Логика общая, различается оформлением. */
  function initSearch(ids) {
    var open = $(ids.open), panel = $(ids.panel), input = $(ids.input), hits = $(ids.hits);
    if (!input) return;

    function show(on) {
      if (panel) panel.classList.toggle('is-open', on);
      if (on) setTimeout(function () { input.focus(); }, 100);
    }

    if (open) {
      open.addEventListener('click', function (e) {
        e.stopPropagation();
        show(!panel.classList.contains('is-open'));
      });
      document.addEventListener('click', function (e) {
        if (!e.target.closest(ids.panel) && !e.target.closest(ids.open)) show(false);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') show(false);
      });
    } else {
      /* Строка поиска стоит прямо в шапке — панель не открывается,
         но подсказки должны закрываться по клику мимо и по Escape. */
      var close = function () { hits.innerHTML = ''; hits.classList.remove('is-on'); };
      document.addEventListener('click', function (e) {
        if (e.target !== input && !hits.contains(e.target)) close();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { close(); input.blur(); }
      });
    }

    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      if (q.length < 2) { hits.innerHTML = ''; hits.classList.remove('is-on'); return; }

      var found = D.products.filter(function (p) {
        return (p.name + ' ' + p.factory + ' ' + p.sku + ' ' + p.material)
          .toLowerCase().indexOf(q) !== -1;
      }).slice(0, 6);

      hits.classList.add('is-on');

      if (!found.length) {
        hits.innerHTML = '<p class="qhits__none">Ничего не нашлось. На рабочем сайте ' +
          'здесь предложим близкие разделы и форму запроса.</p>';
        return;
      }

      hits.innerHTML = found.map(function (p) {
        return '<a href="' + (ids.product || 'catalog.html') + '?id=' + p.id + '">' +
          ph(p.type, p.id) +
          '<span><span class="qhits__name">' + esc(p.name) + '</span>' +
          '<span class="qhits__meta">' + esc(p.factory) + '</span></span>' +
          '<span class="qhits__price">' + (p.price ? money(p.price) : 'ещё нет цены') + '</span>' +
          '</a>';
      }).join('');
    });
  }

  /* ------------------------------------------------------- каталог */

  /* Один движок фильтров на все варианты. Требования из технического
     задания: фильтр по цене, переключатель наличия, фабрика, материал,
     цвет, стиль, разделы по помещению и типу, состояние в адресе страницы.

     Вариант передаёт только отрисовку карточки и точки монтирования —
     всё остальное одинаково, и это осознанно. */
  function catalog(o) {
    var grid = $(o.grid);
    if (!grid) return;

    var params = new URLSearchParams(location.search);
    function list(v) { return (v || '').split(',').filter(Boolean); }

    /* Помещение и тип мебели тоже списки, а не одно значение. В адресе
       формат прежний и совместимый: ?room=kuhni читается как список
       из одного пункта, ссылки из меню и с главной работают как работали.
       Одиночный выбор от этого не пропал — вариант рисует переключатели
       (radios), и они кладут в список ровно один пункт. */
    var state = {
      stock: params.get('stock') || 'all',
      room: list(params.get('room')),
      type: list(params.get('type')),
      factory: list(params.get('factory')),
      material: list(params.get('material')),
      color: list(params.get('color')),
      style: list(params.get('style')),
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
      /* Свою группу фильтр из подсчёта исключает: иначе после выбора
         «Гостиная» в списке помещений остаётся одна гостиная, и второе
         помещение к ней уже не добавить. */
      if (skip !== 'room' && state.room.length && state.room.indexOf(p.room) === -1) return false;
      if (skip !== 'type' && state.type.length && state.type.indexOf(p.type) === -1) return false;
      if (skip !== 'factory' && state.factory.length && state.factory.indexOf(p.factory) === -1) return false;
      if (skip !== 'material' && state.material.length && state.material.indexOf(p.material) === -1) return false;
      if (skip !== 'color' && state.color.length && state.color.indexOf(p.color) === -1) return false;
      if (skip !== 'style' && state.style.length && state.style.indexOf(p.style) === -1) return false;
      // Товары без цены из ценового диапазона не выкидываем: цена там
      // не значит «дороже максимума».
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

    /* Наличие отдельной группой в колонке фильтров. Включает его вариант
       (o.stockGroup): там, где переключатель наличия стоит только над
       списком, из основного каталога в наличие иначе не попасть —
       человек должен догадаться нажать на строку над сеткой. */
    function stockChecks(title) {
      var counts = { in: 0, order: 0 };
      D.products.forEach(function (p) {
        var saved = state.stock;
        state.stock = 'all';
        var ok = match(p);
        state.stock = saved;
        if (!ok) return;
        if (p.stock === 'order') counts.order++; else counts.in++;
      });

      /* Галочками наличие тоже выбирается набором: отмечены обе — это
         и есть «все», поэтому отдельная строка «Все» их снимает. */
      var multi = !!o.multiNav;
      var kind = multi ? 'checkbox' : 'radio';

      var opts = [
        ['all', 'Все', counts.in + counts.order],
        ['in', 'В наличии', counts.in],
        ['order', 'Под заказ', counts.order],
      ];

      return '<div class="fgroup fgroup--nav fgroup--stock"><b>' + title + '</b>' +
        opts.map(function (o2) {
          var on = o2[0] === 'all' ? state.stock === 'all' : state.stock === o2[0];
          return '<label><input type="' + kind + '" name="r-stock" ' +
            (multi && o2[0] !== 'all' ? 'data-sm' : 'data-s') + ' value="' + o2[0] + '"' +
            (on ? ' checked' : '') + '>' +
            '<span>' + o2[1] + '</span><span class="n">' + o2[2] + '</span></label>';
        }).join('') + '</div>';
    }

    /* Помещение и тип мебели: переключателями (по одному) или галочками
       (сколько угодно) — решает вариант через o.multiNav. Разметка группы
       и подсчёты общие, различается только тип поля и обработчик. */
    function radios(field, title, dict) {
      var counts = facet(field);
      var keys = Object.keys(dict).filter(function (k) { return counts[k]; });
      if (!keys.length) return '';

      // «Все» считает то же самое, но без условий своей группы.
      var total = D.products.filter(function (p) {
        var saved = state[field];
        state[field] = [];
        var ok = match(p, field);
        state[field] = saved;
        return ok;
      }).length;

      var multi = !!o.multiNav;
      var kind = multi ? 'checkbox' : 'radio';
      var none = !state[field].length;

      return '<div class="fgroup fgroup--nav"><b>' + title + '</b>' +
        '<label><input type="' + kind + '" name="r-' + field + '" ' +
          (multi ? 'data-all="' + field + '"' : 'data-r="' + field + '" value=""') +
          (none ? ' checked' : '') + '><span>Все</span>' +
          '<span class="n">' + total + '</span></label>' +
        keys.map(function (k) {
          var on = state[field].indexOf(k) !== -1;
          return '<label><input type="' + kind + '" name="r-' + field + '" ' +
            (multi ? 'data-f' : 'data-r') + '="' + field +
            '" value="' + k + '"' + (on ? ' checked' : '') + '>' +
            '<span>' + esc(dict[k]) + '</span><span class="n">' + counts[k] + '</span></label>';
        }).join('') + '</div>';
    }

    function url() {
      var u = new URLSearchParams();
      if (state.stock !== 'all') u.set('stock', state.stock);
      ['room', 'type', 'factory', 'material', 'color', 'style'].forEach(function (f) {
        if (state[f].length) u.set(f, state[f].join(','));
      });
      if (state.min !== LO) u.set('min', state.min);
      if (state.max !== HI) u.set('max', state.max);
      if (state.sort !== 'default') u.set('sort', state.sort);
      var s = u.toString();
      // Некоторые браузеры запрещают менять адрес у страницы, открытой
      // с диска. Макет от этого падать не должен: адрес — удобство,
      // а не условие работы каталога.
      try {
        history.replaceState(null, '', s ? '?' + s : location.pathname);
      } catch (e) {}
    }

    /* Чипы снятия фильтров — их показывает только тот вариант,
       который их заказал разметкой. */
    function chips() {
      var box = o.chips && $(o.chips);
      if (!box) return;

      var out = [];
      if (state.stock !== 'all') {
        out.push(chip('stock', '', state.stock === 'in' ? 'В наличии' : 'Под заказ'));
      }
      /* Каждое выбранное помещение и каждый тип — своим чипом: снимается
         по одному, а не всей группой. */
      state.room.forEach(function (v) { out.push(chip('room', v, D.ROOMS[v])); });
      state.type.forEach(function (v) { out.push(chip('type', v, D.TYPES[v])); });
      ['factory', 'material', 'color', 'style'].forEach(function (f) {
        state[f].forEach(function (v) { out.push(chip(f, v, v)); });
      });
      if (state.min !== LO || state.max !== HI) {
        out.push(chip('price', '', money(state.min) + ' — ' + money(state.max)));
      }

      box.innerHTML = out.length
        ? out.join('') + '<button class="chip chip--all" data-chip="all" data-v="">Сбросить всё</button>'
        : '';

      $$('[data-chip]', box).forEach(function (b) {
        b.addEventListener('click', function () {
          var f = b.dataset.chip, v = b.dataset.v;
          if (f === 'all') {
            state.factory = []; state.material = []; state.color = []; state.style = [];
            state.min = LO; state.max = HI; state.stock = 'all';
            state.room = []; state.type = [];
          } else if (f === 'price') {
            state.min = LO; state.max = HI;
          } else if (f === 'stock') {
            state.stock = 'all';
          } else {
            state[f] = state[f].filter(function (x) { return x !== v; });
          }
          paintSwitch();
          render();
        });
      });
    }

    function chip(f, v, label) {
      return '<button class="chip" data-chip="' + f + '" data-v="' + esc(v) + '">' +
        esc(label) + '<span aria-hidden="true">×</span></button>';
    }

    function render() {
      var list = D.products.filter(function (p) { return match(p); });

      if (state.sort === 'cheap') list.sort(function (a, b) { return (a.price || 1e12) - (b.price || 1e12); });
      if (state.sort === 'rich') list.sort(function (a, b) { return (b.price || 0) - (a.price || 0); });
      if (state.sort === 'stock') list.sort(function (a, b) { return (a.stock === 'order') - (b.stock === 'order'); });

      grid.innerHTML = list.length
        ? list.map(o.card).join('')
        : '<div class="empty"><h3>По этим условиям ничего нет</h3>' +
          '<p>Попробуйте снять часть фильтров или расширить диапазон цены.</p></div>';
      grid.classList.toggle('is-empty', !list.length);
      bindAdd(grid, o.addLabels);

      if (o.found) {
        $(o.found).textContent = list.length + ' ' +
          plural(list.length, ['позиция', 'позиции', 'позиций']);
      }

      $(o.filters).innerHTML =
        (o.stockGroup ? stockChecks('Наличие') : '') +
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
          '<div class="fnote">Позиции без цены показываются всегда</div>' +
        '</div>' +
        checks('factory', 'Фабрика') +
        checks('material', 'Материал') +
        checks('color', 'Цвет') +
        checks('style', 'Стиль') +
        '<button class="freset" id="freset">Сбросить фильтры</button>';

      bindFilters();
      paintTitle();
      chips();
      url();

      /* Вариант может дорисовать свою часть каталога — например, ленту
         марок над сеткой в BrandGallery B. Отдаём ему состояние и способ
         перерисовать список. */
      if (o.after) o.after(state, { render: render, LO: LO, HI: HI });
    }

    function paintTitle() {
      var parts = [];
      /* Заголовок перечисляет выбранное, пока это читается строкой.
         Дальше — «Каталог» и чипы: «Гостиная, Спальня, Кухни, Кабинет,
         Детская в наличии» уже не заголовок, а список. */
      var named = state.room.map(function (k) { return D.ROOMS[k]; })
        .concat(state.type.map(function (k) { return D.TYPES[k]; }));
      if (named.length && named.length <= 3) parts = named;

      var title = parts.length ? parts.join(' · ') : 'Каталог';
      if (state.stock === 'in') title += ' в наличии';
      if (state.stock === 'order') title += ' под заказ';

      if (o.title) $(o.title).textContent = title;
      document.title = title + ' — Brand Gallery, Краснодар';

      if (o.crumbs) {
        var crumbs = '<a href="index.html">Главная</a><span>·</span>' +
          '<a href="catalog.html">Каталог</a>';
        /* Хлебные крошки — путь, а не список условий: они показывают
           раздел только когда он один. */
        if (state.room.length === 1) {
          crumbs += '<span>·</span><a href="catalog.html?room=' + state.room[0] + '">' +
            D.ROOMS[state.room[0]] + '</a>';
        }
        if (state.type.length === 1) crumbs += '<span>·</span>' + D.TYPES[state.type[0]];
        $(o.crumbs).innerHTML = crumbs;
      }
    }

    function bindFilters() {
      var box = $(o.filters);

      // Одиночный выбор: в списке остаётся ровно один пункт или ни одного.
      $$('[data-r]', box).forEach(function (rb) {
        rb.addEventListener('change', function () {
          state[rb.dataset.r] = rb.value ? [rb.value] : [];
          render();
        });
      });

      // Строка «Все» в группе с галочками: снимает всю группу.
      $$('[data-all]', box).forEach(function (cb) {
        cb.addEventListener('change', function () {
          state[cb.dataset.all] = [];
          render();
        });
      });

      /* Наличие из колонки фильтров и переключатель над списком — одно
         и то же состояние: после выбора перекрашиваем и его. */
      $$('[data-s]', box).forEach(function (rb) {
        rb.addEventListener('change', function () {
          state.stock = rb.value;
          paintSwitch();
          render();
        });
      });

      /* Наличие галочками: отмечены обе — это «все», снята последняя —
         тоже «все». Пустой список тут означал бы каталог без товаров. */
      $$('[data-sm]', box).forEach(function (cb) {
        cb.addEventListener('change', function () {
          var on = $$('[data-sm]', box).filter(function (x) { return x.checked; });
          state.stock = on.length === 1 ? on[0].value : 'all';
          paintSwitch();
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
          b.textContent = on ? 'Свернуть' : 'Показать все · ' + $$('label', g).length;
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

      // Раздел при сбросе сохраняем: это навигация, а не фильтр.
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

    if (o.sort && $(o.sort)) {
      $(o.sort).value = state.sort;
      $(o.sort).addEventListener('change', function () { state.sort = this.value; render(); });
    }

    // Панель фильтров на телефоне открывается кнопкой на весь экран.
    if (o.open && $(o.open)) {
      $(o.open).addEventListener('click', function () {
        $(o.filters).classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    }
    if (o.close && $(o.close)) {
      $(o.close).addEventListener('click', function () {
        $(o.filters).classList.remove('is-open');
        document.body.style.overflow = '';
      });
    }

    paintSwitch();
    render();
  }

  /* ------------------------------------------------- подборка и заявка */

  /* Оплаты на сайте нет: человек складывает позиции и отправляет одной
     заявкой. Логика одинакова во всех вариантах, различается оформлением
     и тем, где живёт форма. */
  function request(o) {
    var box = $(o.picked);
    if (!box) return;

    function paint() {
      var list = picked().map(byId).filter(Boolean);

      if (!list.length) {
        box.innerHTML = '<div class="picked__empty">' +
          '<h3>Подборка пуста</h3>' +
          '<p>Отметьте в каталоге всё, что хотите обсудить, ' +
          'и отправьте одной заявкой.</p>' +
          '<a class="btn" href="catalog.html">Перейти в каталог</a></div>';
        if (o.sum) $(o.sum).innerHTML = '';
        return;
      }

      box.innerHTML = list.map(function (p) {
        return '<div class="picked__row">' +
          ph(p.type, p.id) +
          '<div>' +
            '<a class="picked__name" href="' + (o.product || 'product.html') + '?id=' + p.id + '">' +
              esc(p.name) + '</a>' +
            '<div class="picked__meta">' + esc(p.factory) + ' · ' + D.STOCK[p.stock] +
              (p.lead ? ' · ' + p.lead : '') + '</div>' +
          '</div>' +
          '<div class="picked__price">' +
            (p.price ? money(p.price) : '<span class="muted">ещё нет цены</span>') + '</div>' +
          '<button class="picked__x" data-del="' + p.id + '" ' +
            'aria-label="Убрать из подборки">×</button>' +
          '</div>';
      }).join('');

      var known = list.filter(function (p) { return p.price; });
      var total = known.reduce(function (s, p) { return s + p.price; }, 0);

      if (o.sum) {
        $(o.sum).innerHTML = known.length
          ? '<span class="sum__lab">' + (o.sumLabel || 'С известной ценой') + '</span>' +
            '<b>' + money(total) + '</b>' +
            (known.length < list.length
              ? '<span class="sum__note">по остальным ' + (list.length - known.length) + ' ' +
                plural(list.length - known.length, ['позиции', 'позициям', 'позициям']) +
                ' цену уточним в ответе</span>'
              : '')
          : '<span class="sum__note">Цены по всем позициям уточним в ответе</span>';
      }

      $$('[data-del]', box).forEach(function (b) {
        b.addEventListener('click', function () { toggle(Number(b.dataset.del)); paint(); });
      });
    }

    paint();

    if (new URLSearchParams(location.search).get('showroom')) {
      var cb = $('input[value="Записаться в шоурум"]');
      if (cb) cb.checked = true;
    }

    var form = $(o.form);
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        form.hidden = true;
        $(o.sent).hidden = false;
        $(o.sent).scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  /* --------------------------------------------------------- появление */

  function reveal() {
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

  return {
    D: D, $: $, $$: $$, esc: esc, money: money, plural: plural,
    picked: picked, toggle: toggle, paintCount: paintCount, bindAdd: bindAdd,
    byId: byId, ART: ART, ROOM_ART: ROOM_ART, art: art, ph: ph,
    initSearch: initSearch, catalog: catalog, request: request,
    reveal: reveal,
  };
})();
