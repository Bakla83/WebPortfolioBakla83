import type { Project } from './types';

/**
 * Локальное наполнение сайта.
 *
 * Это же содержимое дублируется схемой Sanity (см. studio/): когда CMS
 * подключена, данные берутся оттуда, а этот файл остаётся страховкой —
 * сайт соберётся, даже если CMS недоступна. См. src/lib/content.ts.
 *
 * Год и роль проставлены по датам файлов и README — поправьте, если не так.
 */
export const PROJECTS: Project[] = [
  /* ---------------------------------------------------------------- ПК-игры */
  {
    slug: 'the-hidden-library',
    section: 'pc-games',
    featured: true,
    order: 1,
    year: 2026,
    tech: ['Unity', 'C#', '2D', 'Point & Click'],
    title: { ru: 'The Hidden Library', en: 'The Hidden Library' },
    role: { ru: 'Разработка', en: 'Development' },
    status: {
      ru: 'В разработке, страница в Steam открыта',
      en: 'In development, Steam page is live',
    },
    teaser: {
      ru: 'Point-and-click приключение в духе dark academia: спрятанная библиотека запрещённых советских книг.',
      en: 'A dark-academia point-and-click adventure: a hidden library of forbidden Soviet books.',
    },
    summary: {
      ru: 'Двумерное приключение, действие которого происходит на юге России в начале двухтысячных. Игрок — тринадцатилетняя Елена, обнаружившая спрятанную библиотеку своего деда: полки с книгами, которые в советское время были под запретом. Исследование локаций, головоломки, мини-игры и встречи с персонажами запрещённых романов складываются в историю о том, как литературу пытались стереть — и что от неё осталось.',
      en: 'A 2D adventure set in southern Russia in the early 2000s. You play Elena, a thirteen-year-old who finds her grandfather’s concealed library: shelves of books that were banned in the Soviet era. Exploring locations, solving puzzles, playing mini-games and meeting characters out of the forbidden novels add up to a story about how literature was suppressed — and what survived of it.',
    },
    highlights: {
      ru: [
        'Рисованные от руки локации и кинематографичный саундтрек',
        'Головоломки и мини-игры, встроенные в исследование',
        'Сюжет, построенный на реальной истории цензуры',
        'Шесть языков: русский, английский, испанский, немецкий, португальский, китайский',
      ],
      en: [
        'Hand-drawn locations and a cinematic soundtrack',
        'Puzzles and mini-games woven into the exploration',
        'A story grounded in the real history of censorship',
        'Six languages: Russian, English, Spanish, German, Portuguese, Chinese',
      ],
    },
    cover: {
      src: '/media/the-hidden-library/shot-1.jpg',
      width: 1920,
      height: 1080,
      alt: {
        ru: 'Елена читает книгу за письменным столом у окна',
        en: 'Elena reading a book at a desk by the window',
      },
    },
    gallery: [
      {
        src: '/media/the-hidden-library/shot-2.jpg',
        width: 1920,
        height: 1080,
        alt: { ru: 'Кадр из игры', en: 'In-game scene' },
      },
      {
        src: '/media/the-hidden-library/shot-3.jpg',
        width: 1920,
        height: 1080,
        alt: { ru: 'Кадр из игры', en: 'In-game scene' },
      },
      {
        src: '/media/the-hidden-library/shot-4.jpg',
        width: 1920,
        height: 1080,
        alt: { ru: 'Кадр из игры', en: 'In-game scene' },
      },
    ],
    links: [
      {
        kind: 'steam',
        url: 'https://store.steampowered.com/app/3410030/The_Hidden_Library/',
      },
    ],
  },

  /* -------------------------------------------------------------- Веб-игры */
  {
    slug: 'salt-run',
    section: 'web-games',
    featured: true,
    order: 1,
    year: 2026,
    tech: ['TypeScript', 'Canvas', 'Vite'],
    title: { ru: 'Salt Run', en: 'Salt Run' },
    role: { ru: 'Автор проекта', en: 'Sole author' },
    teaser: {
      ru: 'Горный козёл спускается за солью и должен вернуться к стаду живым. Чем ниже — тем больше добычи и тем выше шанс встретить хищника.',
      en: 'A mountain goat descends for salt and has to make it back to the herd alive. The deeper you go, the richer the haul — and the likelier the predator.',
    },
    summary: {
      ru: 'Аркада на TypeScript и Canvas без игрового движка: портретный экран, управление тапами и свайпами. Спуск быстрый и почти свободный, а обратная дорога тяжёлая — вверх ведут только прыжки и стены, за которые козёл цепляется копытами. Асимметрия возникает сама из физики, без отдельной «механики подъёма».',
      en: 'An arcade game in TypeScript and Canvas with no game engine: portrait screen, taps and swipes for control. The descent is fast and almost free, the way back is hard — you only get up by jumping and clinging to walls. The asymmetry falls out of the physics itself, with no separate "climbing mechanic".',
    },
    highlights: {
      ru: [
        'Мир собирается не шумом, а вертикальной лентой из выверенных вручную фрагментов — случайность отвечает только за порядок',
        'Проходимость доказывается графом, а не на глаз: после каждого фрагмента сборщик проверяет участок и чинит тупики',
        'Хищник ищет путь по рельефу алгоритмом Дейкстры — подъём стоит дороже спуска, поэтому зверь не лезет вверх без причины',
        'Обучение встроено в первый спуск: подсказка появляется там, где рельеф уже требует навыка',
        'Один seed всегда даёт одну и ту же гору — иначе процедурную генерацию невозможно отлаживать',
      ],
      en: [
        'The world is assembled not from noise but as a vertical ribbon of hand-tuned fragments — randomness only decides the order',
        'Traversability is proven by a graph, not by eye: after every fragment the builder checks the stretch and repairs dead ends',
        'The predator routes over the terrain with Dijkstra — climbing costs more than descending, so it never goes up without reason',
        'The tutorial is built into the first descent: each hint appears where the terrain already demands the skill',
        'One seed always yields the same mountain — otherwise procedural generation is impossible to debug',
      ],
    },
    cover: {
      src: '/media/salt-run/cover.png',
      width: 2160,
      height: 1350,
      alt: { ru: 'Стартовый экран Salt Run со стадом на вершине', en: 'Salt Run title screen with the herd on the summit' },
    },
    gallery: [
      {
        src: '/media/salt-run/mobile.png',
        width: 1170,
        height: 2532,
        alt: { ru: 'Игра на экране телефона', en: 'The game on a phone screen' },
        caption: {
          ru: 'Портретный экран: игра рассчитана на телефон и управляется одной рукой',
          en: 'Portrait screen: the game is built for a phone and played one-handed',
        },
      },
    ],
  },

  /* -------------------------------------------------------------- Лендинги */
  {
    slug: 'hrebet',
    section: 'landings',
    featured: true,
    order: 1,
    year: 2026,
    tech: ['HTML', 'CSS', 'JavaScript'],
    title: { ru: 'ХРЕБЕТ — горные экспедиции', en: 'HREBET — mountain expeditions' },
    role: { ru: 'Дизайн и вёрстка', en: 'Design and front-end' },
    teaser: {
      ru: 'Одностраничный сайт компании горных экспедиций: чередование тёмных и светлых секций, две темы, два языка.',
      en: 'A one-page site for a mountain-expedition company: alternating dark and light sections, two themes, two languages.',
    },
    summary: {
      ru: 'Лендинг на чистых HTML, CSS и JavaScript — без сборки и зависимостей, разворачивается на любом статическом хостинге. Дизайн-система построена на CSS-переменных: чтобы добавить секцию с обратной темой, достаточно навесить класс, компоненты сами возьмут нужные цвета.',
      en: 'A landing page in plain HTML, CSS and JavaScript — no build step, no dependencies, deployable to any static host. The design system runs on CSS custom properties: to add a section with an inverted theme you just add a class and the components pick up the right colours themselves.',
    },
    highlights: {
      ru: [
        'Тёмная и светлая тема применяются инлайн-скриптом до первой отрисовки — вспышки не той темы нет',
        'Русский и английский: весь текст размечен data-атрибутами, словарь лежит одним объектом',
        'Бесшовная бегущая строка: обе половины ленты строятся кодом из одного списка, иначе перевод разъезжает их по ширине и раз в полминуты появляется рывок',
        'Фильтр маршрутов, слайдер отзывов, аккордеон FAQ с пересчётом высоты при смене языка',
        'Проверено в headless Chromium: четыре комбинации темы и языка на десктопе и мобильном',
      ],
      en: [
        'Dark and light themes are applied by an inline script before first paint — no flash of the wrong theme',
        'Russian and English: all copy is marked with data attributes, the dictionary lives in a single object',
        'A seamless marquee: both halves of the ribbon are built in code from one list, otherwise translation makes their widths differ and a visible jump appears every half-minute',
        'Route filter, testimonial slider, FAQ accordion that recalculates its height when the language changes',
        'Verified in headless Chromium: four theme-and-language combinations on desktop and mobile',
      ],
    },
    cover: {
      src: '/media/hrebet/cover.png',
      width: 2160,
      height: 1350,
      alt: {
        ru: 'Первый экран сайта ХРЕБЕТ: горы, луна и заголовок «Горы не прощают спешки»',
        en: 'The first screen of the HREBET site: mountains, a moon and the headline',
      },
    },
    gallery: [
      {
        src: '/media/hrebet/desktop-2.png',
        width: 2160,
        height: 1350,
        alt: { ru: 'Внутренние секции сайта', en: 'Inner sections of the site' },
        caption: {
          ru: 'Светлые секции чередуются с тёмными — приём работает в обеих темах',
          en: 'Light sections alternate with dark ones — the device works in both themes',
        },
      },
      {
        src: '/media/hrebet/mobile.png',
        width: 1170,
        height: 2532,
        alt: { ru: 'Сайт на экране телефона', en: 'The site on a phone screen' },
      },
    ],
  },
  {
    slug: 'relokant',
    section: 'landings',
    order: 2,
    year: 2026,
    tech: ['HTML', 'CSS', 'JavaScript', 'SVG'],
    title: { ru: 'Релокант — чек-лист переезда', en: 'Relokant — a relocation checklist' },
    role: { ru: 'Дизайн и вёрстка', en: 'Design and front-end' },
    teaser: {
      ru: 'Пошаговый чек-лист переезда, оформленный как стопка посадочных талонов. Небо, маршрут и самолётики вместо скучного списка.',
      en: 'A step-by-step relocation checklist laid out as a stack of boarding passes. Sky, flight path and little planes instead of a dull list.',
    },
    summary: {
      ru: 'Лендинг с личным чек-листом релокации: пятнадцать шагов, сгруппированных в восемь блоков — документы, деньги, жильё, вещи и перелёт, связь и страховка, виза, язык, перед отъездом. Карточки стилизованы под посадочный талон: цветной корешок с номером, пунктирная линия отрыва с «заклёпками», отрывной текст справа.',
      en: 'A landing page holding a personal relocation checklist: fifteen steps grouped into eight blocks — documents, money, housing, belongings and the flight, connectivity and insurance, visa, language, and the day before leaving. The cards are styled as boarding passes: a coloured stub with the number, a perforated tear line with rivets, and the tear-off text on the right.',
    },
    highlights: {
      ru: [
        'Сквозная «линия маршрута» через фон всех восьми блоков — SVG-паттерн, который не зависит от высоты контента и не требует измерений в JS',
        'Прогресс-рейл под шапкой заполняется по мере прокрутки, от мятного к коралловому',
        'Только светлая тема — по смыслу: утреннее небо и лёгкость темы перелёта',
        'На мобильных линия маршрута скрывается, чтобы не мешать чтению',
      ],
      en: [
        'A continuous "route line" running through the background of all eight blocks — an SVG pattern that does not depend on content height and needs no JS measurement',
        'The progress rail under the header fills as you scroll, from mint to coral',
        'Light theme only, and deliberately so: morning sky and the lightness of the flight theme',
        'On mobile the route line is hidden so it does not interfere with reading',
      ],
    },
    cover: {
      src: '/media/relokant/cover.png',
      width: 2160,
      height: 1350,
      alt: {
        ru: 'Первый экран «Релоканта»: рассветное небо, облака и пунктирный маршрут перелёта',
        en: 'The first screen of Relokant: dawn sky, clouds and a dotted flight path',
      },
    },
    gallery: [
      {
        src: '/media/relokant/desktop-2.png',
        width: 2160,
        height: 1350,
        alt: { ru: 'Карточки-билеты с шагами чек-листа', en: 'Boarding-pass cards with the checklist steps' },
        caption: {
          ru: 'Каждый шаг — посадочный талон с корешком, линией отрыва и номером',
          en: 'Each step is a boarding pass with a stub, a tear line and a number',
        },
      },
      {
        src: '/media/relokant/mobile.png',
        width: 1170,
        height: 2532,
        alt: { ru: 'Чек-лист на экране телефона', en: 'The checklist on a phone screen' },
      },
    ],
  },
  {
    slug: 'stroy-opora',
    section: 'landings',
    order: 3,
    year: 2026,
    tech: ['HTML', 'CSS', 'JavaScript'],
    title: { ru: 'ОПОРА — строительная компания', en: 'OPORA — construction company' },
    role: { ru: 'Дизайн и вёрстка', en: 'Design and front-end' },
    teaser: {
      ru: 'Лендинг строительной компании в эстетике чертежа: бумага, тушь и синька вместо привычного глянца.',
      en: 'A construction-company landing in blueprint aesthetics: paper, ink and cyanotype instead of the usual gloss.',
    },
    summary: {
      ru: 'Одностраничный сайт, целиком собранный в одном файле — стили и скрипты внутри, внешних зависимостей нет. Визуальный язык взят из строительной документации: тёплая бумага, тёмная тушь, вставки цвета синьки и рыжий акцент. Секции ведут читателя по логике сделки: принципы, ведомость работ, ход стройки, сданные объекты, отзывы, контакты.',
      en: 'A single-page site assembled entirely in one file — styles and scripts inline, no external dependencies. The visual language is taken from construction paperwork: warm paper, dark ink, cyanotype panels and a rust-orange accent. The sections walk the reader through the logic of a deal: principles, schedule of works, how the build proceeds, completed objects, testimonials, contacts.',
    },
    highlights: {
      ru: [
        'Тёмная и светлая тема на CSS-переменных, светлая следует системной настройке',
        'Типографика на системных шрифтах: сайт не тянет ни одного килобайта со стороны',
        'Блоки-«синьки» с чертёжной сеткой как визуальный ритм между светлыми секциями',
      ],
      en: [
        'Dark and light themes on CSS custom properties, the light one following the system setting',
        'Typography on system fonts: the site pulls not a single kilobyte from anywhere else',
        'Cyanotype panels with a drafting grid provide the visual rhythm between light sections',
      ],
    },
    cover: {
      src: '/media/stroy-opora/cover.png',
      width: 2160,
      height: 1350,
      alt: {
        ru: 'Первый экран сайта ОПОРА в эстетике строительного чертежа',
        en: 'The first screen of the OPORA site in construction-blueprint aesthetics',
      },
    },
    gallery: [
      {
        src: '/media/stroy-opora/desktop-2.png',
        width: 2160,
        height: 1350,
        alt: { ru: 'Ведомость работ и ход стройки', en: 'Schedule of works and build progress' },
        caption: {
          ru: 'Секции ведут читателя по логике сделки: от принципов до сданных объектов',
          en: 'The sections walk the reader through the logic of a deal, from principles to completed objects',
        },
      },
      {
        src: '/media/stroy-opora/mobile.png',
        width: 1170,
        height: 2532,
        alt: { ru: 'Сайт на экране телефона', en: 'The site on a phone screen' },
      },
    ],
  },

  /* ------------------------------------------------------------ Веб-сайты */
  {
    slug: 'chto-prigotovit',
    section: 'websites',
    featured: true,
    order: 1,
    year: 2026,
    tech: ['JavaScript', 'HTML', 'CSS', 'Node.js'],
    title: { ru: 'Что приготовить', en: 'What to Cook' },
    role: { ru: 'Автор проекта', en: 'Sole author' },
    teaser: {
      ru: 'Отмечаете продукты, которые есть дома, — сайт показывает, что можно готовить прямо сейчас и чего не хватает.',
      en: 'Tick the products you have at home — the site shows what you can cook right now and what is missing.',
    },
    summary: {
      ru: 'Веб-приложение для подбора рецептов по содержимому холодильника. Собранный файл полностью автономен: шрифты, стили, скрипт и база рецептов лежат внутри одного HTML — он работает без интернета, достаточно открыть его в браузере. Список продуктов хранится только в браузере и никуда не отправляется.',
      en: 'A web app that matches recipes to what is in your fridge. The built file is fully self-contained: fonts, styles, script and the recipe database all live inside one HTML file — it works offline, you just open it in a browser. Your product list stays in the browser and is never sent anywhere.',
    },
    highlights: {
      ru: [
        '93 рецепта и 137 продуктов в каталоге по 12 категориям',
        'Замены: нет бекона, но есть ветчина — рецепт всё равно соберётся, замена отмечена в карточке',
        'Поиск с автодополнением и синонимами: «картошка» находит картофель, «tomatoes» и «помидоры» — одна и та же запись',
        'Свои рецепты и продукты добавляются прямо на сайте, редактировать файлы не нужно',
        'Два языка целиком, включая всю базу; ключи данных всегда русские, поэтому переключение языка не ломает сохранённое',
        'Сборка падает, если что-то не переведено или разошлось число шагов — база не может разъехаться незаметно',
      ],
      en: [
        '93 recipes and 137 products in a catalogue across 12 categories',
        'Substitutions: no bacon but you have ham — the recipe still comes together, with the swap flagged on the card',
        'Search with autocomplete and synonyms: both "tomatoes" and the Russian "помидоры" resolve to the same entry',
        'Your own recipes and products are added right on the site, with no file editing',
        'Both languages in full, database included; the data keys stay Russian, so switching language never breaks what you saved',
        'The build fails if anything is untranslated or the step counts diverge — the database cannot drift apart unnoticed',
      ],
    },
    cover: {
      src: '/media/chto-prigotovit/cover.png',
      width: 2160,
      height: 1350,
      alt: {
        ru: 'Главный экран «Что приготовить» с каталогом продуктов',
        en: 'The main screen of “What to Cook” with the product catalogue',
      },
    },
    gallery: [
      {
        src: '/media/chto-prigotovit/desktop-2.png',
        width: 2160,
        height: 1350,
        alt: { ru: 'Подобранные рецепты', en: 'Matched recipes' },
        caption: {
          ru: 'Результат разложен на группы: что готовится сейчас, чего не хватает и что почти получится',
          en: 'Results are grouped: what you can cook now, what is missing and what almost works',
        },
      },
      {
        src: '/media/chto-prigotovit/mobile.png',
        width: 1170,
        height: 2532,
        alt: { ru: 'Приложение на экране телефона', en: 'The app on a phone screen' },
      },
    ],
  },

  /* -------------------------------------------------- Мобильные приложения */
  {
    slug: 'chto-prigotovit-android',
    section: 'mobile-apps',
    featured: true,
    order: 1,
    year: 2026,
    tech: ['Kotlin', 'Android SDK', 'Gradle', 'R8'],
    title: { ru: 'Что приготовить — Android', en: 'What to Cook — Android' },
    role: { ru: 'Автор проекта', en: 'Sole author' },
    teaser: {
      ru: 'Тот же подбор рецептов, но родным приложением: 1,5 МБ, полностью офлайн, без единого разрешения.',
      en: 'The same recipe matching as a native app: 1.5 MB, fully offline, and not a single permission requested.',
    },
    summary: {
      ru: 'Android-версия «Что приготовить» на Kotlin. Работает полностью офлайн и не запрашивает разрешений — доступа в интернет нет даже в манифесте: база лежит в ассетах, свои рецепты в файле во внутренней памяти, корзина в настройках приложения. Рецепты и каталог общие с веб-версией, база собирается из одного источника.',
      en: 'The Android build of “What to Cook”, written in Kotlin. Fully offline and permission-free — there is no internet access even in the manifest: the database sits in assets, your own recipes in a file in internal storage, the basket in app preferences. Recipes and catalogue are shared with the web version and built from a single source.',
    },
    highlights: {
      ru: [
        'APK 1,5 МБ: R8 с обфускацией, вырезание ресурсов, только два языка в сборке',
        'Целые числа вместо строк: попадание продукта в корзину — обращение к булеву массиву по индексу, а не сравнение строк',
        'Параллельные массивы вместо объектов — меньше нагрузки на сборщик мусора при прокрутке',
        'Двухфазный подбор: сортировка считает только счётчики, подробный разбор — лишь для карточек на экране',
        'Потоковый разбор базы через JsonReader: строки второго языка пропускаются на лету и не попадают в память',
        'Полностью векторная адаптивная иконка — ни одного PNG под плотности экрана',
      ],
      en: [
        'A 1.5 MB APK: R8 with obfuscation, resource shrinking, only two languages bundled',
        'Integers instead of strings: checking a product against the basket is an indexed lookup in a boolean array, not a string comparison',
        'Parallel arrays instead of objects — less pressure on the garbage collector while scrolling',
        'Two-phase matching: sorting only counts shortfalls, the detailed breakdown runs solely for cards actually on screen',
        'Streaming database parsing via JsonReader: second-language strings are skipped on the fly and never reach memory',
        'A fully vector adaptive icon — no per-density PNGs at all',
      ],
    },
  },
];

export function projectsInSection(section: string): Project[] {
  return PROJECTS.filter((p) => p.section === section).sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999),
  );
}

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export const FEATURED = PROJECTS.filter((p) => p.featured);
