/** Сборка готового PDF: правки поверх исходного файла. */

import { face, loadFontkit } from './fonts.js';
import { ASCENT, alignOffset, wrap } from './layout.js';
import { isDirty, state } from './store.js';

const BLEED = 0.4;

function toRgb(rgb, c) {
  return rgb((c[0] || 0) / 255, (c[1] || 0) / 255, (c[2] || 0) / 255);
}

export async function buildPdf() {
  const { PDFDocument, rgb } = await import('../vendor/pdf-lib.esm.min.js');
  const kit = await loadFontkit();

  const out = await PDFDocument.load(state.bytes, { updateMetadata: false });
  out.registerFontkit(kit);

  const embedded = new Map();
  async function embed(block) {
    const f = await face(block.family, block.bold, block.italic);
    if (!embedded.has(f.id)) {
      embedded.set(f.id, await out.embedFont(new Uint8Array(f.bytes), { subset: true }));
    }
    return { metrics: f, pdfFont: embedded.get(f.id) };
  }

  let changed = 0;

  for (const page of state.pages) {
    const edited = page.blocks.filter(isDirty);
    if (!edited.length) continue;
    const target = out.getPage(page.number - 1);

    /* Сначала закрашиваем все исходные места, иначе новый текст одного блока
       мог бы уйти под заливку соседнего. */
    for (const block of edited) {
      if (block.created) continue;
      target.drawRectangle({
        x: block.ox - BLEED,
        y: block.otop - block.oh - BLEED,
        width: block.ow + BLEED * 2,
        height: block.oh + BLEED * 2,
        color: toRgb(rgb, block.bg || [255, 255, 255]),
      });
    }

    for (const block of edited) {
      if (block.deleted || !block.text.trim()) continue;
      const { metrics, pdfFont } = await embed(block);
      const lines = wrap(block.text, metrics, block.size, block.w);
      let baseline = block.top - block.size * ASCENT;

      for (const line of lines) {
        if (line) {
          const dx = alignOffset(block.align, metrics.width(line, block.size), block.w);
          target.drawText(line, {
            x: block.x + dx,
            y: baseline,
            size: block.size,
            font: pdfFont,
            color: toRgb(rgb, block.color || [0, 0, 0]),
          });
        }
        baseline -= block.lineHeight;
      }
      changed += 1;
    }
  }

  const bytes = await out.save({ useObjectStreams: false });
  return { bytes, changed };
}

export function download(bytes, name) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
