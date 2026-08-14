import type { APIRoute } from 'astro';
import { ENABLED_LOCALES, DEFAULT_LOCALE } from '../i18n/config';

export const prerender = true;

export const GET: APIRoute = () => {
  const body = `(function () {
  var supported = ${JSON.stringify(ENABLED_LOCALES)};
  var fallback = ${JSON.stringify(DEFAULT_LOCALE)};

  function stored() {
    try {
      var value = localStorage.getItem('lang');
      return supported.indexOf(value) !== -1 ? value : null;
    } catch (e) {
      return null;
    }
  }

  function fromBrowser() {
    var list = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || fallback];
    for (var i = 0; i < list.length; i++) {
      // 'en-GB' и 'en' одинаково должны попадать в 'en'
      var base = String(list[i]).toLowerCase().split('-')[0];
      if (supported.indexOf(base) !== -1) return base;
    }
    return null;
  }

  var lang = stored() || fromBrowser() || fallback;
  // replace, а не assign: иначе кнопка «назад» возвращает на этот же редирект
  location.replace('/' + lang + location.search + location.hash);
})();
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
