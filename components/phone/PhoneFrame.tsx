import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

/**
 * iPhone 15/16 Pro-style device in pure CSS and SVG (no images), its screen
 * proportional to 393×852pt. Size it with `--phone-w`, the outer width (e.g.
 * `[--phone-w:296px]`): frame, Dynamic Island, status bar, home indicator and
 * the zoom of the app screen all follow. Styles: `.phone*` in globals.css.
 * Purely illustrative (aria-hidden); the step text next to it carries the content.
 */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div aria-hidden="true" className={`phone ${className ?? ""}`}>
      <div className="phone-button phone-button-action" />
      <div className="phone-button phone-button-volume-up" />
      <div className="phone-button phone-button-volume-down" />
      <div className="phone-button phone-button-side" />
      <div className="phone-bezel">
        <div className="phone-screen">
          <div className="phone-ui">{children}</div>
          <StatusBar />
          <div className="phone-island" />
          <div className="phone-home" />
        </div>
      </div>
    </div>
  );
}

/**
 * iOS status bar, centered on the Dynamic Island. Mirrored in Arabic like iOS
 * (time on the right, icons on the left); the glyphs themselves don't flip.
 */
function StatusBar() {
  const t = useTranslations("how");
  return (
    <div className="phone-status">
      <span dir="ltr">{t("phone.time")}</span>
      <span className="phone-status-icons">
        {/* Cellular: four bars, full signal. */}
        <svg viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="7.5" width="3" height="4.5" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        {/* Wi-Fi: two arcs and a wedge, fanning out from one point. */}
        <svg viewBox="0 0 17 12" fill="currentColor" stroke="currentColor">
          <path
            d="M1.85 4.55A9.4 9.4 0 0 1 15.15 4.55"
            fill="none"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M4.33 7.03A5.9 5.9 0 0 1 12.67 7.03"
            fill="none"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M8.5 11.2 6.38 9.08A3 3 0 0 1 10.62 9.08Z"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
        {/* Battery: outline with a 1pt gap around an 80% charge, and the nub. */}
        <svg viewBox="0 0 27.5 12" fill="currentColor">
          <rect
            x="0.5"
            y="0.5"
            width="24"
            height="11"
            rx="3.5"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.35"
          />
          <rect x="2" y="2" width="16.8" height="8" rx="2" />
          <rect x="26" y="4" width="1.5" height="4" rx="0.75" fillOpacity="0.4" />
        </svg>
      </span>
    </div>
  );
}
