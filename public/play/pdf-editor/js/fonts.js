/**
 * Реестр шрифтов для правки.
 *
 * Один и тот же файл используется дважды: браузер рисует им текст на экране,
 * pdf-lib вшивает его в готовый PDF. Иначе строки на экране и в файле
 * разъезжались бы — ширина букв у разных гарнитур разная.
 */

const BASE = new URL('../fonts/', import.meta.url).href;

const FILES = {
  'sans:0:0': 'sans-regular.ttf',
  'sans:1:0': 'sans-bold.ttf',
  'sans:0:1': 'sans-italic.ttf',
  'sans:1:1': 'sans-bolditalic.ttf',
  'serif:0:0': 'serif-regular.ttf',
  'serif:1:0': 'serif-bold.ttf',
  'serif:0:1': 'serif-italic.ttf',
  'serif:1:1': 'serif-bold.ttf',
  'mono:0:0': 'mono-regular.ttf',
  'mono:1:0': 'mono-regular.ttf',
  'mono:0:1': 'mono-regular.ttf',
  'mono:1:1': 'mono-regular.ttf',
};

export const FAMILIES = [
  { id: 'sans', title: 'Без засечек' },
  { id: 'serif', title: 'С засечками' },
  { id: 'mono', title: 'Моноширинный' },
];

let fontkitPromise = null;

/* Только UMD-сборка fontkit самодостаточна: у ESM-варианта остались внешние зависимости. */
export function loadFontkit() {
  if (window.fontkit) return Promise.resolve(window.fontkit);
  if (!fontkitPromise) {
    fontkitPromise = new Promise((resolve, reject) => {
      const tag = document.createElement('script');
      tag.src = new URL('../vendor/fontkit.umd.min.js', import.meta.url).href;
      tag.onload = () => resolve(window.fontkit);
      tag.onerror = () => reject(new Error('Не загрузилась библиотека шрифтов'));
      document.head.append(tag);
    });
  }
  return fontkitPromise;
}

const cache = new Map();

function key(family, bold, italic) {
  const fam = FILES[`${family}:0:0`] ? family : 'sans';
  return `${fam}:${bold ? 1 : 0}:${italic ? 1 : 0}`;
}

/**
 * Гарнитура: байты для вшивания, метрики для переноса строк и имя семейства
 * для CSS. Файл тянется один раз и живёт до перезагрузки страницы.
 */
export async function face(family, bold, italic) {
  const id = key(family, bold, italic);
  if (cache.has(id)) return cache.get(id);

  const loading = (async () => {
    const bytes = await fetch(BASE + FILES[id]).then((r) => {
      if (!r.ok) throw new Error(`Шрифт не загрузился: ${FILES[id]}`);
      return r.arrayBuffer();
    });

    const kit = await loadFontkit();
    const parsed = kit.create(new Uint8Array(bytes));
    const cssName = `pdfed-${id.replace(/:/g, '-')}`;

    const web = new FontFace(cssName, bytes.slice(0));
    await web.load();
    document.fonts.add(web);

    const upm = parsed.unitsPerEm;

    return {
      id,
      bytes,
      cssName,
      /** Высота прописной над базовой линией — по ней ставится первая строка. */
      ascent: parsed.ascent / upm,
      descent: Math.abs(parsed.descent) / upm,
      width(text, size) {
        if (!text) return 0;
        return (parsed.layout(text).advanceWidth / upm) * size;
      },
    };
  })();

  cache.set(id, loading);
  return loading;
}

export function guessBold(fontName = '') {
  return /bold|black|heavy|semib|demib|[-_,]700|[-_,]800|[-_,]900/i.test(fontName);
}

export function guessItalic(fontName = '') {
  return /italic|oblique/i.test(fontName);
}
