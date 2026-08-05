/*
  Раскладка и отрисовка нотного листа.

  Ни шрифта, ни картинок: все знаки — ключи, головки, штили, вязки, паузы,
  диезы — строятся кодом как пути SVG. Причина простая: музыкальные шрифты
  вроде Bravura весят сотни килобайт и их пришлось бы тянуть с чужого
  домена, а системные шрифты музыкальные символы либо не содержат вовсе,
  либо рисуют их в неверном масштабе относительно стана. Свои пути ещё и
  масштабируются вместе с ним: весь размер задаётся одной величиной S —
  расстоянием между линейками.

  Единица высоты — полпромежутка: соседние ступени стоят через S/2, поэтому
  нота попадает то на линейку, то между линейками сама собой.
*/
window.Partitura = window.Partitura || {};

(function (ns) {
  'use strict';

  const S = 12; // расстояние между линейками
  const STAFF_H = S * 4;
  const PAD_X = 18;
  const SYS_TOP = 52; // запас сверху под добавочные линейки и штили
  const SYS_BOTTOM = 52;
  const SYS_H = SYS_TOP + STAFF_H + SYS_BOTTOM;

  const HEAD_RX = S * 0.66;
  const HEAD_RY = S * 0.48;
  const STEM_LEN = S * 3.4;
  const STEM_W = 1.6;

  const CLEF_W = { treble: 42, bass: 38 };
  const ACC_W = 13;
  const METER_W = 28;

  /** Ступень верхней линейки стана: фа второй октавы / ля малой. */
  const TOP_LINE_D = { treble: 38, bass: 26 };

  const sc = ns.score;

  /* ─────────────────────────────── геометрия ─────────────────────────────── */

  function topLineD(clef) {
    return TOP_LINE_D[clef] || TOP_LINE_D.treble;
  }

  /** Ступень → y относительно верхней линейки стана. */
  function yOfD(clef, d, staffTop) {
    return staffTop + ((topLineD(clef) - d) * S) / 2;
  }

  /** Обратный переход: y → ближайшая ступень. Нужен для клика по стану. */
  function dOfY(clef, y, staffTop) {
    return topLineD(clef) - Math.round(((y - staffTop) * 2) / S);
  }

  function slotWidth(ticks) {
    return 24 + 9 * Math.sqrt(ticks);
  }

  function keySigWidth(fifths) {
    return fifths === 0 ? 0 : Math.abs(fifths) * 10 + 8;
  }

  /* ──────────────────────────────── раскладка ──────────────────────────── */

  /**
   * Считает, какой такт на какой строке стоит и где именно лежит каждая нота.
   *
   * Разметка идёт до отрисовки и отдельно от неё: по этой же раскладке
   * работают попадание мышью, подсветка при воспроизведении и прокрутка
   * к звучащему такту.
   */
  function layout(score, width) {
    const bars = sc.measures(score);
    const inner = Math.max(320, width) - PAD_X * 2;
    const headWidth = CLEF_W[score.clef] + keySigWidth(score.fifths);

    /* Ширины тактов считаются один раз, до разбиения по строкам. */
    const measured = bars.map(function (bar) {
      const items = bar.events.map(function (entry) {
        const accs = (entry.event.notes || []).filter(function (note) {
          return note.acc !== null && note.acc !== undefined;
        }).length;
        return {
          index: entry.index,
          event: entry.event,
          startTick: entry.startTick,
          ticks: entry.ticks,
          accWidth: accs > 0 ? ACC_W : 0,
          width: slotWidth(entry.ticks) + (accs > 0 ? ACC_W : 0),
        };
      });

      const width = items.reduce(function (sum, item) {
        return sum + item.width;
      }, 14);

      return { items: items, width: Math.max(56, width), number: bar.number, ticks: bar.ticks };
    });

    /* Раскладка по строкам: такт целиком либо влезает, либо переносится. */
    const systems = [];
    let current = null;

    measured.forEach(function (bar, i) {
      const available = inner - headWidth - (systems.length === 0 && !current ? METER_W : 0);
      if (!current) {
        current = { bars: [], used: 0, meter: systems.length === 0 };
      }
      const room = inner - headWidth - (current.meter ? METER_W : 0);

      if (current.bars.length && current.used + bar.width > room) {
        systems.push(current);
        current = { bars: [], used: 0, meter: false };
      }
      current.bars.push(bar);
      current.used += bar.width;
      if (i === measured.length - 1) systems.push(current);
      void available;
    });

    if (!systems.length) systems.push({ bars: [], used: 0, meter: true });

    /* Растяжка: такты в полной строке расходятся на всю ширину. Последнюю
       строку растягиваем, только если она и так почти заполнена — иначе
       два такта размазало бы на весь лист. */
    const positions = {};
    systems.forEach(function (system, si) {
      const room = inner - headWidth - (system.meter ? METER_W : 0);
      const fill = system.used > 0 ? room / system.used : 1;
      const isLast = si === systems.length - 1;
      const stretch = isLast ? (fill < 1.25 ? fill : 1) : fill;

      system.top = si * SYS_H;
      system.staffTop = system.top + SYS_TOP;
      system.x0 = PAD_X;
      system.contentX = PAD_X + headWidth + (system.meter ? METER_W : 0);
      system.x1 = PAD_X + inner;
      system.index = si;

      let x = system.contentX;
      system.bars.forEach(function (bar) {
        bar.x = x;
        bar.width = bar.width * stretch;
        let ex = x + 8;
        bar.items.forEach(function (item) {
          item.width = item.width * stretch;
          item.x = ex;
          item.cx = ex + item.accWidth + 11;
          item.system = si;
          positions[item.index] = item;
          ex += item.width;
        });
        x += bar.width;
      });
      system.endX = Math.min(system.x1, x);
    });

    return {
      systems: systems,
      positions: positions,
      width: Math.max(320, width),
      height: systems.length * SYS_H + 12,
      staffSpace: S,
    };
  }

  /* ──────────────────────────────── знаки ──────────────────────────────── */

  /*
    Скрипичный ключ — одна непрерывная линия: хвост снизу, ствол вверх,
    верхняя петля, спуск с пересечением ствола, нижняя чаша и завиток,
    сходящийся к линейке соль. Координаты в промежутках стана, начало
    отсчёта — точка на линейке соль, поэтому ключ сам встаёт на место
    и в скрипичном стане, и в любом масштабе.
  */
  const TREBLE_PATH =
    'M -0.5 4.05 ' +
    'C 0.05 3.85 0.34 3.35 0.34 2.75 ' + /* хвост загибается в ствол */
    'C 0.34 1.4 0.16 -0.9 0.05 -2.6 ' + /* ствол идёт вверх сквозь стан */
    'C -0.02 -3.75 0.25 -4.5 0.72 -4.5 ' + /* верхушка уходит вправо */
    'C 1.15 -4.5 1.3 -3.9 1.1 -3.35 ' + /* и заворачивает вниз */
    'C 0.88 -2.75 0.3 -2.25 -0.25 -1.7 ' + /* спуск влево через ствол */
    'C -0.95 -1.0 -1.45 -0.2 -1.4 0.6 ' + /* левая стенка чаши */
    'C -1.35 1.5 -0.6 2.1 0.25 1.95 ' + /* дно чаши */
    'C 1.05 1.8 1.5 1.05 1.35 0.3 ' + /* правая стенка вверх */
    'C 1.2 -0.35 0.5 -0.7 0.0 -0.35 ' + /* поворот внутрь */
    'C -0.4 -0.05 -0.45 0.5 -0.05 0.6'; /* завиток сходится к линейке соль */

  /*
    Басовый ключ: голова на линейке фа, хвост уходит вниз-влево, две точки
    обнимают ту же линейку — именно они и указывают, какая это линейка.
  */
  const BASS_PATH =
    'M -1.06 -0.28 ' +
    'C -1.02 -1.0 -0.32 -1.42 0.28 -1.2 ' +
    'C 0.96 -0.96 1.36 -0.32 1.28 0.4 ' +
    'C 1.16 1.42 0.32 2.22 -0.92 2.62';

  function clefMarkup(clef, x, staffTop) {
    if (clef === 'bass') {
      // Ноль местной системы координат — четвёртая линейка снизу (фа)
      const y = staffTop + S;
      return (
        '<g class="glyph glyph--clef" transform="translate(' + (x + 16) + ' ' + y + ') scale(' + S + ')">' +
        '<path d="' + BASS_PATH + '" fill="none" stroke="currentColor" stroke-width="0.34" ' +
        'stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="-0.5" cy="-0.02" r="0.42" fill="currentColor"/>' +
        '<circle cx="1.72" cy="-0.5" r="0.17" fill="currentColor"/>' +
        '<circle cx="1.72" cy="0.5" r="0.17" fill="currentColor"/>' +
        '</g>'
      );
    }

    // Ноль — вторая линейка снизу (соль первой октавы)
    const y = staffTop + S * 3;
    return (
      '<g class="glyph glyph--clef" transform="translate(' + (x + 19) + ' ' + y + ') scale(' + S + ')">' +
      '<path d="' + TREBLE_PATH + '" fill="none" stroke="currentColor" stroke-width="0.3" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>' +
      '</g>'
    );
  }

  /** Диез: два наклонных бруска и две почти вертикальные линии. */
  function sharpMarkup(x, y, scale) {
    const k = scale === undefined ? 1 : scale;
    return (
      '<g class="glyph" transform="translate(' + x + ' ' + y + ') scale(' + S * k + ')">' +
      '<path d="M -0.34 -0.9 L -0.34 0.86 M 0.34 -1.02 L 0.34 0.74" ' +
      'stroke="currentColor" stroke-width="0.16" stroke-linecap="round"/>' +
      '<path d="M -0.62 -0.24 L 0.62 -0.46 M -0.62 0.36 L 0.62 0.14" ' +
      'stroke="currentColor" stroke-width="0.26" stroke-linecap="round"/>' +
      '</g>'
    );
  }

  /** Бемоль: вертикаль с петлёй, петля висит ниже линии ступени. */
  function flatMarkup(x, y, scale) {
    const k = scale === undefined ? 1 : scale;
    return (
      '<g class="glyph" transform="translate(' + x + ' ' + y + ') scale(' + S * k + ')">' +
      '<path d="M -0.3 -1.25 L -0.3 0.62" stroke="currentColor" stroke-width="0.16" stroke-linecap="round"/>' +
      '<path d="M -0.3 0.6 C 0.1 0.18 0.56 0.08 0.56 -0.24 C 0.56 -0.56 0.16 -0.6 -0.3 -0.2" ' +
      'fill="none" stroke="currentColor" stroke-width="0.2" stroke-linejoin="round"/>' +
      '</g>'
    );
  }

  /** Бекар: две вертикали и два бруска между ними. */
  function naturalMarkup(x, y, scale) {
    const k = scale === undefined ? 1 : scale;
    return (
      '<g class="glyph" transform="translate(' + x + ' ' + y + ') scale(' + S * k + ')">' +
      '<path d="M -0.3 -1.0 L -0.3 0.55 M 0.3 -0.55 L 0.3 1.0" ' +
      'stroke="currentColor" stroke-width="0.16" stroke-linecap="round"/>' +
      '<path d="M -0.3 -0.28 L 0.3 -0.46 M -0.3 0.32 L 0.3 0.14" ' +
      'stroke="currentColor" stroke-width="0.24" stroke-linecap="round"/>' +
      '</g>'
    );
  }

  function accidentalMarkup(kind, x, y) {
    if (kind === 1) return sharpMarkup(x, y);
    if (kind === -1) return flatMarkup(x, y);
    return naturalMarkup(x, y);
  }

  /* ─────────────────────────────── паузы ─────────────────────────────── */

  function restMarkup(ticks, cx, staffTop) {
    const mid = staffTop + S * 2; // третья линейка
    const parts = [];

    if (ticks >= sc.WHOLE) {
      parts.push(
        '<rect x="' + (cx - S * 0.6) + '" y="' + (staffTop + S) + '" width="' + S * 1.2 +
          '" height="' + S * 0.46 + '" fill="currentColor"/>',
      );
    } else if (ticks >= sc.WHOLE / 2) {
      parts.push(
        '<rect x="' + (cx - S * 0.6) + '" y="' + (staffTop + S * 2 - S * 0.46) + '" width="' + S * 1.2 +
          '" height="' + S * 0.46 + '" fill="currentColor"/>',
      );
    } else if (ticks >= sc.WHOLE / 4) {
      parts.push(
        '<g transform="translate(' + cx + ' ' + mid + ') scale(' + S + ')">' +
          '<path d="M -0.34 -1.42 L 0.42 -0.46 L -0.32 0.42 C 0.22 0.5 0.56 0.96 0.4 1.5" ' +
          'fill="none" stroke="currentColor" stroke-width="0.26" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</g>',
      );
    } else {
      // Восьмая и шестнадцатая: наклонный ствол с одной или двумя точками-флажками
      const dots = ticks >= sc.WHOLE / 8 ? 1 : 2;
      let inner =
        '<path d="M 0.5 -1.0 L -0.28 1.2" fill="none" stroke="currentColor" ' +
        'stroke-width="0.2" stroke-linecap="round"/>';
      for (let i = 0; i < dots; i++) {
        const dy = -1.0 + i * 0.62;
        inner +=
          '<circle cx="' + (0.22 - i * 0.24) + '" cy="' + dy + '" r="0.22" fill="currentColor"/>' +
          '<path d="M ' + (0.22 - i * 0.24) + ' ' + dy + ' C ' + (0.62 - i * 0.24) + ' ' + (dy - 0.1) +
          ' ' + (0.7 - i * 0.24) + ' ' + (dy - 0.28) + ' ' + (0.62 - i * 0.24) + ' ' + (dy - 0.4) + '" ' +
          'fill="none" stroke="currentColor" stroke-width="0.16"/>';
      }
      parts.push('<g transform="translate(' + cx + ' ' + mid + ') scale(' + S + ')">' + inner + '</g>');
    }

    return parts.join('');
  }

  /* ─────────────────────────────── ноты ─────────────────────────────── */

  function headMarkup(cx, cy, open) {
    const rx = open ? HEAD_RX * 1.02 : HEAD_RX;
    return (
      '<ellipse class="head" cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + HEAD_RY + '" ' +
      'transform="rotate(-20 ' + cx + ' ' + cy + ')" ' +
      (open
        ? 'fill="none" stroke="currentColor" stroke-width="' + S * 0.19 + '"'
        : 'fill="currentColor"') +
      '/>'
    );
  }

  /** Флажок восьмой и шестнадцатой — когда нота стоит одна, без вязки. */
  function flagMarkup(x, y, dir, count) {
    let out = '';
    for (let i = 0; i < count; i++) {
      const y0 = y + dir * i * S * 0.78;
      out +=
        '<path d="M ' + x + ' ' + y0 + ' C ' + (x + S * 0.9) + ' ' + (y0 + dir * S * 0.5) + ' ' +
        (x + S * 1.0) + ' ' + (y0 + dir * S * 1.2) + ' ' + (x + S * 0.45) + ' ' + (y0 + dir * S * 1.85) +
        ' C ' + (x + S * 0.95) + ' ' + (y0 + dir * S * 1.1) + ' ' + (x + S * 0.6) + ' ' +
        (y0 + dir * S * 0.75) + ' ' + x + ' ' + (y0 + dir * S * 0.62) + ' Z" fill="currentColor"/>';
    }
    return out;
  }

  /**
   * С какой стороны головки стоит штиль.
   *
   * Правило нотации: штиль вверх пишется справа от головки, штиль вниз —
   * слева. Если перепутать, нота выглядит сломанной: штиль отходит от
   * головки в пустоту, особенно заметно у половинных с полым овалом.
   */
  function stemX(cx, dir) {
    return cx + (dir === -1 ? HEAD_RX - STEM_W / 2 : -HEAD_RX + STEM_W / 2);
  }

  function ledgerMarkup(clef, d, cx, staffTop) {
    const top = topLineD(clef);
    const bottom = top - 8;
    let out = '';

    for (let step = top + 2; step <= d; step += 2) {
      const y = yOfD(clef, step, staffTop);
      out += '<line class="ledger" x1="' + (cx - S * 0.95) + '" y1="' + y + '" x2="' + (cx + S * 0.95) +
        '" y2="' + y + '"/>';
    }
    for (let step = bottom - 2; step >= d; step -= 2) {
      const y = yOfD(clef, step, staffTop);
      out += '<line class="ledger" x1="' + (cx - S * 0.95) + '" y1="' + y + '" x2="' + (cx + S * 0.95) +
        '" y2="' + y + '"/>';
    }
    return out;
  }

  /*
    Группировка под вязку.

    Восьмые и шестнадцатые объединяются, пока не кончится доля: именно так
    в нотах видно сильную долю. Пауза, длинная нота или граница доли рвут
    группу. Одиночная нота вязки не получает — ей рисуется флажок.
  */
  function beamGroups(score, bar) {
    const unit = score.meter.unit === 8 ? 12 : sc.WHOLE / score.meter.unit;
    const groups = [];
    let group = [];
    let lastBeat = -1;

    bar.items.forEach(function (item) {
      const beat = Math.floor(item.startTick / unit);
      const beamable = item.ticks <= sc.WHOLE / 8 && !sc.isRest(item.event);

      if (!beamable || beat !== lastBeat) {
        if (group.length > 1) groups.push(group);
        group = [];
      }
      if (beamable) group.push(item);
      lastBeat = beat;
    });

    if (group.length > 1) groups.push(group);
    return groups;
  }

  /* ─────────────────────────────── отрисовка ─────────────────────────────── */

  /**
   * Рисует лист целиком и возвращает раскладку — она же используется для
   * попадания мышью и для подсветки при воспроизведении.
   */
  function draw(svg, score, state) {
    const width = svg.clientWidth || svg.parentNode.clientWidth || 900;
    const info = layout(score, width);
    const parts = [];
    const beamed = {}; // индексы нот, у которых вязка вместо флажка

    info.systems.forEach(function (system) {
      const staffTop = system.staffTop;

      /* ─── линейки ─── */
      // Последняя строка обрывается на заключительной черте: тянуть пустой
      // стан до края листа значило бы обещать продолжение, которого нет
      const lineEnd = system.index === info.systems.length - 1 ? system.endX : system.x1;
      let lines = '';
      for (let i = 0; i < 5; i++) {
        const y = staffTop + i * S;
        lines += '<line class="staff-line" x1="' + system.x0 + '" y1="' + y + '" x2="' + lineEnd +
          '" y2="' + y + '"/>';
      }
      parts.push('<g class="staff">' + lines + '</g>');

      /* ─── ключ ─── */
      parts.push(clefMarkup(score.clef, system.x0, staffTop));

      /* ─── знаки при ключе ─── */
      let kx = system.x0 + CLEF_W[score.clef];
      const order = score.fifths > 0 ? sc.SHARP_ORDER : sc.FLAT_ORDER;
      const count = Math.abs(score.fifths);
      for (let i = 0; i < count; i++) {
        const letter = order[i];
        const d = keySigStep(score.clef, letter, score.fifths > 0);
        parts.push(accidentalMarkup(score.fifths > 0 ? 1 : -1, kx + 5, yOfD(score.clef, d, staffTop)));
        kx += 10;
      }

      /* ─── размер такта ─── */
      if (system.meter) {
        const mx = system.contentX - METER_W / 2 - 2;
        parts.push(
          '<text class="meter" x="' + mx + '" y="' + (staffTop + S * 1.62) + '">' + score.meter.beats + '</text>' +
            '<text class="meter" x="' + mx + '" y="' + (staffTop + S * 3.72) + '">' + score.meter.unit + '</text>',
        );
      }

      /* ─── такты ─── */
      system.bars.forEach(function (bar, bi) {
        if (bi === 0) {
          parts.push(
            '<text class="bar-number" x="' + (bar.x + 1) + '" y="' + (staffTop - S * 0.9) + '">' +
              bar.number + '</text>',
          );
        }

        beamGroups(score, bar).forEach(function (group) {
          parts.push(beamMarkup(score, group, staffTop, beamed));
        });

        bar.items.forEach(function (item) {
          parts.push(eventMarkup(score, item, staffTop, state, beamed));
        });

        const bx = bar.x + bar.width;
        const isLastOfScore =
          system.index === info.systems.length - 1 && bi === system.bars.length - 1;
        if (isLastOfScore) {
          parts.push(
            '<line class="barline" x1="' + (bx - 5) + '" y1="' + staffTop + '" x2="' + (bx - 5) +
              '" y2="' + (staffTop + STAFF_H) + '"/>' +
              '<rect class="barline-final" x="' + (bx - 3) + '" y="' + staffTop + '" width="3.2" height="' +
              STAFF_H + '"/>',
          );
        } else {
          parts.push(
            '<line class="barline" x1="' + bx + '" y1="' + staffTop + '" x2="' + bx + '" y2="' +
              (staffTop + STAFF_H) + '"/>',
          );
        }
      });
    });

    /* ─── каретка: место, куда встанет следующая нота ─── */
    const caret = caretMarkup(score, info, state);
    if (caret) parts.push(caret);

    /* ─── призрачная нота под курсором ─── */
    if (state.hoverD !== null && state.hoverD !== undefined && !state.playing) {
      const spot = caretSpot(score, info, state);
      if (spot) {
        const y = yOfD(score.clef, state.hoverD, spot.staffTop);
        parts.push(
          '<g class="ghost">' + ledgerMarkup(score.clef, state.hoverD, spot.x, spot.staffTop) +
            headMarkup(spot.x, y, false) + '</g>',
        );
      }
    }

    svg.setAttribute('viewBox', '0 0 ' + info.width + ' ' + info.height);
    svg.setAttribute('width', info.width);
    svg.setAttribute('height', info.height);
    svg.innerHTML = parts.join('');

    return info;
  }

  /** Ступень, на которой рисуется знак при ключе. */
  function keySigStep(clef, letter, sharp) {
    // Стандартные позиции для скрипичного ключа, басовый — на две ступени ниже
    const trebleSharp = { 3: 38, 0: 35, 4: 39, 1: 36, 5: 33, 2: 37, 6: 34 };
    const trebleFlat = { 6: 34, 2: 37, 5: 33, 1: 36, 4: 32, 0: 35, 3: 31 };
    const base = sharp ? trebleSharp[letter] : trebleFlat[letter];
    return clef === 'bass' ? base - 14 : base;
  }

  /** Где сейчас стоит курсор ввода: после выделенной ноты или в конце листа. */
  function caretSpot(score, info, state) {
    const positions = info.positions;
    const keys = Object.keys(positions);
    if (!keys.length) {
      const system = info.systems[0];
      return { x: system.contentX + 18, staffTop: system.staffTop, system: system };
    }

    let item = null;
    if (state.selected !== null && state.selected !== undefined && positions[state.selected]) {
      item = positions[state.selected];
    } else {
      item = positions[keys[keys.length - 1]];
      for (let i = 0; i < keys.length; i++) {
        const candidate = positions[keys[i]];
        if (candidate.index > item.index) item = candidate;
      }
    }

    const system = info.systems[item.system];
    const x = Math.min(item.cx + item.width * 0.62, system.x1 - 12);
    return { x: x, staffTop: system.staffTop, system: system };
  }

  function caretMarkup(score, info, state) {
    const spot = caretSpot(score, info, state);
    if (!spot) return '';
    return (
      '<line class="caret" x1="' + spot.x + '" y1="' + (spot.staffTop - S * 0.9) + '" x2="' + spot.x +
      '" y2="' + (spot.staffTop + STAFF_H + S * 0.9) + '"/>'
    );
  }

  /** Вязка: общая для группы прямая, штили дотягиваются до неё. */
  function beamMarkup(score, group, staffTop, beamed) {
    const clef = score.clef;
    let sum = 0;
    group.forEach(function (item) {
      item.event.notes.forEach(function (note) {
        sum += note.d;
      });
    });
    const avg = sum / group.reduce(function (n, item) {
      return n + item.event.notes.length;
    }, 0);

    const dir = avg < topLineD(clef) - 4 ? -1 : 1; // выше середины — штиль вниз
    const edge = [];

    group.forEach(function (item) {
      const ds = item.event.notes.map(function (note) {
        return note.d;
      });
      // Штиль отсчитывается от дальней головки аккорда: вверх — от верхней,
      // вниз — от нижней, иначе вязка перечеркнёт часть нот
      const extreme = dir === -1 ? Math.max.apply(null, ds) : Math.min.apply(null, ds);
      edge.push(yOfD(clef, extreme, staffTop) + dir * STEM_LEN);
      beamed[item.index] = { dir: dir };
    });

    // Прямая вязка: линия по самому дальнему штилю. Наклонная красивее,
    // но требует пересчёта каждого штиля под угол — при коротких группах
    // разницы почти не видно.
    const y = dir === -1 ? Math.min.apply(null, edge) : Math.max.apply(null, edge);
    const x0 = stemX(group[0].cx, dir) - STEM_W / 2;
    const x1 = stemX(group[group.length - 1].cx, dir) + STEM_W / 2;

    let out = '<rect class="beam" x="' + x0 + '" y="' + (y - (dir === -1 ? 0 : S * 0.42)) + '" width="' +
      (x1 - x0) + '" height="' + S * 0.42 + '"/>';

    group.forEach(function (item) {
      beamed[item.index].y = y;
    });

    /* Вторая вязка — только там, где рядом стоят шестнадцатые. */
    const second = S * 0.62;
    group.forEach(function (item, i) {
      if (item.ticks > sc.WHOLE / 16) return;
      const prev = group[i - 1];
      const next = group[i + 1];
      const x = stemX(item.cx, dir);
      let from = x;
      let to = x + S * 0.9;

      if (next && next.ticks <= sc.WHOLE / 16) {
        to = stemX(next.cx, dir);
      } else if (prev && prev.ticks <= sc.WHOLE / 16) {
        return; // уже нарисовано соседом слева
      } else {
        from = x - S * 0.9;
        to = x;
      }

      const yy = dir === -1 ? y + second : y - second;
      out += '<rect class="beam" x="' + from + '" y="' + (yy - (dir === -1 ? 0 : S * 0.42)) + '" width="' +
        (to - from) + '" height="' + S * 0.42 + '"/>';
    });

    return out;
  }

  /** Одно событие: пауза или аккорд с головками, штилем, знаками и точкой. */
  function eventMarkup(score, item, staffTop, state, beamed) {
    const clef = score.clef;
    const event = item.event;
    const classes = ['event'];
    if (state.selected === item.index) classes.push('is-selected');
    if (state.playing === item.index) classes.push('is-playing');

    const open = item.ticks >= sc.WHOLE / 2;
    let out = '';

    if (sc.isRest(event)) {
      out += restMarkup(item.ticks, item.cx, staffTop);
      if (event.dot) {
        out += '<circle class="dot" cx="' + (item.cx + S * 0.95) + '" cy="' + (staffTop + S * 1.5) +
          '" r="' + S * 0.16 + '"/>';
      }
    } else {
      const ds = event.notes.map(function (note) {
        return note.d;
      });
      const beam = beamed[item.index];
      const avg = ds.reduce(function (a, b) {
        return a + b;
      }, 0) / ds.length;
      const dir = beam ? beam.dir : avg < topLineD(clef) - 4 ? -1 : 1;

      event.notes.forEach(function (note) {
        const y = yOfD(clef, note.d, staffTop);
        out += ledgerMarkup(clef, note.d, item.cx, staffTop);
        out += headMarkup(item.cx, y, open);

        if (note.acc !== null && note.acc !== undefined) {
          out += accidentalMarkup(note.acc, item.cx - HEAD_RX - S * 0.62, y);
        }
        if (event.dot) {
          // Нота на линейке — точка уходит в промежуток выше
          const onLine = ((topLineD(clef) - note.d) % 2 + 2) % 2 === 0;
          out += '<circle class="dot" cx="' + (item.cx + HEAD_RX + S * 0.5) + '" cy="' +
            (onLine ? y - S * 0.5 : y) + '" r="' + S * 0.16 + '"/>';
        }
      });

      /* Штиль: от крайней головки вверх или вниз. Целая нота его не имеет. */
      if (item.ticks < sc.WHOLE) {
        const topD = Math.max.apply(null, ds);
        const bottomD = Math.min.apply(null, ds);
        const fromY = yOfD(clef, dir === -1 ? bottomD : topD, staffTop);
        const toY = beam ? beam.y : yOfD(clef, dir === -1 ? topD : bottomD, staffTop) + dir * STEM_LEN;
        const x = stemX(item.cx, dir);

        out += '<line class="stem" x1="' + x + '" y1="' + fromY + '" x2="' + x + '" y2="' + toY + '"/>';

        if (!beam && item.ticks <= sc.WHOLE / 8) {
          const flags = item.ticks <= sc.WHOLE / 16 ? 2 : 1;
          out += flagMarkup(x, toY, -dir, flags);
        }
      }
    }

    /*
      Область захвата — только вокруг головок, а не весь слот события.

      Слот занимает всю высоту стана, и уже со второй ноты кликнуть по
      стану становилось некуда: попадание всегда доставалось соседней
      ноте, и вместо новой ноты человек получал выделение старой.
    */
    let hitTop = staffTop + S * 1.2;
    let hitBottom = staffTop + S * 2.8;
    if (!sc.isRest(event)) {
      const ys = event.notes.map(function (note) {
        return yOfD(clef, note.d, staffTop);
      });
      hitTop = Math.min.apply(null, ys) - S * 0.7;
      hitBottom = Math.max.apply(null, ys) + S * 0.7;
    }

    return (
      '<g class="' + classes.join(' ') + '" data-index="' + item.index + '" tabindex="-1">' +
      '<rect class="event__hit" x="' + (item.cx - HEAD_RX * 1.6) + '" y="' + hitTop + '" width="' +
      HEAD_RX * 3.2 + '" height="' + (hitBottom - hitTop) + '"/>' + out + '</g>'
    );
  }

  /* ────────────────────────────── экспорт ────────────────────────────── */

  ns.render = {
    S: S,
    STAFF_H: STAFF_H,
    draw: draw,
    layout: layout,
    yOfD: yOfD,
    dOfY: dOfY,
    topLineD: topLineD,
  };
})(window.Partitura);
