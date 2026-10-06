import "server-only";
import { createHash } from "node:crypto";

const LIMIT = 100;
const WINDOW_MS = 60 * 60 * 1000;

// Best effort: per server instance, reset on restart. Keys are hashed IPs.
const hits = new Map<string, number[]>();

/** Records a request; false once this IP has made more than 100 in the last hour. */
export function allowRequest(ip: string, now = Date.now()): boolean {
  const key = createHash("sha256").update(ip).digest("hex");
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // Keep the map small: drop IPs with no requests in the window.
  if (hits.size > 10_000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length <= LIMIT;
}
