import type { ReactNode } from "react";
import { SECTION_IDS } from "@/lib/site";
import { ArrowIcon } from "@/components/ui/icons";
import { SectionLink } from "@/components/ui/SectionLink";

/** Text link to the sign-up form (#join). Every section should lead here. */
export function JoinLink({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <SectionLink
      section={SECTION_IDS.join}
      className={`group inline-flex items-center gap-2 rounded-md text-[16px] font-semibold text-orange-ink underline decoration-orange/30 decoration-2 underline-offset-[6px] transition-colors hover:text-orange-dark hover:decoration-orange-dark ${className ?? ""}`}
    >
      {children}
      <ArrowIcon className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
    </SectionLink>
  );
}
