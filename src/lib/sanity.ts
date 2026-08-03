import type { Project } from '../data/types';

/**
 * Чтение контента из Sanity.
 *
 * Клиентская библиотека @sanity/client намеренно не ставится: нужен ровно
 * один GET-запрос за сборку, и обычного fetch для него достаточно. Меньше
 * зависимостей — меньше того, что придётся обновлять из-за уязвимостей.
 *
 * Токен здесь не используется и не нужен: датасет публичный и читается
 * анонимно. Права на запись есть только у вас в Студии — сайт же собирается
 * из данных, которые и так открыты всем посетителям.
 */

const PROJECT_ID = import.meta.env.SANITY_PROJECT_ID;
const DATASET = import.meta.env.SANITY_DATASET ?? 'production';
const API_VERSION = '2024-10-01';

export const sanityConfigured = Boolean(PROJECT_ID);

/**
 * `!(_id in path("drafts.**"))` отсекает черновики: без этого на сайт
 * попадали бы недописанные карточки, которые вы ещё правите в Студии.
 */
const PROJECTS_QUERY = `
*[_type == "project" && !(_id in path("drafts.**"))] | order(coalesce(order, 999) asc) {
  "slug": slug.current,
  section,
  title,
  teaser,
  summary,
  highlights,
  tech,
  year,
  role,
  status,
  featured,
  order,
  "cover": cover{
    "src": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    alt,
    caption
  },
  "gallery": gallery[]{
    "src": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    alt,
    caption
  },
  "videos": videos[]{ provider, "id": videoId, title },
  "models": models[]{ "src": file.asset->url, "poster": poster.asset->url, alt },
  "links": links[]{ kind, url, label }
}`;

/**
 * Возвращает проекты из Sanity либо null, если CMS не настроена или
 * недоступна. Решение о запасном варианте принимает вызывающая сторона
 * (src/lib/content.ts) — здесь мы только читаем.
 */
export async function fetchProjectsFromSanity(): Promise<Project[] | null> {
  if (!PROJECT_ID) return null;

  // apicdn — кэширующий узел Sanity: быстрее и не тратит лимит API.
  const url =
    `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}` +
    `?query=${encodeURIComponent(PROJECTS_QUERY)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`[sanity] ответ ${response.status}, беру локальные данные`);
      return null;
    }

    const body = (await response.json()) as { result?: unknown };
    if (!Array.isArray(body.result)) return null;

    // Карточка без slug или раздела сломала бы генерацию маршрутов —
    // такие пропускаем, а не роняем всю сборку из-за одной опечатки.
    const projects = (body.result as Project[]).filter(
      (project) => Boolean(project?.slug) && Boolean(project?.section),
    );

    return projects.length > 0 ? projects : null;
  } catch (error) {
    console.warn('[sanity] запрос не удался, беру локальные данные:', error);
    return null;
  }
}
