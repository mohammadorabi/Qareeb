import { getTranslations } from "next-intl/server";
import { CalendarShapes, GiftShapes } from "@/components/next/Illustrations";
import { JoinLink } from "@/components/ui/JoinLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SECTION_IDS } from "@/lib/site";

const TILES = [
  { key: "gifts", tint: "bg-rose", Art: GiftShapes },
  { key: "occasions", tint: "bg-lilac", Art: CalendarShapes },
] as const;

/** #next: what's coming after launch — gifts and occasions. */
export async function ComingNext() {
  const t = await getTranslations("next");

  return (
    <section id={SECTION_IDS.next} aria-labelledby="next-title" className="py-[72px] lg:py-[120px]">
      <div className="container-site">
        <SectionHeader id="next-title" eyebrow={t("eyebrow")} title={t("title")} />
        <ul className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-2 lg:gap-5">
          {TILES.map(({ key, tint, Art }) => (
            <li
              key={key}
              className={`relative flex min-h-[340px] flex-col overflow-hidden rounded-card p-7 sm:p-9 ${tint}`}
            >
              <span className="w-fit rounded-pill bg-mustard px-3 py-1 text-[13px] font-bold text-text">
                {t("soon")}
              </span>
              <h3 className="mt-5 text-[clamp(26px,3vw,36px)] leading-tight font-extrabold text-text">
                {t(`${key}.name`)}
              </h3>
              <p className="mt-2 max-w-[30ch] text-[16px] leading-relaxed text-text/80">
                {t(`${key}.line`)}
              </p>
              <div className="pointer-events-none ms-auto mt-6 w-[min(240px,62%)] sm:absolute sm:end-6 sm:bottom-4 sm:mt-0 sm:w-[220px]">
                <Art />
              </div>
            </li>
          ))}
        </ul>
        <JoinLink className="mt-10">{t("join")}</JoinLink>
      </div>
    </section>
  );
}
