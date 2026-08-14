(function () {
  'use strict';

  var D = window.DEMO;
  var S = window.SITE;
  if (!D || !S) return;

  function initHeroMarks() {
    var box = document.getElementById('heromarks');
    if (!box) return;

    var names = Object.keys(D.FACTORIES).filter(function (n) {
      return D.products.some(function (p) { return p.factory === n; });
    }).slice(0, 6);

    box.innerHTML = names.map(function (n) {
      return '<a href="factory.html?f=' + encodeURIComponent(n) + '">' + S.esc(n) + '</a>';
    }).join('') + '<a class="hero__marks-all" href="factory.html">все фабрики</a>';
  }

  function initStrips() {
    var box = document.getElementById('fstrips');
    if (!box) return;

    var names = Object.keys(D.FACTORIES).filter(function (n) {
      return D.products.some(function (p) { return p.factory === n; });
    });

    box.innerHTML = names.map(function (n) {
      var all = D.products.filter(function (p) { return p.factory === n; });
      var inStock = all.filter(function (p) { return p.stock !== 'order'; });

      return '<div class="fstrip reveal">' +
        '<div class="fstrip__txt">' +
          '<span class="eyebrow">' + S.esc(D.FACTORIES[n].country) + '</span>' +
          '<h3 class="fstrip__name"><a href="factory.html?f=' +
            encodeURIComponent(n) + '">' + S.esc(n) + '</a></h3>' +
          '<p class="fstrip__text">' + S.esc(D.FACTORIES[n].text) + '</p>' +
          '<div class="fstrip__meta">' +
            '<span>' + all.length + ' ' +
              S.plural(all.length, ['позиция', 'позиции', 'позиций']) + '</span>' +
            (inStock.length
              ? '<b>' + inStock.length + ' в наличии</b>'
              : '<span>под заказ</span>') +
          '</div>' +
        '</div>' +
        '<div class="fstrip__row">' + all.slice(0, 3).map(function (p) {
          return '<a href="product.html?id=' + p.id + '">' +
            S.ph(p.type, p.id) +
            '<span class="fstrip__cap">' + S.esc(p.name) + '</span></a>';
        }).join('') + '</div>' +
        '</div>';
    }).join('');

    var items = Array.prototype.slice.call(box.querySelectorAll('.reveal'));
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (rows) {
      rows.forEach(function (r) {
        if (r.isIntersecting) { r.target.classList.add('is-in'); io.unobserve(r.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  function initBuy() {
    var side = document.querySelector('.prod__side');
    if (!side) return;

    var price = side.querySelector('.prod__price');
    if (!price) return;

    var parts = [price];
    var node = price.nextElementSibling;
    while (node && !node.classList.contains('prod__block')) {
      parts.push(node);
      node = node.nextElementSibling;
    }

    var buy = document.createElement('div');
    buy.className = 'dbuy';
    price.before(buy);
    parts.forEach(function (el) { buy.append(el); });

    if (!('IntersectionObserver' in window)) return;
    var top = parseInt(getComputedStyle(buy).top, 10) || 0;
    new IntersectionObserver(function (rows) {
      buy.classList.toggle('is-stuck', rows[0].intersectionRatio < 1);
    }, { threshold: [1], rootMargin: -(top + 1) + 'px 0px 0px 0px' }).observe(buy);
  }

  initHeroMarks();
  initStrips();
  initBuy();
})();
