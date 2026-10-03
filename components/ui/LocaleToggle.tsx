"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function LocaleToggle({ className }: { className?: string }) {
  const t = useTranslations("locale");
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "ar" ? "en" : "ar";

  return (
    <Link
      href={pathname}
      locale={other}
      hrefLang={other}
      lang={other}
      aria-label={t("switchLabel")}
      className={`inline-flex h-10 items-center rounded-pill border border-border bg-card px-3.5 text-sm font-medium text-text transition-colors hover:border-text-2 ${className ?? ""}`}
    >
      {t("switchTo")}
    </Link>
  );
}
