  (function () {
    try {
      var lang = localStorage.getItem('centipede-lang');
      if (!lang) lang = (navigator.language || 'ru').toLowerCase().indexOf('ru') === 0 ? 'ru' : 'en';
      document.documentElement.setAttribute('lang', lang);

      var pal = localStorage.getItem('centipede-palette') || 'bay';
      document.documentElement.setAttribute('data-palette', pal);

      var calm = localStorage.getItem('centipede-calm');
      if (calm === null) calm = matchMedia('(prefers-reduced-motion: reduce)').matches ? '1' : '0';
      if (calm === '1') document.documentElement.setAttribute('data-calm', '');
    } catch (e) {}
  })();
