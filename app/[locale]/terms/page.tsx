import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { resolveLocale } from "@/i18n/resolveLocale";
import { LegalPage } from "@/components/layout/LegalPage";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/terms">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: t("terms.title"),
    alternates: {
      canonical: `/${locale}/terms`,
      languages: { ar: "/ar/terms", en: "/en/terms" },
    },
  };
}

export default async function TermsPage({ params }: PageProps<"/[locale]/terms">) {
  await resolveLocale(params);
  return <LegalPage kind="terms" />;
}
