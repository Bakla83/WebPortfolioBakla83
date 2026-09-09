/** Сборка интерфейса: панели, горячие клавиши, сохранение файла. */

import { openPdf } from './doc.js';
import { addTextBox, applyChange, focusBlock, mount, pointToPdf, showPage, sync } from './editor.js';
import { buildPdf, download } from './exporter.js';
import { FAMILIES } from './fonts.js';
import {
  canRedo,
  canUndo,
  clearSaved,
  currentPage,
  emit,
  findBlock,
  hasEdits,
  isDirty,
  loadSaved,
  onChange,
  redo,
  resetHistory,
  save,
  state,
  takeSnapshot,
  pushSnapshot,
  undo,
} from './store.js';

const $ = (id) => document.getElementById(id);

const ui = {};
let placing = false;

function init() {
  for (const el of document.querySelectorAll('[id]')) ui[el.id] = el;

  mount({ stage: ui.stage, canvas: ui.canvas, layer: ui.layer }, { onSelect: showInspector });

  ui.file.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) load(file);
    e.target.value = '';
  });
  ui.pick.addEventListener('click', () => ui.file.click());
  ui.pickEmpty.addEventListener('click', () => ui.file.click());
  ui.pickSample.addEventListener('click', loadSample);

  document.addEventListener('dragover', (e) => {
    e.preventDefault();
    ui.drop.hidden = false;
  });
  ui.drop.addEventListener('dragleave', () => {
    ui.drop.hidden = true;
  });
  document.addEventListener('drop', (e) => {
    e.preventDefault();
    ui.drop.hidden = true;
    const file = [...(e.dataTransfer?.files || [])].find((f) => /\.pdf$/i.test(f.name));
    if (file) load(file);
  });

  ui.prev.addEventListener('click', () => goto(state.page - 1));
  ui.next.addEventListener('click', () => goto(state.page + 1));
  ui.zoomIn.addEventListener('click', () => setZoom(state.zoom * 1.2));
  ui.zoomOut.addEventListener('click', () => setZoom(state.zoom / 1.2));
  ui.zoomFit.addEventListener('click', fitWidth);
  ui.undo.addEventListener('click', () => step(undo));
  ui.redo.addEventListener('click', () => step(redo));
  ui.addText.addEventListener('click', startPlacing);
  ui.saveFile.addEventListener('click', exportPdf);
  ui.resetAll.addEventListener('click', resetAll);
  ui.pushDown.addEventListener('change', () => {
    state.pushDown = ui.pushDown.checked;
  });

  ui.search.addEventListener('input', runSearch);
  ui.layer.addEventListener('click', onStageClick, true);

  buildInspector();
  document.addEventListener('keydown', onShortcut);
  window.addEventListener('beforeunload', (e) => {
    if (!hasEdits()) return;
    save();
    e.preventDefault();
    e.returnValue = '';
  });

  onChange(refreshChrome);
  offerRestore();
}

/* --- открытие ------------------------------------------------------------ */

async function load(file) {
  busy(true, 'Читаю документ…');
  try {
    const bytes = await file.arrayBuffer();
    await start(file.name, bytes);
    await clearSaved();
    await save();
  } catch (error) {
    alert(`Не удалось открыть файл.\n${error.message || error}`);
  } finally {
    busy(false);
  }
}

/** Пример нужен, чтобы приложение можно было попробовать, не имея своего PDF под рукой. */
async function loadSample() {
  busy(true, 'Открываю пример…');
  try {
    const response = await fetch(new URL('sample.pdf', document.baseURI));
    if (!response.ok) throw new Error('файл примера недоступен');
    await start('пример-договора.pdf', await response.arrayBuffer());
    await clearSaved();
    await save();
  } catch (error) {
    alert(`Не удалось открыть пример.
${error.message || error}`);
  } finally {
    busy(false);
  }
}

async function start(name, bytes, savedPages) {
  const { pdf, pages } = await openPdf(bytes);
  state.name = name;
  state.bytes = bytes;
  state.pdf = pdf;
  state.pages = pages;
  state.page = 1;
  state.selected = null;
  resetHistory();

  if (savedPages) {
    for (const saved of savedPages) {
      const page = state.pages.find((p) => p.number === saved.number);
      if (page) page.blocks = saved.blocks.map((b) => ({ ...b, lines: null }));
    }
  }

  ui.app.dataset.ready = 'yes';
  ui.docName.textContent = name;
  await showPage();
  fitWidth();
  refreshChrome();
}

