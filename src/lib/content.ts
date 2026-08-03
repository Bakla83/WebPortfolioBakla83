import { PROJECTS as LOCAL_PROJECTS } from '../data/projects';
import { fetchProjectsFromSanity, sanityConfigured } from './sanity';
import type { Project, SectionSlug } from '../data/types';

/**
 * Единая точка доступа к контенту для всех страниц.
 *
 * Пока Sanity не подключена (нет SANITY_PROJECT_ID), сайт живёт на локальных
 * данных из src/data/projects.ts. Как только переменная появится, содержимое
 * начнёт приходить из CMS — править страницы для этого не нужно.
 *
 * Если CMS настроена, но недоступна во время сборки, берутся локальные
 * данные: лучше собрать сайт с прошлым содержимым, чем уронить деплой.
 */

let cache: Project[] | null = null;

export async function getProjects(): Promise<Project[]> {
  // Сборка обходит десятки страниц — запрос должен уйти один раз
  if (cache) return cache;

  const fromCms = sanityConfigured ? await fetchProjectsFromSanity() : null;
  cache = fromCms ?? LOCAL_PROJECTS;
  return cache;
}

export async function getProjectsInSection(section: SectionSlug | string): Promise<Project[]> {
  const projects = await getProjects();
  return projects
    .filter((project) => project.section === section)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects
    .filter((project) => project.featured)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}
