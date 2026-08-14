window.Oktava = window.Oktava || {};

(function (ns) {
  'use strict';

  const STORAGE_KEY = 'oktava-lang';
  const SUPPORTED = ['ru', 'en'];

  const I18N = {
    ru: {
      meta: {
        title: 'Октава — играйте и сочиняйте музыку в браузере',
        description:
          'Пять инструментов, шаговый секвенсор и живая игра с клавиатуры. Готовую вещь можно сохранить на устройство файлом .wav — без регистрации и установки.',
      },

      a11y: {
        skip: 'Перейти к студии',
        lang: 'Язык интерфейса',
        transport: 'Управление воспроизведением',
        tracks: 'Выбор дорожки',
        grid: 'Сетка шагов',
        keys: 'Клавиатура инструмента',
        close: 'Закрыть',
        cell: 'Шаг {step}, нота {note}',
        cellDrum: 'Шаг {step}, {note}',
        mute: 'Выключить дорожку',
        unmute: 'Включить дорожку',
        key: 'Сыграть ноту {note}, клавиша {hint}',
      },

      brand: {
        name: 'Октава',
        sub: 'студия в браузере',
      },

      transport: {
        play: 'Играть',
        stop: 'Стоп',
        tempo: 'Темп',
        volume: 'Громкость',
        metronome: 'Метроном',
        clear: 'Очистить',
        cleared: 'Дорожка очищена.',
      },

      tracks: {
        title: 'Дорожки',
      },

      instruments: {
        piano: 'Пианино',
        guitar: 'Гитара',
        bell: 'Колокольчики',
        bass: 'Бас',
        drums: 'Барабаны',
      },

      drums: {
        kick: 'Бочка',
        snare: 'Малый барабан',
        hat: 'Хэт',
        clap: 'Хлопок',
      },

      seq: {
        hint: 'Нажимайте клетки — так набирается партия. По вертикали ноты, по горизонтали шаги.',
        hintDrums: 'Нажимайте клетки — так набирается ритм. Каждый ряд свой звук, слева направо идёт такт.',
      },

      keys: {
        title: 'Живая игра',
        record: 'Записывать',
        recordOn: 'Идёт запись',
        hint: 'Нажимайте клавиши мышью или кнопками на клавиатуре — подписи стоят на самих клавишах. Включите запись, и сыгранное ляжет в сетку.',
      },

      export: {
        title: 'Сохранить на устройство',
        lead:
          'Готовая вещь сводится в обычный звуковой файл — его можно отправить, залить куда угодно или открыть любым плеером. Проект сохраняется отдельно, чтобы вернуться и доделать.',
        loops: 'Повторов в файле',
        wav: 'Скачать .wav',
        save: 'Сохранить проект',
        load: 'Открыть проект',
        rendering: 'Свожу дорожки…',
        done: 'Готово: файл {name} сохранён на устройство.',
        savedProject: 'Проект сохранён файлом {name}. Открыть его можно кнопкой рядом.',
        loadedProject: 'Проект загружен.',
        loadError: 'Не получилось прочитать файл — похоже, это не проект «Октавы».',
        empty: 'Сетка пустая: наберите хотя бы одну ноту, иначе в файле будет тишина.',
      },

      help: {
        open: 'Как играть',
        title: 'Как играть',
        p1: 'Выберите дорожку вверху — у каждой свой инструмент и своя партия.',
        p2: 'Кликайте по клеткам сетки. Слева ноты, снизу шаги: слева направо звучит один такт.',
        p3: 'Нажмите «Играть» — все дорожки зазвучат вместе и по кругу.',
        p4: 'Клавиатура внизу играет вживую. Кнопками на клавиатуре компьютера — тоже, буквы подписаны на клавишах.',
        p5: 'Включите «Записывать» во время игры — сыгранное само встанет в сетку, ближайшим шагом.',
        p6: '«Скачать .wav» сводит всё в звуковой файл и сохраняет на устройство. Ноты подобраны так, что мимо не сыграешь.',
      },

      footer: {
        note: 'Звук синтезируется в браузере — ни одной звуковой записи в проекте нет',
      },
    },

    en: {
      meta: {
        title: 'Oktava — play and compose music in the browser',
        description:
          'Five instruments, a step sequencer and live playing from the keyboard. The finished piece saves to your device as a .wav file — no sign-up, no install.',
      },

      a11y: {
        skip: 'Skip to the studio',
        lang: 'Interface language',
        transport: 'Playback controls',
        tracks: 'Track selection',
        grid: 'Step grid',
        keys: 'Instrument keyboard',
        close: 'Close',
        cell: 'Step {step}, note {note}',
        cellDrum: 'Step {step}, {note}',
        mute: 'Mute the track',
        unmute: 'Unmute the track',
        key: 'Play note {note}, key {hint}',
      },

      brand: {
        name: 'Oktava',
        sub: 'a studio in the browser',
      },

      transport: {
        play: 'Play',
        stop: 'Stop',
        tempo: 'Tempo',
        volume: 'Volume',
        metronome: 'Metronome',
        clear: 'Clear',
        cleared: 'Track cleared.',
      },

      tracks: {
        title: 'Tracks',
      },

      instruments: {
        piano: 'Piano',
        guitar: 'Guitar',
        bell: 'Bells',
        bass: 'Bass',
        drums: 'Drums',
      },

      drums: {
        kick: 'Kick',
        snare: 'Snare',
        hat: 'Hi-hat',
        clap: 'Clap',
      },

      seq: {
        hint: 'Click the cells — that is how a part is written. Notes go up the side, steps go across.',
        hintDrums: 'Click the cells to build the beat. Each row is its own sound, one bar runs left to right.',
      },

      keys: {
        title: 'Live playing',
        record: 'Record',
        recordOn: 'Recording',
        hint: 'Play with the mouse or with your computer keyboard — the letters are printed on the keys. Turn on recording and what you play lands in the grid.',
      },

      export: {
        title: 'Save to your device',
        lead:
          'The finished piece is mixed down to an ordinary audio file — send it, upload it anywhere, open it in any player. The project saves separately so you can come back and finish it.',
        loops: 'Repeats in the file',
        wav: 'Download .wav',
        save: 'Save project',
        load: 'Open project',
        rendering: 'Mixing the tracks…',
        done: 'Done: {name} has been saved to your device.',
        savedProject: 'Project saved as {name}. Open it again with the button next to this one.',
        loadedProject: 'Project loaded.',
        loadError: 'Could not read the file — it does not look like an Oktava project.',
        empty: 'The grid is empty: add at least one note, otherwise the file will be silence.',
      },

      help: {
        open: 'How to play',
        title: 'How to play',
        p1: 'Pick a track at the top — each one has its own instrument and its own part.',
        p2: 'Click the cells in the grid. Notes are on the left, steps along the bottom: left to right is one bar.',
        p3: 'Press Play — all the tracks sound together, round and round.',
        p4: 'The keyboard below plays live. So do your computer keys — the letters are printed on them.',
        p5: 'Turn on Record while you play and what you played lands in the grid, snapped to the nearest step.',
        p6: 'Download .wav mixes everything into an audio file and saves it to your device. The notes are chosen so you cannot play a wrong one.',
      },

      footer: {
        note: 'The sound is synthesised in the browser — there is not a single audio recording in the project',
      },
    },
  };

  const listeners = [];

  function t(lang, key) {
    return key
      .split('.')
      .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), I18N[lang]);
  }

  function fill(template, values) {
    return String(template).replace(/\{(\w+)\}/g, function (whole, key) {
      return values[key] !== undefined ? values[key] : whole;
    });
  }

  function getLang() {
    const attr = document.documentElement.getAttribute('lang');
    return SUPPORTED.indexOf(attr) !== -1 ? attr : 'ru';
  }

  function applyLang(lang) {
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const value = t(lang, el.getAttribute('data-i18n'));
      if (typeof value === 'string') el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-content]').forEach((el) => {
      const value = t(lang, el.getAttribute('data-i18n-content'));
      if (typeof value === 'string') el.setAttribute('content', value);
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
      const value = t(lang, el.getAttribute('data-i18n-aria-label'));
      if (typeof value === 'string') el.setAttribute('aria-label', value);
    });

    const title = t(lang, 'meta.title');
    if (typeof title === 'string') document.title = title;

    document.querySelectorAll('.lang__btn').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
    });

    listeners.forEach((fn) => fn(lang));
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
    applyLang(lang);
  }

  ns.i18n = {
    dict: I18N,
    supported: SUPPORTED,
    t: t,
    fill: fill,
    get: getLang,
    set: setLang,
    apply: applyLang,
    onChange: function (fn) {
      listeners.push(fn);
    },
  };
})(window.Oktava);
