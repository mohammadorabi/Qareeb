"use client";

import { useEffect, useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { LocaleToggle } from "@/components/ui/LocaleToggle";
import { buttonClass } from "@/components/ui/Button";
import { SECTION_IDS } from "@/lib/site";

const LINKS = [
  { key: "how", id: SECTION_IDS.how },
  { key: "services", id: SECTION_IDS.services },
  { key: "trust", id: SECTION_IDS.trust },
  { key: "faq", id: SECTION_IDS.faq },
] as const;

export function Nav() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open
          ? "border-b border-border bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-site flex h-(--nav-h) items-center justify-between gap-4">
        <Link href="/" aria-label={tc("homeLabel")} className="rounded-lg">
          <Logo locale={locale} />
        </Link>

        <nav aria-label={t("label")} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {LINKS.map(({ key, id }) => (
              <li key={key}>
                <Link
                  href={`/#${id}`}
                  className="rounded-pill px-3.5 py-2 text-[15px] font-medium text-text-2 transition-colors hover:text-text"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LocaleToggle className="hidden sm:inline-flex" />
          <Link
            href={`/#${SECTION_IDS.join}`}
            className={buttonClass("primary", "md", "max-sm:px-4")}
          >
            <span className="hidden sm:inline">{t("cta")}</span>
            <span className="sm:hidden">{t("ctaShort")}</span>
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-pill border border-border bg-card lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? t("menuClose") : t("menuOpen")}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
              {open ? (
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h14M3 14h14"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div id={menuId} hidden={!open} className="border-t border-border lg:hidden">
        <nav aria-label={t("label")} className="container-site py-3">
          <ul className="flex flex-col">
            {LINKS.map(({ key, id }) => (
              <li key={key}>
                <Link
                  href={`/#${id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg py-3 text-lg font-medium text-text"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
          <LocaleToggle className="mt-2 sm:hidden" />
        </nav>
      </div>
    </header>
  );
}
