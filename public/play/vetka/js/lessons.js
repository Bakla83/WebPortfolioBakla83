/*
  Сценарии уроков.

  Каждый урок — это подготовка стола и список шагов. Подготовка задана не
  готовым состоянием, а обычными командами, которые прогоняются молча: так
  начальная точка урока не может разойтись с тем, что делает движок, и
  любой урок можно открыть первым, не проходя предыдущие.

  Шаг проверяется регулярным выражением, а не сравнением строк: важно, что
  человек написал нужную команду, а не то, поставил ли он лишний пробел или
  выбрал `git switch` вместо `git checkout`.
*/
window.Vetka = window.Vetka || {};

(function (ns) {
  'use strict';

  const IDENTITY = [
    'git config --global user.name "Bakla83"',
    'git config --global user.email "bakla83@example.com"',
  ];

  const START = ['mkdir my-site', 'cd my-site', 'echo "<h1>Моя страница</h1>" > index.html'];

  const FIRST_COMMIT = START.concat(IDENTITY, ['git init', 'git add .', 'git commit -m "первая страница"']);

  const TWO_COMMITS = FIRST_COMMIT.concat([
    'echo "<p>О себе</p>" >> index.html',
    'git add .',
    'git commit -m "абзац о себе"',
  ]);

  const LESSONS = [
    /* ───────────────────────────── 1. Git Bash ───────────────────────────── */
    {
      id: 'bash',
      title: { ru: 'Где я и что вокруг', en: 'Where am I and what is here' },
      lead: {
        ru: 'Git Bash — это не git, а окно, в котором его запускают. Четырёх команд хватает, чтобы не потеряться.',
        en: 'Git Bash is not git — it is the window you run git in. Four commands are enough not to get lost.',
      },
      setup: [],
      ready: {
        ru: 'Открыт пустой стол: папка /d/projects, в ней пока ничего нет.',
        en: 'An empty desk: the folder /d/projects with nothing in it yet.',
      },
      steps: [
        {
          text: {
            ru: 'Первый вопрос в любом терминале — «где я сейчас». Ответ даёт pwd: он печатает полный путь текущей папки.',
            en: 'The first question in any terminal is “where am I”. pwd answers it: it prints the full path of the current folder.',
          },
          cmd: 'pwd',
          match: /^pwd$/,
          hint: {
            ru: 'Три буквы: print working directory.',
            en: 'Three letters: print working directory.',
          },
        },
        {
          text: {
            ru: 'Создадим папку под проект. mkdir делает её рядом, внутри текущей.',
            en: 'Create a folder for the project. mkdir makes it inside the current one.',
          },
          cmd: 'mkdir my-site',
          match: /^mkdir\s+my-site\/?$/,
          hint: { ru: 'mkdir — make directory.', en: 'mkdir — make directory.' },
        },
        {
          text: {
            ru: 'ls показывает, что лежит в текущей папке. Папка появилась — значит, всё получилось.',
            en: 'ls lists what is in the current folder. The folder is there, so it worked.',
          },
          cmd: 'ls',
          match: /^ls(\s+-\w+)?$/,
          hint: { ru: 'ls — list.', en: 'ls — list.' },
        },
        {
          text: {
            ru: 'Зайдём внутрь. cd — единственный способ перемещаться: терминал всегда «стоит» в какой-то одной папке.',
            en: 'Step inside. cd is the only way to move: the terminal always stands in exactly one folder.',
          },
          cmd: 'cd my-site',
          match: /^cd\s+my-site\/?$/,
          hint: {
            ru: 'cd — change directory. Обратно наверх — cd ..',
            en: 'cd — change directory. Back up is cd ..',
          },
        },
        {
          text: {
            ru: 'Создадим файл с содержимым. Стрелка > означает «положить этот текст в файл»; если файла нет, он появится.',
            en: 'Create a file with content. The > arrow means “put this text into the file”; if the file does not exist, it appears.',
          },
          cmd: 'echo "<h1>Моя страница</h1>" > index.html',
          match: /^echo\s+.+>\s*index\.html$/,
          hint: {
            ru: 'Две стрелки >> дописывают в конец, одна > перезаписывает файл целиком.',
            en: 'Two arrows >> append to the end, a single > overwrites the whole file.',
          },
        },
        {
          text: {
            ru: 'cat печатает содержимое файла прямо в окно — быстрый способ проверить, что записалось.',
            en: 'cat prints a file straight into the window — the quick way to check what was written.',
          },
          cmd: 'cat index.html',
          match: /^cat\s+index\.html$/,
          hint: { ru: 'cat <файл>', en: 'cat <file>' },
        },
      ],
      drill: [
        {
          ask: { ru: 'Как узнать полный путь папки, в которой вы сейчас?', en: 'How do you find the full path of the folder you are in?' },
          match: /^pwd$/,
          answer: 'pwd',
        },
        {
          ask: { ru: 'Как посмотреть, что лежит в текущей папке?', en: 'How do you see what is in the current folder?' },
          match: /^ls(\s+-\w+)?$/,
          answer: 'ls',
        },
        {
          ask: { ru: 'Как подняться на папку выше?', en: 'How do you go one folder up?' },
          match: /^cd\s+\.\.$/,
          answer: 'cd ..',
        },
      ],
      done: {
        ru: 'Этого набора хватает, чтобы дойти до нужной папки и посмотреть, что в ней. Дальше — сам git.',
        en: 'That set is enough to reach the folder you need and see what is in it. Next comes git itself.',
      },
    },

    /* ─────────────────────────── 2. Первый коммит ─────────────────────────── */
    {
      id: 'first-commit',
      title: { ru: 'Первый репозиторий и первый коммит', en: 'First repository, first commit' },
      lead: {
        ru: 'Коммит — это снимок проекта, который git запомнит навсегда. Чтобы он получился, файл должен пройти три зоны: папка → индекс → репозиторий.',
        en: 'A commit is a snapshot of the project that git keeps forever. To make one, a file passes three zones: folder → index → repository.',
      },
      setup: START,
      ready: {
        ru: 'Готово: папка my-site, внутри index.html. Git о ней ещё ничего не знает.',
        en: 'Ready: the folder my-site with index.html inside. Git knows nothing about it yet.',
      },
      steps: [
        {
          text: {
            ru: 'git init заводит репозиторий: рядом с файлами появляется скрытая папка .git, в которой git будет хранить всю историю.',
            en: 'git init creates the repository: a hidden .git folder appears next to your files, and git keeps the whole history there.',
          },
          cmd: 'git init',
          match: /^git\s+init$/,
          hint: {
            ru: 'Одна команда, без аргументов. Делается один раз на проект.',
            en: 'One command, no arguments. Done once per project.',
          },
        },
        {
          text: {
            ru: 'git status — главная команда git. Она всегда отвечает на вопрос «что сейчас происходит» и подсказывает, что делать дальше. Обратите внимание: index.html «не отслеживается» — git его видит, но не следит за ним.',
            en: 'git status is the main command in git. It always answers “what is going on right now” and suggests what to do next. Note that index.html is untracked: git sees it but is not watching it.',
          },
          cmd: 'git status',
          match: /^git\s+status(\s+-s|\s+--short)?$/,
          hint: { ru: 'Её можно набирать после любой команды — это не ошибка, а привычка.', en: 'You can run it after any command — that is a habit, not a mistake.' },
        },
        {
          text: {
            ru: 'Git подписывает каждый коммит именем автора. Пока имя не задано, коммит не получится — это первое, обо что спотыкаются все. Ключ --global означает «для всех проектов на этом компьютере».',
            en: 'Git signs every commit with an author name. Until it is set, no commit happens — this is what everyone trips over first. The --global flag means “for every project on this computer”.',
          },
          cmd: 'git config --global user.name "Bakla83"',
          match: /^git\s+config\s+--global\s+user\.name\s+.+$/,
          hint: { ru: 'Имя в кавычках — любое, хоть ваш ник с GitHub.', en: 'Any name in quotes — your GitHub handle works.' },
        },
        {
          text: {
            ru: 'И почта — тем же способом. По ней GitHub потом свяжет коммиты с вашим аккаунтом.',
            en: 'And the e-mail, the same way. GitHub later ties commits to your account by it.',
          },
          cmd: 'git config --global user.email "bakla83@example.com"',
          match: /^git\s+config\s+--global\s+user\.email\s+.+$/,
          hint: { ru: 'Та же команда, другой ключ: user.email.', en: 'Same command, different key: user.email.' },
        },
        {
          text: {
            ru: 'git add перекладывает файл в индекс — это «корзина» будущего коммита. Точка вместо имени означает «всё, что изменилось».',
            en: 'git add moves the file into the index — the basket for the next commit. A dot instead of a name means “everything that changed”.',
          },
          cmd: 'git add index.html',
          match: /^git\s+add\s+(index\.html|\.|-A|\*)$/,
          hint: { ru: 'git add <файл> или git add . для всего сразу.', en: 'git add <file>, or git add . for everything at once.' },
        },
        {
          text: {
            ru: 'Посмотрите status ещё раз: файл переехал в «Changes to be committed». Это и есть индекс — на схеме справа он вторым столбцом.',
            en: 'Run status again: the file has moved to “Changes to be committed”. That is the index — the second column on the diagram.',
          },
          cmd: 'git status',
          match: /^git\s+status(\s+-s|\s+--short)?$/,
          hint: { ru: 'Та же команда, что и раньше.', en: 'The same command as before.' },
        },
        {
          text: {
            ru: 'git commit запечатывает содержимое индекса в снимок. Ключ -m задаёт сообщение — короткое описание того, что сделано.',
            en: 'git commit seals the contents of the index into a snapshot. The -m flag sets the message — a short description of what was done.',
          },
          cmd: 'git commit -m "первая страница"',
          match: /^git\s+commit\s+.*-m\s+.+$/,
          hint: {
            ru: 'Сообщение в кавычках. Без -m git полезет открывать текстовый редактор.',
            en: 'The message goes in quotes. Without -m git tries to open a text editor.',
          },
        },
        {
          text: {
            ru: 'Проверим: рабочая папка чистая — всё, что было, теперь внутри истории.',
            en: 'Check it: the working tree is clean — everything is inside the history now.',
          },
          cmd: 'git status',
          match: /^git\s+status(\s+-s|\s+--short)?$/,
          hint: { ru: 'nothing to commit, working tree clean — то, что нужно.', en: '“nothing to commit, working tree clean” is what you want.' },
        },
      ],
      drill: [
        {
          ask: { ru: 'Как завести git-репозиторий в текущей папке?', en: 'How do you start a git repository in the current folder?' },
          match: /^git\s+init$/,
          answer: 'git init',
        },
        {
          ask: { ru: 'Как положить в индекс сразу все изменения?', en: 'How do you put every change into the index at once?' },
          match: /^git\s+add\s+(\.|-A|--all)$/,
          answer: 'git add .',
        },
        {
          ask: { ru: 'Как сделать коммит с сообщением «правки»?', en: 'How do you commit with the message “правки”?' },
          match: /^git\s+commit\s+.*-m\s+.+$/,
          answer: 'git commit -m "правки"',
        },
      ],
      done: {
        ru: 'Три зоны и три команды: add кладёт в индекс, commit превращает индекс в снимок, status показывает, где что лежит.',
        en: 'Three zones and three commands: add fills the index, commit turns the index into a snapshot, status shows where everything is.',
      },
    },

    /* ─────────────────────────── 3. История и откат ─────────────────────── */
    {
      id: 'history',
      title: { ru: 'История и откат', en: 'History and undo' },
      lead: {
        ru: 'Смысл коммитов в том, что к ним можно вернуться. Посмотрим, как читать историю и как отменять правки, которые не понравились.',
        en: 'The point of commits is that you can come back to them. Let us read the history and undo changes you did not like.',
      },
      setup: FIRST_COMMIT,
      ready: {
        ru: 'Готово: репозиторий с одним коммитом «первая страница».',
        en: 'Ready: a repository with one commit, “первая страница”.',
      },
      steps: [
        {
          text: {
            ru: 'Допишем строку в файл. Две стрелки >> добавляют в конец, не стирая того, что было.',
            en: 'Append a line to the file. Two arrows >> add to the end without erasing what was there.',
          },
          cmd: 'echo "<p>О себе</p>" >> index.html',
          match: /^echo\s+.+>>\s*index\.html$/,
          hint: { ru: 'Именно две стрелки: одна затёрла бы файл целиком.', en: 'Two arrows exactly: a single one would wipe the file.' },
        },
        {
          text: {
            ru: 'status теперь говорит «modified»: файл отслеживается, и git заметил, что он разошёлся с последним коммитом.',
            en: 'status now says “modified”: the file is tracked and git noticed it drifted from the last commit.',
          },
          cmd: 'git status',
          match: /^git\s+status(\s+-s|\s+--short)?$/,
          hint: { ru: 'Сравните с прошлым разом: было «untracked», стало «modified».', en: 'Compare with last time: it was “untracked”, now it is “modified”.' },
        },
        {
          text: {
            ru: 'git diff показывает сами правки построчно: со знаком минус — то, что было, со знаком плюс — то, что стало.',
            en: 'git diff shows the change line by line: minus for what was there, plus for what is there now.',
          },
          cmd: 'git diff',
          match: /^git\s+diff$/,
          hint: { ru: 'git diff — рабочая папка против индекса, git diff --staged — индекс против коммита.', en: 'git diff is folder vs index; git diff --staged is index vs commit.' },
        },
        {
          text: {
            ru: 'Правка нравится — закоммитим её. Две команды подряд: сначала в индекс, потом в снимок.',
            en: 'You like the change, so commit it. Two commands in a row: into the index, then into a snapshot.',
          },
          cmd: 'git add .',
          match: /^git\s+add\s+(\.|-A|index\.html)$/,
          hint: { ru: 'Точка означает «всё изменённое».', en: 'The dot means “everything changed”.' },
        },
        {
          text: {
            ru: 'Теперь сам коммит. Сообщение пишут в настоящем времени и по делу: что именно изменилось.',
            en: 'Now the commit itself. Messages are written to the point: what exactly changed.',
          },
          cmd: 'git commit -m "абзац о себе"',
          match: /^git\s+commit\s+.*-m\s+.+$/,
          hint: { ru: 'git commit -m "…"', en: 'git commit -m "…"' },
        },
        {
          text: {
            ru: 'git log --oneline печатает историю по строке на коммит. Слева — короткий номер, по нему коммит и находят.',
            en: 'git log --oneline prints one line per commit. On the left is the short id — that is how commits are referred to.',
          },
          cmd: 'git log --oneline',
          match: /^git\s+log(\s+--oneline)?(\s+--graph)?$/,
          hint: { ru: 'Без --oneline git печатает то же самое, но развёрнуто.', en: 'Without --oneline git prints the same, only in full.' },
        },
        {
          text: {
            ru: 'А теперь сломаем файл: перезапишем его мусором одной стрелкой.',
            en: 'Now break the file: overwrite it with junk using a single arrow.',
          },
          cmd: 'echo "всё сломал" > index.html',
          match: /^echo\s+.+>\s*index\.html$/,
          hint: { ru: 'Одна стрелка > стирает всё, что было в файле.', en: 'A single > erases everything the file had.' },
        },
        {
          text: {
            ru: 'git restore возвращает файлу то состояние, в котором он был в последнем коммите. Правки, которых нет в коммите, пропадут — в этом и смысл.',
            en: 'git restore brings the file back to the state of the last commit. Changes that are not in a commit are gone — that is the whole point.',
          },
          cmd: 'git restore index.html',
          match: /^git\s+restore\s+(index\.html|\.)$/,
          hint: { ru: 'git restore <файл>. Снять из индекса — git restore --staged <файл>.', en: 'git restore <file>. To unstage: git restore --staged <file>.' },
        },
        {
          text: {
            ru: 'Убедимся, что файл цел: cat напечатает обе строки, как они были в коммите.',
            en: 'Make sure the file is intact: cat prints both lines exactly as they were in the commit.',
          },
          cmd: 'cat index.html',
          match: /^cat\s+index\.html$/,
          hint: { ru: 'cat index.html', en: 'cat index.html' },
        },
      ],
      drill: [
        {
          ask: { ru: 'Как посмотреть историю коммитов одной строкой на коммит?', en: 'How do you view the history, one line per commit?' },
          match: /^git\s+log\s+--oneline$/,
          answer: 'git log --oneline',
        },
        {
          ask: { ru: 'Как увидеть, что именно изменилось в файлах?', en: 'How do you see what exactly changed in the files?' },
          match: /^git\s+diff$/,
          answer: 'git diff',
        },
        {
          ask: { ru: 'Как выбросить правки в index.html и вернуть его как в коммите?', en: 'How do you throw away changes in index.html and get the committed version back?' },
          match: /^git\s+restore\s+index\.html$/,
          answer: 'git restore index.html',
        },
      ],
      done: {
        ru: 'status отвечает «что сейчас», diff — «что именно», log — «что было». restore возвращает файл к последнему коммиту.',
        en: 'status answers “what now”, diff answers “what exactly”, log answers “what happened”. restore takes a file back to the last commit.',
      },
    },

    /* ────────────────────────────── 4. Ветки ────────────────────────────── */
    {
      id: 'branches',
      title: { ru: 'Ветки: работа, которая не мешает', en: 'Branches: work that gets in nobody’s way' },
      lead: {
        ru: 'Ветка — это отдельная дорожка коммитов. В ней можно спокойно пробовать: в основной ветке до слияния ничего не меняется.',
        en: 'A branch is a separate track of commits. You can experiment there safely: nothing in the main branch changes until you merge.',
      },
      setup: TWO_COMMITS,
      ready: {
        ru: 'Готово: репозиторий с двумя коммитами в ветке main.',
        en: 'Ready: a repository with two commits on the main branch.',
      },
      steps: [
        {
          text: {
            ru: 'Создадим ветку и сразу перейдём в неё. Ключ -c означает «создать»; ветка отходит от того коммита, на котором вы стоите.',
            en: 'Create a branch and switch to it at once. The -c flag means “create”; the branch starts at the commit you are on.',
          },
          cmd: 'git switch -c feature',
          match: /^git\s+(switch\s+-c|checkout\s+-b)\s+feature$/,
          hint: {
            ru: 'То же самое делает старая форма: git checkout -b feature.',
            en: 'The older form does the same: git checkout -b feature.',
          },
        },
        {
          text: {
            ru: 'Смотрите на приглашение слева от курсора: в скобках теперь feature. Git Bash всегда показывает текущую ветку — это лучший способ не перепутать, где вы работаете.',
            en: 'Look at the prompt: it now says feature in parentheses. Git Bash always shows the current branch — the best way not to lose track of where you are working.',
          },
          cmd: 'git branch',
          match: /^git\s+branch$/,
          hint: { ru: 'Звёздочка отмечает текущую ветку.', en: 'The asterisk marks the current branch.' },
        },
        {
          text: {
            ru: 'Поработаем в ветке: допишем в страницу новую секцию.',
            en: 'Do some work on the branch: append a new section to the page.',
          },
          cmd: 'echo "<section>Новая секция</section>" >> index.html',
          match: /^echo\s+.+>>\s*index\.html$/,
          hint: { ru: 'Две стрелки — дописать в конец.', en: 'Two arrows — append to the end.' },
        },
        {
          text: {
            ru: 'Зафиксируем правку в ветке — обе команды разом, как обычно.',
            en: 'Commit the change on the branch — both commands as usual.',
          },
          cmd: 'git add .',
          match: /^git\s+add\s+(\.|-A|index\.html)$/,
          hint: { ru: 'git add .', en: 'git add .' },
        },
        {
          text: {
            ru: 'Коммит уйдёт в ветку feature, а main останется там, где был.',
            en: 'The commit lands on feature, while main stays where it was.',
          },
          cmd: 'git commit -m "новая секция"',
          match: /^git\s+commit\s+.*-m\s+.+$/,
          hint: { ru: 'git commit -m "…"', en: 'git commit -m "…"' },
        },
        {
          text: {
            ru: 'Вернёмся в main. Это и есть самое наглядное: файлы на диске сейчас изменятся сами.',
            en: 'Switch back to main. This is the vivid part: the files on disk are about to change by themselves.',
          },
          cmd: 'git switch main',
          match: /^git\s+(switch|checkout)\s+main$/,
          hint: { ru: 'git switch <ветка> — без -c, ветка уже есть.', en: 'git switch <branch> — no -c, the branch exists.' },
        },
        {
          text: {
            ru: 'Посмотрите файл: новой секции в нём нет. Она никуда не делась — она в ветке feature, а вы стоите на main.',
            en: 'Look at the file: the new section is not there. It is not lost — it lives on feature, and you are standing on main.',
          },
          cmd: 'cat index.html',
          match: /^cat\s+index\.html$/,
          hint: { ru: 'cat index.html', en: 'cat index.html' },
        },
        {
          text: {
            ru: 'git merge вливает ветку в текущую. Раз main не двигался, git просто перематывает его вперёд — это и называется fast-forward.',
            en: 'git merge pulls a branch into the current one. Since main has not moved, git just fast-forwards it — hence the name.',
          },
          cmd: 'git merge feature',
          match: /^git\s+merge\s+feature$/,
          hint: { ru: 'Сливают всегда в ту ветку, в которой стоят.', en: 'You always merge into the branch you are standing on.' },
        },
        {
          text: {
            ru: 'Теперь секция на месте и в main. Ветку можно удалить — история из неё уже здесь.',
            en: 'Now the section is on main too. The branch can go — its history is already here.',
          },
          cmd: 'git branch -d feature',
          match: /^git\s+branch\s+-[dD]\s+feature$/,
          hint: { ru: 'Ключ -d удаляет ветку, но только если она слита.', en: 'The -d flag deletes a branch, but only if it is merged.' },
        },
      ],
      drill: [
        {
          ask: { ru: 'Как создать ветку fix и сразу перейти в неё?', en: 'How do you create a branch “fix” and switch to it at once?' },
          match: /^git\s+(switch\s+-c|checkout\s+-b)\s+fix$/,
          answer: 'git switch -c fix',
        },
        {
          ask: { ru: 'Как вернуться в ветку main?', en: 'How do you go back to the main branch?' },
          match: /^git\s+(switch|checkout)\s+main$/,
          answer: 'git switch main',
        },
        {
          ask: { ru: 'Стоя в main, как влить в него ветку fix?', en: 'Standing on main, how do you merge the branch “fix” into it?' },
          match: /^git\s+merge\s+fix$/,
          answer: 'git merge fix',
        },
      ],
      done: {
        ru: 'Ветка — это закладка в истории. Переключение меняет файлы на диске, слияние сводит дорожки обратно.',
        en: 'A branch is a bookmark in the history. Switching changes the files on disk; merging brings the tracks back together.',
      },
    },

    /* ────────────────────────────── 5. GitHub ────────────────────────────── */
    {
      id: 'github',
      title: { ru: 'GitHub: своя копия и чужие правки', en: 'GitHub: your copy and other people’s changes' },
      lead: {
        ru: 'GitHub — это вторая копия репозитория, лежащая не у вас. push отправляет коммиты туда, pull забирает оттуда.',
        en: 'GitHub is a second copy of the repository that does not live on your machine. push sends commits there, pull brings them back.',
      },
      setup: TWO_COMMITS,
      ready: {
        ru: 'Готово: два коммита в main. Репозиторий на GitHub считаем уже созданным — кнопкой на сайте, без команд.',
        en: 'Ready: two commits on main. Assume the GitHub repository is already created with the button on the site, no commands needed.',
      },
      steps: [
        {
          text: {
            ru: 'Свяжем папку с репозиторием на GitHub. origin — просто имя для этого адреса, так его назвали по традиции.',
            en: 'Link the folder to the GitHub repository. “origin” is just a name for that address, chosen by tradition.',
          },
          cmd: 'git remote add origin https://github.com/bakla83/my-site.git',
          match: /^git\s+remote\s+add\s+origin\s+https?:\/\/\S+$/,
          hint: {
            ru: 'Адрес берут на странице репозитория, кнопка Code → HTTPS.',
            en: 'Copy the address from the repository page: Code → HTTPS.',
          },
        },
        {
          text: {
            ru: 'Проверим, что адрес записался: git remote -v печатает, куда git будет читать и писать.',
            en: 'Check that the address stuck: git remote -v prints where git will read from and write to.',
          },
          cmd: 'git remote -v',
          match: /^git\s+remote(\s+-v)?$/,
          hint: { ru: 'fetch — откуда забирать, push — куда отправлять.', en: 'fetch — where to take from, push — where to send.' },
        },
        {
          text: {
            ru: 'Первая отправка. Ключ -u связывает вашу ветку с веткой на GitHub, чтобы дальше хватало короткого git push.',
            en: 'The first push. The -u flag ties your branch to the branch on GitHub so that a bare git push is enough afterwards.',
          },
          cmd: 'git push -u origin main',
          match: /^git\s+push\s+(-u|--set-upstream)\s+origin\s+main$/,
          hint: {
            ru: 'Читается как «отправить ветку main на origin и запомнить связь».',
            en: 'Read it as “send branch main to origin and remember the link”.',
          },
          after: {
            kind: 'remoteCommit',
            message: { ru: 'правка в README с сайта', en: 'README edit from the website' },
            file: 'README.md',
            content: '# my-site\n\nПравка, сделанная прямо на GitHub.',
            note: {
              ru: 'Пока вы работали, кто-то поправил README прямо на сайте GitHub — на схеме удалённая копия ушла вперёд.',
              en: 'While you were working, someone edited the README right on GitHub — the remote copy on the diagram has moved ahead.',
            },
          },
        },
        {
          text: {
            ru: 'На GitHub появился коммит, которого у вас нет. git pull забирает такие правки и подтягивает вашу ветку.',
            en: 'GitHub now has a commit you do not. git pull brings such changes in and moves your branch forward.',
          },
          cmd: 'git pull',
          match: /^git\s+pull(\s+origin\s+main)?$/,
          hint: {
            ru: 'Привычка: перед началом работы — git pull, чтобы не разъехаться с чужими правками.',
            en: 'The habit: git pull before you start working, so you do not drift apart from other people’s changes.',
          },
        },
        {
          text: {
            ru: 'Файл с GitHub теперь лежит и у вас на диске — убедимся.',
            en: 'The file from GitHub is on your disk now — check it.',
          },
          cmd: 'ls',
          match: /^ls(\s+-\w+)?$/,
          hint: { ru: 'В списке должен появиться README.md.', en: 'README.md should show up in the list.' },
        },
        {
          text: {
            ru: 'Сделаем свою правку и отправим её. Сначала изменение и коммит — как в третьем уроке.',
            en: 'Make your own change and send it. First the edit and the commit, as in lesson three.',
          },
          cmd: 'echo "<footer>Контакты</footer>" >> index.html',
          match: /^echo\s+.+>>\s*index\.html$/,
          hint: { ru: 'Две стрелки — дописать в конец.', en: 'Two arrows — append to the end.' },
        },
        {
          text: { ru: 'В индекс.', en: 'Into the index.' },
          cmd: 'git add .',
          match: /^git\s+add\s+(\.|-A|index\.html)$/,
          hint: { ru: 'git add .', en: 'git add .' },
        },
        {
          text: { ru: 'И в коммит.', en: 'And into a commit.' },
          cmd: 'git commit -m "подвал с контактами"',
          match: /^git\s+commit\s+.*-m\s+.+$/,
          hint: { ru: 'git commit -m "…"', en: 'git commit -m "…"' },
        },
        {
          text: {
            ru: 'Теперь достаточно короткого git push: связь ветки с origin уже запомнена ключом -u.',
            en: 'Now a bare git push is enough: the link to origin was remembered by the -u flag.',
          },
          cmd: 'git push',
          match: /^git\s+push$/,
          hint: { ru: 'Без аргументов — отправить текущую ветку туда же, куда и в прошлый раз.', en: 'No arguments — send the current branch where it went last time.' },
        },
      ],
      drill: [
        {
          ask: { ru: 'Как привязать папку к репозиторию на GitHub?', en: 'How do you link the folder to a GitHub repository?' },
          match: /^git\s+remote\s+add\s+origin\s+\S+$/,
          answer: 'git remote add origin <адрес>',
        },
        {
          ask: { ru: 'Как отправить ветку main на GitHub в первый раз?', en: 'How do you push the main branch to GitHub for the first time?' },
          match: /^git\s+push\s+(-u|--set-upstream)\s+origin\s+main$/,
          answer: 'git push -u origin main',
        },
        {
          ask: { ru: 'Как забрать чужие правки с GitHub?', en: 'How do you fetch other people’s changes from GitHub?' },
          match: /^git\s+pull(\s+origin\s+main)?$/,
          answer: 'git pull',
        },
      ],
      done: {
        ru: 'push отправляет коммиты, pull забирает. Первый push — с ключом -u, дальше обе команды работают без аргументов.',
        en: 'push sends commits, pull brings them back. The first push takes -u; after that both commands work bare.',
      },
    },

    /* ──────────────────── 6. Сквозной путь на GitHub ──────────────────── */
    {
      id: 'full',
      title: { ru: 'От пустой папки до GitHub', en: 'From an empty folder to GitHub' },
      lead: {
        ru: 'Весь путь целиком, без пропусков: создать папку, положить файлы, завести репозиторий, отсечь лишнее, сделать коммит и выложить проект. Это тот самый порядок, который повторяется на каждом новом проекте.',
        en: 'The whole path with nothing skipped: create the folder, add files, start the repository, exclude the junk, commit and publish. This is the exact order you repeat on every new project.',
      },
      setup: IDENTITY,
      ready: {
        ru: 'Стол пустой, имя и почта уже настроены (это делается один раз на компьютер).',
        en: 'An empty desk; name and e-mail are already configured (that is done once per computer).',
      },
      steps: [
        {
          text: { ru: 'Папка проекта.', en: 'The project folder.' },
          cmd: 'mkdir portfolio',
          match: /^mkdir\s+portfolio\/?$/,
          hint: { ru: 'mkdir <имя>', en: 'mkdir <name>' },
        },
        {
          text: { ru: 'Заходим внутрь — дальше всё происходит здесь.', en: 'Step inside — everything else happens here.' },
          cmd: 'cd portfolio',
          match: /^cd\s+portfolio\/?$/,
          hint: { ru: 'cd <имя>', en: 'cd <name>' },
        },
        {
          text: {
            ru: 'Кладём файл проекта. В настоящей работе он появится из редактора — здесь достаточно echo.',
            en: 'Add a project file. In real life it comes from your editor — here echo is enough.',
          },
          cmd: 'echo "<h1>Портфолио</h1>" > index.html',
          match: /^echo\s+.+>\s*index\.html$/,
          hint: { ru: 'echo "текст" > файл', en: 'echo "text" > file' },
        },
        {
          text: {
            ru: 'И заодно то, чего в репозитории быть не должно: папку с зависимостями. Такое добро весит сотни мегабайт и восстанавливается одной командой — хранить его в истории незачем.',
            en: 'And also something that must not end up in the repository: the dependencies folder. It weighs hundreds of megabytes and is restored by one command — no reason to keep it in the history.',
          },
          cmd: 'touch node_modules',
          match: /^touch\s+node_modules$/,
          hint: { ru: 'Здесь это просто заглушка, чтобы было что прятать.', en: 'Here it is just a stand-in, so there is something to hide.' },
        },
        {
          text: {
            ru: 'Заводим репозиторий.',
            en: 'Start the repository.',
          },
          cmd: 'git init',
          match: /^git\s+init$/,
          hint: { ru: 'Один раз на проект.', en: 'Once per project.' },
        },
        {
          text: {
            ru: '.gitignore — список того, что git должен не замечать. Строчка с именем папки — и её больше нет в status.',
            en: '.gitignore is the list of things git should ignore. One line with the folder name and it disappears from status.',
          },
          cmd: 'echo "node_modules/" > .gitignore',
          match: /^echo\s+.*node_modules.*>\s*\.gitignore$/,
          hint: {
            ru: 'Сам .gitignore в репозиторий класть нужно — он часть проекта.',
            en: 'The .gitignore itself does belong in the repository — it is part of the project.',
          },
        },
        {
          text: {
            ru: 'Смотрим status: node_modules пропал из списка, остались index.html и .gitignore.',
            en: 'Check status: node_modules is gone from the list, index.html and .gitignore remain.',
          },
          cmd: 'git status',
          match: /^git\s+status(\s+-s|\s+--short)?$/,
          hint: { ru: 'Если папка всё ещё видна — проверьте, что имя в .gitignore написано точно.', en: 'If the folder is still listed, check that the name in .gitignore is exact.' },
        },
        {
          text: { ru: 'Всё нужное — в индекс.', en: 'Everything you need — into the index.' },
          cmd: 'git add .',
          match: /^git\s+add\s+(\.|-A|--all)$/,
          hint: { ru: 'Точка берёт всё, кроме того, что в .gitignore.', en: 'The dot takes everything except what .gitignore hides.' },
        },
        {
          text: { ru: 'Первый коммит проекта.', en: 'The first commit of the project.' },
          cmd: 'git commit -m "начало проекта"',
          match: /^git\s+commit\s+.*-m\s+.+$/,
          hint: { ru: 'git commit -m "…"', en: 'git commit -m "…"' },
        },
        {
          text: {
            ru: 'Теперь GitHub. Репозиторий там создаётся кнопкой на сайте — пустой, без файлов. Его адрес и вписываем.',
            en: 'Now GitHub. You create the repository there with a button on the site — empty, no files. Then you paste its address here.',
          },
          cmd: 'git remote add origin https://github.com/bakla83/portfolio.git',
          match: /^git\s+remote\s+add\s+origin\s+https?:\/\/\S+$/,
          hint: { ru: 'Code → HTTPS → скопировать адрес.', en: 'Code → HTTPS → copy the address.' },
        },
        {
          text: {
            ru: 'Отправляем. Первый раз — с ключом -u, дальше хватит git push.',
            en: 'Send it. The first time with -u; after that git push is enough.',
          },
          cmd: 'git push -u origin main',
          match: /^git\s+push\s+(-u|--set-upstream)\s+origin\s+main$/,
          hint: { ru: 'git push -u origin main', en: 'git push -u origin main' },
        },
        {
          text: {
            ru: 'И последняя привычка: убедиться, что ничего не забыто.',
            en: 'And the last habit: make sure nothing was left behind.',
          },
          cmd: 'git status',
          match: /^git\s+status(\s+-s|\s+--short)?$/,
          hint: { ru: 'working tree clean — проект целиком на GitHub.', en: '“working tree clean” — the whole project is on GitHub.' },
        },
      ],
      drill: [
        {
          ask: {
            ru: 'Проект уже закоммичен. Какие две команды свяжут его с GitHub и отправят туда?',
            en: 'The project is committed. Which two commands link it to GitHub and send it there?',
          },
          match: /^git\s+remote\s+add\s+origin\s+\S+$/,
          answer: 'git remote add origin <адрес>',
        },
        {
          ask: { ru: 'И вторая из них?', en: 'And the second one?' },
          match: /^git\s+push\s+(-u|--set-upstream)\s+origin\s+\w+$/,
          answer: 'git push -u origin main',
        },
        {
          ask: {
            ru: 'Как сделать так, чтобы папка node_modules не попадала в репозиторий?',
            en: 'How do you keep the node_modules folder out of the repository?',
          },
          match: /^echo\s+.*node_modules.*>>?\s*\.gitignore$/,
          answer: 'echo "node_modules/" > .gitignore',
        },
      ],
      done: {
        ru: 'Этот порядок не меняется от проекта к проекту: mkdir → cd → git init → .gitignore → git add . → git commit -m → git remote add origin → git push -u origin main.',
        en: 'This order never changes from project to project: mkdir → cd → git init → .gitignore → git add . → git commit -m → git remote add origin → git push -u origin main.',
      },
    },
  ];

  /* Шпаргалка собирается из уроков: команда, что делает, в каком уроке встретилась. */
  const CHEATSHEET = [
    { cmd: 'pwd', lesson: 0, what: { ru: 'показать текущую папку', en: 'show the current folder' } },
    { cmd: 'ls', lesson: 0, what: { ru: 'что лежит в папке', en: 'what is in the folder' } },
    { cmd: 'cd <папка>', lesson: 0, what: { ru: 'зайти в папку, cd .. — на уровень выше', en: 'enter a folder; cd .. goes up' } },
    { cmd: 'mkdir <имя>', lesson: 0, what: { ru: 'создать папку', en: 'create a folder' } },
    { cmd: 'echo "текст" > файл', lesson: 0, what: { ru: 'записать текст в файл, >> — дописать', en: 'write text to a file; >> appends' } },
    { cmd: 'cat <файл>', lesson: 0, what: { ru: 'напечатать содержимое файла', en: 'print the contents of a file' } },

    { cmd: 'git init', lesson: 1, what: { ru: 'завести репозиторий в текущей папке', en: 'start a repository in this folder' } },
    { cmd: 'git config --global user.name "…"', lesson: 1, what: { ru: 'имя автора коммитов', en: 'the commit author name' } },
    { cmd: 'git status', lesson: 1, what: { ru: 'что происходит прямо сейчас', en: 'what is going on right now' } },
    { cmd: 'git add <файл> / git add .', lesson: 1, what: { ru: 'положить изменения в индекс', en: 'put changes into the index' } },
    { cmd: 'git commit -m "…"', lesson: 1, what: { ru: 'сделать снимок из индекса', en: 'seal the index into a snapshot' } },

    { cmd: 'git log --oneline', lesson: 2, what: { ru: 'история по строке на коммит', en: 'history, one line per commit' } },
    { cmd: 'git diff', lesson: 2, what: { ru: 'что именно изменилось', en: 'what exactly changed' } },
    { cmd: 'git restore <файл>', lesson: 2, what: { ru: 'вернуть файл как в последнем коммите', en: 'restore a file to the last commit' } },
    { cmd: 'git restore --staged <файл>', lesson: 2, what: { ru: 'убрать файл из индекса', en: 'take a file out of the index' } },

    { cmd: 'git branch', lesson: 3, what: { ru: 'список веток, звёздочка — текущая', en: 'list branches; the asterisk is the current one' } },
    { cmd: 'git switch -c <ветка>', lesson: 3, what: { ru: 'создать ветку и перейти в неё', en: 'create a branch and switch to it' } },
    { cmd: 'git switch <ветка>', lesson: 3, what: { ru: 'перейти в существующую ветку', en: 'switch to an existing branch' } },
    { cmd: 'git merge <ветка>', lesson: 3, what: { ru: 'влить ветку в текущую', en: 'merge a branch into the current one' } },
    { cmd: 'git branch -d <ветка>', lesson: 3, what: { ru: 'удалить слитую ветку', en: 'delete a merged branch' } },

    { cmd: 'git remote add origin <адрес>', lesson: 4, what: { ru: 'связать папку с GitHub', en: 'link the folder to GitHub' } },
    { cmd: 'git remote -v', lesson: 4, what: { ru: 'куда git читает и пишет', en: 'where git reads from and writes to' } },
    { cmd: 'git push -u origin main', lesson: 4, what: { ru: 'первая отправка ветки', en: 'the first push of a branch' } },
    { cmd: 'git push', lesson: 4, what: { ru: 'отправить новые коммиты', en: 'send new commits' } },
    { cmd: 'git pull', lesson: 4, what: { ru: 'забрать чужие коммиты', en: 'take other people’s commits' } },
    { cmd: 'git clone <адрес>', lesson: 4, what: { ru: 'скачать чужой репозиторий целиком', en: 'download an existing repository' } },

    { cmd: 'echo "node_modules/" > .gitignore', lesson: 5, what: { ru: 'что git не должен замечать', en: 'what git should ignore' } },
    { cmd: 'git reset --soft HEAD~1', lesson: 5, what: { ru: 'распустить последний коммит, оставив правки', en: 'undo the last commit, keeping the changes' } },
  ];

  ns.lessons = { list: LESSONS, cheatsheet: CHEATSHEET };
})(window.Vetka);
