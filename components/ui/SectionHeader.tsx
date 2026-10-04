import type { ReactNode } from "react";

type Props = {
  /** id for the <h2>; pass it to the section's aria-labelledby. */
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "start" | "center";
  className?: string;
};

/** Shared section heading: mono eyebrow with the brand dot, H2, optional lead. */
export function SectionHeader({ id, eyebrow, title, lead, align = "start", className }: Props) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-[720px] ${className ?? ""}`}>
      <p
        className={`flex items-center gap-2 eyebrow text-orange-ink ${centered ? "justify-center" : ""}`}
      >
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-pill bg-orange" />
        {eyebrow}
      </p>
      <h2 id={id} className="mt-4 text-h2 font-extrabold tracking-[-0.01em] text-balance text-text">
        {title}
      </h2>
      {lead && (
        <p
          className={`mt-4 max-w-[52ch] text-[17px] leading-[1.75] text-pretty text-text-2 md:text-[19px] ${centered ? "mx-auto" : ""}`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
