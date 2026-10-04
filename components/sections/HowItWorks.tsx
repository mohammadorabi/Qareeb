import { getLocale, getTranslations } from "next-intl/server";
import { Problem } from "@/components/problem/Problem";
import { PhoneStory } from "@/components/phone/PhoneStory";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { exampleSyp } from "@/lib/illustrative";
import { SECTION_IDS } from "@/lib/site";

/** #how-it-works: the empathy opener, then the sticky phone story. */
export async function HowItWorks() {
  const t = await getTranslations("how");
  const locale = await getLocale();

  return (
    <section id={SECTION_IDS.how} aria-labelledby="how-title" className="py-[72px] lg:py-[120px]">
      <Problem />
      <div className="container-site mt-[72px] lg:mt-[120px]">
        <SectionHeader id="how-title" eyebrow={t("eyebrow")} title={t("title")} />
      </div>
      <div className="mt-10 lg:mt-0">
        <PhoneStory syp={exampleSyp(locale)} />
      </div>
    </section>
  );
}
