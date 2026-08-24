import type { Project } from './types';

export const PROJECTS: Project[] = [

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
        'Четыре языка: русский, английский, испанский, французский',
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

  {
    slug: 'salt-run',
    section: 'web-games',
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

      ratio: '10 / 16',
      maxWidth: '420px',
      note: {
        ru: 'Тап — прыжок, свайп вниз — быстрый спуск. Игра рассчитана на телефон, поэтому рамка вертикальная.',
        en: 'Tap to jump, swipe down to drop faster. The game is built for a phone, hence the portrait frame.',
      },
    },
    links: [{ kind: 'live', url: '/play/salt-run/index.html' }],
  },

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
    slug: 'centipede-repaints',
    section: 'landings',
    featured: true,
    order: 2,
    year: 2026,
    tech: ['HTML', 'CSS', 'JavaScript', 'SVG', 'Canvas'],
    title: {
      ru: 'Centipede Repaints — перекрас конных миниатюр',
      en: 'Centipede Repaints — custom model horse repaints',
    },
    role: { ru: 'Дизайн и вёрстка', en: 'Design and front-end' },
    teaser: {
      ru: 'Лендинг художницы, которая перекрашивает модели лошадей. В студии перекраса масть собирается по частям, и модель перекрашивается на глазах.',
      en: 'A landing for an artist who repaints model horses. In the repaint studio a coat is assembled piece by piece and the model changes colour as you watch.',
    },
    summary: {
      ru: 'Первая работа в портфолио для настоящего заказчика: фотографии, клички моделей и текст о себе — авторские. Смысловой центр страницы — студия перекраса, где масть, отметина на морде, белые ноги и постановка переключаются по отдельности, а лошадь перерисовывается мгновенно. Сама лошадь нарисована кодом: один силуэт, десять мастей и многослойная светотень внутри маски по контуру — ровно так же тень кладут аэрографом на настоящей модели. Отдельный раздел отдан «Зите» — модели, которую художница разработала сама: нарисованное превью и два перекраса одной и той же скульптуры.',
      en: 'The first piece in this portfolio made for a real client: the photographs, the model names and the artist statement are hers. The centre of the page is the repaint studio, where coat, face marking, white legs and stance are switched independently and the horse is redrawn instantly. The horse itself is drawn in code: one silhouette, ten coats and layered shading inside a mask that follows the outline — the same way an airbrush lays shadow on a real model. A separate section belongs to Zita, a model the artist sculpted herself: a drawn preview and two repaints of the same sculpture.',
    },
    highlights: {
      ru: [
        'Студия перекраса: четыре независимых переключателя, мгновенная перерисовка и карточка модели, которая копируется в буфер — заказчику остаётся вставить готовый текст в сообщение',
        'Лошадь нарисована кодом, а не картинкой: один силуэт даёт десять мастей в трёх местах страницы, а пропорции заданы анатомической сеткой — глубина корпуса равна длине ноги от локтя до земли',
        'Объём даёт не заливка, а светотень: размытые пятна тени в паху, на подпруге и под гривой плюс блики по верхней линии, всё обрезано маской по силуэту',
        'Грива и хвост собираются из прядей поверх сплошной массы: одни пряди дают решето, одна масса — наклейку',
        'Фотографии подхватываются из папки по имени файла; если снимка нет, карточка честно показывает пустую рамку вместо выдуманной заглушки',
        'Три палитры перекрашивают и вёрстку, и пигментную взвесь на canvas — цвета лежат в CSS-переменных, и фон читает их оттуда же',
      ],
      en: [
        'The repaint studio: four independent switches, instant redraw and a model card that copies to the clipboard — the client only has to paste the finished text into a message',
        'The horse is drawn in code rather than placed as an image: one silhouette yields ten coats in three places on the page, with proportions set on an anatomical grid — body depth equals the leg from elbow to ground',
        'Volume comes from light, not flat fill: blurred shadow patches at the flank, the girth line and under the mane, plus highlights along the topline, all clipped by a mask that follows the silhouette',
        'Mane and tail are built from strands over a solid mass: strands alone read as a sieve, a mass alone as a sticker',
        'Photographs are picked up from a folder by file name; when a shot is missing the card honestly shows an empty frame instead of an invented placeholder',
        'Three palettes repaint both the layout and the pigment haze on canvas — the colours live in CSS variables and the background reads them from there',
      ],
    },
    cover: {
      src: '/media/centipede-repaints/cover.jpg',
      width: 2160,
      height: 1350,
      alt: {
        ru: 'Первый экран Centipede Repaints: крупный заголовок и растворённые силуэты лошадей',
        en: 'The first screen of Centipede Repaints: a large headline and dissolved horse silhouettes',
      },
    },
    gallery: [
      {
        src: '/media/centipede-repaints/desktop-2.jpg',
        width: 2160,
        height: 1350,
        alt: { ru: 'Галерея работ художницы', en: 'The gallery of the artist’s work' },
        caption: {
          ru: 'Восемь работ с настоящими фотографиями. Снимки показываются целиком, а не обрезаются под рамку: модель существует в одном экземпляре, и срезать ей голову ради ровной сетки нельзя',
          en: 'Eight pieces with real photographs. Shots are shown whole rather than cropped to the frame: each model exists in a single copy, and cutting off its head for the sake of a tidy grid is not an option',
        },
      },
      {
        src: '/media/centipede-repaints/desktop-3.jpg',
        width: 2160,
        height: 1350,
        alt: { ru: 'Студия перекраса', en: 'The repaint studio' },
        caption: {
          ru: 'Студия перекраса: масть, отметина, белые ноги и постановка переключаются по отдельности, под моделью собирается её карточка',
          en: 'The repaint studio: coat, marking, white legs and stance switch independently, and the model card assembles underneath',
        },
      },
      {
        src: '/media/centipede-repaints/desktop-4.jpg',
        width: 2160,
        height: 1350,
        alt: { ru: 'Раздел о модели «Зита»', en: 'The section about the Zita model' },
        caption: {
          ru: 'Зита — модель по разработке самой художницы: нарисованное превью и два перекраса одной модели',
          en: 'Zita is a model of the artist’s own design: a drawn preview and two repaints of one model',
        },
      },
      {
        src: '/media/centipede-repaints/mobile.jpg',
        width: 1170,
        height: 2532,
        alt: { ru: 'Лендинг на экране телефона', en: 'The landing on a phone screen' },
      },
    ],
    demo: {
      src: '/play/centipede-repaints/index.html',
      note: {
        ru: 'Загляните в «Студию перекраса»: переключите масть, отметину и постановку — модель перерисуется сразу. Наведение на карточку в разделе «Масти» переодевает лошадь в студии выше.',
        en: 'Look into the repaint studio: switch the coat, the marking and the stance — the model is redrawn at once. Hovering a card in the "Coats" section changes the horse in the studio above.',
      },
    },
    links: [{ kind: 'live', url: '/play/centipede-repaints/index.html' }],
  },
  {
    slug: 'pervotsvet',
    section: 'landings',
    featured: true,
    order: 3,
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
    order: 4,
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
    order: 5,
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
      src: '/media/kluchi-ot-goroda/cover-2.png',
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

  {
    slug: 'chto-prigotovit',
    section: 'websites',
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
  {
    slug: 'oktava',
    section: 'websites',
    featured: true,
    order: 2,
    year: 2026,
    tech: ['HTML', 'CSS', 'JavaScript', 'Web Audio API'],
    title: { ru: 'Октава — студия в браузере', en: 'Oktava — a studio in the browser' },
    role: { ru: 'Автор проекта', en: 'Sole author' },
    teaser: {
      ru: 'Пять инструментов, шаговый секвенсор и живая игра с клавиатуры. Готовую вещь можно сохранить на устройство файлом .wav — без регистрации и установки.',
      en: 'Five instruments, a step sequencer and live playing from the keyboard. The finished piece saves to your device as a .wav file — no sign-up, no install.',
    },
    summary: {
      ru: 'Веб-приложение, в котором собирают музыку и уносят её с собой файлом. Ни одной звуковой записи в проекте нет: пианино складывается из трёх частичных тонов, гитара считается по алгоритму Карплуса — Стронга, колокольчики построены на частотной модуляции, барабаны — из шума и синусоид с резким спадом высоты. Поэтому вся вещь весит десятки килобайт вместо десятков мегабайт и звучит сразу, без ожидания загрузки сэмплов.',
      en: 'A web app where you put music together and take it away as a file. There is not a single audio recording in the project: the piano is built from three partials, the guitar is computed with the Karplus–Strong algorithm, the bells run on frequency modulation, and the drums come from noise and sine waves with a sharp pitch drop. That is why the whole thing weighs tens of kilobytes instead of tens of megabytes and sounds the moment you press a key.',
    },
    highlights: {
      ru: [
        'Сведение в .wav целиком в браузере: OfflineAudioContext считает вещь быстрее реального времени, кодировщик формата умещается в двадцать строк без единой зависимости',
        'Расписание нот идёт по часам звуковой карты, а не по таймерам — setTimeout плавает на десятки миллисекунд, и на слух это разъезжающийся ритм',
        'Живая игра мышью или клавишами компьютера; с включённой записью сыгранное само встаёт в сетку, притянувшись к ближайшему шагу',
        'Строй — минорная пентатоника: в ней почти нет фальшивых сочетаний, и человек без музыкального образования собирает что-то приятное с первого раза',
        'Проект сохраняется отдельным файлом и открывается обратно; на сервер не уходит ничего',
      ],
      en: [
        'Mixdown to .wav entirely in the browser: OfflineAudioContext renders faster than real time and the format encoder fits in twenty lines with no dependencies',
        'Notes are scheduled against the audio clock rather than timers — setTimeout drifts by tens of milliseconds, which the ear hears as a falling-apart beat',
        'Live playing with the mouse or the computer keys; with recording on, what you play lands in the grid snapped to the nearest step',
        'The scale is a minor pentatonic: it has almost no sour combinations, so someone with no musical training puts together something pleasant on the first try',
        'The project saves as its own file and opens back up; nothing is sent to a server',
      ],
    },
    cover: {
      src: '/media/oktava/cover.png',
      width: 2160,
      height: 1350,
      alt: {
        ru: 'Студия: транспорт, дорожки инструментов и сетка секвенсора с набранной партией',
        en: 'The studio: transport, instrument tracks and the sequencer grid with a part written in',
      },
    },
    gallery: [
      {
        src: '/media/oktava/desktop-2.png',
        width: 2160,
        height: 1350,
        alt: { ru: 'Барабанная дорожка и живая клавиатура', en: 'The drum track and the live keyboard' },
        caption: {
          ru: 'У каждого инструмента свой цвет — он тянется через вкладку, клетки сетки и клавиши',
          en: 'Each instrument has its own colour, carried through the tab, the grid cells and the keys',
        },
      },
      {
        src: '/media/oktava/desktop-3.png',
        width: 2160,
        height: 1350,
        alt: { ru: 'Панель сохранения на устройство', en: 'The save-to-device panel' },
        caption: {
          ru: 'Готовое сводится в .wav, проект сохраняется отдельно — чтобы вернуться и доделать',
          en: 'The result mixes down to .wav; the project saves separately so you can come back and finish it',
        },
      },
      {
        src: '/media/oktava/mobile.png',
        width: 1170,
        height: 2532,
        alt: { ru: 'Студия на экране телефона', en: 'The studio on a phone screen' },
      },
    ],
    demo: {
      src: '/play/oktava/index.html',
      note: {
        ru: 'Нажмите несколько клеток и «Играть». Дорожки переключаются вкладками, клавиши внизу играют вживую — в том числе кнопками A, S, D, F на клавиатуре. Кнопка «Скачать .wav» сохранит получившееся на устройство.',
        en: 'Click a few cells and press Play. Tabs switch tracks, the keys below play live — including the A, S, D, F keys on your keyboard. The .wav button saves the result to your device.',
      },
    },
    links: [{ kind: 'live', url: '/play/oktava/index.html' }],
  },

  {
    slug: 'partitura',
    section: 'websites',
    order: 3,
    year: 2026,
    tech: ['HTML', 'CSS', 'JavaScript', 'SVG', 'Web Audio API'],
    title: { ru: 'Партитура — ноты и клавиши', en: 'Partitura — notes and keys' },
    role: { ru: 'Автор проекта', en: 'Sole author' },
    teaser: {
      ru: 'Пишете ноты на нотном стане — и сразу видите на пианино, какие клавиши нажимаются. И наоборот: нажали клавишу — нота встала в лист.',
      en: 'Write notes on the staff and see at once which piano keys are pressed. And the other way round: press a key and the note lands on the sheet.',
    },
    summary: {
      ru: 'Нотный редактор в браузере: скрипичный и басовый ключи, размеры от 2/4 до 6/8, тональности до пяти знаков, длительности от целой до шестнадцатой с точками и паузами. Ни музыкального шрифта, ни картинок — каждый знак строится кодом как путь SVG, поэтому весь лист масштабируется одной величиной, расстоянием между линейками. Готовое сохраняется проектом, уходит стандартным .mid или на печать; на сервер не отправляется ничего.',
      en: 'A notation editor in the browser: treble and bass clefs, time signatures from 2/4 to 6/8, keys up to five accidentals, note values from whole to sixteenth with dots and rests. No music font and no images — every symbol is built in code as an SVG path, so the whole sheet scales from a single value, the distance between staff lines. The result saves as a project, exports as a standard .mid or goes to the printer; nothing is sent to a server.',
    },
    highlights: {
      ru: [
        'Пианино связано со станом в обе стороны: клавиша добавляет ноту в лист, а наведение на стан подсвечивает клавишу ещё до клика — видно, что именно получится',
        'Нота хранится ступенью стана и знаком, а не номером MIDI: ми-бемоль и ре-диез звучат одинаково, но пишутся по-разному, и смена тональности не переписывает набранное',
        'Ключи, головки, штили, вязки и паузы нарисованы кодом: музыкальный шрифт весил бы сотни килобайт и тянулся с чужого домена, а системные его символы рисуют не в том масштабе',
        'Тактовые черты, вязки восьмых внутри доли и добавочные линейки считаются раскладкой — доли считать не нужно',
        'Экспорт в .mid написан побайтно, в двадцать строк: готовая библиотека весила бы больше всего остального проекта',
        'Расписание нот идёт по часам звуковой карты, а не по таймерам — иначе на слух ритм разъезжается',
      ],
      en: [
        'The piano is wired to the staff both ways: a key adds a note to the sheet, and hovering over the staff lights up the key before you even click — you see what you are about to get',
        'A note is stored as a staff step plus an accidental, not as a MIDI number: E♭ and D♯ sound alike but are written differently, and changing key never rewrites what you typed',
        'Clefs, noteheads, stems, beams and rests are drawn in code: a music font would weigh hundreds of kilobytes and come from someone else’s domain, and system fonts draw those symbols at the wrong scale',
        'Bar lines, beams within a beat and ledger lines all fall out of the layout — you never count beats',
        'The .mid export is written byte by byte in twenty lines: a ready-made library would outweigh the rest of the project',
        'Notes are scheduled against the audio clock rather than timers — otherwise the ear hears the beat falling apart',
      ],
    },
    cover: {
      src: '/media/partitura/cover.png',
      width: 2160,
      height: 1350,
      alt: {
        ru: 'Нотный лист с мелодией и клавиатура пианино под ним, одна клавиша подсвечена',
        en: 'A sheet of music with a melody and a piano keyboard below, one key highlighted',
      },
    },
    gallery: [
      {
        src: '/media/partitura/desktop-2.png',
        width: 2160,
        height: 1350,
        alt: {
          ru: 'Тёмная тема во время воспроизведения: звучащая нота и клавиша подсвечены',
          en: 'The dark theme during playback: the sounding note and its key are highlighted',
        },
        caption: {
          ru: 'Во время игры подсвечивается и нота в листе, и клавиша на пианино — по ним видно, что именно сейчас звучит',
          en: 'While the sheet plays, both the note and the piano key light up — you can see exactly what is sounding',
        },
      },
      {
        src: '/media/partitura/mobile.png',
        width: 1170,
        height: 2532,
        alt: { ru: 'Редактор на экране телефона', en: 'The editor on a phone screen' },
      },
    ],
    demo: {
      src: '/play/partitura/index.html',

      ratio: '4 / 3',
      note: {
        ru: 'Кликните по нотному стану или по клавише пианино — нота встанет в лист. «Играть» проигрывает набранное, подсвечивая ноту и клавишу.',
        en: 'Click the staff or a piano key — the note lands on the sheet. Play runs it back, highlighting the note and the key.',
      },
    },
    links: [{ kind: 'live', url: '/play/partitura/index.html' }],
  },

  {
    slug: 'vetka',
    section: 'websites',
    order: 4,
    year: 2026,
    tech: ['HTML', 'CSS', 'JavaScript'],
    title: { ru: 'Ветка — git по шагам', en: 'Vetka — git step by step' },
    role: { ru: 'Автор проекта', en: 'Sole author' },
    teaser: {
      ru: 'Тренажёр Git Bash: команды набираются руками, а рядом видно, как файл едет из папки в индекс, становится коммитом и уходит на GitHub.',
      en: 'A Git Bash trainer: you type the commands yourself while the diagram shows the file moving from folder to index, turning into a commit and travelling to GitHub.',
    },
    summary: {
      ru: 'Шесть уроков — от «где я вообще нахожусь» до полного пути «пустая папка → репозиторий → .gitignore → коммит → GitHub». Внутри работает настоящая модель репозитория: у файла одновременно три версии — на диске, в индексе и в последнем коммите, — и «изменён», «подготовлен», «не отслеживается» не проставлены заранее, а вычисляются из их разницы. Поэтому от урока можно отойти в сторону: набрать своё, сломать, посмотреть git status и вернуться.',
      en: 'Six lessons, from “where am I even standing” to the full path “empty folder → repository → .gitignore → commit → GitHub”. A real repository model runs underneath: a file has three versions at once — on disk, in the index and in the last commit — and “modified”, “staged”, “untracked” are not preset flags but the difference between them. That is why you can step off the script: type your own command, break something, run git status and come back.',
    },
    highlights: {
      ru: [
        'Схема из четырёх зон анимируется приёмом FLIP: разметка каждый раз строится заново от состояния, а переезд карточки в индекс и коммита на GitHub браузер считает сам',
        'Ключ карточки — file:<имя> или commit:<номер>, поэтому коммит, улетающий на GitHub, стартует из своей же точки в локальной истории: видно, что push копирует, а не создаёт заново',
        'Урок не запрещает лишние команды: шаг проверяется после того, как команда честно выполнена — тренажёр, отвергающий всё, кроме ожидаемого, учит не git, а послушанию',
        'Переключение ветки меняет содержимое файла на диске, и cat это показывает — то самое место, где ветки перестают быть абстракцией',
        'Вывод повторяет настоящий: приглашение в две строки с веткой в скобках, ошибки git и bash слово в слово, история по ↑ и дописывание по Tab',
        'В конце урока — проверка: команду больше не показывают, её нужно вспомнить самому; пройденное и открытые команды шпаргалки запоминаются',
      ],
      en: [
        'The four-zone diagram animates with FLIP: the markup is rebuilt from state every time, and the browser works out the trip from folder to index and from commit to GitHub itself',
        'Card keys are file:<name> and commit:<id>, so a commit flying to GitHub starts from its own point in the local history — you can see that push copies rather than creates',
        'The lesson never blocks a command you were not asked for: the step is checked after the command has actually run — a trainer that refuses everything unexpected teaches obedience, not git',
        'Switching branches changes the file on disk and cat shows it — the exact moment branches stop being an abstraction',
        'The output copies the real thing: a two-line prompt with the branch in brackets, git and bash errors word for word, ↑ for history and Tab completion',
        'Each lesson ends with a check: the command is no longer shown and has to be recalled; progress and the unlocked cheat sheet are remembered',
      ],
    },
    cover: {
      src: '/media/vetka/cover.png',
      width: 2160,
      height: 1350,
      alt: {
        ru: 'Урок про GitHub: схема из четырёх зон и окно Git Bash с выполненными командами',
        en: 'The GitHub lesson: the four-zone diagram and a Git Bash window with commands already run',
      },
    },
    gallery: [
      {
        src: '/media/vetka/desktop-2.png',
        width: 2160,
        height: 1350,
        alt: { ru: 'Урок про ветки после слияния', en: 'The branches lesson after a merge' },
        caption: {
          ru: 'Урок про ветки: коммит уходит в feature, а в main файл на диске остаётся прежним — пока не сделано слияние',
          en: 'The branches lesson: the commit lands on feature while the file on disk in main stays as it was — until the merge',
        },
      },
      {
        src: '/media/vetka/desktop-3.png',
        width: 2160,
        height: 1350,
        alt: { ru: 'Светлая тема, урок про первый коммит', en: 'The light theme, the first-commit lesson' },
        caption: {
          ru: 'Светлая тема для проектора и дневного света; терминал остаётся тёмным в обеих — таким его и увидят в жизни',
          en: 'A light theme for projectors and daylight; the terminal stays dark in both, the way it will look in real life',
        },
      },
      {
        src: '/media/vetka/mobile.png',
        width: 1170,
        height: 2532,
        alt: { ru: 'Тренажёр на экране телефона', en: 'The trainer on a phone screen' },
      },
    ],
    demo: {
      src: '/play/vetka/index.html',
      ratio: '4 / 3',
      note: {
        ru: 'Наберите команду из карточки слева и нажмите Enter — схема справа покажет, что произошло. Кнопка «Подставить» напечатает команду за вас. В отдельной вкладке места больше.',
        en: 'Type the command from the card on the left and press Enter — the diagram will show what happened. The “Fill in” button types it for you. There is more room in a separate tab.',
      },
    },
    links: [{ kind: 'live', url: '/play/vetka/index.html' }],
  },

  {
    slug: 'traty',
    section: 'mobile-apps',
    featured: true,
    order: 1,
    year: 2026,
    tech: ['Kotlin', 'Android SDK', 'ViewBinding', 'Gradle', 'R8'],
    title: { ru: 'Траты — Android', en: 'Spending — Android' },
    role: { ru: 'Автор проекта', en: 'Sole author' },
    teaser: {
      ru: 'Учёт денег по категориям с прогнозом на следующий месяц — и справочник цен, который показывает, где что дешевле.',
      en: 'Money tracked by category with a forecast for the next month — and a price book that shows where things cost less.',
    },
    summary: {
      ru: 'Приложение отвечает на один вопрос: сколько можно тратить в день, чтобы дожить до конца месяца, и что будет в следующем. Три вкладки — месяц, лента записей и прогноз. Прогноз строится по каждой категории отдельно: регулярные счета берутся из списка как есть, обычные траты считаются медианой за полгода, крупные разовые покупки выносятся из нормы и возвращаются как ежемесячный резерв. Заработок не угадывается вовсе — его вводит пользователь, потому что свою зарплату он знает точнее любой статистики. Все данные лежат в одном JSON-файле во внутренней памяти: интернет-разрешения в манифесте нет.\n\nОтдельный раздел — цены. Таблица «товар × магазин» отвечает на вопрос, где что брать: цены приводятся к одной единице, самая выгодная клетка подсвечивается, а магазин выбирается один раз и запоминается — в зале не нужно каждый раз указывать, где вы стоите. Товары раскладываются по двадцати двум разделам по названию, причём правило ищет по началу слова, а не по вхождению: «шоколад» содержит «кола», и по вхождению шоколад уехал бы в напитки. Вся таблица выгружается в CSV.',
      en: 'The app answers one question: how much can be spent per day to reach the end of the month, and what the next one will look like. Three tabs — the month, the feed of records and the forecast. The forecast is built per category: regular bills are taken from a list as they are, everyday spending is the median of the last six months, and big one-off buys are pulled out of the norm and returned as a monthly reserve. Earnings are not guessed at all — you type them in, because you know your own paycheque better than any statistic. Everything lives in a single JSON file in internal storage: there is no internet permission in the manifest.\n\nA separate section holds the prices. A goods × shops table answers the question of what to buy where: every price is reduced to one unit, the best cell is highlighted, and the shop is picked once and remembered — no need to say where you are standing every time you are in the aisle. Goods are sorted into twenty-two sections by their names, and a rule matches the start of a word rather than any substring: “шоколад” (chocolate) contains “кола” (cola), and by substring the chocolate would have ended up in the drinks. The whole table exports to CSV.',
    },
    highlights: {
      ru: [
        'Норма по категории — медиана за шесть месяцев, а не среднее: один месяц с гостями не переписывает норму на полгода',
        'Тренд — медиана попарных наклонов, вдвое ослабленная и зажатая в ±30 % от базы, чтобы всплеск не разогнал прогноз',
        'Сезонность включается только после года записей: месяц сравнивается с собой же год назад относительно медианы своего года, чтобы инфляция не сошла за сезон',
        'Крупная разовая покупка не попадает в норму, а превращается в резерв: ноутбук раз в восемь месяцев — это одна восьмая каждый месяц',
        'Заработок и запас разделены: траты сначала съедают заработок и трогают запас, только когда он кончился; остаток и перерасход переносятся в следующий месяц',
        'Отдельный счёт для аренды: платёж остаётся в тратах месяца, но вычитается не из заработка, а из счёта, который гасят заказы',
        'Мультивалютность без обращения к сети: курс вводится вручную, подставляется из прошлой записи и сохраняется вместе с тратой — задним числом ничего не пересчитывается',
        'Все суммы — целые копейки в Long, ни одного double в деньгах; хранение — JSON во внутренней памяти, запись атомарная через временный файл и в фоновом потоке',
        'В манифесте нет доступа в интернет: только уведомления и будильники для напоминаний о платежах, которые переживают перезагрузку телефона',
        'Release-сборка 1,5 МБ: R8, вырезание ресурсов, Views и ViewBinding вместо Compose, только два языка в сборке',
        'Цены сравниваются в пересчёте на единицу, а не по ценнику: 900 г за 11,70 дороже килограмма за 11,10, и в таблице это видно без калькулятора',
        'Карточка товара разводит два смысла цены: «на полке» — то, что написано на ценнике, «в пересчёте» — за килограмм и за сто граммов',
        'Вид одного магазина отвечает на вопрос «что брать здесь»: по каким позициям он дешевле всех, а по каким дешевле сосед и на сколько',
        'Единица у каждого товара своя: яйца поштучно, жидкости в миллилитрах и литрах, вес в граммах и килограммах — пересчёт считается прямо во время ввода',
        'Выгрузка в таблицу: девятнадцать колонок, строки отсортированы по цене за единицу, рядом — сколько магазинов знают товар и насколько эта цена хуже лучшей',
      ],
      en: [
        'A category norm is the median of six months, not the average: one month with guests should not rewrite the norm for half a year',
        'The trend is the median of pairwise slopes, halved and clamped to ±30 % of the base, so a spike cannot run away with the forecast',
        'Seasonality only switches on after a year of records: a month is compared with itself a year earlier against the median of its own year, so inflation does not pass for a season',
        'A big one-off buy stays out of the norm and becomes a reserve instead: a laptop once every eight months is one eighth of it every month',
        'Earnings and savings are kept apart: spending eats the earnings first and only touches the savings once they run out; both leftovers and overspending carry into the next month',
        'A separate account for the rent: the payment stays in the month’s spending, but comes out of that account rather than the earnings, and orders pay it back',
        'Multi-currency without touching the network: the rate is typed by hand, pre-filled from the previous entry and stored alongside the expense — nothing is ever recalculated after the fact',
        'Every sum is whole minor units in a Long, not a single double in the money; storage is JSON in internal memory, written atomically through a temporary file on a background thread',
        'No internet access in the manifest: only notifications and alarms for payment reminders, which survive a reboot of the phone',
        'A 1.5 MB release build: R8, resource shrinking, Views and ViewBinding instead of Compose, only two languages bundled',
        'Prices are compared per unit rather than by the label: 900 g for 11.70 is dearer than a kilo for 11.10, and the table shows that without a calculator',
        'The item card separates two meanings of a price: “on the shelf” is what the label says, “per unit” is the price per kilo and per hundred grams',
        'The single-shop view answers “what should I buy here”: which items it has cheapest, and where a neighbour is cheaper and by how much',
        'Every item carries its own unit: eggs by the piece, liquids in millilitres and litres, weight in grams and kilos — the conversion is computed as you type',
        'Export to a spreadsheet: nineteen columns, rows sorted by unit price, alongside how many shops know the item and how far this price is from the best one',
      ],
    },

    cover: {
      src: '/media/traty/cover.jpg',
      width: 2160,
      height: 1350,
      alt: {
        ru: 'Три экрана приложения: лента записей, сводка месяца в тёмной теме и прогноз в светлой',
        en: 'Three app screens: the feed of records, the month summary in the dark theme and the forecast in the light one',
      },
    },
    gallery: [
      {
        src: '/media/traty/month.webp',
        width: 1080,
        height: 2149,
        alt: {
          ru: 'Сводка месяца: заработано, потрачено, запас и остаток на день',
          en: 'The month summary: earned, spent, savings and what is left per day',
        },
        caption: {
          ru: 'Отображается остаток. Он равномерно распределяется на оставшиеся дни в месяце',
          en: 'The balance is shown, spread evenly across the days left in the month',
        },
      },
      {
        src: '/media/traty/feed.webp',
        width: 1080,
        height: 2160,
        alt: {
          ru: 'Лента записей по дням с суммой за каждый день',
          en: 'The feed of records grouped by day, with a total for each day',
        },
        caption: {
          ru: 'Записи группируются по дням, у каждого дня своя сумма. Трата в чужой валюте показывает исходную сумму рядом с категорией — 550 ₽ превратились в 18,70 ₾ по курсу, который вы вписали при записи',
          en: 'Records are grouped by day, each day with its own total. An entry in another currency shows the original amount next to the category — 550 ₽ became 18.70 ₾ at the rate you typed in with the entry',
        },
      },
      {
        src: '/media/traty/categories.webp',
        width: 1080,
        height: 2149,
        alt: {
          ru: 'Категории месяца с долями трат и отметками «сверх нормы» и «до нормы»',
          en: 'The month’s categories with their share of spending and “over” / “under” pace marks',
        },
        caption: {
          ru: 'Каждая категория сравнивается со своим средним значением и показывает превышение. Чем больше месяцев заполнено, тем точнее цифры',
          en: 'Each category is compared with its own average and shows the overshoot. The more months you have filled in, the more accurate the figures',
        },
      },
      {
        src: '/media/traty/forecast.webp',
        width: 1080,
        height: 2154,
        alt: {
          ru: 'Прогноз на следующий месяц в светлой теме, с разбивкой на обычные траты и резерв',
          en: 'The forecast for the next month in the light theme, split into everyday spending and reserve',
        },
        caption: {
          ru: 'Прогноз разделяет обычные траты и запас. Светлая тема идёт за системной настройкой, но её можно выбрать и вручную',
          en: 'The forecast splits everyday spending from the reserve. The light theme follows the system setting, and can also be chosen by hand',
        },
      },
      {
        src: '/media/traty/prices.webp',
        width: 1080,
        height: 2274,
        alt: {
          ru: 'Таблица цен: товары по строкам, магазины по столбцам, выгодные клетки подсвечены',
          en: 'The price table: goods in rows, shops in columns, the best cells highlighted',
        },
        caption: {
          ru: 'Все цены приведены к одной единице, поэтому колонки сравнимы между собой. Зелёная клетка — где дешевле всего, розовая — где дороже; под ценой стоит фасовка, из которой пересчёт и сделан',
          en: 'Every price is reduced to the same unit, so the columns can be compared. A green cell is the cheapest, a pink one is dearer; under the price is the pack size the conversion came from',
        },
      },
      {
        src: '/media/traty/price-card.webp',
        width: 1080,
        height: 2274,
        alt: {
          ru: 'Карточка товара: цена на полке и цена в пересчёте по каждому магазину',
          en: 'The item card: the shelf price and the unit price for each shop',
        },
        caption: {
          ru: 'Два смысла цены разведены: слева то, что написано на ценнике, справа — за килограмм и за сто граммов. Видно и разницу между фасовками одного магазина: 500 г выходят дороже килограмма на 17%',
          en: 'The two meanings of a price are kept apart: on the left what the label says, on the right the price per kilo and per hundred grams. The difference between pack sizes in one shop shows up too: 500 g works out 17% dearer than the kilo',
        },
      },
      {
        src: '/media/traty/price-shop.webp',
        width: 1080,
        height: 2274,
        alt: {
          ru: 'Вид одного магазина: цена здесь и подсказка, где дешевле',
          en: 'The single-shop view: the price here and a hint of where it is cheaper',
        },
        caption: {
          ru: 'Магазин выбирается один раз и запоминается. Список показывает, что выгодно брать именно здесь, и где дешевле по остальным позициям — с ценой соседа рядом',
          en: 'The shop is chosen once and remembered. The list shows what is worth buying right here, and where the rest is cheaper — with the neighbour’s price beside it',
        },
      },
      {
        src: '/media/traty/price-edit.webp',
        width: 1080,
        height: 2274,
        alt: {
          ru: 'Правка цены: фасовка, единица измерения и пересчёт под полями ввода',
          en: 'Editing a price: pack size, unit and the conversion under the input fields',
        },
        caption: {
          ru: 'Единица выбирается под товар — граммы, килограммы, миллилитры, литры или штуки. Пересчёт считается прямо во время ввода, а цена без скидки хранится рядом, чтобы акция не выдавала себя за обычную цену',
          en: 'The unit is chosen to fit the item — grams, kilos, millilitres, litres or pieces. The conversion is computed as you type, and the undiscounted price is kept alongside so a promotion cannot pass for the usual one',
        },
      },
    ],
  },

  {
    slug: 'chto-prigotovit-android',
    section: 'mobile-apps',
    featured: true,
    order: 2,
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

    cover: {
      src: '/media/chto-prigotovit-android/cover.jpg',
      width: 2160,
      height: 1350,
      alt: {
        ru: 'Три экрана приложения: продукты, подобранные рецепты в тёмной теме и карточка рецепта',
        en: 'Three app screens: products, matched recipes in the dark theme and a recipe card',
      },
    },
    gallery: [
      {
        src: '/media/chto-prigotovit-android/products.webp',
        width: 1080,
        height: 2098,
        alt: {
          ru: 'Экран продуктов: строка поиска, корзина и каталог по категориям',
          en: 'The products screen: search field, basket and the catalogue by category',
        },
        caption: {
          ru: 'Что есть дома отмечается в каталоге; у каждой категории видно, сколько продуктов из неё уже в корзине',
          en: 'You tick what you have at home in the catalogue; each category shows how many of its products are already in the basket',
        },
      },
      {
        src: '/media/chto-prigotovit-android/recipes-dark.webp',
        width: 1080,
        height: 2127,
        alt: {
          ru: 'Список подобранных рецептов в тёмной теме с фильтрами по блюду и времени',
          en: 'The list of matched recipes in the dark theme, with filters by dish and time',
        },
        caption: {
          ru: 'Рецепты пересортировываются на лету: сверху те, что готовятся прямо сейчас. Тёмная тема идёт за системной настройкой, но её можно выбрать и вручную',
          en: 'Recipes re-sort on the fly, with the ones you can cook right now on top. The dark theme follows the system setting, and can also be chosen by hand',
        },
      },
      {
        src: '/media/chto-prigotovit-android/recipe.webp',
        width: 1080,
        height: 2120,
        alt: {
          ru: 'Карточка рецепта: список продуктов с количествами и шаги приготовления',
          en: 'A recipe card: the ingredient list with amounts and the cooking steps',
        },
        caption: {
          ru: 'В карточке сразу видно, чего не хватает, что можно пропустить и чем заменить — до того, как встать к плите',
          en: 'The card shows at once what is missing, what can be skipped and what can be swapped — before you get to the stove',
        },
      },
    ],
  },

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
