/**
 * Клиентская логика сайта: тема, мобильное меню, выпадающий список,
 * запоминание языка и кнопки «скопировать».
 *
 * Всё построено так, что без JS сайт остаётся рабочим: ссылки — настоящие
 * ссылки, меню открывается отдельной страницей не нужно, тема приходит
 * из :root. Скрипт только добавляет удобства.
 */

const THEME_KEY = 'theme';
const LANG_KEY = 'lang';

type Theme = 'dark' | 'light';

/** localStorage может бросать в приватном режиме — везде оборачиваем. */
function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* пользователь запретил хранилище — просто не запоминаем выбор */
  }
}

/* ------------------------------------------------------------------ тема */

function currentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function syncToggleLabel(button: HTMLElement): void {
  // Кнопка предлагает противоположную тему — подпись должна это отражать
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  const label = next === 'light' ? button.dataset.labelLight : button.dataset.labelDark;
  if (label) {
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
  }
}

function initTheme(): void {
  const buttons = document.querySelectorAll<HTMLElement>('[data-theme-toggle]');
  buttons.forEach(syncToggleLabel);

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      safeSet(THEME_KEY, next);
      buttons.forEach(syncToggleLabel);
    });
  });
}

/* --------------------------------------------------------- мобильное меню */

function initMobileMenu(): void {
  const panel = document.querySelector<HTMLElement>('[data-menu-panel]');
  const openBtn = document.querySelector<HTMLElement>('[data-menu-open]');
  const closeBtn = document.querySelector<HTMLElement>('[data-menu-close]');
  if (!panel || !openBtn) return;

  const setOpen = (open: boolean): void => {
    panel.hidden = !open;
    openBtn.setAttribute('aria-expanded', String(open));
    // Фон не должен прокручиваться под открытым меню
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      closeBtn?.focus();
    } else {
      openBtn.focus();
    }
  };

  openBtn.addEventListener('click', () => setOpen(true));
  closeBtn?.addEventListener('click', () => setOpen(false));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) setOpen(false);
  });

  // Переход по ссылке внутри меню закрывает его — иначе при возврате
  // из кэша браузера меню остаётся открытым, а тело заблокированным
  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  window.addEventListener('pageshow', () => {
    if (!panel.hidden) setOpen(false);
  });
}

/* -------------------------------------------------- выпадающий список меню */

function initDropdowns(): void {
  const dropdowns = document.querySelectorAll<HTMLDetailsElement>('[data-dropdown]');
  if (!dropdowns.length) return;

  // Клик мимо закрывает: <details> сам этого не умеет
  document.addEventListener('click', (event) => {
    const target = event.target as Node;
    dropdowns.forEach((dropdown) => {
      if (dropdown.open && !dropdown.contains(target)) dropdown.open = false;
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    dropdowns.forEach((dropdown) => {
      if (!dropdown.open) return;
      dropdown.open = false;
      dropdown.querySelector('summary')?.focus();
    });
  });
}

/* ----------------------------------------------------------------- язык */

function initLangMemory(): void {
  // Явный выбор языка запоминается, чтобы корневой / в следующий раз
  // открыл именно его, а не то, что стоит в браузере
  document.querySelectorAll<HTMLAnchorElement>('[data-lang-switcher] a[data-lang]').forEach((a) => {
    a.addEventListener('click', () => {
      const code = a.dataset.lang;
      if (code) safeSet(LANG_KEY, code);
    });
  });
}

/* ------------------------------------------------------------- копировать */

function initCopyButtons(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copy;
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        const done = button.dataset.copiedLabel;
        const original = button.textContent;
        if (done) {
          button.textContent = done;
          window.setTimeout(() => {
            button.textContent = original;
          }, 1800);
        }
      } catch {
        /* без разрешения на буфер обмена — пользователь скопирует руками */
      }
    });
  });
}

/* ------------------------------------------------------ появление секций */

function initReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!items.length) return;

  // Уважаем системную настройку: при reduce-motion просто показываем всё
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );

  items.forEach((item) => observer.observe(item));
}

initTheme();
initMobileMenu();
initDropdowns();
initLangMemory();
initCopyButtons();
initReveal();
