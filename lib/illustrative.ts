import type { Locale } from "@/i18n/routing";
import { formatMoney } from "@/lib/format";

/**
 * The one illustrative number on the site: an example amount in Syrian
 * pounds, used by the phone story and the receipt. Exchange rates, fees and
 * totals are never shown — they render as "—". Every place that shows this
 * is labeled «مثال توضيحي» / "Example".
 */
export const EXAMPLE_SYP = 25000;

/** Placeholder for values we never show (rate, fee, totals). */
export const NOT_SHOWN = "—";

/** Formatted example amount. Call on the server (see lib/format.ts). */
export const exampleSyp = (locale: Locale) => formatMoney(EXAMPLE_SYP, "SYP", locale);
