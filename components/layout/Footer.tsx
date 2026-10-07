import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { LocalePicker } from "@/components/ui/LocalePicker";
import { FacebookIcon, InstagramIcon } from "@/components/ui/icons";
import { CONTACT_EMAIL, FACEBOOK, INSTAGRAM } from "@/lib/site";

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
          <p className={`text-xs text-muted ${locale === "ar" ? "" : "font-mono"}`}>
            {t("rights", { year })}
          </p>
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
              <li className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <a
                  href={INSTAGRAM.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("instagramLabel")}
                  className="inline-flex items-center gap-1.5 hover:text-text"
                >
                  <InstagramIcon className="size-[18px]" />
                  <span dir="ltr">{INSTAGRAM.handle}</span>
                </a>
                <a
                  href={FACEBOOK.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("facebookLabel")}
                  className="inline-flex items-center gap-1.5 hover:text-text"
                >
                  <FacebookIcon className="size-[18px]" />
                  <span dir="ltr">Facebook</span>
                </a>
              </li>
            </ul>
          </nav>
          <LocalePicker menuClassName="bottom-full start-0 mb-2 md:start-auto md:end-0" />
        </div>
      </div>
    </footer>
  );
}
