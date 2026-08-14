window.Kluchi = window.Kluchi || {};

(function (ns) {
  'use strict';

  const STORAGE_KEY = 'kluchi-lang';
  const SUPPORTED = ['ru', 'en'];

  const I18N = {
    ru: {
      meta: {
        title: 'Ключи от города — встреча в аэропорту, трансферы и экскурсии',
        description:
          'Встретим в аэропорту с табличкой, довезём до отеля и покажем город. Фиксированная цена, ожидание рейса включено, водители говорят по-английски.',
      },

      a11y: {
        skip: 'Перейти к содержанию',
        nav: 'Основная навигация',
        footerNav: 'Разделы сайта',
        theme: 'Переключить тему',
        themeNight: 'Включить ночную тему',
        themeDay: 'Включить дневную тему',
        lang: 'Язык сайта',
        menu: 'Меню',
        board: 'Встретят, довезут, покажут город',
        filter: 'Фильтр экскурсий',
      },

      brand: {
        name: 'Ключи от города',
        sub: 'Сочи · встреча, трансфер, экскурсии',
      },

      nav: {
        services: 'Услуги',
        calc: 'Расчёт',
        how: 'Как проходит встреча',
        tours: 'Экскурсии',
        fleet: 'Машины',
        cta: 'Заказать встречу',
      },

      hero: {
        tagline: 'Аэропорт · терминал прилёта',
        titleTop: 'В новом городе вас',

        board: ['ВСТРЕТЯТ', 'ДОВЕЗУТ', 'ПРОВЕДУТ', 'ПОКАЖУТ', 'РАССКАЖУТ'],
        lead:
          'Водитель ждёт у выхода с табличкой, следит за вашим рейсом и не уедет, если самолёт задержали. Цена известна заранее и не меняется в пути.',
        ctaCalc: 'Рассчитать трансфер',
        ctaTours: 'Выбрать экскурсию',
        fact1: 'Ожидание рейса',
        fact1u: 'минут бесплатно',
        fact2: 'Встреч за год',
        fact2u: 'рейсов',
        fact3: 'Языки водителей',
        fact3u: 'включая английский',
      },

      services: {
        eyebrow: 'Что мы делаем',
        title: 'Три вещи, и каждую до конца',
        s1t: 'Встреча в аэропорту',
        s1d:
          'Водитель стоит в зоне прилёта с табличкой и вашим именем. Рейс отслеживаем: задержали — ждём, прилетели раньше — мы тоже.',
        s1l1: 'Табличка с именем',
        s1l2: 'Помощь с багажом',
        s1l3: 'Сим-карта и вода в машине',
        s2t: 'Трансферы по городу',
        s2d:
          'Отель, вокзал, ресторан. Цена фиксируется при заказе и не растёт из-за пробок или ночного времени.',
        s2l1: 'Фиксированная цена',
        s2l2: 'Детские кресла',
        s2l3: 'Оплата картой или наличными',
        s3t: 'Экскурсии',
        s3d:
          'Не автобус на пятьдесят человек, а ваша машина и гид, который подстраивает маршрут под погоду и настроение.',
        s3l1: 'Группа только ваша',
        s3l2: 'Маршрут можно менять в пути',
        s3l3: 'Гид говорит по-английски',
      },

      calc: {
        eyebrow: 'Расчёт',
        title: 'Сколько будет стоить',
        lead:
          'Цена собирается на глазах — никаких «уточним у водителя». Столько же будет и в подтверждении заказа.',
        direction: 'Направление',
        dirFrom: 'Из аэропорта',
        dirTo: 'В аэропорт',
        dest: 'Куда едем',
        destTo: 'Откуда едем',
        people: 'Пассажиров',
        bags: 'Чемоданов',
        time: 'Время прилёта',
        timeTo: 'Время выезда',
        extras: 'Дополнительно',
        seat: 'Детское кресло',
        stop: 'Остановка по пути (30 мин)',
        total: 'Итого',
        order: 'Заказать по этой цене',
        fine:
          'Ожидание рейса до 90 минут, встреча с табличкой и помощь с багажом уже включены.',
        rowRide: 'Поездка',
        rowNight: 'Ночной тариф',
        rowSeat: 'Детское кресло',
        rowStop: 'Остановка по пути',
        rowTime: 'В пути',
        minutes: 'мин',
        carFor: 'Подобрали',
        carWhy: 'по числу пассажиров и чемоданов',
        destinations: {
          adler: 'Адлер',
          sirius: 'Сириус и Олимпийский парк',
          hosta: 'Хоста',
          matsesta: 'Мацеста',
          center: 'Центр Сочи',
          dagomys: 'Дагомыс',
          loo: 'Лоо',
          polyana: 'Красная Поляна',
          gagra: 'Гагра, Абхазия',
        },
      },

      how: {
        eyebrow: 'По шагам',
        title: 'Как проходит встреча',
        lead:
          'Обычный сценарий от заказа до отеля. Время указано относительно посадки самолёта.',
        t1: '−24 ч',
        t2: '−2 ч',
        t3: '00:00',
        t4: '+15 мин',
        t5: '+55 мин',
        s1t: 'Вы оставляете рейс',
        s1d: 'Номер рейса, дату и адрес. В ответ приходит подтверждение с ценой и именем водителя.',
        s2t: 'Проверяем табло',
        s2d: 'Если рейс сдвинулся, водитель выезжает по новому времени. Вам ничего делать не нужно.',
        s3t: 'Самолёт сел',
        s3d: 'Приходит сообщение: имя водителя, марка и номер машины, где именно он стоит.',
        s4t: 'Встреча в зале прилёта',
        s4d: 'Табличка с вашим именем у выхода. Помогаем с чемоданами и идём к машине.',
        s5t: 'Вы на месте',
        s5d:
          'Довозим до двери, а не до ближайшего поворота. Дальше — по желанию: город, горы, море.',
      },

      tours: {
        eyebrow: 'Экскурсии',
        title: 'Куда съездить, пока вы здесь',
        lead:
          'Цена за машину целиком, а не с человека. Выезд от вашего отеля в удобное время.',
        empty: 'В этом направлении пока ничего нет — напишите, соберём под вас.',
        book: 'Забронировать',
        hours: 'ч',
        perCar: 'за машину',
        route: 'Маршрут',
        filters: {
          all: 'Все',
          mountains: 'Горы',
          sea: 'Море',
          city: 'Город',
          abkhazia: 'Абхазия',
        },
        items: {
          polyana: {
            name: 'Красная Поляна и Роза Хутор',
            note:
              'Три канатные дороги, вид на хребет с высоты 2320 метров и обед в горной деревне. Летом — зелень и водопады, зимой — снег в часе от моря.',
            stops: ['Эсто-Садок', 'Роза Хутор', 'Пик 2320', 'Ачипсинские водопады'],
          },
          abkhazia: {
            name: 'Абхазия: Новый Афон и озеро Рица',
            note:
              'Целый день за границей и обратно к ужину. Пещера, монастырь, озеро в горах и остановка на мандарины. Нужен паспорт.',
            stops: ['Граница', 'Гагра', 'Новый Афон', 'Озеро Рица'],
          },
          tea: {
            name: 'Чайные плантации Мацесты',
            note:
              'Самый северный чай в мире: поля на склонах, фабрика, дегустация с пирогами. Спокойный маршрут на полдня, хорошо заходит с детьми.',
            stops: ['Мацеста', 'Плантации', 'Фабрика', 'Дегустация'],
          },
          waterfalls: {
            name: '33 водопада и тисо-самшитовая роща',
            note:
              'Дорога по руслу реки на внедорожнике, каскад водопадов и прогулка по реликтовому лесу, который старше всего вокруг.',
            stops: ['Долина реки Шахе', '33 водопада', 'Тисо-самшитовая роща'],
          },
          night: {
            name: 'Ночной Сочи',
            note:
              'Три часа после заката: набережная, поющие фонтаны, смотровая на горе Ахун и город огнями внизу.',
            stops: ['Морвокзал', 'Парк «Ривьера»', 'Поющие фонтаны', 'Гора Ахун'],
          },
          sea: {
            name: 'Море и Сириус',
            note:
              'Прогулка на катере вдоль берега, олимпийские объекты и вечерние фонтаны. Полдня без переездов по серпантину.',
            stops: ['Порт Сочи', 'Морская прогулка', 'Олимпийский парк', 'Сириус'],
          },
        },
      },

      fleet: {
        eyebrow: 'Автопарк',
        title: 'На чём поедете',
        lead:
          'Класс подбирается по числу людей и чемоданов — калькулятор выше делает это сам.',
        pax: 'до',
        paxUnit: 'пассажиров',
        bagsUnit: 'чемоданов',
        items: {
          standard: {
            name: 'Седан',
            note: 'Пара или один человек с багажом. Skoda Octavia, Toyota Camry и похожие.',
            features: ['Кондиционер', 'Вода в дорогу', 'Детское кресло по запросу'],
          },
          minivan: {
            name: 'Минивэн',
            note: 'Семья или небольшая компания. Мест хватает и людям, и чемоданам.',
            features: ['Отдельный багажник', 'Два детских кресла', 'Розетки в салоне'],
          },
          bus: {
            name: 'Микроавтобус',
            note: 'Группа, свадьба, конференция. Один водитель на весь день, если нужно.',
            features: ['Багажный отсек', 'Микрофон для гида', 'Подача к любому терминалу'],
          },
        },
      },

      voices: {
        eyebrow: 'Отзывы',
        title: 'Что пишут после поездки',
        items: [
          {
            text:
              'Рейс задержали на четыре часа, я была уверена, что придётся искать такси в три ночи. Водитель дождался и даже не заикнулся о доплате.',
            author: 'Ольга',
            role: 'встреча в аэропорту, март',
          },
          {
            text:
              'Возили нас неделю: отель, рестораны, Роза Хутор. Один и тот же водитель, знал уже, где мы любим останавливаться по дороге.',
            author: 'Сергей',
            role: 'трансферы, семь дней',
          },
          {
            text:
              'На Рицу поехали вшестером в минивэне. Гид переигрывал маршрут на ходу из-за дождя — и получилось лучше, чем по плану.',
            author: 'Марина',
            role: 'экскурсия в Абхазию',
          },
        ],
      },

      contacts: {
        eyebrow: 'Заявка',
        title: 'Оставьте рейс — остальное наше',
        lead:
          'Ответим в течение получаса и пришлём подтверждение с именем водителя.',
        officeLabel: 'Офис',
        officeValue: 'Сочи, Адлер, ул. Мира, 24 — второй этаж',
        hoursLabel: 'Диспетчер',
        hoursValue: 'Круглосуточно, без выходных',
        tgLabel: 'Телеграм и WhatsApp',
        tgValue: '@kluchi_sochi',
        fName: 'Имя',
        fNamePh: 'Как встречать',
        errName: 'Впишите имя — оно попадёт на табличку',
        fContact: 'Телефон или мессенджер',
        fContactPh: '+7 900 000-00-00',
        errContact: 'Без контакта мы не сможем прислать подтверждение',
        fFlight: 'Номер рейса',
        fFlightPh: 'SU 1128',
        fFlightHint: 'Есть в билете. По нему мы следим за задержкой.',
        fDate: 'Дата прилёта',
        fNote: 'Куда едем и пожелания',
        fNotePh: 'Отель в Сириусе, нужны два детских кресла',
        submit: 'Отправить заявку',
        privacy: 'Контакты нужны только чтобы ответить на эту заявку. Рассылок нет.',
        sent: 'Заявка принята. Ответим в течение получаса и пришлём подтверждение.',
        prefillTransfer: 'Трансфер',
        prefillTour: 'Экскурсия',
      },

      footer: {
        tagline: 'Встречаем, возим и показываем Сочи с 2016 года',
        rights: 'Цены и маршруты — для примера',
      },
    },

    en: {
      meta: {
        title: 'City Keys — airport pickups, transfers and tours',
        description:
          'We meet you at airport with a name sign, drive you to your hotel and show you the city. Fixed price, flight waiting included, English-speaking drivers.',
      },

      a11y: {
        skip: 'Skip to content',
        nav: 'Main navigation',
        footerNav: 'Site sections',
        theme: 'Switch the theme',
        themeNight: 'Switch to the night theme',
        themeDay: 'Switch to the day theme',
        lang: 'Site language',
        menu: 'Menu',
        board: 'Met, driven, shown around',
        filter: 'Tour filter',
      },

      brand: {
        name: 'City Keys',
        sub: 'Pickups, transfers, tours',
      },

      nav: {
        services: 'Services',
        calc: 'Price',
        how: 'How the pickup works',
        tours: 'Tours',
        fleet: 'Cars',
        cta: 'Book a pickup',
      },

      hero: {
        tagline: 'Sochi airport · arrivals terminal',
        titleTop: 'In a new city you will be',
        board: ['MET', 'DRIVEN', 'SHOWN'],
        lead:
          'Your driver waits at the exit with a name sign, tracks your flight and will not leave if the plane is late. The price is known in advance and does not change on the way.',
        ctaCalc: 'Get a price',
        ctaTours: 'Pick a tour',
        fact1: 'Flight waiting',
        fact1u: 'minutes free',
        fact2: 'Pickups a year',
        fact2u: 'flights',
        fact3: 'Driver languages',
        fact3u: 'English included',
      },

      services: {
        eyebrow: 'What we do',
        title: 'Three things, each done properly',
        s1t: 'Airport pickup',
        s1d:
          'The driver stands in arrivals with a sign and your name. We track the flight: delayed — we wait, early — we are there too.',
        s1l1: 'Name sign at the exit',
        s1l2: 'Help with the luggage',
        s1l3: 'SIM card and water in the car',
        s2t: 'Transfers around the city',
        s2d:
          'Hotel, station, restaurant, Krasnaya Polyana. The price is fixed when you book and does not grow because of traffic or the hour.',
        s2l1: 'Fixed price',
        s2l2: 'Child seats',
        s2l3: 'Card or cash',
        s3t: 'Tours',
        s3d:
          'Not a coach with fifty strangers but your own car and a guide who adapts the route to the weather and your mood.',
        s3l1: 'Your group only',
        s3l2: 'The route can change on the way',
        s3l3: 'The guide speaks English',
      },

      calc: {
        eyebrow: 'Price',
        title: 'What it will cost',
        lead:
          'The price adds up in front of you — no "the driver will tell you". The confirmation will say exactly the same.',
        direction: 'Direction',
        dirFrom: 'From the airport',
        dirTo: 'To the airport',
        dest: 'Where to',
        destTo: 'Where from',
        people: 'Passengers',
        bags: 'Suitcases',
        time: 'Landing time',
        timeTo: 'Departure time',
        extras: 'Extras',
        seat: 'Child seat',
        stop: 'A stop on the way (30 min)',
        total: 'Total',
        order: 'Book at this price',
        fine:
          'Up to 90 minutes of flight waiting, the name sign and help with the luggage are already included.',
        rowRide: 'The ride',
        rowNight: 'Night rate',
        rowSeat: 'Child seat',
        rowStop: 'Stop on the way',
        rowTime: 'On the road',
        minutes: 'min',
        carFor: 'Selected',
        carWhy: 'by passengers and suitcases',
        destinations: {
          adler: 'Adler',
          sirius: 'Sirius and the Olympic Park',
          hosta: 'Khosta',
          matsesta: 'Matsesta',
          center: 'Central Sochi',
          dagomys: 'Dagomys',
          loo: 'Loo',
          polyana: 'Krasnaya Polyana',
          gagra: 'Gagra, Abkhazia',
        },
      },

      how: {
        eyebrow: 'Step by step',
        title: 'How the pickup works',
        lead:
          'The usual run from booking to hotel. Times are given relative to the plane landing.',
        t1: '−24 h',
        t2: '−2 h',
        t3: '00:00',
        t4: '+15 min',
        t5: '+55 min',
        s1t: 'You send us the flight',
        s1d:
          'Flight number, date and address. Back comes a confirmation with the price and the driver’s name.',
        s2t: 'We watch the board',
        s2d: 'If the flight moves, the driver leaves at the new time. You do not have to do anything.',
        s3t: 'The plane lands',
        s3d: 'A message arrives: the driver’s name, the car and plate, and exactly where he stands.',
        s4t: 'Meeting in arrivals',
        s4d: 'A sign with your name at the exit. We help with the suitcases and walk to the car.',
        s5t: 'You are there',
        s5d:
          'We drive to the door, not to the nearest corner. After that it is up to you: the city, the mountains, the sea.',
      },

      tours: {
        eyebrow: 'Tours',
        title: 'Where to go while you are here',
        lead: 'The price is for the whole car, not per person. Departure from your hotel at any time.',
        empty: 'Nothing in this direction yet — write to us and we will put something together.',
        book: 'Book',
        hours: 'h',
        perCar: 'per car',
        route: 'Route',
        filters: {
          all: 'All',
          mountains: 'Mountains',
          sea: 'Sea',
          city: 'City',
          abkhazia: 'Abkhazia',
        },
        items: {
          polyana: {
            name: 'Krasnaya Polyana and Rosa Khutor',
            note:
              'Three cable cars, the ridge seen from 2320 metres and lunch in a mountain village. Green and waterfalls in summer, snow an hour from the sea in winter.',
            stops: ['Esto-Sadok', 'Rosa Khutor', 'Peak 2320', 'Achipse waterfalls'],
          },
          abkhazia: {
            name: 'Abkhazia: New Athos and Lake Ritsa',
            note:
              'A whole day abroad and back by dinner. A cave, a monastery, a lake in the mountains and a stop for tangerines. Bring your passport.',
            stops: ['The border', 'Gagra', 'New Athos', 'Lake Ritsa'],
          },
          tea: {
            name: 'The tea plantations of Matsesta',
            note:
              'The northernmost tea in the world: fields on the slopes, the factory, a tasting with pies. A calm half-day route that works well with children.',
            stops: ['Matsesta', 'The plantations', 'The factory', 'A tasting'],
          },
          waterfalls: {
            name: '33 Waterfalls and the yew-boxwood grove',
            note:
              'A drive along a riverbed in an off-roader, a cascade of waterfalls and a walk through a relict forest older than everything around it.',
            stops: ['Shakhe river valley', '33 Waterfalls', 'Yew-boxwood grove'],
          },
          night: {
            name: 'Sochi after dark',
            note:
              'Three hours after sunset: the promenade, the singing fountains, the viewpoint on Mount Akhun and the city in lights below.',
            stops: ['Sea terminal', 'Riviera Park', 'Singing fountains', 'Mount Akhun'],
          },
          sea: {
            name: 'The sea and Sirius',
            note:
              'A boat trip along the coast, the Olympic venues and the evening fountains. Half a day with no mountain switchbacks.',
            stops: ['Sochi port', 'Boat trip', 'Olympic Park', 'Sirius'],
          },
        },
      },

      fleet: {
        eyebrow: 'The cars',
        title: 'What you will ride in',
        lead:
          'The class is chosen by the number of people and suitcases — the calculator above does it for you.',
        pax: 'up to',
        paxUnit: 'passengers',
        bagsUnit: 'suitcases',
        items: {
          standard: {
            name: 'Sedan',
            note: 'A couple, or one person with luggage. Skoda Octavia, Toyota Camry and the like.',
            features: ['Air conditioning', 'Water for the road', 'Child seat on request'],
          },
          minivan: {
            name: 'Minivan',
            note: 'A family or a small group. Enough room for both the people and the suitcases.',
            features: ['Separate boot', 'Two child seats', 'Sockets in the cabin'],
          },
          bus: {
            name: 'Minibus',
            note: 'A group, a wedding, a conference. One driver for the whole day if you need it.',
            features: ['Luggage compartment', 'Microphone for the guide', 'Pickup at any terminal'],
          },
        },
      },

      voices: {
        eyebrow: 'Reviews',
        title: 'What people write afterwards',
        items: [
          {
            text:
              'The flight was four hours late and I was sure I would be hunting for a taxi at three in the morning. The driver waited and never once mentioned a surcharge.',
            author: 'Olga',
            role: 'airport pickup, March',
          },
          {
            text:
              'They drove us for a week: hotel, restaurants, Rosa Khutor. The same driver throughout, who already knew where we liked to stop on the way.',
            author: 'Sergey',
            role: 'transfers, seven days',
          },
          {
            text:
              'Six of us went to Ritsa in a minivan. The guide reshuffled the route on the move because of the rain — and it came out better than the plan.',
            author: 'Marina',
            role: 'tour to Abkhazia',
          },
        ],
      },

      contacts: {
        eyebrow: 'Booking',
        title: 'Send us the flight — we take it from there',
        lead:
          'We answer within half an hour and send a confirmation with the driver’s name. At night it comes in the morning, but the pickup happens either way.',
        officeLabel: 'Office',
        officeValue: 'Sochi, Adler, Mira st. 24 — second floor',
        hoursLabel: 'Dispatcher',
        hoursValue: 'Round the clock, every day',
        tgLabel: 'Telegram and WhatsApp',
        tgValue: '@kluchi_sochi',
        fName: 'Name',
        fNamePh: 'What to put on the sign',
        errName: 'Please add a name — it goes on the sign',
        fContact: 'Phone or messenger',
        fContactPh: '+7 900 000-00-00',
        errContact: 'Without a contact we cannot send the confirmation',
        fFlight: 'Flight number',
        fFlightPh: 'SU 1128',
        fFlightHint: 'It is on your ticket. We track delays by it.',
        fDate: 'Arrival date',
        fNote: 'Where to and any wishes',
        fNotePh: 'Hotel in Sirius, two child seats please',
        submit: 'Send the booking',
        privacy: 'Your details are used only to answer this booking. No mailing lists.',
        sent: 'Booking received. We will reply within half an hour and send a confirmation.',
        prefillTransfer: 'Transfer',
        prefillTour: 'Tour',
      },

      footer: {
        tagline: 'Meeting, driving and showing Sochi since 2016',
        rights: 'Prices and routes are illustrative',
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
})(window.Kluchi);
