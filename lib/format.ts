import type { Locale } from "@/i18n/routing";

/**
 * Number/currency formatting with Western digits in both languages.
 *
 * Call these on the SERVER and pass the resulting strings to client
 * components: Node's and the browser's ICU data can differ slightly, which
 * would cause hydration mismatches if formatting ran during a client render.
 */
const tag = (locale: Locale) => (locale === "ar" ? "ar-u-nu-latn" : "en");

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
