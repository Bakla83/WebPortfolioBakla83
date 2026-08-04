/*  ХРЕБЕТ — интерактивность
    Без зависимостей: тема, локализация, шапка при скролле, мобильное меню,
    реакции на попадание в вьюпорт, счётчики статистики, бегущая строка,
    фильтр маршрутов, слайдер отзывов, аккордеон FAQ, форма заявки, курсор,
    параллакс гор.
*/
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  /* ══════════════════════════ СЛОВАРЬ ПЕРЕВОДОВ ══════════════════════════
     Ключ data-i18n="a.b" ищется как I18N[lang].a.b. Для текста с HTML-
     сущностями (нераздельные пробелы и т.п.) используется data-i18n-html —
     он подставляется через innerHTML, а не textContent.
  */
  const I18N = {
    ru: {
      brand: { name: 'ХРЕБЕТ' },
      meta: {
        title: 'ХРЕБЕТ — горные экспедиции для тех, кто идёт до вершины',
        description: 'ХРЕБЕТ — горные экспедиции на Эльбрус, Казбек, Белуху, Хан-Тенгри и другие вершины. Малые группы, опытные гиды, полное сопровождение от заявки до вершины.',
      },
      a11y: {
        skip: 'Перейти к содержанию',
        logo: 'ХРЕБЕТ — на главную',
        navOpen: 'Открыть меню',
        navClose: 'Закрыть меню',
        scrollDown: 'Пролистать вниз',
        reviewsPrev: 'Предыдущий отзыв',
        reviewsNext: 'Следующий отзыв',
        backToTop: 'Наверх',
        themeToggle: 'Переключить тему',
      },
      nav: {
        philosophy: 'Философия', routes: 'Маршруты', process: 'Как это устроено',
        reviews: 'Отзывы', faq: 'Вопросы', contact: 'Контакты', cta: 'Оставить заявку',
      },
      hero: {
        eyebrow: 'Горные экспедиции с 2013 года',
        title1: 'Горы не прощают', title2: 'спешки.',
        lede: 'Мы водим небольшие группы на Эльбрус, Казбек, Белуху и другие вершины от Кавказа до Камчатки — медленно, аккуратно и с гидами, которые поднимались туда десятки раз.',
        ctaPrimary: 'Оставить заявку', ctaSecondary: 'Смотреть маршруты',
        chipLabel: 'участников поднялись с нами', scrollCue: 'Листайте',
      },
      stats: {
        years: { suffix: 'лет', label: 'водим людей в горы' },
        routes: { label: 'маршрута в шести горных районах' },
        climbers: { label: 'участников поднялись с нами' },
        success: { label: 'успешных восхождений на вершину' },
      },
      philosophy: {
        kicker: '01 — Философия',
        quote: '«Вершина — это&nbsp;не&nbsp;точка на&nbsp;карте. Это состояние, в&nbsp;которое вы&nbsp;приходите шаг за&nbsp;шагом, день за&nbsp;днём акклиматизации».',
        p1: 'Мы не гонимся за скоростью восхождения и не набираем группы по 20 человек. За 11 лет мы поняли: чем медленнее и внимательнее маршрут — тем выше шанс дойти до вершины и вернуться целым.',
        p2: 'Каждая экспедиция — это продуманный график акклиматизации, гид с профильной квалификацией и постоянная связь с базовым лагерем. Горы дают немного права на ошибку — мы делаем всё, чтобы вам оно не понадобилось.',
        link: 'Как устроена подготовка',
      },
      filters: { all: 'Все маршруты', beginner: 'Начальный', medium: 'Средний', hard: 'Высокий', expert: 'Экспертный' },
      routes: {
        kicker: '02 — Маршруты',
        title: 'Шесть вершин, до которых мы доводим каждый год',
        intro: 'От первого несложного восхождения до технически сложных экспедиций для тех, кто уже стоял на вершине не один раз.',
      },
      route: {
        priceFrom: 'от', cta: 'Записаться',
        empty: 'В этой категории пока нет маршрутов — но мы что-нибудь придумаем под вас.',
        aktru: { region: 'Алтай', name: 'Актру', desc: 'Ледники и перевалы для первого высотного опыта.', duration: '8 дней', elevation: '3 247 м', price: '58 000 ₽' },
        kazbek: { region: 'Кавказ', name: 'Казбек', desc: 'Ледовая вершина с видом на Военно-Грузинскую дорогу.', duration: '6 дней', elevation: '5 054 м', price: '76 000 ₽' },
        elbrus: { region: 'Кавказ', name: 'Эльбрус', desc: 'Классический маршрут на высшую точку Европы — наша самая популярная экспедиция.', duration: '7 дней', elevation: '5 642 м', price: '89 000 ₽' },
        belukha: { region: 'Алтай', name: 'Белуха', desc: 'Сердце Алтая и самая почитаемая вершина региона.', duration: '12 дней', elevation: '4 506 м', price: '145 000 ₽' },
        klyuchevskaya: { region: 'Камчатка', name: 'Ключевская Сопка', desc: 'Действующий вулкан и одна из самых зрелищных экспедиций.', duration: '9 дней', elevation: '4 754 м', price: '168 000 ₽' },
        khantengri: { region: 'Тянь-Шань', name: 'Хан-Тенгри', desc: 'Мраморная пирамида — вершина для тех, кто уже поднимался выше 6000.', duration: '14 дней', elevation: '6 995 м', price: '265 000 ₽' },
      },
      process: {
        kicker: '03 — Подготовка',
        title: 'Как проходит путь от заявки до вершины',
        intro: 'Ни один этап не пропускаем — именно поэтому у нас 96% успешных восхождений.',
        step1: { title: 'Заявка', body: 'Расскажите об опыте и целях — мы подберём маршрут, который вам по силам, а не самый дорогой в прайсе.' },
        step2: { title: 'Подбор маршрута', body: 'Гид свяжется лично, обсудит даты, снаряжение и физическую готовность, ответит на все вопросы.' },
        step3: { title: 'Подготовка', body: 'Чек-лист снаряжения, рекомендации по физической форме и подробный план акклиматизации на маршруте.' },
        step4: { title: 'Экспедиция', body: 'Идём вместе, шаг за шагом. Гид рядом на каждом участке — от базового лагеря до вершины и обратно.' },
      },
      features: {
        kicker: '04 — Почему мы',
        title: 'То, что мы не готовы отдать на аутсорс',
        f1: { title: 'Малые группы', body: 'До 8 человек на маршруте — гид видит каждого и успевает среагировать на любое изменение состояния.' },
        f2: { title: 'Опытные гиды', body: 'Инструкторы с международной квалификацией UIAA и минимум десятью восхождениями на «свою» вершину.' },
        f3: { title: 'Снаряжение включено', body: 'Всё техническое снаряжение — кошки, ледорубы, верёвки, палатки — предоставляем на месте.' },
        f4: { title: 'Безопасность', body: 'Медицинская страховка, спутниковая связь на маршруте и заранее согласованный план эвакуации.' },
        f5: { title: 'Акклиматизация', body: 'Графики адаптации к высоте строим с запасом по дням — никогда не жертвуем ими ради скорости.' },
        f6: { title: 'Гибкие даты', body: 'Групповые заезды и индивидуальные экспедиции — круглый год, под разные окна погоды.' },
      },
      gallery: {
        kicker: '05 — География',
        title: 'Вершины на нашей карте',
        intro: 'Минималистичные силуэты вместо тысячи фотографий — каждая вершина узнаётся по абрису.',
      },
      reviews: {
        kicker: '06 — Отзывы',
        title: 'Что говорят те, кто уже спустился',
        r1: { quote: 'После Эльбруса я понял — дело не в вершине, а в том, кем ты становишься по пути к ней. Спокойная методичность гидов снимает половину тревоги ещё до старта.', name: 'Дмитрий Волков', meta: 'инженер · Эльбрус, 2023' },
        r2: { quote: 'Гид знал каждый камень на маршруте. Ни разу не почувствовала себя в опасности, даже когда было по-настоящему страшно — на леднике перед перевалом.', name: 'Анна Соколова', meta: 'дизайнер · Белуха, 2022' },
        r3: { quote: 'Четырнадцать дней почти без связи с миром — и это было лучшее решение года. Хан-Тенгри не прощает спешки, и это оказалось ровно то, что мне было нужно.', name: 'Игорь Панин', meta: 'предприниматель · Хан-Тенгри, 2023' },
        r4: { quote: 'Первое восхождение в жизни, взяла Актру. Боялась, что не потяну физически — но график акклиматизации оказался настолько разумным, что дошли всей группой.', name: 'Мария Ким', meta: 'врач · Актру, 2024' },
      },
      faq: {
        kicker: '07 — Вопросы',
        title: 'Если сомневаетесь — это нормально',
        intro: 'Не нашли ответ? Напишите нам — отвечаем в течение дня.',
        link: 'Задать свой вопрос',
        q1: { q: 'Нужен ли опыт восхождений?', a: 'Для маршрутов уровня «Начальный» и «Средний» опыт не обязателен — достаточно хорошей физической формы. Для «Высокого» и «Экспертного» уровня нужен опыт как минимум одного восхождения выше 4 500 м.' },
        q2: { q: 'Что входит в стоимость?', a: 'Работа гидов, техническое снаряжение, проживание на маршруте, питание в экспедиции, страховка и трансфер от точки сбора группы. Перелёт до точки сбора и личное снаряжение — отдельно.' },
        q3: { q: 'Как проходит акклиматизация?', a: 'По принципу «поднимайся высоко — спи низко»: каждый выход выше сопровождается спуском на ночёвку. График закладывается с запасом в 1–2 дня на случай непогоды или плохой адаптации.' },
        q4: { q: 'Можно ли поехать одному?', a: 'Да, большинство участников присоединяются к сборным группам в одиночку и знакомятся уже на маршруте. Индивидуальные экспедиции тоже доступны — обсудим при подборе маршрута.' },
        q5: { q: 'Что если я не дойду до вершины?', a: 'Решение о подъёме на финальный участок гид принимает по вашему состоянию и погоде — это забота о вас, а не наказание. Все, кто повернул назад, спускаются вместе с группой в безопасности.' },
      },
      cta: {
        kicker: '08 — Контакты',
        title: 'Готовы к своей вершине?',
        lede: 'Оставьте заявку — гид свяжется в течение дня, обсудит маршрут и ответит на вопросы, которые не поместились в FAQ.',
        address: 'Москва, ул. Никольская, 12',
      },
      form: {
        name: 'Имя', namePh: 'Как к вам обращаться',
        contact: 'Телефон или e-mail', contactPh: '+7 999 000-00-00',
        route: 'Маршрут', routeDefault: 'Ещё не решил(а)',
        message: 'Комментарий', messageOptional: '(необязательно)', messagePh: 'Опыт восхождений, пожелания по датам…',
        submit: 'Отправить заявку', submitting: 'Отправляем…',
        note: 'Нажимая «Отправить», вы соглашаетесь на обработку персональных данных.',
        successTitle: 'Заявка отправлена',
        successBody: 'Мы свяжемся с вами в течение дня. А пока — можно листать маршруты дальше.',
      },
      footer: {
        tagline: 'Горные экспедиции для тех, кто идёт до вершины медленно и осознанно.',
        routesHeading: 'Маршруты', companyHeading: 'Компания', contactsHeading: 'Контакты',
        copyright: 'Все восхождения на свой риск и с гидом.',
      },
      marquee: ['Эльбрус', 'Казбек', 'Белуха', 'Хан-Тенгри', 'Ключевская Сопка', 'Актру'],
    },

    en: {
      brand: { name: 'HREBET' },
      meta: {
        title: 'HREBET — mountain expeditions for those who go all the way',
        description: 'HREBET runs mountain expeditions to Elbrus, Kazbek, Belukha, Khan Tengri and beyond. Small groups, experienced guides, full support from booking to summit.',
      },
      a11y: {
        skip: 'Skip to content',
        logo: 'HREBET — home',
        navOpen: 'Open menu',
        navClose: 'Close menu',
        scrollDown: 'Scroll down',
        reviewsPrev: 'Previous review',
        reviewsNext: 'Next review',
        backToTop: 'Back to top',
        themeToggle: 'Toggle theme',
      },
      nav: {
        philosophy: 'Philosophy', routes: 'Routes', process: 'How it works',
        reviews: 'Reviews', faq: 'FAQ', contact: 'Contact', cta: 'Get in touch',
      },
      hero: {
        eyebrow: 'Mountain expeditions since 2013',
        title1: "Mountains don't forgive", title2: 'haste.',
        lede: "We take small groups to Elbrus, Kazbek, Belukha and other peaks from the Caucasus to Kamchatka — slowly, carefully, with guides who've climbed there dozens of times.",
        ctaPrimary: 'Get in touch', ctaSecondary: 'See routes',
        chipLabel: 'climbers have summited with us', scrollCue: 'Scroll',
      },
      stats: {
        years: { suffix: 'years', label: 'leading people into the mountains' },
        routes: { label: 'routes across six mountain regions' },
        climbers: { label: 'climbers have summited with us' },
        success: { label: 'successful summit rate' },
      },
      philosophy: {
        kicker: '01 — Philosophy',
        quote: '“The summit isn’t&nbsp;a&nbsp;point on&nbsp;a&nbsp;map. It’s&nbsp;a&nbsp;state you arrive at&nbsp;— step by&nbsp;step, day by&nbsp;day of&nbsp;acclimatization.”',
        p1: "We don't chase speed and we don't run groups of twenty. In eleven years we've learned one thing: the slower and more attentive the route, the better your odds of reaching the summit — and coming back in one piece.",
        p2: 'Every expedition is a carefully planned acclimatization schedule, a guide with proper qualifications, and constant contact with base camp. The mountains leave little room for error — we do everything we can so you never need it.',
        link: 'How we prepare you',
      },
      filters: { all: 'All routes', beginner: 'Beginner', medium: 'Intermediate', hard: 'Advanced', expert: 'Expert' },
      routes: {
        kicker: '02 — Routes',
        title: 'Six peaks we guide climbers to every year',
        intro: "From an easy first ascent to technically demanding expeditions for those who've already stood on a summit more than once.",
      },
      route: {
        priceFrom: 'from', cta: 'Book now',
        empty: "No routes in this category yet — but we'll figure something out for you.",
        aktru: { region: 'Altai', name: 'Aktru', desc: 'Glaciers and passes for your first high-altitude experience.', duration: '8 days', elevation: '3,247 m', price: '₽58,000' },
        kazbek: { region: 'Caucasus', name: 'Kazbek', desc: 'An icy summit overlooking the Georgian Military Road.', duration: '6 days', elevation: '5,054 m', price: '₽76,000' },
        elbrus: { region: 'Caucasus', name: 'Elbrus', desc: "The classic route to Europe's highest point — our most popular expedition.", duration: '7 days', elevation: '5,642 m', price: '₽89,000' },
        belukha: { region: 'Altai', name: 'Belukha', desc: "The heart of Altai and the region's most revered summit.", duration: '12 days', elevation: '4,506 m', price: '₽145,000' },
        klyuchevskaya: { region: 'Kamchatka', name: 'Klyuchevskaya Sopka', desc: 'An active volcano and one of our most spectacular expeditions.', duration: '9 days', elevation: '4,754 m', price: '₽168,000' },
        khantengri: { region: 'Tian Shan', name: 'Khan Tengri', desc: "The Marble Pyramid — a summit for those who've already climbed above 6,000 m.", duration: '14 days', elevation: '6,995 m', price: '₽265,000' },
      },
      process: {
        kicker: '03 — Preparation',
        title: 'The journey from inquiry to summit',
        intro: "We don't skip a single stage — which is exactly why 96% of our climbers reach the summit.",
        step1: { title: 'Inquiry', body: "Tell us about your experience and goals — we'll match you with a route you can actually handle, not just the most expensive one on the list." },
        step2: { title: 'Route matching', body: 'A guide will reach out personally to discuss dates, gear, and fitness, and answer every question you have.' },
        step3: { title: 'Preparation', body: 'A gear checklist, fitness recommendations, and a detailed acclimatization plan for the route.' },
        step4: { title: 'Expedition', body: 'We go together, step by step. Your guide stays with you on every stretch — from base camp to the summit and back.' },
      },
      features: {
        kicker: '04 — Why us',
        title: 'What we refuse to outsource',
        f1: { title: 'Small groups', body: 'Up to 8 people per route — your guide sees everyone and can react to any change in condition.' },
        f2: { title: 'Experienced guides', body: 'UIAA-certified instructors with at least ten ascents of their assigned peak.' },
        f3: { title: 'Gear included', body: 'All technical equipment — crampons, ice axes, ropes, tents — provided on site.' },
        f4: { title: 'Safety', body: 'Medical insurance, satellite communication on route, and a pre-arranged evacuation plan.' },
        f5: { title: 'Acclimatization', body: 'We build altitude adaptation schedules with days to spare — never sacrificed for speed.' },
        f6: { title: 'Flexible dates', body: 'Group departures and private expeditions — year-round, matched to the weather window.' },
      },
      gallery: {
        kicker: '05 — Where we go',
        title: 'Peaks on our map',
        intro: 'Minimalist silhouettes instead of a thousand photos — every peak recognizable by outline alone.',
      },
      reviews: {
        kicker: '06 — Reviews',
        title: "What climbers say once they're back down",
        r1: { quote: "After Elbrus I understood — it's not about the summit, it's about who you become on the way there. The guides' calm, methodical pace takes away half the anxiety before you even start.", name: 'Dmitry Volkov', meta: 'engineer · Elbrus, 2023' },
        r2: { quote: 'The guide knew every rock on the route. I never once felt unsafe — even when it was genuinely scary, on the glacier before the pass.', name: 'Anna Sokolova', meta: 'designer · Belukha, 2022' },
        r3: { quote: "Fourteen days almost completely off the grid — best decision I made all year. Khan Tengri doesn't forgive haste, and that turned out to be exactly what I needed.", name: 'Igor Panin', meta: 'entrepreneur · Khan Tengri, 2023' },
        r4: { quote: "My first-ever climb, I took on Aktru. I was afraid I wouldn't manage physically — but the acclimatization schedule was so sensible the whole group made it.", name: 'Maria Kim', meta: 'doctor · Aktru, 2024' },
      },
      faq: {
        kicker: '07 — FAQ',
        title: "If you're unsure, that's normal",
        intro: "Can't find your answer? Write to us — we reply within a day.",
        link: 'Ask your own question',
        q1: { q: 'Do I need climbing experience?', a: "Beginner and Intermediate routes don't require prior experience — good physical fitness is enough. Advanced and Expert routes require at least one previous ascent above 4,500 m." },
        q2: { q: "What's included in the price?", a: 'Guide fees, technical equipment, accommodation on route, meals during the expedition, insurance, and transfer from the group meeting point. Flights to the meeting point and personal gear are separate.' },
        q3: { q: 'How does acclimatization work?', a: 'We follow "climb high, sleep low": every push to a higher altitude is followed by a descent to sleep. The schedule is built with 1–2 spare days for bad weather or slow adaptation.' },
        q4: { q: 'Can I go alone?', a: "Yes — most participants join group departures solo and meet each other on the route. Private expeditions are also available; we'll discuss it when matching your route." },
        q5: { q: "What if I don't make it to the summit?", a: "The decision on the final push is made by the guide based on your condition and the weather — it's a safety call, not a punishment. Anyone who turns back descends safely together with the group." },
      },
      cta: {
        kicker: '08 — Contact',
        title: 'Ready for your summit?',
        lede: "Leave a request — a guide will contact you within a day to discuss the route and answer anything the FAQ didn't cover.",
        address: '12 Nikolskaya St, Moscow',
      },
      form: {
        name: 'Name', namePh: 'What should we call you',
        contact: 'Phone or email', contactPh: '+1 555 000-0000',
        route: 'Route', routeDefault: 'Not sure yet',
        message: 'Comment', messageOptional: '(optional)', messagePh: 'Climbing experience, preferred dates…',
        submit: 'Send request', submitting: 'Sending…',
        note: 'By submitting, you agree to our processing of your personal data.',
        successTitle: 'Request sent',
        successBody: "We'll be in touch within a day. In the meantime, feel free to keep browsing routes.",
      },
      footer: {
        tagline: 'Mountain expeditions for those who go all the way — slowly and deliberately.',
        routesHeading: 'Routes', companyHeading: 'Company', contactsHeading: 'Contact',
        copyright: 'All ascents at your own risk, always with a guide.',
      },
      marquee: ['Elbrus', 'Kazbek', 'Belukha', 'Khan Tengri', 'Klyuchevskaya Sopka', 'Aktru'],
    },
  };

  /** Достаёт значение по ключу вида "a.b.c" из словаря языка. */
  function t(lang, key) {
    return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), I18N[lang]);
  }

  /* ══════════════════════════ ТЕМА ══════════════════════════
     Тема уже выставлена инлайн-скриптом в <head> до отрисовки — здесь только
     переключение и сохранение, чтобы не было вспышки не той темы.
  */
  function getTheme() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('hrebet-theme', theme); } catch (e) {}
  }
  function toggleTheme() { setTheme(getTheme() === 'dark' ? 'light' : 'dark'); }

  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('theme-toggle-mobile').addEventListener('click', toggleTheme);

  /* ══════════════════════════ ЯЗЫК ══════════════════════════ */
  function getLang() { return root.getAttribute('lang') === 'en' ? 'en' : 'ru'; }

  function applyLang(lang) {
    root.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const val = t(lang, el.dataset.i18n);
      if (val !== undefined) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const val = t(lang, el.dataset.i18nHtml);
      if (val !== undefined) el.innerHTML = val;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const val = t(lang, el.dataset.i18nPlaceholder);
      if (val !== undefined) el.setAttribute('placeholder', val);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
      const val = t(lang, el.dataset.i18nAriaLabel);
      if (val !== undefined) el.setAttribute('aria-label', val);
    });

    document.title = t(lang, 'meta.title');
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', t(lang, 'meta.description'));

    const otherLabel = lang === 'ru' ? 'EN' : 'RU';
    document.getElementById('lang-toggle-label').textContent = otherLabel;
    document.getElementById('lang-toggle-mobile-label').textContent = otherLabel;
    const switchAria = lang === 'ru' ? 'Switch to English' : 'Переключить на русский';
    document.getElementById('lang-toggle').setAttribute('aria-label', switchAria);
    document.getElementById('lang-toggle-mobile').setAttribute('aria-label', switchAria);

    buildMarquee(lang);

    // Открытая FAQ-панель хранит max-height как пиксельное число, снятое со
    // старого текста — после перевода строка стала другой длины/высоты,
    // пересчитываем, иначе ответ обрежется или останется лишний хвост.
    document.querySelectorAll('.faq-question[aria-expanded="true"]').forEach((btn) => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (panel) panel.style.maxHeight = `${panel.scrollHeight}px`;
    });

    // Уже посчитанные счётчики переформатируем под локаль (пробел/запятая
    // между разрядами), не запуская анимацию заново.
    document.querySelectorAll('.stat-number[data-count]').forEach((el) => {
      if (el.dataset.counted === '1') {
        el.textContent = parseInt(el.dataset.count, 10).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US');
      }
    });
  }

  function setLang(lang) {
    try { localStorage.setItem('hrebet-lang', lang); } catch (e) {}
    applyLang(lang);
  }
  function toggleLang() { setLang(getLang() === 'ru' ? 'en' : 'ru'); }

  document.getElementById('lang-toggle').addEventListener('click', toggleLang);
  document.getElementById('lang-toggle-mobile').addEventListener('click', toggleLang);

  // Применяем сразу: HTML уже содержит русский текст по умолчанию, но нужно
  // выставить подписи переключателя и на случай сохранённого EN — перевести.
  applyLang(getLang());

  /* ══════════════════════════ БЕГУЩАЯ СТРОКА ══════════════════════════
     Список вершин дублируется программно (а не в разметке), чтобы обе
     половины ленты были побайтово идентичны — единственный надёжный способ
     получить бесшовный цикл на translateX(-50%), и единственный, который
     переживает смену языка (у RU/EN названий разная длина).
  */
  function buildMarquee(lang) {
    const el = document.getElementById('marquee-track');
    if (!el) return;
    const peaks = I18N[lang].marquee;

    const group = document.createElement('span');
    group.className = 'marquee-group';
    peaks.forEach((name) => {
      const item = document.createElement('span');
      item.textContent = name;
      group.appendChild(item);
      const dot = document.createElement('span');
      dot.className = 'dot';
      dot.textContent = '·';
      group.appendChild(dot);
    });

    el.innerHTML = '';
    el.appendChild(group);
    el.appendChild(group.cloneNode(true));
  }

  /* ── Шапка при скролле ─────────────────────────────────────────── */
  const header = document.getElementById('site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Мобильное меню ─────────────────────────────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavClose = document.getElementById('mobile-nav-close');

  const openMobileNav = () => {
    mobileNav.hidden = false;
    requestAnimationFrame(() => mobileNav.classList.add('is-open'));
    navToggle.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
  };
  const closeMobileNav = () => {
    mobileNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    setTimeout(() => { mobileNav.hidden = true; }, 350);
  };

  navToggle.addEventListener('click', openMobileNav);
  mobileNavClose.addEventListener('click', closeMobileNav);
  mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMobileNav));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) closeMobileNav();
  });

  /* ── Появление элементов при скролле ───────────────────────────── */
  const revealTargets = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  /* ── Счётчики статистики ───────────────────────────────────────── */
  const counters = document.querySelectorAll('.stat-number[data-count]');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const locale = () => (getLang() === 'ru' ? 'ru-RU' : 'en-US');

    if (prefersReducedMotion) {
      el.textContent = target.toLocaleString(locale());
      el.dataset.counted = '1';
      return;
    }

    const duration = 1400;
    const start = performance.now();
    const ease = (progress) => 1 - Math.pow(1 - progress, 3);

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(target * ease(progress));
      el.textContent = value.toLocaleString(locale());
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.dataset.counted = '1';
      }
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 },
    );
    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach(animateCounter);
  }

  /* ── Фильтр маршрутов ───────────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const routeCards = document.querySelectorAll('.route-card');
  const routeEmpty = document.getElementById('route-empty');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;
      let visibleCount = 0;
      routeCards.forEach((card) => {
        const match = filter === 'all' || card.dataset.level === filter;
        card.classList.toggle('is-hidden', !match);
        if (match) visibleCount += 1;
      });
      routeEmpty.hidden = visibleCount > 0;
    });
  });

  /* ── Клик по маршруту → форма с предзаполненным полем ─────────── */
  const routeSelect = document.getElementById('f-route');
  document.querySelectorAll('.route-cta').forEach((btn) => {
    btn.addEventListener('click', () => {
      // Текст <option> сам переведён через data-i18n и его .value совпадает
      // с textContent (атрибут value у опций не задан), поэтому сравниваем
      // с названием маршрута НА ТЕКУЩЕМ языке, а не всегда с русским.
      const routeName = getLang() === 'en' ? btn.dataset.routeEn : btn.dataset.route;
      if (routeSelect) {
        [...routeSelect.options].forEach((opt) => {
          if (opt.value === routeName || opt.textContent.trim() === routeName) routeSelect.value = opt.value;
        });
      }
      document.getElementById('contact').scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      const nameField = document.getElementById('f-name');
      setTimeout(() => nameField && nameField.focus({ preventScroll: true }), prefersReducedMotion ? 0 : 500);
    });
  });

  /* ── Слайдер отзывов ────────────────────────────────────────────── */
  const track = document.getElementById('reviews-track');
  const dotsWrap = document.getElementById('reviews-dots');
  const prevBtn = document.getElementById('reviews-prev');
  const nextBtn = document.getElementById('reviews-next');

  if (track) {
    const slides = [...track.children];
    let index = 0;
    let perView = 1;
    let dots = [];

    const maxIndex = () => Math.max(0, slides.length - perView);

    const computePerView = () => {
      const cardWidth = slides[0].getBoundingClientRect().width + 24; // + gap
      perView = Math.max(1, Math.round(track.parentElement.getBoundingClientRect().width / cardWidth));
    };

    // Число точек = число реально достижимых позиций, а не число карточек:
    // на широком экране видно сразу несколько карточек, и точек должно быть
    // меньше, иначе последняя никогда не подсвечивается.
    const buildDots = () => {
      dotsWrap.innerHTML = '';
      dots = [];
      for (let i = 0; i <= maxIndex(); i += 1) {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
        dots.push(dot);
      }
    };

    const update = () => {
      const cardWidth = slides[0].getBoundingClientRect().width + 24;
      track.style.transform = `translateX(-${index * cardWidth}px)`;
      dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    };

    const goTo = (i) => { index = Math.min(Math.max(i, 0), maxIndex()); update(); };

    prevBtn.addEventListener('click', () => goTo(index - 1 < 0 ? maxIndex() : index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1 > maxIndex() ? 0 : index + 1));

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const prevPerView = perView;
        computePerView();
        if (perView !== prevPerView) buildDots();
        goTo(Math.min(index, maxIndex()));
      }, 150);
    });

    // Свайп на тач-устройствах
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 50) goTo(delta < 0 ? index + 1 : index - 1);
    }, { passive: true });

    computePerView();
    buildDots();
    update();
  }

  /* ── FAQ-аккордеон ──────────────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Закрываем остальные — один открытый вопрос за раз
      document.querySelectorAll('.faq-question').forEach((other) => {
        if (other === btn) return;
        other.setAttribute('aria-expanded', 'false');
        document.getElementById(other.getAttribute('aria-controls')).style.maxHeight = '0px';
      });

      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? '0px' : `${panel.scrollHeight}px`;
    });
  });

  /* ── Форма заявки ───────────────────────────────────────────────── */
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit');
  const successBox = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      const label = submitBtn.querySelector('.btn-label');
      submitBtn.disabled = true;
      label.textContent = t(getLang(), 'form.submitting');

      // Заглушка отправки: реального бэкенда у статичного сайта нет —
      // сюда нужно подключить свой обработчик (fetch на API/форм-сервис).
      setTimeout(() => {
        successBox.hidden = false;
        requestAnimationFrame(() => successBox.classList.add('is-visible'));
        submitBtn.disabled = false;
        label.textContent = t(getLang(), 'form.submit');
        form.reset();
      }, 700);
    }, false);
  }

  /* ── Кнопка «наверх» ────────────────────────────────────────────── */
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backToTop.style.opacity = window.scrollY > 700 ? '1' : '0';
    backToTop.style.pointerEvents = window.scrollY > 700 ? 'auto' : 'none';
  }, { passive: true });
  backToTop.style.opacity = '0';
  backToTop.style.pointerEvents = 'none';
  backToTop.style.transition = 'opacity .3s ease';
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));

  /* ── Год в подвале ──────────────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Параллакс гор в hero ───────────────────────────────────────── */
  const mountains = document.getElementById('hero-mountains');
  if (mountains && !prefersReducedMotion && matchMedia('(pointer: fine)').matches) {
    const layers = mountains.querySelectorAll('.mtn');
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      layers.forEach((layer, i) => {
        const depth = (i + 1) * 4;
        layer.style.transform = `translate(${x * depth}px, ${y * depth * 0.4}px)`;
      });
    }, { passive: true });
  }

  /* ── Кастомный курсор ───────────────────────────────────────────── */
  if (!prefersReducedMotion && matchMedia('(pointer: fine)').matches && matchMedia('(hover: hover)').matches) {
    document.documentElement.classList.add('has-custom-cursor');
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; dot.style.left = `${mx}px`; dot.style.top = `${my}px`; }, { passive: true });

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    document.querySelectorAll('a, button, input, textarea, select, .route-card').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
    });
  }
})();