async function offerRestore() {
  const saved = await loadSaved();
  if (!saved?.bytes) return;
  const when = new Date(saved.savedAt || Date.now()).toLocaleString('ru-RU');
  ui.restoreText.textContent = `«${saved.name}», ${when}`;
  ui.restore.hidden = false;
  ui.restoreYes.addEventListener('click', async () => {
    ui.restore.hidden = true;
    busy(true, 'Восстанавливаю…');
    try {
      await start(saved.name, saved.bytes, saved.pages);
    } finally {
      busy(false);
    }
  });
  ui.restoreNo.addEventListener('click', async () => {
    ui.restore.hidden = true;
    await clearSaved();
  });
}

/* --- страницы и масштаб --------------------------------------------------- */

async function goto(number) {
  if (!state.pages.length) return;
  const next = Math.min(Math.max(1, number), state.pages.length);
  if (next === state.page) return;
  state.page = next;
  state.selected = null;
  showInspector(null);
  await showPage();
  refreshChrome();
}

async function setZoom(value) {
  state.zoom = Math.min(4, Math.max(0.25, value));
  await showPage();
  refreshChrome();
}

function fitWidth() {
  const page = currentPage();
  if (!page) return;
  const room = ui.viewport.clientWidth - 48;
  setZoom(room / page.width);
}

/* --- правки --------------------------------------------------------------- */

async function step(fn) {
  if (!fn()) return;
  state.selected = null;
  showInspector(null);
  await showPage();
  refreshChrome();
}

function startPlacing() {
  const page = currentPage();
  if (!page?.editable) return;
  placing = true;
  ui.layer.classList.add('placing');
  status('Кликните туда, где нужен текст');
}

async function onStageClick(event) {
  if (!placing) return;
  placing = false;
  ui.layer.classList.remove('placing');
  event.preventDefault();
  event.stopPropagation();
  const at = pointToPdf(event.clientX, event.clientY);
  await addTextBox(at);
  refreshChrome();
  status('');
}

async function resetAll() {
  if (!hasEdits()) return;
  if (!confirm('Вернуть документ к исходному виду? Все правки пропадут.')) return;
  const snap = takeSnapshot();
  for (const page of state.pages) {
    page.blocks = page.blocks
      .filter((b) => !b.created)
      .map((b) => ({
        ...b,
        text: b.originalText,
        x: b.ox,
        top: b.otop,
        w: b.ow,
        h: b.oh,
        deleted: false,
        restyled: false,
        lines: null,
      }));
  }
  pushSnapshot('сброс', snap);
  emit('blocks');
  state.selected = null;
  showInspector(null);
  await showPage();
  refreshChrome();
}

/* --- панель блока --------------------------------------------------------- */

function buildInspector() {
  ui.family.innerHTML = FAMILIES.map((f) => `<option value="${f.id}">${f.title}</option>`).join('');

  const change = (mutate, label) => async () => {
    const block = findBlock(state.selected);
    if (!block) return;
    await applyChange(
      block,
      (b) => {
        mutate(b);
        b.restyled = true;
      },
      label,
    );
    refreshChrome();
  };

  ui.family.addEventListener('change', change((b) => {
    b.family = ui.family.value;
  }, 'шрифт'));

  ui.size.addEventListener('change', change((b) => {
    const value = Number(ui.size.value);
    if (!Number.isFinite(value) || value < 4) return;
    const ratio = b.lineHeight / b.size;
    b.size = value;
    b.lineHeight = value * ratio;
    b.fitFrom = value;
  }, 'кегль'));

  ui.bold.addEventListener('click', change((b) => {
    b.bold = !b.bold;
  }, 'начертание'));

  ui.italic.addEventListener('click', change((b) => {
    b.italic = !b.italic;
  }, 'начертание'));

  ui.color.addEventListener('change', change((b) => {
    b.color = hexToRgb(ui.color.value);
  }, 'цвет'));

  for (const button of document.querySelectorAll('[data-align]')) {
    button.addEventListener('click', change((b) => {
      b.align = button.dataset.align;
    }, 'выключка'));
  }

  ui.autoFit.addEventListener('change', change((b) => {
    b.autoFit = ui.autoFit.checked;
    if (!b.autoFit && b.fitFrom) b.size = b.fitFrom;
  }, 'вписать'));

  ui.revert.addEventListener('click', change((b) => {
    b.text = b.originalText;
    b.x = b.ox;
    b.top = b.otop;
    b.w = b.ow;
    b.restyled = false;
    b.deleted = false;
  }, 'вернуть'));

  ui.remove.addEventListener('click', change((b) => {
    b.deleted = !b.deleted;
  }, 'удалить'));
}

