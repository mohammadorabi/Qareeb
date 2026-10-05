import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { dirOf, routing } from "@/i18n/routing";
import { resolveLocale } from "@/i18n/resolveLocale";
import { fontVariables } from "@/lib/fonts";
import { CONTACT_EMAIL, INSTAGRAM, SITE_URL } from "@/lib/site";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/layout/MotionProvider";
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
      languages: { ar: "/ar", en: "/en", "x-default": "/ar" },
    },
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      title: t("title"),
      description: t("description"),
      locale: locale === "ar" ? "ar_SY" : "en_GB",
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
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
    sameAs: [INSTAGRAM.url],
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
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
