import { PROJECTS as LOCAL_PROJECTS } from '../data/projects';
import { fetchProjectsFromSanity, sanityConfigured } from './sanity';
import type { Project, SectionSlug } from '../data/types';

let cache: Project[] | null = null;

export async function getProjects(): Promise<Project[]> {

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
