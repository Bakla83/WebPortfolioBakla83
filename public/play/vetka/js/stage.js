window.Vetka = window.Vetka || {};

(function (ns) {
  'use strict';

  const DURATION = 520;

  let prevRects = {};
  let els = null;

  function collect() {
    els = {
      work: document.getElementById('zone-work'),
      index: document.getElementById('zone-index'),
      local: document.getElementById('zone-local'),
      remote: document.getElementById('zone-remote'),
      localSub: document.getElementById('zone-local-sub'),
      remoteSub: document.getElementById('zone-remote-sub'),
      stage: document.getElementById('stage'),
    };
  }

  function reduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function t(key) {
    return ns.i18n.t(ns.i18n.get(), key);
  }

  function fileCard(name, state, badge) {
    return (
      '<div class="file" data-key="file:' + name + '" data-state="' + state + '">' +
      '<svg class="file__icon" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M6 3.5h7l5 5V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20V4a.5.5 0 0 1 .5-.5z" ' +
      'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path d="M13 3.5V9h5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
      '</svg>' +
      '<span class="file__name">' + name + '</span>' +
      '<span class="file__badge">' + badge + '</span>' +
      '</div>'
    );
  }

  function commitCard(commit, tags, extra) {
    return (
      '<div class="commit ' + (extra || '') + '" data-key="commit:' + commit.id + '">' +
      '<span class="commit__dot" aria-hidden="true"></span>' +
      '<span class="commit__id">' + commit.id + '</span>' +
      '<span class="commit__msg">' + escapeHtml(commit.msg) + '</span>' +
      (tags ? '<span class="commit__tags">' + tags + '</span>' : '') +
      '</div>'
    );
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"]/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch];
    });
  }

  function empty(text) {
    return '<p class="zone__empty">' + text + '</p>';
  }

  function draw(state) {
    const engine = ns.engine;
    const groups = engine.classify(state);

    if (!state.inProject) {
      els.work.innerHTML = empty(state.dir ? t('zone.emptyOutside') : t('zone.emptyDesk'));
    } else if (!state.files.length) {
      els.work.innerHTML = empty(t('zone.emptyFolder'));
    } else {
      els.work.innerHTML = state.files
        .map(function (f) {
          let kind = 'clean';
          let badge = t('file.clean');
          if (groups.untracked.indexOf(f.name) !== -1) {
            kind = 'untracked';
            badge = t('file.untracked');
          } else if (groups.modified.indexOf(f.name) !== -1) {
            kind = 'modified';
            badge = t('file.modified');
          } else if (groups.staged.indexOf(f.name) !== -1) {
            kind = 'staged';
            badge = t('file.inIndex');
          }
          if (f.head === null && f.staged === null && groups.untracked.indexOf(f.name) === -1) {
            kind = 'ignored';
            badge = t('file.ignored');
          }
          return fileCard(f.name, kind, badge);
        })
        .join('');
    }

    if (!state.inited) {
      els.index.innerHTML = empty(t('zone.noRepo'));
    } else if (!groups.staged.length) {
      els.index.innerHTML = empty(t('zone.emptyIndex'));
    } else {
      els.index.innerHTML = groups.staged
        .map(function (name) {
          return fileCard(name, 'staged', t('file.ready'));
        })
        .join('');
    }

    if (!state.inited) {
      els.local.innerHTML = empty(t('zone.noRepoYet'));
      els.localSub.textContent = t('zone.localSub');
    } else {
      const chain = engine.history(state, engine.branchTip(state));
      els.localSub.textContent = state.head;
      els.local.innerHTML = chain.length
        ? chain
            .map(function (commit) {
              const tags = [];
              Object.keys(state.branches).forEach(function (name) {
                if (state.branches[name] !== commit.id) return;
                tags.push(
                  '<b class="tag' + (name === state.head ? ' tag--head' : '') + '">' +
                    (name === state.head ? 'HEAD → ' : '') + name + '</b>',
                );
              });
              return commitCard(commit, tags.join(''));
            })
            .join('')
        : empty(t('zone.noCommits'));
    }

    if (!state.remote) {
      els.remote.innerHTML = empty(t('zone.noRemote'));
      els.remoteSub.textContent = t('zone.remoteSub');
    } else {
      const tip = state.remoteBranches[state.head];
      els.remoteSub.textContent = state.remote.url.replace(/^https?:\/\//, '');
      const chain = tip ? engine.history(state, tip) : [];
      els.remote.innerHTML = chain.length
        ? chain
            .map(function (commit) {
              return commitCard(
                commit,
                '<b class="tag tag--remote">origin/' + state.head + '</b>',
                'commit--remote',
              );
            })
            .join('')
        : empty(t('zone.remoteEmpty'));
    }
  }

  function capture() {
    prevRects = {};
    document.querySelectorAll('[data-key]').forEach(function (el) {
      prevRects[el.dataset.key] = el.getBoundingClientRect();
    });
  }

  function originFor(key, events) {
    if (key.indexOf('commit:') !== 0) return null;
    const id = key.slice(7);

    const pushed = events.some(function (e) {
      return (e.k === 'push' || e.k === 'pull') && (e.ids || []).indexOf(id) !== -1;
    });
    if (pushed && prevRects['commit:' + id]) return prevRects['commit:' + id];

    const committed = events.some(function (e) {
      return e.k === 'commit' && e.id === id;
    });
    if (committed) {
      const box = els.index.getBoundingClientRect();
      return { left: box.left + 12, top: box.top + 12 };
    }
    return null;
  }

  function play(events) {
    if (reduced()) return;

    document.querySelectorAll('[data-key]').forEach(function (el) {
      const key = el.dataset.key;
      const now = el.getBoundingClientRect();
      const from = prevRects[key] || originFor(key, events || []);

      if (!from) {
        el.classList.add('is-new');
        setTimeout(function () {
          el.classList.remove('is-new');
        }, DURATION);
        return;
      }

      const dx = from.left - now.left;
      const dy = from.top - now.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;

      el.style.transition = 'none';
      el.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      el.classList.add('is-moving');

      requestAnimationFrame(function () {
        el.style.transition = 'transform ' + DURATION + 'ms cubic-bezier(.22,.61,.36,1)';
        el.style.transform = '';
        setTimeout(function () {
          el.style.transition = '';
          el.classList.remove('is-moving');
        }, DURATION);
      });
    });
  }

  function highlight(events) {
    const zones = {
      files: 'work',
      mkdir: 'work',
      stage: 'index',
      unstage: 'index',
      commit: 'local',
      init: 'local',
      branch: 'local',
      switch: 'local',
      merge: 'local',
      reset: 'local',
      push: 'remote',
      pull: 'remote',
      remote: 'remote',
      clone: 'remote',
    };

    (events || []).forEach(function (event) {
      const name = zones[event.k];
      if (!name) return;
      const zone = els.stage.querySelector('[data-zone="' + name + '"]');
      if (!zone) return;
      zone.classList.remove('is-hot');
      void zone.offsetWidth;
      zone.classList.add('is-hot');
      setTimeout(function () {
        zone.classList.remove('is-hot');
      }, 900);
    });
  }

  function render(state, events) {
    if (!els) collect();
    draw(state);
    play(events);
    highlight(events);
  }

  ns.stage = {
    render: render,
    capture: function () {
      if (!els) collect();
      capture();
    },
  };
})(window.Vetka);
