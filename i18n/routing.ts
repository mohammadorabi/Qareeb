import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en", "de"],
  defaultLocale: "ar",
  localePrefix: "always",
  // No NEXT_LOCALE cookie: keeps the site cookieless (no consent banner needed).
  // `/` is still negotiated from Accept-Language by the proxy.
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];

export const dirOf = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

/** Each language as it names itself (the language picker never translates these). */
export const LANGUAGES: Record<Locale, { name: string; short: string }> = {
  ar: { name: "العربية", short: "ع" },
  en: { name: "English", short: "EN" },
  de: { name: "Deutsch", short: "DE" },
};
