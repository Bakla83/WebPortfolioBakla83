import type { Locale } from './config';

const ru = {
  meta: {
    siteName: 'Владислав Баклан — портфолио',
    defaultDescription:
      'Портфолио Владислава Баклана: сайты и лендинги, тестирование, игры на Unity, Android-приложения и 3D-графика в Blender.',
  },

  nav: {
    about: 'Обо мне',
    contacts: 'Контакты',
    work: 'Работы',
    inProgress: 'В процессе создания',
    testing: 'Тестирование',
    menu: 'Меню',
    openMenu: 'Открыть меню',
    closeMenu: 'Закрыть меню',
    skipToContent: 'Перейти к содержимому',
  },

  theme: {
    label: 'Тема оформления',
    toLight: 'Включить светлую тему',
    toDark: 'Включить тёмную тему',
  },

  lang: {
    label: 'Язык сайта',
    current: 'Текущий язык',
  },

  home: {
    name: 'Владислав Баклан',
    tagline: 'Сайты, тестирование, игры, приложения и 3D-графика',
    intro:
      'Делаю проекты целиком — от идеи до сборки и релиза. Сайты и лендинги, тестирование и автотесты, игры на Unity, приложения для Android и модели в Blender.',
    ctaWork: 'Смотреть работы',
    ctaContact: 'Связаться',
    sectionsTitle: 'Разделы',
    sectionsLead: 'Работы разложены по направлениям — выберите, что ближе.',
    featuredTitle: 'Избранное',
    featuredLead: 'Проекты, которыми я доволен больше всего.',
    skillsTitle: 'Стек технологий',
    allInSection: 'Все работы раздела',
  },

  about: {
    title: 'Обо мне',
    lead: 'Разработчик полного цикла: сайты, тестирование, игры, приложения и 3D-графика.',
    description:
      'Владислав Баклан — разработчик полного цикла: сайты на JavaScript и TypeScript, Android-приложения на Kotlin, игры на Unity и 3D-модели в Blender.',
    skillsTitle: 'Навыки',
    stackTitle: 'Инструменты',
    approachTitle: 'Как я работаю',
  },

  sections: {
    empty: 'В этом разделе пока пусто — скоро появится.',
    countOne: 'работа',
    countFew: 'работы',
    countMany: 'работ',
    backToSection: 'Ко всем работам раздела',
  },

  project: {
    more: 'Подробнее',
    overview: 'О проекте',
    highlights: 'Что внутри',
    tech: 'Технологии',
    gallery: 'Галерея',
    video: 'Видео',
    model: '3D-модель',
    modelHint: 'Модель можно вращать: зажмите и ведите мышью или пальцем.',
    demo: 'Открыть проект',
    demoPlay: 'Запустить здесь',
    demoHint: 'Настоящая страница, а не скриншот',
    demoOpen: 'В новой вкладке',
    demoReload: 'Сначала',
    playable: 'Запускается',
    links: 'Ссылки',
    linkLive: 'Открыть проект',
    linkSource: 'Исходный код',
    linkSteam: 'Страница в Steam',
    linkDownload: 'Скачать',
    year: 'Год',
    role: 'Роль',
    status: 'Статус',
    prev: 'Предыдущая работа',
    next: 'Следующая работа',
  },

  contacts: {
    title: 'Контакты',
    lead: 'Открыт для заказов и интересных задач. Пишите удобным способом — отвечаю быстро.',
    directTitle: 'Прямая связь',
    freelanceTitle: 'Фриланс-площадки',
    socialTitle: 'Соцсети',
    copy: 'Скопировать',
    copied: 'Скопировано',
  },

  footer: {
    rights: 'Все права защищены.',
    nav: 'Навигация',
    toTop: 'Наверх',
    privacy: 'Конфиденциальность',
  },

  notFound: {
    title: 'Страница не найдена',
    text: 'Такой страницы нет — возможно, ссылка устарела.',
    home: 'На главную',
  },

  cookie: {
    text: 'Сайт не использует аналитику и не ставит трекеров. В браузере сохраняются только ваш выбор темы и языка.',
    ok: 'Понятно',
  },
};

