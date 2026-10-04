import type { Localized } from '../i18n/config';
import type { Accent } from './types';

import thlCatTrade from './test-code/thl-cat-trade.cs?raw';
import thlCatTradeFix from './test-code/thl-cat-trade-fix.cs?raw';
import thlItemDatabase from './test-code/thl-item-database.cs?raw';
import thlMissingScripts from './test-code/thl-missing-scripts.cs?raw';
import thlUtf8 from './test-code/thl-utf8.cs?raw';
import thlSave from './test-code/thl-save.cs?raw';
import thlDialog from './test-code/thl-dialog.cs?raw';
import thlInventory from './test-code/thl-inventory.cs?raw';
import thlInventoryDialogFix from './test-code/thl-inventory-dialog-fix.cs?raw';
import thlQuitFix from './test-code/thl-quit-fix.cs?raw';
import thlFootstepsFix from './test-code/thl-footsteps-fix.cs?raw';

import bghRepeat from './test-code/bgh-repeat.php?raw';
import bghRepeatFix from './test-code/bgh-repeat-fix.php?raw';
import bghPriceSync from './test-code/bgh-price-sync.php?raw';
import bghPriceSyncFix from './test-code/bgh-price-sync-fix.php?raw';
import bghBulkEdit from './test-code/bgh-bulk-edit.php?raw';
import bghBulkEditFix from './test-code/bgh-bulk-edit-fix.php?raw';
import bghFormLayers from './test-code/bgh-form-layers.php?raw';
import bghValidation from './test-code/bgh-validation.php?raw';

import webSitemap from './test-code/web-sitemap.mjs?raw';
import webSitemapFix from './test-code/web-sitemap-fix.mjs?raw';
import webMarkup from './test-code/web-markup.mjs?raw';
import webHeadingsFix from './test-code/web-headings-fix.astro.txt?raw';
import webDescriptionFix from './test-code/web-description-fix.astro.txt?raw';
import webTargets from './test-code/web-targets.mjs?raw';
import webTargetsFix from './test-code/web-targets-fix.css?raw';
import webReflow from './test-code/web-reflow.mjs?raw';
import webKeyboard from './test-code/web-keyboard.mjs?raw';
import webFilters from './test-code/web-filters.mjs?raw';
import webFiltersFix from './test-code/web-filters-fix.css?raw';
import webAnchor from './test-code/web-anchor.mjs?raw';
import webData from './test-code/web-data.mjs?raw';
import webMenu from './test-code/web-menu.mjs?raw';
import webSyncDemosFix from './test-code/web-sync-demos-fix.mjs?raw';
import webHeaderOverlap from './test-code/web-header-overlap.mjs?raw';
import webHeaderOverlapFix from './test-code/web-header-overlap-fix.css?raw';

export type TestProjectId = 'thl' | 'bgh' | 'web';
export type TestKind = 'auto' | 'manual';
export type TestPriority = 'high' | 'medium' | 'low';
export type CodeLang = 'csharp' | 'php' | 'javascript' | 'css' | 'astro';

export interface TestCode {
  file: string;
  lang: CodeLang;
  role: 'test' | 'fix';
  source: string;
}

export interface TestCase {
  id: string;
  project: TestProjectId;
  title: Localized<string>;
  kind: TestKind;

  level: Localized<string>;
  priority: TestPriority;

  bug?: string;
  preconditions: Localized<string[]>;
  steps: Localized<string[]>;
  expected: Localized<string>;

  before?: Localized<string>;

  fix?: Localized<string>;
  code: TestCode[];
}

export interface TestProject {
  id: TestProjectId;
  name: string;
  accent: Accent;

  href: string;
  stack: string[];
  summary: Localized<string>;

  defects: number;
  environment: Localized<string>;
  stats: { value: string; label: Localized<string> }[];
  methods: Localized<string[]>;
  run: string[];
  note?: Localized<string>;
}

