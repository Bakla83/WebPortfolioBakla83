/*
  Связка: состояние редактора, ввод с нотного стана и с пианино, отмена,
  воспроизведение, файлы.

  Всё состояние живёт в одном объекте, а любое изменение партитуры идёт
  через mutate() — она же кладёт снимок в стек отмены и перерисовывает
  лист. Так не бывает случая, когда что-то поменялось, а на экране осталось
  старое: забыть перерисовать просто негде.
*/
(function (ns) {
  'use strict';

  const sc = ns.score;
  const render = ns.render;
  const audio = ns.audio;
  const i18n = ns.i18n;

  const THEME_KEY = 'partitura-theme';

  /** Диапазон пианино: от до большой октавы до до третьей — четыре октавы. */
  const FIRST_MIDI = 36;
  const LAST_MIDI = 84;
  const WHITE_W = 30;
  const BLACK_W = 19;

  const WHITE_PC = [0, 2, 4, 5, 7, 9, 11];

  /** Буквы компьютерной клавиатуры → ступени внутри октавы. */
  const KEY_MAP = {
    a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11, k: 12, o: 13, l: 14,
  };

  const state = {
    score: sc.demo(),
    selected: null,
    hoverD: null,
    playing: null,
    dur: 2, // четвертная
    dot: false,
    acc: 'none',
    rest: false,
    naming: 'letters',
    octave: 4,
    info: null,
  };

  const undoStack = [];
  const redoStack = [];

  const el = {};

  /* ────────────────────────────── помощники ────────────────────────────── */

  function byId(id) {
    return document.getElementById(id);
  }

  function lang() {
    return i18n.get();
  }

  function t(key, values) {
    const raw = i18n.t(lang(), key);
    return values ? i18n.fill(raw, values) : raw;
  }

  function noteNames() {
    return state.naming === 'solfege' ? i18n.t(lang(), 'piano.solfegeNames') : null;
  }

  function labelOfMidi(midi) {
    const spelled = sc.spell(midi, state.score.fifths, state.acc === 'flat' ? 'flat' : undefined);
    return sc.noteLabel(spelled.d, sc.alterOf(spelled, state.score.fifths), noteNames());
  }

  /* ─────────────────────────── изменение партитуры ─────────────────────── */

  function snapshot() {
    return JSON.stringify(sc.toJSON(state.score));
  }

  function restore(raw) {
    const parsed = sc.fromJSON(JSON.parse(raw));
    if (parsed) state.score = parsed;
  }

  /** Единственная точка изменения: снимок → правка → перерисовка. */
  function mutate(fn) {
    const before = snapshot();
    fn();
    const after = snapshot();
    if (before === after) return;

    undoStack.push(before);
    if (undoStack.length > 200) undoStack.shift();
    redoStack.length = 0;
    refresh();
  }

  function undo() {
    if (!undoStack.length) return;
    redoStack.push(snapshot());
    restore(undoStack.pop());
    state.selected = clampSelection(state.selected);
    refresh();
  }

  function redo() {
    if (!redoStack.length) return;
    undoStack.push(snapshot());
    restore(redoStack.pop());
    state.selected = clampSelection(state.selected);
    refresh();
  }

  function clampSelection(index) {
    if (index === null || index === undefined) return null;
    if (!state.score.events.length) return null;
    return Math.max(0, Math.min(index, state.score.events.length - 1));
  }

  /* ──────────────────────────────── ввод нот ──────────────────────────── */

  function currentTicks() {
    return sc.DURATIONS[state.dur].ticks;
  }

  function makeEvent(notes) {
    return { notes: notes, base: currentTicks(), dot: state.dot };
  }

  function insertEvent(event) {
    mutate(function () {
      if (state.selected === null) {
        state.score.events.push(event);
      } else {
        state.score.events.splice(state.selected + 1, 0, event);
        state.selected = state.selected + 1;
      }
    });
  }

  /** Нота со стана: ступень известна, знак берётся с панели. */
  function addByStep(d) {
    if (state.rest) {
      insertEvent(makeEvent([]));
      return;
    }
    const acc = state.acc === 'sharp' ? 1 : state.acc === 'flat' ? -1 : null;
    const note = { d: d, acc: acc };
    insertEvent(makeEvent([note]));
    preview(sc.midiOfNote(note, state.score.fifths));
  }

  /** Нота с пианино: известен звук, запись подбирается по тональности. */
  function addByMidi(midi) {
    if (state.rest) {
      insertEvent(makeEvent([]));
      return;
    }
    const spelled = sc.spell(
      midi,
      state.score.fifths,
      state.acc === 'flat' ? 'flat' : state.acc === 'sharp' ? 'sharp' : undefined,
    );
    insertEvent(makeEvent([spelled]));
    preview(midi);
  }

  function preview(midi) {
    audio.note(midi, Math.min(1.4, currentTicks() * sc.tickSeconds(state.score)));
  }

  function deleteAt(index) {
    if (index === null || !state.score.events.length) return;
    mutate(function () {
      state.score.events.splice(index, 1);
      state.selected = index > 0 ? index - 1 : state.score.events.length ? 0 : null;
    });
  }

  function moveSelected(steps) {
    if (state.selected === null) return;
    mutate(function () {
      const event = state.score.events[state.selected];
      if (!event || sc.isRest(event)) return;
      event.notes = event.notes.map(function (note) {
        return { d: note.d + steps, acc: note.acc };
      });
      const first = event.notes[0];
      preview(sc.midiOfNote(first, state.score.fifths));
    });
  }

  /* ──────────────────────────────── пианино ──────────────────────────── */

  function buildPiano() {
    const whites = [];
    const blacks = [];

    for (let midi = FIRST_MIDI; midi <= LAST_MIDI; midi++) {
      const pc = midi % 12;
      if (WHITE_PC.indexOf(pc) !== -1) {
        whites.push(midi);
      } else {
        blacks.push({ midi: midi, after: whites.length - 1 });
      }
    }

    const width = whites.length * WHITE_W;
    let html = '<div class="piano__whites">';
    whites.forEach(function (midi, i) {
      html +=
        '<button class="key key--white" type="button" data-midi="' + midi + '" ' +
        'style="left:' + i * WHITE_W + 'px;width:' + WHITE_W + 'px">' +
        '<span class="key__label"></span></button>';
    });
    html += '</div><div class="piano__blacks">';
    blacks.forEach(function (item) {
      const left = (item.after + 1) * WHITE_W - BLACK_W / 2;
      html +=
        '<button class="key key--black" type="button" data-midi="' + item.midi + '" ' +
        'style="left:' + left + 'px;width:' + BLACK_W + 'px"></button>';
    });
    html += '</div>';

    el.piano.style.width = width + 'px';
    el.piano.innerHTML = html;
    labelPiano();
  }

  /** Подписи на белых клавишах: буквенные или слоговые, октава — у «до». */
  function labelPiano() {
    const names = noteNames();
    el.piano.querySelectorAll('.key--white').forEach(function (key) {
      const midi = Number(key.dataset.midi);
      const spelled = sc.spell(midi, 0, 'sharp');
      const label = names ? names[sc.letterOf(spelled.d)] : sc.LETTERS[sc.letterOf(spelled.d)];
      const octave = sc.octaveOf(spelled.d);
      const isC = midi % 12 === 0;
      key.querySelector('.key__label').textContent = isC ? label + octave : label;
      key.classList.toggle('key--anchor', isC);
      key.setAttribute('aria-label', t('a11y.key', { note: label + octave }));
    });
    el.piano.querySelectorAll('.key--black').forEach(function (key) {
      const midi = Number(key.dataset.midi);
      key.setAttribute('aria-label', t('a11y.key', { note: labelOfMidi(midi) }));
    });
  }

  function lightKeys(midis) {
    el.piano.querySelectorAll('.key.is-lit').forEach(function (key) {
      key.classList.remove('is-lit');
    });
    (midis || []).forEach(function (midi) {
      const key = el.piano.querySelector('.key[data-midi="' + midi + '"]');
      if (key) key.classList.add('is-lit');
    });
  }

  function flashKey(midi) {
    const key = el.piano.querySelector('.key[data-midi="' + midi + '"]');
    if (!key) return;
    key.classList.add('is-hit');
    setTimeout(function () {
      key.classList.remove('is-hit');
    }, 180);
  }

  /* ─────────────────────────────── панель ─────────────────────────────── */

  /** Иконка длительности: та же нота, что появится в листе. */
  function durationIcon(id) {
    const open = id === 'whole' || id === 'half';
    const stem = id !== 'whole';
    const flags = id === 'eighth' ? 1 : id === 'sixteenth' ? 2 : 0;

    let out = '<svg viewBox="0 0 22 28" aria-hidden="true" class="dur-icon">';
    out +=
      '<ellipse cx="8" cy="21" rx="5.4" ry="3.9" transform="rotate(-20 8 21)" ' +
      (open ? 'fill="none" stroke="currentColor" stroke-width="1.8"' : 'fill="currentColor"') + '/>';
    if (stem) out += '<rect x="12.2" y="4" width="1.7" height="17.4" fill="currentColor"/>';
    for (let i = 0; i < flags; i++) {
      const y = 4.6 + i * 5;
      out +=
        '<path d="M13.9 ' + y + ' C18.6 ' + (y + 2.4) + ' 19 ' + (y + 6) + ' 15.4 ' + (y + 8.6) +
        ' C17.6 ' + (y + 5.2) + ' 16.2 ' + (y + 3.4) + ' 13.9 ' + (y + 3) + ' Z" fill="currentColor"/>';
    }
    return out + '</svg>';
  }

  function buildDurations() {
    el.durations.innerHTML = sc.DURATIONS.map(function (item, index) {
      return (
        '<button class="seg__btn seg__btn--dur' + (index === state.dur ? ' is-on' : '') + '" type="button" ' +
        'data-dur="' + index + '" aria-pressed="' + (index === state.dur) + '" ' +
        'data-i18n-title="durations.' + item.id + '">' + durationIcon(item.id) + '</button>'
      );
    }).join('');
  }

  function buildKeySelect() {
    const tonics = i18n.t(lang(), 'score.tonics');
    const major = t('score.major');
    el.key.innerHTML = sc.FIFTHS_RANGE.map(function (fifths, i) {
      const signs = fifths === 0 ? '' : ' (' + Math.abs(fifths) + (fifths > 0 ? '♯' : '♭') + ')';
      return (
        '<option value="' + fifths + '"' + (fifths === state.score.fifths ? ' selected' : '') + '>' +
        tonics[i] + ' ' + major + signs + '</option>'
      );
    }).join('');
  }

  function syncTools() {
    el.durations.querySelectorAll('[data-dur]').forEach(function (btn) {
      const on = Number(btn.dataset.dur) === state.dur;
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', String(on));
    });

    el.accidentals.querySelectorAll('[data-acc]').forEach(function (btn) {
      const on = btn.dataset.acc === state.acc;
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', String(on));
    });

    el.dot.classList.toggle('is-on', state.dot);
    el.dot.setAttribute('aria-pressed', String(state.dot));
    el.rest.classList.toggle('is-on', state.rest);
    el.rest.setAttribute('aria-pressed', String(state.rest));

    el.undo.disabled = undoStack.length === 0;
    el.redo.disabled = redoStack.length === 0;
  }

  /* ────────────────────────────── перерисовка ────────────────────────────── */

  function refresh() {
    state.info = render.draw(el.score, state.score, state);
    syncTools();
    updateStatus();
  }

  function updateStatus() {
    const events = state.score.events;
    const notes = events.filter(function (event) {
      return !sc.isRest(event);
    }).length;

    if (!events.length) {
      el.status.textContent = t('sheet.empty');
      return;
    }

    const bars = sc.measures(state.score).length;
    const seconds = Math.round(sc.totalTicks(state.score) * sc.tickSeconds(state.score));
    let text = t('sheet.counts', { notes: notes, bars: bars, seconds: seconds });

    if (state.selected !== null && events[state.selected] && !sc.isRest(events[state.selected])) {
      const note = events[state.selected].notes[0];
      const label = sc.noteLabel(note.d, sc.alterOf(note, state.score.fifths), noteNames());
      text += ' · ' + t('sheet.selected', { note: label });
    }
    el.status.textContent = text;
  }

  /* ──────────────────────────── попадание мышью ──────────────────────────── */

  /** Экранная точка → координаты внутри SVG (лист может быть отмасштабирован). */
  function toSvgPoint(event) {
    const rect = el.score.getBoundingClientRect();
    const info = state.info;
    if (!info || !rect.width) return null;
    const scale = info.width / rect.width;
    return { x: (event.clientX - rect.left) * scale, y: (event.clientY - rect.top) * scale };
  }

  function systemAt(point) {
    const systems = state.info ? state.info.systems : [];
    for (let i = 0; i < systems.length; i++) {
      const system = systems[i];
      const height = render.STAFF_H + 104;
      if (point.y >= system.top && point.y < system.top + height) return system;
    }
    return systems[systems.length - 1] || null;
  }

  function stepAt(point) {
    const system = systemAt(point);
    if (!system) return null;
    const d = render.dOfY(state.score.clef, point.y, system.staffTop);
    // Ограничение по пианино: выше и ниже нот всё равно не сыграть
    const min = sc.spell(FIRST_MIDI, 0, 'sharp').d;
    const max = sc.spell(LAST_MIDI, 0, 'sharp').d;
    return Math.max(min, Math.min(max, d));
  }

  /* ────────────────────────────── воспроизведение ────────────────────────── */

  function setPlaying(on) {
    el.play.classList.toggle('is-on', on);
    el.play.setAttribute('aria-pressed', String(on));
    el.playLabel.textContent = t(on ? 'transport.stop' : 'transport.play');
  }

  function startPlayback() {
    const started = audio.play(state.score, {
      onEvent: function (index) {
        state.playing = index;
        const event = index === null ? null : state.score.events[index];
        lightKeys(
          event && !sc.isRest(event)
            ? event.notes.map(function (note) {
                return sc.midiOfNote(note, state.score.fifths);
              })
            : [],
        );
        refresh();
        scrollToPlaying();
      },
      onStop: function () {
        state.playing = null;
        lightKeys([]);
        setPlaying(false);
        refresh();
      },
    });

    if (started) {
      state.hoverD = null;
      setPlaying(true);
    }
  }

  /** Держит звучащую строку в поле зрения, но не дёргает лист без нужды. */
  function scrollToPlaying() {
    if (state.playing === null || !state.info) return;
    const item = state.info.positions[state.playing];
    if (!item) return;
    const system = state.info.systems[item.system];
    const paper = el.paper;
    const scale = el.score.getBoundingClientRect().width / state.info.width;
    const top = system.top * scale;
    const bottom = (system.top + render.STAFF_H + 104) * scale;

    if (top < paper.scrollTop || bottom > paper.scrollTop + paper.clientHeight) {
      paper.scrollTo({ top: Math.max(0, top - 12), behavior: 'smooth' });
    }
  }

  /* ─────────────────────────────── файлы ─────────────────────────────── */

  function download(blob, name) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function say(message) {
    el.filesStatus.textContent = message;
    el.filesStatus.hidden = false;
  }

  function stamp() {
    const now = new Date();
    const pad = function (n) {
      return String(n).padStart(2, '0');
    };
    return now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate()) + '-' +
      pad(now.getHours()) + pad(now.getMinutes());
  }

  function exportMidi() {
    if (!state.score.events.length) return say(t('files.empty'));
    const name = 'partitura-' + stamp() + '.mid';
    download(new Blob([sc.toMidi(state.score)], { type: 'audio/midi' }), name);
    say(t('files.midiDone', { name: name }));
  }

  function saveProject() {
    if (!state.score.events.length) return say(t('files.empty'));
    const name = 'partitura-' + stamp() + '.json';
    const data = JSON.stringify(sc.toJSON(state.score), null, 2);
    download(new Blob([data], { type: 'application/json' }), name);
    say(t('files.saved', { name: name }));
  }

  function loadProject(file) {
    const reader = new FileReader();
    reader.onload = function () {
      let parsed = null;
      try {
        parsed = sc.fromJSON(JSON.parse(String(reader.result)));
      } catch (e) {
        parsed = null;
      }
      if (!parsed) return say(t('files.loadError'));

      mutate(function () {
        state.score = parsed;
        state.selected = null;
      });
      syncScoreControls();
      refresh();
      say(t('files.loaded'));
    };
    reader.readAsText(file);
  }

  function syncScoreControls() {
    el.clef.value = state.score.clef;
    el.meter.value = state.score.meter.beats + '/' + state.score.meter.unit;
    el.tempo.value = state.score.tempo;
    el.tempoOut.value = state.score.tempo;
    buildKeySelect();
  }

  /* ────────────────────────────── события ────────────────────────────── */

  function bind() {
    /* — панель ввода — */
    el.durations.addEventListener('click', function (event) {
      const btn = event.target.closest('[data-dur]');
      if (!btn) return;
      state.dur = Number(btn.dataset.dur);
      syncTools();
    });

    el.accidentals.addEventListener('click', function (event) {
      const btn = event.target.closest('[data-acc]');
      if (!btn) return;
      state.acc = btn.dataset.acc;
      syncTools();
    });

    el.dot.addEventListener('click', function () {
      state.dot = !state.dot;
      syncTools();
    });

    el.rest.addEventListener('click', function () {
      state.rest = !state.rest;
      syncTools();
    });

    el.undo.addEventListener('click', undo);
    el.redo.addEventListener('click', redo);
    el.backspace.addEventListener('click', function () {
      deleteAt(state.selected === null ? state.score.events.length - 1 : state.selected);
    });
    el.clear.addEventListener('click', function () {
      mutate(function () {
        state.score.events = [];
        state.selected = null;
      });
    });

    /* — партитура — */
    el.clef.addEventListener('change', function () {
      mutate(function () {
        state.score.clef = el.clef.value;
      });
    });

    el.meter.addEventListener('change', function () {
      const parts = el.meter.value.split('/');
      mutate(function () {
        state.score.meter = { beats: Number(parts[0]), unit: Number(parts[1]) };
      });
    });

    el.key.addEventListener('change', function () {
      mutate(function () {
        state.score.fifths = Number(el.key.value);
      });
      labelPiano();
    });

    el.tempo.addEventListener('input', function () {
      state.score.tempo = Number(el.tempo.value);
      el.tempoOut.value = el.tempo.value;
      updateStatus();
    });

    el.volume.addEventListener('input', function () {
      el.volumeOut.value = el.volume.value;
      audio.setVolume(Number(el.volume.value) / 100);
    });

    el.play.addEventListener('click', function () {
      if (audio.isPlaying()) audio.stop();
      else startPlayback();
    });

    /* — нотный лист — */
    el.score.addEventListener('pointerdown', function (event) {
      const point = toSvgPoint(event);
      if (!point) return;

      const group = event.target.closest('[data-index]');
      if (group) {
        state.selected = Number(group.dataset.index);
        const chosen = state.score.events[state.selected];
        if (chosen && !sc.isRest(chosen)) {
          preview(sc.midiOfNote(chosen.notes[0], state.score.fifths));
        }
        refresh();
        return;
      }

      const d = stepAt(point);
      if (d !== null) addByStep(d);
    });

    el.score.addEventListener('pointermove', function (event) {
      if (audio.isPlaying()) return;
      const point = toSvgPoint(event);
      if (!point) return;
      const d = stepAt(point);
      if (d === state.hoverD) return;
      state.hoverD = d;
      lightKeys(d === null ? [] : [sc.midiOf(d, sc.keyAlter(state.score.fifths, sc.letterOf(d)))]);
      refresh();
    });

    el.score.addEventListener('pointerleave', function () {
      if (state.hoverD === null) return;
      state.hoverD = null;
      lightKeys([]);
      refresh();
    });

    /* — пианино — */
    el.piano.addEventListener('pointerdown', function (event) {
      const key = event.target.closest('.key');
      if (!key) return;
      event.preventDefault();
      const midi = Number(key.dataset.midi);
      flashKey(midi);
      if (audio.isPlaying()) audio.note(midi, 0.6);
      else addByMidi(midi);
    });

    el.naming.addEventListener('click', function (event) {
      const btn = event.target.closest('[data-naming]');
      if (!btn) return;
      state.naming = btn.dataset.naming;
      el.naming.querySelectorAll('[data-naming]').forEach(function (item) {
        const on = item === btn;
        item.classList.toggle('is-on', on);
        item.setAttribute('aria-pressed', String(on));
      });
      labelPiano();
      updateStatus();
    });

    /* — файлы — */
    el.exportMidi.addEventListener('click', exportMidi);
    el.saveProject.addEventListener('click', saveProject);
    el.loadProject.addEventListener('click', function () {
      el.loadInput.click();
    });
    el.loadInput.addEventListener('change', function () {
      if (el.loadInput.files && el.loadInput.files[0]) loadProject(el.loadInput.files[0]);
      el.loadInput.value = '';
    });
    el.print.addEventListener('click', function () {
      window.print();
    });

    /* — тема, язык, подсказка — */
    el.theme.addEventListener('click', function () {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {}
    });

    document.querySelectorAll('.lang__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        i18n.set(btn.dataset.lang);
      });
    });

    el.helpOpen.addEventListener('click', function () {
      el.help.hidden = false;
      el.helpClose.focus();
    });
    el.helpClose.addEventListener('click', function () {
      el.help.hidden = true;
      el.helpOpen.focus();
    });
    el.help.addEventListener('click', function (event) {
      if (event.target === el.help) el.help.hidden = true;
    });

    /* — клавиатура компьютера — */
    document.addEventListener('keydown', onKey);

    /* — размер окна — */
    let resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(refresh, 120);
    });
  }

  function onKey(event) {
    if (!el.help.hidden && event.key === 'Escape') {
      el.help.hidden = true;
      return;
    }

    const target = event.target;
    const typing = target && (target.tagName === 'INPUT' || target.tagName === 'SELECT');
    if (typing && event.key !== 'Escape') return;

    const key = event.key.toLowerCase();

    if ((event.ctrlKey || event.metaKey) && key === 'z') {
      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && key === 'y') {
      event.preventDefault();
      redo();
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (key >= '1' && key <= '5') {
      state.dur = Number(key) - 1;
      syncTools();
      return;
    }

    switch (key) {
      case ' ':
        event.preventDefault();
        if (audio.isPlaying()) audio.stop();
        else startPlayback();
        return;
      case '.':
        state.dot = !state.dot;
        syncTools();
        return;
      case 'r':
        state.rest = !state.rest;
        syncTools();
        return;
      case '+':
      case '=':
        state.acc = state.acc === 'sharp' ? 'none' : 'sharp';
        syncTools();
        return;
      case '-':
        state.acc = state.acc === 'flat' ? 'none' : 'flat';
        syncTools();
        return;
      case 'delete':
      case 'backspace':
        event.preventDefault();
        deleteAt(state.selected === null ? state.score.events.length - 1 : state.selected);
        return;
      case 'arrowleft':
        event.preventDefault();
        state.selected =
          state.selected === null
            ? state.score.events.length - 1
            : Math.max(0, state.selected - 1);
        refresh();
        return;
      case 'arrowright':
        event.preventDefault();
        if (state.selected === null) return;
        state.selected =
          state.selected >= state.score.events.length - 1 ? null : state.selected + 1;
        refresh();
        return;
      case 'arrowup':
        event.preventDefault();
        moveSelected(event.shiftKey ? 7 : 1);
        return;
      case 'arrowdown':
        event.preventDefault();
        moveSelected(event.shiftKey ? -7 : -1);
        return;
      case 'z':
        state.octave = Math.max(1, state.octave - 1);
        return;
      case 'x':
        state.octave = Math.min(6, state.octave + 1);
        return;
      default:
        break;
    }

    if (Object.prototype.hasOwnProperty.call(KEY_MAP, key)) {
      const midi = (state.octave + 1) * 12 + KEY_MAP[key];
      if (midi < FIRST_MIDI || midi > LAST_MIDI) return;
      event.preventDefault();
      flashKey(midi);
      if (audio.isPlaying()) audio.note(midi, 0.6);
      else addByMidi(midi);
    }
  }

  /* ─────────────────────────────── запуск ─────────────────────────────── */

  function collect() {
    [
      'durations', 'accidentals', 'dot', 'rest', 'undo', 'redo', 'backspace', 'clear',
      'play', 'tempo', 'volume', 'clef', 'meter', 'key', 'status', 'score', 'paper',
      'piano', 'naming', 'print', 'help',
    ].forEach(function (id) {
      el[id] = byId(id);
    });

    el.playLabel = byId('play-label');
    el.tempoOut = byId('tempo-out');
    el.volumeOut = byId('volume-out');
    el.exportMidi = byId('export-midi');
    el.saveProject = byId('save-project');
    el.loadProject = byId('load-project');
    el.loadInput = byId('load-input');
    el.filesStatus = byId('files-status');
    el.helpOpen = byId('help-open');
    el.helpClose = byId('help-close');
    el.theme = byId('theme');
  }

  function start() {
    collect();
    buildDurations();
    buildPiano();
    syncScoreControls();
    bind();

    i18n.apply(i18n.get());
    i18n.onChange(function () {
      buildKeySelect();
      labelPiano();
      setPlaying(audio.isPlaying());
      updateStatus();
    });

    audio.setVolume(Number(el.volume.value) / 100);
    byId('footer-year').textContent = '© ' + new Date().getFullYear();

    refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})(window.Partitura);
