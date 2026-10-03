import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { LocaleToggle } from "@/components/ui/LocaleToggle";
import { CONTACT_EMAIL } from "@/lib/site";

export async function Footer() {
  const t = await getTranslations("footer");
  const locale = await getLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="container-site flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <Logo locale={locale} />
          <p className="text-text-2">{t("tagline")}</p>
          <p className="font-mono text-xs text-muted">{t("rights", { year })}</p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <nav aria-label={t("legalNav")}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-2">
              <li>
                <Link href="/privacy" className="hover:text-text">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-text">
                  {t("terms")}
                </Link>
              </li>
              <li>
                <span className="text-muted">{t("contact")}: </span>
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono hover:text-text" dir="ltr">
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </nav>
          <LocaleToggle />
        </div>
      </div>
    </footer>
  );
}
