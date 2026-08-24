import type { Localized } from '../i18n/config';
import type { Accent } from './types';

export interface ContactLink {
  id: string;
  group: 'direct' | 'freelance' | 'social';
  label: string;
  handle: string;
  url: string;
  accent: Accent;
}

export interface SkillGroup {
  id: string;
  title: Localized<string>;
  accent: Accent;
  items: string[];
}

export const PROFILE = {
  name: { ru: 'Владислав Баклан', en: 'Vladislav Baklan' } satisfies Localized<string>,

  email: '',

  location: { ru: '', en: '' } satisfies Localized<string>,

  since: 2023,
} as const;

export const CONTACTS: ContactLink[] = [
  {
    id: 'telegram',
    group: 'direct',
    label: 'Telegram',
    handle: '@Corm83',
    url: 'https://t.me/Corm83',
    accent: 'gold',
  },
  {
    id: 'fiverr',
    group: 'freelance',
    label: 'Fiverr',
    handle: 'bakla83',
    url: 'https://www.fiverr.com/bakla83',
    accent: 'green',
  },
  {
    id: 'linkedin',
    group: 'freelance',
    label: 'LinkedIn',
    handle: 'Vladislav Baklan',
    url: 'https://www.linkedin.com/in/vladislav-baklan-a5316936a',
    accent: 'purple',
  },
  {
    id: 'github',
    group: 'social',
    label: 'GitHub',
    handle: 'Bakla83',
    url: 'https://github.com/Bakla83',
    accent: 'gold',
  },
  {
    id: 'instagram',
    group: 'social',
    label: 'Instagram',
    handle: '@bakla_83',
    url: 'https://www.instagram.com/bakla_83/',
    accent: 'purple',
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'gamedev',
    accent: 'gold',
    title: { ru: 'Разработка игр', en: 'Game development' },
    items: [
      'Unity',
      'C#',
      'Game design',
      'Процедурная генерация',
      'Игровая физика',
    ],
  },
  {
    id: 'web',
    accent: 'purple',
    title: { ru: 'Веб-разработка', en: 'Web development' },
    items: [
      'HTML',
      'CSS',
      'JavaScript',
      'TypeScript',
      'Astro',
      'Canvas API',
      'PHP',
      'WordPress',
      'WooCommerce',
      'Адаптивная вёрстка',
      'Доступность',
      'Локализация',
    ],
  },
  {
    id: 'mobile',
    accent: 'green',
    title: { ru: 'Мобильная разработка', en: 'Mobile development' },
    items: ['Kotlin', 'Android SDK', 'Gradle', 'Офлайн-хранение', 'Оптимизация APK'],
  },
  {
    id: 'threed',
    accent: 'gold',
    title: { ru: '3D и графика', en: '3D & graphics' },
    items: ['Blender', 'Моделирование', 'UV и текстуры', 'Рендер', 'Игровые ассеты'],
  },
];

export const ABOUT_TEXT: Localized<string[]> = {
  ru: [
    'Делаю проекты целиком — от идеи до момента, когда их можно открыть, запустить или установить. Мне одинаково интересны и вёрстка, и игровая механика, и то, как всё это в итоге собирается в готовую вещь.',
    'Сайты пишу на чистом JavaScript и TypeScript, без тяжёлых фреймворков там, где они не нужны: так страница открывается быстро даже на слабом телефоне. Приложения для Android — на Kotlin: офлайн и без лишнего веса. Игры в Unity пишу на C#. Модели и текстуры к ним делаю сам в Blender.',
  ],
  en: [
    'I build projects end to end — from the idea to the point where you can open, launch or install them. Interface work, game mechanics and the way it all finally comes together into a finished thing interest me equally.',
    'Sites I write in plain JavaScript and TypeScript, with no heavy frameworks where they are not needed: that way a page opens fast even on a weak phone. Android apps in Kotlin: offline, no extra weight. Games I write in Unity, in C#. The models and textures for them I make myself in Blender.',
  ],
};
