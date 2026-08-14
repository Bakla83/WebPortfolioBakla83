window.Pervotsvet = window.Pervotsvet || {};

(function (ns) {
  'use strict';

  const STORAGE_KEY = 'pervotsvet-lang';
  const SUPPORTED = ['ru', 'en'];

  const I18N = {
    ru: {
      meta: {
        title: 'Первоцвет — цветочная мастерская',
        description:
          'Первоцвет — цветочная мастерская: авторские букеты из сезонных цветов, конструктор букета и подписка с доставкой к утру.',
      },

      a11y: {
        skip: 'Перейти к содержимому',
        nav: 'Основная навигация',
        footerNav: 'Разделы сайта',
        lang: 'Язык сайта',
        menu: 'Меню',
        mood: 'Выбор палитры',
        calm: 'Приглушить движение фона',
        calmOn: 'Вернуть движение фона',
        addFlower: 'Добавить в букет',
        removeFlower: 'Убрать из букета',
      },

      brand: {
        name: 'Первоцвет',
        sub: 'цветочная мастерская',
      },

      flowers: {
        tulip: 'Тюльпан',
        peony: 'Пион',
        rose: 'Роза',
        daisy: 'Ромашка',
        ranunculus: 'Ранункулюс',
        anemone: 'Анемон',
        craspedia: 'Краспедия',
        lavender: 'Лаванда',
      },

      nav: {
        bouquets: 'Букеты',
        builder: 'Собрать свой',
        how: 'Как это работает',
        plans: 'Подписка',
        contacts: 'Контакты',
      },

      header: { cta: 'Собрать букет' },

      hero: {
        eyebrow: 'Срезано сегодня на рассвете',
        title1: 'Весна собирается',
        title2: 'в букеты',
        lead:
          'Небольшая мастерская, где букет собирают руками и под настроение, а не по каталогу. Сезонные цветы, честная цена и доставка к нужному часу.',
        ctaPrimary: 'Собрать свой букет',
        ctaSecondary: 'Посмотреть готовые',
        stat1: 'лет в цветах',
        stat2: 'сортов в сезон',
        stat3: 'часа до двери',
        hint: 'Кликните по фону — расцветёт ещё один цветок',
        scroll: 'Листайте',
      },

      moods: {
        eyebrow: 'Палитра',
        title: 'С какого настроения начнём?',
        lead:
          'Выберите — и сайт вместе с лепестками на фоне перекрасится. Мы собираем букеты так же: от настроения, а не от списка.',
        dawn: 'Рассвет',
        dawnNote: 'Пудровая роза, персик, золото',
        meadow: 'Луг',
        meadowNote: 'Зелень, лимон, полевая белизна',
        orchard: 'Сад',
        orchardNote: 'Сирень, абрикос, тёплые сливки',
      },

      catalog: {
        eyebrow: 'Готовые букеты',
        title: 'Шесть историй этой недели',
        lead:
          'Состав меняется вместе с сезоном: если сорт отцвёл, флорист подберёт равноценную замену и обязательно вам её покажет.',
        add: 'Взять за основу',
        from: 'от',
        items: {
          'first-morning': {
            name: 'Первое утро',
            note: 'Тюльпаны, ромашка и краспедия — букет, с которого начинается обычный хороший день.',
          },
          powder: {
            name: 'Пудра',
            note: 'Пионы и розы приглушённого розового. Тот случай, когда сказать нужно тихо, но точно.',
          },
          field: {
            name: 'Полевой',
            note: 'Ромашка, лаванда, краспедия. Пахнет сухой травой и июлем, даже если за окном апрель.',
          },
          lilac: {
            name: 'Сирень в мае',
            note: 'Анемоны и ранункулюсы в лиловом. Собирается под вечерний свет, смотрится дороже, чем стоит.',
          },
          apricot: {
            name: 'Абрикос',
            note: 'Тёплый оранжевый и охра. Хорошо стоит в тёмной комнате — сам себе источник света.',
          },
          garden: {
            name: 'Тихий сад',
            note: 'Крупные пионы, анемоны и зелень. Большой, плотный, для повода, который заметен без слов.',
          },
        },
      },

      builder: {
        eyebrow: 'Конструктор',
        title: 'Соберите букет сами',
        lead:
          'Добавляйте цветы по одному — цена считается сразу. Флорист повторит состав вручную и напишет, если что-то стоит поменять.',
        pick: 'Что положим',
        note:
          'Нечётное число стеблей — старая флористическая примета. Мы её любим, но не настаиваем.',
        empty: 'Ваза пока пустая',
        stems: 'Стеблей',
        wrap: 'Упаковка и лента',
        total: 'Итого',
        limit:
          'Больше в эту вазу не поместится — но флорист соберёт любой размер, напишите нам.',
        order: 'Отправить флористу',
        clear: 'Очистить',
        sent: 'Состав записан. Осталось оставить контакт в форме ниже — и флорист ответит.',
        empty2: 'Сначала добавьте хотя бы один цветок.',
        perStem: 'за стебель',
      },

      steps: {
        eyebrow: 'Как это работает',
        title: 'От заявки до двери — четыре шага',
        s1t: 'Расскажите повод',
        s1d:
          'Пары слов достаточно: день рождения, извинение, «просто так». Повод важнее списка сортов.',
        s2t: 'Флорист присылает эскиз',
        s2d: 'В течение часа — фото похожего букета и состав. Меняем, пока не понравится.',
        s3t: 'Собираем и снимаем',
        s3d:
          'Готовый букет фотографируем и отправляем вам до выезда курьера — сюрприз не испортим.',
        s4t: 'Привозим к нужному часу',
        s4d:
          'В городе — за три часа, к точному времени — по договорённости. Курьер везёт в воде.',
      },

      plans: {
        eyebrow: 'Подписка',
        title: 'Цветы, которые приезжают сами',
        lead:
          'Каждый раз новый состав из того, что лучше всего в эту неделю. Пауза и отмена — в один клик, без звонков.',
        popular: 'Берут чаще всего',
        per: 'за доставку',
        cta: 'Оформить',
        items: {
          fortnight: {
            name: 'Раз в две недели',
            note: 'Для тех, кто ещё присматривается',
            features: [
              'Небольшой букет из 9–11 стеблей',
              'Состав на усмотрение флориста',
              'Доставка в выбранный день',
              'Пауза на любой срок',
            ],
          },
          weekly: {
            name: 'Каждую неделю',
            note: 'Дом, в котором всегда свежие цветы',
            features: [
              'Букет из 15–19 стеблей',
              'Вы называете нелюбимые цветы — мы обходим',
              'Фиксированная цена на весь сезон',
              'Ваза в подарок на третьей доставке',
            ],
          },
          office: {
            name: 'Для офиса',
            note: 'Ресепшен, переговорная, кофейня',
            features: [
              'Три композиции разом',
              'Замена увядших между доставками',
              'Счёт и закрывающие документы',
              'Свой флорист на связи',
            ],
          },
        },
      },

      voices: {
        eyebrow: 'Отзывы',
        title: 'Что говорят',
        items: [
          {
            text:
              'Заказала в панике за два часа до поезда. Успели, привезли в воде, а ещё прислали фото до отправки — я смогла поменять ленту.',
            author: 'Марина',
            role: 'заказывает второй год',
          },
          {
            text:
              'Подписка на офис закрыла вопрос, о котором я раньше вспоминал только когда цветы уже засохли.',
            author: 'Игорь',
            role: 'управляющий кофейней',
          },
          {
            text:
              'Попросила «что-нибудь как на даче у бабушки». Не уточняли ни разу — просто собрали ровно это.',
            author: 'Аня',
            role: 'постоянный заказ по пятницам',
          },
          {
            text:
              'Единственные, кто честно написал, что нужного сорта сегодня нет, и предложил замену вместо того, чтобы молча подсунуть другое.',
            author: 'Дмитрий',
            role: 'заказывал на свадьбу',
          },
        ],
      },

      contact: {
        eyebrow: 'Связаться',
        title: 'Напишите — соберём',
        lead:
          'Отвечаем с девяти утра до девяти вечера, обычно в течение получаса. Срочный заказ — лучше в мессенджер.',
        addrLabel: 'Мастерская',
        addrValue: 'Краснодар, ул. Северная, 12 — двор, зелёная дверь',
        hoursLabel: 'Часы',
        hoursValue: 'Ежедневно, 9:00 — 21:00',
        tgLabel: 'Телеграм',
        tgValue: '@pervotsvet',
        fName: 'Как вас зовут',
        fNamePh: 'Елена',
        errName: 'Впишите имя — нам нужно как-то к вам обращаться',
        fContact: 'Телефон или ник в телеграме',
        fContactPh: '+7 900 000-00-00',
        errContact: 'Оставьте контакт, иначе мы не сможем ответить',
        fOccasion: 'Повод',
        occBirthday: 'День рождения',
        occJustSo: 'Просто так',
        occSorry: 'Извинение',
        occWedding: 'Свадьба',
        occOther: 'Другое',
        fNote: 'Пожелания',
        fNotePh: 'Любит пионы, не любит лилии',
        submit: 'Отправить заявку',
        privacy:
          'Отправляя форму, вы соглашаетесь на обработку контактов ради ответа на заявку — и только.',
        sent: 'Заявка у флориста. Ответим в течение получаса — обычно быстрее.',
      },

      footer: {
        tagline: 'Цветочная мастерская с 2017 года',
        rights: 'Все права на букеты — у тех, кому их подарили',
      },
    },

    en: {
      meta: {
        title: 'Primrose — a flower workshop',
        description:
          'Primrose is a small flower workshop: hand-made bouquets from seasonal flowers, a bouquet builder and a subscription delivered by morning.',
      },

      a11y: {
        skip: 'Skip to content',
        nav: 'Main navigation',
        footerNav: 'Site sections',
        lang: 'Site language',
        menu: 'Menu',
        mood: 'Palette choice',
        calm: 'Calm the background motion',
        calmOn: 'Bring the background motion back',
        addFlower: 'Add to the bouquet',
        removeFlower: 'Remove from the bouquet',
      },

      brand: {
        name: 'Primrose',
        sub: 'flower workshop',
      },

      flowers: {
        tulip: 'Tulip',
        peony: 'Peony',
        rose: 'Rose',
        daisy: 'Daisy',
        ranunculus: 'Ranunculus',
        anemone: 'Anemone',
        craspedia: 'Craspedia',
        lavender: 'Lavender',
      },

      nav: {
        bouquets: 'Bouquets',
        builder: 'Build your own',
        how: 'How it works',
        plans: 'Subscription',
        contacts: 'Contact',
      },

      header: { cta: 'Build a bouquet' },

      hero: {
        eyebrow: 'Cut at dawn this morning',
        title1: 'Spring gathers',
        title2: 'into bouquets',
        lead:
          'A small workshop where a bouquet is built by hand and by mood, not picked off a list. Seasonal flowers, an honest price, delivery at the hour you need.',
        ctaPrimary: 'Build your own',
        ctaSecondary: 'See ready-made',
        stat1: 'years in flowers',
        stat2: 'varieties in season',
        stat3: 'hours to your door',
        hint: 'Click the background — one more flower will open',
        scroll: 'Scroll',
      },

      moods: {
        eyebrow: 'Palette',
        title: 'Which mood shall we start from?',
        lead:
          'Pick one and the site repaints itself, petals in the background included. We build bouquets the same way: from a mood, not from a list.',
        dawn: 'Dawn',
        dawnNote: 'Powdered rose, peach, gold',
        meadow: 'Meadow',
        meadowNote: 'Greens, lemon, field white',
        orchard: 'Orchard',
        orchardNote: 'Lilac, apricot, warm cream',
      },

      catalog: {
        eyebrow: 'Ready-made',
        title: 'Six stories from this week',
        lead:
          'The mix follows the season: if a variety is over, the florist finds an equal replacement and always shows it to you first.',
        add: 'Use as a starting point',
        from: 'from',
        items: {
          'first-morning': {
            name: 'First Morning',
            note: 'Tulips, daisies and craspedia — the bouquet an ordinary good day starts with.',
          },
          powder: {
            name: 'Powder',
            note: 'Peonies and roses in a muted pink. For when it has to be said quietly but precisely.',
          },
          field: {
            name: 'Field Walk',
            note: 'Daisies, lavender, craspedia. Smells of dry grass and July even when it is April outside.',
          },
          lilac: {
            name: 'Lilac in May',
            note: 'Anemones and ranunculus in violet. Built for evening light, looks dearer than it costs.',
          },
          apricot: {
            name: 'Apricot',
            note: 'Warm orange and ochre. Holds up in a dark room — a light source of its own.',
          },
          garden: {
            name: 'Quiet Garden',
            note: 'Large peonies, anemones and greenery. Big and dense, for an occasion that needs no words.',
          },
        },
      },

      builder: {
        eyebrow: 'Builder',
        title: 'Build the bouquet yourself',
        lead:
          'Add flowers one at a time — the price updates as you go. The florist repeats the mix by hand and writes if something is worth changing.',
        pick: 'What goes in',
        note:
          'An odd number of stems is an old florist superstition. We are fond of it, but we do not insist.',
        empty: 'The vase is still empty',
        stems: 'Stems',
        wrap: 'Wrapping and ribbon',
        total: 'Total',
        limit:
          'Nothing more fits in this vase — but the florist will build any size, just write to us.',
        order: 'Send to the florist',
        clear: 'Clear',
        sent: 'The mix is noted. Leave a contact in the form below and the florist will reply.',
        empty2: 'Add at least one flower first.',
        perStem: 'per stem',
      },

      steps: {
        eyebrow: 'How it works',
        title: 'From order to doorstep in four steps',
        s1t: 'Tell us the occasion',
        s1d:
          'A couple of words is enough: a birthday, an apology, “no reason”. The occasion matters more than the variety list.',
        s2t: 'The florist sends a sketch',
        s2d: 'Within the hour — a photo of a similar bouquet and its mix. We adjust until you like it.',
        s3t: 'We build it and photograph it',
        s3d:
          'The finished bouquet is photographed and sent to you before the courier leaves — the surprise stays intact.',
        s4t: 'Delivered at the hour you need',
        s4d:
          'Across the city in three hours, at an exact time by arrangement. The courier carries it in water.',
      },

      plans: {
        eyebrow: 'Subscription',
        title: 'Flowers that arrive on their own',
        lead:
          'A new mix every time, from whatever is best that week. Pause and cancel in one click, no phone calls.',
        popular: 'Most chosen',
        per: 'per delivery',
        cta: 'Subscribe',
        items: {
          fortnight: {
            name: 'Every other week',
            note: 'For those still deciding',
            features: [
              'A small bouquet of 9–11 stems',
              'Mix at the florist’s discretion',
              'Delivery on the day you choose',
              'Pause for as long as you like',
            ],
          },
          weekly: {
            name: 'Every week',
            note: 'A home that always has fresh flowers',
            features: [
              'A bouquet of 15–19 stems',
              'Name the flowers you dislike — we avoid them',
              'Price fixed for the whole season',
              'A vase as a gift on the third delivery',
            ],
          },
          office: {
            name: 'For the office',
            note: 'Reception, meeting room, café',
            features: [
              'Three arrangements at once',
              'Wilted stems replaced between deliveries',
              'Invoice and closing documents',
              'Your own florist on call',
            ],
          },
        },
      },

      voices: {
        eyebrow: 'Reviews',
        title: 'What people say',
        items: [
          {
            text:
              'I ordered in a panic two hours before my train. They made it, delivered it in water, and sent a photo beforehand — I even got the ribbon changed.',
            author: 'Marina',
            role: 'second year as a customer',
          },
          {
            text:
              'The office subscription closed a question I used to remember only once the flowers had already dried out.',
            author: 'Igor',
            role: 'café manager',
          },
          {
            text:
              'I asked for “something like my grandmother’s garden”. They never asked a follow-up — they simply built exactly that.',
            author: 'Anya',
            role: 'standing Friday order',
          },
          {
            text:
              'The only ones who honestly wrote that the variety was out today and offered a replacement instead of quietly swapping in something else.',
            author: 'Dmitry',
            role: 'ordered for a wedding',
          },
        ],
      },

      contact: {
        eyebrow: 'Get in touch',
        title: 'Write to us and we will build it',
        lead:
          'We answer from nine in the morning to nine in the evening, usually within half an hour. For an urgent order, a messenger is faster.',
        addrLabel: 'Workshop',
        addrValue: 'Krasnodar, Severnaya st. 12 — through the yard, green door',
        hoursLabel: 'Hours',
        hoursValue: 'Daily, 9:00 — 21:00',
        tgLabel: 'Telegram',
        tgValue: '@pervotsvet',
        fName: 'Your name',
        fNamePh: 'Elena',
        errName: 'Please add a name — we need something to call you',
        fContact: 'Phone or Telegram handle',
        fContactPh: '+7 900 000-00-00',
        errContact: 'Leave a contact, otherwise we cannot reply',
        fOccasion: 'Occasion',
        occBirthday: 'Birthday',
        occJustSo: 'No reason',
        occSorry: 'An apology',
        occWedding: 'Wedding',
        occOther: 'Something else',
        fNote: 'Wishes',
        fNotePh: 'Loves peonies, dislikes lilies',
        submit: 'Send the request',
        privacy:
          'By sending the form you agree to your contact details being used to answer this request — and nothing else.',
        sent: 'The florist has your request. We will reply within half an hour, usually sooner.',
      },

      footer: {
        tagline: 'A flower workshop since 2017',
        rights: 'All rights to the bouquets belong to whoever received them',
      },
    },
  };

  const listeners = [];

  function t(lang, key) {
    return key
      .split('.')
      .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), I18N[lang]);
  }

  function getLang() {
    const attr = document.documentElement.getAttribute('lang');
    return SUPPORTED.indexOf(attr) !== -1 ? attr : 'ru';
  }

  function applyLang(lang) {
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const value = t(lang, el.getAttribute('data-i18n'));
      if (typeof value === 'string') el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-content]').forEach((el) => {
      const value = t(lang, el.getAttribute('data-i18n-content'));
      if (typeof value === 'string') el.setAttribute('content', value);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const value = t(lang, el.getAttribute('data-i18n-placeholder'));
      if (typeof value === 'string') el.setAttribute('placeholder', value);
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
      const value = t(lang, el.getAttribute('data-i18n-aria-label'));
      if (typeof value === 'string') el.setAttribute('aria-label', value);
    });

    const title = t(lang, 'meta.title');
    if (typeof title === 'string') document.title = title;

    document.querySelectorAll('.lang__btn').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
    });

    listeners.forEach((fn) => fn(lang));
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
    applyLang(lang);
  }

  ns.i18n = {
    dict: I18N,
    supported: SUPPORTED,
    t: t,
    get: getLang,
    set: setLang,
    apply: applyLang,

    onChange: function (fn) {
      listeners.push(fn);
    },
  };
})(window.Pervotsvet);
