/**
 * Ставит тему до первой отрисовки, чтобы не мигало «не той» темой.
 *
 * Отдельным файлом, а не инлайном в <head>, намеренно: так CSP остаётся
 * строгой (script-src 'self'), без 'unsafe-inline' и без ручного пересчёта
 * хешей при каждой правке. Скрипт подключён блокирующим в <head>, поэтому
 * успевает отработать раньше, чем браузер что-то нарисует.
 *
 * Порядок решения: сохранённый выбор → системная настройка → тёмная.
 */
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme =
      stored === 'light' || stored === 'dark'
        ? stored
        : window.matchMedia('(prefers-color-scheme: light)').matches
          ? 'light'
          : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    // localStorage может быть недоступен (приватный режим, отключённые куки).
    // Тогда просто остаётся тёмная тема из :root — сайт полностью работоспособен.
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
