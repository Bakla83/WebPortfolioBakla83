(function () {
  'use strict';

  const ns = window.Kluchi;
  const i18n = ns.i18n;

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  function t(key) {
    return i18n.t(i18n.get(), key);
  }

  const DESTINATIONS = [
    { id: 'adler', price: 900, minutes: 15 },
    { id: 'sirius', price: 1200, minutes: 20 },
    { id: 'hosta', price: 1600, minutes: 30 },
    { id: 'matsesta', price: 1900, minutes: 40 },
    { id: 'center', price: 2200, minutes: 45 },
    { id: 'polyana', price: 3200, minutes: 65 },
    { id: 'dagomys', price: 2900, minutes: 60 },
    { id: 'loo', price: 3400, minutes: 75 },
    { id: 'gagra', price: 5200, minutes: 110 },
  ];

  const CARS = [
    { id: 'standard', pax: 3, bags: 3, factor: 1 },
    { id: 'minivan', pax: 6, bags: 6, factor: 1.6 },
    { id: 'bus', pax: 16, bags: 16, factor: 2.6 },
  ];

  const SEAT_PRICE = 400;
  const STOP_PRICE = 700;
  const STOP_MINUTES = 30;
  const NIGHT_RATE = 0.2;

  const TOURS = [
    { id: 'polyana', type: 'mountains', hours: 8, price: 9500 },
    { id: 'abkhazia', type: 'abkhazia', hours: 12, price: 14000 },
    { id: 'waterfalls', type: 'mountains', hours: 7, price: 8500 },
    { id: 'sea', type: 'sea', hours: 4, price: 6800 },
    { id: 'tea', type: 'mountains', hours: 5, price: 7000 },
    { id: 'night', type: 'city', hours: 3, price: 5500 },
  ];

  const TOUR_FILTERS = ['all', 'mountains', 'sea', 'city', 'abkhazia'];

  const CAR_ART = {
    standard:
      '<path d="M6 34c0-6 4-8 10-9l14-1 14-10c2-2 5-3 8-3h22c4 0 8 1 11 4l10 9 11 2c5 1 8 3 8 8z" fill="currentColor" opacity=".9"/>' +
      '<path d="M50 15h20c3 0 6 1 8 3l6 5H50zM45 16v7H31z" fill="var(--surface)" opacity=".85"/>',
    minivan:
      '<path d="M6 34c0-8 3-12 9-14l13-10c3-2 6-3 10-3h48c6 0 11 2 14 6l8 9c4 2 6 5 6 12z" fill="currentColor" opacity=".9"/>' +
      '<path d="M40 12h26v11H33zM72 12h14c3 0 5 1 7 3l6 8H72z" fill="var(--surface)" opacity=".85"/>',
    bus:
      '<path d="M6 34V12c0-3 2-5 5-5h94c4 0 7 3 7 7v20z" fill="currentColor" opacity=".9"/>' +
      '<path d="M14 13h20v11H14zM40 13h20v11H40zM66 13h20v11H66zM92 13h12v11H92z" fill="var(--surface)" opacity=".85"/>',
  };

  const MONEY = {
    ru: new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }),
    en: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
      currencyDisplay: 'code',
    }),
  };

  function money(value) {
    return (MONEY[i18n.get()] || MONEY.ru).format(Math.round(value));
  }

  function pickCar(people, bags) {
    return CARS.filter((car) => car.pax >= people && car.bags >= bags)[0] || CARS[CARS.length - 1];
  }

  function isNight(value) {
    const hour = parseInt((value || '').split(':')[0], 10);
    if (isNaN(hour)) return false;

    return hour >= 23 || hour < 6;
  }

  function readCalc() {
    const dest = DESTINATIONS.filter((d) => d.id === $('#calc-dest').value)[0] || DESTINATIONS[0];
    const people = Math.max(1, Math.min(16, parseInt($('#calc-people').value, 10) || 1));
    const bags = Math.max(0, Math.min(20, parseInt($('#calc-bags').value, 10) || 0));
    const car = pickCar(people, bags);

    const ride = dest.price * car.factor;
    const night = isNight($('#calc-time').value) ? ride * NIGHT_RATE : 0;
    const seat = $('#calc-seat').checked ? SEAT_PRICE : 0;
    const stop = $('#calc-stop').checked ? STOP_PRICE : 0;

    return {
      dest: dest,
      car: car,
      people: people,
      bags: bags,
      ride: ride,
      night: night,
      seat: seat,
      stop: stop,
      total: ride + night + seat + stop,
      minutes: dest.minutes + ($('#calc-stop').checked ? STOP_MINUTES : 0),
      toAirport: $('input[name="direction"]:checked').value === 'to',
    };
  }

  function renderCalcOptions() {
    const select = $('#calc-dest');
    if (!select) return;

    const chosen = select.value;
    select.innerHTML = DESTINATIONS.map(
      (d) => '<option value="' + d.id + '">' + t('calc.destinations.' + d.id) + '</option>',
    ).join('');
    if (chosen) select.value = chosen;
  }

  function renderCalc() {
    const state = readCalc();

    const destLabel = $('label[for="calc-dest"]');
    const timeLabel = $('label[for="calc-time"]');
    if (destLabel) destLabel.textContent = state.toAirport ? t('calc.destTo') : t('calc.dest');
    if (timeLabel) timeLabel.textContent = state.toAirport ? t('calc.timeTo') : t('calc.time');

    const destName = t('calc.destinations.' + state.dest.id);
    $('#ticket-from').textContent = state.toAirport ? destName : 'AER';
    $('#ticket-to').textContent = state.toAirport ? 'AER' : destName;

    const rows = [
      { label: t('calc.rowRide'), value: money(state.ride) },
      state.night ? { label: t('calc.rowNight'), value: '+ ' + money(state.night) } : null,
      state.seat ? { label: t('calc.rowSeat'), value: '+ ' + money(state.seat) } : null,
      state.stop ? { label: t('calc.rowStop'), value: '+ ' + money(state.stop) } : null,
      { label: t('calc.rowTime'), value: state.minutes + ' ' + t('calc.minutes'), muted: true },
    ].filter(Boolean);

    $('#ticket-rows').innerHTML = rows
      .map(
        (row) =>
          '<div class="ticket__row' + (row.muted ? ' ticket__row--muted' : '') + '">' +
          '<dt>' + row.label + '</dt><dd>' + row.value + '</dd></div>',
      )
      .join('');

    $('#ticket-total').textContent = money(state.total);

    const carName = t('fleet.items.' + state.car.id + '.name');
    $('#ticket-car').innerHTML =
      '<b>' + t('calc.carFor') + ': ' + carName + '</b> — ' + t('calc.carWhy');
  }

  function initCalc() {
    const form = $('#calc-form');
    if (!form) return;

    form.addEventListener('input', renderCalc);
    form.addEventListener('change', renderCalc);

    $('#ticket-order').addEventListener('click', function () {
      const state = readCalc();
      const destName = t('calc.destinations.' + state.dest.id);
      const route = state.toAirport ? destName + ' → AER' : 'AER → ' + destName;

      prefillNote(
        t('contacts.prefillTransfer') + ': ' + route +
          ', ' + state.people + ' × ' + t('calc.people').toLowerCase() +
          ', ' + t('fleet.items.' + state.car.id + '.name') +
          ' — ' + money(state.total),
      );
    });
  }

  let activeFilter = 'all';

  function renderFilters() {
    const host = $('#tour-filters');
    if (!host) return;

    host.innerHTML = TOUR_FILTERS.map(
      (id) =>
        '<button type="button" class="chip' + (id === activeFilter ? ' is-active' : '') +
        '" data-filter="' + id + '" aria-pressed="' + (id === activeFilter) + '">' +
        t('tours.filters.' + id) + '</button>',
    ).join('');

    $$('[data-filter]', host).forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeFilter = btn.dataset.filter;
        renderFilters();
        renderTours();
      });
    });
  }

  function renderTours() {
    const grid = $('#tours-grid');
    if (!grid) return;

    const list = TOURS.filter((tour) => activeFilter === 'all' || tour.type === activeFilter);
    const empty = $('#tours-empty');
    if (empty) empty.hidden = list.length > 0;

    grid.innerHTML = list
      .map(function (tour) {
        const item = t('tours.items.' + tour.id) || { name: tour.id, note: '', stops: [] };
        const stops = (item.stops || [])
          .map((stop) => '<li><span aria-hidden="true"></span>' + stop + '</li>')
          .join('');

        return (
          '<article class="tour" data-reveal>' +
          '<header class="tour__head">' +
          '<h3 class="tour__name">' + item.name + '</h3>' +
          '<span class="tour__hours">' + tour.hours + ' ' + t('tours.hours') + '</span>' +
          '</header>' +
          '<p class="tour__note">' + item.note + '</p>' +
          '<p class="tour__route-label">' + t('tours.route') + '</p>' +
          '<ol class="tour__route">' + stops + '</ol>' +
          '<footer class="tour__foot">' +
          '<span class="tour__price">' + money(tour.price) +
          '<i>' + t('tours.perCar') + '</i></span>' +
          '<button class="btn btn--ghost btn--sm" type="button" data-book="' + tour.id + '">' +
          t('tours.book') + '</button>' +
          '</footer></article>'
        );
      })
      .join('');

    $$('[data-book]', grid).forEach(function (btn) {
      btn.addEventListener('click', function () {
        const tour = TOURS.filter((x) => x.id === btn.dataset.book)[0];
        const item = t('tours.items.' + btn.dataset.book);
        prefillNote(
          t('contacts.prefillTour') + ': ' + item.name +
            ', ' + tour.hours + ' ' + t('tours.hours') + ' — ' + money(tour.price),
        );
      });
    });

    observeReveals(grid);
  }

  function renderFleet() {
    const grid = $('#fleet-grid');
    if (!grid) return;

    grid.innerHTML = CARS.map(function (car) {
      const item = t('fleet.items.' + car.id) || { name: car.id, note: '', features: [] };
      return (
        '<article class="car" data-reveal>' +
        '<div class="car__art"><svg viewBox="0 0 120 46" role="presentation">' +
        CAR_ART[car.id] +
        '<circle cx="32" cy="34" r="8" fill="var(--ink)"/><circle cx="32" cy="34" r="3.4" fill="var(--surface)"/>' +
        '<circle cx="90" cy="34" r="8" fill="var(--ink)"/><circle cx="90" cy="34" r="3.4" fill="var(--surface)"/>' +
        '</svg></div>' +
        '<h3 class="car__name">' + item.name + '</h3>' +
        '<p class="car__caps">' +
        '<span><svg class="icon" aria-hidden="true"><use href="#i-user"/></svg>' +
        t('fleet.pax') + ' ' + car.pax + ' ' + t('fleet.paxUnit') + '</span>' +
        '<span><svg class="icon" aria-hidden="true"><use href="#i-luggage"/></svg>' +
        t('fleet.pax') + ' ' + car.bags + ' ' + t('fleet.bagsUnit') + '</span>' +
        '</p>' +
        '<p class="car__note">' + item.note + '</p>' +
        '<ul class="car__features">' +
        (item.features || [])
          .map((f) => '<li><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>' + f + '</li>')
          .join('') +
        '</ul></article>'
      );
    }).join('');

    observeReveals(grid);
  }

  function renderVoices() {
    const grid = $('#voices-grid');
    if (!grid) return;

    grid.innerHTML = (t('voices.items') || [])
      .map(
        (v) =>
          '<figure class="voice" data-reveal><blockquote>' + v.text + '</blockquote>' +
          '<figcaption><b>' + v.author + '</b><span>' + v.role + '</span></figcaption></figure>',
      )
      .join('');

    observeReveals(grid);
  }

  function prefillNote(text) {
    const note = $('#f-note');
    if (note) note.value = text;

    $('#contacts').scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });

    const name = $('#f-name');
    if (name) setTimeout(() => name.focus({ preventScroll: true }), reducedMotion() ? 0 : 600);
  }

  function initForm() {
    const form = $('#order-form');
    if (!form) return;
    const status = $('#form-status');

    function validate(input) {
      const error = $('[data-error-for="' + input.id + '"]', form);
      const ok = input.value.trim().length > 0;
      if (error) error.hidden = ok;
      input.setAttribute('aria-invalid', String(!ok));
      return ok;
    }

    $$('input[required]', form).forEach(function (input) {
      input.addEventListener('blur', () => validate(input));
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') validate(input);
      });
    });

    const flight = $('#f-flight');
    if (flight) {
      flight.addEventListener('input', function () {
        const caret = flight.selectionStart;
        flight.value = flight.value.toUpperCase();
        flight.setSelectionRange(caret, caret);
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const required = $$('input[required]', form);
      const bad = required.filter((input) => !validate(input))[0];
      if (bad) {
        bad.focus();
        if (status) status.hidden = true;
        return;
      }

      if (status) {
        status.textContent = t('contacts.sent');
        status.hidden = false;
      }
      form.reset();
      required.forEach((input) => input.removeAttribute('aria-invalid'));
      $$('[data-error-for]', form).forEach((el) => (el.hidden = true));
    });
  }

  function initTheme() {
    const btn = $('#theme-toggle');
    if (!btn) return;

    function sync() {
      const night = document.documentElement.getAttribute('data-theme') === 'night';
      btn.setAttribute('aria-pressed', String(night));
      btn.setAttribute('aria-label', night ? t('a11y.themeDay') : t('a11y.themeNight'));
    }

    btn.addEventListener('click', function () {
      const next =
        document.documentElement.getAttribute('data-theme') === 'night' ? 'day' : 'night';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem('kluchi-theme', next);
      } catch (e) {}
      sync();
    });

    i18n.onChange(sync);
    sync();
  }

  function initLang() {
    $$('.lang__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        i18n.set(btn.dataset.lang);
      });
    });
  }

  function initNav() {
    const burger = $('#burger');
    const header = $('#site-header');

    if (burger && header) {
      burger.addEventListener('click', function () {
        const open = !header.classList.contains('is-open');
        header.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', String(open));
        burger.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
      });

      $$('.nav a').forEach(function (link) {
        link.addEventListener('click', function () {
          header.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
          burger.querySelector('use').setAttribute('href', '#i-menu');
        });
      });

      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape' || !header.classList.contains('is-open')) return;
        header.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.querySelector('use').setAttribute('href', '#i-menu');
        burger.focus();
      });
    }

    let ticking = false;
    window.addEventListener(
      'scroll',
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          if (header) header.classList.toggle('is-stuck', window.scrollY > 20);
          ticking = false;
        });
      },
      { passive: true },
    );

    const links = $$('.nav a');
    const map = {};
    links.forEach(function (a) {
      const section = document.getElementById(a.getAttribute('href').slice(1));
      if (section) map[section.id] = a;
    });

    const spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach((a) => a.classList.remove('is-active'));
          if (map[entry.target.id]) map[entry.target.id].classList.add('is-active');
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
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
      { rootMargin: '0px 0px -10% 0px', threshold: 0.06 },
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

          (function tick(now) {
            const p = Math.min((now - started) / 1100, 1);
            el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          })(started);
        });
      },
      { threshold: 0.6 },
    );

    nodes.forEach((el) => io.observe(el));
  }

  function rebuildLocalised() {
    renderCalcOptions();
    renderCalc();
    renderFilters();
    renderTours();
    renderFleet();
    renderVoices();
  }

  i18n.onChange(rebuildLocalised);
  i18n.apply(i18n.get());

  initLang();
  initTheme();
  initNav();
  initCalc();
  initForm();
  initReveal();
  firstBuild = false;
  initCounters();

  ns.motion.initBoard(() => t('hero.board'));
  ns.motion.initPlane();
  ns.motion.initCar();

  const year = $('#footer-year');
  if (year) year.textContent = '© ' + new Date().getFullYear();
})();
