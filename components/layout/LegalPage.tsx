import { Fragment } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CONTACT_EMAIL } from "@/lib/site";

type Section = { h: string; p: string[]; items?: string[]; after?: string[] };

/** Plain text with the contact email turned into a mailto link. */
function WithEmail({ text }: { text: string }) {
  const parts = text.split(CONTACT_EMAIL);
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && (
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          dir="ltr"
          className="font-medium text-orange-ink underline decoration-orange/30 underline-offset-4 hover:decoration-orange-ink"
        >
          {CONTACT_EMAIL}
        </a>
      )}
    </Fragment>
  ));
}

export async function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const t = await getTranslations("legal");
  const sections = t.raw(`${kind}.sections`) as Section[];

  return (
    <article className="container-site max-w-[760px] py-14 md:py-20">
      <Link href="/" className="text-sm text-text-2 hover:text-text">
        <span aria-hidden="true" className="inline-block rtl:-scale-x-100">
          ←
        </span>{" "}
        {t("back")}
      </Link>

      <header className="mt-8 border-b border-border pb-8">
        <h1 className="text-h2 font-extrabold tracking-[-0.01em] text-text">
          {t(`${kind}.title`)}
        </h1>
        <p className="mt-3 text-[15px] text-muted">{t("lastUpdated")}</p>
      </header>

      <div className="mt-10 flex flex-col gap-10">
        {sections.map((s, i) => (
          <section key={s.h} aria-labelledby={`${kind}-${i}`}>
            <h2 id={`${kind}-${i}`} className="text-[22px] leading-snug font-bold text-text">
              {s.h}
            </h2>
            <div className="mt-3 flex max-w-[68ch] flex-col gap-3 text-[16.5px] leading-[1.8] text-text-2">
              {s.p.map((p) => (
                <p key={p}>
                  <WithEmail text={p} />
                </p>
              ))}
              {s.items && (
                <ul className="flex flex-col gap-1.5 ps-1">
                  {s.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.75em] size-1.5 shrink-0 rounded-pill bg-orange"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {s.after?.map((p) => (
                <p key={p}>
                  <WithEmail text={p} />
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
