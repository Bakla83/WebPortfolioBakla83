(function () {
  'use strict';

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  var ARTICLES = [
    {
      id: 'divan',
      title: 'Как выбрать итальянский диван и не ошибиться с размером',
      lead: 'Чаще всего диван возвращают не потому, что он неудобный, ' +
        'а потому, что он не встал в комнату. Разбираем по порядку: ' +
        'сначала помещение, потом глубина посадки, потом наполнение и ткань.',
      tag: 'Как выбрать',
      date: 'Март 2026',
      read: '7 минут',
      art: 'divany',
      body: [
        ['p', 'Диван — самая дорогая ошибка в гостиной. Его выбирают по картинке ' +
          'в каталоге, меряют рулеткой стену и заказывают. Через четыре месяца ' +
          'приезжает вещь, которая по размеру подходит, а жить с ней неудобно: ' +
          'проход сузился до полуметра, спинка оказалась ниже подоконника, ' +
          'а сидеть на глубоком сиденье прямо невозможно.'],
        ['p', 'Порядок, в котором стоит принимать решения, обратный привычному. ' +
          'Сначала комната, потом посадка, потом конструкция, и только в конце — ' +
          'обивка, с которой обычно начинают.'],

        ['h', 'Сначала комната, а не диван'],
        ['p', 'Размер дивана определяется не длиной стены, а тем, что остаётся ' +
          'вокруг него. Три расстояния, которые стоит отложить на плане до того, ' +
          'как открывать каталог:'],
        ['ul', [
          '<b>Проход вдоль дивана</b> — 70–90 см. Меньше 70 см приходится ' +
            'протискиваться боком, и это единственное, что запоминается о новой ' +
            'гостиной в первый месяц.',
          '<b>До журнального стола</b> — 40–45 см. Дальше неудобно дотянуться, ' +
            'ближе не встать с сиденья.',
          '<b>До экрана</b> — примерно две с половиной диагонали телевизора. ' +
            'Для 65 дюймов это около трёх метров.',
        ]],
        ['p', 'И отдельно — путь до квартиры. Итальянский диван редко приезжает ' +
          'разобранным: у моделей с цельным каркасом проносить придётся так, ' +
          'как есть. Замерить нужно ширину лифта, высоту его дверного проёма, ' +
          'разворот на площадке и самый узкий дверной проём в квартире. ' +
          'Если что-то не проходит — берём модульную сборку, она стыкуется на месте.'],
        ['note', 'Самая частая накладка при доставке — не габарит дивана, ' +
          'а разворот на лестничной площадке. Его почти никто не меряет.'],

        ['h', 'Глубина посадки решает больше, чем длина'],
        ['p', 'Глубина сиденья 55–60 см — это «сидеть»: спина у спинки, ноги ' +
          'на полу, удобно за столом и в разговоре. Глубина 90–110 см — ' +
          'это «лежать»: диван превращается в мягкую площадку с подушками, ' +
          'сидеть на нём прямо не получится, придётся подкладывать подушку ' +
          'под поясницу.'],
        ['p', 'Оба варианта нормальные, но они про разную жизнь. Ошибка ' +
          'начинается там, где глубокий диван берут в комнату, где чаще ' +
          'принимают гостей, чем смотрят кино.'],
        ['q', 'Если рост в семье различается сильно, выигрывает средняя ' +
          'глубина с подвижными подушками спинки: её можно подстроить, ' +
          'а глубину каркаса — уже нет.'],

        ['h', 'Наполнение: что будет через три года'],
        ['p', 'Внешне новые диваны почти одинаковы. Разница видна на третий год, ' +
          'и заложена она в наполнении сидений.'],
        ['ul', [
          '<b>Пух и перо.</b> Самая мягкая посадка и характерная мятая ' +
            'подушка — тот самый вид «обжитого» дивана. Требует ухода: ' +
            'подушки надо взбивать, иначе наполнитель сваливается к краям.',
          '<b>Эластичный пенополиуретан высокой плотности.</b> Держит форму, ' +
            'почти не требует ухода, посадка более собранная. Плотность важнее ' +
            'толщины: мягкий пух поверх плотного блока даёт и вид, и опору.',
          '<b>Комбинация: пенополиуретан плюс пуховый чехол.</b> То, что ' +
            'ставят в свои коллекции большинство итальянских фабрик — ' +
            'компромисс между «мягко» и «не проседает».',
        ]],
        ['p', 'Каркас в этом сегменте — сухая древесина твёрдых пород ' +
          'или комбинация дерева с металлом. Стоит спросить о гарантии ' +
          'именно на каркас: она обычно длиннее гарантии на обивку, ' +
          'и её длина хорошо говорит о том, что фабрика думает о своей ' +
          'конструкции.'],

        ['h', 'Обивка: чем платят за красивую ткань'],
        ['p', 'Обивку выбирают последней и по трём вопросам: кто живёт в доме, ' +
          'сколько солнца в комнате, готовы ли вы снимать чехлы.'],
        ['ul', [
          '<b>Велюр</b> — глубокий цвет и мягкость, но заметны заломы ' +
            'и следы от ладони. С животными живёт плохо: когти вытягивают петли.',
          '<b>Шенилл и рогожка</b> — практичнее велюра, спокойнее выглядят, ' +
            'лучше переносят ежедневную нагрузку.',
          '<b>Кожа</b> — самая простая в уходе и самая требовательная ' +
            'к солнцу: на прямом свету выгорает и подсыхает. Стареет ' +
            'красиво, в отличие от ткани.',
          '<b>Съёмные чехлы</b> — то, о чём жалеют чаще всего, когда ' +
            'сэкономили. С детьми и животными это главное решение, ' +
            'а не деталь.',
        ]],
        ['p', 'Стойкость ткани к истиранию измеряют циклами Мартиндейла. ' +
          'Для дивана в гостиной разумный ориентир — от 25 000 циклов, ' +
          'для дома с детьми и животными лучше от 40 000. Эта цифра есть ' +
          'в спецификации ткани, и её можно спросить до заказа.'],

        ['h', 'Что спросить в салоне до заказа'],
        ['ul', [
          'Габариты с точностью до сантиметра — и отдельно габарит в упаковке.',
          'Разбирается ли диван для проноса.',
          'Плотность наполнителя сидений и материал каркаса.',
          'Класс износостойкости ткани и есть ли съёмные чехлы.',
          'Срок производства именно в этой ткани — редкие артикулы ждут дольше.',
          'Что входит в доставку: подъём, сборка, вынос упаковки.',
        ]],
        ['p', 'Последнее: ткань невозможно выбрать по экрану. Один и тот же ' +
          'артикул на мониторе, при дневном свете в зале и вечером под ' +
          'домашней лампой — три разных цвета. Образцы имеет смысл взять ' +
          'домой и посмотреть у своего окна.'],
      ],
    },
    {
      id: 'srok',
      title: 'Сколько на самом деле ждать мебель из Италии',
      lead: 'Обычный срок — от 10 до 16 недель. Разбираем, из чего он ' +
        'складывается, что его сдвигает и как спланировать заказ так, ' +
        'чтобы мебель не приехала в комнату без отделки.',
      tag: 'Сроки и поставка',
      date: 'Апрель 2026',
      read: '6 минут',
      art: 'frame',
      body: [
        ['p', 'Вопрос про срок задают вторым, сразу после цены. Ответ ' +
          '«десять–шестнадцать недель» звучит расплывчато, пока не видно, ' +
          'из чего этот срок собирается. А собирается он из четырёх частей, ' +
          'и растягивают его обычно первая и последняя.'],

        ['h', 'Из чего складываются недели'],
        ['ul', [
          '<b>Спецификация и подтверждение заказа — 1–2 недели.</b> ' +
            'Фабрика подтверждает комплектацию: размеры, ткань, отделку, ' +
            'фурнитуру. Пока хоть один пункт не согласован, заказ ' +
            'в производство не уходит.',
          '<b>Производство — 6–10 недель.</b> Мебель этого уровня ' +
            'не лежит на складе фабрики: её начинают делать после ' +
            'подтверждения, под конкретный заказ.',
          '<b>Логистика — 2–4 недели.</b> Сборный груз из Италии, ' +
            'таможенное оформление, перевозка до Краснодара.',
          '<b>Доставка и сборка — несколько дней.</b> Подъём, распаковка, ' +
            'сборка на месте, вынос упаковки.',
        ]],
        ['note', 'Недели считаются с даты подтверждения спецификации, ' +
          'а не с даты разговора в салоне. Между ними легко проходит ещё ' +
          'две недели, если решение по ткани откладывается.'],

        ['h', 'Что сдвигает срок вправо'],
        ['p', '<b>Редкая ткань или отделка.</b> Ткань из основной карты ' +
          'фабрика держит у себя. Артикул стороннего производителя ' +
          'фабрика сначала заказывает сама — плюс две–четыре недели ' +
          'к производству.'],
        ['p', '<b>Нестандартный размер.</b> Изменение габарита — это другой ' +
          'раскрой каркаса, а иногда и другая оснастка. Считается как ' +
          'отдельная позиция.'],
        ['p', '<b>Август.</b> Итальянские фабрики массово закрываются ' +
          'на летние каникулы — в августе производство стоит почти целиком. ' +
          'Заказ, подтверждённый в конце июля, реально начинают делать ' +
          'в сентябре. То же самое, только короче, происходит на Рождество.'],
        ['p', '<b>Выставочный сезон.</b> После апрельского мебельного салона ' +
          'в Милане очередь на производство длиннее обычного: фабрики ' +
          'разгребают заказы, собранные на выставке.'],

        ['h', 'Что сокращает срок'],
        ['ul', [
          '<b>Позиции в наличии.</b> Часть коллекций стоит у нас в зале ' +
            'и на складе — их отгружают сразу, ждать нечего.',
          '<b>Ткань из основной карты фабрики.</b> Самый простой способ ' +
            'убрать из срока две–четыре недели.',
          '<b>Готовая спецификация.</b> Если размеры комнаты и решение ' +
            'по отделке есть на первой встрече, первая часть срока ' +
            'сокращается до нескольких дней.',
        ]],

        ['h', 'Как спланировать заказ под ремонт'],
        ['p', 'Мебель заказывают не тогда, когда закончен ремонт, а тогда, ' +
          'когда готов план помещения с размерами и известны точки ' +
          'подключения. Практический порядок такой:'],
        ['ul', [
          'На стадии чернового ремонта — обмер, планировка, выбор ' +
            'коллекций и подтверждение спецификации.',
          'За 10–16 недель до заселения — заказ в производство.',
          'К моменту доставки в квартире должны быть закончены полы, ' +
            'стены и потолок: мебель этого уровня нельзя хранить ' +
            'в упаковке в пыли, а распаковывать её в комнате со свежей ' +
            'штукатуркой не стоит тем более.',
        ]],
        ['q', 'Самая частая причина сорванного новоселья — не задержка ' +
          'фабрики, а решение по ткани, принятое на месяц позже, чем ' +
          'планировалось.'],
        ['p', 'И последнее, о чём стоит договориться заранее: где мебель ' +
          'постоит, если ремонт задержится. Хранение обсуждается до заказа, ' +
          'а не в день прихода машины.'],
      ],
    },
  ];

  function bodyHTML(a) {
    return a.body.map(function (b) {
      if (b[0] === 'h') return '<h2>' + b[1] + '</h2>';
      if (b[0] === 'q') return '<blockquote class="pull">' + b[1] + '</blockquote>';
      if (b[0] === 'note') return '<p class="artnote">' + b[1] + '</p>';
      if (b[0] === 'ul') {
        return '<ul>' + b[1].map(function (li) { return '<li>' + li + '</li>'; }).join('') + '</ul>';
      }
      return '<p>' + b[1] + '</p>';
    }).join('');
  }

  function byId(id) {
    return ARTICLES.filter(function (a) { return a.id === id; })[0];
  }

  function reveal(root) {
    var items = $$('.reveal', root);
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (rows) {
      rows.forEach(function (r) {
        if (r.isIntersecting) { r.target.classList.add('is-in'); io.unobserve(r.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  function initArticle() {
    var box = $('[data-art-body]');
    if (!box) return;

    var a = byId(new URLSearchParams(location.search).get('id')) || ARTICLES[0];
    var other = ARTICLES.filter(function (x) { return x.id !== a.id; })[0];

    box.innerHTML = bodyHTML(a);

    $$('[data-art-title]').forEach(function (el) { el.textContent = a.title; });
    $$('[data-art-lead]').forEach(function (el) { el.textContent = a.lead; });
    $$('[data-art-tag]').forEach(function (el) { el.textContent = a.tag; });
    $$('[data-art-date]').forEach(function (el) { el.textContent = a.date; });
    $$('[data-art-read]').forEach(function (el) { el.textContent = a.read; });

    document.title = a.title + ' — Brand Gallery Home, Краснодар';
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', a.lead);

    var ph = window.SITE || window.VLIB;
    $$('[data-art-art]').forEach(function (el) {
      if (ph && ph.ph) el.innerHTML = ph.ph(a.art, a.id.length + 3);
    });

    $$('[data-art-next]').forEach(function (el) {
      el.querySelectorAll('[data-next-title]').forEach(function (t) { t.textContent = other.title; });
      el.querySelectorAll('[data-next-tag]').forEach(function (t) { t.textContent = other.tag; });
      el.querySelectorAll('a').forEach(function (link) { link.href = 'article.html?id=' + other.id; });
      if (ph && ph.ph) {
        el.querySelectorAll('[data-next-art]').forEach(function (m) {
          m.innerHTML = ph.ph(other.art, other.id.length + 3);
        });
      }
    });

    var toc = $('[data-art-toc]');
    if (toc) {
      var hs = $$('h2', box);
      toc.innerHTML = hs.map(function (h, i) {
        h.id = 'h' + (i + 1);
        return '<a href="#h' + (i + 1) + '">' + h.textContent + '</a>';
      }).join('');
    }
  }

  function initArticleList() {
    var box = $('[data-art-list]');
    if (!box) return;

    var tpl = box.getAttribute('data-art-list');
    var ph = window.SITE || window.VLIB;

    box.innerHTML = ARTICLES.map(function (a, i) {
      var media = ph && ph.ph ? ph.ph(a.art, i + 4) : '';
      var href = 'article.html?id=' + a.id;

      if (tpl === 'strip') {
        return '<article class="artstrip reveal">' +
          '<a class="artstrip__media" href="' + href + '">' + media + '</a>' +
          '<div class="artstrip__txt">' +
            '<span class="eyebrow">' + a.tag + ' · ' + a.read + '</span>' +
            '<h2 class="artstrip__title"><a href="' + href + '">' + a.title + '</a></h2>' +
            '<p>' + a.lead + '</p>' +
            '<a class="linkline" href="' + href + '">Читать</a>' +
          '</div></article>';
      }

      if (tpl === 'line') {
        return '<a href="' + href + '">' +
          '<span class="artline__tag">' + a.tag + '</span>' +
          '<b>' + a.title + '</b>' +
          '<span class="artline__read">' + a.read + '</span></a>';
      }

      if (tpl === 'row') {
        return '<a class="artrow" href="' + href + '">' +
          '<div class="artrow__media">' + media + '</div>' +
          '<div class="artrow__txt">' +
            '<span class="artrow__tag">' + a.tag + '</span>' +
            '<h2>' + a.title + '</h2>' +
            '<p>' + a.lead + '</p>' +
            '<span class="artrow__meta">' + a.date + ' · ' + a.read + '</span>' +
          '</div></a>';
      }

      if (tpl === 'post') {
        return '<a class="post" href="' + href + '">' +
          '<div class="post__box">' + media + '</div>' +
          '<h3>' + a.title + '</h3>' +
          '<div class="tiny">' + a.tag + ' · ' + a.read + '</div></a>';
      }

      if (tpl === 'tile') {
        return '<a href="' + href + '">' + media +
          '<h3>' + a.title + '</h3>' +
          '<span>' + a.date + ' · ' + a.read + '</span></a>';
      }

      return '<a class="artcard reveal" href="' + href + '">' +
        '<div class="artcard__media">' + media + '</div>' +
        '<span class="eyebrow">' + a.tag + '</span>' +
        '<h2 class="artcard__title">' + a.title + '</h2>' +
        '<p>' + a.lead + '</p>' +
        '<span class="tiny">' + a.date + ' · ' + a.read + '</span>' +
        '</a>';
    }).join('');

    if (box.hasAttribute('data-art-soon')) {
      var soon = ph && ph.ph ? ph.ph('frame', 9) : '';
      var title = 'Массив и шпон в мебели премиум-класса';
      var html;
      if (tpl === 'tile') {
        html = '<div class="is-soon">' + soon +
          '<h3>' + title + '</h3><span>В работе</span></div>';
      } else if (tpl === 'card') {
        html = '<div class="artcard is-soon">' +
          '<div class="artcard__media">' + soon + '</div>' +
          '<span class="eyebrow">Материалы</span>' +
          '<h2 class="artcard__title">' + title + '</h2>' +
          '<p>Чем массив честнее шпона, где шпон уместнее и как отличить одно ' +
          'от другого в готовой вещи.</p>' +
          '<span class="tiny">В работе</span></div>';
      } else {
        html = '<div class="post is-soon"><div class="post__box">' + soon + '</div>' +
          '<h3>' + title + '</h3><div class="tiny">В работе</div></div>';
      }
      box.insertAdjacentHTML('beforeend', html);
    }

    reveal(box);
  }

  var MAP =
    '<svg viewBox="0 0 1200 560" role="img" ' +
      'aria-label="Схема проезда: БЦ Full House, угол улицы Бабушкина и 2-го Гаражного проезда">' +

      '<g class="mp-block">' +
        '<rect x="0" y="0" width="470" height="250"/>' +
        '<rect x="610" y="0" width="590" height="250"/>' +
        '<rect x="0" y="360" width="470" height="200"/>' +
        '<rect x="610" y="360" width="590" height="200"/>' +
      '</g>' +

      '<g class="mp-road">' +
        '<path d="M0 305h1200"/>' +
        '<path d="M540 0v560"/>' +
      '</g>' +
      '<g class="mp-road-line"><path d="M0 305h1200"/></g>' +

      '<g class="mp-here">' +
        '<rect x="620" y="360" width="250" height="150"/>' +
      '</g>' +

      '<g class="mp-park">' +
        '<rect x="890" y="360" width="110" height="90"/>' +
        '<text x="945" y="414">P</text>' +
      '</g>' +

      '<g class="mp-pin">' +
        '<path d="M745 300c-24 0-43 19-43 43 0 32 43 74 43 74s43-42 43-74c0-24-19-43-43-43z"/>' +
        '<circle cx="745" cy="343" r="15"/>' +
      '</g>' +

      '<g class="mp-label">' +
        '<text x="40" y="288">ул. Бабушкина</text>' +
        '<text x="560" y="60" class="mp-label--v">2-й Гаражный проезд</text>' +
        '<text x="644" y="450" class="mp-label--on">БЦ Full House</text>' +
        '<text x="644" y="484" class="mp-label--on mp-label--s">3 этаж · салон</text>' +
        '<text x="620" y="545" class="mp-label--s">парковка у здания</text>' +
      '</g>' +
    '</svg>';

  function initMap() {
    $$('[data-map]').forEach(function (el) {
      el.innerHTML = MAP;

      var svg = el.firstChild;
      if (!svg || el.scrollWidth <= el.clientWidth) return;
      var PIN = 745 / 1200;
      el.scrollLeft = svg.getBoundingClientRect().width * PIN - el.clientWidth / 2;
    });
  }

  function initFill() {
    var lib = window.SITE || window.VLIB;
    if (!lib || !lib.ph) return;

    $$('[data-ph]').forEach(function (el, i) {
      el.innerHTML = lib.ph(el.getAttribute('data-ph'), i + 2);
    });

    var D = window.DEMO;
    if (!D) return;

    var marks = $('[data-marks]');
    if (marks) {
      marks.innerHTML = Object.keys(D.FACTORIES).map(function (n) {
        var cnt = D.products.filter(function (p) { return p.factory === n; }).length;
        return '<a href="factory.html?f=' + encodeURIComponent(n) + '">' +
          lib.esc(n) + '<span>' + cnt + '</span></a>';
      }).join('');
    }

    var brands = $('[data-brands]');
    if (brands) {
      var names = Object.keys(D.FACTORIES).slice(0, 11);
      brands.innerHTML = names.map(function (n) {
        return '<a href="factory.html?f=' + encodeURIComponent(n) + '">' +
          '<b>' + lib.esc(n) + '</b><span>' + lib.esc(D.FACTORIES[n].country) + '</span></a>';
      }).join('') +
        '<a href="factory.html"><b>Все фабрики</b><span>список целиком</span></a>';
    }
  }

  function initForms() {
    $$('form[data-mockform]').forEach(function (form) {
      var sent = $('#' + form.getAttribute('data-mockform'));
      if (!sent) return;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        form.hidden = true;
        sent.hidden = false;
        sent.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  initFill();
  initArticle();
  initArticleList();
  initMap();
  initForms();

  window.PAGES = { ARTICLES: ARTICLES, bodyHTML: bodyHTML };
})();
