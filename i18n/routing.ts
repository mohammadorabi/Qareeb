import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "always",
  // No NEXT_LOCALE cookie: keeps the site cookieless (no consent banner needed).
  // `/` is still negotiated from Accept-Language by the proxy.
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];

export const dirOf = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");
