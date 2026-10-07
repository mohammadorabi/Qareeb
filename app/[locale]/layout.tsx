import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { dirOf, routing } from "@/i18n/routing";
import { resolveLocale } from "@/i18n/resolveLocale";
import { fontVariables } from "@/lib/fonts";
import { languageAlternates, OG_LOCALE } from "@/lib/seo";
import { CONTACT_EMAIL, FACEBOOK, INSTAGRAM, SITE_URL } from "@/lib/site";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { LocaleSwitchScroll } from "@/components/layout/LocaleSwitchScroll";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#FAF6F1",
  colorScheme: "light",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s · ${t("siteName")}` },
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: languageAlternates(""),
    },
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      title: t("title"),
      description: t("description"),
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      url: `/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("common");
  const tm = await getTranslations("meta");

  const organizationId = `${SITE_URL}/#organization`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: "Qareeb",
        alternateName: "قريب",
        url: `${SITE_URL}/${locale}`,
        logo: `${SITE_URL}/qareeb-mark.png`,
        description: tm("description"),
        email: CONTACT_EMAIL,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: CONTACT_EMAIL,
        },
        sameAs: [INSTAGRAM.url, FACEBOOK.url],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/${locale}#website`,
        name: "Qareeb",
        url: `${SITE_URL}/${locale}`,
        inLanguage: locale,
        publisher: { "@id": organizationId },
      },
    ],
  };

  return (
    <html lang={locale} dir={dirOf(locale)} className={fontVariables}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-btn focus:bg-card focus:px-4 focus:py-2 focus:shadow"
        >
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider>
          <MotionProvider>
            <Nav />
            <main id="main">{children}</main>
            <Footer />
            <LocaleSwitchScroll />
          </MotionProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
