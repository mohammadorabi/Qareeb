import type { WaitlistInput, WaitlistSubmitError } from "@/lib/waitlist/schema";

export type SubmitResult = { ok: true } | { ok: false; error: WaitlistSubmitError };

/** The only place the form talks to the backend (POST /api/waitlist). */
export async function submitWaitlist(payload: WaitlistInput): Promise<SubmitResult> {
  let res: Response;
  try {
    res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, error: "network" };
  }
  if (res.ok) return { ok: true };
  return { ok: false, error: res.status === 429 ? "rate_limited" : "server" };
}
