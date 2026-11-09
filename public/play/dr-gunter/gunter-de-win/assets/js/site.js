// Shared behaviour for all three design options.
(() => {
  const CONTACT_EMAIL = 'gunter.dewin@uza.be';

  // Mobile navigation
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.getElementById('site-nav');
  const setMenu = open => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };
  if (toggle) toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  if (nav) nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Header state on scroll
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Gentle reveal on scroll (skipped when reduced motion is requested)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('[data-reveal]');
  if (!reduced && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('can-reveal');
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(el => io.observe(el));
  }

  // Links that preselect an enquiry type
  const typeField = document.getElementById('enquiry-type');
  document.querySelectorAll('[data-enquiry]').forEach(link => {
    link.addEventListener('click', () => { if (typeField) typeField.value = link.dataset.enquiry; });
  });

  // Enquiry form: prepares an email draft, nothing is sent or stored by the site
  const form = document.getElementById('enquiry-form');
  if (form) {
    const status = form.querySelector('[data-form-status]');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const value = id => (form.querySelector('#' + id) || {}).value?.trim() || '';
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

  // Current year in footer
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
