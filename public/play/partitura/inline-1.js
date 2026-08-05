
  (function () {
    try {
      var lang = localStorage.getItem('partitura-lang');
      if (!lang) lang = (navigator.language || 'ru').toLowerCase().indexOf('ru') === 0 ? 'ru' : 'en';
      document.documentElement.setAttribute('lang', lang);

      var theme = localStorage.getItem('partitura-theme');
      if (!theme) {
        theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  })();
