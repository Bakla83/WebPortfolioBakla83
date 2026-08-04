
  (function () {
    try {
      var lang = localStorage.getItem('oktava-lang');
      if (!lang) lang = (navigator.language || 'ru').toLowerCase().indexOf('ru') === 0 ? 'ru' : 'en';
      document.documentElement.setAttribute('lang', lang);
    } catch (e) {}
  })();
