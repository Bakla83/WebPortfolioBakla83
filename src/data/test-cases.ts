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

export type TestProjectId = 'thl' | 'bgh';
export type TestKind = 'auto' | 'manual';
export type TestPriority = 'high' | 'medium' | 'low';
export type CodeLang = 'csharp' | 'php';

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
    href: 'in-progress',
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
];

export function casesFor(project: TestProjectId): TestCase[] {
  return TEST_CASES.filter((testCase) => testCase.project === project);
}
