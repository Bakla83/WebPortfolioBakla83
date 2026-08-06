/*
  Сборка страницы: галерея, студия перекраса, справочник мастей, этапы,
  вопросы, форма и навигация.

  Общий принцип — весь текст живёт в js/i18n.js, вся геометрия лошадей в
  js/horses.js, а здесь только то, что их соединяет. Поэтому почти каждый
  блок собирается функцией render*(), и при смене языка эти же функции
  вызываются заново: перевод динамических карточек иначе пришлось бы
  дублировать в разметке.

  Художественная часть работ (масть, поза, отметины) намеренно не в
  словарях: она одинакова для обоих языков и меняться при переключении
  языка не должна — иначе гнедая лошадь на английской версии внезапно
  становилась бы серой.
*/
window.Centipede = window.Centipede || {};

(function (ns) {
  'use strict';

  const i18n = ns.i18n;
  const H = ns.horses;

  const PALETTE_KEY = 'centipede-palette';
  const CALM_KEY = 'centipede-calm';

  /* Масти восьми работ — только для подписи под карточкой. Индексы
     совпадают с i18n.works.items. Рисованных лошадей в галерее нет
     намеренно: рядом с настоящими фотографиями рисунок всегда проигрывает,
     поэтому до появления снимков карточка честно показывает пустую рамку. */
  /* Масти проставлены по тому, что видно на фотографиях в img/. Сверьте с
     реальными работами: снимок и подпись расходятся заметнее всего именно
     здесь, а посетитель из конной миниатюры такое ловит сразу. */
  const WORK_COATS = [
    'appaloosa', 'cremello', 'palomino', 'pinto',
    'grey', 'chestnut', 'buckskin', 'buckskin',
  ];


  /* Состояние студии. seed фиксирован: узор масти не должен перестраиваться
     от смены отметины — это выглядело бы как подмена модели. */
  const studio = { coat: 'bay', face: 'blaze', socks: 2, pose: 'stand', seed: 29 };

  const FACES = ['none', 'star', 'blaze', 'bald'];
  const SOCKS = [0, 2, 4];
  const POSES = ['alert', 'stand', 'step', 'low'];

  let bg = null;

  /* ---------------------------------------------------------- утилиты --- */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* Строки из словарей попадают в innerHTML только через это: в переводе
     однажды окажется кавычка или амперсанд, и разметку порвёт молча. */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* --------------------------------------------------------- галерея --- */

  function renderWorks() {
    const grid = $('#works-grid');
    if (!grid) return;
    const d = i18n.dict().works;
    grid.innerHTML = '';

    d.items.forEach(function (item, i) {
      const coatName = i18n.t('coats.names.' + (WORK_COATS[i] || WORK_COATS[0]));

      const card = el('article', 'work reveal');
      card.style.setProperty('--i', i);

      const figure = el('div', 'work__figure');
      figure.innerHTML =
        '<div class="work__empty">' +
          '<svg class="work__empty-icon" viewBox="0 0 32 26" aria-hidden="true">' +
            '<rect x="1" y="1" width="30" height="24" rx="3" fill="none" ' +
              'stroke="currentColor" stroke-width="1.4"/>' +
            '<circle cx="10" cy="9" r="3" fill="none" stroke="currentColor" ' +
              'stroke-width="1.4"/>' +
            '<path d="M2 21 L12 13 L19 19 L24 15 L30 20" fill="none" ' +
              'stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' +
          '</svg>' +
          '<span class="work__empty-text">' + esc(d.photoSoon) + '</span>' +
        '</div>';

      /* Если рядом с index.html лежит img/work-1.jpg — карточка показывает
         фотографию вместо рамки. Проверка идёт загрузкой, а не запросом
         списка файлов: у статичной страницы нет способа заглянуть в папку,
         зато неудачная загрузка ничего не стоит и просто оставляет рамку. */
      const probe = new Image();
      probe.onload = function () {
        const img = el('img', 'work__photo');
        img.src = probe.src;
        img.alt = item.name + ' — ' + coatName;
        img.loading = 'lazy';
        figure.innerHTML = '';
        figure.appendChild(img);
        figure.classList.add('work__figure--photo');
      };
      probe.src = 'img/work-' + (i + 1) + '.jpg';

      const body = el('div', 'work__body');
      body.appendChild(el('h3', 'work__name', item.name));

      /* Масштаб и статус выводятся, только если заполнены. Пустая строка в
         словаре — это «пока неизвестно», и придумывать за автора, продана
         модель или нет, страница не должна. */
      const meta = el('p', 'work__meta');
      meta.appendChild(el('span', null, coatName));
      if (item.scale) {
        meta.appendChild(el('span', 'work__dot', '·'));
        meta.appendChild(el('span', null, d.scale + ' ' + item.scale));
      }
      body.appendChild(meta);

      if (item.status) {
        body.appendChild(el('span',
          'work__status work__status--' + item.status,
          item.status === 'sold' ? d.sold : d.available));
      }

      card.appendChild(figure);
      card.appendChild(body);
      grid.appendChild(card);
    });

    observeReveal(grid);
  }

  /* ---------------------------------------------------------- студия --- */

  /* Четыре строки карточки — то же, что уходит в заявку. Пары «подпись —
     значение», а не одна строка через запятую: «Гнедая, две задние» без
     подписи читается как загадка, а с подписью — как паспорт модели. */
  function studioSpec() {
    return [
      [i18n.t('studio.coat'),  i18n.t('coats.names.' + studio.coat)],
      [i18n.t('studio.face'),  i18n.t('studio.faceNames.' + studio.face)],
      [i18n.t('studio.socks'), i18n.t('studio.socksNames.' + studio.socks)],
      [i18n.t('studio.pose'),  i18n.t('studio.poseNames.' + studio.pose)],
    ];
  }

  function renderStudioHorse() {
    const stage = $('#studio-stage');
    if (!stage) return;

    /* Класс ставится в том же кадре, что и новая разметка: браузер успевает
       показать только конечное состояние, и масть проявляется, а не
       переключается рывком. */
    stage.classList.add('is-swapping');
    stage.innerHTML = H.svg({
      coat: studio.coat, pose: studio.pose, face: studio.face,
      socks: studio.socks, seed: studio.seed,
      label: i18n.t('a11y.horsePreview') + i18n.t('coats.names.' + studio.coat),
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { stage.classList.remove('is-swapping'); });
    });

    const cap = $('#studio-caption');
    if (cap) cap.textContent = i18n.t('coats.names.' + studio.coat);

    const note = $('#studio-note');
    if (note) note.textContent = i18n.t('coats.notes.' + studio.coat);

    const spec = $('#studio-spec');
    if (spec) {
      spec.innerHTML = '';
      studioSpec().forEach(function (row) {
        const item = el('div', 'studio__spec-row');
        item.appendChild(el('dt', null, esc(row[0])));
        item.appendChild(el('dd', null, esc(row[1])));
        spec.appendChild(item);
      });
    }
  }

  /* Кнопки-образцы мастей: сам образец красится тем же цветом, что и
     корпус модели, поэтому выбирать приходится глазами, а не по названию. */
  function renderCoatSwatches() {
    const box = $('#studio-coats');
    if (!box) return;
    box.innerHTML = '';

    H.COAT_ORDER.forEach(function (key) {
      const c = H.COATS[key];
      const b = el('button', 'swatch');
      b.type = 'button';
      b.dataset.coat = key;
      b.setAttribute('aria-pressed', String(key === studio.coat));
      b.setAttribute('aria-label', i18n.t('coats.names.' + key));
      b.title = i18n.t('coats.names.' + key);
      b.style.setProperty('--sw-body', c.body);
      b.style.setProperty('--sw-mane', c.mane);
      b.innerHTML = '<span class="swatch__body" aria-hidden="true"></span>' +
        '<span class="swatch__mane" aria-hidden="true"></span>';
      box.appendChild(b);
    });
  }

  /* Переключатели с одинаковым поведением: три группы кнопок отличаются
     только полем состояния, поэтому строятся одной функцией. */
  function renderChoices(boxId, field, values, labelFn) {
    const box = $(boxId);
    if (!box) return;
    box.innerHTML = '';
    values.forEach(function (v) {
      const b = el('button', 'chip', labelFn(v));
      b.type = 'button';
      b.dataset.value = String(v);
      b.dataset.field = field;
      b.setAttribute('aria-pressed', String(studio[field] === v));
      box.appendChild(b);
    });
  }

  function renderStudioControls() {
    renderCoatSwatches();
    renderChoices('#studio-face', 'face', FACES,
      function (v) { return i18n.t('studio.faceNames.' + v); });
    renderChoices('#studio-socks', 'socks', SOCKS,
      function (v) { return i18n.t('studio.socksNames.' + v); });
    renderChoices('#studio-pose', 'pose', POSES,
      function (v) { return i18n.t('studio.poseNames.' + v); });
  }

  function setStudio(field, value) {
    studio[field] = value;
    renderStudioHorse();
    syncStudioControls();
  }

  function syncStudioControls() {
    $$('#studio-coats .swatch').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.coat === studio.coat));
    });
    $$('.studio__choices .chip').forEach(function (b) {
      const f = b.dataset.field;
      const raw = b.dataset.value;
      const v = f === 'socks' ? Number(raw) : raw;
      b.setAttribute('aria-pressed', String(studio[f] === v));
    });
  }

  function bindStudio() {
    const coats = $('#studio-coats');
    if (coats) {
      coats.addEventListener('click', function (e) {
        const b = e.target.closest('.swatch');
        if (b) setStudio('coat', b.dataset.coat);
      });

      /* Десять образцов подряд — это десять нажатий Tab, чтобы дойти до
         последнего. Стрелки переводят выбор между ними так же, как в любой
         группе радиокнопок, и фокус едет следом. */
      coats.addEventListener('keydown', function (e) {
        const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1
          : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        const order = H.COAT_ORDER;
        const next = order[(order.indexOf(studio.coat) + step + order.length) % order.length];
        setStudio('coat', next);
        const btn = coats.querySelector('.swatch[data-coat="' + next + '"]');
        if (btn) btn.focus();
      });
    }

    $$('.studio__choices').forEach(function (box) {
      box.addEventListener('click', function (e) {
        const b = e.target.closest('.chip');
        if (!b) return;
        const f = b.dataset.field;
        setStudio(f, f === 'socks' ? Number(b.dataset.value) : b.dataset.value);
      });
    });

    const rnd = $('#studio-random');
    if (rnd) {
      rnd.addEventListener('click', function () {
        studio.coat = H.COAT_ORDER[Math.floor(Math.random() * H.COAT_ORDER.length)];
        studio.face = FACES[Math.floor(Math.random() * FACES.length)];
        studio.socks = SOCKS[Math.floor(Math.random() * SOCKS.length)];
        studio.pose = POSES[Math.floor(Math.random() * POSES.length)];
        // Зерно тоже меняется: «случайная» должна давать и новый рисунок
        // яблок, иначе серая всегда выглядит одинаково.
        studio.seed = Math.floor(Math.random() * 9999) + 1;
        renderStudioHorse();
        syncStudioControls();
      });
    }

    /* Формы на странице нет, поэтому «Хочу такую» делает то единственное,
       что здесь имеет смысл: кладёт карточку модели в буфер и уводит к
       контактам. Дальше человек вставляет её в личное сообщение — ровно
       тот текст, который иначе пришлось бы набирать руками. */
    const toOrder = $('#studio-to-order');
    if (toOrder) {
      toOrder.addEventListener('click', function () {
        const text = studioSpec().map(function (row) {
          return row[0] + ': ' + row[1];
        }).join('\n');

        try {
          navigator.clipboard.writeText(text);
        } catch (err) {
          // Буфер может быть недоступен (файл открыт локально, старый
          // браузер) — тогда просто уводим к контактам без копирования.
        }

        const done = $('#studio-copied');
        if (done) {
          done.hidden = false;
          clearTimeout(toOrder._t);
          toOrder._t = setTimeout(function () { done.hidden = true; }, 2600);
        }

        const contacts = $('#contacts');
        if (contacts) contacts.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  /* ----------------------------------------------------- справочник --- */

  function renderCoats() {
    const grid = $('#coats-grid');
    if (!grid) return;
    grid.innerHTML = '';

    H.COAT_ORDER.forEach(function (key, i) {
      const card = el('button', 'coat reveal');
      card.type = 'button';
      card.dataset.coat = key;
      card.style.setProperty('--i', i);

      const fig = el('div', 'coat__figure');
      fig.innerHTML = H.svg({
        coat: key, pose: 'stand', face: 'none', socks: 0,
        seed: 100 + i * 7, ground: false,
      });

      card.appendChild(fig);
      card.appendChild(el('h3', 'coat__name', i18n.t('coats.names.' + key)));
      card.appendChild(el('p', 'coat__note', i18n.t('coats.notes.' + key)));
      grid.appendChild(card);
    });

    /* Наведение переодевает модель в студии. Клик делает то же самое —
       на телефоне никакого наведения нет, а поведение должно совпадать. */
    function pickFrom(e) {
      const c = e.target.closest('.coat');
      if (c) setStudio('coat', c.dataset.coat);
    }
    grid.addEventListener('pointerover', function (e) {
      if (e.pointerType === 'mouse') pickFrom(e);
    });
    grid.addEventListener('click', pickFrom);

    observeReveal(grid);
  }

  /* ---------------------------------------------------------- этапы --- */

  function renderProcess() {
    const list = $('#process-list');
    if (!list) return;
    list.innerHTML = '';

    i18n.dict().process.steps.forEach(function (s, i) {
      const li = el('li', 'step reveal');
      li.style.setProperty('--i', i);
      li.appendChild(el('span', 'step__num', String(i + 1).padStart(2, '0')));
      const b = el('div', 'step__body');
      b.appendChild(el('h3', 'step__title', s.t));
      b.appendChild(el('p', 'step__text', s.d));
      li.appendChild(b);
      list.appendChild(li);
    });

    observeReveal(list);
  }

  /* -------------------------------------------------------- вопросы --- */

  function renderFaq() {
    const list = $('#faq-list');
    if (!list) return;
    list.innerHTML = '';

    i18n.dict().faq.items.forEach(function (item, i) {
      const wrap = el('div', 'faq__item reveal');
      wrap.style.setProperty('--i', i);

      const btn = el('button', 'faq__q');
      btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false');
      btn.id = 'faq-q-' + i;
      btn.setAttribute('aria-controls', 'faq-a-' + i);
      btn.innerHTML = '<span>' + item.q + '</span><span class="faq__mark" aria-hidden="true"></span>';

      const ans = el('div', 'faq__a');
      ans.id = 'faq-a-' + i;
      ans.setAttribute('role', 'region');
      ans.setAttribute('aria-labelledby', 'faq-q-' + i);
      ans.hidden = true;
      ans.appendChild(el('p', null, item.a));

      btn.addEventListener('click', function () {
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        ans.hidden = open;
        wrap.classList.toggle('is-open', !open);
      });

      wrap.appendChild(btn);
      wrap.appendChild(ans);
      list.appendChild(wrap);
    });

    observeReveal(list);
  }

  /* ------------------------------------------------------ навигация --- */

  function initHeader() {
    const header = $('.site-header');
    const burger = $('#burger');
    const nav = $('#site-nav');

    if (burger && nav) {
      burger.addEventListener('click', function () {
        const open = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', String(!open));
        nav.classList.toggle('is-open', !open);
        document.body.classList.toggle('is-locked', !open);
      });

      nav.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
          burger.setAttribute('aria-expanded', 'false');
          nav.classList.remove('is-open');
          document.body.classList.remove('is-locked');
        }
      });
    }

    if (header) {
      const onScroll = function () {
        header.classList.toggle('is-stuck', (window.scrollY || 0) > 24);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* Подсветка текущего раздела в меню. IntersectionObserver вместо
       расчёта позиций на каждый кадр прокрутки. */
    const links = $$('#site-nav a');
    const map = {};
    links.forEach(function (a) {
      const id = a.getAttribute('href').slice(1);
      if (id) map[id] = a;
    });

    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-current'); });
        const a = map[en.target.id];
        if (a) a.classList.add('is-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    Object.keys(map).forEach(function (id) {
      const sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });
  }

  /* -------------------------------------------------------- палитра --- */

  function initPalette() {
    const box = $('#palette');
    if (!box) return;

    box.addEventListener('click', function (e) {
      const b = e.target.closest('[data-palette]');
      if (!b) return;
      const v = b.dataset.palette;
      document.documentElement.setAttribute('data-palette', v);
      try { localStorage.setItem(PALETTE_KEY, v); } catch (err) {}
      syncPalette();
      // Фон читает цвета из тех же переменных — ему надо сказать, что
      // они изменились, иначе взвесь останется в старой палитре.
      if (bg) bg.refresh();
    });

    syncPalette();
  }

  function syncPalette() {
    const cur = document.documentElement.getAttribute('data-palette') || 'bay';
    $$('#palette [data-palette]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.palette === cur));
    });
  }

  function initCalm() {
    const btn = $('#calm-toggle');
    if (!btn) return;

    function sync() {
      const on = document.documentElement.hasAttribute('data-calm');
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', i18n.t(on ? 'a11y.calmOn' : 'a11y.calm'));
      if (bg) bg.setCalm(on);
    }

    btn.addEventListener('click', function () {
      const on = document.documentElement.hasAttribute('data-calm');
      if (on) document.documentElement.removeAttribute('data-calm');
      else document.documentElement.setAttribute('data-calm', '');
      try { localStorage.setItem(CALM_KEY, on ? '0' : '1'); } catch (e) {}
      sync();
    });

    i18n.onChange(sync);
    sync();
  }

  /* ---------------------------------------------------------- герой --- */

  function initHero() {
    /* Заголовок разбирается на буквы для волны появления. Пробелы
       заменяются неразрывными: иначе строка схлопывается, потому что
       каждый span становится отдельным inline-блоком. */
    $$('[data-kinetic]').forEach(function (node) {
      const text = node.textContent;
      node.setAttribute('aria-label', text);
      node.textContent = '';
      text.split('').forEach(function (ch, i) {
        const s = el('span', 'kin');
        s.textContent = ch === ' ' ? ' ' : ch;
        s.style.setProperty('--k', i);
        s.setAttribute('aria-hidden', 'true');
        node.appendChild(s);
      });
    });

    const garden = $('#hero-garden');
    if (garden) {
      $$('[data-horse]', garden).forEach(function (slot) {
        slot.innerHTML = H.svg({
          coat: slot.dataset.horse,
          pose: slot.dataset.pose || 'stand',
          face: slot.dataset.face || 'none',
          socks: Number(slot.dataset.socks || 0),
          seed: Number(slot.dataset.seed || 5),
          ground: false,
          // Лошади в герое растворены до 16% непрозрачности и лежат под
          // текстом. Считать для них размытую светотень — это четыре
          // лишних фильтра на первый экран ради того, чего не видно.
          detail: 'lite',
        });
      });

      /* Параллакс: чем больше data-depth, тем «ближе» лошадь к зрителю и
         тем сильнее она смещается за курсором. Считается в rAF, потому
         что pointermove приходит чаще, чем экран успевает перерисоваться. */
      let px = 0, py = 0, tick = false;
      window.addEventListener('pointermove', function (e) {
        px = (e.clientX / window.innerWidth - 0.5) * 2;
        py = (e.clientY / window.innerHeight - 0.5) * 2;
        if (tick) return;
        tick = true;
        requestAnimationFrame(function () {
          tick = false;
          if (document.documentElement.hasAttribute('data-calm')) return;
          $$('[data-depth]', garden).forEach(function (n) {
            const d = Number(n.dataset.depth) || 0;
            n.style.setProperty('--px', (-px * d).toFixed(1) + 'px');
            n.style.setProperty('--py', (-py * d * 0.5).toFixed(1) + 'px');
          });
        });
      }, { passive: true });
    }
  }

  /* ------------------------------------------------------ появление --- */

  let revealObserver = null;

  function observeReveal(root) {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add('is-in');
          revealObserver.unobserve(en.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    }
    $$('.reveal', root || document).forEach(function (n) {
      if (!n.classList.contains('is-in')) revealObserver.observe(n);
    });
  }

  /* ----------------------------------------------------------- старт --- */

  function renderAll() {
    renderWorks();
    renderStudioControls();
    renderStudioHorse();
    renderCoats();
    renderProcess();
    renderFaq();
  }

  function start() {
    i18n.init();

    bg = ns.background.init($('#bg-canvas'));

    initHeader();
    initPalette();
    initCalm();
    initHero();
    bindStudio();
    renderAll();
    observeReveal();

    $$('.lang__btn').forEach(function (b) {
      b.addEventListener('click', function () { i18n.set(b.dataset.lang); });
    });

    i18n.onChange(function (lang) {
      $$('.lang__btn').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
      });
      renderAll();
      syncStudioControls();
    });

    $$('.lang__btn').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === i18n.lang));
    });

    document.body.classList.add('is-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})(window.Centipede);
