
  (function () {
    try {
      var theme = localStorage.getItem('hrebet-theme');
      if (!theme) theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);

      var lang = localStorage.getItem('hrebet-lang') || 'ru';
      document.documentElement.setAttribute('lang', lang);
    } catch (e) {}
  })();
