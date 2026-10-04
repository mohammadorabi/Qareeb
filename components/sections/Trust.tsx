import { getTranslations } from "next-intl/server";
import { CardIcon, CardOffIcon, LockIcon, ShieldCheckIcon } from "@/components/ui/icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SECTION_IDS } from "@/lib/site";

// Order matches messages: super secure · Stripe · card not stored · GDPR.
const ICONS = [ShieldCheckIcon, CardIcon, CardOffIcon, LockIcon];

/** #trust: four plain-language trust points. Text only — no company logos. */
export async function Trust() {
  const t = await getTranslations("trust");
  const cards = t.raw("cards") as { title: string; body: string }[];

  return (
    <section
      id={SECTION_IDS.trust}
      aria-labelledby="trust-title"
      className="py-[72px] lg:py-[120px]"
    >
      <div className="container-site">
        <SectionHeader id="trust-title" eyebrow={t("eyebrow")} title={t("title")} />
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-16 lg:grid-cols-4 lg:gap-5">
          {cards.map((card, i) => {
            const Icon = ICONS[i];
            return (
              <li
                key={card.title}
                className="reveal flex flex-col gap-4 rounded-card border border-border bg-card p-5 sm:p-6"
              >
                <span className="grid size-12 place-items-center rounded-pill bg-orange-soft text-orange-ink">
                  <Icon className="size-6" />
                </span>
                <div>
                  <h3 className="text-[17px] leading-snug font-bold text-text sm:text-[19px]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-text-2 sm:text-[15.5px]">
                    {card.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
