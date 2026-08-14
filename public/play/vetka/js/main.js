(function (ns) {
  'use strict';

  const PROGRESS_KEY = 'vetka-progress';
  const THEME_KEY = 'vetka-theme';

  const engine = ns.engine;
  const stage = ns.stage;
  const term = ns.term;
  const i18n = ns.i18n;
  const LESSONS = ns.lessons.list;

  const app = {
    state: null,
    lesson: 0,
    step: 0,
    steps: [],
    finished: false,
    progress: { done: [], visited: [] },
  };

  const el = {};

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

  function pick(value) {
    if (!value) return '';
    return value[lang()] !== undefined ? value[lang()] : value.ru;
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) app.progress = Object.assign({ done: [], visited: [] }, JSON.parse(raw));
    } catch (e) {}
  }

  function saveProgress() {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(app.progress));
    } catch (e) {}
  }

  function mark(list, id) {
    if (list.indexOf(id) === -1) list.push(id);
  }

  function currentLesson() {
    return LESSONS[app.lesson];
  }

  function buildSteps(lesson) {
    const steps = lesson.steps.map(function (step) {
      return {
        text: step.text,
        cmd: step.cmd,
        match: step.match,
        hint: step.hint,
        after: step.after,
        drill: false,
      };
    });

    (lesson.drill || []).forEach(function (item) {
      steps.push({
        text: item.ask,
        cmd: item.answer,
        match: item.match,
        hint: { ru: item.answer, en: item.answer },
        drill: true,
      });
    });

    return steps;
  }

  function loadLesson(index, options) {
    app.lesson = Math.max(0, Math.min(index, LESSONS.length - 1));
    const lesson = currentLesson();

    app.state = engine.create();
    app.steps = buildSteps(lesson);
    app.step = 0;
    app.finished = false;

    lesson.setup.forEach(function (command) {
      engine.run(app.state, command);
    });

    mark(app.progress.visited, lesson.id);
    saveProgress();

    term.clear();
    term.setPrompt(app.state);
    if (!options || !options.quiet) {
      term.note(t('lesson.setup') + ' ' + pick(lesson.ready), 'info');
    }

    stage.capture();
    stage.render(app.state, []);
    renderLesson();
    term.focus();
  }

  function renderLesson() {
    const lesson = currentLesson();

    el.lessonNo.textContent = t('lesson.no', { n: app.lesson + 1 });
    el.lessonTitle.textContent = pick(lesson.title);
    el.lessonLead.textContent = pick(lesson.lead);

    const total = app.steps.length;
    const doneCount = app.finished ? total : app.step;
    el.progress.style.width = Math.round((doneCount / total) * 100) + '%';

    el.steps.innerHTML = app.steps
      .map(function (step, i) {
        const cls = ['step'];
        if (i < app.step || app.finished) cls.push('is-done');
        if (i === app.step && !app.finished) cls.push('is-current');
        if (step.drill) cls.push('is-drill');
        const label = step.drill ? t('lesson.drill') : step.cmd;
        return (
          '<li class="' + cls.join(' ') + '"><span class="step__no">' + (i + 1) + '</span>' +
          '<code class="step__cmd">' + escapeHtml(label) + '</code></li>'
        );
      })
      .join('');

    renderTask();
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"]/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch];
    });
  }

  function renderTask() {
    const lesson = currentLesson();

    if (app.finished) {
      el.taskText.textContent = pick(lesson.done);
      el.taskCmdWrap.hidden = true;
      el.taskHintBtn.hidden = true;
      el.taskHint.hidden = true;
      el.taskDone.hidden = false;
      el.task.classList.add('is-finished');
      return;
    }

    const step = app.steps[app.step];
    el.task.classList.remove('is-finished');
    el.taskDone.hidden = true;
    el.taskHint.hidden = true;
    el.taskHintBtn.hidden = false;

    el.taskText.textContent =
      (step.drill ? t('lesson.drill') + ' · ' + t('lesson.drillLead') + '\n' : '') + pick(step.text);

    if (step.drill) {
      el.taskCmdWrap.hidden = true;
    } else {
      el.taskCmdWrap.hidden = false;
      el.taskCmd.textContent = step.cmd;
    }
  }

  function renderLessonCards() {
    el.lessonCards.innerHTML = LESSONS.map(function (lesson, i) {
      const done = app.progress.done.indexOf(lesson.id) !== -1;
      return (
        '<li class="card' + (i === app.lesson ? ' is-current' : '') + '" data-lesson="' + i + '">' +
        '<button type="button" class="card__btn">' +
        '<span class="card__no">' + t('lesson.no', { n: i + 1 }) + '</span>' +
        (done ? '<span class="card__done">' + t('ui.passed') + '</span>' : '') +
        '<b class="card__title">' + escapeHtml(pick(lesson.title)) + '</b>' +
        '<span class="card__lead">' + escapeHtml(pick(lesson.lead)) + '</span>' +
        '<span class="card__meta">' + (lesson.steps.length + (lesson.drill || []).length) + ' ' +
        t('ui.steps') + '</span>' +
        '</button></li>'
      );
    }).join('');
  }

  function renderCheat() {
    const visited = app.progress.visited;
    el.cheatList.innerHTML = ns.lessons.cheatsheet
      .map(function (item) {
        const lesson = LESSONS[item.lesson];
        const open = lesson && visited.indexOf(lesson.id) !== -1;
        return (
          '<div class="cheat__row' + (open ? '' : ' is-locked') + '">' +
          '<code class="cheat__cmd">' + escapeHtml(item.cmd) + '</code>' +
          '<span class="cheat__what">' + escapeHtml(open ? pick(item.what) : t('ui.locked')) + '</span>' +
          '</div>'
        );
      })
      .join('');
  }

  function checkStep(input) {
    if (app.finished) return;

    const step = app.steps[app.step];
    const text = input.trim().replace(/\s+/g, ' ');

    if (!step.match.test(text)) {
      term.note(step.drill ? t('lesson.drillWrong') : t('lesson.mismatch'), 'warn');
      return;
    }

    term.note(t('lesson.ok'), 'ok');
    if (step.after) runAfter(step.after);

    app.step += 1;
    if (app.step >= app.steps.length) finishLesson();
    else renderLesson();
  }

  function runAfter(after) {
    if (after.kind !== 'remoteCommit') return;
    stage.capture();
    engine.remoteCommit(app.state, pick(after.message), after.file, after.content);
    stage.render(app.state, [{ k: 'push', ids: [] }]);
    term.note(pick(after.note), 'info');
  }

  function finishLesson() {
    app.finished = true;
    mark(app.progress.done, currentLesson().id);
    saveProgress();

    renderLesson();
    renderCheat();
    renderLessonCards();

    term.note(t('lesson.finished') + ' ' + pick(currentLesson().done), 'ok');

    const next = LESSONS[app.lesson + 1];
    if (next) term.note(t('lesson.nextUp', { title: pick(next.title) }), 'info');
    else if (app.progress.done.length >= LESSONS.length) term.note(t('lesson.allDone'), 'ok');
    else term.note(t('lesson.free'), 'info');
  }

  function onCommand(input) {
    term.echo(app.state, input);
    stage.capture();

    const result = engine.run(app.state, input);

    if (
      result.events.some(function (e) {
        return e.k === 'clear';
      })
    ) {
      term.clear();
    }

    term.print(result.lines);
    term.setPrompt(app.state);
    stage.render(app.state, result.events);

    checkStep(input);
  }

  function bind() {
    el.taskFill.addEventListener('click', function () {
      const step = app.steps[app.step];
      if (!step || app.finished) return;
      term.type(step.cmd);
    });

    el.taskHintBtn.addEventListener('click', function () {
      const step = app.steps[app.step];
      if (!step || app.finished) return;
      el.taskHint.textContent = step.drill ? step.cmd : pick(step.hint);
      el.taskHint.hidden = !el.taskHint.hidden;
    });

    el.lessonPrev.addEventListener('click', function () {
      if (app.lesson > 0) loadLesson(app.lesson - 1);
    });

    el.lessonNext.addEventListener('click', function () {
      if (app.lesson < LESSONS.length - 1) loadLesson(app.lesson + 1);
    });

    el.lessonRestart.addEventListener('click', function () {
      loadLesson(app.lesson);
    });

    el.openLessons.addEventListener('click', function () {
      renderLessonCards();
      el.lessons.hidden = false;
      el.lessonsClose.focus();
    });

    el.lessonsClose.addEventListener('click', function () {
      el.lessons.hidden = true;
    });

    el.lessonCards.addEventListener('click', function (event) {
      const card = event.target.closest('[data-lesson]');
      if (!card) return;
      el.lessons.hidden = true;
      loadLesson(Number(card.dataset.lesson));
    });

    el.openCheat.addEventListener('click', function () {
      renderCheat();
      el.cheat.hidden = false;
      el.cheatClose.focus();
    });

    el.cheatClose.addEventListener('click', function () {
      el.cheat.hidden = true;
    });

    [el.lessons, el.cheat].forEach(function (modal) {
      modal.addEventListener('click', function (event) {
        if (event.target === modal) modal.hidden = true;
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      el.lessons.hidden = true;
      el.cheat.hidden = true;
    });

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
  }

  function collect() {
    [
      'lesson-no', 'lesson-title', 'lesson-lead', 'lesson-progress', 'steps', 'task', 'task-text',
      'task-cmd', 'task-cmd-wrap', 'task-fill', 'task-hint', 'task-hint-btn', 'task-done',
      'lesson-prev', 'lesson-next', 'lesson-restart', 'open-lessons', 'open-cheat', 'lessons',
      'lessons-close', 'lesson-cards', 'cheat', 'cheat-close', 'cheat-list', 'theme',
    ].forEach(function (id) {
      const key = id.replace(/-(\w)/g, function (whole, ch) {
        return ch.toUpperCase();
      });
      el[key] = byId(id);
    });

    el.progress = byId('lesson-progress');
  }

  function start() {
    collect();
    loadProgress();

    term.init({
      onCommand: onCommand,
      files: function () {
        return app.state ? app.state.files.map(function (f) {
          return f.name;
        }) : [];
      },
    });

    bind();
    i18n.apply(i18n.get());
    i18n.onChange(function () {
      renderLesson();
      renderLessonCards();
      renderCheat();
      stage.render(app.state, []);
    });

    let startAt = 0;
    for (let i = 0; i < LESSONS.length; i++) {
      if (app.progress.done.indexOf(LESSONS[i].id) === -1) {
        startAt = i;
        break;
      }
    }

    loadLesson(startAt);
    renderLessonCards();
    renderCheat();
    byId('footer-year').textContent = '© ' + new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})(window.Vetka);
