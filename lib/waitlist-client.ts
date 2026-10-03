import type { WaitlistInput, WaitlistSubmitError } from "@/lib/waitlist/schema";

export type SubmitResult = { ok: true } | { ok: false; error: WaitlistSubmitError };

/**
 * The only place the form talks to the backend.
 * PHASE 3 STUB: no network call — resolves as success after 800ms.
 * Phase 5 replaces this body with `fetch("/api/waitlist", …)`.
 */
export async function submitWaitlist(payload: WaitlistInput): Promise<SubmitResult> {
  void payload;
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { ok: true };
}
