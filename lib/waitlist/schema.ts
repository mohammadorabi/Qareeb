import { z } from "zod";

/**
 * Shared by the client form and (Phase 5) the API route.
 * Error messages are i18n keys under `waitlist.errors`.
 */
export const waitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { error: "email_required" })
    .max(254, { error: "email_invalid" })
    .pipe(z.email({ error: "email_invalid" })),
  consent: z.literal(true, { error: "consent_required" }),
  country: z.string().length(2).optional(),
  locale: z.enum(["ar", "en"]),
  /** Honeypot: must stay empty. */
  company: z.string().max(0).optional(),
  /** Epoch ms when the form was rendered, for the minimum time-on-page check. */
  startedAt: z.number().int().positive(),
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
  referrer: z.string().max(500).optional(),
});

export type WaitlistInput = z.input<typeof waitlistSchema>;

export type WaitlistFieldError = "email_required" | "email_invalid" | "consent_required";
export type WaitlistSubmitError = "network" | "rate_limited" | "server";
