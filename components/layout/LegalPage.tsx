import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Section = { h: string; p: string };

export async function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const t = await getTranslations("legal");
  const sections = t.raw(`${kind}.sections`) as Section[];

  return (
    <article className="container-site max-w-3xl py-16 md:py-24">
      <Link href="/" className="text-sm text-text-2 hover:text-text">
        <span aria-hidden="true" className="inline-block rtl:-scale-x-100">
          ←
        </span>{" "}
        {t("back")}
      </Link>
      <h1 className="mt-6 text-h2 font-bold">{t(`${kind}.title`)}</h1>
      <p
        role="note"
        className="mt-6 rounded-card border border-mustard bg-sand/50 px-5 py-4 text-sm text-text"
      >
        {t("placeholderNotice")}
      </p>
      <div className="mt-10 flex flex-col gap-8">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-xl font-semibold">{s.h}</h2>
            <p className="mt-2 text-text-2">{s.p}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
