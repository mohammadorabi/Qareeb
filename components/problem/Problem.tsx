import { getTranslations } from "next-intl/server";
import { ProblemLines } from "@/components/problem/ProblemLines";

/** Empathy opener of #how-it-works: short lines that warm up on scroll. */
export async function Problem() {
  const t = await getTranslations("problem");

  return (
    <div className="container-site">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h2 className="mt-4 text-h2 font-extrabold tracking-[-0.01em] text-text">{t("title")}</h2>
      <ProblemLines lines={t.raw("lines") as string[]} />
    </div>
  );
}
