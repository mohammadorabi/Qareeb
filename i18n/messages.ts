import arBase from "@/messages/ar.json";
import deBase from "@/messages/de.json";
import enBase from "@/messages/en.json";
import faqAr from "@/messages/sections/faq/ar.json";
import faqDe from "@/messages/sections/faq/de.json";
import faqEn from "@/messages/sections/faq/en.json";
import finalAr from "@/messages/sections/final/ar.json";
import finalDe from "@/messages/sections/final/de.json";
import finalEn from "@/messages/sections/final/en.json";
import howAr from "@/messages/sections/how/ar.json";
import howDe from "@/messages/sections/how/de.json";
import howEn from "@/messages/sections/how/en.json";
import nextAr from "@/messages/sections/next/ar.json";
import nextDe from "@/messages/sections/next/de.json";
import nextEn from "@/messages/sections/next/en.json";
import problemAr from "@/messages/sections/problem/ar.json";
import problemDe from "@/messages/sections/problem/de.json";
import problemEn from "@/messages/sections/problem/en.json";
import receiptAr from "@/messages/sections/receipt/ar.json";
import receiptDe from "@/messages/sections/receipt/de.json";
import receiptEn from "@/messages/sections/receipt/en.json";
import servicesAr from "@/messages/sections/services/ar.json";
import servicesDe from "@/messages/sections/services/de.json";
import servicesEn from "@/messages/sections/services/en.json";
import statementAr from "@/messages/sections/statement/ar.json";
import statementDe from "@/messages/sections/statement/de.json";
import statementEn from "@/messages/sections/statement/en.json";
import trustAr from "@/messages/sections/trust/ar.json";
import trustDe from "@/messages/sections/trust/de.json";
import trustEn from "@/messages/sections/trust/en.json";
import type { Locale } from "./routing";

/**
 * Messages = shared base file + one namespace file per page section
 * (messages/sections/<namespace>/<locale>.json). Arabic is the source of
 * truth for the shape; English and German must match it (checked by tsc here
 * and by `npm run check:i18n`).
 */
const ar = {
  ...arBase,
  statement: statementAr,
  problem: problemAr,
  how: howAr,
  services: servicesAr,
  receipt: receiptAr,
  trust: trustAr,
  next: nextAr,
  faq: faqAr,
  final: finalAr,
};

export type Messages = typeof ar;

const en: Messages = {
  ...enBase,
  statement: statementEn,
  problem: problemEn,
  how: howEn,
  services: servicesEn,
  receipt: receiptEn,
  trust: trustEn,
  next: nextEn,
  faq: faqEn,
  final: finalEn,
};

// German (messages/de.json, messages/sections/*/de.json) was written without a
// native speaker: have a native German speaker review it before launch.
const de: Messages = {
  ...deBase,
  statement: statementDe,
  problem: problemDe,
  how: howDe,
  services: servicesDe,
  receipt: receiptDe,
  trust: trustDe,
  next: nextDe,
  faq: faqDe,
  final: finalDe,
};

export const messages: Record<Locale, Messages> = { ar, en, de };