function showInspector(block) {
  ui.inspector.hidden = !block;
  if (!block) return;
  ui.family.value = block.family;
  ui.size.value = Math.round(block.size * 10) / 10;
  ui.color.value = rgbToHex(block.color);
  ui.bold.setAttribute('aria-pressed', String(!!block.bold));
  ui.italic.setAttribute('aria-pressed', String(!!block.italic));
  ui.autoFit.checked = !!block.autoFit;
  ui.remove.textContent = block.deleted ? 'Вернуть' : 'Удалить';
  ui.revert.disabled = block.created;
  for (const button of document.querySelectorAll('[data-align]')) {
    button.setAttribute('aria-pressed', String(button.dataset.align === block.align));
  }
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex([r, g, b] = [0, 0, 0]) {
  const part = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${part(r)}${part(g)}${part(b)}`;
}

/* --- поиск ---------------------------------------------------------------- */

function runSearch() {
  const query = ui.search.value.trim().toLowerCase();
  ui.results.textContent = '';
  ui.results.hidden = !query;
  if (!query) return;

  let found = 0;
  for (const page of state.pages) {
    for (const block of page.blocks) {
      if (block.deleted || !block.text.toLowerCase().includes(query)) continue;
      found += 1;
      if (found > 40) break;

      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'hit';
      item.innerHTML = `<b>стр. ${page.number}</b> ${escapeHtml(snippet(block.text, query))}`;
      item.addEventListener('click', async () => {
        if (state.page !== page.number) await goto(page.number);
        state.selected = block.id;
        sync();
        showInspector(block);
        focusBlock(block.id);
      });
      ui.results.append(item);
    }
  }

  if (!found) {
    const empty = document.createElement('p');
    empty.className = 'hit hit--empty';
    empty.textContent = 'Ничего не нашлось';
    ui.results.append(empty);
  }
}

function snippet(text, query) {
  const at = text.toLowerCase().indexOf(query);
  const from = Math.max(0, at - 24);
  return (from ? '…' : '') + text.slice(from, at + query.length + 32).replace(/\n/g, ' ');
}

function escapeHtml(value) {
  return value.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
}

/* --- сохранение ----------------------------------------------------------- */

async function exportPdf() {
  if (!state.bytes) return;
  busy(true, 'Собираю PDF…');
  try {
    const { bytes, changed } = await buildPdf();
    const name = state.name.replace(/\.pdf$/i, '') + '-правка.pdf';
    download(bytes, name);
    status(changed ? `Готово: изменено блоков — ${changed}` : 'Готово: правок не было');
  } catch (error) {
    alert(`Не получилось собрать файл.\n${error.message || error}`);
  } finally {
    busy(false);
  }
}

/* --- мелочи --------------------------------------------------------------- */

function refreshChrome() {
  const page = currentPage();
  ui.pageNow.textContent = state.pages.length ? `${state.page} / ${state.pages.length}` : '—';
  ui.prev.disabled = state.page <= 1;
  ui.next.disabled = state.page >= state.pages.length;
  ui.undo.disabled = !canUndo();
  ui.redo.disabled = !canRedo();
  ui.zoomNow.textContent = `${Math.round(state.zoom * 100)}%`;
  ui.saveFile.disabled = !state.bytes;
  ui.resetAll.disabled = !hasEdits();
  ui.addText.disabled = !page?.editable;
  ui.pushDown.checked = state.pushDown;

  const edited = state.pages.reduce((n, p) => n + p.blocks.filter(isDirty).length, 0);
  ui.edits.textContent = edited ? `правок: ${edited}` : 'правок нет';

  ui.notice.hidden = true;
  if (page && !page.editable) {
    ui.notice.hidden = false;
    ui.notice.textContent = 'Страница повёрнута — текст на ней доступен только для просмотра.';
  } else if (page && page.empty) {
    ui.notice.hidden = false;
    ui.notice.textContent =
      'На странице нет текстового слоя: похоже, это скан. Текст можно добавить поверх кнопкой «Текст».';
  }
}

function status(message) {
  ui.status.textContent = message;
}

function busy(on, message = '') {
  ui.busy.hidden = !on;
  ui.busyText.textContent = message;
}

function onShortcut(event) {
  const typing = event.target.closest?.('.blk-body, input, textarea');
  const meta = event.ctrlKey || event.metaKey;

  if (meta && event.key.toLowerCase() === 'z') {
    event.preventDefault();
    step(event.shiftKey ? redo : undo);
    return;
  }
  if (meta && event.key.toLowerCase() === 'y') {
    event.preventDefault();
    step(redo);
    return;
  }
  if (meta && event.key.toLowerCase() === 's') {
    event.preventDefault();
    exportPdf();
    return;
  }
  if (meta && event.key.toLowerCase() === 'f') {
    event.preventDefault();
    ui.search.focus();
    ui.search.select();
    return;
  }
  if (typing) return;

  if (event.key === 'PageDown' || event.key === 'ArrowRight') goto(state.page + 1);
  if (event.key === 'PageUp' || event.key === 'ArrowLeft') goto(state.page - 1);
  if (event.key === 'Escape' && placing) {
    placing = false;
    ui.layer.classList.remove('placing');
    status('');
  }
}

init();
