import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

/**
 * Настройки админки.
 *
 * projectId берётся из переменной окружения, чтобы идентификатор не был
 * прибит гвоздями в коде. Задайте его в studio/.env:
 *
 *   SANITY_STUDIO_PROJECT_ID=ваш_id
 *
 * Идентификатор — не секрет (он и так виден в запросах с сайта), но держать
 * его в одном месте удобнее, чем править конфиг.
 */
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';

if (!projectId) {
  throw new Error(
    'Не задан SANITY_STUDIO_PROJECT_ID. Создайте studio/.env и впишите туда идентификатор проекта Sanity.',
  );
}

export default defineConfig({
  name: 'portfolio',
  title: 'Портфолио — Владислав Баклан',

  projectId,
  dataset,

  plugins: [
    structureTool(),
    // Vision — консоль для GROQ-запросов. Полезна, когда нужно проверить,
    // что именно отдаёт CMS сайту.
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
