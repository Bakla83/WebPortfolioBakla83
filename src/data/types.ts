import type { Localized } from '../i18n/config';

export type SectionSlug =
  | 'landings'
  | 'websites'
  | 'web-games'
  | 'pc-games'
  | 'mobile-apps'
  | 'models-3d';

export type Accent = 'gold' | 'purple' | 'green';

export interface Section {
  slug: SectionSlug;
  title: Localized<string>;
  description: Localized<string>;
  accent: Accent;

  order: number;
}

export interface ProjectImage {

  src: string;
  alt: Localized<string>;
  caption?: Localized<string>;
  width?: number;
  height?: number;
}

export interface ProjectVideo {
  provider: 'youtube' | 'vimeo';

  id: string;
  title: Localized<string>;
}

export interface ProjectModel {

  src: string;
  poster?: string;
  alt: Localized<string>;
}

export interface ProjectDemo {

  src: string;

  ratio?: string;

  maxWidth?: string;

  note?: Localized<string>;
}

export type LinkKind = 'live' | 'source' | 'steam' | 'download' | 'other';

export interface ProjectLink {
  kind: LinkKind;
  url: string;

  label?: Localized<string>;
}

export interface Project {
  slug: string;
  section: SectionSlug;
  title: Localized<string>;

  teaser: Localized<string>;

  summary: Localized<string>;

  highlights?: Localized<string[]>;
  tech: string[];
  year: number;
  role?: Localized<string>;
  status?: Localized<string>;
  cover?: ProjectImage;
  gallery?: ProjectImage[];
  videos?: ProjectVideo[];
  models?: ProjectModel[];

  demo?: ProjectDemo;
  links?: ProjectLink[];

  featured?: boolean;

  order?: number;
}
