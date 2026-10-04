import { getLocale, getTranslations } from "next-intl/server";
import { DotsMerge } from "@/components/final/DotsMerge";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { countryOptions } from "@/lib/countries";
import { SECTION_IDS } from "@/lib/site";

/** #join: the two dots merge into the logo, then the full sign-up form. */
export async function FinalCta() {
  const t = await getTranslations("final");
  const locale = await getLocale();

  return (
    <section id={SECTION_IDS.join} aria-labelledby="join-title" className="py-[72px] lg:py-[120px]">
      <div className="container-site">
        <div className="rounded-[32px] border border-border bg-card px-5 py-12 sm:px-10 lg:px-16 lg:py-16">
          <DotsMerge world={t("world")} syria={t("syria")} />
          <div className="reveal mx-auto mt-6 max-w-[620px] text-center">
            <h2
              id="join-title"
              className="text-h2 font-extrabold tracking-[-0.01em] text-balance text-text"
            >
              {t("title")}
            </h2>
            <p className="mt-3 text-[17px] text-text-2 md:text-[19px]">{t("lead")}</p>
          </div>
          <div className="reveal mx-auto mt-10 max-w-[620px]">
            <WaitlistForm variant="stacked" countries={countryOptions(locale)} />
          </div>
        </div>
      </div>
    </section>
  );
}
