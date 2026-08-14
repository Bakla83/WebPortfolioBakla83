export const ALL_LOCALES = ['ru', 'en', 'fr', 'es'] as const;
export type Locale = (typeof ALL_LOCALES)[number];

export const ENABLED_LOCALES = ['ru', 'en'] as const satisfies readonly Locale[];
export type EnabledLocale = (typeof ENABLED_LOCALES)[number];

export const DEFAULT_LOCALE = 'ru' as const satisfies EnabledLocale;
export type DefaultLocale = typeof DEFAULT_LOCALE;

export const LOCALE_META: Record<Locale, { label: string; native: string; htmlLang: string }> = {
  ru: { label: 'RU', native: 'Русский', htmlLang: 'ru' },
  en: { label: 'EN', native: 'English', htmlLang: 'en' },
  fr: { label: 'FR', native: 'Français', htmlLang: 'fr' },
  es: { label: 'ES', native: 'Español', htmlLang: 'es' },
};

export function isEnabledLocale(value: string): value is EnabledLocale {
  return (ENABLED_LOCALES as readonly string[]).includes(value);
}

export type Localized<T> = Record<DefaultLocale, T> & Partial<Record<Locale, T>>;

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value[DEFAULT_LOCALE];
}

export function localePath(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}
