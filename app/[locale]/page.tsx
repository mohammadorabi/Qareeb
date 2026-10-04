import { resolveLocale } from "@/i18n/resolveLocale";
import { ComingNext } from "@/components/sections/ComingNext";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Receipt } from "@/components/sections/Receipt";
import { Services } from "@/components/sections/Services";
import { Trust } from "@/components/sections/Trust";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  await resolveLocale(params);

  return (
    <>
      <Hero />
      <HowItWorks />
      <Services />
      <Receipt />
      <Trust />
      <ComingNext />
      <Faq />
      <FinalCta />
    </>
  );
}
