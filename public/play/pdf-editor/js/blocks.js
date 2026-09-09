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
  const lines = [];

  for (const item of sorted) {
    const line = lines.find(
      (l) => Math.abs(l.y - item.y) <= Math.max(l.size, item.size) * LINE_TOLERANCE,
    );
    if (line) {
      line.parts.push(item);
      line.size = Math.max(line.size, item.size);
    } else {
      lines.push({ y: item.y, size: item.size, parts: [item] });
    }
  }

  for (const line of lines) {
    line.parts.sort((a, b) => a.x - b.x);

    let text = '';
    let prev = null;
    for (const part of line.parts) {
      if (prev) {
        const gap = part.x - (prev.x + prev.w);
        if (gap > part.size * SPACE_GAP && !/\s$/.test(text) && !/^\s/.test(part.str)) text += ' ';
      }
      text += part.str;
      prev = part;
    }

    line.text = text.replace(/\s+$/, '');
    line.x = line.parts[0].x;
    line.right = Math.max(...line.parts.map((p) => p.x + p.w));
    line.font = line.parts[0].font;
  }

  return lines.filter((l) => l.text.trim().length).sort((a, b) => b.y - a.y);
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
  let current = null;
  let leading = 0;

  for (const line of lines) {
    if (current && sameBlock(current.lines[current.lines.length - 1], line, leading)) {
      const prev = current.lines[current.lines.length - 1];
      leading = leading || prev.y - line.y;
      current.lines.push(line);
    } else {
      if (current) blocks.push(current);
      current = { lines: [line] };
      leading = 0;
    }
  }
  if (current) blocks.push(current);

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

function quantize(r, g, b) {
  return ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
}

function distance(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
}

/**
 * Цвет текста и подложки снимаются с уже нарисованной страницы: в текстовом
 * слое PDF цвета нет, а угадывать «чёрным по белому» — верный способ испортить
 * документ со светлой печатью на плашке.
 *
 * Пиксели раскладываются по грубым вёдрам, но наружу отдаётся среднее реальных
 * значений внутри ведра, а не его округлённый центр: заплатка поверх старого
 * текста должна попадать в тон подложки точно, иначе она видна.
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

  const buckets = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const key = quantize(data[i], data[i + 1], data[i + 2]);
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { n: 0, r: 0, g: 0, b: 0 };
      buckets.set(key, bucket);
    }
    bucket.n += 1;
    bucket.r += data[i];
    bucket.g += data[i + 1];
    bucket.b += data[i + 2];
  }

  const mean = (bucket) => [
    Math.round(bucket.r / bucket.n),
    Math.round(bucket.g / bucket.n),
    Math.round(bucket.b / bucket.n),
  ];

  let widest = null;
  for (const bucket of buckets.values()) if (!widest || bucket.n > widest.n) widest = bucket;
  if (!widest) return fallback;
  const bg = mean(widest);

  /* Чернила — самый далёкий от подложки цвет среди тех, что встречаются не
     единично: у мелкого текста сглаженных краёв больше, чем сплошной заливки
     буквы, и по частоте победил бы полутон. */
  let common = 0;
  for (const bucket of buckets.values()) {
    if (distance(mean(bucket), bg) < INK_GAP) continue;
    if (bucket.n > common) common = bucket.n;
  }

  let ink = null;
  let farthest = INK_GAP;
  for (const bucket of buckets.values()) {
    const px = mean(bucket);
    const d = distance(px, bg);
    if (d < INK_GAP || bucket.n < common * 0.12) continue;
    if (d > farthest) {
      farthest = d;
      ink = px;
    }
  }

  return { fg: ink || fallback.fg, bg };
}
