/*
  Локализация.

  Ключ data-i18n="a.b" ищется как I18N[lang].a.b. Разметка в index.html
  заполнена русским текстом на случай, если JS не выполнится: страница
  останется читаемой, просто без переключателя языков.

  Атрибуты переводятся отдельными ключами — data-i18n-content (meta),
  data-i18n-placeholder, data-i18n-aria-label. Разделение нужно потому,
  что у одного элемента текст и подпись для скринридера часто разные.

  Английский здесь не для галочки: модели уезжают к владельцам за границу,
  и половина переписки идёт на английском. Названия мастей поэтому даны не
  переводом, а принятыми в породном обиходе терминами — bay, buckskin,
  grullo, — иначе владелец не поймёт, что заказал.

  Содержимое, которое строится скриптом (галерея, этапы, справочник мастей,
  вопросы), берётся из тех же словарей напрямую — см. js/main.js.
*/
window.Centipede = window.Centipede || {};

(function (ns) {
  'use strict';

  const STORAGE_KEY = 'centipede-lang';
  const SUPPORTED = ['ru', 'en'];

  const I18N = {
    ru: {
      meta: {
        title: 'Centipede Repaints — авторский перекрас конных миниатюр',
        description:
          'Авторский перекрас моделей лошадей: полностью ручная работа, ' +
          'проработанная масть, отметины и характер. Соберите масть в студии ' +
          'и оставьте заявку.',
      },

      a11y: {
        skip: 'Перейти к содержимому',
        nav: 'Основная навигация',
        footerNav: 'Разделы сайта',
        lang: 'Язык сайта',
        menu: 'Меню',
        palette: 'Выбор палитры',
        calm: 'Приглушить движение фона',
        calmOn: 'Вернуть движение фона',
        coatPick: 'Выбрать масть',
        horsePreview: 'Модель лошади, масть: ',
      },

      brand: {
        name: 'Centipede',
        sub: 'repaints',
      },

      nav: {
        works: 'Работы',
        zita: 'Зита',
        studio: 'Студия',
        process: 'Как это делается',
        coats: 'Масти',
        author: 'Автор',
        faq: 'Вопросы',
        contacts: 'Контакты',
      },

      zita: {
        title: 'Зита — собственная модель',
        lead:
          'Зита была разработана мной, а скульптура появилась на свет благодаря ' +
          'команде Horsestation. Сначала появилось нарисованное превью, затем ' +
          'скульптура, а дальше — перекрасы: одна и та же Зита в разных мастях.',
        planLabel: 'Превью',
        realLabel: 'Перекрас',
        alt1: 'Нарисованное превью модели Зита',
        alt2: 'Зита — перекрас в тёмной масти',
        alt3: 'Зита — перекрас в тёмно-буланой масти с золотым отливом',
      },

      author: {
        title: 'Автор',
        lead:
          'Я художник в мире конной миниатюры. За это время создала десятки ' +
          'уникальных лошадей, которые нашли своих владельцев по всему миру. ' +
          'Каждая модель — полностью ручная работа: проработанные детали, ' +
          'реалистичная роспись, индивидуальный характер и история.',
        alt: 'Художница с одной из своих моделей',
      },

      header: { cta: 'Написать' },

      hero: {
        eyebrow: 'Авторский перекрас конных миниатюр',
        title1: 'Модель, у которой',
        title2: 'есть характер',
        lead:
          'Я художник в мире конной миниатюры. Каждая лошадь здесь — полностью ' +
          'ручная работа, с проработанной мастью, отметинами и собственной историей.',
        cta1: 'Посмотреть работы',
        cta2: 'Собрать масть',
        scroll: 'Листайте',
      },

      stats: {
        a1: 'Десятки лошадей',
        a2: 'уже нашли своих владельцев',
        b1: 'Ручная работа',
        b2: 'от разбора до финального лака',
        c1: 'По всему миру',
        c2: 'модели уезжают на разные континенты',
      },

      works: {
        title: 'Работы',
        lead:
          'Каждая модель существует в одном экземпляре: повторить масть можно, ' +
          'но никогда не буквально — слои ложатся заново.',
        sold: 'У владельца',
        available: 'Свободна',
        scale: 'Масштаб',
        coatLabel: 'Масть',
        photoSoon: 'Здесь будет фотография',
        /* Клички настоящие. Масштаб и статус оставлены пустыми намеренно:
           придумывать «1:9» и «у владельца» под реальной работой нельзя —
           это утверждения о чужой собственности и о том, продаётся ли
           модель. Впишите свои значения, и строка появится сама. Порядок
           совпадает с img/work-1.jpg … work-8.jpg. */
        items: [
          { name: 'Звезда',              scale: '', status: '' },
          { name: 'Сахар',               scale: '', status: '' },
          { name: 'Джадакисс',           scale: '', status: '' },
          { name: 'Барли',               scale: '', status: '' },
          { name: 'Рика',                scale: '', status: '' },
          { name: 'Винч',                scale: '', status: '' },
          { name: 'Центурион',           scale: '', status: '' },
          { name: 'Сангрия с жеребёнком', scale: '', status: '' },
        ],
      },

      studio: {
        title: 'Студия перекраса',
        lead:
          'Масть собирается из четырёх решений — и ровно так же она собирается ' +
          'на модели: сначала основной тон, потом отметины, потом ноги, и только ' +
          'в конце становится понятно, что получилось.',
        coat: 'Масть',
        face: 'Отметина на морде',
        socks: 'Белые ноги',
        pose: 'Постановка',
        faceNames: {
          none: 'Без отметины',
          star: 'Звёздочка',
          blaze: 'Проточина',
          bald: 'Барсучья отметина',
        },
        socksNames: {
          0: 'Нет',
          2: 'Две задние',
          4: 'Все четыре',
        },
        poseNames: {
          alert: 'Настороже',
          stand: 'Спокойно',
          step: 'Шаг',
          low: 'Голова опущена',
        },
        random: 'Случайная',
        toOrder: 'Хочу такую',
        copied: 'Карточка скопирована',
        hint:
          'Кнопка скопирует карточку модели — останется вставить её в сообщение ' +
          'любым способом из контактов ниже.',
        specTitle: 'Карточка модели',
      },

      process: {
        title: 'Как это делается',
        lead:
          'Между заводской моделью и готовой лошадью — восемь этапов. Пропустить ' +
          'нельзя ни один: каждый следующий слой держится только на предыдущем.',
        steps: [
          {
            t: 'Разбор',
            d: 'С модели снимается вся заводская краска — до чистого пластика. ' +
               'Новый слой, положенный на чужой, рано или поздно отойдёт вместе с ним.',
          },
          {
            t: 'Подготовка',
            d: 'Швы от литья шлифуются, сколы восстанавливаются. Если нужно — ' +
               'меняется постановка ног, поворот головы, посадка хвоста.',
          },
          {
            t: 'Грунт',
            d: 'Тонкий слой грунта честно показывает всё, что скрывал пластик: ' +
               'царапины, неровности, недошлифованные швы. Их правят здесь.',
          },
          {
            t: 'Базовый тон',
            d: 'Основа масти набирается аэрографом послойно, от светлого к тёмному. ' +
               'За один проход нужного цвета не бывает.',
          },
          {
            t: 'Детализация',
            d: 'Яблоки, подпалины, отметины, копыта, глаза. Самый долгий этап — ' +
               'и единственный, после которого модель становится конкретной лошадью.',
          },
          {
            t: 'Грива и хвост',
            d: 'Волос прорисовывается прядями. Плоско закрашенная грива выдаёт ' +
               'работу сильнее, чем любая ошибка в масти.',
          },
          {
            t: 'Лак',
            d: 'Матовый лак закрепляет роспись и убирает пластиковый блеск. ' +
               'После него модель можно брать в руки.',
          },
          {
            t: 'Карточка',
            d: 'У каждой лошади своя карточка: кличка, масть, отметины, дата. ' +
               'Она уезжает к владельцу вместе с моделью.',
          },
        ],
      },

      coats: {
        title: 'Масти',
        lead:
          'Десять мастей, которые чаще всего просят. Наведите на любую — ' +
          'модель в студии выше переоденется.',
        names: {
          black: 'Вороная',
          bay: 'Гнедая',
          chestnut: 'Рыжая',
          appaloosa: 'Чубарая',
          pinto: 'Пегая',
          grullo: 'Мышастая',
          buckskin: 'Буланая',
          palomino: 'Соловая',
          grey: 'Серая в яблоках',
          cremello: 'Изабелловая',
        },
        notes: {
          black: 'Чёрная целиком, без подпалин. Самая капризная: любой лишний ' +
                 'блик сразу читается как серый.',
          bay: 'Корпус коричневый, грива, хвост и низ ног чёрные. Классика, ' +
               'с которой обычно начинают.',
          chestnut: 'Рыжая с более светлой гривой. Чем светлее грива, тем ' +
                    'сложнее увести её от жёлтого.',
          appaloosa: 'Белый чепрак на крупе с тёмными пятнами. Пятна ставятся ' +
                     'по одному, а не набрызгом.',
          pinto: 'Крупные белые пежины с рваным краем. Границу приходится ' +
                 'выводить вручную — трафарет даёт мёртвую линию.',
          grullo: 'Мышиный тон с тёмным ремнём по хребту. Ремень наносится ' +
                  'до затемнения, иначе он всплывает поверх.',
          buckskin: 'Песочный корпус при чёрных гриве, хвосте и ногах.',
          palomino: 'Золотистый корпус и почти белые грива с хвостом.',
          grey: 'Светлая с яблоками. Яблоки не рисуются, а выдуваются — ' +
                'у нарисованных всегда видна обводка.',
          cremello: 'Кремовая, почти белая, с розовой кожей. Тень на ней ' +
                    'приходится держать в холодном тоне.',
        },
      },

      faq: {
        title: 'Вопросы',
        items: [
          {
            q: 'Можно прислать свою модель?',
            a: 'Да, чаще всего так и работаем. Присылайте фотографии — посмотрю ' +
               'состояние пластика и скажу, что с ней можно сделать.',
          },
          {
            q: 'Сколько времени занимает работа?',
            a: 'Зависит от масти и от того, нужна ли переделка постановки. ' +
               'Срок называю по конкретной модели, до начала работы.',
          },
          {
            q: 'Можно выбрать масть самому?',
            a: 'Нужно. Соберите её в студии выше и отправьте вместе с заявкой — ' +
               'дальше обсудим детали и оттенок.',
          },
          {
            q: 'Как модель доедет?',
            a: 'В жёсткой упаковке с фиксацией ног и головы. Отправляю и по ' +
               'России, и за границу.',
          },
          {
            q: 'Сколько это стоит?',
            a: 'Цена зависит от масштаба, масти и объёма подготовки. Считаю ' +
               'индивидуально после того, как посмотрю модель.',
          },
        ],
      },

      contacts: {
        title: 'Контакты',
        lead:
          'Пишите куда удобнее — читаю везде. В соцсетях лежат фотографии ' +
          'работ, в том числе те, что не попали на эту страницу.',
        vk: 'ВКонтакте',
        vkNote: 'Альбомы с работами и процессом',
        ig: 'Instagram',
        igNote: 'Свежие модели и детали вблизи',
        fb: 'Facebook',
        fbNote: 'Для тех, кому удобнее там',
      },

      footer: {
        note: 'Авторский перекрас конных миниатюр.',
        rights: 'Все работы на странице — ручная роспись автора.',
      },
    },

    en: {
      meta: {
        title: 'Centipede Repaints — custom model horse repaints',
        description:
          'Custom repaints of model horses: entirely hand-painted, with worked-out ' +
          'coat colour, markings and character. Build a coat in the studio and ' +
          'send a request.',
      },

      a11y: {
        skip: 'Skip to content',
        nav: 'Main navigation',
        footerNav: 'Site sections',
        lang: 'Site language',
        menu: 'Menu',
        palette: 'Colour palette',
        calm: 'Calm the background motion',
        calmOn: 'Restore the background motion',
        coatPick: 'Pick a coat',
        horsePreview: 'Model horse, coat: ',
      },

      brand: {
        name: 'Centipede',
        sub: 'repaints',
      },

      nav: {
        works: 'Work',
        zita: 'Zita',
        studio: 'Studio',
        process: 'Process',
        coats: 'Coats',
        author: 'Artist',
        faq: 'Questions',
        contacts: 'Contact',
      },

      zita: {
        title: 'Zita — a model of my own',
        lead:
          'Zita was designed by me, and the sculpture was brought to life by the ' +
          'Horsestation team. First came the drawn preview, then the sculpture, and ' +
          'after that the repaints: the same Zita in different coats.',
        planLabel: 'Preview',
        realLabel: 'Repaint',
        alt1: 'Drawn preview of the Zita model',
        alt2: 'Zita — a repaint in a dark coat',
        alt3: 'Zita — a repaint in a dark buckskin coat with a golden sheen',
      },

      author: {
        title: 'The artist',
        lead:
          'I am an artist in the world of equine miniatures. In that time I have made ' +
          'dozens of unique horses that have found owners all over the world. Every ' +
          'model is entirely handmade: worked-out detail, lifelike paintwork, a ' +
          'character and a story of its own.',
        alt: 'The artist holding one of her models',
      },

      header: { cta: 'Get in touch' },

      hero: {
        eyebrow: 'Custom repaints of model horses',
        title1: 'A model that has',
        title2: 'a character',
        lead:
          'I am an artist in the world of equine miniatures. Every horse here is ' +
          'entirely hand-made, with a worked-out coat, markings and a story of its own.',
        cta1: 'See the work',
        cta2: 'Build a coat',
        scroll: 'Scroll',
      },

      stats: {
        a1: 'Dozens of horses',
        a2: 'have already found their owners',
        b1: 'Made by hand',
        b2: 'from stripping down to the final varnish',
        c1: 'All over the world',
        c2: 'models travel to different continents',
      },

      works: {
        title: 'Work',
        lead:
          'Every model exists in a single copy: a coat can be repeated, but never ' +
          'literally — the layers go on anew each time.',
        sold: 'With its owner',
        available: 'Available',
        scale: 'Scale',
        coatLabel: 'Coat',
        photoSoon: 'A photograph will go here',
        /* Клички — транслитерация русских: это имена конкретных моделей,
           а не слова, которые нужно переводить. Поправьте, если за границей
           модель известна под другим написанием. */
        items: [
          { name: 'Zvezda',            scale: '', status: '' },
          { name: 'Sakhar',            scale: '', status: '' },
          { name: 'Jadakiss',          scale: '', status: '' },
          { name: 'Barley',            scale: '', status: '' },
          { name: 'Rika',              scale: '', status: '' },
          { name: 'Winch',             scale: '', status: '' },
          { name: 'Centurion',         scale: '', status: '' },
          { name: 'Sangria with foal', scale: '', status: '' },
        ],
      },

      studio: {
        title: 'The repaint studio',
        lead:
          'A coat is built from four decisions — and it is built the same way on ' +
          'the model: base tone first, then markings, then legs, and only at the ' +
          'very end does it become clear what came out.',
        coat: 'Coat',
        face: 'Face marking',
        socks: 'White legs',
        pose: 'Stance',
        faceNames: {
          none: 'None',
          star: 'Star',
          blaze: 'Blaze',
          bald: 'Bald face',
        },
        socksNames: {
          0: 'None',
          2: 'Two hind',
          4: 'All four',
        },
        poseNames: {
          alert: 'Alert',
          stand: 'Standing',
          step: 'Walking on',
          low: 'Head lowered',
        },
        random: 'Surprise me',
        toOrder: 'I want this one',
        copied: 'Card copied',
        hint:
          'The button copies the model card — paste it into a message through any ' +
          'of the contacts below.',
        specTitle: 'Model card',
      },

      process: {
        title: 'How it is done',
        lead:
          'Between a factory model and a finished horse there are eight stages. ' +
          'None can be skipped: each layer only holds on the one beneath it.',
        steps: [
          {
            t: 'Stripping',
            d: 'All factory paint comes off, down to bare plastic. A new layer put ' +
               'over someone else’s will sooner or later lift away with it.',
          },
          {
            t: 'Preparation',
            d: 'Mould seams are sanded, chips repaired. If needed, the legs are ' +
               'reset, the head turned, the tail re-seated.',
          },
          {
            t: 'Primer',
            d: 'A thin coat of primer honestly shows everything the plastic hid: ' +
               'scratches, dents, seams left half-sanded. They get fixed here.',
          },
          {
            t: 'Base tone',
            d: 'The base of the coat is airbrushed in layers, light to dark. ' +
               'The right colour never happens in a single pass.',
          },
          {
            t: 'Detailing',
            d: 'Dapples, shading, markings, hooves, eyes. The longest stage — and ' +
               'the only one after which the model becomes a particular horse.',
          },
          {
            t: 'Mane and tail',
            d: 'Hair is painted strand by strand. A flatly filled mane gives the ' +
               'work away faster than any mistake in the coat.',
          },
          {
            t: 'Varnish',
            d: 'Matt varnish seals the paint and kills the plastic sheen. After it ' +
               'the model can be picked up.',
          },
          {
            t: 'Card',
            d: 'Every horse gets its own card: name, coat, markings, date. ' +
               'It travels to the owner with the model.',
          },
        ],
      },

      coats: {
        title: 'Coats',
        lead:
          'The ten coats asked for most often. Hover over any of them and the ' +
          'model in the studio above changes into it.',
        names: {
          black: 'Black',
          bay: 'Bay',
          chestnut: 'Chestnut',
          appaloosa: 'Appaloosa',
          pinto: 'Pinto',
          grullo: 'Grullo',
          buckskin: 'Buckskin',
          palomino: 'Palomino',
          grey: 'Dapple grey',
          cremello: 'Cremello',
        },
        notes: {
          black: 'Black throughout, with no lighter points. The most temperamental ' +
                 'one: any stray highlight instantly reads as grey.',
          bay: 'Brown body with black mane, tail and lower legs. The classic ' +
               'everyone tends to start with.',
          chestnut: 'Red with a lighter mane. The lighter the mane, the harder it ' +
                    'is to keep it away from yellow.',
          appaloosa: 'A white blanket over the hindquarters with dark spots. ' +
                     'The spots go on one at a time, never spattered.',
          pinto: 'Large white patches with ragged edges. The border has to be ' +
                 'drawn by hand — a stencil gives a dead line.',
          grullo: 'A mouse tone with a dark dorsal stripe. The stripe goes on ' +
                  'before the shading, otherwise it floats on top.',
          buckskin: 'A sand-coloured body with black mane, tail and legs.',
          palomino: 'A golden body with an almost white mane and tail.',
          grey: 'Light, with dapples. Dapples are not drawn but blown in — ' +
                'drawn ones always show an outline.',
          cremello: 'Cream, nearly white, with pink skin. Its shadows have to be ' +
                    'kept in a cold tone.',
        },
      },

      faq: {
        title: 'Questions',
        items: [
          {
            q: 'Can I send my own model?',
            a: 'Yes, that is how it usually works. Send photographs — I will look ' +
               'at the state of the plastic and say what can be done with it.',
          },
          {
            q: 'How long does it take?',
            a: 'It depends on the coat and on whether the stance needs redoing. ' +
               'I give a timeframe for the specific model, before starting.',
          },
          {
            q: 'Can I choose the coat myself?',
            a: 'Please do. Build it in the studio above and send it with your ' +
               'request — we will settle the details and the shade from there.',
          },
          {
            q: 'How does the model travel?',
            a: 'In a rigid box with the legs and head fixed in place. I ship both ' +
               'within Russia and abroad.',
          },
          {
            q: 'What does it cost?',
            a: 'The price depends on scale, coat and how much preparation is ' +
               'needed. I quote individually once I have seen the model.',
          },
        ],
      },

      contacts: {
        title: 'Contact',
        lead:
          'Write wherever suits you — I read all of them. The social pages hold ' +
          'photographs of the work, including pieces that never made it here.',
        vk: 'VK',
        vkNote: 'Albums of finished work and process shots',
        ig: 'Instagram',
        igNote: 'Recent models and close-up detail',
        fb: 'Facebook',
        fbNote: 'For those who prefer it there',
      },

      footer: {
        note: 'Custom repaints of equine miniatures.',
        rights: 'Every piece on this page is hand-painted by the artist.',
      },
    },
  };

  /* ------------------------------------------------------------------- */

  let current = 'ru';
  const listeners = [];

  function dict() {
    return I18N[current];
  }

  /** Достаёт значение по ключу вида 'hero.title1'. */
  function t(key) {
    const parts = String(key).split('.');
    let node = I18N[current];
    for (let i = 0; i < parts.length; i++) {
      if (node == null) return '';
      node = node[parts[i]];
    }
    return node == null ? '' : node;
  }

  /* Разметка переводится по атрибутам. Пустой результат ничего не трогает:
     лучше оставить русский текст из index.html, чем стереть строку. */
  function apply(root) {
    const scope = root || document;

    scope.querySelectorAll('[data-i18n]').forEach(function (el) {
      const v = t(el.getAttribute('data-i18n'));
      if (v) el.textContent = v;
    });

    scope.querySelectorAll('[data-i18n-content]').forEach(function (el) {
      const v = t(el.getAttribute('data-i18n-content'));
      if (v) el.setAttribute('content', v);
    });

    scope.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const v = t(el.getAttribute('data-i18n-placeholder'));
      if (v) el.setAttribute('placeholder', v);
    });

    scope.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      const v = t(el.getAttribute('data-i18n-aria-label'));
      if (v) el.setAttribute('aria-label', v);
    });

    scope.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      const v = t(el.getAttribute('data-i18n-alt'));
      if (v) el.setAttribute('alt', v);
    });

    if (!root) document.title = t('meta.title');
  }

  function set(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    current = lang;
    document.documentElement.setAttribute('lang', lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    apply();
    listeners.forEach(function (fn) { fn(lang); });
  }

  function init() {
    let lang;
    try { lang = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (SUPPORTED.indexOf(lang) === -1) {
      lang = (navigator.language || 'ru').toLowerCase().indexOf('ru') === 0 ? 'ru' : 'en';
    }
    current = lang;
    document.documentElement.setAttribute('lang', lang);
    apply();
  }

  ns.i18n = {
    init: init,
    set: set,
    t: t,
    dict: dict,
    apply: apply,
    get lang() { return current; },
    onChange: function (fn) { listeners.push(fn); },
  };
})(window.Centipede);
