(function () {
  'use strict';

  const ns = window.Pervotsvet;
  const i18n = ns.i18n;
  const flowers = ns.flowers;

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  const reducedMotion = () =>
    document.documentElement.hasAttribute('data-calm') ||
    matchMedia('(prefers-reduced-motion: reduce)').matches;

  function t(key) {
    return i18n.t(i18n.get(), key);
  }

  const BOUQUETS = [
    { id: 'first-morning', mix: ['tulip', 'daisy', 'craspedia', 'daisy', 'tulip'], price: { ru: 3200, en: 42 } },
    { id: 'powder', mix: ['rose', 'peony', 'ranunculus', 'peony', 'rose'], price: { ru: 5400, en: 69 } },
    { id: 'field', mix: ['lavender', 'daisy', 'craspedia', 'daisy', 'lavender'], price: { ru: 2400, en: 32 } },
    { id: 'lilac', mix: ['lavender', 'anemone', 'ranunculus', 'anemone', 'lavender'], price: { ru: 4100, en: 54 } },
    { id: 'apricot', mix: ['rose', 'ranunculus', 'tulip', 'ranunculus', 'rose'], price: { ru: 3900, en: 51 } },
    { id: 'garden', mix: ['anemone', 'peony', 'daisy', 'peony', 'anemone'], price: { ru: 6200, en: 79 } },
  ];

  const STEM_PRICE = {
    tulip: { ru: 190, en: 3 },
    peony: { ru: 450, en: 6 },
    rose: { ru: 320, en: 4 },
    daisy: { ru: 140, en: 2 },
    ranunculus: { ru: 380, en: 5 },
    anemone: { ru: 290, en: 4 },
    craspedia: { ru: 130, en: 2 },
    lavender: { ru: 160, en: 2 },
  };

  const WRAP_PRICE = { ru: 350, en: 5 };
  const MAX_STEMS = 15;

  const PLANS = [
    { id: 'fortnight', price: { ru: 2900, en: 38 } },
    { id: 'weekly', price: { ru: 2400, en: 32 }, popular: true },
    { id: 'office', price: { ru: 7800, en: 99 } },
  ];

  const MONEY = {
    ru: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }),
    en: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
  };

  function money(value) {
    const lang = i18n.get();
    return (MONEY[lang] || MONEY.ru).format(value);
  }

  function priceOf(table) {
    return table[i18n.get()] !== undefined ? table[i18n.get()] : table.ru;
  }

  function flowerName(type) {
    return t('flowers.' + type) || type;
  }

  function renderCatalog() {
    const grid = $('#catalog-grid');
    if (!grid) return;

    grid.innerHTML = BOUQUETS.map(function (b) {
      const item = t('catalog.items.' + b.id) || { name: b.id, note: '' };
      return (
        '<article class="bouquet" data-reveal>' +
        '<div class="bouquet__art-wrap">' + flowers.bouquet(b.mix) + '</div>' +
        '<div class="bouquet__body">' +
        '<h3 class="bouquet__name">' + item.name + '</h3>' +
        '<p class="bouquet__note">' + item.note + '</p>' +
        '<div class="bouquet__foot">' +
        '<span class="bouquet__price"><i>' + t('catalog.from') + '</i>' + money(priceOf(b.price)) + '</span>' +
        '<button class="btn btn--quiet btn--sm" type="button" data-use-mix="' + b.id + '">' +
        t('catalog.add') + '</button>' +
        '</div></div></article>'
      );
    }).join('');

    $$('[data-use-mix]', grid).forEach(function (btn) {
      btn.addEventListener('click', function () {
        const bouquet = BOUQUETS.filter((b) => b.id === btn.dataset.useMix)[0];
        if (!bouquet) return;
        stems.length = 0;
        bouquet.mix.forEach(addStem);
        renderVase();
        $('#builder').scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
      });
    });

    observeReveals(grid);
  }

  function renderPlans() {
    const grid = $('#plans-grid');
    if (!grid) return;

    grid.innerHTML = PLANS.map(function (p) {
      const item = t('plans.items.' + p.id) || { name: p.id, note: '', features: [] };
      return (
        '<article class="plan' + (p.popular ? ' plan--popular' : '') + '" data-reveal>' +
        (p.popular ? '<span class="plan__badge">' + t('plans.popular') + '</span>' : '') +
        '<h3 class="plan__name">' + item.name + '</h3>' +
        '<p class="plan__note">' + item.note + '</p>' +
        '<p class="plan__price">' + money(priceOf(p.price)) +
        '<span class="plan__per">' + t('plans.per') + '</span></p>' +
        '<ul class="plan__features">' +
        item.features.map((f) => '<li>' + f + '</li>').join('') +
        '</ul>' +
        '<a class="btn ' + (p.popular ? 'btn--primary' : 'btn--ghost') + ' btn--wide" href="#contacts">' +
        t('plans.cta') + '</a>' +
        '</article>'
      );
    }).join('');

    observeReveals(grid);
  }

  function renderVoices() {
    const marquee = $('#voices-marquee');
    const list = $('#voices-list');
    const items = t('voices.items') || [];

    const card = (v) =>
      '<figure class="voice">' +
      '<blockquote>' + v.text + '</blockquote>' +
      '<figcaption><b>' + v.author + '</b><span>' + v.role + '</span></figcaption>' +
      '</figure>';

    if (marquee) {

      const row = items.map(card).join('');
      marquee.innerHTML = '<div class="voices__row">' + row + row + '</div>';
    }

    if (list) {
      list.innerHTML = items
        .map((v) => '<li>«' + v.text + '» — ' + v.author + ', ' + v.role + '</li>')
        .join('');
    }
  }

  const stems = [];
  let stemSeq = 0;

  function addStem(type) {
    if (stems.length >= MAX_STEMS) return false;
    stems.push({
      uid: ++stemSeq,
      type: type,

      len: 104 + Math.round(Math.random() * 52),
      bend: (Math.random() < 0.5 ? -1 : 1) * (8 + Math.random() * 16),
      lift: Math.round(Math.random() * 14),
    });
    return true;
  }

  function removeStem(uid) {
    const idx = stems.findIndex((s) => s.uid === uid);
    if (idx !== -1) {
      stems.splice(idx, 1);
      renderVase();
    }
  }

  function renderPicker() {
    const grid = $('#picker-grid');
    if (!grid) return;

    grid.innerHTML = flowers.types
      .map(function (type) {
        return (
          '<button class="picker__btn" type="button" data-flower-btn="' + type + '">' +
          '<span class="picker__art">' + flowers.svg(type) + '</span>' +
          '<span class="picker__name">' + flowerName(type) + '</span>' +
          '<span class="picker__price">' + money(priceOf(STEM_PRICE[type])) + '</span>' +
          '</button>'
        );
      })
      .join('');

    $$('[data-flower-btn]', grid).forEach(function (btn) {
      btn.setAttribute('aria-label', t('a11y.addFlower') + ' — ' + flowerName(btn.dataset.flowerBtn));
      btn.addEventListener('click', function () {
        if (addStem(btn.dataset.flowerBtn)) {
          btn.classList.remove('is-picked');

          void btn.offsetWidth;
          btn.classList.add('is-picked');
          renderVase();
        } else {
          flashLimit();
        }
      });
    });
  }

  const stemEls = new Map();

  function renderVase() {
    const stage = $('#vase-stage');
    const empty = $('#vase-empty');
    if (!stage) return;

    const n = stems.length;
    const alive = new Set(stems.map((s) => s.uid));

    stemEls.forEach(function (el, uid) {
      if (!alive.has(uid)) {
        el.remove();
        stemEls.delete(uid);
      }
    });

    stems.forEach(function (s, i) {
      const p = n === 1 ? 0.5 : i / (n - 1);

      const spread = Math.min(30, 7 + n * 1.7);
      const angle = n === 1 ? 0 : -spread + p * spread * 2;

      let btn = stemEls.get(s.uid);
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'stem';
        btn.style.setProperty('--lift', s.lift + 'px');
        btn.innerHTML = flowers.stem(s.type, { length: s.len, bend: s.bend });
        btn.addEventListener('click', function () {
          removeStem(s.uid);
        });
        stage.appendChild(btn);
        stemEls.set(s.uid, btn);
      }

      btn.style.setProperty('--angle', angle.toFixed(1) + 'deg');

      btn.style.zIndex = String(10 + Math.round((1 - Math.abs(p - 0.5) * 2) * 10));
      btn.setAttribute('aria-label', t('a11y.removeFlower') + ' — ' + flowerName(s.type));
    });

    if (empty) empty.hidden = n > 0;
    updateTally();
  }

  function updateTally() {
    const stemsTotal = stems.reduce((sum, s) => sum + priceOf(STEM_PRICE[s.type]), 0);
    const wrap = stems.length ? priceOf(WRAP_PRICE) : 0;

    const elStems = $('#tally-stems');
    const elWrap = $('#tally-wrap');
    const elTotal = $('#tally-total');

    if (elStems) elStems.textContent = String(stems.length);
    if (elWrap) elWrap.textContent = stems.length ? money(wrap) : '—';
    if (elTotal) elTotal.textContent = stems.length ? money(stemsTotal + wrap) : '—';

    const limit = $('#tally-limit');
    if (limit) limit.hidden = stems.length < MAX_STEMS;
  }

  function flashLimit() {
    const limit = $('#tally-limit');
    if (!limit) return;
    limit.hidden = false;
    limit.classList.remove('is-flash');
    void limit.offsetWidth;
    limit.classList.add('is-flash');
  }

  function setStatus(el, message) {
    if (!el) return;
    el.textContent = message;
    el.hidden = !message;
  }

  function initBuilder() {
    const clear = $('#builder-clear');
    const order = $('#builder-order');
    const status = $('#builder-status');

    if (clear) {
      clear.addEventListener('click', function () {
        stems.length = 0;
        renderVase();
        setStatus(status, '');
      });
    }

    if (order) {
      order.addEventListener('click', function () {
        if (!stems.length) {
          setStatus(status, t('builder.empty2'));
          return;
        }

        const counts = {};
        stems.forEach((s) => (counts[s.type] = (counts[s.type] || 0) + 1));
        const summary = Object.keys(counts)
          .map((type) => flowerName(type) + ' × ' + counts[type])
          .join(', ');

        const note = $('#f-note');
        if (note) note.value = summary;

        setStatus(status, t('builder.sent'));
        $('#contacts').scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
        const name = $('#f-name');
        if (name) setTimeout(() => name.focus({ preventScroll: true }), reducedMotion() ? 0 : 600);
      });
    }
  }

  function initForm() {
    const form = $('#order-form');
    if (!form) return;

    const status = $('#form-status');

    function validateField(input) {
      const error = $('[data-error-for="' + input.id + '"]', form);
      const ok = input.value.trim().length > 0;
      if (error) error.hidden = ok;
      input.setAttribute('aria-invalid', String(!ok));
      return ok;
    }

    $$('input[required]', form).forEach(function (input) {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const required = $$('input[required]', form);
      const firstBad = required.filter((input) => !validateField(input))[0];

      if (firstBad) {
        firstBad.focus();
        setStatus(status, '');
        return;
      }

      setStatus(status, t('contact.sent'));
      form.reset();
      required.forEach((input) => input.removeAttribute('aria-invalid'));
      $$('[data-error-for]', form).forEach((el) => (el.hidden = true));

      const rect = form.getBoundingClientRect();
      ns.background && ns.background.bloomAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  }

  function initLang() {
    $$('.lang__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        i18n.set(btn.dataset.lang);
      });
    });
  }

  function initMoods() {
    $$('[data-mood-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const mood = btn.dataset.moodBtn;
        document.documentElement.setAttribute('data-mood', mood);
        try {
          localStorage.setItem('pervotsvet-mood', mood);
        } catch (e) {}

        $$('[data-mood-btn]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));

        requestAnimationFrame(function () {
          ns.background && ns.background.refreshPalette();
        });
      });
    });

    const current = document.documentElement.getAttribute('data-mood');
    $$('[data-mood-btn]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.moodBtn === current)));
  }

  function initCalm() {
    const btn = $('#calm-toggle');
    if (!btn) return;

    function sync() {
      const calm = document.documentElement.hasAttribute('data-calm');
      btn.setAttribute('aria-pressed', String(calm));
      btn.setAttribute('aria-label', calm ? t('a11y.calmOn') : t('a11y.calm'));
    }

    btn.addEventListener('click', function () {
      const calm = !document.documentElement.hasAttribute('data-calm');
      document.documentElement.toggleAttribute('data-calm', calm);
      try {
        localStorage.setItem('pervotsvet-calm', calm ? '1' : '0');
      } catch (e) {}
      ns.background && ns.background.setCalm(calm);
      sync();
    });

    i18n.onChange(sync);
    sync();
  }

  function initNav() {
    const burger = $('#burger');
    const header = $('.site-header');

    if (burger && header) {
      burger.addEventListener('click', function () {
        const open = !header.classList.contains('is-open');
        header.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', String(open));
      });

      $$('.site-nav a').forEach(function (link) {
        link.addEventListener('click', function () {
          header.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    let ticking = false;
    window.addEventListener(
      'scroll',
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          header && header.classList.toggle('is-stuck', window.scrollY > 24);
          ticking = false;
        });
      },
      { passive: true }
    );

    const links = $$('.site-nav a');
    const map = {};
    links.forEach(function (a) {
      const id = a.getAttribute('href').slice(1);
      const section = document.getElementById(id);
      if (section) map[id] = a;
    });

    const spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach((a) => a.classList.remove('is-active'));
          const active = map[entry.target.id];
          if (active) active.classList.add('is-active');
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    Object.keys(map).forEach((id) => spy.observe(document.getElementById(id)));
  }

  let revealObserver = null;
  let firstBuild = true;

  function observeReveals(root) {

    if (!firstBuild) {
      $$('[data-reveal]', root).forEach((el) => el.classList.add('is-visible'));
      return;
    }
    if (!revealObserver) return;
    $$('[data-reveal]', root).forEach((el) => revealObserver.observe(el));
  }

  function initReveal() {

    $$('.section__title, .section__lead, .mood, .step, .voice, .contact__intro, .form, .builder__picker, .builder__stage')
      .forEach((el) => el.setAttribute('data-reveal', ''));

    if (!('IntersectionObserver' in window) || reducedMotion()) {
      $$('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
      return;
    }

    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    observeReveals(document);
  }

  function initCounters() {
    const nodes = $$('[data-count]');
    if (!nodes.length) return;

    if (reducedMotion() || !('IntersectionObserver' in window)) {
      nodes.forEach((el) => (el.textContent = el.dataset.count));
      return;
    }

    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);

          const el = entry.target;
          const target = parseInt(el.dataset.count, 10) || 0;
          const started = performance.now();
          const duration = 1100;

          (function tick(now) {
            const p = Math.min((now - started) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = String(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          })(started);
        });
      },
      { threshold: 0.5 }
    );

    nodes.forEach((el) => io.observe(el));
  }

  function splitKinetic() {
    $$('[data-kinetic]').forEach(function (el) {
      const text = el.textContent.trim().replace(/\s+/g, ' ');

      el.setAttribute('aria-label', text);

      let i = 0;
      el.innerHTML = text
        .split(' ')
        .map(function (word) {
          const chars = word
            .split('')
            .map((ch) => '<span class="kin" style="--i:' + i++ + '">' + ch + '</span>')
            .join('');
          return '<span class="kin-word">' + chars + '</span>';
        })
        .join('<span class="kin-space"> </span>');
    });
  }

  function initVine() {
    const path = $('#vine-path');
    const track = $('.steps__track');
    if (!path || !track) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;

    if (reducedMotion()) {
      path.style.strokeDashoffset = '0';
      return;
    }

    path.style.strokeDashoffset = length;

    let ticking = false;
    function update() {
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;

      const progress = (vh - rect.top) / (rect.height + vh * 0.65);
      const clamped = Math.max(0, Math.min(1, progress));
      path.style.strokeDashoffset = String(length * (1 - clamped));
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      },
      { passive: true }
    );
    update();
  }

  function initPointerEffects() {
    if (reducedMotion() || !matchMedia('(hover: hover)').matches) return;

    const glow = $('.cursor-glow');
    const magnets = $$('[data-magnetic]');
    const heroFlowers = $$('.hero__flower');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let gx = mx;
    let gy = my;
    let raf = 0;

    window.addEventListener(
      'pointermove',
      function (e) {
        mx = e.clientX;
        my = e.clientY;
        if (!raf) raf = requestAnimationFrame(loop);
      },
      { passive: true }
    );

    function loop() {
      raf = 0;

      gx += (mx - gx) * 0.14;
      gy += (my - gy) * 0.14;
      if (glow) glow.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0) translate(-50%,-50%)';

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const nx = (mx - cx) / cx;
      const ny = (my - cy) / cy;

      heroFlowers.forEach(function (el) {
        const depth = parseFloat(el.dataset.depth) || 10;
        el.style.setProperty('--px', (-nx * depth).toFixed(1) + 'px');
        el.style.setProperty('--py', (-ny * depth).toFixed(1) + 'px');
      });

      magnets.forEach(function (el) {
        const r = el.getBoundingClientRect();
        const dx = mx - (r.left + r.width / 2);
        const dy = my - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        const R = 130;
        if (dist < R) {
          el.style.setProperty('--mx', (dx * 0.18).toFixed(1) + 'px');
          el.style.setProperty('--my', (dy * 0.18).toFixed(1) + 'px');
        } else {
          el.style.setProperty('--mx', '0px');
          el.style.setProperty('--my', '0px');
        }
      });

      if (Math.abs(mx - gx) > 0.4 || Math.abs(my - gy) > 0.4) raf = requestAnimationFrame(loop);
    }

    document.body.classList.add('has-cursor-glow');
    loop();
  }

  function initHeroGarden() {
    $$('.hero__flower').forEach(function (el) {
      const type = el.dataset.flower;
      el.innerHTML = flowers.svg(type, { sway: true });
    });
  }

  function rebuildLocalised() {
    renderCatalog();
    renderPlans();
    renderVoices();
    renderPicker();
    renderVase();
    splitKinetic();
  }

  function finishFirstBuild() {
    firstBuild = false;
  }

  i18n.onChange(rebuildLocalised);

  initHeroGarden();
  i18n.apply(i18n.get());

  initLang();
  initMoods();
  initCalm();
  initNav();
  initBuilder();
  initForm();
  initReveal();
  finishFirstBuild();
  initCounters();
  initVine();
  initPointerEffects();

  const year = $('#footer-year');
  if (year) year.textContent = '© ' + new Date().getFullYear();
})();
