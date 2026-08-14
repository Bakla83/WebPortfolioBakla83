window.Pervotsvet = window.Pervotsvet || {};

(function (ns) {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = 0;
  let H = 0;
  let DPR = 1;

  let petals = [];
  let motes = [];
  let blades = [];
  let blooms = [];

  let palette = { petal: ['#f0a2b8'], mote: '#f6c453', grass: '#8bb87a', bud: ['#f5b942'] };

  const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false, moved: 0 };
  let gust = 0;
  let lastScroll = window.scrollY || 0;

  let time = 0;
  let lastFrame = 0;
  let rafId = 0;
  let calm = document.documentElement.hasAttribute('data-calm');

  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

  function readPalette() {
    const cs = getComputedStyle(document.documentElement);
    const v = (name, fallback) => (cs.getPropertyValue(name) || fallback).trim() || fallback;

    palette = {
      petal: [
        v('--f-rose', '#f0a2b8'),
        v('--f-rose-deep', '#e2748f'),
        v('--f-peach', '#f7bd94'),
        v('--f-lilac', '#c3a7e0'),
        v('--f-cream', '#fff3e2'),
        v('--f-gold', '#f5b942'),
      ],
      mote: v('--f-gold', '#f5b942'),
      grass: v('--f-stem', '#8bb87a'),
      bud: [v('--f-gold', '#f5b942'), v('--f-cream', '#fff3e2'), v('--f-rose', '#f0a2b8')],
    };

    petals.forEach((p) => (p.color = pick(palette.petal)));
    blades.forEach((b) => {
      if (b.bud) b.bud.color = pick(palette.bud);
    });
  }

  function windAt(x, y, t) {
    return (
      0.34 * Math.sin(y * 0.0062 + t * 0.55) +
      0.26 * Math.sin(x * 0.0041 - t * 0.38) +
      0.16 * Math.sin((x + y) * 0.0027 + t * 0.9)
    );
  }

  function makePetal(fromTop) {
    return {
      x: rand(-40, W + 40),
      y: fromTop ? rand(-H * 0.3, -20) : rand(-20, H),
      vx: rand(-0.3, 0.6),
      vy: rand(0.25, 0.8),
      size: rand(5, 13),
      rot: rand(0, Math.PI * 2),
      spin: rand(-0.022, 0.022),
      flutter: rand(0, Math.PI * 2),
      flutterSpeed: rand(0.03, 0.07),
      depth: rand(0.45, 1),
      color: pick(palette.petal),
      alpha: rand(0.45, 0.9),
    };
  }

  function updatePetal(p, step) {
    const w = windAt(p.x, p.y, time) * 1.15 * p.depth;

    p.vx += (w + gust * p.depth) * 0.05 * step;
    p.vy += 0.012 * p.depth * step;

    if (pointer.active) {
      const dx = p.x - pointer.x;
      const dy = p.y - pointer.y;
      const d2 = dx * dx + dy * dy;
      const R = 130;
      if (d2 < R * R && d2 > 0.01) {
        const d = Math.sqrt(d2);
        const force = (1 - d / R) * 1.5 * step;
        p.vx += (dx / d) * force;
        p.vy += (dy / d) * force;
      }
    }

    p.vx *= 0.982;
    p.vy = clamp(p.vy * 0.995, -2.5, 2.6);

    p.x += p.vx * step;
    p.y += p.vy * step;
    p.rot += (p.spin + p.vx * 0.004) * step;
    p.flutter += p.flutterSpeed * step;

    if (p.y > H + 30) {
      Object.assign(p, makePetal(true));
      p.y = rand(-60, -20);
    }
    if (p.x < -60) p.x = W + 50;
    if (p.x > W + 60) p.x = -50;
  }

  function drawPetal(p) {
    const s = p.size;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    ctx.scale(0.35 + Math.abs(Math.cos(p.flutter)) * 0.65, 1);
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.95, -s * 0.45, s * 0.72, s * 0.62, 0, s);
    ctx.bezierCurveTo(-s * 0.72, s * 0.62, -s * 0.95, -s * 0.45, 0, -s);
    ctx.closePath();
    ctx.globalAlpha = p.alpha * p.depth;
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.restore();
  }

  function makeMote() {
    return {
      x: rand(0, W),
      y: rand(0, H),
      r: rand(0.8, 2.6),
      vx: rand(-0.12, 0.12),
      vy: rand(-0.35, -0.08),
      phase: rand(0, Math.PI * 2),
      alpha: rand(0.25, 0.7),
    };
  }

  function updateMote(m, step) {
    m.phase += 0.012 * step;
    m.x += (m.vx + Math.sin(m.phase) * 0.22 + gust * 0.3) * step;
    m.y += m.vy * step;

    if (pointer.active) {
      const dx = pointer.x - m.x;
      const dy = pointer.y - m.y;
      const d2 = dx * dx + dy * dy;
      const R = 180;
      if (d2 < R * R && d2 > 4) {
        const d = Math.sqrt(d2);
        const f = (1 - d / R) * 0.16 * step;
        m.x += dx * f * 0.1;
        m.y += dy * f * 0.1;
      }
    }

    if (m.y < -10) {
      m.y = H + 10;
      m.x = rand(0, W);
    }
    if (m.x < -10) m.x = W + 10;
    if (m.x > W + 10) m.x = -10;
  }

  function drawMotes() {
    ctx.fillStyle = palette.mote;
    for (let i = 0; i < motes.length; i++) {
      const m = motes[i];
      const twinkle = 0.6 + Math.sin(m.phase * 2.3) * 0.4;
      ctx.globalAlpha = m.alpha * twinkle * 0.35;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r * 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = m.alpha * twinkle;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function buildBlades() {
    blades = [];
    const gapPx = W < 700 ? 13 : 10;
    const count = Math.ceil(W / gapPx) + 2;

    for (let i = 0; i < count; i++) {
      const x = i * gapPx + rand(-4, 4);
      const blade = {
        x: x,
        h: rand(38, 128) * (W < 700 ? 0.72 : 1),
        w: rand(2, 4.6),
        lean: rand(-0.35, 0.35),
        phase: rand(0, Math.PI * 2),
        shade: rand(0.35, 1),
        bud: null,
      };

      if (Math.random() < 0.11) {
        blade.bud = { r: rand(2.6, 5.2), color: pick(palette.bud) };
      }
      blades.push(blade);
    }
  }

  function drawBlades() {
    const base = H + 4;

    for (let i = 0; i < blades.length; i++) {
      const b = blades[i];
      const tipY = base - b.h;

      let bend = (windAt(b.x, tipY, time) * 22 + b.lean * 10 + gust * 14) *
        Math.sin(time * 0.8 + b.phase) * 0.5 +
        windAt(b.x * 0.7, tipY, time * 0.6) * 16;

      if (pointer.active) {
        const dx = b.x - pointer.x;
        const dy = tipY - pointer.y;
        const d = Math.hypot(dx, dy);
        const R = 150;
        if (d < R) {
          bend += (dx / (d || 1)) * (1 - d / R) * 46;
        }
      }

      const tipX = b.x + bend;
      const ctrlX = b.x + bend * 0.35;
      const ctrlY = base - b.h * 0.55;

      ctx.beginPath();
      ctx.moveTo(b.x - b.w / 2, base);
      ctx.quadraticCurveTo(ctrlX - b.w * 0.3, ctrlY, tipX, tipY);
      ctx.quadraticCurveTo(ctrlX + b.w * 0.3, ctrlY, b.x + b.w / 2, base);
      ctx.closePath();
      ctx.globalAlpha = 0.16 + b.shade * 0.32;
      ctx.fillStyle = palette.grass;
      ctx.fill();

      if (b.bud) {
        ctx.globalAlpha = 0.55 + b.shade * 0.4;
        ctx.fillStyle = b.bud.color;
        ctx.beginPath();
        ctx.arc(tipX, tipY - b.bud.r * 0.6, b.bud.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function bloomAt(x, y) {
    blooms.push({
      x: x,
      y: y,
      age: 0,
      life: 95,
      petals: 5 + ((Math.random() * 4) | 0),
      rot: rand(0, Math.PI * 2),
      spin: rand(-0.006, 0.006),
      maxR: rand(26, 52),
      color: pick(palette.petal),
      core: palette.mote,
    });

    for (let i = 0; i < 3; i++) {
      const p = makePetal(false);
      p.x = x + rand(-14, 14);
      p.y = y + rand(-14, 14);
      p.vx = rand(-1.8, 1.8);
      p.vy = rand(-1.6, -0.2);
      petals.push(p);
      if (petals.length > 140) petals.shift();
    }
  }

  function drawBlooms(step) {
    for (let i = blooms.length - 1; i >= 0; i--) {
      const b = blooms[i];
      b.age += step;
      b.rot += b.spin * step;

      if (b.age >= b.life) {
        blooms.splice(i, 1);
        continue;
      }

      const t = b.age / b.life;

      const grow = 1 - Math.pow(1 - Math.min(t * 2.4, 1), 3);
      const fade = t < 0.55 ? 1 : 1 - (t - 0.55) / 0.45;
      const r = b.maxR * grow;

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      ctx.globalAlpha = 0.75 * fade;
      ctx.fillStyle = b.color;

      for (let k = 0; k < b.petals; k++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 * k) / b.petals);
        ctx.beginPath();
        ctx.ellipse(0, -r * 0.62, r * 0.28, r * 0.62, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.globalAlpha = 0.9 * fade;
      ctx.fillStyle = b.core;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  function render(step) {
    ctx.clearRect(0, 0, W, H);

    drawMotes();

    for (let i = 0; i < petals.length; i++) drawPetal(petals[i]);

    drawBlades();
    drawBlooms(step);
  }

  function frame(now) {
    rafId = requestAnimationFrame(frame);

    const raw = now - lastFrame;
    lastFrame = now;

    const step = clamp(raw / 16.67, 0.2, 3);

    time += step * 0.016;
    gust *= Math.pow(0.94, step);
    pointer.moved = Math.max(0, pointer.moved - step);

    for (let i = 0; i < petals.length; i++) updatePetal(petals[i], step);
    for (let i = 0; i < motes.length; i++) updateMote(motes[i], step);

    render(step);
  }

  function start() {
    if (rafId || calm) return;
    lastFrame = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const area = W * H;
    const petalTarget = Math.round(clamp(area / 26000, 16, 58));
    const moteTarget = Math.round(clamp(area / 14000, 24, 90));

    while (petals.length < petalTarget) petals.push(makePetal(false));
    petals.length = Math.min(petals.length, petalTarget + 24);

    while (motes.length < moteTarget) motes.push(makeMote());
    motes.length = Math.min(motes.length, moteTarget);

    buildBlades();

    if (calm) staticFrame();
  }

  function staticFrame() {
    time = 12;
    gust = 0;
    pointer.active = false;
    for (let i = 0; i < petals.length; i++) {

      petals[i].y = rand(0, H);
      petals[i].x = rand(0, W);
    }
    render(1);
  }

  function setCalm(next) {
    calm = !!next;
    if (calm) {
      stop();
      blooms.length = 0;
      staticFrame();
    } else {
      start();
    }
  }

  function onPointerMove(e) {
    const nx = e.clientX;
    const ny = e.clientY;
    pointer.vx = nx - pointer.x;
    pointer.vy = ny - pointer.y;
    pointer.x = nx;
    pointer.y = ny;
    pointer.active = true;

    const speed = Math.hypot(pointer.vx, pointer.vy);
    if (speed > 26 && pointer.moved <= 0 && petals.length < 130) {
      const p = makePetal(false);
      p.x = nx;
      p.y = ny;
      p.vx = pointer.vx * 0.06;
      p.vy = pointer.vy * 0.06 - 0.4;
      petals.push(p);
      pointer.moved = 8;
    }
  }

  function onPointerLeave() {
    pointer.active = false;
    pointer.x = -9999;
    pointer.y = -9999;
  }

  function onClick(e) {

    if (e.target.closest('a, button, input, textarea, select, label, .vase, [data-flower-btn]')) return;
    bloomAt(e.clientX, e.clientY);
  }

  function onScroll() {
    const y = window.scrollY || 0;
    gust += clamp((y - lastScroll) * 0.016, -1.6, 1.6);
    lastScroll = y;
  }

  readPalette();
  resize();

  let resizeTimer = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 180);
  });

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerdown', onPointerMove, { passive: true });
  document.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('blur', onPointerLeave);
  window.addEventListener('click', onClick);
  window.addEventListener('scroll', onScroll, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (!calm) start();
  });

  if (calm) staticFrame();
  else start();

  ns.background = {
    start: start,
    stop: stop,
    setCalm: setCalm,
    isCalm: function () {
      return calm;
    },
    refreshPalette: function () {
      readPalette();
      if (calm) staticFrame();
    },
    bloomAt: bloomAt,
  };
})(window.Pervotsvet);
