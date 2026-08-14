  (function () {
    try {
      var lang = localStorage.getItem('pervotsvet-lang');
      if (!lang) lang = (navigator.language || 'ru').toLowerCase().indexOf('ru') === 0 ? 'ru' : 'en';
      document.documentElement.setAttribute('lang', lang);

      var mood = localStorage.getItem('pervotsvet-mood') || 'dawn';
      document.documentElement.setAttribute('data-mood', mood);

      var calm = localStorage.getItem('pervotsvet-calm');
      if (calm === null) calm = matchMedia('(prefers-reduced-motion: reduce)').matches ? '1' : '0';
      if (calm === '1') document.documentElement.setAttribute('data-calm', '');
    } catch (e) {}
  })();
