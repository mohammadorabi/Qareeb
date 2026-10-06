import { routing, type Locale } from "@/i18n/routing";

/** Every indexable page, as a path after the locale prefix ("" is the home page). */
export const PAGES = ["", "/privacy", "/terms"] as const;
export type PagePath = (typeof PAGES)[number];

/** hreflang map for a page: one entry per locale, plus x-default (Arabic, the default). */
export function languageAlternates(path: PagePath) {
  return {
    ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`])),
    "x-default": `/${routing.defaultLocale}${path}`,
  };
}

/** Open Graph locale per language. */
export const OG_LOCALE: Record<Locale, string> = { ar: "ar_SY", en: "en_GB", de: "de_DE" };
