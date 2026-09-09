/**
 * Сборка абзацев из текстового слоя PDF.
 *
 * В PDF нет ни абзацев, ни даже строк: есть россыпь кусочков текста с
 * координатами. Чтобы правка вела себя как в текстовом редакторе, кусочки
 * сначала склеиваются в строки по базовой линии, а строки — в блоки по
 * межстрочному расстоянию и общей колонке.
 */

import { guessBold, guessItalic } from './fonts.js';

const LINE_TOLERANCE = 0.4; // доля кегля
const SPACE_GAP = 0.22;
const PARAGRAPH_LEADING = 1.55;
const SIZE_JUMP = 0.12;
const OVERLAP = 0.25;
const COLUMN_GAP = 2;

let counter = 0;

export function nextId() {
  counter += 1;
  return `b${counter}`;
}

/** pdf.js отдаёт только «sans-serif / serif / monospace» — большего в слое нет. */
function familyFromStyles(styles, fontName) {
  const css = styles?.[fontName]?.fontFamily || '';
  if (/mono/i.test(css)) return 'mono';
  if (/(^|[^-])serif/i.test(css)) return 'serif';
  return 'sans';
}

function items(textContent) {
  const out = [];
  for (const item of textContent.items) {
    if (typeof item.str !== 'string' || !item.str.length) continue;
    const t = item.transform;
    const size = Math.hypot(t[2], t[3]) || Math.abs(t[3]) || item.height || 0;
    if (size <= 0) continue;
    /* Повёрнутый или зеркальный текст в абзацы не собираем: правка сместит его. */
    if (Math.abs(t[1]) > 0.01 || Math.abs(t[2]) > 0.01) continue;
    out.push({
      str: item.str,
      x: t[4],
      y: t[5],
      w: item.width || 0,
      size,
      font: item.fontName || '',
    });
  }
  return out;
}

function toLines(list) {
  const sorted = [...list].sort((a, b) => b.y - a.y || a.x - b.x);
  const rows = [];

  for (const item of sorted) {
    const row = rows.find(
      (l) => Math.abs(l.y - item.y) <= Math.max(l.size, item.size) * LINE_TOLERANCE,
    );
    if (row) {
      row.parts.push(item);
      row.size = Math.max(row.size, item.size);
    } else {
      rows.push({ y: item.y, size: item.size, parts: [item] });
    }
  }

  const lines = [];
  for (const row of rows) {
    row.parts.sort((a, b) => a.x - b.x);

    /* Одна базовая линия — ещё не одна строка: колонки резюме и ячейки таблицы
       стоят на общей высоте. Широкий разрыв делит строку на самостоятельные
       куски, иначе левая колонка склеилась бы с правой в один абзац. */
    let segment = [];
    for (const part of row.parts) {
      const prev = segment[segment.length - 1];
      const gap = prev ? part.x - (prev.x + prev.w) : 0;
      if (prev && gap > Math.max(part.size * COLUMN_GAP, 20)) {
        lines.push(makeLine(row, segment));
        segment = [];
      }
      segment.push(part);
    }
    if (segment.length) lines.push(makeLine(row, segment));
  }

  return lines.filter((l) => l.text.trim().length).sort((a, b) => b.y - a.y || a.x - b.x);
}

function makeLine(row, parts) {
  let text = '';
  let prev = null;
  for (const part of parts) {
    if (prev) {
      const gap = part.x - (prev.x + prev.w);
      if (gap > part.size * SPACE_GAP && !/\s$/.test(text) && !/^\s/.test(part.str)) text += ' ';
    }
    text += part.str;
    prev = part;
  }

  /* Базовая линия своя у каждого куска: строки соседних колонок попадают в одну
     полосу с разбросом в пару пунктов, и общая высота увела бы рамку абзаца
     вверх — заливка перестала бы накрывать хвосты букв. */
  const baselines = parts.map((p) => p.y).sort((a, b) => a - b);

  return {
    y: baselines[Math.floor(baselines.length / 2)],
    size: Math.max(...parts.map((p) => p.size)),
    parts,
    text: text.replace(/\s+$/, ''),
    x: parts[0].x,
    right: Math.max(...parts.map((p) => p.x + p.w)),
    font: parts[0].font,
  };
}

function overlapRatio(a, b) {
  const left = Math.max(a.x, b.x);
  const right = Math.min(a.right, b.right);
  const shared = right - left;
  if (shared <= 0) return 0;
  return shared / Math.min(a.right - a.x || 1, b.right - b.x || 1);
}

function sameBlock(prev, line, leading) {
  const gap = prev.y - line.y;
  if (gap <= 0) return false;
  if (gap > Math.max(prev.size, line.size) * PARAGRAPH_LEADING) return false;
  if (leading && gap > leading * 1.45) return false;
  if (Math.abs(prev.size - line.size) / Math.max(prev.size, line.size) > SIZE_JUMP) return false;
  if (overlapRatio(prev, line) < OVERLAP) return false;
  return true;
}

/**
 * Строки абзаца склеиваются в сплошной текст: в PDF перенос — это просто новая
 * строка с координатами, и если оставить его жёстким, правка не будет перетекать
 * по ширине блока. Перенос по дефису собирается обратно в слово.
 */
function joinLines(lines) {
  let text = '';
  for (const line of lines) {
    if (!text) {
      text = line.text;
      continue;
    }
    const hyphen = /[-\u2010\u2011]$/.test(text) && /^[a-z\u0430-\u044f\u0451]/.test(line.text);
    text = hyphen ? text.slice(0, -1) + line.text : `${text} ${line.text}`;
  }
  return text;
}

