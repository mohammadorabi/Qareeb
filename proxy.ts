import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

/** Primary languages a browser accepts, e.g. "de-AT,fr;q=0.8" → ["de", "fr"] (q=0 = refused). */
function acceptedLanguages(header: string) {
  return header
    .split(",")
    .map((part) => part.trim().split(";"))
    .filter(([tag, ...params]) => tag && !params.some((p) => /^\s*q=0(\.0*)?\s*$/.test(p)))
    .map(([tag]) => tag.split("-")[0].toLowerCase());
}

/**
 * Locale negotiation for unprefixed paths ("/", "/privacy"…): Arabic and
 * German browsers get their language, every other language gets English.
 * With no Accept-Language header at all, next-intl falls back to the default
 * locale (Arabic).
 */
export default function proxy(request: NextRequest) {
  const header = request.headers.get("accept-language");
  if (header) {
    const supported = new Set<string>(routing.locales);
    const languages = acceptedLanguages(header);
    if (languages.length > 0 && !languages.some((l) => supported.has(l))) {
      const headers = new Headers(request.headers);
      headers.set("accept-language", "en");
      return handleI18n(new NextRequest(request, { headers }));
    }
  }
  return handleI18n(request);
}

export const config = {
  // Everything except API routes, Next internals, and files with an extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
