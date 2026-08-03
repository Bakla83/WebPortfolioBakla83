import type { Section } from './types';

export const SECTIONS: Section[] = [
  {
    slug: 'landings',
    order: 1,
    accent: 'gold',
    title: { ru: 'Лендинги', en: 'Landing pages' },
    description: {
      ru: 'Одностраничные сайты под конкретную задачу: рассказать, убедить и довести до заявки. Собственная вёрстка без конструкторов и тяжёлых зависимостей.',
      en: 'Single-page sites built for one job: explain, convince and bring the visitor to an enquiry. Hand-written markup, no page builders or heavy dependencies.',
    },
  },
  {
    slug: 'websites',
    order: 2,
    accent: 'purple',
    title: { ru: 'Веб-сайты', en: 'Websites' },
    description: {
      ru: 'Многостраничные сайты и веб-приложения — там, где нужна логика, данные и состояние, а не только страница с текстом.',
      en: 'Multi-page sites and web apps — where logic, data and state matter, not just a page of text.',
    },
  },
  {
    slug: 'web-games',
    order: 3,
    accent: 'green',
    title: { ru: 'Веб-игры', en: 'Web games' },
    description: {
      ru: 'Игры, которые запускаются прямо в браузере, на телефоне и на компьютере. Canvas и собственная физика, без игровых движков.',
      en: 'Games that run straight in the browser, on phone and desktop. Canvas and hand-written physics, no game engines.',
    },
  },
  {
    slug: 'pc-games',
    order: 4,
    accent: 'gold',
    title: { ru: 'ПК-игры', en: 'PC games' },
    description: {
      ru: 'Игры для настольных платформ — от механик и прототипа до страницы в Steam.',
      en: 'Games for desktop platforms — from mechanics and prototype to a Steam page.',
    },
  },
  {
    slug: 'mobile-apps',
    order: 5,
    accent: 'purple',
    title: { ru: 'Мобильные приложения', en: 'Mobile apps' },
    description: {
      ru: 'Android-приложения на Kotlin: офлайн-первыми, без лишних разрешений и с вниманием к весу и скорости запуска.',
      en: 'Android apps in Kotlin: offline-first, no needless permissions, and careful about size and start-up speed.',
    },
  },
  {
    slug: 'models-3d',
    order: 6,
    accent: 'green',
    title: { ru: '3D-модели', en: '3D models' },
    description: {
      ru: 'Моделирование, текстуры и рендер в Blender — ассеты для игр и отдельные визуализации.',
      en: 'Modelling, texturing and rendering in Blender — game-ready assets and standalone visualisations.',
    },
  },
];

export const SECTIONS_BY_ORDER = [...SECTIONS].sort((a, b) => a.order - b.order);

export function getSection(slug: string): Section | undefined {
  return SECTIONS.find((s) => s.slug === slug);
}
