/*
  Локализация.

  Ключ data-i18n="a.b" ищется как I18N[lang].a.b. Разметка в index.html
  заполнена русским: если скрипт не выполнится, страница останется
  читаемой, просто без переключателя языков.

  Тексты самих уроков лежат отдельно, в js/lessons.js: они привязаны не к
  элементам разметки, а к шагам сценария, и переводятся вместе с ним.
*/
window.Vetka = window.Vetka || {};

(function (ns) {
  'use strict';

  const STORAGE_KEY = 'vetka-lang';
  const SUPPORTED = ['ru', 'en'];

  const I18N = {
    ru: {
      meta: {
        title: 'Ветка — git и Git Bash по шагам',
        description:
          'Наглядные уроки по git: набираете команды в настоящем на вид Git Bash, а рядом видно, как файл переезжает из папки в индекс, становится коммитом и уходит на GitHub.',
      },

      a11y: {
        skip: 'Перейти к терминалу',
        theme: 'Сменить тему',
        lang: 'Язык интерфейса',
        close: 'Закрыть',
        input: 'Строка ввода команды',
      },

      brand: { name: 'Ветка', sub: 'git по шагам' },

      ui: {
        lessons: 'Уроки',
        lessonsLead:
          'Каждый урок — короткий сценарий: несколько команд, которые вы набираете сами, и схема, на которой видно, что при этом происходит.',
        cheat: 'Шпаргалка',
        cheatLead:
          'Команды, которые встречаются в уроках. Открытые вами отмечены — остальные появятся по ходу.',
        fill: 'Подставить',
        hint: 'Подсказка',
        done: 'Сделано',
        prev: 'Назад',
        next: 'Дальше',
        restart: 'Сначала',
        clear: 'Очистить',
        termTip: '↑ и ↓ — прошлые команды, Tab — дописать команду, Enter — выполнить',
        start: 'Начать',
        again: 'Пройти снова',
        passed: 'пройден',
        steps: 'шагов',
        locked: 'встретится дальше',
      },

      zone: {
        work: 'Рабочая папка',
        workSub: 'то, что лежит на диске',
        index: 'Индекс',
        indexSub: 'что войдёт в коммит',
        local: 'Репозиторий',
        localSub: 'история коммитов',
        remote: 'GitHub',
        remoteSub: 'удалённая копия',

        emptyDesk: 'Здесь пока пусто. Создайте папку: mkdir <имя>',
        emptyOutside: 'Вы стоите рядом с папкой проекта. Зайдите внутрь: cd <имя>',
        emptyFolder: 'Папка пустая. Создайте файл: echo "текст" > index.html',
        noRepo: 'Индекс появится после git init',
        emptyIndex: 'Индекс пуст. Положите в него изменения: git add .',
        noRepoYet: 'Репозитория ещё нет. Заведите его: git init',
        noCommits: 'Коммитов пока нет. Первый: git commit -m "…"',
        noRemote: 'Папка не связана с GitHub: git remote add origin <адрес>',
        remoteEmpty: 'Связь есть, но коммиты ещё не отправлены: git push -u origin main',
      },

      file: {
        clean: 'в коммите',
        untracked: 'не отслеживается',
        modified: 'изменён',
        inIndex: 'в индексе',
        ignored: 'скрыт .gitignore',
        ready: 'готов к коммиту',
      },

      lesson: {
        no: 'Урок {n}',
        step: 'Шаг {n} из {m}',
        drill: 'Проверка',
        drillLead: 'Команду в карточке больше не показываем — наберите её сами.',
        setup: 'Стол накрыт для урока.',
        ok: 'Шаг пройден.',
        mismatch: 'Команда выполнена, но по уроку сейчас нужна другая — она написана слева.',
        drillWrong: 'Не та команда. Попробуйте ещё раз или откройте подсказку.',
        finished: 'Урок пройден.',
        allDone: 'Пройдены все уроки — шпаргалка открыта целиком.',
        nextUp: 'Дальше: {title}',
        free: 'Урок пройден — можно продолжать набирать команды: тренажёр работает и без сценария.',
      },

      footer: {
        note:
          'Терминал ненастоящий: команды разбираются здесь же, в браузере, ничего не устанавливается и никуда не отправляется',
      },
    },

    en: {
      meta: {
        title: 'Vetka — git and Git Bash step by step',
        description:
          'Hands-on git lessons: you type the commands into a convincing Git Bash while the diagram next to it shows the file moving from folder to index, turning into a commit and travelling to GitHub.',
      },

      a11y: {
        skip: 'Skip to the terminal',
        theme: 'Switch the theme',
        lang: 'Interface language',
        close: 'Close',
        input: 'Command input',
      },

      brand: { name: 'Vetka', sub: 'git step by step' },

      ui: {
        lessons: 'Lessons',
        lessonsLead:
          'Every lesson is a short scenario: a handful of commands you type yourself, and a diagram that shows what each one does.',
        cheat: 'Cheat sheet',
        cheatLead: 'The commands used in the lessons. The ones you have met are marked; the rest show up as you go.',
        fill: 'Fill in',
        hint: 'Hint',
        done: 'Done',
        prev: 'Back',
        next: 'Next',
        restart: 'Restart',
        clear: 'Clear',
        termTip: '↑ and ↓ — earlier commands, Tab — complete, Enter — run',
        start: 'Start',
        again: 'Take it again',
        passed: 'passed',
        steps: 'steps',
        locked: 'comes later',
      },

      zone: {
        work: 'Working folder',
        workSub: 'what is on the disk',
        index: 'Index',
        indexSub: 'what goes into the commit',
        local: 'Repository',
        localSub: 'commit history',
        remote: 'GitHub',
        remoteSub: 'the remote copy',

        emptyDesk: 'Nothing here yet. Create a folder: mkdir <name>',
        emptyOutside: 'You are standing next to the project folder. Step in: cd <name>',
        emptyFolder: 'The folder is empty. Create a file: echo "text" > index.html',
        noRepo: 'The index appears after git init',
        emptyIndex: 'The index is empty. Put changes into it: git add .',
        noRepoYet: 'No repository yet. Start one: git init',
        noCommits: 'No commits yet. The first one: git commit -m "…"',
        noRemote: 'Not linked to GitHub: git remote add origin <address>',
        remoteEmpty: 'Linked, but nothing pushed yet: git push -u origin main',
      },

      file: {
        clean: 'committed',
        untracked: 'untracked',
        modified: 'modified',
        inIndex: 'in the index',
        ignored: 'hidden by .gitignore',
        ready: 'ready to commit',
      },

      lesson: {
        no: 'Lesson {n}',
        step: 'Step {n} of {m}',
        drill: 'Check yourself',
        drillLead: 'The command is no longer shown in the card — type it from memory.',
        setup: 'The desk is set for this lesson.',
        ok: 'Step done.',
        mismatch: 'The command ran, but this step needs a different one — it is written on the left.',
        drillWrong: 'Not that command. Try again or open the hint.',
        finished: 'Lesson complete.',
        allDone: 'Every lesson is done — the cheat sheet is fully unlocked.',
        nextUp: 'Up next: {title}',
        free: 'Lesson complete — keep typing if you like: the simulator works without a script too.',
      },

      footer: {
        note:
          'The terminal is a simulation: commands are parsed right here in the browser, nothing is installed and nothing is sent anywhere',
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
})(window.Vetka);
