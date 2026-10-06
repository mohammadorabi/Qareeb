import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { languageAlternates, PAGES } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const absolute = (path: string) => `${SITE_URL}${path}`;

/** Every page in every language, each listing its translations (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((page) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(page)).map(([lang, path]) => [lang, absolute(path)]),
    );
    return routing.locales.map((locale) => ({
      url: absolute(`/${locale}${page}`),
      changeFrequency: "monthly" as const,
      priority: page === "" ? 1 : 0.3,
      alternates: { languages },
    }));
  });
}
