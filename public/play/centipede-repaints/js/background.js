/*
  Живой фон на canvas.

  Мастерская — это в первую очередь взвесь в воздухе: аэрограф даёт мелкую
  сухую пыль, которая часами висит в луче света и оседает на всём подряд.
  Отсюда три системы частиц на одном холсте:

    pigment — мелкая пигментная пыль, её сдувает от курсора, как факелом
              аэрографа, и сносит при быстрой прокрутке;
    motes   — крупные редкие пылинки, они наоборот тянутся к курсору и
              задают глубину: движутся медленнее и светятся ярче;
    blooms  — вспышка пигмента по клику, разлетается и гаснет.

  Цвета не заданы числами, а читаются из CSS-переменных --p-1…--p-4. Из-за
  этого смена палитры перекрашивает и вёрстку, и взвесь одним движением, а
  JS про палитры ничего не знает.

  Всё останавливается, когда вкладка невидима или включён спокойный режим —
  считать частицы в фоновой вкладке значит греть батарею просто так.
*/
window.Centipede = window.Centipede || {};

(function (ns) {
  'use strict';

  function init(canvas) {
    if (!canvas) return null;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return null;

    let W = 0, H = 0, dpr = 1;
    let pigment = [];
    let motes = [];
    let blooms = [];
    let palette = ['#c98a4e', '#8f5a2c', '#e6cba0', '#6f4a2a'];

    let pointer = { x: -9999, y: -9999, active: false };
    let wind = 0;          // порыв от прокрутки, затухает сам
    let lastScroll = 0;
    let calm = false;
    let running = false;
    let raf = 0;
    let last = 0;

    /* Палитра берётся из CSS раз в смену темы, а не каждый кадр:
       getComputedStyle — это принудительный пересчёт стилей, и вызывать
       его шестьдесят раз в секунду означает съесть весь бюджет кадра. */
    function readPalette() {
      const cs = getComputedStyle(document.documentElement);
      const next = [];
      for (let i = 1; i <= 4; i++) {
        const v = cs.getPropertyValue('--p-' + i).trim();
        if (v) next.push(v);
      }
      if (next.length) palette = next;
    }

    function pick(i) {
      return palette[i % palette.length];
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    /* Плотность считается от площади, а не от ширины: на узком высоком
       экране телефона частиц должно быть меньше, а не столько же. */
    function seed() {
      const area = W * H;
      const nPig = Math.round(Math.min(area / 5200, 260));
      const nMote = Math.round(Math.min(area / 26000, 60));

      pigment = [];
      for (let i = 0; i < nPig; i++) pigment.push(newPigment(true));

      motes = [];
      for (let i = 0; i < nMote; i++) motes.push(newMote(true));
    }

    function newPigment(anywhere) {
      return {
        x: Math.random() * W,
        y: anywhere ? Math.random() * H : H + 10,
        r: 0.5 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.16,
        vy: -0.05 - Math.random() * 0.22,
        a: 0.12 + Math.random() * 0.38,
        c: Math.floor(Math.random() * 4),
        // Фаза нужна, чтобы пылинки не качались синхронно: одинаковый
        // синус на всех сразу читается как волна, а не как взвесь.
        ph: Math.random() * Math.PI * 2,
        sw: 0.2 + Math.random() * 0.5,
      };
    }

    function newMote(anywhere) {
      return {
        x: Math.random() * W,
        y: anywhere ? Math.random() * H : H + 20,
        r: 1.8 + Math.random() * 3.4,
        vx: (Math.random() - 0.5) * 0.09,
        vy: -0.03 - Math.random() * 0.1,
        a: 0.05 + Math.random() * 0.16,
        c: Math.floor(Math.random() * 4),
        ph: Math.random() * Math.PI * 2,
      };
    }

    function step(dt) {
      const t = performance.now() / 1000;

      // Порыв от прокрутки затухает по экспоненте: резкий рывок сносит
      // взвесь заметно, но через полсекунды воздух снова стоит.
      wind *= Math.pow(0.94, dt * 60);
      if (Math.abs(wind) < 0.001) wind = 0;

      for (let i = 0; i < pigment.length; i++) {
        const p = pigment[i];
        p.x += (p.vx + Math.sin(t * p.sw + p.ph) * 0.12 + wind) * dt * 60;
        p.y += p.vy * dt * 60;

        // Факел аэрографа: вблизи курсора пылинку сдувает прочь, сила
        // падает с квадратом расстояния.
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 20000 && d2 > 0.01) {
            const f = (1 - d2 / 20000) * 2.4 / Math.sqrt(d2);
            p.x += dx * f * dt * 60;
            p.y += dy * f * dt * 60;
          }
        }

        if (p.y < -10 || p.x < -20 || p.x > W + 20) {
          pigment[i] = newPigment(false);
          pigment[i].x = Math.random() * W;
        }
      }

      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.x += (m.vx + Math.sin(t * 0.3 + m.ph) * 0.06 + wind * 0.4) * dt * 60;
        m.y += m.vy * dt * 60;

        // Крупная пыль, наоборот, втягивается за курсором — так два слоя
        // расходятся по направлению и перестают выглядеть одним шумом.
        if (pointer.active) {
          const dx = pointer.x - m.x;
          const dy = pointer.y - m.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 60000 && d2 > 400) {
            const f = 0.22 / Math.sqrt(d2);
            m.x += dx * f * dt * 60;
            m.y += dy * f * dt * 60;
          }
        }

        if (m.y < -20) motes[i] = newMote(false);
      }

      for (let i = blooms.length - 1; i >= 0; i--) {
        const b = blooms[i];
        b.life -= dt;
        if (b.life <= 0) { blooms.splice(i, 1); continue; }
        for (let j = 0; j < b.parts.length; j++) {
          const q = b.parts[j];
          q.x += q.vx * dt * 60;
          q.y += q.vy * dt * 60;
          q.vx *= 0.965;
          q.vy = q.vy * 0.965 + 0.006 * dt * 60;
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        ctx.globalAlpha = m.a;
        ctx.fillStyle = pick(m.c);
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < pigment.length; i++) {
        const p = pigment[i];
        ctx.globalAlpha = p.a;
        ctx.fillStyle = pick(p.c);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < blooms.length; i++) {
        const b = blooms[i];
        const k = Math.max(b.life / b.max, 0);
        for (let j = 0; j < b.parts.length; j++) {
          const q = b.parts[j];
          ctx.globalAlpha = q.a * k;
          ctx.fillStyle = pick(q.c);
          ctx.beginPath();
          ctx.arc(q.x, q.y, q.r * (0.5 + k * 0.8), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }

    /* Один статичный кадр для спокойного режима: страница не должна
       становиться пустой оттого, что человек выключил движение. */
    function still() {
      readPalette();
      seed();
      draw();
    }

    function frame(now) {
      if (!running) return;
      // Первый кадр после паузы даёт огромный dt — его надо срезать,
      // иначе всю взвесь одним скачком выносит за экран.
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || calm) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    /* ------------------------------------------------------- события --- */

    window.addEventListener('resize', function () {
      resize();
      if (calm) draw();
    });

    window.addEventListener('pointermove', function (e) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    }, { passive: true });

    window.addEventListener('pointerleave', function () {
      pointer.active = false;
    });

    window.addEventListener('scroll', function () {
      const y = window.scrollY || 0;
      // Знак важен: вниз сносит взвесь влево, вверх — вправо.
      wind += Math.max(Math.min((y - lastScroll) * -0.012, 1.6), -1.6);
      lastScroll = y;
    }, { passive: true });

    window.addEventListener('pointerdown', function (e) {
      if (calm) return;
      // Клик по кнопке или ссылке — это действие, а не желание брызнуть
      // краской: вспышка там только мешает.
      if (e.target.closest('a, button, input, select, textarea, label')) return;
      bloom(e.clientX, e.clientY);
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else start();
    });

    function bloom(x, y) {
      const parts = [];
      const n = 26;
      for (let i = 0; i < n; i++) {
        const ang = (Math.PI * 2 * i) / n + Math.random() * 0.4;
        const sp = 0.7 + Math.random() * 2.6;
        parts.push({
          x: x, y: y,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp,
          r: 0.8 + Math.random() * 2.4,
          a: 0.2 + Math.random() * 0.4,
          c: Math.floor(Math.random() * 4),
        });
      }
      blooms.push({ parts: parts, life: 1.5, max: 1.5 });
      if (blooms.length > 6) blooms.shift();
    }

    /* ------------------------------------------------------------ API --- */

    const api = {
      setCalm: function (v) {
        calm = !!v;
        if (calm) { stop(); still(); }
        else { blooms = []; start(); }
      },
      refresh: function () {
        readPalette();
        if (calm) draw();
      },
    };

    readPalette();
    resize();
    lastScroll = window.scrollY || 0;
    return api;
  }

  ns.background = { init: init };
})(window.Centipede);
