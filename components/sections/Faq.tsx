import { getTranslations } from "next-intl/server";
import { Accordion } from "@/components/faq/Accordion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SECTION_IDS } from "@/lib/site";

/** #faq: short, honest answers. */
export async function Faq() {
  const t = await getTranslations("faq");

  return (
    <section id={SECTION_IDS.faq} aria-labelledby="faq-title" className="py-[72px] lg:py-[120px]">
      <div className="container-site grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--nav-h)+40px)] lg:self-start">
          <SectionHeader id="faq-title" eyebrow={t("eyebrow")} title={t("title")} />
        </div>
        <Accordion items={t.raw("items") as { q: string; a: string }[]} />
      </div>
    </section>
  );
}
