type LogoMarkProps = {
  className?: string;
  /** Accessible name; omit when the mark is decorative next to a text label. */
  title?: string;
};

/**
 * The qareeb mark, redrawn from public/qareeb-mark.png as vector geometry
 * so the "two dots merge" animation can land exactly on the center dot.
 */
export function LogoMark({ className, title }: LogoMarkProps) {
  return (
    <svg
      viewBox="196 124 684 744"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <circle cx="512" cy="440" r="246" fill="none" stroke="var(--orange)" strokeWidth="112" />
      <circle cx="512" cy="440" r="72" fill="var(--orange)" />
      <line
        x1="676"
        y1="603"
        x2="808"
        y2="798"
        stroke="var(--text)"
        strokeWidth="112"
        strokeLinecap="round"
      />
    </svg>
  );
}

type LogoProps = {
  locale: string;
  className?: string;
  /** Hide the wordmark on very narrow screens (the mark stays). */
  compact?: boolean;
};

/** Mark + bilingual wordmark ("qareeb · قريب"), primary script first. */
export function Logo({ locale, className, compact }: LogoProps) {
  const primary = locale === "ar" ? "قريب" : "qareeb";
  const secondary = locale === "ar" ? "qareeb" : "قريب";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className="h-8 w-auto shrink-0" />
      <span
        className={`flex items-baseline gap-1.5 leading-none ${compact ? "max-[399px]:hidden" : ""}`}
      >
        <span className="text-[22px] font-bold tracking-tight text-text">{primary}</span>
        <span className="hidden font-mono text-[11px] text-muted sm:inline" aria-hidden="true">
          · {secondary}
        </span>
      </span>
    </span>
  );
}
