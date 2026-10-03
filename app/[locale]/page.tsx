import { resolveLocale } from "@/i18n/resolveLocale";
import { Hero } from "@/components/sections/Hero";
import { SECTION_IDS } from "@/lib/site";

const UPCOMING = [
  SECTION_IDS.how,
  SECTION_IDS.services,
  SECTION_IDS.trust,
  SECTION_IDS.faq,
  SECTION_IDS.join,
];

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  await resolveLocale(params);

  return (
    <>
      <Hero />
      {/* Anchors for sections arriving in Phase 4 (kept so nav links resolve). */}
      {UPCOMING.map((id) => (
        <div key={id} id={id} />
      ))}
    </>
  );
}
