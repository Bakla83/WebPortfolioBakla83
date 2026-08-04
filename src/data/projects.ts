import type { Project } from './types';

/**
 * Локальное наполнение сайта.
 *
 * Это же содержимое дублируется схемой Sanity (см. studio/): когда CMS
 * подключена, данные берутся оттуда, а этот файл остаётся страховкой —
 * сайт соберётся, даже если CMS недоступна. См. src/lib/content.ts.
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
        'Четырк языка: русский, английский, испанский, французский',
      ],
      en: [
        'Hand-drawn locations and a cinematic soundtrack',
        'Puzzles and mini-games woven into the exploration',
        'A story grounded in the real history of censorship',
        'Four languages: Russian, English, Spanish, French',
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
        src: '/media/the-hidden-library/shot-2.png',
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
      {
        src: '/media/the-hidden-library/shot-5.png',
        width: 1920,
        height: 1080,
        alt: { ru: 'Кадр из игры', en: 'In-game scene' },
      },
      {
        src: '/media/the-hidden-library/shot-6.png',
        width: 1920,
        height: 1080,
        alt: { ru: 'Кадр из игры', en: 'In-game scene' },
      },
      {
        src: '/media/the-hidden-library/shot-7.jpg',
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
      ru: 'Горный козёл спускается за солью и должен вернуться к стаду живым. Чем ниже — тем более ценные минералы можно найти, но и тем выше шанс встретить хищника.',
      en: 'A mountain goat descends for salt and has to make it back to the herd alive. The deeper you go, the more valuable minerals you can find, but the higher the chance of encountering a predator.',
    },
    summary: {
      ru: 'Аркада на TypeScript и Canvas без игрового движка: портретный экран, управление тапами и свайпами. Спуск быстрый и почти свободный, а обратная дорога тяжёлая — вверх ведут только прыжки и стены, за которые козёл цепляется копытами. Асимметрия возникает сама из физики, без отдельной «механики подъёма».',
      en: 'An arcade game in TypeScript and Canvas with no game engine: portrait screen, taps and swipes for control. The descent is fast and almost free, the way back is hard — you only get up by jumping and clinging to walls. The asymmetry falls out of the physics itself, with no separate "climbing mechanic".',
    },
    highlights: {
      ru: [
        'Мир собирается не шумом, а вертикальной лентой из выверенных вручную фрагментов — случайность отвечает только за порядок',
        'Проходимость доказывается графом: после каждого фрагмента сборщик проверяет участок и чинит тупики',
        'Хищник ищет путь по рельефу алгоритмом Дейкстры — подъём стоит дороже спуска, поэтому зверь не лезет вверх без причины',
        'Обучение встроено в первый спуск: подсказка появляется там, где рельеф уже требует навыка',
      ],
      en: [
        'The world is assembled not from noise but as a vertical ribbon of hand-tuned fragments — randomness only decides the order',
        'Traversability is proven by a graph, not by eye: after every fragment the builder checks the stretch and repairs dead ends',
        'The predator routes over the terrain with Dijkstra — climbing costs more than descending, so it never goes up without reason',
        'The tutorial is built into the first descent: each hint appears where the terrain already demands the skill',
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
       {
        src: '/media/salt-run/mobile2.png',
        width: 1170,
        height: 2532,
        alt: { ru: 'Игра на экране телефона', en: 'The game on a phone screen' },
        caption: {
          ru: 'Портретный экран: игра рассчитана на телефон и управляется одной рукой',
          en: 'Portrait screen: the game is built for a phone and played one-handed',
        },
      },
       {
        src: '/media/salt-run/mobile3.png',
        width: 1170,
        height: 2532,
        alt: { ru: 'Игра на экране телефона', en: 'The game on a phone screen' },
        caption: {
          ru: 'Портретный экран: игра рассчитана на телефон и управляется одной рукой',
          en: 'Portrait screen: the game is built for a phone and played one-handed',
        },
      },
    ],
    demo: {
      src: '/play/salt-run/index.html',
      // Игра портретная — в широкой рамке она смотрелась бы полоской
      // по центру серого поля.
      ratio: '10 / 16',
      maxWidth: '420px',
      note: {
        ru: 'Тап — прыжок, свайп вниз — быстрый спуск. Игра рассчитана на телефон, поэтому рамка вертикальная.',
        en: 'Tap to jump, swipe down to drop faster. The game is built for a phone, hence the portrait frame.',
      },
    },
    links: [{ kind: 'live', url: '/play/salt-run/index.html' }],
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
      ru: 'Лендинг на чистых HTML, CSS и JavaScript — без сборки и зависимостей, разворачивается на любом статическом хостинге.',
      en: 'A landing page in plain HTML, CSS and JavaScript — no build step, no dependencies, deployable to any static host.',
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
    demo: {
      src: '/play/hrebet/index.html',
      note: {
        ru: 'Внутри рабочие переключатели темы и языка — сайт двуязычный и имеет светлую тему.',
        en: 'The theme and language switches inside are live — the site is bilingual and has a light theme.',
      },
    },
    links: [{ kind: 'live', url: '/play/hrebet/index.html' }],
  },
  {
    slug: 'pervotsvet',
    section: 'landings',
    order: 2,
    year: 2026,
    tech: ['HTML', 'CSS', 'JavaScript', 'Canvas', 'SVG'],
    title: { ru: 'Первоцвет — цветочная мастерская', en: 'Primrose — a flower workshop' },
    role: { ru: 'Дизайн и вёрстка', en: 'Design and front-end' },
    teaser: {
      ru: 'Лендинг цветочной мастерской с живым фоном: лепестки разлетаются от курсора, трава внизу раздвигается, а по клику распускается цветок.',
      en: 'A flower workshop landing with a living background: petals scatter away from the cursor, the grass parts under your hand, and a click makes a flower open.',
    },
    summary: {
      ru: 'Одностраничный сайт вымышленной мастерской, где фон — не картинка, а четыре системы на одном canvas: падающие лепестки, светящаяся пыльца, трава у нижнего края и цветение по клику. Лепестки расталкиваются курсором, пыльца наоборот к нему тянется, прокрутка добавляет порыв ветра. Три палитры настроения перекрашивают и вёрстку, и фон разом — цвета лежат в CSS-переменных, и canvas читает их оттуда же.',
      en: 'A single-page site for an imaginary workshop where the background is not a picture but four systems on one canvas: falling petals, glowing pollen, grass along the bottom edge and a bloom on click. Petals are pushed away by the cursor, pollen is drawn towards it, and scrolling adds a gust of wind. Three mood palettes repaint the layout and the background at once — the colours live in CSS variables, and the canvas reads them from there.',
    },
    highlights: {
      ru: [
        'Фон реагирует на человека: курсор расталкивает лепестки и раздвигает траву, пыльца собирается вокруг ладони, резкая прокрутка поднимает ветер',
        'Конструктор букета: цветы добавляются по одному, веер в вазе перестраивается плавно, цена считается на лету, готовый состав переносится в форму заявки',
        'Восемь сортов цветов нарисованы кодом — ни одной растровой картинки, поэтому смена палитры ничего не стоит',
        'Кнопка «приглушить движение» рядом с языком: фон замирает на одном кадре, выбор запоминается и включается сам при системной настройке',
        'Две языковые версии целиком, включая цены отдельными суммами для рублей и долларов',
      ],
      en: [
        'The background responds to the person: the cursor pushes petals aside and parts the grass, pollen gathers around your hand, a sharp scroll raises the wind',
        'A bouquet builder: flowers are added one at a time, the fan in the vase rearranges smoothly, the price updates live, and the finished mix is carried into the order form',
        'Eight flower varieties are drawn in code — not a single raster image, which is what makes repainting the palette free',
        'A "calm the motion" button next to the language switch: the background freezes on one frame, the choice is remembered and turns itself on for the system setting',
        'Both language versions in full, prices included as separate amounts for roubles and dollars',
      ],
    },
    cover: {
      src: '/media/pervotsvet/cover.png',
      width: 2160,
      height: 1350,
      alt: {
        ru: 'Первый экран «Первоцвета»: крупный заголовок, летящие лепестки и трава внизу',
        en: 'The first screen of Primrose: a large headline, drifting petals and grass along the bottom',
      },
    },
    gallery: [
      {
        src: '/media/pervotsvet/desktop-2.png',
        width: 2160,
        height: 1350,
        alt: { ru: 'Каталог готовых букетов', en: 'The catalogue of ready-made bouquets' },
        caption: {
          ru: 'Букеты в каталоге собраны из тех же нарисованных кодом цветов, что и остальной сайт',
          en: 'The catalogue bouquets are assembled from the same code-drawn flowers as the rest of the site',
        },
      },
      {
        src: '/media/pervotsvet/desktop-3.png',
        width: 2160,
        height: 1350,
        alt: { ru: 'Конструктор букета и подсчёт цены', en: 'The bouquet builder and the running total' },
        caption: {
          ru: 'Конструктор: цветы добавляются по одному, ваза перестраивает веер, цена пересчитывается сразу',
          en: 'The builder: flowers go in one at a time, the vase rearranges the fan, the price recalculates at once',
        },
      },
      {
        src: '/media/pervotsvet/mobile.png',
        width: 1170,
        height: 2532,
        alt: { ru: 'Лендинг на экране телефона', en: 'The landing on a phone screen' },
      },
    ],
    demo: {
      src: '/play/pervotsvet/index.html',
      note: {
        ru: 'Поводите курсором по фону и кликните по пустому месту. Палитру можно сменить в разделе «Палитра», язык и движение фона — в шапке.',
        en: 'Move the cursor across the background and click an empty spot. The palette can be changed in the "Palette" section; language and background motion live in the header.',
      },
    },
    links: [{ kind: 'live', url: '/play/pervotsvet/index.html' }],
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
    demo: {
      src: '/play/stroy-opora/index.html',
    },
    links: [{ kind: 'live', url: '/play/stroy-opora/index.html' }],
  },
  {
    slug: 'kluchi-ot-goroda',
    section: 'landings',
    order: 4,
    year: 2026,
    tech: ['HTML', 'CSS', 'JavaScript', 'SVG'],
    title: { ru: 'Ключи от города — трансферы и экскурсии', en: 'City Keys — transfers and tours' },
    role: { ru: 'Дизайн и вёрстка', en: 'Design and front-end' },
    teaser: {
      ru: 'Лендинг сочинской трансферной компании: табло прилёта в заголовке, живой расчёт цены поездки и маршруты, по которым едет машина.',
      en: 'A landing for a Sochi transfer company: an arrivals board in the headline, a live price calculator and routes the car actually drives along.',
    },
    summary: {
      ru: 'Компания встречает людей в аэропорту, возит по городу и проводит экскурсии — и вся стилистика взята у аэропортовой навигации: крупная типографика указателей, моноширинные коды и времена, пунктирные маршруты, сигнальный жёлтый на тёмно-синем. Итог расчёта оформлен как посадочный купон, потому что именно его человек будет сверять с подтверждением заказа. Ночная тема здесь не украшение: половина рейсов приходит затемно, и сайт открывают уже в такси.',
      en: 'The company meets people at the airport, drives them around the city and runs tours — and the whole visual language is borrowed from airport wayfinding: large signage type, monospaced codes and times, dotted routes, signal yellow on deep navy. The price summary is laid out as a boarding stub, because that is what the customer will check against the confirmation. The night theme is not decoration: half the flights land after dark, and the site gets opened in the taxi.',
    },
    highlights: {
      ru: [
        'Табло прилёта в заголовке: строка перещёлкивает три обещания, буквы перебираются волной слева направо',
        'Расчёт трансфера считается на лету — класс машины подбирается по числу людей и чемоданов, ночной тариф включается с 23:00, готовый расчёт переносится в форму заявки',
        'Самолёт и машина идут по кривым через getPointAtLength: точно по линии и с поворотом по касательной, а не по приблизительной траектории',
        'Дневная и ночная темы на одном наборе токенов; табло и фирменный знак остаются тёмными в обеих — иначе получился бы жёлтый по белому',
        'Две языковые версии целиком, включая подписи времени на шагах и формат суммы',
      ],
      en: [
        'An arrivals board in the headline: the line flips between three promises, the letters turning in a wave from left to right',
        'The transfer price is calculated live — the car class follows the number of people and suitcases, the night rate kicks in at 23:00, and the finished quote is carried into the booking form',
        'The plane and the car follow their curves via getPointAtLength: exactly along the line and turned along the tangent, not on an approximated path',
        'Day and night themes on one set of tokens; the board and the logo mark stay dark in both — otherwise it would be yellow on white',
        'Both language versions in full, down to the step timings and the currency format',
      ],
    },
    cover: {
      src: '/media/kluchi-ot-goroda/cover.png',
      width: 2160,
      height: 1188,
      alt: {
        ru: 'Первый экран: заголовок с табло прилёта и дуга перелёта справа',
        en: 'The first screen: the headline with the arrivals board and the flight arc on the right',
      },
    },
    gallery: [
      {
        src: '/media/kluchi-ot-goroda/desktop-2.png',
        width: 2160,
        height: 1350,
        alt: { ru: 'Калькулятор трансфера и купон с итогом', en: 'The transfer calculator and the price stub' },
        caption: {
          ru: 'Цена собирается построчно: поездка, ночной тариф, кресло — и сразу видно, какую машину подобрали',
          en: 'The price adds up line by line: the ride, the night rate, the child seat — and which car was selected',
        },
      },
      {
        src: '/media/kluchi-ot-goroda/desktop-3.png',
        width: 2160,
        height: 1350,
        alt: { ru: 'Экскурсии с фильтром по направлению', en: 'Tours with a filter by direction' },
        caption: {
          ru: 'Маршрут каждой экскурсии показан точками на линии — так же, как схема на остановке',
          en: 'Each tour route is shown as dots on a line, the way a diagram at a stop would',
        },
      },
      {
        src: '/media/kluchi-ot-goroda/desktop-4.png',
        width: 2160,
        height: 1350,
        alt: { ru: 'Ночная тема', en: 'The night theme' },
        caption: {
          ru: 'Ночная тема для тех, кто открывает сайт после посадки в темноте',
          en: 'The night theme, for whoever opens the site after landing in the dark',
        },
      },
      {
        src: '/media/kluchi-ot-goroda/mobile.png',
        width: 1170,
        height: 2532,
        alt: { ru: 'Лендинг на экране телефона', en: 'The landing on a phone screen' },
      },
    ],
    demo: {
      src: '/play/kluchi-ot-goroda/index.html',
      note: {
        ru: 'Попробуйте сменить район и время прилёта в расчёте — цена и класс машины меняются сразу. Тема и язык переключаются в шапке.',
        en: 'Try changing the district and the landing time in the calculator — the price and the car class react at once. Theme and language switch in the header.',
      },
    },
    links: [{ kind: 'live', url: '/play/kluchi-ot-goroda/index.html' }],
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
    demo: {
      src: '/play/chto-prigotovit/index.html',
      note: {
        ru: 'Отметьте продукты, которые есть дома, — подбор рецептов работает прямо в рамке.',
        en: 'Tick the ingredients you have at home — the recipe matching works right inside the frame.',
      },
    },
    links: [{ kind: 'live', url: '/play/chto-prigotovit/index.html' }],
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
  /* ----------------------------------------------------------- 3D-модели */
  {
    slug: 'beetle',
    section: 'models-3d',
    featured: true,
    order: 1,
    year: 2025,
    tech: ['Blender', 'Cycles', 'Моделирование', 'Материалы'],
    title: { ru: 'Жук-олень', en: 'Stag Beetle' },
    teaser: {
      ru: 'Стилизованный жук с ветвистыми рогами и золотыми крыльями на низкополигональном ледяном фоне.',
      en: 'A stylised beetle with branching antlers and gold wings against a low-poly icy backdrop.',
    },
    summary: {
      ru: 'Модель существа в фиолетово-золотой гамме: ветвистые рога, надкрылья с текучими разводами и раскрытые нижние крылья с золотой сеткой жилок. Фон набран крупными гранями намеренно — резкая огранка льда контрастирует с плавностью самого жука и удерживает на нём внимание, хотя занимает почти весь кадр.',
      en: 'A creature model in purple and gold: branching antlers, elytra with flowing marbled patterns and spread lower wings veined in gold. The faceted background is deliberate — the sharp cut of the ice contrasts with the smoothness of the beetle and keeps attention on it, even though it fills most of the frame.',
    },
    cover: {
      src: '/media/renders/beetle/cover.webp',
      width: 900,
      height: 900,
      alt: {
        ru: 'Фиолетово-золотой жук с ветвистыми рогами на фоне гранёного льда',
        en: 'A purple and gold beetle with branching antlers against faceted ice',
      },
    },
    gallery: [
      {
        src: '/media/renders/beetle/full.webp',
        width: 1080,
        height: 1080,
        alt: { ru: 'Жук-олень, рендер целиком', en: 'Stag beetle, full render' },
      },
    ],
  },
  {
    slug: 'eclipse',
    section: 'models-3d',
    order: 2,
    year: 2025,
    tech: ['Blender', 'Ландшафт', 'Освещение', 'Атмосфера'],
    title: { ru: 'Затмение', en: 'Eclipse' },
    teaser: {
      ru: 'Солнечное затмение над горным хребтом и водой — этюд на свет и силуэт.',
      en: 'A solar eclipse over a mountain ridge and water — a study in light and silhouette.',
    },
    summary: {
      ru: 'Пейзаж, построенный почти целиком на освещении. Корона затмения — единственный жёсткий источник света, всё остальное уходит в силуэт. Дымка над хребтом разводит планы по глубине, а дорожка бликов на воде связывает передний план с источником света и не даёт нижней половине кадра распасться.',
      en: 'A landscape built almost entirely on lighting. The eclipse corona is the only hard light source; everything else falls into silhouette. Haze over the ridge separates the planes by depth, and the trail of highlights on the water ties the foreground back to the light source so the lower half of the frame holds together.',
    },
    cover: {
      src: '/media/renders/eclipse/cover.webp',
      width: 900,
      height: 506,
      alt: {
        ru: 'Солнечное затмение над тёмным горным хребтом, блики на воде',
        en: 'A solar eclipse over a dark mountain ridge, highlights on the water',
      },
    },
    gallery: [
      {
        src: '/media/renders/eclipse/full.webp',
        width: 1920,
        height: 1080,
        alt: { ru: 'Затмение, рендер целиком', en: 'Eclipse, full render' },
      },
    ],
  },
  {
    slug: 'sci-fi-pistol',
    section: 'models-3d',
    order: 3,
    year: 2025,
    tech: ['Blender', 'Hard surface', 'Игровой ассет', 'Текстуры'],
    title: { ru: 'Фантастический пистолет', en: 'Sci-Fi Pistol' },
    teaser: {
      ru: 'Игровой ассет: гранёный корпус, баллон вместо магазина и бирюзовый прицел.',
      en: 'A game asset: faceted body, a canister instead of a magazine and a turquoise sight.',
    },
    summary: {
      ru: 'Оружейный ассет в жанре hard surface: гранёный корпус с рёбрами охлаждения, откидной рычаг и красный баллон на месте привычного магазина. Модель собиралась с расчётом на игровой движок — плотность сетки держится низкой, а детализация вынесена в материалы, а не в геометрию.',
      en: 'A hard-surface weapon asset: a faceted body with cooling ribs, a hinged lever and a red canister where the magazine would normally sit. The model was built with a game engine in mind — the mesh stays light, and detail lives in the materials rather than the geometry.',
    },
    cover: {
      src: '/media/renders/sci-fi-pistol/cover.webp',
      width: 900,
      height: 506,
      alt: {
        ru: 'Тёмный фантастический пистолет с красным баллоном и бирюзовым прицелом',
        en: 'A dark sci-fi pistol with a red canister and a turquoise sight',
      },
    },
    gallery: [
      {
        src: '/media/renders/sci-fi-pistol/full.webp',
        width: 1920,
        height: 1080,
        alt: { ru: 'Пистолет, рендер целиком', en: 'Pistol, full render' },
      },
    ],
  },
  {
    slug: 'sea-boat',
    section: 'models-3d',
    order: 4,
    year: 2024,
    tech: ['Blender', 'Toon shading', 'Моделирование', 'Освещение'],
    title: { ru: 'Лодка в море', en: 'Sea Boat' },
    teaser: {
      ru: 'Деревянная лодка с полосатым парусом в открытом море, рисованная подача с обводкой.',
      en: 'A wooden boat with a striped sail on the open sea, drawn with a toon outline.',
    },
    summary: {
      ru: 'Сцена в мультипликационной подаче: вместо фотореализма — toon-шейдинг с контурной обводкой и плоскими заливками. Вся геометрия предельно простая, объём держится на другом: кучевых облаках, градиенте неба от бирюзы к дымке у горизонта и полосе ряби, отделяющей дальнюю воду от ближней.',
      en: 'A scene in a cartoon register: instead of photorealism, toon shading with outlines and flat fills. The geometry is deliberately simple — depth comes from elsewhere: cumulus clouds, a sky gradient from turquoise to haze at the horizon, and a band of ripples separating far water from near.',
    },
    cover: {
      src: '/media/renders/sea-boat/cover.webp',
      width: 900,
      height: 506,
      alt: {
        ru: 'Деревянная лодка с красно-белым парусом на синей воде под облаками',
        en: 'A wooden boat with a red and white sail on blue water under clouds',
      },
    },
    gallery: [
      {
        src: '/media/renders/sea-boat/full.webp',
        width: 1920,
        height: 1080,
        alt: { ru: 'Лодка в море, рендер целиком', en: 'Sea boat, full render' },
      },
    ],
  },
  {
    slug: 'vending-machine',
    section: 'models-3d',
    order: 5,
    year: 2024,
    tech: ['Blender', 'Cel shading', 'Моделирование', 'Материалы'],
    title: { ru: 'Автомат с напитками', en: 'Drinks Vending Machine' },
    teaser: {
      ru: 'Красный торговый автомат с бутылками за стеклом, в рисованном стиле с обводкой.',
      en: 'A red vending machine with bottles behind glass, drawn with a cel-shaded outline.',
    },
    summary: {
      ru: 'Предметная модель в cel-подаче с чёрной обводкой: витрина с рядами разноцветных бутылок, панель с монетоприёмником и кнопками выдачи, брусчатое основание под корпусом. Мятный фон взят дополнительным к красному корпусу — за счёт этого объект читается силуэтом даже в миниатюре, что и нужно от предметного ассета.',
      en: 'A prop model in cel-shading with black outlines: a display of multicoloured bottles, a panel with a coin slot and dispensing buttons, and a cobbled base under the body. The mint background is the complement of the red body — which is what lets the object read as a silhouette even at thumbnail size, exactly what a prop asset needs.',
    },
    cover: {
      src: '/media/renders/vending-machine/cover.webp',
      width: 900,
      height: 900,
      alt: {
        ru: 'Красный торговый автомат с бутылками за стеклом на мятном фоне',
        en: 'A red vending machine with bottles behind glass on a mint background',
      },
    },
    gallery: [
      {
        src: '/media/renders/vending-machine/full.webp',
        width: 1080,
        height: 1080,
        alt: { ru: 'Автомат с напитками, рендер целиком', en: 'Vending machine, full render' },
      },
    ],
  },
  {
    slug: 'mine',
    section: 'models-3d',
    order: 6,
    year: 2024,
    tech: ['Blender', 'Эмиссия', 'Моделирование', 'Материалы'],
    title: { ru: 'Мина', en: 'Mine' },
    teaser: {
      ru: 'Шар с рожками, светящимися изнутри красным, на полностью чёрном фоне.',
      en: 'A sphere of horns glowing red from within, on a fully black background.',
    },
    summary: {
      ru: 'Этюд на эмиссивные материалы: тёмный шероховатый корпус, опоясанный рёбрами, и рожки, светящиеся изнутри. Внешнего освещения в сцене нет — свет идёт только от самой модели, поэтому фон уходит в абсолютно чёрный, и всё держится на контрасте матового металла с раскалённым контуром.',
      en: 'A study in emissive materials: a dark, rough body girded with ribs, and horns lit from within. There is no external light in the scene — all of it comes from the model itself, so the background falls to pure black and the whole image rests on the contrast between matte metal and a red-hot outline.',
    },
    cover: {
      src: '/media/renders/mine/cover.webp',
      width: 900,
      height: 900,
      alt: {
        ru: 'Тёмный шар с рожками, светящимися красным, на чёрном фоне',
        en: 'A dark sphere with red-glowing horns on a black background',
      },
    },
    gallery: [
      {
        src: '/media/renders/mine/full.webp',
        width: 1080,
        height: 1080,
        alt: { ru: 'Мина, рендер целиком', en: 'Mine, full render' },
      },
    ],
  },
  {
    slug: 'dream-place',
    section: 'models-3d',
    order: 7,
    year: 2023,
    tech: ['Blender', 'Архитектура', 'Освещение', 'Туман'],
    title: { ru: 'Место из сна', en: 'Place From Dream' },
    teaser: {
      ru: 'Пятиярусная пагода в тумане, со светящимся кольцом-порталом на верхнем ярусе.',
      en: 'A five-tier pagoda in fog, with a glowing ring-portal on the upper tier.',
    },
    summary: {
      ru: 'Архитектурная сцена: пятиярусная пагода с изогнутыми крышами, золотым шпилем и красными опорами. Туман скрывает и основание, и горы вокруг, оставляя постройку висеть в белёсой пустоте. Холодное свечение кольца на верхнем ярусе — единственное цветное пятно в приглушённом кадре, и взгляд идёт к нему сразу.',
      en: 'An architectural scene: a five-tier pagoda with curved roofs, a gold spire and red posts. Fog hides both the base and the mountains around it, leaving the structure suspended in whiteness. The cold glow of the ring on the upper tier is the only patch of colour in an otherwise muted frame, and the eye goes straight to it.',
    },
    cover: {
      src: '/media/renders/dream-place/cover.webp',
      width: 900,
      height: 900,
      alt: {
        ru: 'Пятиярусная пагода в тумане со светящимся кольцом на верхнем ярусе',
        en: 'A five-tier pagoda in fog with a glowing ring on the upper tier',
      },
    },
    gallery: [
      {
        src: '/media/renders/dream-place/full.webp',
        width: 1080,
        height: 1080,
        alt: { ru: 'Место из сна, рендер целиком', en: 'Place From Dream, full render' },
      },
    ],
  },
];
