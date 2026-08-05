/*
  Терминал: ввод, история, дописывание по Tab и вывод.

  Приглашение печатается двумя строками — ровно как настоящий Git Bash:
  сверху пользователь, оболочка, путь и ветка в скобках, снизу доллар и
  курсор. Ветка в приглашении не украшение: в уроке про ветки именно по ней
  видно, где человек сейчас работает.

  Команда, подставленная кнопкой из урока, набирается по букве. Это не
  спецэффект: человек успевает прочитать её глазами, а привычка к строке
  появляется, только если видеть, как она собирается.
*/
window.Vetka = window.Vetka || {};

(function (ns) {
  'use strict';

  const COMMANDS = [
    'pwd', 'ls', 'ls -a', 'cd ', 'cd ..', 'mkdir ', 'touch ', 'cat ', 'echo ', 'clear', 'rm ',
    'git init', 'git status', 'git add ', 'git add .', 'git commit -m ""', 'git log --oneline',
    'git diff', 'git diff --staged', 'git restore ', 'git restore --staged ', 'git branch',
    'git switch ', 'git switch -c ', 'git checkout ', 'git merge ', 'git remote add origin ',
    'git remote -v', 'git push', 'git push -u origin main', 'git pull', 'git clone ',
    'git config --global user.name ""', 'git config --global user.email ""',
    'git reset --soft HEAD~1', 'git rm --cached ',
  ];

  let els = null;
  let onCommand = null;
  let filesOf = null;
  let history = [];
  let cursor = -1;
  let typing = null;

  function collect() {
    els = {
      out: document.getElementById('term-out'),
      input: document.getElementById('term-input'),
      prompt: document.getElementById('term-prompt'),
      screen: document.getElementById('term-screen'),
      clear: document.getElementById('term-clear'),
    };
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>]/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch];
    });
  }

  function promptHtml(parts) {
    return (
      '<span class="p-user">' + parts.user + '</span> ' +
      '<span class="p-env">' + parts.env + '</span> ' +
      '<span class="p-path">' + parts.path + '</span>' +
      (parts.branch ? '<span class="p-branch">' + parts.branch + '</span>' : '')
    );
  }

  function setPrompt(state) {
    els.prompt.innerHTML = promptHtml(ns.engine.prompt(state));
  }

  function scroll() {
    els.screen.scrollTop = els.screen.scrollHeight;
  }

  /** Эхо введённой строки — теми же двумя строками, что и приглашение. */
  function echo(state, text) {
    const block = document.createElement('div');
    block.className = 'term__echo';
    block.innerHTML =
      '<div class="term__meta">' + promptHtml(ns.engine.prompt(state)) + '</div>' +
      '<div class="term__cmd"><span class="term__dollar">$</span> ' + escapeHtml(text) + '</div>';
    els.out.appendChild(block);
    scroll();
  }

  function print(lines) {
    if (!lines || !lines.length) return;
    const block = document.createElement('div');
    block.className = 'term__block';
    block.innerHTML = lines
      .map(function (l) {
        return '<div class="term__row term__row--' + (l.c || 'out') + '">' + (escapeHtml(l.t) || '&nbsp;') + '</div>';
      })
      .join('');
    els.out.appendChild(block);
    scroll();
  }

  /** Служебная реплика тренажёра — визуально отделена от вывода команд. */
  function note(text, kind) {
    const block = document.createElement('div');
    block.className = 'term__note term__note--' + (kind || 'info');
    block.textContent = text;
    els.out.appendChild(block);
    scroll();
  }

  function clear() {
    els.out.innerHTML = '';
  }

  function focus() {
    els.input.focus();
  }

  function value() {
    return els.input.value;
  }

  /** Печатает команду в строку ввода по букве. */
  function type(text, done) {
    if (typing) clearInterval(typing);
    els.input.value = '';
    focus();

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.input.value = text;
      if (done) done();
      return;
    }

    let i = 0;
    typing = setInterval(function () {
      els.input.value = text.slice(0, ++i);
      if (i >= text.length) {
        clearInterval(typing);
        typing = null;
        if (done) done();
      }
    }, 26);
  }

  /* ─────────────────────────── дописывание по Tab ─────────────────────── */

  function complete() {
    const text = els.input.value;
    if (!text.trim()) return;

    const pool = COMMANDS.concat(
      (filesOf ? filesOf() : []).map(function (name) {
        const parts = text.split(' ');
        parts[parts.length - 1] = name;
        return parts.join(' ');
      }),
    );

    const hits = pool.filter(function (candidate) {
      return candidate.indexOf(text) === 0 && candidate !== text;
    });
    if (!hits.length) return;

    if (hits.length === 1) {
      els.input.value = hits[0];
      return;
    }

    // Общая часть всех совпадений — так же ведёт себя настоящая оболочка
    let common = hits[0];
    hits.forEach(function (hit) {
      while (hit.indexOf(common) !== 0) common = common.slice(0, -1);
    });
    if (common.length > text.length) els.input.value = common;
    else print(hits.map(function (hit) { return { t: hit, c: 'dim' }; }));
  }

  /* ─────────────────────────────── события ─────────────────────────────── */

  function bind() {
    els.input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        const text = els.input.value.trim();
        els.input.value = '';
        if (!text) return;
        history.push(text);
        cursor = history.length;
        if (onCommand) onCommand(text);
        return;
      }

      if (event.key === 'Tab') {
        event.preventDefault();
        complete();
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (!history.length) return;
        cursor = Math.max(0, cursor - 1);
        els.input.value = history[cursor];
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (!history.length) return;
        cursor = Math.min(history.length, cursor + 1);
        els.input.value = cursor === history.length ? '' : history[cursor];
      }
    });

    // Клик по любому месту экрана возвращает курсор в строку ввода
    els.screen.addEventListener('pointerdown', function (event) {
      if (window.getSelection && String(window.getSelection())) return;
      if (event.target.closest('button')) return;
      focus();
    });

    els.clear.addEventListener('click', function () {
      clear();
      focus();
    });
  }

  function init(options) {
    collect();
    onCommand = options.onCommand;
    filesOf = options.files;
    bind();
  }

  ns.term = {
    init: init,
    print: print,
    note: note,
    echo: echo,
    clear: clear,
    focus: focus,
    type: type,
    value: value,
    setPrompt: setPrompt,
  };
})(window.Vetka);
