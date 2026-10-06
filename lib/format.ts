import type { Locale } from "@/i18n/routing";

/**
 * Number/currency formatting with Western digits in every language, in the
 * locale's own style (German: "25.000 SYP", "8,57 €").
 *
 * Call these on the SERVER and pass the resulting strings to client
 * components: Node's and the browser's ICU data can differ slightly, which
 * would cause hydration mismatches if formatting ran during a client render.
 */
const TAGS: Record<Locale, string> = { ar: "ar-u-nu-latn", en: "en", de: "de" };
const tag = (locale: Locale) => TAGS[locale];

export function formatMoney(value: number, currency: string, locale: Locale): string {
  const whole = currency === "SYP";
  return new Intl.NumberFormat(tag(locale), {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(value);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(tag(locale)).format(value);
}
