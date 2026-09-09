/** Состояние документа: правки, отмена, автосохранение. */

const DB = 'pdf-editor';
const STORE = 'session';
const KEY = 'current';

export const state = {
  name: '',
  bytes: null,
  pdf: null,
  pages: [],
  page: 1,
  selected: null,
  zoom: 1,
  pushDown: true,
};

const history = [];
let future = [];
let listeners = [];

export function onChange(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

export function emit(what = 'blocks') {
  for (const fn of listeners) fn(what);
  if (what === 'blocks') scheduleSave();
}

function snapshot() {
  return state.pages.map((p) => p.blocks.map((b) => ({ ...b })));
}

function restore(snap) {
  state.pages.forEach((page, i) => {
    page.blocks = snap[i].map((b) => ({ ...b }));
  });
}

/** Шаг истории берётся до правки, поэтому «отменить» возвращает прежний вид. */
export function commit(label, fn) {
  const before = snapshot();
  const result = fn();
  history.push({ label, before });
  if (history.length > 80) history.shift();
  future = [];
  emit('blocks');
  return result;
}

/** Снимок для истории: правка может быть асинхронной, поэтому шаг пишется вручную. */
export function takeSnapshot() {
  return snapshot();
}

export function pushSnapshot(label, snap) {
  history.push({ label, before: snap });
  if (history.length > 80) history.shift();
  future = [];
}

export function undo() {
  const step = history.pop();
  if (!step) return false;
  future.push({ label: step.label, before: snapshot() });
  restore(step.before);
  emit('blocks');
  return true;
}

export function redo() {
  const step = future.pop();
  if (!step) return false;
  history.push({ label: step.label, before: snapshot() });
  restore(step.before);
  emit('blocks');
  return true;
}

export function canUndo() {
  return history.length > 0;
}

export function canRedo() {
  return future.length > 0;
}

export function resetHistory() {
  history.length = 0;
  future = [];
}

export function blocks(pageNumber = state.page) {
  const page = state.pages.find((p) => p.number === pageNumber);
  return page ? page.blocks : [];
}

export function currentPage() {
  return state.pages.find((p) => p.number === state.page);
}

export function findBlock(id) {
  for (const page of state.pages) {
    const found = page.blocks.find((b) => b.id === id);
    if (found) return found;
  }
  return null;
}

export function isDirty(block) {
  return (
    block.created ||
    block.deleted ||
    block.text !== block.originalText ||
    Math.abs(block.x - block.ox) > 0.01 ||
    Math.abs(block.top - block.otop) > 0.01 ||
    Math.abs(block.w - block.ow) > 0.01 ||
    block.restyled === true
  );
}

export function hasEdits() {
  return state.pages.some((p) => p.blocks.some(isDirty));
}

/* --- автосохранение ------------------------------------------------------ */

function db() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function put(value) {
  const conn = await db();
  await new Promise((resolve, reject) => {
    const tx = conn.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value, KEY);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  conn.close();
}

let saveTimer = 0;

function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = window.setTimeout(save, 800);
}

export async function save() {
  if (!state.bytes) return;
  try {
    await put({
      name: state.name,
      bytes: state.bytes,
      savedAt: Date.now(),
      pages: state.pages.map((p) => ({ number: p.number, blocks: p.blocks })),
    });
  } catch {
    /* Приватный режим или переполненный диск: правки просто не переживут перезагрузку. */
  }
}

export async function loadSaved() {
  try {
    const conn = await db();
    const value = await new Promise((resolve, reject) => {
      const tx = conn.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(KEY);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    conn.close();
    return value || null;
  } catch {
    return null;
  }
}

export async function clearSaved() {
  try {
    const conn = await db();
    await new Promise((resolve) => {
      const tx = conn.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(KEY);
      tx.oncomplete = resolve;
      tx.onerror = resolve;
    });
    conn.close();
  } catch {
    /* нечего чистить */
  }
}