export const TEST_PROJECTS: TestProject[] = [
  {
    id: 'thl',
    name: 'The Hidden Library',
    accent: 'gold',
    href: 'work/pc-games/the-hidden-library',
    defects: 9,
    stack: ['Unity 6', 'C#', 'NUnit', 'Unity Test Framework', 'FMOD'],
    summary: {
      ru: '2D point-and-click игра на Unity: сюжет, диалоги, мини-игры, сохранения в трёх слотах и четыре языка. Проверял логику квестов, сохранения, инвентарь и целостность данных сцен.',
      en: 'A 2D point-and-click game in Unity: story, dialogues, mini-games, saves in three slots and four languages. I tested quest logic, saves, the inventory and scene data integrity.',
    },
    environment: {
      ru: 'Unity 6000.0.35f1, Windows 11. EditMode-тесты, Test Runner',
      en: 'Unity 6000.0.35f1, Windows 11. EditMode tests, Test Runner',
    },
    stats: [
      { value: '24', label: { ru: 'автотеста NUnit', en: 'NUnit tests' } },
      { value: '9', label: { ru: 'дефектов найдено', en: 'defects found' } },
      { value: '24/24', label: { ru: 'прошли после правок', en: 'pass after fixes' } },
    ],
    methods: {
      ru: [
        'Ручной code review (белый ящик)',
        'Проверка целостности сцен и данных',
        'Модульные и интеграционные EditMode-тесты',
        'Проверка кодировки исходников',
        'Анализ логов Player.log и Editor.log',
        'Регрессионная проверка правок',
      ],
      en: [
        'Manual code review (white box)',
        'Scene and data integrity checks',
        'Unit and integration EditMode tests',
        'Source encoding checks',
        'Player.log and Editor.log analysis',
        'Regression check of every change',
      ],
    },
    run: ['Window > General > Test Runner > EditMode > Run All'],
    note: {
      ru: 'Статус «до исправления» у автотестов игры определён разбором кода и данных сцены: запустить Unity из командной строки до правок мешала лицензия. После правок все 24 теста прогнаны в Test Runner.',
      en: 'The “before the fix” status of the game tests comes from reading the code and scene data: a licence issue blocked running Unity from the command line before the changes. After the fixes all 24 tests were run in the Test Runner.',
    },
  },
  {
    id: 'bgh',
    name: 'BrandGallery Home',
    accent: 'purple',
    href: 'work/commercial/brandgalleryhome',
    defects: 3,
    stack: ['PHP 8.2', 'WordPress', 'WooCommerce', 'Node.js'],
    summary: {
      ru: 'Сайт салона итальянской мебели на WordPress и WooCommerce: каталог, форма заявки, синхронизация цен с партнёром, админка для сотрудников. Проверял точки входа, защиту формы, права и логику цен.',
      en: 'A WordPress and WooCommerce site for an Italian furniture showroom: catalogue, request form, price sync with a partner, staff admin. I tested entry points, form protection, permissions and pricing logic.',
    },
    environment: {
      ru: 'PHP 8.3 CLI, тесты на заглушках WordPress: без базы, почты и сети',
      en: 'PHP 8.3 CLI, tests on WordPress stubs: no database, mail or network',
    },
    stats: [
      { value: '138', label: { ru: 'автоматических проверок', en: 'automated checks' } },
      { value: '3', label: { ru: 'дефекта найдено', en: 'defects found' } },
      { value: '0', label: { ru: 'провалов после правок', en: 'failures after fixes' } },
    ],
    methods: {
      ru: [
        'Ручной code review (белый ящик)',
        'Аудит 25 точек входа: nonce и права',
        'Проверка запросов к базе на SQL-инъекции',
        'Тестирование по требованиям из документации',
        'Модульные и интеграционные тесты на заглушках',
        'Регрессионный прогон 91 существующей проверки',
      ],
      en: [
        'Manual code review (white box)',
        'Audit of 25 entry points: nonce and permissions',
        'Database queries checked for SQL injection',
        'Requirements-based testing against the docs',
        'Unit and integration tests on stubs',
        'Regression run of 91 existing checks',
      ],
    },
    run: [
      'php tools/request-test.php',
      'php tools/price-sync-test.php',
      'php tools/bulk-edit-test.php',
      'node wp-content/themes/bgh-theme/assets/js/phone.test.js',
    ],
  },
  {
    id: 'web',
    name: 'WebPortfolioBakla83',
    accent: 'green',
    href: '',
    defects: 9,
    stack: ['Astro', 'TypeScript', 'Playwright', 'Node.js', 'Cloudflare Pages'],
    summary: {
      ru: 'Этот сайт: статическое портфолио на Astro на двух языках, с тёмной и светлой темой и запускаемыми копиями работ. Проверял разметку всех страниц, карту сайта, узкие экраны, клавиатуру, данные проектов и этот раздел.',
      en: 'This site: a static Astro portfolio in two languages, with dark and light themes and runnable copies of my work. I tested the markup of every page, the sitemap, narrow screens, the keyboard, project data and this section.',
    },
    environment: {
      ru: 'Node 22, Playwright и Chromium. Собранный сайт отдаётся локально с теми же заголовками безопасности, что на Cloudflare Pages',
      en: 'Node 22, Playwright and Chromium. The built site is served locally with the same security headers as on Cloudflare Pages',
    },
    stats: [
      { value: '154', label: { ru: 'автоматических проверок', en: 'automated checks' } },
      { value: '9', label: { ru: 'дефектов найдено', en: 'defects found' } },
      { value: '0', label: { ru: 'провалов после правок', en: 'failures after fixes' } },
    ],
    methods: {
      ru: [
        'E2E в браузере: язык, тема, меню, обход всех ссылок',
        'Разметка и SEO каждой страницы: h1, заголовки, canonical, hreflang',
        'Перенос на 320, 360 и 390 пикселях (WCAG 1.4.10)',
        'Размер целей касания (WCAG 2.5.8) и клавиатура',
        'Целостность данных и словарей до сборки',
        'Заголовки безопасности и CSP',
      ],
      en: [
        'Browser E2E: language, theme, menu, crawl of every link',
        'Markup and SEO of every page: h1, headings, canonical, hreflang',
        'Reflow at 320, 360 and 390 pixels (WCAG 1.4.10)',
        'Target size (WCAG 2.5.8) and keyboard',
        'Data and dictionary integrity before the build',
        'Security headers and CSP',
      ],
    },
    run: ['npm run build', 'npm test', 'npm run audit', 'node tools/sync-demos.mjs --check'],
    note: {
      ru: '154 проверки — это 50 в новом tools/site-test.mjs и 104 в уже существовавшем tools/audit.mjs. Первый прогон нового набора дал 10 провалов. За девятью стояли 6 дефектов: три провала у корня сайта указали на одну причину, служебную страницу в карте сайта. Десятый был ошибкой самого теста: после клика блок кода переставал подходить под селектор, и проверялся соседний блок. Тест исправлен, поведение страницы осталось прежним.',
      en: 'The 154 checks are 50 in the new tools/site-test.mjs and 104 in the existing tools/audit.mjs. The first run of the new suite gave 10 failures. Nine of them traced back to 6 defects: three failures on the site root shared one cause, a utility page listed in the sitemap. The tenth was a mistake in the test itself: after a click the code block stopped matching the selector, so the next block was checked instead. The test was fixed; the page behaviour stayed the same.',
    },
  },
];

