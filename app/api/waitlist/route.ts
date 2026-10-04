import { countryNameEn } from "@/lib/countries";
import { allowRequest } from "@/lib/waitlist/rate-limit";
import { waitlistSchema, type WaitlistField } from "@/lib/waitlist/schema";
import { sendToWorkiom } from "@/lib/waitlist/workiom";

/** Minimum time between rendering the form and submitting it (bots are faster). */
const MIN_FILL_MS = 3000;

const json = (body: unknown, status = 200) => Response.json(body, { status });
// Every accepted submission — and every silently dropped bot — gets this same reply.
const success = () => json({ ok: true });

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

/** POST /api/waitlist — validates a sign-up and forwards it to Workiom. */
export async function POST(request: Request) {
  if (!allowRequest(clientIp(request))) {
    return json({ ok: false, error: "rate_limited" }, 429);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "invalid" }, 400);
  }

  // Honeypot filled: pretend success, send nothing.
  if (payload && typeof payload === "object" && "company" in payload && payload.company) {
    return success();
  }

  const parsed = waitlistSchema.safeParse(payload);
  if (!parsed.success) {
    const fields: Partial<Record<WaitlistField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as WaitlistField;
      fields[field] ??= issue.message;
    }
    return json({ ok: false, error: "invalid", fields }, 400);
  }

  const data = parsed.data;
  // Submitted too fast: treat as a bot, silently.
  if (data.elapsedMs < MIN_FILL_MS) return success();

  const sent = await sendToWorkiom({
    name: data.name,
    email: data.email,
    phone: data.phone,
    country: countryNameEn(data.country),
  });
  return sent ? success() : json({ ok: false, error: "server" }, 502);
}
