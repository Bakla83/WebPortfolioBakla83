import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

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

    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
