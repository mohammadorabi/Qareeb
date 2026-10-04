import { getLocale, getTranslations } from "next-intl/server";
import { LogoMark } from "@/components/brand/Logo";
import { LoveNote } from "@/components/receipt/LoveNote";
import { CheckIcon, ClockIcon, RefundIcon } from "@/components/ui/icons";
import { JoinLink } from "@/components/ui/JoinLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { exampleSyp, NOT_SHOWN } from "@/lib/illustrative";
import { SECTION_IDS } from "@/lib/site";

const POINT_ICONS = [CheckIcon, ClockIcon, RefundIcon];

/** #transparency: the fee breakdown as a torn paper receipt — a love note. */
export async function Receipt() {
  const t = await getTranslations("receipt");
  const locale = await getLocale();
  const rows = t.raw("paper.rows") as string[];
  const points = t.raw("points") as { title: string; body: string }[];
  const cities = t.raw("cities") as string[];
  // Only the SYP amount is an example value; rate, fee and totals stay "—".
  const values = [exampleSyp(locale), NOT_SHOWN, NOT_SHOWN, NOT_SHOWN, NOT_SHOWN];

  return (
    <section
      id={SECTION_IDS.transparency}
      aria-labelledby="transparency-title"
      className="py-[72px] lg:py-[120px]"
    >
      <div className="container-site grid items-center gap-14 lg:grid-cols-[1fr_auto] lg:gap-20">
        <div>
          <SectionHeader id="transparency-title" eyebrow={t("eyebrow")} title={t("title")} />
          <ul className="mt-10 flex flex-col gap-6">
            {points.map((p, i) => {
              const Icon = POINT_ICONS[i];
              return (
                <li key={p.title} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-pill bg-orange-soft text-orange-ink">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-[19px] font-bold text-text">{p.title}</h3>
                    <p className="mt-1 max-w-[46ch] text-[16px] leading-relaxed text-text-2">
                      {p.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <JoinLink className="mt-10">{t("join")}</JoinLink>
        </div>

        {/* Shadow lives on the wrapper: the mask would clip a box-shadow. */}
        <figure className="mx-auto w-full max-w-[400px] -rotate-2 drop-shadow-[0_18px_28px_rgb(31_29_27/0.14)]">
          <div className="print-in bg-card px-7 pt-10 pb-11 font-mono paper-torn sm:px-9">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 font-body text-[18px] font-extrabold text-text">
                <LogoMark className="h-6 w-auto" />
                {t("paper.brand")}
              </span>
              <span className="rounded-pill bg-mustard/35 px-2.5 py-1 font-body text-[12px] font-bold text-text">
                {t("paper.example")}
              </span>
            </div>
            <p className="mt-5 border-b border-dashed border-text/20 pb-3 font-body text-[13px] font-semibold text-text-2">
              {t("paper.heading")}
            </p>
            <dl className="mt-1 text-[14px]">
              {rows.map((label, i) => {
                const total = i === rows.length - 1;
                return (
                  <div
                    key={label}
                    className={`flex items-baseline justify-between gap-4 py-2.5 ${
                      total ? "mt-2 border-t-2 border-dashed border-text/25 pt-4 font-bold" : ""
                    }`}
                  >
                    <dt
                      className={`font-body text-[14.5px] ${total ? "text-text" : "text-text-2"}`}
                    >
                      {label}
                    </dt>
                    <dd className="shrink-0 text-text">
                      <bdi>{values[i]}</bdi>
                    </dd>
                  </div>
                );
              })}
            </dl>
            <p className="mt-4 font-body text-[12.5px] leading-relaxed text-muted">
              {t("paper.note")}
            </p>
            <div className="mt-7 border-t border-dashed border-text/20 pt-6">
              <LoveNote template={t.raw("love") as string} cities={cities} />
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