export type UiStrings = typeof ru;

const en: UiStrings = {
  meta: {
    siteName: 'Vladislav Baklan — portfolio',
    defaultDescription:
      'Portfolio of Vladislav Baklan: websites and landing pages, testing, Unity games, Android apps and Blender 3D art.',
  },

  nav: {
    about: 'About',
    contacts: 'Contact',
    work: 'Work',
    inProgress: 'Work in progress',
    testing: 'Testing',
    menu: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    skipToContent: 'Skip to content',
  },

  theme: {
    label: 'Colour theme',
    toLight: 'Switch to light theme',
    toDark: 'Switch to dark theme',
  },

  lang: {
    label: 'Site language',
    current: 'Current language',
  },

  home: {
    name: 'Vladislav Baklan',
    tagline: 'Websites, testing, games, apps and 3D art',
    intro:
      'I build projects end to end — from the idea to the build and release. Websites and landing pages, testing and automated tests, Unity games, Android apps and models in Blender.',
    ctaWork: 'See my work',
    ctaContact: 'Get in touch',
    sectionsTitle: 'Sections',
    sectionsLead: 'Work is grouped by type — pick whichever fits.',
    featuredTitle: 'Selected work',
    featuredLead: 'The projects I am happiest with.',
    skillsTitle: 'Tech stack',
    allInSection: 'All work in this section',
  },

  about: {
    title: 'About me',
    lead: 'Full-cycle developer: websites, testing, games, apps and 3D art.',
    description:
      'Vladislav Baklan, a full-cycle developer: websites in JavaScript and TypeScript, Android apps in Kotlin, Unity games and 3D models in Blender.',
    skillsTitle: 'Skills',
    stackTitle: 'Tools',
    approachTitle: 'How I work',
  },

  sections: {
    empty: 'Nothing here yet — coming soon.',
    countOne: 'project',
    countFew: 'projects',
    countMany: 'projects',
    backToSection: 'Back to all work in this section',
  },

  project: {
    more: 'Read more',
    overview: 'About the project',
    highlights: 'What is inside',
    tech: 'Tech',
    gallery: 'Gallery',
    video: 'Video',
    model: '3D model',
    modelHint: 'You can rotate the model: drag with the mouse or your finger.',
    demo: 'Open the project',
    demoPlay: 'Run it here',
    demoHint: 'The real page, not a screenshot',
    demoOpen: 'New tab',
    demoReload: 'Restart',
    playable: 'Runnable',
    links: 'Links',
    linkLive: 'Open project',
    linkSource: 'Source code',
    linkSteam: 'View on Steam',
    linkDownload: 'Download',
    year: 'Year',
    role: 'Role',
    status: 'Status',
    prev: 'Previous project',
    next: 'Next project',
  },

  contacts: {
    title: 'Contact',
    lead: 'Open to commissions and interesting problems. Reach out however suits you — I reply quickly.',
    directTitle: 'Direct',
    freelanceTitle: 'Freelance platforms',
    socialTitle: 'Social',
    copy: 'Copy',
    copied: 'Copied',
  },

  footer: {
    rights: 'All rights reserved.',
    nav: 'Navigation',
    toTop: 'Back to top',
    privacy: 'Privacy',
  },

  notFound: {
    title: 'Page not found',
    text: 'This page does not exist — the link may be out of date.',
    home: 'Go home',
  },

  cookie: {
    text: 'This site uses no analytics and sets no trackers. Only your theme and language choice are stored in the browser.',
    ok: 'Got it',
  },
};

const dictionaries: Partial<Record<Locale, UiStrings>> = { ru, en };

export function t(locale: Locale): UiStrings {
  return dictionaries[locale] ?? ru;
}

export function plural(locale: Locale, n: number, strings: UiStrings): string {
  if (locale === 'ru') {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return strings.sections.countOne;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return strings.sections.countFew;
    return strings.sections.countMany;
  }
  return n === 1 ? strings.sections.countOne : strings.sections.countMany;
}
