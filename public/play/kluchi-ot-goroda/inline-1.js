  (function () {
    try {
      var theme = localStorage.getItem('kluchi-theme');
      if (!theme) {
        theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
      }
      document.documentElement.setAttribute('data-theme', theme);

      var lang = localStorage.getItem('kluchi-lang');
      if (!lang) lang = (navigator.language || 'ru').toLowerCase().indexOf('ru') === 0 ? 'ru' : 'en';
      document.documentElement.setAttribute('lang', lang);
    } catch (e) {}
  })();
