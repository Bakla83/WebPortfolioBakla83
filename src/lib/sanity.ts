import type { Project } from '../data/types';

const PROJECT_ID = import.meta.env.SANITY_PROJECT_ID;
const DATASET = import.meta.env.SANITY_DATASET ?? 'production';
const API_VERSION = '2024-10-01';

export const sanityConfigured = Boolean(PROJECT_ID);

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
  "demo": demo{ src, ratio, maxWidth, note },
  "videos": videos[]{ provider, "id": videoId, title },
  "models": models[]{ "src": file.asset->url, "poster": poster.asset->url, alt },
  "links": links[]{ kind, url, label }
}`;

export async function fetchProjectsFromSanity(): Promise<Project[] | null> {
  if (!PROJECT_ID) return null;

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

    const projects = (body.result as Project[]).filter(
      (project) => Boolean(project?.slug) && Boolean(project?.section),
    );

    return projects.length > 0 ? projects : null;
  } catch (error) {
    console.warn('[sanity] запрос не удался, беру локальные данные:', error);
    return null;
  }
}
