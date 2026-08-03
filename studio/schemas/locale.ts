import { defineField, defineType } from 'sanity';

/**
 * Языки Студии. Список должен совпадать с ENABLED_LOCALES сайта
 * (src/i18n/config.ts): показывать поле для языка, который сайт не собирает,
 * значит копить текст, который никто не увидит.
 *
 * Русский помечен обязательным: он же служит запасным вариантом, если
 * перевод не заполнен, поэтому пустым остаться не может.
 */
export const LANGUAGES = [
  { id: 'ru', title: 'Русский', required: true },
  { id: 'en', title: 'English', required: false },
] as const;

/** Короткая строка: заголовки, роли, подписи. */
export const localeString = defineType({
  name: 'localeString',
  title: 'Текст (по языкам)',
  type: 'object',
  // Языки складываются в компактную группу, иначе форма растёт вдвое
  options: { collapsible: true, collapsed: false },
  fields: LANGUAGES.map((language) =>
    defineField({
      name: language.id,
      title: language.title,
      type: 'string',
      validation: (rule) => (language.required ? rule.required() : rule),
    }),
  ),
});

/** Многострочный текст: описания и краткие пояснения. */
export const localeText = defineType({
  name: 'localeText',
  title: 'Абзац (по языкам)',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: LANGUAGES.map((language) =>
    defineField({
      name: language.id,
      title: language.title,
      type: 'text',
      rows: 4,
      validation: (rule) => (language.required ? rule.required() : rule),
    }),
  ),
});

/** Список пунктов «Что внутри» — по одному массиву строк на язык. */
export const localeStringList = defineType({
  name: 'localeStringList',
  title: 'Список (по языкам)',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: LANGUAGES.map((language) =>
    defineField({
      name: language.id,
      title: language.title,
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ),
});