/** Абзацы страницы в пользовательских координатах PDF: y растёт снизу вверх. */
export function buildBlocks(textContent) {
  const styles = textContent.styles || {};
  const lines = toLines(items(textContent));
  const blocks = [];

  /* Абзац продолжается не обязательно следующей строкой списка: в двухколоночной
     вёрстке между двумя строками одной колонки стоит строка соседней. Поэтому
     строка ищет себе абзац среди всех открытых, а не смотрит только назад. */
  for (const line of lines) {
    let host = null;
    for (let i = blocks.length - 1; i >= 0 && !host; i -= 1) {
      const candidate = blocks[i];
      const last = candidate.lines[candidate.lines.length - 1];
      if (last.y - line.y > Math.max(last.size, line.size) * PARAGRAPH_LEADING) break;
      if (sameBlock(last, line, candidate.leading)) host = candidate;
    }

    if (host) {
      const last = host.lines[host.lines.length - 1];
      host.leading = host.leading || last.y - line.y;
      host.lines.push(line);
    } else {
      blocks.push({ lines: [line], leading: 0 });
    }
  }

  return blocks.map((group) => {
    const ls = group.lines;
    const sizes = [...ls.map((l) => l.size)].sort((a, b) => a - b);
    const size = sizes[Math.floor(sizes.length / 2)];

    const gaps = [];
    for (let i = 1; i < ls.length; i += 1) gaps.push(ls[i - 1].y - ls[i].y);
    gaps.sort((a, b) => a - b);
    const lineHeight = gaps.length ? gaps[Math.floor(gaps.length / 2)] : size * 1.2;

    const x = Math.min(...ls.map((l) => l.x));
    const right = Math.max(...ls.map((l) => l.right));
    const top = ls[0].y + size * 0.82;
    const bottom = ls[ls.length - 1].y - size * 0.24;
    const font = ls[0].font;

    return {
      id: nextId(),
      text: joinLines(ls),
      x,
      top,
      w: Math.max(right - x, size),
      h: Math.max(top - bottom, size),
      size,
      lineHeight: Math.max(lineHeight, size),
      family: familyFromStyles(styles, font),
      bold: guessBold(font),
      italic: guessItalic(font),
      align: 'left',
      sourceFont: font,
      srcLines: ls.map((l) => l.text),
    };
  });
}

/* --- цвета ------------------------------------------------------------- */

const INK_GAP = 60;

function distance(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
}

/**
 * Цвет текста и подложки снимаются с уже нарисованной страницы: в текстовом
 * слое PDF цвета нет, а угадывать «чёрным по белому» — верный способ испортить
 * документ со светлой печатью на плашке.
 *
 * Считаются точные цвета пикселей, без огрубления и усреднения. Ровная заливка
 * даёт тысячи одинаковых значений и уверенно побеждает; любое усреднение по
 * диапазону тянуло бы тон в сторону сглаженных краёв букв — на тёмной плашке
 * заплатка получалась заметно светлее фона.
 */
export function sampleColors(ctx, rect) {
  const fallback = { fg: [0, 0, 0], bg: [255, 255, 255] };

  /* Поля вокруг блока: у крупного заголовка буквы занимают больше половины
     рамки, и без запаса самым частым цветом оказались бы чернила. */
  const pad = Math.max(2, rect.h * 0.3);
  const x = Math.max(0, Math.floor(rect.x - pad));
  const y = Math.max(0, Math.floor(rect.y - pad));
  const w = Math.min(Math.ceil(rect.w + pad * 2), ctx.canvas.width - x);
  const h = Math.min(Math.ceil(rect.h + pad * 2), ctx.canvas.height - y);
  if (w < 2 || h < 2) return fallback;

  let data;
  try {
    data = ctx.getImageData(x, y, w, h).data;
  } catch {
    return fallback;
  }

  const counts = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const key = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const rgb = (key) => [(key >> 16) & 255, (key >> 8) & 255, key & 255];

  let bgKey = -1;
  let bgCount = 0;
  for (const [key, n] of counts) {
    if (n > bgCount) {
      bgCount = n;
      bgKey = key;
    }
  }
  if (bgKey < 0) return fallback;

  /* Точный самый частый цвет годится для ровной заливки, но не для подложки,
     пришедшей картинкой: там сжатие размазывает тон, и одно значение случайно.
     Берём медиану по каналам среди пикселей рядом с ним — на ровной заливке
     ответ тот же, на шумной картинке ближе к тому, что видит глаз. */
  const near = { r: [], g: [], b: [] };
  const seed = rgb(bgKey);
  for (let i = 0; i < data.length; i += 4) {
    const px = [data[i], data[i + 1], data[i + 2]];
    if (distance(px, seed) > 20) continue;
    near.r.push(px[0]);
    near.g.push(px[1]);
    near.b.push(px[2]);
  }
  const median = (list) => {
    list.sort((a, b) => a - b);
    return list[Math.floor(list.length / 2)];
  };
  const bg = near.r.length ? [median(near.r), median(near.g), median(near.b)] : seed;

  /* Чернила — самый далёкий от подложки цвет среди встречающихся не единично:
     у сглаженного текста полутонов по краям больше, чем сплошной заливки
     буквы, и по одной частоте победил бы полутон. */
  let common = 0;
  for (const [key, n] of counts) {
    if (distance(rgb(key), bg) < INK_GAP) continue;
    if (n > common) common = n;
  }

  let ink = null;
  let farthest = INK_GAP;
  for (const [key, n] of counts) {
    if (n < common * 0.1) continue;
    const px = rgb(key);
    const d = distance(px, bg);
    if (d > farthest) {
      farthest = d;
      ink = px;
    }
  }

  return { fg: ink || fallback.fg, bg };
}
