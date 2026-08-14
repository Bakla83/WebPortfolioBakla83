const THEME_KEY = 'theme';
const LANG_KEY = 'lang';

type Theme = 'dark' | 'light';

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {

  }
}

function currentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function syncToggleLabel(button: HTMLElement): void {

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

function initMobileMenu(): void {
  const panel = document.querySelector<HTMLElement>('[data-menu-panel]');
  const openBtn = document.querySelector<HTMLElement>('[data-menu-open]');
  const closeBtn = document.querySelector<HTMLElement>('[data-menu-close]');
  if (!panel || !openBtn) return;

  const setOpen = (open: boolean): void => {
    panel.hidden = !open;
    openBtn.setAttribute('aria-expanded', String(open));

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

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  window.addEventListener('pageshow', () => {
    if (!panel.hidden) setOpen(false);
  });
}

function initDropdowns(): void {
  const dropdowns = document.querySelectorAll<HTMLDetailsElement>('[data-dropdown]');
  if (!dropdowns.length) return;

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

function initLangMemory(): void {

  document.querySelectorAll<HTMLAnchorElement>('[data-lang-switcher] a[data-lang]').forEach((a) => {
    a.addEventListener('click', () => {
      const code = a.dataset.lang;
      if (code) safeSet(LANG_KEY, code);
    });
  });
}

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

      }
    });
  });
}

function initReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!items.length) return;

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
