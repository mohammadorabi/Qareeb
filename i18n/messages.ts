import arBase from "@/messages/ar.json";
import enBase from "@/messages/en.json";
import faqAr from "@/messages/sections/faq/ar.json";
import faqEn from "@/messages/sections/faq/en.json";
import finalAr from "@/messages/sections/final/ar.json";
import finalEn from "@/messages/sections/final/en.json";
import howAr from "@/messages/sections/how/ar.json";
import howEn from "@/messages/sections/how/en.json";
import nextAr from "@/messages/sections/next/ar.json";
import nextEn from "@/messages/sections/next/en.json";
import problemAr from "@/messages/sections/problem/ar.json";
import problemEn from "@/messages/sections/problem/en.json";
import receiptAr from "@/messages/sections/receipt/ar.json";
import receiptEn from "@/messages/sections/receipt/en.json";
import servicesAr from "@/messages/sections/services/ar.json";
import servicesEn from "@/messages/sections/services/en.json";
import statementAr from "@/messages/sections/statement/ar.json";
import statementEn from "@/messages/sections/statement/en.json";
import trustAr from "@/messages/sections/trust/ar.json";
import trustEn from "@/messages/sections/trust/en.json";
import type { Locale } from "./routing";

/**
 * Messages = shared base file + one namespace file per page section
 * (messages/sections/<namespace>/<locale>.json). Arabic is the source of
 * truth for the shape; English must match it (checked by tsc here and by
 * `npm run check:i18n`).
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

export const messages: Record<Locale, Messages> = { ar, en };
