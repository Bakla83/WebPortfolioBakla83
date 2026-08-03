import type { Locale } from './config';

/**
 * Строки интерфейса. Содержимое проектов лежит отдельно, в src/data/.
 *
 * Чтобы добавить язык: скопировать блок `en`, перевести, положить под
 * нужным кодом и включить язык в ENABLED_LOCALES (src/i18n/config.ts).
 * TypeScript сам покажет, если какой-то ключ забыт.
 */
// Без `as const`: иначе каждое значение получит литеральный тип
// («Работы» вместо string), и перевод перестанет подходить под UiStrings.
const ru = {
  meta: {
    siteName: 'Владислав Баклан — портфолио',
    defaultDescription:
      'Портфолио Владислава Баклана: игры на Unity, веб-сайты и лендинги, Android-приложения и 3D-графика в Blender.',
  },

  nav: {
    about: 'Обо мне',
    contacts: 'Контакты',
    work: 'Работы',
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
    tagline: 'Игры, интерфейсы и всё, что между ними',
    intro:
      'Делаю проекты целиком: от механики и 3D-модели до вёрстки, сборки и релиза. Unity и C# в играх, TypeScript и чистый JS в вебе, Kotlin в Android, Blender в графике.',
    ctaWork: 'Смотреть работы',
    ctaContact: 'Связаться',
    sectionsTitle: 'Разделы',
    sectionsLead: 'Работы разложены по типам — выберите, что ближе.',
    featuredTitle: 'Избранное',
    featuredLead: 'Проекты, которыми я доволен больше всего.',
    skillsTitle: 'Чем работаю',
    allInSection: 'Все работы раздела',
  },

  about: {
    title: 'Обо мне',
    lead: 'Разработчик полного цикла: игры, веб и мобильные приложения.',
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
      'Portfolio of Vladislav Baklan: Unity games, websites and landing pages, Android apps and Blender 3D art.',
  },

  nav: {
    about: 'About',
    contacts: 'Contact',
    work: 'Work',
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
    tagline: 'Games, interfaces, and everything in between',
    intro:
      'I build projects end to end — from mechanics and 3D models to markup, build and release. Unity and C# for games, TypeScript and vanilla JS on the web, Kotlin on Android, Blender for art.',
    ctaWork: 'See my work',
    ctaContact: 'Get in touch',
    sectionsTitle: 'Sections',
    sectionsLead: 'Work is grouped by type — pick whichever fits.',
    featuredTitle: 'Selected work',
    featuredLead: 'The projects I am happiest with.',
    skillsTitle: 'What I work with',
    allInSection: 'All work in this section',
  },

  about: {
    title: 'About me',
    lead: 'Full-cycle developer: games, web and mobile.',
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

/**
 * Заготовки под fr/es намеренно отсутствуют: пустой перевод хуже,
 * чем его отсутствие — язык просто не показывается, пока не переведён.
 */
const dictionaries: Partial<Record<Locale, UiStrings>> = { ru, en };

export function t(locale: Locale): UiStrings {
  return dictionaries[locale] ?? ru;
}

/**
 * Русские числительные требуют трёх форм («1 работа», «2 работы», «5 работ»),
 * английскому хватает двух. Общая функция закрывает оба случая.
 */
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
