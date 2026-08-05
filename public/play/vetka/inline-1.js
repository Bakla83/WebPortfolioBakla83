
  (function () {
    try {
      var lang = localStorage.getItem('vetka-lang');
      if (!lang) lang = (navigator.language || 'ru').toLowerCase().indexOf('ru') === 0 ? 'ru' : 'en';
      document.documentElement.setAttribute('lang', lang);

      var theme = localStorage.getItem('vetka-theme');
      if (!theme) {
        theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      }
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  })();
