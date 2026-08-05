/*
  Локализация.

  Ключ data-i18n="a.b" ищется как I18N[lang].a.b. Разметка в index.html
  заполнена русским: если скрипт не выполнится, интерфейс останется
  читаемым, просто без переключателя языков.

  Атрибуты переводятся отдельно — data-i18n-content (meta),
  data-i18n-aria-label и data-i18n-title: видимая подпись, всплывающая
  подсказка и подпись для скринридера у одного элемента часто разные.
*/
window.Partitura = window.Partitura || {};

(function (ns) {
  'use strict';

  const STORAGE_KEY = 'partitura-lang';
  const SUPPORTED = ['ru', 'en'];

  const I18N = {
    ru: {
      meta: {
        title: 'Партитура — пишите ноты и смотрите, как их играют на пианино',
        description:
          'Нотный редактор в браузере: ставите ноты на нотный стан, а клавиатура внизу показывает, какие клавиши пианино нажимаются. Работает и наоборот — нажмите клавишу, и нота встанет в лист.',
      },

      a11y: {
        skip: 'Перейти к нотному листу',
        theme: 'Сменить тему',
        lang: 'Язык интерфейса',
        tools: 'Инструменты ввода',
        durations: 'Длительность',
        accidentals: 'Знаки альтерации',
        edit: 'Правка',
        score: 'Нотный лист',
        naming: 'Обозначения нот',
        piano: 'Клавиатура пианино',
        close: 'Закрыть',
        key: 'Клавиша {note}',
      },

      brand: {
        name: 'Партитура',
        sub: 'ноты и клавиши',
      },

      tools: {
        duration: 'Длительность',
        dot: 'Точка',
        dotHint: 'Точка удлиняет ноту в полтора раза',
        accidental: 'Знак',
        accNone: 'По тональности',
        accSharp: 'Диез — на полтона выше',
        accFlat: 'Бемоль — на полтона ниже',
        rest: 'Пауза',
        restHint: 'Ставить паузу вместо ноты',
        undo: 'Отменить',
        redo: 'Вернуть',
        backspace: 'Удалить ноту перед курсором',
        clear: 'Очистить лист',
      },

      durations: {
        whole: 'Целая',
        half: 'Половинная',
        quarter: 'Четвертная',
        eighth: 'Восьмая',
        sixteenth: 'Шестнадцатая',
      },

      transport: {
        play: 'Играть',
        stop: 'Стоп',
        tempo: 'Темп',
        volume: 'Громкость',
      },

      score: {
        clef: 'Ключ',
        trebleClef: 'Скрипичный',
        bassClef: 'Басовый',
        meter: 'Размер',
        key: 'Тональность',
        major: 'мажор',
        /* Тоники от пяти бемолей до пяти диезов — подряд, по кварто-квинтовому кругу */
        tonics: [
          'Ре-бемоль',
          'Ля-бемоль',
          'Ми-бемоль',
          'Си-бемоль',
          'Фа',
          'До',
          'Соль',
          'Ре',
          'Ля',
          'Ми',
          'Си',
        ],
      },

      sheet: {
        hint:
          'Кликните по стану — нота встанет туда, куда указывает курсор. Клик по готовой ноте выделяет её: стрелками ↑ ↓ двигайте по высоте, ← → переходите между нотами, Delete удаляет.',
        empty: 'Лист пустой. Кликните по стану или по клавише пианино.',
        counts: 'Нот: {notes} · Тактов: {bars} · Звучит {seconds} с',
        selected: 'Выбрана нота {note}',
      },

      piano: {
        title: 'Пианино',
        hint:
          'Клавиши загораются, пока идёт воспроизведение. Нажмите клавишу — нота встанет в лист той же длительности, что выбрана слева.',
        solfege: 'До Ре Ми',
        solfegeNames: ['До', 'Ре', 'Ми', 'Фа', 'Соль', 'Ля', 'Си'],
      },

      files: {
        title: 'Забрать с собой',
        lead:
          'Ноты никуда не отправляются: всё, что набрано, лежит в этой вкладке. Проект сохраняется файлом, а мелодия — стандартным .mid, который откроет любой секвенсор или нотный редактор.',
        midi: 'Скачать .mid',
        save: 'Сохранить проект',
        load: 'Открыть проект',
        print: 'Распечатать ноты',
        midiDone: 'Готово: файл {name} сохранён на устройство.',
        saved: 'Проект сохранён файлом {name}. Открыть его можно кнопкой рядом.',
        loaded: 'Проект загружен.',
        loadError: 'Не получилось прочитать файл — похоже, это не проект «Партитуры».',
        empty: 'В листе нет ни одной ноты — сохранять нечего.',
      },

      help: {
        open: 'Как пользоваться',
        title: 'Как пользоваться',
        p1: 'Выберите длительность слева и кликните по нотному стану — нота встанет на ту линию, куда вы указали.',
        p2: 'То же самое делает пианино: нажатая клавиша добавляет ноту в лист. Пока вы ведёте мышью по стану, на клавиатуре подсвечивается клавиша, которая туда попадёт.',
        p3: 'Клик по готовой ноте выделяет её. Стрелки ↑ ↓ двигают её по высоте, ← → переходят к соседней, Delete удаляет.',
        p4: 'Цифры 1–5 меняют длительность, точка — «.», пауза — R, знаки — «+» и «−». Ctrl+Z отменяет, Ctrl+Shift+Z возвращает.',
        p5: 'Тактовые черты расставляются сами по выбранному размеру: считать доли не нужно.',
        p6: '«Играть» проигрывает лист от начала: нота подсвечивается на стане, а клавиша — на пианино.',
        keys:
          'Буквы на клавиатуре компьютера тоже играют: ряд A S D F G H J K — белые клавиши, W E T Y U — чёрные. Клавиши Z и X сдвигают октаву.',
      },

      footer: {
        note:
          'Ноты и звук рисуются и считаются прямо в браузере — ни одной картинки и ни одной звуковой записи в проекте нет',
      },
    },

    en: {
      meta: {
        title: 'Partitura — write music on a staff and watch it played on a piano',
        description:
          'A notation editor in the browser: place notes on the staff and the keyboard below shows which piano keys are pressed. It works the other way round too — press a key and the note lands on the sheet.',
      },

      a11y: {
        skip: 'Skip to the sheet',
        theme: 'Switch the theme',
        lang: 'Interface language',
        tools: 'Input tools',
        durations: 'Note value',
        accidentals: 'Accidentals',
        edit: 'Editing',
        score: 'Music sheet',
        naming: 'Note names',
        piano: 'Piano keyboard',
        close: 'Close',
        key: 'Key {note}',
      },

      brand: {
        name: 'Partitura',
        sub: 'notes and keys',
      },

      tools: {
        duration: 'Note value',
        dot: 'Dot',
        dotHint: 'A dot makes the note half as long again',
        accidental: 'Accidental',
        accNone: 'Follow the key signature',
        accSharp: 'Sharp — a semitone up',
        accFlat: 'Flat — a semitone down',
        rest: 'Rest',
        restHint: 'Enter a rest instead of a note',
        undo: 'Undo',
        redo: 'Redo',
        backspace: 'Delete the note before the caret',
        clear: 'Clear the sheet',
      },

      durations: {
        whole: 'Whole',
        half: 'Half',
        quarter: 'Quarter',
        eighth: 'Eighth',
        sixteenth: 'Sixteenth',
      },

      transport: {
        play: 'Play',
        stop: 'Stop',
        tempo: 'Tempo',
        volume: 'Volume',
      },

      score: {
        clef: 'Clef',
        trebleClef: 'Treble',
        bassClef: 'Bass',
        meter: 'Time signature',
        key: 'Key',
        major: 'major',
        tonics: ['D♭', 'A♭', 'E♭', 'B♭', 'F', 'C', 'G', 'D', 'A', 'E', 'B'],
      },

      sheet: {
        hint:
          'Click the staff — the note lands where you point. Clicking an existing note selects it: ↑ ↓ move it in pitch, ← → step between notes, Delete removes it.',
        empty: 'The sheet is empty. Click the staff or a piano key.',
        counts: 'Notes: {notes} · Bars: {bars} · Plays for {seconds}s',
        selected: 'Selected note {note}',
      },

      piano: {
        title: 'Piano',
        hint:
          'The keys light up while the sheet plays. Press a key and the note lands on the sheet with the value chosen on the left.',
        solfege: 'Do Re Mi',
        solfegeNames: ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'],
      },

      files: {
        title: 'Take it with you',
        lead:
          'Nothing is sent anywhere: everything you write stays in this tab. The project saves as a file, and the melody as a standard .mid that any sequencer or notation editor will open.',
        midi: 'Download .mid',
        save: 'Save project',
        load: 'Open project',
        print: 'Print the sheet',
        midiDone: 'Done: {name} has been saved to your device.',
        saved: 'Project saved as {name}. Open it again with the button next to this one.',
        loaded: 'Project loaded.',
        loadError: 'Could not read the file — it does not look like a Partitura project.',
        empty: 'There is not a single note on the sheet — nothing to save.',
      },

      help: {
        open: 'How it works',
        title: 'How it works',
        p1: 'Pick a note value on the left and click the staff — the note lands on the line you pointed at.',
        p2: 'The piano does the same: pressing a key adds a note to the sheet. While you move the mouse over the staff, the key that would be used lights up on the keyboard.',
        p3: 'Clicking a note selects it. ↑ ↓ move it in pitch, ← → step to its neighbours, Delete removes it.',
        p4: 'Keys 1–5 change the note value, "." adds a dot, R switches to rests, "+" and "−" set accidentals. Ctrl+Z undoes, Ctrl+Shift+Z redoes.',
        p5: 'Bar lines are placed automatically from the time signature: you never have to count beats.',
        p6: 'Play runs the sheet from the beginning: the note is highlighted on the staff and the key on the piano.',
        keys:
          'Your computer keyboard plays too: A S D F G H J K are the white keys, W E T Y U the black ones. Z and X shift the octave.',
      },

      footer: {
        note:
          'The notation and the sound are drawn and computed in the browser — there is not a single image or audio recording in the project',
      },
    },
  };

  const listeners = [];

  function t(lang, key) {
    return key
      .split('.')
      .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), I18N[lang]);
  }

  /** Подстановка вида {name} — для строк со счётчиками и именами файлов. */
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

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const value = t(lang, el.getAttribute('data-i18n-title'));
      if (typeof value === 'string') el.setAttribute('title', value);
    });

    // <title> живёт вне <body> и под общий обход не попадает
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
})(window.Partitura);
