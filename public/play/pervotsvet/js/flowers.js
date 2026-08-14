window.Pervotsvet = window.Pervotsvet || {};

(function (ns) {
  'use strict';

  const A = 'var(--petal-a)';
  const B = 'var(--petal-b)';
  const C = 'var(--core)';
  const S = 'var(--stem)';

  function ring(count, rx, ry, dist, fill, rot, opacity) {
    let out = '';
    for (let i = 0; i < count; i++) {
      const angle = (rot || 0) + (360 / count) * i;
      out +=
        '<ellipse cx="0" cy="' + -dist + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill +
        '" transform="rotate(' + angle.toFixed(2) + ')"' +
        (opacity ? ' opacity="' + opacity + '"' : '') + '/>';
    }
    return out;
  }

  const HEADS = {
    tulip: function () {
      return (
        '<path d="M0 -6 C-16 -14 -18 -34 -6 -44 C-2 -34 -2 -22 0 -14 Z" fill="' + B + '"/>' +
        '<path d="M0 -6 C16 -14 18 -34 6 -44 C2 -34 2 -22 0 -14 Z" fill="' + B + '"/>' +
        '<path d="M0 8 C-15 -2 -16 -28 0 -42 C16 -28 15 -2 0 8 Z" fill="' + A + '"/>' +
        '<path d="M0 6 C-6 -4 -6 -26 0 -38 C6 -26 6 -4 0 6 Z" fill="' + C + '" opacity=".35"/>'
      );
    },

    peony: function () {
      return (
        ring(11, 14, 21, 21, A) +
        ring(9, 11, 16, 15, B, 18) +
        ring(7, 8, 12, 9, A, 9, '.9') +
        ring(5, 6, 8, 5, B, 22) +
        '<circle r="5" fill="' + C + '"/>'
      );
    },

    rose: function () {
      let swirl = '';

      for (let i = 0; i < 6; i++) {
        const r = 27 - i * 4;
        swirl +=
          '<path d="M' + -r + ' 0 A ' + r + ' ' + r + ' 0 0 1 ' + r + ' 0" fill="none" stroke="' +
          B + '" stroke-width="2.4" stroke-linecap="round" opacity=".55" transform="rotate(' +
          i * 41 + ')"/>';
      }
      return (
        ring(8, 15, 17, 20, B, 0, '.85') +
        '<circle r="28" fill="' + A + '"/>' +
        swirl +
        '<circle r="7" fill="' + B + '"/>'
      );
    },

    daisy: function () {
      return (
        ring(13, 5, 20, 22, B, 14, '.75') +
        ring(13, 4.5, 18, 20, A) +
        '<circle r="10" fill="' + C + '"/>' +
        '<circle r="10" fill="' + S + '" opacity=".18"/>' +
        ring(7, 1.4, 1.4, 5, C, 0, '.8')
      );
    },

    ranunculus: function () {
      return (
        ring(12, 9, 10, 27, A) +
        ring(10, 8, 9, 19, B, 18) +
        ring(8, 6.5, 7, 12, A, 9) +
        ring(6, 5, 5.5, 6, B, 24) +
        '<circle r="4" fill="' + C + '"/>'
      );
    },

    anemone: function () {
      return (
        ring(6, 14, 23, 21, B, 30) +
        ring(6, 12, 20, 19, A) +
        ring(16, 1.3, 6, 10, C, 0, '.75') +
        '<circle r="9" fill="' + C + '"/>'
      );
    },

    craspedia: function () {
      let dots = '';

      dots += ring(14, 2, 2, 15, B, 0, '.9');
      dots += ring(10, 2, 2, 10, C, 18, '.7');
      dots += ring(6, 1.8, 1.8, 5, B, 9, '.6');
      return '<circle r="17" fill="' + A + '"/>' + dots;
    },

    lavender: function () {
      let buds = '';

      for (let i = 0; i < 11; i++) {
        const y = -8 - i * 4.2;
        const size = 7.5 - i * 0.5;
        const shift = (i % 2 === 0 ? 1 : -1) * (5.5 - i * 0.35);
        buds +=
          '<ellipse cx="' + shift.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + size.toFixed(1) +
          '" ry="' + (size * 0.78).toFixed(1) + '" fill="' + (i % 2 === 0 ? A : B) + '"/>';
      }
      return (
        '<path d="M0 12 L0 -50" stroke="' + S + '" stroke-width="2.5" stroke-linecap="round"/>' +
        buds +
        '<ellipse cx="0" cy="-54" rx="4" ry="5" fill="' + A + '"/>'
      );
    },
  };

  const TYPES = ['tulip', 'peony', 'rose', 'daisy', 'ranunculus', 'anemone', 'craspedia', 'lavender'];

  const PALETTES = {
    tulip: '--petal-a:var(--f-rose);--petal-b:var(--f-rose-deep);--core:var(--f-gold)',
    peony: '--petal-a:var(--f-peach);--petal-b:var(--f-rose);--core:var(--f-cream)',
    rose: '--petal-a:var(--f-rose-deep);--petal-b:var(--f-rose);--core:var(--f-gold)',
    daisy: '--petal-a:var(--f-cream);--petal-b:var(--f-cream-2);--core:var(--f-gold)',
    ranunculus: '--petal-a:var(--f-gold);--petal-b:var(--f-peach);--core:var(--f-cream)',
    anemone: '--petal-a:var(--f-lilac);--petal-b:var(--f-lilac-deep);--core:var(--f-ink)',
    craspedia: '--petal-a:var(--f-gold);--petal-b:var(--f-gold-deep);--core:var(--f-cream)',
    lavender: '--petal-a:var(--f-lilac);--petal-b:var(--f-lilac-deep);--core:var(--f-cream)',
  };

  function styleFor(type) {
    return '--stem:var(--f-stem);' + (PALETTES[type] || PALETTES.daisy);
  }

  function head(type) {
    const draw = HEADS[type] || HEADS.daisy;
    return draw();
  }

  function flowerSVG(type, opts) {
    const o = opts || {};
    const cls = 'flower flower--' + type + (o.sway ? ' flower--sway' : '') + (o.className ? ' ' + o.className : '');
    return (
      '<svg class="' + cls + '" viewBox="-50 -50 100 100" style="' + styleFor(type) + '" ' +
      'role="presentation" focusable="false">' + head(type) + '</svg>'
    );
  }

  function stemSVG(type, opts) {
    const o = opts || {};
    const len = o.length || 150;
    const bend = o.bend === undefined ? 0 : o.bend;
    const leafY = len * 0.45;

    const stem =
      '<path d="M0 0 C' + bend * 1.2 + ' ' + len * 0.35 + ' ' + bend + ' ' + len * 0.7 + ' 0 ' + len +
      '" fill="none" stroke="' + S + '" stroke-width="3.2" stroke-linecap="round"/>';

    const leaf =
      '<path d="M0 ' + leafY + ' C' + (bend > 0 ? 26 : -26) + ' ' + (leafY - 16) + ' ' +
      (bend > 0 ? 34 : -34) + ' ' + (leafY + 6) + ' 0 ' + (leafY + 16) + ' Z" fill="' + S + '" opacity=".85"/>';

    return (
      '<svg class="flower flower--' + type + ' flower--stemmed" viewBox="-50 -50 100 ' + (50 + len) +
      '" style="' + styleFor(type) + '" role="presentation" focusable="false">' +
      stem + leaf + head(type) + '</svg>'
    );
  }

  function bouquetSVG(types) {
    const n = types.length;
    let out = '';
    for (let i = 0; i < n; i++) {
      const p = n === 1 ? 0.5 : i / (n - 1);
      const angle = -34 + p * 68;
      const spread = 30;
      const x = (p - 0.5) * 2 * spread;
      const y = Math.abs(p - 0.5) * 26 - 6;
      const scale = 0.62 + (1 - Math.abs(p - 0.5) * 2) * 0.24;

      out +=
        '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' +
        angle.toFixed(1) + ') scale(' + scale.toFixed(2) + ')" style="' + styleFor(types[i]) + '">' +

        '<path d="M0 0 L0 62" stroke="' + S + '" stroke-width="4" stroke-linecap="round" opacity=".9"/>' +
        head(types[i]) +
        '</g>';
    }

    out +=
      '<path d="M-19 40 C-6 46 6 46 19 40 L17 50 C6 55 -6 55 -17 50 Z" fill="var(--f-ribbon)"/>' +
      '<path d="M-19 40 C-6 46 6 46 19 40" fill="none" stroke="var(--f-ribbon-deep)" stroke-width="1.5" opacity=".6"/>';

    return (
      '<svg class="bouquet-art" viewBox="-58 -58 116 122" role="presentation" focusable="false">' +
      out + '</svg>'
    );
  }

  ns.flowers = {
    types: TYPES,
    palettes: PALETTES,
    head: head,
    svg: flowerSVG,
    stem: stemSVG,
    bouquet: bouquetSVG,
  };
})(window.Pervotsvet);
