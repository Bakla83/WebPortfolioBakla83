/**
 * Перенос строк. Считает ровно то же, что потом нарисует pdf-lib: одна
 * гарнитура, одни метрики, поэтому предпросмотр и файл совпадают построчно.
 */

const SPACE = /\s+/;

/** Доля кегля от верха строки до базовой линии — одна и та же на экране и в файле. */
export const ASCENT = 0.82;

export function wrap(text, face, size, maxWidth) {
  const out = [];
  const width = Math.max(maxWidth, size * 0.6);

  for (const paragraph of String(text).split('\n')) {
    const words = paragraph.split(SPACE).filter((w) => w.length);
    if (!words.length) {
      out.push('');
      continue;
    }

    let line = '';
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (face.width(candidate, size) <= width || !line) {
        /* Слово длиннее строки рвём посимвольно, иначе оно уедет за поле. */
        if (!line && face.width(word, size) > width) {
          let chunk = '';
          for (const ch of word) {
            if (chunk && face.width(chunk + ch, size) > width) {
              out.push(chunk);
              chunk = ch;
            } else {
              chunk += ch;
            }
          }
          line = chunk;
          continue;
        }
        line = candidate;
      } else {
        out.push(line);
        line = word;
      }
    }
    out.push(line);
  }

  return out.length ? out : [''];
}

/** Высота блока при данном кегле: по числу строк, а не по замеру в браузере. */
export function blockHeight(lines, lineHeight, size) {
  return (lines.length - 1) * lineHeight + size * 1.02;
}

/**
 * Кегль, при котором текст влезает в исходную высоту. Нужен, когда правка
 * длиннее оригинала, а раздвигать вёрстку нельзя — например, в таблице.
 */
export function fitSize(text, face, startSize, maxWidth, maxHeight, ratio) {
  let size = startSize;
  for (let i = 0; i < 40 && size > 4; i += 1) {
    const lines = wrap(text, face, size, maxWidth);
    if (blockHeight(lines, size * ratio, size) <= maxHeight + 0.5) return size;
    size -= Math.max(0.25, size * 0.04);
  }
  return Math.max(size, 4);
}

export function alignOffset(align, lineWidth, boxWidth) {
  if (align === 'center') return (boxWidth - lineWidth) / 2;
  if (align === 'right') return boxWidth - lineWidth;
  return 0;
}
