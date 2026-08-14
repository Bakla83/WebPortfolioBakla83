window.Centipede = window.Centipede || {};

(function (ns) {
  'use strict';

  let uid = 0;

  const COATS = {
    bay: {
      body: '#8f4f26', shade: '#4e2810', points: '#1e1815',
      mane: '#1c1613', hoof: '#2c2320',
    },
    black: {
      body: '#3a322c', shade: '#161311', points: '#141110',
      mane: '#141110', hoof: '#211c19',
    },
    chestnut: {
      body: '#ab5527', shade: '#6b2f11', points: '#8d4420',
      mane: '#d9a468', hoof: '#3a2c22',
    },
    buckskin: {
      body: '#d0a05c', shade: '#96661f', points: '#221b16',
      mane: '#221b16', hoof: '#2c2320',
    },
    palomino: {
      body: '#daa85f', shade: '#9c6a26', points: '#c08f4a',
      mane: '#f6ecda', hoof: '#3d3128',
    },
    grey: {
      body: '#c3bfbb', shade: '#827d78', points: '#87817e',
      mane: '#8b8784', hoof: '#3a3532', pattern: 'dapple',
    },
    appaloosa: {
      body: '#7a4a2b', shade: '#452714', points: '#2a2018',
      mane: '#2a2018', hoof: '#332a24', pattern: 'blanket',
    },
    pinto: {
      body: '#824924', shade: '#4a250f', points: '#221a15',
      mane: '#221a15', hoof: '#2f2620', pattern: 'patches',
    },
    cremello: {
      body: '#f0e4cd', shade: '#c2ab84', points: '#e6d6ba',
      mane: '#faf5ea', hoof: '#c8b49a',
    },
    grullo: {
      body: '#a1978b', shade: '#665d51', points: '#3a332c',
      mane: '#3a332c', hoof: '#332e29', pattern: 'dorsal',
    },
  };

  const COAT_ORDER = [
    'black', 'bay', 'chestnut', 'appaloosa', 'pinto',
    'grullo', 'buckskin', 'palomino', 'grey', 'cremello',
  ];

  const POSES = {
    alert: { tilt: 12,  step: false },
    stand: { tilt: 0,   step: false },
    step:  { tilt: 4,   step: true  },
    low:   { tilt: -30, step: false },
  };

  const BODY =
    'M150 148 C152 116 166 94 185 86 C214 94 240 102 266 102 ' +
    'C294 102 318 96 340 92 C366 90 386 106 394 132 ' +
    'C404 162 400 194 388 210 C378 222 358 226 346 222 ' +
    'C312 228 268 228 230 220 C198 213 170 200 158 182 ' +
    'C148 168 148 158 150 148 Z';

  const NECK =
    'M196 84 C170 60 138 44 106 42 C99 41 94 45 92 52 ' +
    'C87 66 74 82 58 95 C46 104 36 109 30 110 ' +
    'C26 114 28 123 36 127 C48 131 63 127 77 120 ' +
    'C91 113 102 108 110 99 C112 111 118 124 128 140 ' +
    'C140 158 152 176 158 198 C186 222 226 214 238 190 ' +
    'C240 140 218 98 196 84 Z';

  const EARS =
    'M100 42 C95 27 93 16 97 8 C104 15 109 28 110 42 Z ' +
    'M110 44 C107 30 106 20 110 12 C116 20 120 32 120 46 Z';

  const EARS_IN =
    'M100 39 C97 29 96 22 98 15 C102 21 105 30 106 39 Z ' +
    'M110 41 C108 31 108 25 110 19 C114 25 116 33 116 43 Z';

  const MANE_MASS =
    'M103 40 C137 42 171 58 193 89 C201 107 200 130 190 145 ' +
    'C183 134 176 125 168 117 C165 128 160 137 153 142 ' +
    'C147 131 140 121 132 112 C128 121 123 127 117 129 ' +
    'C110 113 104 76 101 44 Z';

  const TAIL_MASS =
    'M378 92 C406 100 424 128 426 168 C428 210 415 250 396 276 ' +
    'C390 284 378 281 380 270 C396 238 402 202 398 168 ' +
    'C394 134 380 110 371 98 Z';

  const LEG_FRONT =
    'M156 176 C150 210 160 236 164 258 C166 282 167 294 167 306 ' +
    'L163 336 L187 336 L182 306 C183 294 184 282 186 258 ' +
    'C190 236 196 210 192 174 Z';

  const LEG_FRONT_STEP =
    'M156 176 C146 208 148 236 144 258 C140 282 136 294 132 306 ' +
    'L127 336 L151 336 L150 306 C154 294 158 282 164 258 ' +
    'C172 236 196 210 192 174 Z';

  const LEG_HIND =
    'M342 166 C337 206 352 230 358 256 C354 280 352 296 350 308 ' +
    'L346 336 L370 336 L366 308 C368 292 374 278 384 258 ' +
    'C394 232 388 196 378 164 Z';

  const LEGS = [
    { kind: 'front', tx: 28,  ty: -13, sx: 0.96, sy: 0.97, far: true },
    { kind: 'hind',  tx: -20, ty: -13, sx: 0.96, sy: 0.97, far: true },
    { kind: 'front', tx: 0,   ty: 0,   sx: 1,    sy: 1,    far: false },
    { kind: 'hind',  tx: 0,   ty: 0,   sx: 1,    sy: 1,    far: false },
  ];

  const SOLE = { front: 175, step: 139, hind: 358 };

  const FACE = {

    star: '<ellipse cx="97" cy="56" rx="6" ry="7.5" transform="rotate(-34 97 56)"/>',
    blaze:
      '<path d="M96 54 C84 70 66 88 47 102 C40 107 33 110 27 109 ' +
      'C25 114 28 122 35 125 C49 120 63 109 76 95 ' +
      'C85 84 92 69 99 58 Z"/>',
    bald:
      '<path d="M103 46 C88 66 68 90 45 107 C37 113 29 116 23 114 ' +
      'C22 122 27 130 38 131 C55 127 72 114 86 98 ' +
      'C97 85 105 66 108 50 Z"/>',
  };

  function rng(seed) {
    let s = (seed >>> 0) || 1;
    return function () {
      s ^= s << 13; s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5;  s >>>= 0;
      return s / 4294967296;
    };
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function hex(c) {
    c = c.replace('#', '');
    return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
  }

  function mix(a, b, t) {
    const x = hex(a), y = hex(b);
    const out = x.map(function (v, i) {
      return Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0');
    });
    return '#' + out.join('');
  }

  function bez(t, p0, p1, p2, p3) {
    const u = 1 - t;
    return [
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ];
  }

  const CREST = [[106, 42], [138, 44], [170, 60], [192, 92]];

  function mane(coat, seed, id) {
    const r = rng(seed);

    const dark = mix(coat.mane, '#000000', 0.22);
    const light = mix(coat.mane, '#ffffff', 0.14);

    let strands = '';
    const n = 11;
    for (let i = 0; i < n; i++) {

      const t = 0.06 + (i / (n - 1)) * 0.94;
      const p = bez(t, CREST[0], CREST[1], CREST[2], CREST[3]);

      const dx = -4 - r() * 20;
      const len = 70;
      const w = 2.5 + r() * 2.5;
      const tone = i % 3 === 0 ? dark : (i % 3 === 1 ? coat.mane : light);
      strands += '<path d="M' + p[0].toFixed(1) + ' ' + (p[1] - 6).toFixed(1) +
        ' Q' + (p[0] + dx * 0.3).toFixed(1) + ' ' + (p[1] + len * 0.5).toFixed(1) +
        ' ' + (p[0] + dx).toFixed(1) + ' ' + (p[1] + len).toFixed(1) +
        '" fill="none" stroke="' + tone + '" stroke-width="' + w.toFixed(1) +
        '" stroke-linecap="round" opacity="' + (0.25 + r() * 0.28).toFixed(2) + '"/>';
    }

    return '<path d="' + MANE_MASS + '" fill="' + coat.mane + '"/>' +
      '<g clip-path="url(#cm-' + id + ')">' + strands +

      '<path d="M101 38 C137 40 173 56 196 88" fill="none" stroke="#000" ' +
      'stroke-width="14" stroke-linecap="round" opacity=".16"/></g>';
  }

  const FORELOCK =
    'M104 42 C99 55 90 68 77 80 C71 85 65 81 67 73 C76 62 91 48 99 39 Z';

  function tail(coat, seed, id) {
    const r = rng(seed + 991);
    const dark = mix(coat.mane, '#000000', 0.28);
    const light = mix(coat.mane, '#ffffff', 0.16);

    let strands = '';
    const n = 15;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);

      const x0 = 380 + t * 8;
      const y0 = 98 + t * 14;
      const sway = 10 + t * 34 + r() * 14;
      const len = 190;
      const w = 3 + r() * 3.5;
      const tone = i % 3 === 0 ? dark : (i % 3 === 1 ? coat.mane : light);
      strands += '<path d="M' + x0.toFixed(1) + ' ' + y0.toFixed(1) +
        ' C' + (x0 + sway).toFixed(1) + ' ' + (y0 + len * 0.35).toFixed(1) +
        ' ' + (x0 + sway).toFixed(1) + ' ' + (y0 + len * 0.7).toFixed(1) +
        ' ' + (x0 + sway * 0.4).toFixed(1) + ' ' + (y0 + len).toFixed(1) +
        '" fill="none" stroke="' + tone + '" stroke-width="' + w.toFixed(1) +
        '" stroke-linecap="round" opacity="' + (0.55 + r() * 0.4).toFixed(2) + '"/>';
    }

    return '<path d="' + TAIL_MASS + '" fill="' + coat.mane + '"/>' +
      '<g clip-path="url(#ct-' + id + ')">' + strands + '</g>';
  }

  function dapples(seed) {
    const r = rng(seed);
    let out = '';
    for (let i = 0; i < 36; i++) {
      const x = 158 + r() * 226;
      const y = 88 + r() * 138;
      const rad = 5 + r() * 7.5;
      out += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) +
        '" r="' + rad.toFixed(1) + '" fill="#fff" opacity="' +
        (0.13 + r() * 0.18).toFixed(2) + '"/>';
    }
    return out;
  }

  function blanket(seed) {
    const r = rng(seed);
    let out =
      '<path d="M276 94 C320 92 356 106 378 132 C396 160 396 194 384 214 ' +
      'C350 226 304 226 272 216 C258 178 258 128 276 94 Z" fill="#f3ede3"/>';
    for (let i = 0; i < 17; i++) {
      const x = 276 + r() * 100;
      const y = 112 + r() * 104;
      const rx = 5 + r() * 6.5;
      out += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) +
        '" rx="' + rx.toFixed(1) + '" ry="' + (rx * 0.78).toFixed(1) +
        '" fill="#402617" opacity=".88" transform="rotate(' +
        (r() * 60 - 30).toFixed(0) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"/>';
    }
    return out;
  }

  function patches() {

    return (
      '<path d="M154 152 C178 130 204 142 210 170 C217 202 202 228 178 232 ' +
      'C156 234 146 206 148 178 Z" fill="#f5f0e7"/>' +
      '<path d="M248 168 C284 152 320 168 326 196 C331 224 304 234 270 228 ' +
      'C241 221 234 188 248 168 Z" fill="#f5f0e7"/>' +
      '<path d="M348 92 C378 100 392 128 378 150 C356 162 336 144 338 116 Z" ' +
      'fill="#f5f0e7"/>'
    );
  }

  function dorsal() {

    return (
      '<path d="M190 97 C230 109 292 113 344 103" fill="none" stroke="#3f382f" ' +
      'stroke-width="9" stroke-linecap="round" opacity=".9"/>'
    );
  }

  const PATTERNS = { dapple: dapples, blanket: blanket, patches: patches, dorsal: dorsal };

  function svg(o) {
    o = o || {};
    const coat = COATS[o.coat] || COATS.bay;
    const pose = POSES[o.pose] || POSES.stand;
    const seed = o.seed || 7;
    const socks = o.socks || 0;
    const lite = o.detail === 'lite';
    const id = 'h' + (++uid);
    const white = '#f4efe4';
    const turn = 'rotate(' + pose.tilt + ' 190 94)';

    function legPath(l) {
      if (l.kind === 'hind') return LEG_HIND;
      return (pose.step && !l.far) ? LEG_FRONT_STEP : LEG_FRONT;
    }

    function legTr(l) {
      if (!l.far) return '';
      return ' transform="translate(' + l.tx + ' ' + l.ty + ') scale(' +
        l.sx + ' ' + l.sy + ')"';
    }

    function wears(l) {
      if (socks === 4) return true;
      if (socks === 2) return l.kind === 'hind';
      return false;
    }

    let silh = '<path d="' + BODY + '" fill="#fff"/>' +
      '<g transform="' + turn + '"><path d="' + NECK + '" fill="#fff"/></g>';
    LEGS.forEach(function (l) {
      silh += '<path d="' + legPath(l) + '" fill="#fff"' + legTr(l) + '/>';
    });

    const maskShade = '<mask id="ms-' + id + '">' + silh + '</mask>';
    const maskPat = '<mask id="mp-' + id + '">' + silh +
      '<g transform="' + turn + '">' +
        '<path d="' + FORELOCK + '" fill="#000"/>' +
        '<circle cx="88" cy="72" r="11" fill="#000"/>' +
      '</g></mask>';

    function hoof(l) {
      const local = l.kind === 'hind'
        ? SOLE.hind
        : (pose.step && !l.far ? SOLE.step : SOLE.front);

      const x = l.tx + l.sx * local;
      const y = l.ty + l.sy * 336;
      const w = 12 * l.sx;
      const h = 19 * l.sy;
      const horn = wears(l) ? '#d3c3a6' : coat.hoof;

      return '<path d="M' + (x - w).toFixed(1) + ' ' + (y - h).toFixed(1) +
        ' L' + (x + w).toFixed(1) + ' ' + (y - h).toFixed(1) +
        ' C' + (x + w + 2.5).toFixed(1) + ' ' + (y - h * 0.4).toFixed(1) +
        ' ' + (x + w + 2.5).toFixed(1) + ' ' + y.toFixed(1) +
        ' ' + (x + w + 1).toFixed(1) + ' ' + y.toFixed(1) +
        ' L' + (x - w - 1).toFixed(1) + ' ' + y.toFixed(1) +
        ' C' + (x - w - 2.5).toFixed(1) + ' ' + y.toFixed(1) +
        ' ' + (x - w - 2.5).toFixed(1) + ' ' + (y - h * 0.4).toFixed(1) +
        ' ' + (x - w).toFixed(1) + ' ' + (y - h).toFixed(1) +
        ' Z" fill="' + horn + '"/>' +
        '<path d="M' + (x - w).toFixed(1) + ' ' + (y - h).toFixed(1) +
        ' L' + (x + w).toFixed(1) + ' ' + (y - h).toFixed(1) +
        '" stroke="#000" stroke-width="' + (2.2 * l.sy).toFixed(1) +
        '" stroke-linecap="round" opacity=".22" fill="none"/>';
    }

    let far = '';
    let near = '';
    LEGS.forEach(function (l) {
      const d = legPath(l);
      const tr = legTr(l);

      let leg = '<path d="' + d + '" fill="' + coat.body + '"' + tr + '/>';
      if (l.far) leg += '<path d="' + d + '" fill="#000" opacity=".34"' + tr + '/>';

      leg += '<g' + tr + ' clip-path="url(#cl-' + id + ')">' +
        '<path d="' + d + '" fill="' + coat.points + '" opacity="' +
        (l.far ? '.55' : '.85') + '"/></g>';

      if (wears(l)) {
        leg += '<g' + tr + ' clip-path="url(#cs-' + id + ')">' +
          '<path d="' + d + '" fill="' + white + '"/></g>';
      }
      leg += hoof(l);
      if (l.far) far += leg; else near += leg;
    });

    const shading = lite ? '' :
      '<g mask="url(#ms-' + id + ')">' +
        '<g filter="url(#fb-' + id + ')" fill="' + coat.shade + '">' +

          '<ellipse cx="286" cy="222" rx="92" ry="26" opacity=".85"/>' +

          '<ellipse cx="214" cy="176" rx="17" ry="56" opacity=".5" ' +
            'transform="rotate(7 214 176)"/>' +

          '<ellipse cx="342" cy="196" rx="19" ry="46" opacity=".5"/>' +

          '<ellipse cx="156" cy="180" rx="30" ry="40" opacity=".7"/>' +

          '<ellipse cx="108" cy="118" rx="26" ry="17" opacity=".6" ' +
            'transform="rotate(-28 108 118)"/>' +

          '<ellipse cx="150" cy="104" rx="60" ry="16" opacity=".55" ' +
            'transform="rotate(24 150 104)"/>' +

          '<ellipse cx="196" cy="300" rx="16" ry="52" opacity=".45"/>' +
          '<ellipse cx="338" cy="300" rx="16" ry="52" opacity=".45"/>' +
        '</g>' +
        '<g filter="url(#fb-' + id + ')" fill="#ffffff">' +

          '<ellipse cx="268" cy="106" rx="86" ry="17" opacity=".2"/>' +

          '<ellipse cx="366" cy="136" rx="32" ry="30" opacity=".17"/>' +

          '<ellipse cx="262" cy="152" rx="62" ry="26" opacity=".13"/>' +

          '<ellipse cx="188" cy="132" rx="22" ry="34" opacity=".14" ' +
            'transform="rotate(18 188 132)"/>' +
        '</g>' +
      '</g>';

    const headHi = lite ? '' :
      '<g filter="url(#fs-' + id + ')" clip-path="url(#ch-' + id + ')">' +
        '<ellipse cx="103" cy="92" rx="15" ry="16" fill="#fff" opacity=".16"/>' +
        '<ellipse cx="62" cy="88" rx="26" ry="9" fill="#fff" opacity=".12" ' +
          'transform="rotate(-38 62 88)"/>' +
      '</g>';

    const head =
      '<g transform="' + turn + '">' +
        '<path d="' + EARS + '" fill="' + coat.body + '"/>' +
        '<path d="' + EARS_IN + '" fill="' + coat.points + '" opacity=".7"/>' +
        '<path d="' + NECK + '" fill="' + coat.body + '"/>' +

        (o.face && FACE[o.face]
          ? '<g fill="' + white + '" clip-path="url(#ch-' + id + ')">' +
            FACE[o.face] + '</g>' : '') +
        headHi +
        mane(coat, seed, id) +
        '<path d="' + FORELOCK + '" fill="' + mix(coat.mane, '#000000', 0.2) + '"/>' +
      '</g>';

    const face =
      '<g transform="' + turn + '">' +
        '<path d="M112 104 C104 88 102 70 107 54" fill="none" stroke="' + coat.shade +
          '" stroke-width="2.5" stroke-linecap="round" opacity=".35"/>' +
        '<ellipse cx="88" cy="72" rx="4.6" ry="3.9" fill="#100e0c" ' +
          'transform="rotate(-34 88 72)"/>' +
        '<ellipse cx="86.6" cy="70.6" rx="1.3" ry="1" fill="#fff" opacity=".55"/>' +
        '<path d="M83 66 C87 63 92 64 95 67" fill="none" stroke="' + coat.shade +
          '" stroke-width="1.6" stroke-linecap="round" opacity=".5"/>' +
        '<ellipse cx="35" cy="119" rx="4.4" ry="3.2" fill="' + coat.points +
          '" opacity=".8" transform="rotate(-30 35 119)"/>' +
        '<path d="M27 126 C35 131 47 129 55 124" fill="none" stroke="' + coat.points +
          '" stroke-width="1.8" stroke-linecap="round" opacity=".45"/>' +
      '</g>';

    const pattern = coat.pattern && PATTERNS[coat.pattern]
      ? '<g mask="url(#mp-' + id + ')">' + PATTERNS[coat.pattern](seed) + '</g>'
      : '';

    return '<svg class="horse" viewBox="0 0 440 360" role="img"' +
      (o.label ? ' aria-label="' + esc(o.label) + '"' : ' aria-hidden="true"') + '>' +
      '<defs>' +
        maskShade + maskPat +

        '<clipPath id="cs-' + id + '"><rect x="0" y="254" width="440" height="110"/></clipPath>' +
        '<clipPath id="cl-' + id + '"><rect x="0" y="292" width="440" height="72"/></clipPath>' +
        '<clipPath id="ch-' + id + '"><path d="' + NECK + '"/></clipPath>' +
        '<clipPath id="cm-' + id + '"><path d="' + MANE_MASS + '"/></clipPath>' +
        '<clipPath id="ct-' + id + '"><path d="' + TAIL_MASS + '"/></clipPath>' +
        '<filter id="fb-' + id + '" x="-30%" y="-30%" width="160%" height="160%">' +
          '<feGaussianBlur stdDeviation="13"/></filter>' +
        '<filter id="fs-' + id + '" x="-40%" y="-40%" width="180%" height="180%">' +
          '<feGaussianBlur stdDeviation="7"/></filter>' +
      '</defs>' +

      (o.ground === false ? '' :
        '<ellipse class="horse__shadow" cx="272" cy="336" rx="130" ry="11"/>') +

      tail(coat, seed, id) +
      far +
      '<path d="' + BODY + '" fill="' + coat.body + '"/>' +
      near +
      head +
      shading +
      pattern +
      face +
      '</svg>';
  }

  ns.horses = {
    COATS: COATS,
    COAT_ORDER: COAT_ORDER,
    POSES: POSES,
    svg: svg,
  };
})(window.Centipede);
