/*
  Маленький git и маленький bash.

  Команды не притворяются: они действительно меняют состояние — файл
  получает содержимое, индекс запоминает снимок, коммит хранит слепок всех
  файлов. Поэтому `git status`, `git diff` и переключение веток отвечают не
  заранее заготовленным текстом, а тем, что реально произошло, и человек
  может отойти от урока и попробовать своё.

  Файл живёт тремя версиями сразу — ровно как в настоящем git:
    work   — то, что на диске;
    staged — то, что отложено в индекс (null, если не отложено);
    head   — то, что уже в последнем коммите (null, если файла там нет).
  Всё состояние рабочего дерева выводится из сравнения этих трёх строк:
  «изменено», «подготовлено», «не отслеживается» — это не флаги, а разница.
*/
window.Vetka = window.Vetka || {};

(function (ns) {
  'use strict';

  const USER = 'Bakla83';
  const HOST = 'DESKTOP-7QK1';
  const ROOT = '/d/projects';
  const REMOTE_HOST = 'https://github.com/';

  /* ────────────────────────────── состояние ────────────────────────────── */

  function create() {
    return {
      path: ROOT,
      dir: null, // имя папки проекта, когда она создана
      inProject: false,
      inited: false,
      files: [], // {name, work, staged, head}
      commits: [], // {id, msg, parent, branch, snapshot}
      branches: {}, // ветка → id коммита
      head: 'main',
      remote: null, // {name, url}
      remoteBranches: {},
      upstream: {}, // ветка → true
      config: { name: null, email: null },
      ignore: [],
    };
  }

  /* ────────────────────────────── помощники ────────────────────────────── */

  function id() {
    let out = '';
    const chars = 'abcdef0123456789';
    for (let i = 0; i < 7; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  function line(text, cls) {
    return { t: text === undefined ? '' : text, c: cls || 'out' };
  }

  function file(state, name) {
    return state.files.find(function (f) {
      return f.name === name;
    });
  }

  function ignored(state, name) {
    return state.ignore.some(function (rule) {
      if (rule.endsWith('/')) return name === rule.slice(0, -1) || name.indexOf(rule) === 0;
      if (rule.indexOf('*') === 0) return name.endsWith(rule.slice(1));
      return name === rule;
    });
  }

  /** Файлы по состоянию — на этом стоят и status, и подсветка на схеме. */
  function classify(state) {
    const out = { staged: [], modified: [], untracked: [], clean: [] };

    state.files.forEach(function (f) {
      if (f.head === null && f.staged === null) {
        if (!ignored(state, f.name)) out.untracked.push(f.name);
        return;
      }
      if (f.staged !== null && f.staged !== f.head) out.staged.push(f.name);

      const disk = f.staged !== null ? f.staged : f.head;
      if (f.work !== disk) out.modified.push(f.name);

      if (f.staged === null && f.work === f.head) out.clean.push(f.name);
    });

    return out;
  }

  function branchTip(state) {
    return state.branches[state.head] || null;
  }

  function commitById(state, cid) {
    return state.commits.find(function (c) {
      return c.id === cid;
    });
  }

  /** Цепочка коммитов ветки от вершины к корню. */
  function history(state, tip) {
    const out = [];
    let cursor = tip;
    while (cursor) {
      const commit = commitById(state, cursor);
      if (!commit) break;
      out.push(commit);
      cursor = commit.parent;
    }
    return out;
  }

  function snapshot(state) {
    const snap = {};
    state.files.forEach(function (f) {
      const value = f.staged !== null ? f.staged : f.head;
      if (value !== null) snap[f.name] = value;
    });
    return snap;
  }

  /** Раскладывает слепок коммита обратно в рабочую папку — для веток. */
  function checkoutSnapshot(state, snap) {
    state.files = Object.keys(snap).map(function (name) {
      return { name: name, work: snap[name], staged: null, head: snap[name] };
    });
    const ignoreFile = snap['.gitignore'];
    state.ignore = ignoreFile ? parseIgnore(ignoreFile) : [];
  }

  function parseIgnore(text) {
    return String(text)
      .split('\n')
      .map(function (s) {
        return s.trim();
      })
      .filter(function (s) {
        return s && s.indexOf('#') !== 0;
      });
  }

  function prompt(state) {
    const branch = state.inited && state.inProject ? ' (' + state.head + ')' : '';
    return {
      user: USER + '@' + HOST,
      env: 'MINGW64',
      path: state.path.replace(ROOT, '/d/projects'),
      branch: branch,
    };
  }

  /* ──────────────────────────── разбор строки ──────────────────────────── */

  /** Разбивает строку на слова, уважая кавычки: сообщение коммита — одно слово. */
  function tokenize(input) {
    const out = [];
    let current = '';
    let quote = null;

    for (let i = 0; i < input.length; i++) {
      const ch = input[i];
      if (quote) {
        if (ch === quote) quote = null;
        else current += ch;
        continue;
      }
      if (ch === '"' || ch === "'") {
        quote = ch;
        current += '';
        out.quoted = true;
        continue;
      }
      if (/\s/.test(ch)) {
        if (current) out.push(current);
        current = '';
        continue;
      }
      current += ch;
    }
    if (current) out.push(current);
    return out;
  }

  /* ────────────────────────────── команды bash ────────────────────────── */

  const bash = {
    pwd: function (state) {
      return { lines: [line(state.path)] };
    },

    ls: function (state, args) {
      const all = args.some(function (a) {
        return a.indexOf('-') === 0 && a.indexOf('a') !== -1;
      });

      if (!state.inProject) {
        return { lines: state.dir ? [line(state.dir + '/', 'dir')] : [] };
      }

      const names = state.files
        .map(function (f) {
          return f.name;
        })
        .sort();
      if (all && state.inited) names.unshift('.git/');
      if (!names.length) return { lines: [] };
      return { lines: [line(names.join('   '))] };
    },

    cd: function (state, args) {
      const target = args[0] || '~';

      if (target === '~' || target === ROOT) {
        state.inProject = false;
        state.path = ROOT;
        return { lines: [] };
      }
      if (target === '..') {
        if (state.inProject) {
          state.inProject = false;
          state.path = ROOT;
        }
        return { lines: [] };
      }
      const clean = target.replace(/\/$/, '');
      if (!state.inProject && state.dir === clean) {
        state.inProject = true;
        state.path = ROOT + '/' + clean;
        return { lines: [], events: [{ k: 'enter' }] };
      }
      return { lines: [line('bash: cd: ' + target + ': No such file or directory', 'err')] };
    },

    mkdir: function (state, args) {
      if (!args.length) return { lines: [line('mkdir: missing operand', 'err')] };
      if (state.inProject) {
        return { lines: [line('mkdir: внутри проекта в этом тренажёре папки не создаются', 'warn')] };
      }
      if (state.dir) {
        return { lines: [line('mkdir: cannot create directory ‘' + args[0] + '’: File exists', 'err')] };
      }
      state.dir = args[0].replace(/\/$/, '');
      return { lines: [], events: [{ k: 'mkdir', name: state.dir }] };
    },

    touch: function (state, args) {
      if (!state.inProject) return { lines: [line('touch: сначала зайдите в папку проекта: cd <папка>', 'warn')] };
      const created = [];
      args.forEach(function (name) {
        if (file(state, name)) return;
        state.files.push({ name: name, work: '', staged: null, head: null });
        created.push(name);
      });
      return { lines: [], events: created.length ? [{ k: 'files', names: created }] : [] };
    },

    echo: function (state, args, raw) {
      const match = raw.match(/^echo\s+(.*?)\s*(>>?)\s*(\S+)\s*$/);
      if (!match) {
        return { lines: [line(args.join(' '))] };
      }
      if (!state.inProject) return { lines: [line('bash: сначала зайдите в папку проекта', 'warn')] };

      const text = tokenize(match[1]).join(' ');
      const name = match[3];
      let target = file(state, name);
      if (!target) {
        target = { name: name, work: '', staged: null, head: null };
        state.files.push(target);
      }
      target.work = match[2] === '>>' ? (target.work ? target.work + '\n' + text : text) : text;
      if (name === '.gitignore') state.ignore = parseIgnore(target.work);

      return { lines: [], events: [{ k: 'files', names: [name] }] };
    },

    cat: function (state, args) {
      const target = file(state, args[0]);
      if (!target) return { lines: [line('cat: ' + args[0] + ': No such file or directory', 'err')] };
      return { lines: String(target.work).split('\n').map(function (l) { return line(l); }) };
    },

    rm: function (state, args) {
      const name = args[args.length - 1];
      const index = state.files.findIndex(function (f) {
        return f.name === name;
      });
      if (index === -1) return { lines: [line('rm: cannot remove ‘' + name + '’: No such file or directory', 'err')] };
      state.files.splice(index, 1);
      return { lines: [], events: [{ k: 'files', names: [] }] };
    },

    clear: function () {
      return { lines: [], events: [{ k: 'clear' }] };
    },
  };

  /* ────────────────────────────── команды git ────────────────────────── */

  function needRepo(state) {
    if (state.inited && state.inProject) return null;
    return {
      lines: [
        line('fatal: not a git repository (or any of the parent directories): .git', 'err'),
      ],
    };
  }

  const git = {
    init: function (state) {
      if (!state.inProject) {
        return { lines: [line('Сначала зайдите в папку проекта: cd <папка>', 'warn')] };
      }
      if (state.inited) {
        return { lines: [line('Reinitialized existing Git repository in ' + state.path + '/.git/', 'dim')] };
      }
      state.inited = true;
      state.head = 'main';
      state.branches = {};
      return {
        lines: [line('Initialized empty Git repository in ' + state.path + '/.git/', 'ok')],
        events: [{ k: 'init' }],
      };
    },

    config: function (state, args) {
      const key = args.filter(function (a) {
        return a.indexOf('-') !== 0;
      })[0];
      const value = args.filter(function (a) {
        return a.indexOf('-') !== 0;
      })[1];

      if (key === 'user.name') state.config.name = value;
      else if (key === 'user.email') state.config.email = value;
      else if (value === undefined) {
        const current = key === 'user.name' ? state.config.name : state.config.email;
        return { lines: [line(current || '')] };
      }
      return { lines: [] };
    },

    status: function (state, args) {
      const guard = needRepo(state);
      if (guard) return guard;

      const groups = classify(state);
      const short = args.indexOf('-s') !== -1 || args.indexOf('--short') !== -1;

      if (short) {
        const lines = [];
        groups.staged.forEach(function (n) {
          lines.push(line('A  ' + n, 'ok'));
        });
        groups.modified.forEach(function (n) {
          lines.push(line(' M ' + n, 'warn'));
        });
        groups.untracked.forEach(function (n) {
          lines.push(line('?? ' + n, 'err'));
        });
        return { lines: lines };
      }

      const lines = [line('On branch ' + state.head)];
      if (!branchTip(state)) {
        lines.push(line(''));
        lines.push(line('No commits yet'));
      }

      if (groups.staged.length) {
        lines.push(line(''));
        lines.push(line('Changes to be committed:'));
        lines.push(line('  (use "git restore --staged <file>..." to unstage)', 'dim'));
        groups.staged.forEach(function (n) {
          const known = file(state, n).head !== null;
          lines.push(line('        ' + (known ? 'modified:   ' : 'new file:   ') + n, 'ok'));
        });
      }

      if (groups.modified.length) {
        lines.push(line(''));
        lines.push(line('Changes not staged for commit:'));
        lines.push(line('  (use "git add <file>..." to update what will be committed)', 'dim'));
        lines.push(line('  (use "git restore <file>..." to discard changes in working directory)', 'dim'));
        groups.modified.forEach(function (n) {
          lines.push(line('        modified:   ' + n, 'warn'));
        });
      }

      if (groups.untracked.length) {
        lines.push(line(''));
        lines.push(line('Untracked files:'));
        lines.push(line('  (use "git add <file>..." to include in what will be committed)', 'dim'));
        groups.untracked.forEach(function (n) {
          lines.push(line('        ' + n, 'err'));
        });
      }

      if (!groups.staged.length && !groups.modified.length && !groups.untracked.length) {
        lines.push(line(''));
        lines.push(line('nothing to commit, working tree clean', 'ok'));
      } else if (!groups.staged.length) {
        lines.push(line(''));
        lines.push(
          line(
            groups.untracked.length
              ? 'nothing added to commit but untracked files present (use "git add" to track)'
              : 'no changes added to commit (use "git add" and/or "git commit -a")',
            'dim',
          ),
        );
      }

      return { lines: lines };
    },

    add: function (state, args) {
      const guard = needRepo(state);
      if (guard) return guard;

      const paths = args.filter(function (a) {
        return a.indexOf('-') !== 0 || a === '-A';
      });
      if (!paths.length) {
        return { lines: [line('Nothing specified, nothing added.', 'warn')] };
      }

      const all = paths.some(function (p) {
        return p === '.' || p === '-A' || p === '*';
      });
      const staged = [];

      state.files.forEach(function (f) {
        const chosen = all ? !ignored(state, f.name) : paths.indexOf(f.name) !== -1;
        if (!chosen) return;
        const disk = f.staged !== null ? f.staged : f.head;
        if (f.work === disk && f.head !== null) return; // нечего добавлять
        f.staged = f.work;
        staged.push(f.name);
      });

      if (!staged.length && !all) {
        const missing = paths.filter(function (p) {
          return !file(state, p);
        });
        if (missing.length) {
          return {
            lines: [line("fatal: pathspec '" + missing[0] + "' did not match any files", 'err')],
          };
        }
      }

      return { lines: [], events: staged.length ? [{ k: 'stage', names: staged }] : [] };
    },

    restore: function (state, args) {
      const guard = needRepo(state);
      if (guard) return guard;

      const unstage = args.indexOf('--staged') !== -1;
      const paths = args.filter(function (a) {
        return a.indexOf('-') !== 0;
      });
      const all = paths.indexOf('.') !== -1;
      const touched = [];

      state.files.forEach(function (f) {
        if (!all && paths.indexOf(f.name) === -1) return;
        if (unstage) {
          if (f.staged === null) return;
          f.staged = null;
          touched.push(f.name);
        } else {
          const disk = f.staged !== null ? f.staged : f.head;
          if (disk === null || f.work === disk) return;
          f.work = disk;
          touched.push(f.name);
        }
      });

      return {
        lines: [],
        events: touched.length ? [{ k: unstage ? 'unstage' : 'files', names: touched }] : [],
      };
    },

    commit: function (state, args, raw) {
      const guard = needRepo(state);
      if (guard) return guard;

      if (!state.config.name || !state.config.email) {
        return {
          lines: [
            line('Author identity unknown', 'err'),
            line(''),
            line('*** Please tell me who you are.', 'err'),
            line(''),
            line('Run', 'dim'),
            line(''),
            line('  git config --global user.email "you@example.com"', 'dim'),
            line('  git config --global user.name "Your Name"', 'dim'),
            line(''),
            line('to set your account\'s default identity.', 'dim'),
          ],
        };
      }

      // -a добавляет в индекс уже отслеживаемые изменённые файлы
      if (/(^|\s)-[a-z]*a/.test(raw)) {
        state.files.forEach(function (f) {
          if (f.head !== null && f.work !== (f.staged !== null ? f.staged : f.head)) f.staged = f.work;
        });
      }

      const match = raw.match(/-m\s+(?:"([^"]*)"|'([^']*)'|(\S+))/);
      if (!match) {
        return {
          lines: [
            line('В тренажёре сообщение задаётся ключом -m:', 'warn'),
            line('  git commit -m "что сделано"', 'dim'),
          ],
        };
      }
      const message = match[1] !== undefined ? match[1] : match[2] !== undefined ? match[2] : match[3];

      const groups = classify(state);
      if (!groups.staged.length) {
        const lines = [line('On branch ' + state.head)];
        if (groups.untracked.length) {
          lines.push(line('nothing added to commit but untracked files present', 'dim'));
        } else {
          lines.push(line('nothing to commit, working tree clean', 'dim'));
        }
        return { lines: lines };
      }

      const parent = branchTip(state);
      const commit = {
        id: id(),
        msg: message,
        parent: parent,
        branch: state.head,
        snapshot: snapshot(state),
        files: groups.staged.slice(),
      };

      state.commits.push(commit);
      state.branches[state.head] = commit.id;

      state.files.forEach(function (f) {
        if (f.staged === null) return;
        f.head = f.staged;
        f.staged = null;
      });

      const root = parent ? '' : ' (root-commit)';
      return {
        lines: [
          line('[' + state.head + root + ' ' + commit.id + '] ' + message, 'ok'),
          line(' ' + commit.files.length + ' file' + (commit.files.length === 1 ? '' : 's') + ' changed'),
        ],
        events: [{ k: 'commit', id: commit.id }],
      };
    },

    log: function (state, args) {
      const guard = needRepo(state);
      if (guard) return guard;

      const chain = history(state, branchTip(state));
      if (!chain.length) {
        return {
          lines: [
            line("fatal: your current branch '" + state.head + "' does not have any commits yet", 'err'),
          ],
        };
      }

      const oneline = args.indexOf('--oneline') !== -1;
      const lines = [];

      chain.forEach(function (commit, i) {
        if (oneline) {
          const marks = labelsFor(state, commit.id);
          lines.push(line(commit.id + (marks ? ' ' + marks : '') + ' ' + commit.msg, i === 0 ? 'ok' : 'out'));
          return;
        }
        const marks = labelsFor(state, commit.id);
        lines.push(line('commit ' + commit.id + (marks ? ' ' + marks : ''), 'warn'));
        lines.push(line('Author: ' + state.config.name + ' <' + state.config.email + '>', 'dim'));
        lines.push(line(''));
        lines.push(line('    ' + commit.msg));
        lines.push(line(''));
      });

      return { lines: lines };
    },

    diff: function (state, args) {
      const guard = needRepo(state);
      if (guard) return guard;

      const staged = args.indexOf('--staged') !== -1 || args.indexOf('--cached') !== -1;
      const lines = [];

      state.files.forEach(function (f) {
        const from = staged ? f.head : f.staged !== null ? f.staged : f.head;
        const to = staged ? f.staged : f.work;
        if (from === null && to === null) return;
        if (from === to) return;
        if (!staged && f.head === null && f.staged === null) return; // неотслеживаемый

        lines.push(line('diff --git a/' + f.name + ' b/' + f.name, 'warn'));
        lines.push(line('--- a/' + f.name, 'dim'));
        lines.push(line('+++ b/' + f.name, 'dim'));

        const before = String(from === null ? '' : from).split('\n');
        const after = String(to === null ? '' : to).split('\n');
        before.forEach(function (l) {
          if (after.indexOf(l) === -1 && l !== '') lines.push(line('-' + l, 'err'));
        });
        after.forEach(function (l) {
          if (before.indexOf(l) === -1 && l !== '') lines.push(line('+' + l, 'ok'));
        });
      });

      if (!lines.length) return { lines: [] };
      return { lines: lines };
    },

    branch: function (state, args) {
      const guard = needRepo(state);
      if (guard) return guard;

      const names = args.filter(function (a) {
        return a.indexOf('-') !== 0;
      });
      const remove = args.indexOf('-d') !== -1 || args.indexOf('-D') !== -1;

      if (remove && names.length) {
        if (names[0] === state.head) {
          return { lines: [line("error: cannot delete branch '" + names[0] + "' checked out", 'err')] };
        }
        const gone = state.branches[names[0]];
        delete state.branches[names[0]];
        return {
          lines: [line('Deleted branch ' + names[0] + ' (was ' + (gone || '').slice(0, 7) + ').', 'dim')],
          events: [{ k: 'branch' }],
        };
      }

      if (!names.length) {
        const list = Object.keys(state.branches);
        if (!list.length) list.push(state.head);
        return {
          lines: list.sort().map(function (name) {
            return line((name === state.head ? '* ' : '  ') + name, name === state.head ? 'ok' : 'out');
          }),
        };
      }

      if (!branchTip(state)) {
        return { lines: [line('fatal: not a valid object name: ' + state.head, 'err')] };
      }
      state.branches[names[0]] = branchTip(state);
      return { lines: [], events: [{ k: 'branch', name: names[0] }] };
    },

    switch: function (state, args) {
      return switchTo(state, args, args.indexOf('-c') !== -1);
    },

    checkout: function (state, args) {
      return switchTo(state, args, args.indexOf('-b') !== -1);
    },

    merge: function (state, args) {
      const guard = needRepo(state);
      if (guard) return guard;

      const name = args.filter(function (a) {
        return a.indexOf('-') !== 0;
      })[0];
      const target = state.branches[name];
      if (!target) return { lines: [line('merge: ' + name + ' - not something we can merge', 'err')] };

      const here = branchTip(state);
      const chain = history(state, target).map(function (c) {
        return c.id;
      });

      if (chain.indexOf(here) !== -1) {
        // Ветка ушла вперёд от нашей — перемотка вперёд, нового коммита нет
        state.branches[state.head] = target;
        checkoutSnapshot(state, commitById(state, target).snapshot);
        return {
          lines: [
            line('Updating ' + String(here).slice(0, 7) + '..' + target.slice(0, 7)),
            line('Fast-forward', 'ok'),
          ],
          events: [{ k: 'merge', name: name, ff: true }],
        };
      }

      const merged = Object.assign({}, commitById(state, here).snapshot, commitById(state, target).snapshot);
      const commit = {
        id: id(),
        msg: "Merge branch '" + name + "'",
        parent: here,
        second: target,
        branch: state.head,
        snapshot: merged,
        files: Object.keys(merged),
      };
      state.commits.push(commit);
      state.branches[state.head] = commit.id;
      checkoutSnapshot(state, merged);

      return {
        lines: [line("Merge branch '" + name + "'", 'ok'), line('Merge made by the \'ort\' strategy.')],
        events: [{ k: 'commit', id: commit.id }, { k: 'merge', name: name }],
      };
    },

    remote: function (state, args) {
      const guard = needRepo(state);
      if (guard) return guard;

      if (args[0] === 'add') {
        const url = args[2];
        if (!url) return { lines: [line('usage: git remote add <name> <url>', 'err')] };
        state.remote = { name: args[1] || 'origin', url: url };
        return { lines: [], events: [{ k: 'remote', url: url }] };
      }
      if (args[0] === '-v' || args[0] === undefined) {
        if (!state.remote) return { lines: [] };
        return {
          lines: [
            line(state.remote.name + '\t' + state.remote.url + ' (fetch)'),
            line(state.remote.name + '\t' + state.remote.url + ' (push)'),
          ],
        };
      }
      return { lines: [] };
    },

    push: function (state, args) {
      const guard = needRepo(state);
      if (guard) return guard;

      if (!state.remote) {
        return {
          lines: [
            line("fatal: No configured push destination.", 'err'),
            line('Сначала свяжите папку с репозиторием на GitHub:', 'dim'),
            line('  git remote add origin ' + REMOTE_HOST + 'имя/репозиторий.git', 'dim'),
          ],
        };
      }

      const setUpstream = args.indexOf('-u') !== -1 || args.indexOf('--set-upstream') !== -1;
      const rest = args.filter(function (a) {
        return a.indexOf('-') !== 0;
      });
      const branch = rest[1] || state.head;

      if (!setUpstream && !state.upstream[branch] && !rest.length) {
        return {
          lines: [
            line('fatal: The current branch ' + branch + ' has no upstream branch.', 'err'),
            line('To push the current branch and set the remote as upstream, use', 'dim'),
            line(''),
            line('    git push --set-upstream origin ' + branch, 'dim'),
          ],
        };
      }

      const tip = state.branches[branch];
      if (!tip) return { lines: [line('error: src refspec ' + branch + ' does not match any', 'err')] };

      const already = state.remoteBranches[branch];
      if (already === tip) return { lines: [line('Everything up-to-date', 'dim')] };

      const known = already ? history(state, already).map(function (c) { return c.id; }) : [];
      const sent = history(state, tip)
        .filter(function (c) {
          return known.indexOf(c.id) === -1;
        })
        .map(function (c) {
          return c.id;
        });

      state.remoteBranches[branch] = tip;
      if (setUpstream) state.upstream[branch] = true;

      const lines = [
        line('Enumerating objects: ' + (sent.length * 3 + 1) + ', done.', 'dim'),
        line('Writing objects: 100% (' + (sent.length * 3) + '/' + (sent.length * 3) + '), done.', 'dim'),
        line('To ' + state.remote.url),
      ];
      lines.push(
        already
          ? line('   ' + String(already).slice(0, 7) + '..' + tip.slice(0, 7) + '  ' + branch + ' -> ' + branch, 'ok')
          : line(' * [new branch]      ' + branch + ' -> ' + branch, 'ok'),
      );
      if (setUpstream) {
        lines.push(line("branch '" + branch + "' set up to track 'origin/" + branch + "'.", 'dim'));
      }

      return { lines: lines, events: [{ k: 'push', ids: sent, branch: branch }] };
    },

    pull: function (state) {
      const guard = needRepo(state);
      if (guard) return guard;
      if (!state.remote) return { lines: [line('There is no tracking information for the current branch.', 'err')] };

      const remoteTip = state.remoteBranches[state.head];
      const here = branchTip(state);
      if (!remoteTip || remoteTip === here) return { lines: [line('Already up to date.', 'dim')] };

      const chain = history(state, remoteTip).map(function (c) {
        return c.id;
      });
      if (chain.indexOf(here) === -1) return { lines: [line('Already up to date.', 'dim')] };

      const got = history(state, remoteTip)
        .filter(function (c) {
          return history(state, here).map(function (h) { return h.id; }).indexOf(c.id) === -1;
        })
        .map(function (c) {
          return c.id;
        });

      state.branches[state.head] = remoteTip;
      checkoutSnapshot(state, commitById(state, remoteTip).snapshot);

      return {
        lines: [
          line('From ' + state.remote.url, 'dim'),
          line('   ' + String(here).slice(0, 7) + '..' + remoteTip.slice(0, 7) + '  ' + state.head),
          line('Fast-forward', 'ok'),
        ],
        events: [{ k: 'pull', ids: got }],
      };
    },

    clone: function (state, args) {
      if (state.inProject) {
        return { lines: [line('Выйдите из папки проекта: cd ..', 'warn')] };
      }
      const url = args[0];
      if (!url) return { lines: [line('fatal: You must specify a repository to clone.', 'err')] };

      const name = url.replace(/\.git$/, '').split('/').pop();
      state.dir = name;
      state.inProject = true;
      state.path = ROOT + '/' + name;
      state.inited = true;
      state.head = 'main';
      state.remote = { name: 'origin', url: url };
      state.files = [];
      state.commits = [];
      state.branches = {};

      const snap = { 'README.md': '# ' + name, 'index.html': '<!doctype html>' };
      const commit = { id: id(), msg: 'первый коммит', parent: null, branch: 'main', snapshot: snap, files: Object.keys(snap) };
      state.commits.push(commit);
      state.branches.main = commit.id;
      state.remoteBranches.main = commit.id;
      state.upstream.main = true;
      checkoutSnapshot(state, snap);

      return {
        lines: [
          line("Cloning into '" + name + "'...", 'dim'),
          line('remote: Enumerating objects: 6, done.', 'dim'),
          line('Receiving objects: 100% (6/6), done.', 'ok'),
        ],
        events: [{ k: 'clone' }],
      };
    },

    rm: function (state, args) {
      const guard = needRepo(state);
      if (guard) return guard;
      const cached = args.indexOf('--cached') !== -1;
      const name = args.filter(function (a) {
        return a.indexOf('-') !== 0;
      })[0];
      const target = file(state, name);
      if (!target) return { lines: [line("fatal: pathspec '" + name + "' did not match any files", 'err')] };

      if (cached) {
        target.head = null;
        target.staged = null;
        return { lines: [line("rm '" + name + "'", 'dim')], events: [{ k: 'unstage', names: [name] }] };
      }
      state.files = state.files.filter(function (f) {
        return f.name !== name;
      });
      return { lines: [line("rm '" + name + "'", 'dim')], events: [{ k: 'files', names: [] }] };
    },

    reset: function (state, args) {
      const guard = needRepo(state);
      if (guard) return guard;

      const soft = args.indexOf('--soft') !== -1;
      const hard = args.indexOf('--hard') !== -1;
      const target = args.filter(function (a) {
        return a.indexOf('-') !== 0;
      })[0];

      if (!target || target.indexOf('HEAD~') !== 0) {
        // git reset без аргументов снимает всё из индекса
        const names = [];
        state.files.forEach(function (f) {
          if (f.staged === null) return;
          f.staged = null;
          names.push(f.name);
        });
        return { lines: [], events: [{ k: 'unstage', names: names }] };
      }

      const here = commitById(state, branchTip(state));
      if (!here || !here.parent) {
        return { lines: [line('fatal: ambiguous argument ' + target, 'err')] };
      }

      const previous = commitById(state, here.parent);
      state.branches[state.head] = previous.id;

      if (hard) {
        checkoutSnapshot(state, previous.snapshot);
      } else {
        // --soft: коммит распался, но его содержимое осталось в индексе
        state.files.forEach(function (f) {
          const wasIn = here.snapshot[f.name];
          f.head = previous.snapshot[f.name] === undefined ? null : previous.snapshot[f.name];
          if (soft && wasIn !== undefined && wasIn !== f.head) f.staged = wasIn;
        });
      }

      return {
        lines: [line('HEAD is now at ' + previous.id + ' ' + previous.msg, 'dim')],
        events: [{ k: 'reset' }],
      };
    },
  };

  function switchTo(state, args, creating) {
    const guard = needRepo(state);
    if (guard) return guard;

    const name = args.filter(function (a) {
      return a.indexOf('-') !== 0;
    })[0];
    if (!name) return { lines: [line('usage: git switch [-c] <branch>', 'err')] };

    if (creating) {
      if (state.branches[name]) {
        return { lines: [line("fatal: a branch named '" + name + "' already exists", 'err')] };
      }
      if (branchTip(state)) state.branches[name] = branchTip(state);
      state.head = name;
      return {
        lines: [line("Switched to a new branch '" + name + "'", 'ok')],
        events: [{ k: 'branch', name: name }, { k: 'switch', name: name }],
      };
    }

    if (!state.branches[name]) {
      return { lines: [line("fatal: invalid reference: " + name, 'err')] };
    }

    const groups = classify(state);
    if (groups.staged.length || groups.modified.length) {
      return {
        lines: [
          line('error: Your local changes to the following files would be overwritten by checkout:', 'err'),
          line('        ' + groups.modified.concat(groups.staged)[0], 'err'),
          line('Please commit your changes before you switch branches.', 'dim'),
        ],
      };
    }

    state.head = name;
    checkoutSnapshot(state, commitById(state, state.branches[name]).snapshot);
    return {
      lines: [line("Switched to branch '" + name + "'", 'ok')],
      events: [{ k: 'switch', name: name }],
    };
  }

  /** Метки веток у коммита — для `git log` и для схемы. */
  function labelsFor(state, cid) {
    const marks = [];
    Object.keys(state.branches).forEach(function (name) {
      if (state.branches[name] === cid) marks.push(name === state.head ? 'HEAD -> ' + name : name);
    });
    Object.keys(state.remoteBranches).forEach(function (name) {
      if (state.remoteBranches[name] === cid) marks.push('origin/' + name);
    });
    return marks.length ? '(' + marks.join(', ') + ')' : '';
  }

  /* ────────────────────────── выполнение строки ────────────────────────── */

  function run(state, input) {
    const raw = String(input).trim();
    if (!raw) return { lines: [], events: [] };

    const parts = tokenize(raw);
    const head = parts[0];

    if (head === 'git') {
      const sub = parts[1];
      if (!sub) {
        return {
          lines: [
            line('usage: git <команда> [аргументы]', 'dim'),
            line('Например: git status, git add ., git commit -m "правки"', 'dim'),
          ],
          events: [],
        };
      }
      const handler = git[sub];
      if (!handler) {
        return {
          lines: [
            line("git: '" + sub + "' is not a git command. See 'git --help'.", 'err'),
          ],
          events: [],
        };
      }
      const result = handler(state, parts.slice(2), raw) || { lines: [] };
      return { lines: result.lines || [], events: result.events || [] };
    }

    const handler = bash[head];
    if (!handler) {
      return { lines: [line('bash: ' + head + ': command not found', 'err')], events: [] };
    }
    const result = handler(state, parts.slice(1), raw) || { lines: [] };
    return { lines: result.lines || [], events: result.events || [] };
  }

  /**
   * Чужой коммит на GitHub: в уроке про совместную работу нужно, чтобы
   * удалённая ветка ушла вперёд без участия человека — иначе `git pull`
   * нечего было бы показывать.
   */
  function remoteCommit(state, message, name, content) {
    const parent = state.remoteBranches[state.head] || branchTip(state);
    const base = parent ? Object.assign({}, commitById(state, parent).snapshot) : {};
    base[name] = content;

    const commit = {
      id: id(),
      msg: message,
      parent: parent,
      branch: state.head,
      snapshot: base,
      files: [name],
      remoteOnly: true,
    };
    state.commits.push(commit);
    state.remoteBranches[state.head] = commit.id;
    return commit;
  }

  ns.engine = {
    create: create,
    run: run,
    prompt: prompt,
    classify: classify,
    history: history,
    commitById: commitById,
    branchTip: branchTip,
    labelsFor: labelsFor,
    remoteCommit: remoteCommit,
    ROOT: ROOT,
  };
})(window.Vetka);
