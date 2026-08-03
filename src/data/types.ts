import type { Localized } from '../i18n/config';

export type SectionSlug =
  | 'landings'
  | 'websites'
  | 'web-games'
  | 'pc-games'
  | 'mobile-apps'
  | 'models-3d';

/** Акцентный цвет раздела — из палитры золото / фиолетовый / зелёный. */
export type Accent = 'gold' | 'purple' | 'green';

export interface Section {
  slug: SectionSlug;
  title: Localized<string>;
  description: Localized<string>;
  accent: Accent;
  /** Порядок в меню и на главной. */
  order: number;
}

export interface ProjectImage {
  /** Путь в /public (например /media/salt-run/cover.png) или URL на cdn.sanity.io. */
  src: string;
  alt: Localized<string>;
  caption?: Localized<string>;
  width?: number;
  height?: number;
}

export interface ProjectVideo {
  provider: 'youtube' | 'vimeo';
  /** Идентификатор ролика, не полная ссылка. */
  id: string;
  title: Localized<string>;
}

export interface ProjectModel {
  /** .glb или .gltf — .blend браузер не открывает, его нужно экспортировать. */
  src: string;
  poster?: string;
  alt: Localized<string>;
}

export type LinkKind = 'live' | 'source' | 'steam' | 'download' | 'other';

export interface ProjectLink {
  kind: LinkKind;
  url: string;
  /** Если не задано — берётся стандартная подпись для этого типа ссылки. */
  label?: Localized<string>;
}

export interface Project {
  slug: string;
  section: SectionSlug;
  title: Localized<string>;
  /** Короткий текст, всплывающий при наведении на карточку. Одна-две строки. */
  teaser: Localized<string>;
  /** Вводный абзац на странице проекта. */
  summary: Localized<string>;
  /** Маркированный список особенностей. */
  highlights?: Localized<string[]>;
  tech: string[];
  year: number;
  role?: Localized<string>;
  status?: Localized<string>;
  cover?: ProjectImage;
  gallery?: ProjectImage[];
  videos?: ProjectVideo[];
  models?: ProjectModel[];
  links?: ProjectLink[];
  /** Попадает в блок «Избранное» на главной. */
  featured?: boolean;
  /** Меньше — выше в списке раздела. */
  order?: number;
}
