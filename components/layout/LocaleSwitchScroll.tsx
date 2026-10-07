"use client";

import { useLayoutEffect } from "react";
import { useLocale } from "next-intl";

/**
 * Where to land after a language switch: a section id, or "" for the top.
 * Module state survives the client-side navigation between locales.
 */
let pending: string | null = null;

/**
 * The home-page section the reader is in: the one containing a point 30% down
 * the viewport. Anywhere in the hero (or on pages without sections) is "top".
 */
export function currentSection(): string {
  const main = document.getElementById("main");
  const hero = main?.firstElementChild;
  if (!main || !hero || window.scrollY < hero.getBoundingClientRect().height - 100) return "";
  const probe = window.innerHeight * 0.3;
  const hit = Array.from(main.querySelectorAll<HTMLElement>("section[id]")).find((s) => {
    const r = s.getBoundingClientRect();
    return r.top <= probe && r.bottom > probe;
  });
  return hit?.id ?? "";
}

/** Called by the language picker just before it navigates. */
export function rememberSectionForLocaleSwitch(section: string) {
  pending = section;
}

/**
 * Restores the reader's place after a language switch. The picker's links opt
 * out of Next's own scrolling, which on this page smooth-scrolled through every
 * section (fragment scrollIntoView under `scroll-behavior: smooth`) and landed
 * on #why. Here we jump once, instantly, after fonts have settled the layout.
 */
export function LocaleSwitchScroll() {
  const locale = useLocale();

  useLayoutEffect(() => {
    if (pending === null) return;
    const section = pending;
    pending = null;
    if (!section) window.scrollTo({ top: 0, behavior: "instant" });

    document.fonts.ready.then(() =>
      requestAnimationFrame(() => {
        const target = section ? document.getElementById(section) : null;
        if (!target) {
          window.scrollTo({ top: 0, behavior: "instant" });
          return;
        }
        const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
        const top = window.scrollY + target.getBoundingClientRect().top - (padding || 0);
        window.scrollTo({ top, behavior: "instant" });
      }),
    );
  }, [locale]);

  return null;
}
