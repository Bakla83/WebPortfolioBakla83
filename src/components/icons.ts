export type IconName =
  | 'sun'
  | 'moon'
  | 'menu'
  | 'close'
  | 'arrow-right'
  | 'arrow-up'
  | 'external'
  | 'github'
  | 'telegram'
  | 'instagram'
  | 'linkedin'
  | 'fiverr'
  | 'steam'
  | 'mail'
  | 'code'
  | 'download';

export const ICON_PATHS: Record<IconName, string> = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'arrow-up': '<path d="M12 19V5M6 11l6-6 6 6"/>',
  external:
    '<path d="M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
  github:
    '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.7A5.2 5.2 0 0 0 19.9 5a4.9 4.9 0 0 0-.1-3.6s-1.1-.3-3.7 1.4a12.7 12.7 0 0 0-6.6 0C6.9 1.1 5.8 1.4 5.8 1.4A4.9 4.9 0 0 0 5.7 5a5.2 5.2 0 0 0-1.4 3.6c0 5.2 3.2 6.4 6.2 6.7a3.4 3.4 0 0 0-.9 2.6V22"/>',
  telegram:
    '<path d="M21.5 3.5 2.8 10.7c-1 .4-1 1.8.1 2.1l4.6 1.4 1.8 5.4c.3.9 1.4 1.1 2 .4l2.5-2.6 4.6 3.4c.8.6 1.9.1 2.1-.8l3-14.4c.2-1-.8-1.8-1.7-1.4z"/><path d="M7.5 14.2 18.8 6.4"/>',
  instagram:
    '<rect x="2" y="2" width="20" height="20" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none"/>',
  linkedin:
    '<rect x="2" y="2" width="20" height="20" rx="3"/><path d="M7 10v7M7 7v.01M11.5 17v-4a2.5 2.5 0 0 1 5 0v4"/>',
  fiverr: '<path d="M4 9h9M8.5 9V7.2A2.2 2.2 0 0 1 10.7 5h1.8M8.5 9v9M13 9h7v9M17 5h3"/>',
  steam:
    '<circle cx="12" cy="12" r="10"/><circle cx="15.5" cy="9" r="2.6"/><path d="M2.5 15.5 8 17.7"/><circle cx="9.4" cy="18.2" r="2.4"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2.5"/><path d="m3 6.5 9 6 9-6"/>',
  code: '<path d="m8 6-6 6 6 6M16 6l6 6-6 6"/>',
  download: '<path d="M12 3v12M7 11l5 5 5-5M4 20h16"/>',
};
