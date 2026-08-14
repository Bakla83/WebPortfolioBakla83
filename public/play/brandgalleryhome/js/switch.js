(function () {
  'use strict';

  var VARIANTS = [
    { key: 'A', dir: '', name: 'светлая галерея' },
    { key: 'B', dir: 'variants/b/', name: 'дом фабрик' },
    { key: 'C', dir: 'variants/c/', name: 'салон-магазин' },
    { key: 'D', dir: 'variants/d/', name: 'то, что советую' },
  ];

  var MISSING = { C: ['factory.html'] };

  var path = location.pathname.replace(/\\/g, '/');
  var page = path.split('/').pop() || 'index.html';
  if (!/\.html?$/.test(page)) page = 'index.html';

  if (/\/variants\/[^/]*$/.test(path)) return;

  var inVariant = path.match(/\/variants\/([bcd])\//);
  var current = inVariant ? inVariant[1].toUpperCase() : 'A';
  var root = inVariant ? '../../' : '';

  function href(v) {
    var skip = MISSING[v.key] || [];
    var target = skip.indexOf(page) === -1 ? page + location.search : 'index.html';
    return root + v.dir + target;
  }

  var css = [
    '.vswitch{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);',
    'z-index:90;display:flex;align-items:center;gap:6px;padding:6px;',
    'background:#fff;border:1px solid #e4ded4;border-radius:999px;',
    'box-shadow:0 10px 34px rgba(0,0,0,.16);max-width:calc(100vw - 20px);',
    "font-family:'Inter','Segoe UI',Arial,sans-serif;}",
    '.vswitch__back{font-size:11px;letter-spacing:.1em;text-transform:uppercase;',
    'color:#6b655c;padding:8px 12px;white-space:nowrap;text-decoration:none;}',
    '.vswitch__back:hover{color:#1a1917;}',
    '.vswitch__set{display:flex;gap:4px;}',
    '.vswitch__set a{display:flex;align-items:center;gap:7px;padding:8px 13px;',
    'border-radius:999px;font-size:12px;color:#6b655c;white-space:nowrap;',
    'text-decoration:none;}',
    '.vswitch__set a b{font-weight:600;color:#1a1917;}',
    '.vswitch__set a:hover{background:#f6f3ee;}',
    '.vswitch__set a.is-on{background:#191917;color:#fff;}',
    '.vswitch__set a.is-on b{color:#fff;}',

    '@media (max-width:760px){.vswitch{bottom:10px;padding:4px;}',
    '.vswitch__back{display:none;}',
    '.vswitch__set a{padding:8px 12px;}',
    '.vswitch__set a span{display:none;}}',
  ].join('');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);

  var bar = document.createElement('nav');
  bar.className = 'vswitch';
  bar.setAttribute('aria-label', 'Варианты дизайна');

  bar.innerHTML =
    '<a class="vswitch__back" href="' + root + 'variants/index.html">Все варианты</a>' +
    '<span class="vswitch__set">' +
      VARIANTS.map(function (v) {
        return '<a href="' + href(v) + '"' +
          (v.key === current ? ' class="is-on" aria-current="page"' : '') +
          ' title="BrandGallery ' + v.key + ' — ' + v.name + '">' +
          '<span>BrandGallery</span><b>' + v.key + '</b></a>';
      }).join('') +
    '</span>';

  document.body.append(bar);
})();
