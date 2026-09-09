/** Открытие документа и отрисовка страниц через pdf.js. */

import * as pdfjs from '../vendor/pdf.min.js';
import { buildBlocks, sampleColors } from './blocks.js';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('../vendor/pdf.worker.min.js', import.meta.url).href;

/* Крупнее, чем нужно для показа: на мелком растре подложка из картинки
   пересчитывается со сглаживанием и уводит цвет. */
const SAMPLE_SCALE = 2.5;

export async function openPdf(bytes) {
  /* pdf.js забирает буфер себе, поэтому исходник для экспорта храним отдельно. */
  const task = pdfjs.getDocument({ data: bytes.slice(0), isEvalSupported: false });
  const pdf = await task.promise;

  const pages = [];
  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const view = page.getViewport({ scale: 1 });
    const rotation = ((page.rotate % 360) + 360) % 360;

    let blocks = [];
    let empty = true;
    if (rotation === 0) {
      const text = await page.getTextContent();
      blocks = buildBlocks(text);
      empty = blocks.length === 0;
      if (blocks.length) {
        await paintColors(page, view, blocks);
        refineFonts(page, blocks);
      }
    }

    pages.push({
      number: i,
      width: view.width,
      height: view.height,
      offsetX: view.viewBox[0],
      offsetY: view.viewBox[1],
      rotation,
      editable: rotation === 0,
      empty,
      blocks: blocks.map((b) => ({
        ...b,
        page: i,
        originalText: b.text,
        ox: b.x,
        otop: b.top,
        ow: b.w,
        oh: b.h,
        autoFit: false,
        created: false,
        deleted: false,
      })),
    });
  }

  return { pdf, pages };
}

/** Один растр страницы на все блоки: снимать цвет по одному было бы вдесятеро дольше. */
async function paintColors(page, view, blocks) {
  const viewport = page.getViewport({ scale: SAMPLE_SCALE });
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport, background: 'rgba(255,255,255,1)' }).promise;

  for (const block of blocks) {
    const left = (block.x - view.viewBox[0]) * SAMPLE_SCALE;
    const topPx = (view.viewBox[3] - block.top) * SAMPLE_SCALE;
    const colors = sampleColors(ctx, {
      x: left,
      y: topPx,
      w: block.w * SAMPLE_SCALE,
      h: block.h * SAMPLE_SCALE,
    });
    block.color = colors.fg;
    block.bg = colors.bg;
  }
}

/**
 * Настоящее имя шрифта известно только после отрисовки: в текстовом слое стоит
 * внутренний идентификатор вроде g_d0_f1, а «PTSans-Bold» лежит в commonObjs.
 */
function refineFonts(page, blocks) {
  const names = new Map();
  for (const block of blocks) {
    const id = block.sourceFont;
    if (!id) continue;
    if (!names.has(id)) {
      let name = '';
      try {
        name = page.commonObjs.get(id)?.name || '';
      } catch {
        name = '';
      }
      names.set(id, name);
    }
    const name = names.get(id);
    if (!name) continue;

    block.bold = /bold|black|heavy|semib|demib/i.test(name);
    block.italic = /italic|oblique/i.test(name);
    if (/mono|courier|consol/i.test(name)) block.family = 'mono';
    else if (/serif|times|georgia|roman|garamond|minion|book/i.test(name)) block.family = 'serif';
  }
}

export async function renderPage(pdf, number, scale, canvas) {
  const page = await pdf.getPage(number);
  const viewport = page.getViewport({ scale });
  const ratio = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.ceil(viewport.width * ratio);
  canvas.height = Math.ceil(viewport.height * ratio);
  canvas.style.width = `${Math.ceil(viewport.width)}px`;
  canvas.style.height = `${Math.ceil(viewport.height)}px`;

  const ctx = canvas.getContext('2d');
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, viewport.width, viewport.height);
  await page.render({ canvasContext: ctx, viewport }).promise;

  return { width: viewport.width, height: viewport.height };
}
