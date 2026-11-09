// Site behaviour: navigation tabs, in-page tab panels, scroll reveal and the enquiry form.
(() => {
  const CONTACT_EMAIL = 'gunter.dewin@uza.be';
  const root = document.documentElement;

  // Keep the current navigation tab visible on narrow screens
  const current = document.querySelector('.tabs [aria-current="page"]');
  if (current && current.scrollIntoView) current.scrollIntoView({ block: 'nearest', inline: 'center' });

  // Header shadow on scroll
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // In-page tab panels (all panels stay visible if scripts do not run)
  document.querySelectorAll('[data-tabs]').forEach(set => {
    const tabs = Array.from(set.querySelectorAll('[role="tab"]'));
    const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
    const vertical = set.querySelector('[role="tablist"]').getAttribute('aria-orientation') === 'vertical';
    set.classList.add('is-ready');

    const select = (index, focus) => {
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (focus) tabs[index].focus();
    };

    tabs.forEach((tab, i) => {
      tab.type = 'button';
      tab.addEventListener('click', () => select(i, false));
      tab.addEventListener('keydown', e => {
        const next = vertical ? 'ArrowDown' : 'ArrowRight';
        const prev = vertical ? 'ArrowUp' : 'ArrowLeft';
        let n = null;
        if (e.key === next) n = (i + 1) % tabs.length;
        if (e.key === prev) n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(n, true); }
      });
    });

    // Open the panel that contains a linked anchor (e.g. speaking.html#engagements)
    let start = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      const idx = target ? panels.findIndex(p => p.contains(target)) : -1;
      if (idx >= 0) start = idx;
    }
    select(Math.max(start, 0), false);
    if (location.hash && start >= 0) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) setTimeout(() => target.scrollIntoView(), 0);
    }
  });

  // Gentle reveal on scroll, skipped when reduced motion is requested
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && 'IntersectionObserver' in window) {
    root.classList.add('can-reveal');
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  }

  // Enquiry form: preselect type from ?type= and prepare an email draft
  const form = document.getElementById('enquiry-form');
  if (form) {
    const types = { speaking: 'Speaking invitation', research: 'Research collaboration', academic: 'Academic enquiry', media: 'Media enquiry' };
    const typeField = form.querySelector('#enquiry-type');
    const requested = new URLSearchParams(location.search).get('type');
    if (requested && types[requested]) typeField.value = types[requested];

    const status = form.querySelector('[data-form-status]');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const value = id => form.querySelector('#' + id).value.trim();
      const type = value('enquiry-type');
      const name = value('enquiry-name');
      const organisation = value('enquiry-organisation');
      const message = value('enquiry-message');
      if (!name || !organisation || !message) {
        status.textContent = 'Please complete your name, organisation and a short introduction.';
        return;
      }
      const subject = `${type} – ${organisation}`;
      const body = `Dear Prof. De Win,\n\n${message}\n\n${name}\n${organisation}\n\nEnquiry type: ${type}\n`;
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Your email application should open with a prepared draft. If it does not, please write to ' + CONTACT_EMAIL + '.';
    });
  }

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
