import type { Locale } from "@/i18n/routing";

/** Top diaspora countries, shown first in this order. */
// prettier-ignore
const TOP = [
  "DE", "TR", "AE", "SA", "LB", "JO", "EG", "SE", "NL", "QA", "KW", "AT", "FR", "GB", "CA", "US",
] as const;

/**
 * Current ISO 3166-1 countries and territories where people live. Syria is
 * excluded (the audience lives outside it), as are retired/reserved codes and
 * uninhabited territories.
 */
// prettier-ignore
const ALL = [
  "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA",
  "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT",
  "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR",
  "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH",
  "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH",
  "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GT", "GU", "GW", "GY", "HK", "HN", "HR", "HT", "HU",
  "ID", "IE", "IL", "IM", "IN", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH",
  "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT",
  "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP",
  "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI",
  "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN",
  "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE",
  "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SZ", "TC",
  "TD", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG",
  "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA",
  "ZM", "ZW",
] as const;

const RESIDENCE = new Set<string>(ALL);

/** True for a valid country-of-residence ISO code (Syria excluded). */
export const isResidenceCountry = (code: string) => RESIDENCE.has(code);

const englishNames = new Intl.DisplayNames(["en"], { type: "region" });

/** English country name for an ISO code, e.g. "DE" → "Germany" (sent to Workiom). */
export const countryNameEn = (code: string) => englishNames.of(code) ?? code;

/** Shorter everyday names where the standard ones are long. */
const OVERRIDES: Partial<Record<Locale, Record<string, string>>> = {
  ar: { AE: "الإمارات", SA: "السعودية" },
};

export type Country = { code: string; name: string };
export type CountryOptions = { top: Country[]; rest: Country[] };

/**
 * Localized country options: top diaspora countries first, then the rest
 * alphabetically. Call on the SERVER and pass the result to the form
 * (Intl data can differ between Node and browsers).
 */
export function countryOptions(locale: Locale): CountryOptions {
  const names = new Intl.DisplayNames([locale], { type: "region" });
  const name = (code: string) => OVERRIDES[locale]?.[code] ?? names.of(code) ?? code;
  const top = TOP.map((code) => ({ code, name: name(code) }));
  const topSet = new Set<string>(TOP);
  const collator = new Intl.Collator(locale);
  const rest = ALL.filter((c) => !topSet.has(c))
    .map((code) => ({ code, name: name(code) }))
    .sort((a, b) => collator.compare(a.name, b.name));
  return { top, rest };
}