export const TEST_CASES: TestCase[] = [
  {
    id: 'TC-THL-01',
    project: 'thl',
    kind: 'auto',
    priority: 'high',
    bug: 'BUG-01',
    title: {
      ru: 'Подсказка к паролю открывается после обмена с котом',
      en: 'The password hint unlocks after the trade with the cat',
    },
    level: { ru: 'Интеграционный, EditMode', en: 'Integration, EditMode' },
    preconditions: {
      ru: ['Квест кота пройден до обмена мяты на бумажку', 'У стола в сарае включено условие «нужен обмен с котом»'],
      en: ['The cat quest is completed up to trading catnip for the note', 'The shed table requires the cat trade'],
    },
    steps: {
      ru: [
        'Поставить флаг, который пишет квест кота после обмена',
        'Положить бумажку с паролем в инвентарь',
        'Спросить у стола, можно ли запускать диалог D26',
        'Повторить без флага и без бумажки',
      ],
      en: [
        'Set the flag the cat quest writes after the trade',
        'Put the password note in the inventory',
        'Ask the table whether dialogue D26 may start',
        'Repeat without the flag and without the note',
      ],
    },
    expected: {
      ru: 'С флагом и бумажкой D26 открыт. Без любого из двух условий закрыт.',
      en: 'With the flag and the note, D26 is unlocked. Without either one, it stays locked.',
    },
    before: {
      ru: 'Падал PaperDialogUnlocksAfterCatExchange. Кот писал флаг cat_exchange_done, а стол ждал cat_catnip_given, который нигде не ставился. Подсказка к паролю не звучала никогда.',
      en: 'PaperDialogUnlocksAfterCatExchange failed. The cat wrote cat_exchange_done while the table waited for cat_catnip_given, which nothing ever set. The password hint never played.',
    },
    fix: {
      ru: 'Общая константа в ProgressFlags для обоих скриптов, старый ключ удалён. Значение флага прежнее, старые сохранения работают.',
      en: 'One shared constant in ProgressFlags for both scripts, the old key removed. The flag value is unchanged, so old saves still work.',
    },
    code: [
      { file: 'CatTradeTableDialogTests.cs', lang: 'csharp', role: 'test', source: thlCatTrade },
      { file: 'ProgressFlags.cs, CatQuestProgress.cs, CircleTableMiniGameWorld.cs', lang: 'csharp', role: 'fix', source: thlCatTradeFix },
    ],
  },
  {
    id: 'TC-THL-02',
    project: 'thl',
    kind: 'auto',
    priority: 'high',
    bug: 'BUG-02',
    title: {
      ru: 'Каждый предмет сцены есть в базе и переживает загрузку',
      en: 'Every scene item is in the database and survives loading',
    },
    level: { ru: 'Целостность данных, EditMode', en: 'Data integrity, EditMode' },
    preconditions: {
      ru: ['Открыта GameScene', 'Сохранение хранит предметы инвентаря по Id'],
      en: ['GameScene is open', 'The save stores inventory items by Id'],
    },
    steps: {
      ru: [
        'Собрать все ссылки на предметы во всех компонентах сцены, включая реплики диалогов',
        'Сравнить их со списком _allItems в базе предметов',
        'Отдельно загрузить инвентарь из списка Id с известным и неизвестным Id',
      ],
      en: [
        'Collect every item reference in every scene component, dialogue lines included',
        'Compare them with the _allItems list in the item database',
        'Separately load the inventory from a list with a known and an unknown Id',
      ],
    },
    expected: {
      ru: 'Предметов вне базы нет. Известный предмет восстанавливается, неизвестный Id пропускается без ошибки.',
      en: 'No item is missing from the database. The known item is restored, the unknown Id is skipped without an error.',
    },
    before: {
      ru: 'Падал ItemDatabaseCoversItemsUsedInGameScene: вместо бумажки с паролем в базе дважды записан зонт. После сохранения и Continue бумажка пропадала, в логе «Skip unknown item id». Это регрессия: баг уже закрывали раньше.',
      en: 'ItemDatabaseCoversItemsUsedInGameScene failed: the umbrella was listed twice instead of the password note. After saving and Continue the note vanished, with “Skip unknown item id” in the log. A regression: this bug had been closed before.',
    },
    fix: {
      ru: 'Второй зонт в _allItems заменён бумажкой. В сцене изменилась одна строка, тест теперь сторожит такие возвраты.',
      en: 'The second umbrella in _allItems was replaced with the note. One line of the scene changed, and the test now guards against this coming back.',
    },
    code: [{ file: 'ProjectIntegrityTests.cs, PlayerInventoryTests.cs', lang: 'csharp', role: 'test', source: thlItemDatabase }],
  },
  {
    id: 'TC-THL-03',
    project: 'thl',
    kind: 'manual',
    priority: 'high',
    bug: 'BUG-04',
    title: {
      ru: 'Во время диалога мир не реагирует на клики',
      en: 'The world ignores clicks during a dialogue',
    },
    level: { ru: 'Системный, ручной', en: 'System, manual' },
    preconditions: {
      ru: ['Сборка игры или Play Mode', 'Героиня рядом с персонажем или объектом с диалогом'],
      en: ['A game build or Play Mode', 'The heroine is next to a character or object with a dialogue'],
    },
    steps: {
      ru: ['Начать любой диалог', 'Нажать I, затем ещё раз I', 'Кликнуть по полу', 'Кликнуть по двери'],
      en: ['Start any dialogue', 'Press I, then I again', 'Click the floor', 'Click a door'],
    },
    expected: {
      ru: 'Инвентарь не открывается, героиня стоит на месте, клик только листает диалог.',
      en: 'The inventory does not open, the heroine stays put, a click only advances the dialogue.',
    },
    before: {
      ru: 'Закрытие инвентаря снимало блокировку управления. Героиня ходила при открытом диалоге, новый диалог затирал колбэк текущего. У двери с диалогом это вело к soft lock до перезапуска сцены.',
      en: 'Closing the inventory lifted the input lock. The heroine walked with a dialogue open, and a new dialogue overwrote the current callback. At a door with a dialogue this caused a soft lock until the scene was restarted.',
    },
    fix: {
      ru: 'Свойство IsDialogActive в DialogController. Пока идёт диалог, клавиша I инвентарь не открывает, а уже открытый можно только закрыть.',
      en: 'An IsDialogActive property on DialogController. While a dialogue runs, I does not open the inventory, and an already open one can only be closed.',
    },
    code: [{ file: 'DialogController.cs, InputController.cs', lang: 'csharp', role: 'fix', source: thlInventoryDialogFix }],
  },
  {
    id: 'TC-THL-04',
    project: 'thl',
    kind: 'manual',
    priority: 'medium',
    bug: 'BUG-05',
    title: {
      ru: 'Выход во время вступительного ролика не портит слот',
      en: 'Quitting during the intro cutscene does not corrupt the slot',
    },
    level: { ru: 'Системный, ручной', en: 'System, manual' },
    preconditions: {
      ru: ['Пустой слот сохранения'],
      en: ['An empty save slot'],
    },
    steps: {
      ru: ['В главном меню начать новую игру в пустом слоте', 'Во время ролика закрыть окно (Alt+F4)', 'Запустить игру снова'],
      en: ['Start a new game in an empty slot from the main menu', 'Close the window during the cutscene (Alt+F4)', 'Launch the game again'],
    },
    expected: {
      ru: 'Слот остаётся пустым, Continue ничего не загружает, новая игра начинается со стартовой точки.',
      en: 'The slot stays empty, Continue loads nothing, a new game starts from the spawn point.',
    },
    before: {
      ru: 'В слоте появлялся файл сохранения. Игрок ставился в (0, 0, 0) вместо (37.85, -28.81), камера локации не сохранялась.',
      en: 'A save file appeared in the slot. The player spawned at (0, 0, 0) instead of (37.85, -28.81), and the location camera was not saved.',
    },
    fix: {
      ru: 'При выходе сохранение пропускается, если слот ещё ни разу не сохранялся и игрока в сцене нет. Обычные сохранения и автосохранения не затронуты.',
      en: 'On quit the save is skipped if the slot has never been saved and there is no player in the scene. Normal saves and autosaves are unaffected.',
    },
    code: [{ file: 'SaveManager.cs', lang: 'csharp', role: 'fix', source: thlQuitFix }],
  },
  {
    id: 'TC-THL-05',
    project: 'thl',
    kind: 'manual',
    priority: 'medium',
    bug: 'BUG-03',
    title: {
      ru: 'Частые клики по полу не копят звуки шагов',
      en: 'Rapid floor clicks do not pile up footstep sounds',
    },
    level: { ru: 'Системный, ручной, FMOD Profiler', en: 'System, manual, FMOD Profiler' },
    preconditions: {
      ru: ['Play Mode', 'Открыт FMOD Profiler'],
      en: ['Play Mode', 'FMOD Profiler is open'],
    },
    steps: {
      ru: ['Кликнуть по полу далеко от героини', 'Пока она идёт, 10 раз кликнуть в разные точки', 'Смотреть счётчик Instances события шагов'],
      en: ['Click the floor far from the heroine', 'While she walks, click 10 different points', 'Watch the Instances counter of the footsteps event'],
    },
    expected: {
      ru: 'Одновременно живёт один экземпляр шагов, звук не наслаивается.',
      en: 'Only one footsteps instance is alive at a time, sounds do not overlap.',
    },
    before: {
      ru: 'Каждый клик создавал новый EventInstance, старый не останавливался и не освобождался. Экземпляры копились в FMOD.',
      en: 'Every click created a new EventInstance while the old one was never stopped or released. Instances piled up in FMOD.',
    },
    fix: {
      ru: 'Перед созданием нового экземпляра вызывается уже существующий StopFootsteps(): он плавно гасит звук и освобождает экземпляр.',
      en: 'The existing StopFootsteps() is called before a new instance is created: it fades the sound out and releases the instance.',
    },
    code: [{ file: 'PlayerMoveController.cs', lang: 'csharp', role: 'fix', source: thlFootstepsFix }],
  },
  {
    id: 'TC-THL-06',
    project: 'thl',
    kind: 'auto',
    priority: 'medium',
    bug: 'BUG-06',
    title: {
      ru: 'В сценах сборки нет потерянных скриптов',
      en: 'Build scenes contain no missing scripts',
    },
    level: { ru: 'Целостность сцен, EditMode', en: 'Scene integrity, EditMode' },
    preconditions: {
      ru: ['Сцены перечислены в Build Settings'],
      en: ['Scenes are listed in Build Settings'],
    },
    steps: {
      ru: ['Открыть по очереди каждую сцену из Build Settings', 'Обойти все объекты и их дочерние объекты', 'Посчитать компоненты со ссылкой на несуществующий скрипт'],
      en: ['Open each scene from Build Settings in turn', 'Walk every object and its children', 'Count components that reference a missing script'],
    },
    expected: {
      ru: 'Ни одного объекта с потерянным скриптом.',
      en: 'Not a single object with a missing script.',
    },
    before: {
      ru: 'Падал: на объекте Default Sound в GameScene висел компонент с GUID скрипта, которого нет ни в проекте, ни в истории git.',
      en: 'Failed: the Default Sound object in GameScene had a component pointing to a script GUID that exists neither in the project nor in git history.',
    },
    fix: {
      ru: 'Удалён только пустой компонент, Transform и AudioSource остались.',
      en: 'Only the empty component was removed; Transform and AudioSource stayed.',
    },
    code: [{ file: 'ProjectIntegrityTests.cs', lang: 'csharp', role: 'test', source: thlMissingScripts }],
  },
  {
    id: 'TC-THL-07',
    project: 'thl',
    kind: 'auto',
    priority: 'medium',
    bug: 'BUG-07',
    title: {
      ru: 'Все исходники в UTF-8',
      en: 'All source files are UTF-8',
    },
    level: { ru: 'Статическая проверка, EditMode', en: 'Static check, EditMode' },
    preconditions: {
      ru: ['Скрипты лежат в Assets/Scripts, Assets/Editor и Assets/Tests'],
      en: ['Scripts live in Assets/Scripts, Assets/Editor and Assets/Tests'],
    },
    steps: {
      ru: ['Прочитать байты каждого .cs файла', 'Раскодировать строгим декодером UTF-8, который падает на неверном байте'],
      en: ['Read the bytes of every .cs file', 'Decode them with a strict UTF-8 decoder that throws on a bad byte'],
    },
    expected: {
      ru: 'Ни одного файла, который не раскодировался.',
      en: 'No file fails to decode.',
    },
    before: {
      ru: 'Падал: 67 из 127 скриптов были в Windows-1251. На GitHub и в редакторах русские строки превращались в «�», строки в коде могли собраться неправильно.',
      en: 'Failed: 67 of 127 scripts were in Windows-1251. On GitHub and in editors Russian text turned into “�”, and string literals could compile wrong.',
    },
    fix: {
      ru: 'Все 67 файлов переведены в UTF-8. Обратная конвертация дала те же байты, текст сверен с HEAD построчно.',
      en: 'All 67 files were converted to UTF-8. Converting back gave identical bytes, and the text was compared with HEAD line by line.',
    },
    code: [{ file: 'ProjectIntegrityTests.cs', lang: 'csharp', role: 'test', source: thlUtf8 }],
  },
  {
    id: 'TC-THL-08',
    project: 'thl',
    kind: 'auto',
    priority: 'high',
    title: {
      ru: 'Сохранение проходит через JSON без потерь',
      en: 'A save survives a JSON round trip intact',
    },
    level: { ru: 'Модульный, EditMode', en: 'Unit, EditMode' },
    preconditions: {
      ru: ['SaveManager создан на пустом объекте'],
      en: ['SaveManager is created on an empty object'],
    },
    steps: {
      ru: [
        'Проверить значение по умолчанию для отсутствующего флага',
        'Дважды отметить один и тот же объект собранным',
        'Заполнить SaveData: сцена, локация, время, позиция, инвентарь, флаги',
        'Сериализовать в JSON и разобрать обратно',
      ],
      en: [
        'Check the default value of a missing flag',
        'Mark the same object as collected twice',
        'Fill SaveData: scene, location, time, position, inventory, flags',
        'Serialise to JSON and parse it back',
      ],
    },
    expected: {
      ru: 'Отсутствующий флаг отдаёт значение по умолчанию, собранный объект записан один раз, все поля копии равны исходным.',
      en: 'A missing flag returns its default, a collected object is stored once, every field of the copy equals the original.',
    },
    code: [{ file: 'SaveManagerTests.cs', lang: 'csharp', role: 'test', source: thlSave }],
  },
  {
    id: 'TC-THL-09',
    project: 'thl',
    kind: 'auto',
    priority: 'medium',
    title: {
      ru: 'Реплика диалога ждёт нужный предмет и забирает его',
      en: 'A dialogue line waits for the required item and takes it',
    },
    level: { ru: 'Модульный, EditMode', en: 'Unit, EditMode' },
    preconditions: {
      ru: ['Диалог из двух реплик', 'Вторая реплика требует кошачью мяту'],
      en: ['A dialogue of two lines', 'The second line requires catnip'],
    },
    steps: {
      ru: [
        'Спросить, доступна ли следующая реплика, с пустым инвентарём',
        'Положить мяту и спросить снова',
        'Пометить реплику как забирающую предмет и проверить инвентарь',
        'Пять раз шагнуть вперёд в диалоге из двух реплик',
      ],
      en: [
        'Ask whether the next line is available with an empty inventory',
        'Add catnip and ask again',
        'Mark the line as consuming the item and check the inventory',
        'Step forward five times in a two-line dialogue',
      ],
    },
    expected: {
      ru: 'Без мяты реплика закрыта, с мятой открыта. Забирающая реплика убирает мяту из инвентаря. Счётчик реплик останавливается на конце.',
      en: 'Without catnip the line is locked, with it unlocked. A consuming line removes the catnip. The line counter stops at the end.',
    },
    code: [{ file: 'DialogConteynerTests.cs', lang: 'csharp', role: 'test', source: thlDialog }],
  },
  {
    id: 'TC-THL-10',
    project: 'thl',
    kind: 'auto',
    priority: 'medium',
    title: {
      ru: 'Инвентарь добавляет и убирает предметы по одному',
      en: 'The inventory adds and removes items one at a time',
    },
    level: { ru: 'Модульный, EditMode', en: 'Unit, EditMode' },
    preconditions: {
      ru: ['PlayerInventory создан на пустом объекте'],
      en: ['PlayerInventory is created on an empty object'],
    },
    steps: {
      ru: ['Добавить null', 'Добавить ключ и его копию, убрать трижды', 'Добавить три мяты, убрать две по имени', 'Добавить два предмета и получить список Id'],
      en: ['Add null', 'Add a key and its copy, remove three times', 'Add three catnips, remove two by name', 'Add two items and get the Id list'],
    },
    expected: {
      ru: 'null отклоняется. Убирается одна копия за раз, третье удаление возвращает false. Остаётся одна мята. Порядок Id совпадает с порядком добавления.',
      en: 'null is rejected. One copy is removed at a time, the third removal returns false. One catnip remains. Id order matches insertion order.',
    },
    code: [{ file: 'PlayerInventoryTests.cs', lang: 'csharp', role: 'test', source: thlInventory }],
  },

  {
    id: 'TC-BGH-01',
    project: 'bgh',
    kind: 'auto',
    priority: 'high',
    bug: 'BUG-01',
    title: {
      ru: 'Другая подборка того же покупателя становится новой заявкой',
      en: 'Another selection from the same customer becomes a new request',
    },
    level: { ru: 'Интеграционный, заглушки WordPress', en: 'Integration, WordPress stubs' },
    preconditions: {
      ru: ['Склейка повторов: одинаковая заявка в течение 30 минут не заводит новую карточку', 'Один и тот же телефон'],
      en: ['Duplicate merging: an identical request within 30 minutes does not create a new card', 'The same phone number'],
    },
    steps: {
      ru: ['Отправить подборку из товаров 11 и 12', 'Отправить ту же подборку ещё раз', 'Отправить подборку из товаров 40 и 41', 'Сравнить отпечатки двух подборок'],
      en: ['Submit a selection of items 11 and 12', 'Submit the same selection again', 'Submit a selection of items 40 and 41', 'Compare the fingerprints of the two selections'],
    },
    expected: {
      ru: 'Повтор той же подборки склеивается: одна карточка, счётчик повторов 1. Другая подборка даёт вторую карточку и второе письмо в салон. Предупреждений PHP нет.',
      en: 'Repeating the same selection is merged: one card, repeat counter 1. A different selection makes a second card and a second email to the showroom. No PHP warnings.',
    },
    before: {
      ru: '4 провала. Посетитель видел «Заявка отправлена», но новой карточки и письма не было. implode() склеивал массивы позиций в «Array,Array», и отпечаток не зависел от состава подборки.',
      en: '4 failures. The visitor saw “Request sent” but no new card or email appeared. implode() joined the item arrays into “Array,Array”, so the fingerprint ignored what was selected.',
    },
    fix: {
      ru: 'В отпечаток идут номера товаров через array_column().',
      en: 'The fingerprint now uses item ids via array_column().',
    },
    code: [
      { file: 'tools/request-test.php', lang: 'php', role: 'test', source: bghRepeat },
      { file: 'includes/request-submit.php', lang: 'php', role: 'fix', source: bghRepeatFix },
    ],
  },
  {
    id: 'TC-BGH-02',
    project: 'bgh',
    kind: 'auto',
    priority: 'medium',
    bug: 'BUG-02',
    title: {
      ru: 'Позиция «Под заказ» не получает цену без наличия у партнёра',
      en: 'A made-to-order item gets no price unless the partner has stock',
    },
    level: { ru: 'Модульный, таблица переходов состояний', en: 'Unit, state transition table' },
    preconditions: {
      ru: ['По документации у позиции «Под заказ» цены нет', 'Цена партнёра 120 000'],
      en: ['Per the docs a made-to-order item has no price', 'Partner price 120,000'],
    },
    steps: {
      ru: ['Прогнать запись цены для каждого сочетания: состояние на сайте (Москва, под заказ, Краснодар) × наличие у партнёра (есть, нет, не размечено)', 'Сверить состояние и цену после записи'],
      en: ['Run the price write for every combination: site state (Moscow, to order, Krasnodar) × partner stock (in, out, unknown)', 'Check the state and price afterwards'],
    },
    expected: {
      ru: 'Под заказ + нет или не размечено: цены нет. Под заказ + есть: «На складе в Москве» с ценой. Москва + кончилось: под заказ без цены. Краснодар не трогается.',
      en: 'To order + out or unknown: no price. To order + in: “In stock in Moscow” with a price. Moscow + out: to order with no price. Krasnodar is left alone.',
    },
    before: {
      ru: '2 провала. Витрина показывала «Под заказ» с суммой. Сохранение карточки стирало цену, через 12 часов синхронизация ставила её снова.',
      en: '2 failures. The storefront showed “To order” with a price. Saving the card wiped it, and 12 hours later the sync put it back.',
    },
    fix: {
      ru: 'Ранний выход из bgh_price_write(), если позиция под заказ, а у партнёра её нет в наличии.',
      en: 'An early return in bgh_price_write() when the item is to order and the partner has no stock.',
    },
    code: [
      { file: 'tools/price-sync-test.php', lang: 'php', role: 'test', source: bghPriceSync },
      { file: 'includes/price-sync.php', lang: 'php', role: 'fix', source: bghPriceSyncFix },
    ],
  },
  {
    id: 'TC-BGH-03',
    project: 'bgh',
    kind: 'auto',
    priority: 'high',
    bug: 'BUG-03',
    title: {
      ru: 'Групповая правка без nonce ничего не меняет (CSRF)',
      en: 'Bulk edit without a nonce changes nothing (CSRF)',
    },
    level: { ru: 'Безопасность, интеграционный', en: 'Security, integration' },
    preconditions: {
      ru: ['Сотрудник вошёл в админку', 'Обработчик групповой правки висит на хуке load-edit.php'],
      en: ['A staff member is logged into the admin', 'The bulk edit handler is hooked to load-edit.php'],
    },
    steps: {
      ru: [
        'Открыть список товаров с параметрами групповой правки, но без nonce',
        'Повторить с nonce, который передаёт настоящая форма',
        'Повторить для товара, на правку которого у пользователя нет прав',
      ],
      en: [
        'Open the product list with bulk edit parameters but no nonce',
        'Repeat with the nonce the real form sends',
        'Repeat for a product the user has no permission to edit',
      ],
    },
    expected: {
      ru: 'Без nonce запрос обрывается, наличие и цены не меняются. Настоящая форма работает. Товар без прав не меняется.',
      en: 'Without a nonce the request stops and stock and prices stay. The real form works. A product without permission is untouched.',
    },
    before: {
      ru: '2 провала. Ссылка, открытая вошедшим сотрудником, переводила товары в «Под заказ» и стирала цены. Хук срабатывает раньше, чем ядро WordPress проверяет nonce, а проверка прав от CSRF не защищает.',
      en: '2 failures. A link opened by a logged-in staff member switched products to “To order” and wiped their prices. The hook fires before WordPress core checks the nonce, and a permission check does not stop CSRF.',
    },
    fix: {
      ru: 'В начале обработчика та же проверка check_admin_referer(\'bulk-posts\'), что делает ядро.',
      en: 'The handler starts with the same check_admin_referer(\'bulk-posts\') call that core makes.',
    },
    code: [
      { file: 'tools/bulk-edit-test.php', lang: 'php', role: 'test', source: bghBulkEdit },
      { file: 'includes/admin/product-ui.php', lang: 'php', role: 'fix', source: bghBulkEditFix },
    ],
  },
  {
    id: 'TC-BGH-04',
    project: 'bgh',
    kind: 'auto',
    priority: 'high',
    title: {
      ru: 'Слои защиты формы заявки от спама',
      en: 'Spam protection layers of the request form',
    },
    level: { ru: 'Интеграционный, автоматизация чек-листа', en: 'Integration, automated checklist' },
    preconditions: {
      ru: ['Обработчик формы подключён на заглушках, база и почта в памяти'],
      en: ['The form handler runs on stubs, with database and mail in memory'],
    },
    steps: {
      ru: [
        'Заполнить скрытое поле-ловушку',
        'Отправить с чужим nonce',
        'Отправить сразу после загрузки страницы',
        'Вставить ссылку в комментарий',
        'Снять галку согласия',
        'Отправить четыре заявки с одного адреса за час',
      ],
      en: [
        'Fill in the hidden honeypot field',
        'Submit with a foreign nonce',
        'Submit right after the page loads',
        'Put a link in the comment',
        'Untick the consent box',
        'Send four requests from one address within an hour',
      ],
    },
    expected: {
      ru: 'Ловушка отвечает как при успехе, но ничего не пишет и попадает в журнал. Остальные отказы без записи, с подсветкой нужного поля. Четвёртая заявка получает вежливый отказ с телефоном салона.',
      en: 'The honeypot replies as if successful but stores nothing and is logged. Other rejections store nothing and highlight the right field. The fourth request gets a polite refusal with the showroom phone.',
    },
    code: [{ file: 'tools/request-test.php', lang: 'php', role: 'test', source: bghFormLayers }],
  },
  {
    id: 'TC-BGH-05',
    project: 'bgh',
    kind: 'auto',
    priority: 'medium',
    title: {
      ru: 'Проверка телефона, имени, комментария и метки времени',
      en: 'Phone, name, comment and timestamp validation',
    },
    level: { ru: 'Модульный, классы эквивалентности и граничные значения', en: 'Unit, equivalence classes and boundary values' },
    preconditions: {
      ru: ['Форма принимает только российские номера'],
      en: ['The form accepts Russian numbers only'],
    },
    steps: {
      ru: [
        'Номер с 8 в начале, десять цифр без кода, номер Казахстана, другой страны, несуществующий код, одна цифра десять раз',
        'Имя из одной буквы, ссылка в имени, домен без http в комментарии, размеры комнаты с точками',
        'Метка минутной давности, моложе трёх секунд, старше суток, с поддельной подписью',
      ],
      en: [
        'A number starting with 8, ten digits with no code, a Kazakh number, another country, a non-existent code, one digit ten times',
        'A one-letter name, a link in the name, a bare domain in the comment, room sizes with dots',
        'A one-minute-old stamp, one under three seconds, one over a day, one with a forged signature',
      ],
    },
    expected: {
      ru: 'Российский номер приводится к +7, остальные отклоняются. Ссылки отклоняются, размеры с точками проходят. Проходит только свежая метка с верной подписью HMAC.',
      en: 'A Russian number is normalised to +7, the rest are rejected. Links are rejected, sizes with dots pass. Only a fresh stamp with a valid HMAC signature passes.',
    },
    code: [{ file: 'tools/request-test.php', lang: 'php', role: 'test', source: bghValidation }],
  },

  {
    id: 'TC-WEB-01',
    project: 'web',
    kind: 'auto',
    priority: 'medium',
    bug: 'WEB-07',
    title: {
      ru: 'В карте сайта все страницы и только те, что открыты для поиска',
      en: 'The sitemap lists every page and only indexable ones',
    },
    level: { ru: 'SEO, проверка сборки', en: 'SEO, build check' },
    preconditions: {
      ru: ['Сайт собран в dist', 'Корень / только выбирает язык и закрыт от поиска (noindex)'],
      en: ['The site is built into dist', 'The root / only picks a language and is closed to search (noindex)'],
    },
    steps: {
      ru: [
        'Собрать список всех .html страниц в dist/ru и dist/en',
        'Сравнить его с адресами в sitemap-0.xml',
        'Проверить, что «В процессе создания» и корень в карту не попали',
      ],
      en: [
        'List every .html page in dist/ru and dist/en',
        'Compare the list with the addresses in sitemap-0.xml',
        'Check that “Work in progress” and the root are not in the sitemap',
      ],
    },
    expected: {
      ru: 'Каждая открытая страница есть в карте. Страниц с noindex в карте нет.',
      en: 'Every open page is in the sitemap. No noindex page is in it.',
    },
    before: {
      ru: 'Корень / с noindex стоял в карте сайта. Поисковик получает противоречие: страницу просят проиндексировать и тут же запрещают, Search Console помечает это как ошибку. В первом прогоне это дало три провала сразу: язык, заголовок и canonical корня не совпадали с правилами обычных страниц.',
      en: 'The noindex root / was listed in the sitemap. A search engine gets a contradiction: the page is submitted for indexing and forbidden at once, and Search Console flags it as an error. In the first run this caused three failures: the root’s language, title and canonical broke the rules for normal pages.',
    },
    fix: {
      ru: 'Фильтр карты сайта в astro.config.mjs пропускает корень так же, как «В процессе создания».',
      en: 'The sitemap filter in astro.config.mjs skips the root the same way it skips “Work in progress”.',
    },
    code: [
      { file: 'tools/site-test.mjs', lang: 'javascript', role: 'test', source: webSitemap },
      { file: 'astro.config.mjs', lang: 'javascript', role: 'fix', source: webSitemapFix },
    ],
  },
  {
    id: 'TC-WEB-02',
    project: 'web',
    kind: 'auto',
    priority: 'medium',
    bug: 'WEB-08, WEB-09',
    title: {
      ru: 'Разметка каждой страницы: язык, заголовки, описание, canonical, hreflang',
      en: 'Markup of every page: language, headings, description, canonical, hreflang',
    },
    level: { ru: 'Доступность и SEO, все 66 страниц', en: 'Accessibility and SEO, all 66 pages' },
    preconditions: {
      ru: ['Сайт собран, страницы берутся из карты сайта и «В процессе создания»'],
      en: ['The site is built; pages come from the sitemap plus “Work in progress”'],
    },
    steps: {
      ru: [
        'Открыть каждую страницу',
        'Сверить lang документа с языком в адресе',
        'Посчитать h1 и проверить, что уровни заголовков идут без пропусков',
        'Измерить длину meta description',
        'Сверить canonical с адресом страницы и hreflang с существующими страницами',
      ],
      en: [
        'Open every page',
        'Compare the document lang with the language in the URL',
        'Count h1 elements and check heading levels never skip',
        'Measure the meta description length',
        'Compare canonical with the page URL and hreflang with existing pages',
      ],
    },
    expected: {
      ru: 'Ровно один h1, после h1 идёт h2, а не h3. Описание от 50 до 200 знаков. canonical ведёт на саму страницу, hreflang ru, en и x-default на существующие страницы.',
      en: 'Exactly one h1, and an h2 follows it, not an h3. A description of 50 to 200 characters. canonical points to the page itself, hreflang ru, en and x-default to existing pages.',
    },
    before: {
      ru: 'На 12 страницах разделов (6 разделов на двух языках) после h1 сразу шли h3 карточек: программа чтения с экрана показывает в оглавлении дыру. Описание «Обо мне» было 201 и 216 знаков, «В процессе создания» 324 и 360: поиск и превью ссылки в мессенджере обрезали его на полуслове.',
      en: 'On 12 section pages (6 sections in two languages) the card h3 came right after h1, leaving a gap in a screen reader’s outline. The “About” description was 201 and 216 characters and “Work in progress” 324 and 360, so search results and messenger previews cut it mid-word.',
    },
    fix: {
      ru: 'Уровень заголовка карточки задаётся снаружи: на странице раздела h2, на главной под h2 по-прежнему h3. Для «Обо мне» и «В процессе создания» написаны отдельные короткие описания вместо первого абзаца.',
      en: 'The card heading level is now set by the page: h2 on a section page, still h3 on the home page under an h2. “About” and “Work in progress” got their own short descriptions instead of the first paragraph.',
    },
    code: [
      { file: 'tools/site-test.mjs', lang: 'javascript', role: 'test', source: webMarkup },
      { file: 'ProjectCard.astro, work/[section]/index.astro', lang: 'astro', role: 'fix', source: webHeadingsFix },
      { file: 'i18n/ui.ts, about.astro', lang: 'astro', role: 'fix', source: webDescriptionFix },
    ],
  },
  {
    id: 'TC-WEB-03',
    project: 'web',
    kind: 'auto',
    priority: 'medium',
    bug: 'WEB-10',
    title: {
      ru: 'Кнопки и ссылки не меньше 24×24 на телефоне',
      en: 'Buttons and links are at least 24×24 on a phone',
    },
    level: { ru: 'Доступность, WCAG 2.2 критерий 2.5.8', en: 'Accessibility, WCAG 2.2 criterion 2.5.8' },
    preconditions: {
      ru: ['Экран 390×844, сенсорный ввод'],
      en: ['A 390×844 screen with touch input'],
    },
    steps: {
      ru: ['Открыть главную, «Обо мне», «Контакты», «Тестирование», раздел и страницу проекта', 'Измерить каждую ссылку, кнопку, summary и поле', 'Ссылки внутри абзаца текста пропустить: это исключение из критерия'],
      en: ['Open the home, About, Contact, Testing, a section and a project page', 'Measure every link, button, summary and field', 'Skip links inside running text: they are an exception to the criterion'],
    },
    expected: {
      ru: 'Ни одной цели меньше 24 пикселей по ширине или высоте.',
      en: 'No target is smaller than 24 pixels wide or tall.',
    },
    before: {
      ru: 'Ссылка «Наверх» в подвале 69×23.8 на каждой странице. Ссылка на раздел над заголовком проекта 61×19.8. Номер тест-кейса в этом разделе 74×21.',
      en: 'The footer “Back to top” link was 69×23.8 on every page. The section link above a project title was 61×19.8. The test case number in this section was 74×21.',
    },
    fix: {
      ru: 'Ссылкам задана минимальная высота: 44 пикселя у «Наверх» и ссылки на раздел, 32 у номера кейса. Внешне они не изменились, выросла только область нажатия.',
      en: 'The links got a minimum height: 44 pixels for “Back to top” and the section link, 32 for the case number. They look the same; only the tap area grew.',
    },
    code: [
      { file: 'tools/site-test.mjs', lang: 'javascript', role: 'test', source: webTargets },
      { file: 'Footer.astro, [slug].astro, TestCaseCard.astro', lang: 'css', role: 'fix', source: webTargetsFix },
    ],
  },
  {
    id: 'TC-WEB-04',
    project: 'web',
    kind: 'auto',
    priority: 'high',
    title: {
      ru: 'На 320, 360 и 390 пикселях страницы не ездят вбок',
      en: 'Pages do not scroll sideways at 320, 360 and 390 pixels',
    },
    level: { ru: 'Адаптивность, WCAG 1.4.10', en: 'Responsive layout, WCAG 1.4.10' },
    preconditions: {
      ru: ['Мобильный режим браузера с сенсорным вводом'],
      en: ['Mobile browser mode with touch input'],
    },
    steps: {
      ru: ['Для каждой ширины открыть все страницы сайта', 'Сравнить ширину документа с шириной экрана', 'Если документ шире, найти элемент, который вылезает за край'],
      en: ['For each width, open every page of the site', 'Compare the document width with the screen width', 'If the document is wider, find the element that sticks out'],
    },
    expected: {
      ru: 'Горизонтальной прокрутки нет ни на одной странице ни на одной ширине.',
      en: 'No page scrolls sideways at any width.',
    },
    code: [{ file: 'tools/site-test.mjs', lang: 'javascript', role: 'test', source: webReflow }],
  },
  {
    id: 'TC-WEB-11',
    project: 'web',
    kind: 'auto',
    priority: 'high',
    bug: 'WEB-13',
    title: {
      ru: 'Имя в шапке не налезает на кнопки на телефоне',
      en: 'The name in the header does not run over the buttons on a phone',
    },
    level: { ru: 'Адаптивность, визуальный', en: 'Responsive layout, visual' },
    preconditions: {
      ru: ['Мобильный режим, ширина 320, 360 и 390 пикселей'],
      en: ['Mobile mode at 320, 360 and 390 pixels'],
    },
    steps: {
      ru: [
        'Открыть главную',
        'Для каждого элемента шапки сравнить ширину текста с шириной его блока',
        'Сравнить правый край бренда с левым краем кнопок языка, темы и меню',
      ],
      en: [
        'Open the home page',
        'For each header element compare the text width with the width of its box',
        'Compare the right edge of the brand with the left edge of the language, theme and menu buttons',
      ],
    },
    expected: {
      ru: 'Текст помещается в свои блоки, бренд заканчивается до кнопок.',
      en: 'Text fits its boxes and the brand ends before the buttons.',
    },
    before: {
      ru: 'Имя «Владислав Баклан» стояло в одну строку и на 320 пикселях вылезало из блока на 75 пикселей, прямо поверх переключателя языка. На 360 на 37, на 390 на 8. Страница шире экрана при этом не становилась, поэтому TC-WEB-04 этого не видел. Заметил на скриншоте, когда менял значок в шапке, и сначала написал тест.',
      en: 'The name “Vladislav Baklan” sat on one line and at 320 pixels overflowed its box by 75 pixels, right over the language switcher. By 37 at 360 and 8 at 390. The page did not get wider than the screen, so TC-WEB-04 missed it. I spotted it on a screenshot while replacing the header mark, and wrote the test first.',
    },
    fix: {
      ru: 'До 560 пикселей имя переносится на две строки. До 360 значок 32 пикселя, промежутки меньше, шрифт имени чуть мельче. Кнопки остаются 40 пикселей.',
      en: 'Below 560 pixels the name wraps onto two lines. Below 360 the mark is 32 pixels, gaps are tighter and the name font slightly smaller. Buttons stay 40 pixels.',
    },
    code: [
      { file: 'tools/site-test.mjs', lang: 'javascript', role: 'test', source: webHeaderOverlap },
      { file: 'Header.astro', lang: 'css', role: 'fix', source: webHeaderOverlapFix },
    ],
  },
  {
    id: 'TC-WEB-05',
    project: 'web',
    kind: 'auto',
    priority: 'medium',
    title: {
      ru: 'Сайтом можно пользоваться с клавиатуры',
      en: 'The site works from the keyboard',
    },
    level: { ru: 'Доступность, E2E', en: 'Accessibility, E2E' },
    preconditions: {
      ru: ['Ноутбук, без мыши'],
      en: ['A laptop, no mouse'],
    },
    steps: {
      ru: ['Открыть «Обо мне» и нажать Tab', 'Нажать Enter на ссылке пропуска, затем ещё раз Tab', 'На главной дважды нажать Tab и посмотреть на рамку фокуса'],
      en: ['Open About and press Tab', 'Press Enter on the skip link, then Tab again', 'On the home page press Tab twice and look at the focus ring'],
    },
    expected: {
      ru: 'Первый Tab попадает на видимую ссылку «Перейти к содержимому», после неё фокус сразу внутри main. У элемента в фокусе видна рамка.',
      en: 'The first Tab lands on a visible “Skip to content” link, and after it focus goes straight into main. The focused element shows a ring.',
    },
    code: [{ file: 'tools/site-test.mjs', lang: 'javascript', role: 'test', source: webKeyboard }],
  },
  {
    id: 'TC-WEB-06',
    project: 'web',
    kind: 'auto',
    priority: 'high',
    bug: 'WEB-11',
    title: {
      ru: 'Фильтры этого раздела прячут лишние карточки',
      en: 'The filters in this section hide the other cards',
    },
    level: { ru: 'Функциональный, E2E', en: 'Functional, E2E' },
    preconditions: {
      ru: ['Открыта страница «Тестирование»'],
      en: ['The Testing page is open'],
    },
    steps: {
      ru: [
        'Выбрать проект The Hidden Library и тип «Ручные»',
        'Сравнить число видимых карточек со счётчиком',
        'Выбрать BrandGallery Home, у которого ручных кейсов нет',
        'Сбросить оба фильтра',
        'Открыть страницу с выключенным JavaScript',
      ],
      en: [
        'Pick The Hidden Library and the Manual type',
        'Compare the number of visible cards with the counter',
        'Pick BrandGallery Home, which has no manual cases',
        'Reset both filters',
        'Open the page with JavaScript turned off',
      ],
    },
    expected: {
      ru: 'Видны только ручные кейсы игры, их столько же, сколько в счётчике. Для пустого сочетания счётчик 0 и подсказка. Сброс возвращает все карточки. Без JavaScript фильтров нет, а карточки видны все.',
      en: 'Only the game’s manual cases are visible, as many as the counter says. An empty combination shows 0 and a hint. Reset brings every card back. Without JavaScript there are no filters and every card is visible.',
    },
    before: {
      ru: 'Счётчик показывал 3, а на экране оставались все 10 карточек игры. Скрипт ставил карточкам атрибут hidden, но правило display: grid в стилях карточки сильнее этого атрибута.',
      en: 'The counter said 3 while all 10 game cards stayed on screen. The script set the hidden attribute, but the card’s display: grid rule overrides that attribute.',
    },
    fix: {
      ru: 'Отдельное правило .tc[hidden] { display: none }. Найдено до публикации раздела.',
      en: 'A dedicated .tc[hidden] { display: none } rule. Caught before the section went live.',
    },
    code: [
      { file: 'tools/site-test.mjs', lang: 'javascript', role: 'test', source: webFilters },
      { file: 'TestCaseCard.astro', lang: 'css', role: 'fix', source: webFiltersFix },
    ],
  },
  {
    id: 'TC-WEB-07',
    project: 'web',
    kind: 'auto',
    priority: 'low',
    bug: 'WEB-12',
    title: {
      ru: 'Ссылка на тест-кейс не прячет его под панелью фильтров',
      en: 'A link to a test case does not hide it under the filter bar',
    },
    level: { ru: 'Функциональный, E2E', en: 'Functional, E2E' },
    preconditions: {
      ru: ['Ноутбук 1366×900', 'Включено «уменьшение движения», чтобы прокрутка была мгновенной'],
      en: ['A 1366×900 laptop', '“Reduce motion” on, so scrolling is instant'],
    },
    steps: {
      ru: ['Открыть /ru/testing#tc-bgh-03', 'Найти нижний край всего липкого сверху: шапки и панели фильтров', 'Сравнить с верхом карточки'],
      en: ['Open /ru/testing#tc-bgh-03', 'Find the bottom edge of everything sticky at the top: header and filter bar', 'Compare it with the top of the card'],
    },
    expected: {
      ru: 'Верх карточки ниже панели фильтров и в верхней половине экрана.',
      en: 'The top of the card sits below the filter bar, in the upper half of the screen.',
    },
    before: {
      ru: 'Карточка останавливалась на 90 пикселях, а панель фильтров заканчивается на 129: номер и название кейса уходили под панель.',
      en: 'The card stopped at 90 pixels while the filter bar ends at 129, so the case number and title slid under the bar.',
    },
    fix: {
      ru: 'scroll-margin-top 162 пикселя под шапку и панель. На телефоне панель не липкая, там хватает 102.',
      en: 'A 162-pixel scroll-margin-top for the header and bar. On a phone the bar is not sticky, so 102 is enough.',
    },
    code: [
      { file: 'tools/site-test.mjs', lang: 'javascript', role: 'test', source: webAnchor },
      { file: 'TestCaseCard.astro', lang: 'css', role: 'fix', source: webFiltersFix },
    ],
  },
  {
    id: 'TC-WEB-08',
    project: 'web',
    kind: 'auto',
    priority: 'medium',
    title: {
      ru: 'Данные проектов и словари целы до сборки',
      en: 'Project data and dictionaries are intact before the build',
    },
    level: { ru: 'Целостность данных', en: 'Data integrity' },
    preconditions: {
      ru: ['Node 22: TypeScript-файлы данных читаются напрямую'],
      en: ['Node 22: TypeScript data files are read directly'],
    },
    steps: {
      ru: [
        'Проверить, что адреса проектов не повторяются и каждый проект лежит в существующем разделе',
        'Проверить, что все 86 картинок, моделей и копий работ есть в public',
        'Сравнить ключи русского и английского словарей',
      ],
      en: [
        'Check project addresses are unique and every project sits in an existing section',
        'Check all 86 images, models and work copies exist in public',
        'Compare the keys of the Russian and English dictionaries',
      ],
    },
    expected: {
      ru: 'Повторов и потерянных разделов нет, все файлы на месте, у каждого русского ключа есть английский.',
      en: 'No duplicates or lost sections, every file in place, every Russian key has an English one.',
    },
    code: [{ file: 'tools/site-test.mjs', lang: 'javascript', role: 'test', source: webData }],
  },
  {
    id: 'TC-WEB-09',
    project: 'web',
    kind: 'auto',
    priority: 'high',
    title: {
      ru: 'Мобильное меню открывается, закрывается и возвращает прокрутку',
      en: 'The mobile menu opens, closes and gives scrolling back',
    },
    level: { ru: 'Функциональный, E2E, регресс', en: 'Functional, E2E, regression' },
    preconditions: {
      ru: ['Экран 390×844, сенсорный ввод'],
      en: ['A 390×844 screen with touch input'],
    },
    steps: {
      ru: ['Открыть главную', 'Нажать кнопку меню', 'Нажать Esc', 'Открыть меню снова и перейти по ссылке'],
      en: ['Open the home page', 'Tap the menu button', 'Press Esc', 'Open the menu again and follow a link'],
    },
    expected: {
      ru: 'Меню скрыто, по кнопке открывается, aria-expanded становится true, фон не прокручивается. Esc и переход по ссылке закрывают меню и возвращают прокрутку.',
      en: 'The menu starts hidden and opens on tap, aria-expanded becomes true and the background stops scrolling. Esc and following a link close it and give scrolling back.',
    },
    code: [{ file: 'tools/audit.mjs', lang: 'javascript', role: 'test', source: webMenu }],
  },
  {
    id: 'TC-WEB-10',
    project: 'web',
    kind: 'manual',
    priority: 'medium',
    bug: 'WEB-05, WEB-06',
    title: {
      ru: 'Синхронизация копий работ находит все источники и сообщает о пропуске',
      en: 'Work copy sync finds every source and reports a miss',
    },
    level: { ru: 'Инструменты сборки, ручной', en: 'Build tooling, manual' },
    preconditions: {
      ru: ['Исходники работ лежат рядом с сайтом в D:\\MyPortfolioProjects'],
      en: ['The work sources sit next to the site in D:\\MyPortfolioProjects'],
    },
    steps: {
      ru: ['Запустить node tools/sync-demos.mjs --check', 'Посмотреть, все ли 11 источников найдены', 'Проверить код выхода: echo $?'],
      en: ['Run node tools/sync-demos.mjs --check', 'See whether all 11 sources are found', 'Check the exit code: echo $?'],
    },
    expected: {
      ru: 'Все 11 источников найдены, код выхода 0. Если источник пропал, код выхода 1 и понятное сообщение.',
      en: 'All 11 sources are found and the exit code is 0. If a source goes missing, the exit code is 1 with a clear message.',
    },
    before: {
      ru: 'Макеты BrandGallery Home переехали в другую папку, а путь в списке работ остался старым. Скрипт писал предупреждение, но выходил с кодом 0, поэтому копию, которую заказчица открывает по ссылке, месяц никто не обновлял.',
      en: 'The BrandGallery Home mock-ups moved to another folder while the path in the work list stayed old. The script printed a warning but exited with 0, so the copy the client opens by link went un-updated for a month.',
    },
    fix: {
      ru: 'Новый путь к макетам и код выхода 1 при любом пропущенном источнике или файле.',
      en: 'The new path to the mock-ups and exit code 1 for any missing source or file.',
    },
    code: [{ file: 'tools/sync-demos.mjs', lang: 'javascript', role: 'fix', source: webSyncDemosFix }],
  },
];

export function casesFor(project: TestProjectId): TestCase[] {
  return TEST_CASES.filter((testCase) => testCase.project === project);
}
