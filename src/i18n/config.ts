/**
 * Языки сайта.
 *
 * ALL_LOCALES — всё, подо что заложена структура.
 * ENABLED_LOCALES — то, что реально собирается и попадает в переключатель.
 *
 * Чтобы включить французский или испанский: дописать перевод в src/i18n/ui.ts
 * и перенести код языка из PLANNED в ENABLED. Маршруты, hreflang, sitemap
 * и переключатель подхватят его сами — больше править нечего.
 */
export const ALL_LOCALES = ['ru', 'en', 'fr', 'es'] as const;
export type Locale = (typeof ALL_LOCALES)[number];

export const ENABLED_LOCALES = ['ru', 'en'] as const satisfies readonly Locale[];
export type EnabledLocale = (typeof ENABLED_LOCALES)[number];

// `as const satisfies` вместо аннотации типом: аннотация расширила бы 'ru'
// до всего союза EnabledLocale, и тогда Localized<T> перестал бы гарантировать,
// что язык по умолчанию заполнен — pick() начал бы возвращать T | undefined.
export const DEFAULT_LOCALE = 'ru' as const satisfies EnabledLocale;
export type DefaultLocale = typeof DEFAULT_LOCALE;

/** Подписи для переключателя языка и атрибута lang. */
export const LOCALE_META: Record<Locale, { label: string; native: string; htmlLang: string }> = {
  ru: { label: 'RU', native: 'Русский', htmlLang: 'ru' },
  en: { label: 'EN', native: 'English', htmlLang: 'en' },
  fr: { label: 'FR', native: 'Français', htmlLang: 'fr' },
  es: { label: 'ES', native: 'Español', htmlLang: 'es' },
};

export function isEnabledLocale(value: string): value is EnabledLocale {
  return (ENABLED_LOCALES as readonly string[]).includes(value);
}

/**
 * Значение, у которого может быть свой вариант на каждом языке.
 * Обязателен только язык по умолчанию — он же служит фолбэком,
 * поэтому непереведённая карточка показывает русский текст,
 * а не пустое место.
 */
export type Localized<T> = Record<DefaultLocale, T> & Partial<Record<Locale, T>>;

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value[DEFAULT_LOCALE];
}

/** /ru/projects/salt-run — все ссылки строятся только через неё. */
export function localePath(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}
