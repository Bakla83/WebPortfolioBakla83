import { defineArrayMember, defineField, defineType } from 'sanity';

const SECTIONS = [
  { title: 'Лендинги', value: 'landings' },
  { title: 'Веб-сайты', value: 'websites' },
  { title: 'Веб-игры', value: 'web-games' },
  { title: 'ПК-игры', value: 'pc-games' },
  { title: 'Мобильные приложения', value: 'mobile-apps' },
  { title: '3D-модели', value: 'models-3d' },
];

const imageWithAlt = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'image',

    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Описание для незрячих и поисковика',
        type: 'localeString',
        validation: (rule) => rule.required(),
      }),
      defineField({ name: 'caption', title: 'Подпись под картинкой', type: 'localeString' }),
    ],
  });

export const project = defineType({
  name: 'project',
  title: 'Работа',
  type: 'document',
  groups: [
    { name: 'main', title: 'Основное', default: true },
    { name: 'text', title: 'Тексты' },
    { name: 'media', title: 'Медиа' },
    { name: 'links', title: 'Ссылки' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Название',
      type: 'localeString',
      group: 'main',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Адрес страницы',
      description: 'Латиницей, через дефис: salt-run. Меняется — меняется и ссылка.',
      type: 'slug',
      group: 'main',
      options: { source: 'title.ru', maxLength: 60 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'section',
      title: 'Раздел',
      type: 'string',
      group: 'main',
      options: { list: SECTIONS, layout: 'dropdown' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Год',
      type: 'number',
      group: 'main',
      validation: (rule) => rule.required().integer().min(2000).max(2100),
    }),
    defineField({
      name: 'tech',
      title: 'Технологии',
      description: 'Unity, C#, TypeScript… Показываются метками на карточке.',
      type: 'array',
      group: 'main',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'featured',
      title: 'Показывать в «Избранном» на главной',
      type: 'boolean',
      group: 'main',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Порядок в разделе',
      description: 'Меньше число — выше в списке. Пусто — в конец.',
      type: 'number',
      group: 'main',
    }),

    defineField({
      name: 'teaser',
      title: 'Короткое описание',
      description: 'Одна-две строки. Всплывает при наведении на карточку.',
      type: 'localeText',
      group: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Описание проекта',
      description: 'Абзац на странице работы.',
      type: 'localeText',
      group: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'highlights',
      title: 'Что внутри',
      description: 'Список особенностей, по пункту на строку.',
      type: 'localeStringList',
      group: 'text',
    }),
    defineField({ name: 'role', title: 'Роль', type: 'localeString', group: 'text' }),
    defineField({ name: 'status', title: 'Статус', type: 'localeString', group: 'text' }),

    { ...imageWithAlt('cover', 'Обложка'), group: 'media' },
    defineField({
      name: 'gallery',
      title: 'Галерея',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({ ...imageWithAlt('galleryImage', 'Картинка'), name: 'galleryImage' })],
    }),

    defineField({
      name: 'demo',
      title: 'Запускаемая копия',
      type: 'object',
      group: 'media',
      description: 'Только для веб-работ: лендингов, сайтов и веб-игр.',
      fields: [
        defineField({
          name: 'src',
          title: 'Путь к копии',
          type: 'string',
          description: 'Например /play/hrebet/index.html',
          validation: (rule) =>
            rule.required().custom((value) =>
              typeof value === 'string' && value.startsWith('/play/')
                ? true
                : 'Путь должен начинаться с /play/',
            ),
        }),
        defineField({
          name: 'ratio',
          title: 'Пропорции рамки',
          type: 'string',
          description: "Как в CSS: '16 / 10' по умолчанию, '10 / 16' для портретной игры.",
        }),
        defineField({
          name: 'maxWidth',
          title: 'Предельная ширина рамки',
          type: 'string',
          description: "Например '420px' — нужно портретным работам, чтобы рамка не растягивалась.",
        }),
        defineField({
          name: 'note',
          title: 'Подсказка под рамкой',
          type: 'localeString',
          description: 'Что попробовать, чем управлять.',
        }),
      ],
    }),
    defineField({
      name: 'videos',
      title: 'Видео',
      type: 'array',
      group: 'media',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'video',
          title: 'Ролик',
          fields: [
            defineField({
              name: 'provider',
              title: 'Где лежит',
              type: 'string',
              options: {
                list: [
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'Vimeo', value: 'vimeo' },
                ],
                layout: 'radio',
              },
              initialValue: 'youtube',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'videoId',
              title: 'Идентификатор ролика',
              description:
                'Не вся ссылка, а только код. Для youtube.com/watch?v=dQw4w9WgXcQ это dQw4w9WgXcQ.',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Название ролика',
              type: 'localeString',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'title.ru', subtitle: 'videoId' } },
        }),
      ],
    }),
    defineField({
      name: 'models',
      title: '3D-модели',
      description:
        'Формат .glb или .gltf. Файл .blend браузер не открывает — экспортируйте из Blender: File → Export → glTF 2.0 (.glb).',
      type: 'array',
      group: 'media',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'model',
          title: 'Модель',
          fields: [
            defineField({
              name: 'file',
              title: 'Файл .glb',
              type: 'file',
              options: { accept: '.glb,.gltf' },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'poster',
              title: 'Картинка-заглушка',
              description: 'Показывается, пока модель грузится.',
              type: 'image',
            }),
            defineField({
              name: 'alt',
              title: 'Описание модели',
              type: 'localeString',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'alt.ru' } },
        }),
      ],
    }),

    defineField({
      name: 'links',
      title: 'Ссылки',
      type: 'array',
      group: 'links',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'link',
          title: 'Ссылка',
          fields: [
            defineField({
              name: 'kind',
              title: 'Тип',
              type: 'string',
              options: {
                list: [
                  { title: 'Открыть проект', value: 'live' },
                  { title: 'Исходный код', value: 'source' },
                  { title: 'Страница в Steam', value: 'steam' },
                  { title: 'Скачать', value: 'download' },
                  { title: 'Другое', value: 'other' },
                ],
              },
              initialValue: 'live',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Адрес',
              type: 'url',

              validation: (rule) =>
                rule.required().uri({ scheme: ['http', 'https'], allowRelative: true }),
            }),
            defineField({
              name: 'label',
              title: 'Своя подпись',
              description: 'Пусто — возьмётся стандартная для выбранного типа.',
              type: 'localeString',
            }),
          ],
          preview: { select: { title: 'kind', subtitle: 'url' } },
        }),
      ],
    }),
  ],

  preview: {
    select: { title: 'title.ru', subtitle: 'section', media: 'cover' },
    prepare: ({ title, subtitle, media }) => ({
      title: title ?? 'Без названия',
      subtitle: SECTIONS.find((s) => s.value === subtitle)?.title ?? subtitle,
      media,
    }),
  },

  orderings: [
    {
      name: 'sectionThenOrder',
      title: 'По разделу и порядку',
      by: [
        { field: 'section', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
    { name: 'yearDesc', title: 'Сначала новые', by: [{ field: 'year', direction: 'desc' }] },
  ],
});
