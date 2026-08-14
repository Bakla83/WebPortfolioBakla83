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
    'Я разработчик полного цикла: беру проект от идеи и до момента, когда его можно открыть, запустить или установить. Мне одинаково интересны игровая механика, вёрстка интерфейса и то, как всё собирается в готовый продукт.',
    'В играх работаю на Unity и C#: механики, процедурная генерация уровней, поведение противников. В вебе пишу на чистом JavaScript и TypeScript — без тяжёлых фреймворков там, где они не нужны, чтобы сайт быстро открывался и на слабом телефоне. Мобильные приложения делаю на Kotlin под Android, с упором на офлайн-работу и небольшой вес. Графику и модели готовлю в Blender.',
    'Что для меня важно в работе: проект должен быть проверяемым. Там, где логика сложная — процедурная генерация уровней, подбор рецептов, локализация — я пишу автоматические проверки, чтобы поломка находилась до релиза, а не после.',
  ],
  en: [
    'I am a full-cycle developer: I take a project from the idea to the point where you can open, launch or install it. Game mechanics, interface markup and the way it all comes together into a finished product interest me equally.',
    'For games I work in Unity and C#: mechanics, procedural level generation, enemy behaviour. On the web I write plain JavaScript and TypeScript — no heavy frameworks where they are not needed, so the site opens quickly even on a weak phone. Mobile apps I build in Kotlin for Android, focused on offline use and a small footprint. Art and models I prepare in Blender.',
    'What matters to me in the work: a project has to be verifiable. Wherever the logic gets complex — procedural level generation, recipe matching, localisation — I write automated checks, so breakage is found before release rather than after.',
  ],
};
