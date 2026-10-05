"use client";

import type { ComponentProps, MouseEvent } from "react";
import { Link } from "@/i18n/navigation";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  /** id of a home-page section, e.g. "join". */
  section: string;
};

/**
 * Link to a home-page section. On the home page it scrolls there itself:
 * a router <Link> to the hash the URL already has (e.g. clicking "Join" twice)
 * is a no-op and wouldn't scroll. Elsewhere (privacy, terms) it navigates to
 * /{locale}#section as usual. Smoothness and the sticky-nav offset come from
 * the CSS on <html> (scroll-behavior, scroll-padding-top), so reduced motion
 * is respected.
 */
export function SectionLink({ section, onClick, ...props }: Props) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    const target = document.getElementById(section);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ block: "start" });
    if (window.location.hash !== `#${section}`) {
      window.history.pushState(window.history.state, "", `#${section}`);
    }
  }

  return <Link href={`/#${section}`} onClick={handleClick} {...props} />;
}
