import { locale as rootLocale } from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { messages } from "./messages";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale: explicit }) => {
  // An explicit locale (e.g. getTranslations({ locale })) wins; otherwise read
  // the [locale] root segment. Unknown values fall back to the default.
  const requested = explicit ?? (await rootLocale());
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return { locale, messages: messages[locale] };
});
