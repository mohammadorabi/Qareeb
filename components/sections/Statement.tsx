import { getTranslations } from "next-intl/server";
import { StatementReveal } from "@/components/statement/StatementReveal";
import { SECTION_IDS } from "@/lib/site";

/** #why: the pitch in three lines, between the hero and the story. Not in the nav. */
export async function Statement() {
  const t = await getTranslations("statement");

  return (
    <section id={SECTION_IDS.why} className="py-[96px] lg:py-[160px]">
      <div className="container-site">
        <StatementReveal paragraphs={t.raw("paragraphs") as string[]} closing={t("closing")} />
      </div>
    </section>
  );
}
