import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { resolveLocale } from "@/i18n/resolveLocale";
import { LegalPage } from "@/components/layout/LegalPage";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: t("privacy.title"),
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: { ar: "/ar/privacy", en: "/en/privacy" },
    },
  };
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  await resolveLocale(params);
  return <LegalPage kind="privacy" />;
}
