import { defineField, defineType } from 'sanity';

export const LANGUAGES = [
  { id: 'ru', title: 'Русский', required: true },
  { id: 'en', title: 'English', required: false },
] as const;

export const localeString = defineType({
  name: 'localeString',
  title: 'Текст (по языкам)',
  type: 'object',

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
