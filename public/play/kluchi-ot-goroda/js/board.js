window.Kluchi = window.Kluchi || {};

(function (ns) {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const GLYPHS_RU = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ';
  const GLYPHS_EN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function initBoard(getWords) {
    const host = document.getElementById('board');
    if (!host) return;

    let words = [];
    let index = 0;
    let timer = 0;
    let cells = [];

    function build(list) {
      words = list && list.length ? list : [''];
      index = 0;

      const width = words.reduce((max, w) => Math.max(max, w.length), 0);
      host.innerHTML = '';
      cells = [];

      for (let i = 0; i < width; i++) {
        const cell = document.createElement('span');
        cell.className = 'flap';
        cell.setAttribute('aria-hidden', 'true');
        host.appendChild(cell);
        cells.push(cell);
      }

      show(words[0], true);
      schedule();
    }

    function glyphs() {
      return document.documentElement.lang === 'en' ? GLYPHS_EN : GLYPHS_RU;
    }

    function show(word, instant) {
      const target = (word || '').padEnd(cells.length, ' ');

      cells.forEach(function (cell, i) {
        const char = target[i];

        if (instant || reduced.matches) {
          cell.textContent = char;
          cell.classList.toggle('flap--blank', char === ' ');
          return;
        }

        let left = 5 + i * 2;
        cell.classList.remove('flap--blank');
        clearInterval(cell._spin);

        cell._spin = setInterval(function () {
          if (left-- <= 0) {
            clearInterval(cell._spin);
            cell.textContent = char;
            cell.classList.toggle('flap--blank', char === ' ');
            cell.classList.remove('is-flipping');
            return;
          }
          const set = glyphs();
          cell.textContent = set[(Math.random() * set.length) | 0];
          cell.classList.add('is-flipping');
        }, 45);
      });
    }

    function schedule() {
      clearTimeout(timer);
      if (reduced.matches || words.length < 2) return;
      timer = setTimeout(function () {
        index = (index + 1) % words.length;
        show(words[index]);
        schedule();
      }, 3400);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearTimeout(timer);
      else schedule();
    });

    build(getWords());
    ns.i18n.onChange(function () {
      build(getWords());
    });
  }

  function placeOnPath(svg, path, mover, t, length) {
    const box = svg.getBoundingClientRect();
    if (!box.width || !box.height) return;

    const host = mover.offsetParent || svg.parentElement;
    const hostBox = host.getBoundingClientRect();

    const vb = svg.viewBox.baseVal;
    const kx = box.width / vb.width;
    const ky = box.height / vb.height;

    const at = path.getPointAtLength(length * t);

    const next = path.getPointAtLength(Math.min(length, length * t + 1));

    const angle = (Math.atan2((next.y - at.y) * ky, (next.x - at.x) * kx) * 180) / Math.PI;

    mover.style.left = box.left - hostBox.left + at.x * kx + 'px';
    mover.style.top = box.top - hostBox.top + at.y * ky + 'px';
    mover.style.setProperty('--angle', angle.toFixed(1) + 'deg');
  }

  function initPlane() {
    const svg = document.querySelector('.hero__arc');
    const path = document.getElementById('arc-path');
    const plane = document.getElementById('hero-plane');
    if (!svg || !path || !plane) return;

    const length = path.getTotalLength();
    let start = 0;
    let raf = 0;

    function frame(now) {
      if (!start) start = now;

      const t = ((now - start) % 14000) / 14000;
      placeOnPath(svg, path, plane, t, length);

      const fade = Math.min(1, Math.min(t, 1 - t) * 9);
      plane.style.opacity = String(fade);

      raf = requestAnimationFrame(frame);
    }

    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    function play() {
      if (raf || reduced.matches) return;
      start = 0;
      raf = requestAnimationFrame(frame);
    }

    if (reduced.matches) {
      placeOnPath(svg, path, plane, 0.45, length);
      plane.style.opacity = '1';
    } else {
      play();
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else play();
    });

    window.addEventListener('resize', function () {
      if (reduced.matches) placeOnPath(svg, path, plane, 0.45, length);
    });
  }

  function initCar() {
    const svg = document.querySelector('.how__line');
    const path = document.getElementById('how-path');
    const car = document.getElementById('how-car');
    const track = document.querySelector('.how__track');
    if (!svg || !path || !car || !track) return;

    const length = path.getTotalLength();
    const dash = path.getTotalLength();
    path.style.strokeDasharray = dash;

    let ticking = false;

    function update() {
      ticking = false;

      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;

      const raw = (vh - rect.top) / (rect.height + vh * 0.5);
      const t = Math.max(0, Math.min(1, raw));

      placeOnPath(svg, path, car, t, length);
      car.style.opacity = t > 0.01 ? '1' : '0';

      path.style.strokeDashoffset = String(dash * (1 - t));
    }

    if (reduced.matches) {
      path.style.strokeDashoffset = '0';
      placeOnPath(svg, path, car, 1, length);
      return;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      },
      { passive: true },
    );
    window.addEventListener('resize', update);
    update();
  }

  ns.motion = {
    initBoard: initBoard,
    initPlane: initPlane,
    initCar: initCar,
  };
})(window.Kluchi);
