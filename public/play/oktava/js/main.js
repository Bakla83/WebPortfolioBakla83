(function () {
  'use strict';

  const ns = window.Oktava;
  const i18n = ns.i18n;
  const audio = ns.audio;

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  const t = (key) => i18n.t(i18n.get(), key);

  const STEPS = 16;

  const KEY_HINTS = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'];

  const TRACK_DEFS = [
    { id: 'piano', rows: audio.ROWS },
    { id: 'guitar', rows: audio.ROWS },
    { id: 'bell', rows: audio.ROWS },
    { id: 'bass', rows: audio.ROWS },
    { id: 'drums', rows: audio.DRUM_KINDS.length },
  ];

  function emptyPattern(rows) {
    return Array.from({ length: rows }, () => new Array(STEPS).fill(0));
  }

  const state = {
    bpm: 104,
    volume: 0.75,
    loops: 4,
    metronome: false,
    recording: false,
    playing: false,
    active: 0,
    tracks: TRACK_DEFS.map((def) => ({
      id: def.id,
      rows: def.rows,
      muted: false,
      pattern: emptyPattern(def.rows),
    })),
  };

  const activeTrack = () => state.tracks[state.active];
  const isDrums = (track) => track.id === 'drums';

  let ctx = null;
  let master = null;

  function buildGuard(context, destination) {
    const guard = context.createDynamicsCompressor();
    guard.threshold.value = -10;
    guard.ratio.value = 8;
    guard.attack.value = 0.002;
    guard.release.value = 0.18;

    const headroom = context.createGain();
    headroom.gain.value = 0.7;

    guard.connect(headroom).connect(destination);
    return guard;
  }

  function ensureAudio() {
    if (!ctx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      ctx = new Ctor();
      master = ctx.createGain();

      master.connect(buildGuard(ctx, ctx.destination));
    }
    if (ctx.state === 'suspended') ctx.resume();
    master.gain.value = state.volume;
    return ctx;
  }

  const stepDuration = () => 60 / state.bpm / 4;

  function noteLength(trackId) {
    const step = stepDuration();
    if (trackId === 'bass') return step * 1.8;
    if (trackId === 'bell') return step * 5;
    if (trackId === 'guitar') return step * 4;
    return step * 3.2;
  }

  const LOOKAHEAD = 0.12;
  const TICK_MS = 25;

  let timer = 0;
  let nextStepTime = 0;
  let scheduleStep = 0;
  let loopStart = 0;
  let drawQueue = [];
  let drawnStep = -1;

  function scheduleAt(step, time) {
    state.tracks.forEach(function (track) {
      if (track.muted) return;
      for (let row = 0; row < track.rows; row++) {
        if (!track.pattern[row][step]) continue;
        audio.play(ctx, master, track.id, row, time, noteLength(track.id), 1);
      }
    });

    if (state.metronome) audio.click(ctx, master, time, step % 4 === 0);
    drawQueue.push({ step: step, time: time });
  }

  function tick() {
    while (nextStepTime < ctx.currentTime + LOOKAHEAD) {
      scheduleAt(scheduleStep, nextStepTime);
      nextStepTime += stepDuration();
      scheduleStep = (scheduleStep + 1) % STEPS;
    }
  }

  function draw() {
    if (!state.playing) return;

    const now = ctx.currentTime;
    while (drawQueue.length && drawQueue[0].time <= now) {
      drawnStep = drawQueue.shift().step;
    }
    highlight(drawnStep);
    requestAnimationFrame(draw);
  }

  function start() {
    ensureAudio();
    state.playing = true;
    scheduleStep = 0;
    drawQueue = [];
    drawnStep = -1;
    nextStepTime = ctx.currentTime + 0.08;
    loopStart = nextStepTime;

    clearInterval(timer);
    timer = setInterval(tick, TICK_MS);
    tick();
    requestAnimationFrame(draw);
    syncTransport();
  }

  function stop() {
    state.playing = false;
    clearInterval(timer);
    timer = 0;
    drawQueue = [];
    highlight(-1);
    syncTransport();
  }

  function highlight(step) {
    $$('.cell.is-now').forEach((el) => el.classList.remove('is-now'));
    $$('.ruler__mark.is-now').forEach((el) => el.classList.remove('is-now'));
    if (step < 0) return;
    $$('.cell[data-step="' + step + '"]').forEach((el) => el.classList.add('is-now'));
    const mark = $('.ruler__mark[data-step="' + step + '"]');
    if (mark) mark.classList.add('is-now');
  }

  function quantizedStep() {
    if (!state.playing) return 0;
    const elapsed = ctx.currentTime - loopStart;
    const raw = Math.round(elapsed / stepDuration());
    return ((raw % STEPS) + STEPS) % STEPS;
  }

  function rowName(track, row) {
    return isDrums(track) ? t('drums.' + audio.DRUM_KINDS[row]) : audio.rowLabel(row);
  }

  function renderTabs() {
    const host = $('#track-tabs');
    host.innerHTML = state.tracks
      .map(function (track, index) {
        const notes = track.pattern.reduce(
          (sum, row) => sum + row.reduce((s, v) => s + v, 0),
          0,
        );
        return (
          '<div class="tab-wrap' + (index === state.active ? ' is-active' : '') + '">' +
          '<button class="tab" type="button" data-track="' + index + '"' +
          ' aria-pressed="' + (index === state.active) + '">' +
          '<span class="tab__name">' + t('instruments.' + track.id) + '</span>' +
          '<span class="tab__count"' + (notes ? '' : ' hidden') + '>' + notes + '</span>' +
          '</button>' +
          '<button class="tab__mute" type="button" data-mute="' + index + '"' +
          ' aria-pressed="' + track.muted + '">' +
          '<span aria-hidden="true"></span></button>' +
          '</div>'
        );
      })
      .join('');

    $$('[data-track]', host).forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.active = Number(btn.dataset.track);
        renderTabs();
        renderGrid();
        renderKeys();
      });
    });

    $$('[data-mute]', host).forEach(function (btn) {
      const track = state.tracks[Number(btn.dataset.mute)];
      btn.setAttribute('aria-label', track.muted ? t('a11y.unmute') : t('a11y.mute'));
      btn.addEventListener('click', function () {
        track.muted = !track.muted;
        renderTabs();
      });
    });
  }

  function renderGrid() {
    const track = activeTrack();
    const grid = $('#grid');

    $('#seq-title').textContent = t('instruments.' + track.id);
    $('.seq__hint').textContent = isDrums(track) ? t('seq.hintDrums') : t('seq.hint');

    let html = '';

    for (let row = track.rows - 1; row >= 0; row--) {
      html += '<div class="seq__row">';
      html += '<span class="seq__label">' + rowName(track, row) + '</span>';
      for (let step = 0; step < STEPS; step++) {
        const on = track.pattern[row][step];
        const label = i18n.fill(t(isDrums(track) ? 'a11y.cellDrum' : 'a11y.cell'), {
          step: step + 1,
          note: rowName(track, row),
        });
        html +=
          '<button class="cell' + (step % 4 === 0 ? ' cell--beat' : '') + (on ? ' is-on' : '') +
          '" type="button" data-row="' + row + '" data-step="' + step + '"' +
          ' aria-pressed="' + Boolean(on) + '" aria-label="' + label + '"></button>';
      }
      html += '</div>';
    }
    grid.innerHTML = html;
    grid.dataset.instrument = track.id;

    $$('.cell', grid).forEach(function (cell) {
      cell.addEventListener('click', function () {
        const row = Number(cell.dataset.row);
        const step = Number(cell.dataset.step);
        const next = track.pattern[row][step] ? 0 : 1;
        track.pattern[row][step] = next;
        cell.classList.toggle('is-on', Boolean(next));
        cell.setAttribute('aria-pressed', String(Boolean(next)));
        if (next) preview(track, row);
        renderTabs();
      });
    });

    $('#ruler').innerHTML =
      '<span></span>' +
      Array.from({ length: STEPS }, function (_, step) {
        return (
          '<span class="ruler__mark' + (step % 4 === 0 ? ' ruler__mark--beat' : '') +
          '" data-step="' + step + '">' + (step % 4 === 0 ? step / 4 + 1 : '') + '</span>'
        );
      }).join('');
  }

  function renderKeys() {
    const track = activeTrack();
    const host = $('#keys');

    let html = '';
    for (let row = track.rows - 1; row >= 0; row--) {
      const hint = KEY_HINTS[row] || '';
      const name = rowName(track, row);
      html +=
        '<button class="key" type="button" data-row="' + row + '"' +
        ' aria-label="' + i18n.fill(t('a11y.key'), { note: name, hint: hint }) + '">' +
        '<span class="key__note">' + name + '</span>' +
        '<span class="key__hint">' + hint + '</span></button>';
    }
    host.innerHTML = html;
    host.dataset.instrument = track.id;

    $$('.key', host).forEach(function (btn) {
      btn.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        hit(Number(btn.dataset.row), btn);
      });
    });
  }

  function preview(track, row) {
    ensureAudio();
    audio.play(ctx, master, track.id, row, ctx.currentTime + 0.01, noteLength(track.id), 0.85);
  }

  function hit(row, btn) {
    const track = activeTrack();
    ensureAudio();
    audio.play(ctx, master, track.id, row, ctx.currentTime + 0.01, noteLength(track.id), 1);

    if (btn) {
      btn.classList.remove('is-hit');
      void btn.offsetWidth;
      btn.classList.add('is-hit');
    }

    if (state.recording && state.playing) {
      const step = quantizedStep();
      track.pattern[row][step] = 1;
      const cell = $('.cell[data-row="' + row + '"][data-step="' + step + '"]');
      if (cell) {
        cell.classList.add('is-on');
        cell.setAttribute('aria-pressed', 'true');
      }
      renderTabs();
    }
  }

  function syncTransport() {
    const btn = $('#play');
    btn.setAttribute('aria-pressed', String(state.playing));
    btn.classList.toggle('is-playing', state.playing);
    $('#play-label').textContent = state.playing ? t('transport.stop') : t('transport.play');
  }

  function syncRecord() {
    const btn = $('#rec');
    btn.setAttribute('aria-pressed', String(state.recording));
    btn.classList.toggle('is-on', state.recording);
    $('#rec-label').textContent = state.recording ? t('keys.recordOn') : t('keys.record');
  }

  function status(message) {
    const el = $('#export-status');
    el.textContent = message || '';
    el.hidden = !message;
  }

  function initControls() {
    $('#play').addEventListener('click', function () {
      if (state.playing) stop();
      else start();
    });

    const bpm = $('#bpm');
    bpm.addEventListener('input', function () {
      state.bpm = Number(bpm.value);
      $('#bpm-out').value = bpm.value;
    });

    const volume = $('#volume');
    volume.addEventListener('input', function () {
      state.volume = Number(volume.value) / 100;
      $('#volume-out').value = volume.value;
      if (master) master.gain.value = state.volume;
    });

    const loops = $('#loops');
    loops.addEventListener('input', function () {
      state.loops = Number(loops.value);
      $('#loops-out').value = loops.value;
    });

    const metro = $('#metro');
    metro.addEventListener('click', function () {
      state.metronome = !state.metronome;
      metro.setAttribute('aria-pressed', String(state.metronome));
      metro.classList.toggle('is-on', state.metronome);
    });

    $('#rec').addEventListener('click', function () {
      state.recording = !state.recording;
      syncRecord();
    });

    $('#clear').addEventListener('click', function () {
      const track = activeTrack();
      track.pattern = emptyPattern(track.rows);
      renderGrid();
      renderTabs();
      status(t('transport.cleared'));
    });

    const pressed = new Set();

    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (state.playing) stop();
        else start();
        return;
      }

      const row = KEY_HINTS.indexOf(e.key.toUpperCase());
      if (row === -1 || row >= activeTrack().rows) return;
      if (pressed.has(row)) return;

      e.preventDefault();
      pressed.add(row);
      hit(row, $('.key[data-row="' + row + '"]'));
    });

    document.addEventListener('keyup', function (e) {
      const row = KEY_HINTS.indexOf(e.key.toUpperCase());
      if (row !== -1) pressed.delete(row);
    });
  }

  function stamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return (
      d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) +
      '-' + pad(d.getHours()) + pad(d.getMinutes())
    );
  }

  function download(blob, name) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  function hasNotes() {
    return state.tracks.some((track) =>
      track.pattern.some((row) => row.some((v) => v)),
    );
  }

  async function exportWav() {
    if (!hasNotes()) {
      status(t('export.empty'));
      return;
    }

    status(t('export.rendering'));

    const sampleRate = 44100;
    const step = stepDuration();

    const tail = 2;
    const seconds = step * STEPS * state.loops + tail;

    const Offline = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const off = new Offline(2, Math.ceil(seconds * sampleRate), sampleRate);

    const out = off.createGain();
    out.gain.value = state.volume;
    out.connect(buildGuard(off, off.destination));

    for (let loop = 0; loop < state.loops; loop++) {
      for (let s = 0; s < STEPS; s++) {
        const time = (loop * STEPS + s) * step + 0.05;
        state.tracks.forEach(function (track) {
          if (track.muted) return;
          for (let row = 0; row < track.rows; row++) {
            if (!track.pattern[row][s]) continue;
            audio.play(off, out, track.id, row, time, noteLength(track.id), 1);
          }
        });
      }
    }

    const rendered = await off.startRendering();
    const name = 'oktava-' + stamp() + '.wav';
    download(audio.encodeWav(rendered), name);
    status(i18n.fill(t('export.done'), { name: name }));
  }

  function saveProject() {
    const data = {
      app: 'oktava',
      version: 1,
      bpm: state.bpm,
      tracks: state.tracks.map((track) => ({
        id: track.id,
        muted: track.muted,
        pattern: track.pattern,
      })),
    };

    const name = 'oktava-' + stamp() + '.json';
    download(new Blob([JSON.stringify(data)], { type: 'application/json' }), name);
    status(i18n.fill(t('export.savedProject'), { name: name }));
  }

  function loadProject(file) {
    const reader = new FileReader();

    reader.onload = function () {
      try {
        const data = JSON.parse(String(reader.result));
        if (!data || data.app !== 'oktava' || !Array.isArray(data.tracks)) throw new Error('формат');

        if (state.playing) stop();

        if (data.bpm) {
          state.bpm = Math.min(180, Math.max(60, Number(data.bpm) || 104));
          $('#bpm').value = state.bpm;
          $('#bpm-out').value = state.bpm;
        }

        data.tracks.forEach(function (saved) {
          const track = state.tracks.filter((x) => x.id === saved.id)[0];
          if (!track || !Array.isArray(saved.pattern)) return;

          const fresh = emptyPattern(track.rows);
          for (let row = 0; row < track.rows; row++) {
            for (let s = 0; s < STEPS; s++) {
              fresh[row][s] = saved.pattern[row] && saved.pattern[row][s] ? 1 : 0;
            }
          }
          track.pattern = fresh;
          track.muted = Boolean(saved.muted);
        });

        renderTabs();
        renderGrid();
        status(t('export.loadedProject'));
      } catch (e) {
        status(t('export.loadError'));
      }
    };

    reader.onerror = () => status(t('export.loadError'));
    reader.readAsText(file);
  }

  function initExport() {
    $('#export-wav').addEventListener('click', function () {
      ensureAudio();
      exportWav().catch(() => status(t('export.loadError')));
    });

    $('#save-project').addEventListener('click', saveProject);

    const input = $('#load-input');
    $('#load-project').addEventListener('click', () => input.click());
    input.addEventListener('change', function () {
      if (input.files && input.files[0]) loadProject(input.files[0]);
      input.value = '';
    });
  }

  function initHelp() {
    const sheet = $('#help');
    const open = $('#help-open');

    function setOpen(next) {
      sheet.hidden = !next;
      document.body.classList.toggle('is-locked', next);
      if (next) $('#help-close').focus();
      else open.focus();
    }

    open.addEventListener('click', () => setOpen(true));
    $('#help-close').addEventListener('click', () => setOpen(false));
    sheet.addEventListener('click', function (e) {
      if (e.target === sheet) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !sheet.hidden) setOpen(false);
    });
  }

  function rebuildLocalised() {
    renderTabs();
    renderGrid();
    renderKeys();
    syncTransport();
    syncRecord();
  }

  $$('.lang__btn').forEach(function (btn) {
    btn.addEventListener('click', () => i18n.set(btn.dataset.lang));
  });

  i18n.onChange(rebuildLocalised);
  i18n.apply(i18n.get());

  initControls();
  initExport();
  initHelp();

  const year = $('#footer-year');
  if (year) year.textContent = '© ' + new Date().getFullYear();
})();
