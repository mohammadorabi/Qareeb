"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { dirOf, LANGUAGES, routing } from "@/i18n/routing";
import { CheckIcon, GlobeIcon } from "@/components/ui/icons";
import {
  currentSection,
  rememberSectionForLocaleSwitch,
} from "@/components/layout/LocaleSwitchScroll";

type Props = {
  className?: string;
  /** Extra classes for the trigger button (e.g. a taller tap target). */
  buttonClassName?: string;
  /** Where the card opens, relative to the button (it opens upward in the footer). */
  menuClassName?: string;
};

/**
 * Language picker: a menu button (WAI-ARIA APG pattern). Each option links to
 * the same page in that language, plus the #section being read unless the
 * reader is still at the top, and is written in its own language and script.
 * Scrolling on arrival is done by <LocaleSwitchScroll>, not by Next.
 */
export function LocalePicker({
  className,
  buttonClassName,
  menuClassName = "top-full end-0 mt-2",
}: Props) {
  const t = useTranslations("locale");
  const locale = useLocale();
  const pathname = usePathname();
  const menuId = useId();
  const [open, setOpen] = useState(false);
  // The section being read when the menu opened ("" at the top).
  const [section, setSection] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const focusOnOpen = useRef(0);

  const current = routing.locales.indexOf(locale);
  const last = routing.locales.length - 1;

  function openMenu(focusIndex: number) {
    setSection(currentSection());
    focusOnOpen.current = focusIndex;
    setOpen(true);
  }

  function close(returnFocus = false) {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    itemRefs.current[focusOnOpen.current]?.focus();
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function onButtonKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openMenu(e.key === "ArrowDown" ? 0 : last);
    }
  }

  function onMenuKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const at = itemRefs.current.indexOf(document.activeElement as HTMLAnchorElement);
    const focus = (i: number) => itemRefs.current[(i + last + 1) % (last + 1)]?.focus();
    switch (e.key) {
      case "ArrowDown":
        focus(at + 1);
        break;
      case "ArrowUp":
        focus(at - 1);
        break;
      case "Home":
        focus(0);
        break;
      case "End":
        focus(last);
        break;
      case "Escape":
        close(true);
        break;
      case " ":
        (document.activeElement as HTMLElement | null)?.click();
        break;
      case "Tab":
        close();
        return;
      default:
        return;
    }
    e.preventDefault();
  }

  return (
    <div ref={rootRef} className={`relative ${className ?? ""}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`${t("label")}: ${LANGUAGES[locale].name}`}
        onClick={() => (open ? close() : openMenu(current))}
        onKeyDown={onButtonKeyDown}
        className={`inline-flex h-10 items-center gap-1.5 rounded-pill border border-border bg-card px-3.5 text-sm font-medium text-text transition-colors hover:border-text-2 ${buttonClassName ?? ""}`}
      >
        <GlobeIcon className="size-[18px] text-text-2" />
        {/* The Arabic font draws ع low in its box: lift it to the globe's center. */}
        <span
          className={locale === "ar" ? "-translate-y-[3px] text-[15px] leading-none" : "font-en"}
        >
          {LANGUAGES[locale].short}
        </span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t("label")}
          onKeyDown={onMenuKeyDown}
          className={`absolute z-50 min-w-[184px] rounded-btn border border-border bg-card p-1.5 shadow-[0_12px_32px_-8px_rgb(31_29_27/0.18),0_2px_6px_rgb(31_29_27/0.06)] motion-safe:animate-[fade-in_150ms_ease-out] ${menuClassName}`}
        >
          {routing.locales.map((l, i) => {
            const selected = l === locale;
            return (
              <Link
                key={l}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                role="menuitemradio"
                aria-checked={selected}
                tabIndex={-1}
                href={section ? { pathname, hash: section } : pathname}
                locale={l}
                scroll={false}
                hrefLang={l}
                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                  if (selected) e.preventDefault();
                  else rememberSectionForLocaleSwitch(section);
                  close(selected);
                }}
                className="flex items-center justify-between gap-6 rounded-[10px] px-3 py-2.5 text-[15px] font-medium text-text outline-none hover:bg-bg focus-visible:bg-bg focus-visible:outline-2 focus-visible:-outline-offset-2"
              >
                <span
                  lang={l}
                  dir={dirOf(l)}
                  className={l === "ar" ? "font-ar text-[16px]" : "font-en"}
                >
                  {LANGUAGES[l].name}
                </span>
                <CheckIcon
                  className={`size-[18px] shrink-0 text-orange-dark ${selected ? "" : "invisible"}`}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
