import { getTranslations } from "next-intl/server";
import { DistanceMap } from "@/components/hero/DistanceMap";
import { HeroGlow } from "@/components/hero/HeroGlow";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";

const CHIPS = ["superSecure", "applePay", "arabicFirst"] as const;

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <HeroGlow className="relative isolate overflow-x-clip">
      <section
        aria-labelledby="hero-title"
        className="container-site grid items-center gap-x-12 gap-y-10 pt-8 pb-16 lg:min-h-[calc(100svh-var(--nav-h))] lg:grid-cols-[1.1fr_1fr] lg:py-10"
      >
        <div className="flex max-w-[620px] flex-col">
          <p className="eyebrow">{t("eyebrow")}</p>

          <h1
            id="hero-title"
            className="mt-5 text-[clamp(44px,6vw,76px)] leading-[1.15] font-extrabold tracking-[-0.01em] text-text"
          >
            {t("titleLead")}{" "}
            <span className="whitespace-nowrap text-orange-dark">
              {t("titleAccent")}
              <span className="sr-only">.</span>
              {/* The logo's center dot stands in for the full stop. */}
              <span
                aria-hidden="true"
                className="hero-dot ms-[0.06em] inline-block size-[0.2em] rounded-pill bg-orange align-baseline"
              />
            </span>
          </h1>

          <p className="mt-5 max-w-[34ch] text-[18px] leading-[1.7] text-text-2 md:text-[20px]">
            {t("subtitle")}
          </p>

          <div className="mt-8">
            <WaitlistForm variant="inline" />
          </div>

          <ul aria-label={t("chipsLabel")} className="mt-7 flex flex-wrap gap-2">
            {CHIPS.map((key) => (
              <li
                key={key}
                className="inline-flex items-center gap-2 rounded-pill border border-border bg-card px-3.5 py-1.5 text-[14px] font-medium text-text-2"
              >
                <span aria-hidden="true" className="size-1.5 rounded-pill bg-orange" />
                {t(`chips.${key}`)}
              </li>
            ))}
          </ul>
        </div>

        <DistanceMap />
      </section>
    </HeroGlow>
  );
}
