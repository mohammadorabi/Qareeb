import "server-only";

/** Exactly what the Workiom webhook receives — nothing more. */
export type WorkiomRecord = {
  name: string;
  email: string;
  /** E.164, e.g. "+491234567890". */
  phone: string;
  /** English country name, e.g. "Germany". */
  country: string;
  /** Page language the visitor signed up from, e.g. "German". */
  language: string;
};

const TIMEOUT_MS = 8000;

/**
 * POSTs one sign-up to the Workiom webhook (WORKIOM_WEBHOOK_URL, server-only).
 * Retries once on a network error only — not on timeouts or HTTP errors, where
 * Workiom may already have saved the row. Never logs the URL or personal data.
 */
export async function sendToWorkiom(record: WorkiomRecord): Promise<boolean> {
  const url = process.env.WORKIOM_WEBHOOK_URL;
  if (!url) {
    console.error("[waitlist] WORKIOM_WEBHOOK_URL is not set");
    return false;
  }
  const body = JSON.stringify({
    name: record.name,
    email: record.email,
    phone: record.phone,
    country: record.country,
    language: record.language,
  });

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      });
      if (res.ok) return true;
      console.error(`[waitlist] Workiom responded ${res.status}`);
      return false;
    } catch (err) {
      const timedOut = err instanceof DOMException && err.name === "TimeoutError";
      console.error(`[waitlist] Workiom request failed (${timedOut ? "timeout" : "network"})`);
      if (timedOut) return false;
    }
  }
  return false;
}
