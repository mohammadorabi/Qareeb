import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { z } from "zod";
import { isResidenceCountry } from "@/lib/countries";

/**
 * Shared by the client form and the API route (POST /api/waitlist).
 * Error messages are i18n keys under `waitlist.errors`.
 */

// Letters and combining marks (harakat) of the Arabic or Latin scripts.
const NAME_LETTER = /^(?=[\p{L}\p{M}])[\p{Script=Arabic}\p{Script=Latin}\p{M}]$/u;
// Allowed between letters: spaces, hyphens, apostrophes, dots (e.g. "Abd-Allah", "O’Neil").
const NAME_SEPARATOR = /^[\s'’.-]$/u;

const isNameText = (v: string) =>
  [...v].every((ch) => NAME_LETTER.test(ch) || NAME_SEPARATOR.test(ch));

export const waitlistSchema = z.object({
  name: z
    .string()
    .trim()
    .transform((v) => v.replace(/\s+/g, " "))
    .pipe(
      z
        .string()
        .min(1, { error: "name_required" })
        .min(2, { error: "name_full" })
        .max(80, { error: "name_too_long" })
        .refine(isNameText, { error: "name_invalid", abort: true })
        .refine((v) => v.split(" ").filter((w) => /[\p{L}]/u.test(w)).length >= 2, {
          error: "name_full",
        }),
    ),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { error: "email_required" })
    .max(254, { error: "email_invalid" })
    .pipe(z.email({ error: "email_invalid" })),
  /** ISO 3166-1 alpha-2, e.g. "DE". */
  country: z
    .string()
    .min(1, { error: "country_required" })
    .refine(isResidenceCountry, { error: "country_required" }),
  /** Normalized to E.164, e.g. "+491234567890". */
  phone: z
    .string()
    .trim()
    .min(1, { error: "phone_required" })
    .refine((v) => isValidPhoneNumber(v), { error: "phone_invalid" })
    .transform((v) => parsePhoneNumber(v).number),
  consent: z.literal(true, { error: "consent_required" }),
  locale: z.enum(["ar", "en"]),
  /** Honeypot: must stay empty. */
  company: z.string().max(0).optional(),
  /** Ms between rendering the form and submitting it (minimum time-on-page check). */
  elapsedMs: z.number().int().nonnegative(),
});

export type WaitlistInput = z.input<typeof waitlistSchema>;
export type WaitlistData = z.output<typeof waitlistSchema>;

/** Visible fields, in on-screen order (first invalid one gets focus). */
export const WAITLIST_FIELDS = ["name", "email", "country", "phone", "consent"] as const;
export type WaitlistField = (typeof WAITLIST_FIELDS)[number];

export type WaitlistFieldError =
  | "name_required"
  | "name_invalid"
  | "name_full"
  | "name_too_long"
  | "email_required"
  | "email_invalid"
  | "country_required"
  | "phone_required"
  | "phone_invalid"
  | "consent_required";
export type WaitlistSubmitError = "network" | "rate_limited" | "server";
