import { getTranslations } from "next-intl/server";
import { BankIcon } from "@/components/ui/icons";

type Brand = {
  key: "visa" | "mastercard" | "applePay" | "googlePay";
  /** Official acceptance mark in public/payments/ (unmodified), and its width at 28px tall. */
  mark?: { src: string; width: number };
};

// Visa and Mastercard artwork is only available from their brand centers
// (account + license terms). Add each file to public/payments/ with its `mark`
// here, and the whole row switches to marks.
const BRANDS: Brand[] = [
  { key: "visa" },
  { key: "mastercard" },
  { key: "applePay", mark: { src: "/payments/apple-pay-mark.svg", width: 44 } }, // 165.5 × 106
  { key: "googlePay", mark: { src: "/payments/google-pay-mark.svg", width: 41 } }, // 1094 × 742
];

// Apple and Google allow their marks only when the other payment brands are
// shown the same way; otherwise each brand is named in text. So it's all marks
// or all text, never a mix.
const SHOW_MARKS = BRANDS.every((b) => b.mark);

const BADGE_H = 28;
const frame =
  "inline-flex h-7 items-center rounded-[8px] border border-border bg-white px-2.5 text-[12.5px] leading-none font-bold whitespace-nowrap text-text";

/**
 * Accepted payment methods in one row (wraps on small screens). The even 8px
 * gap covers the marks' clear space (Apple: ¼ of the mark's height; Google:
 * ½ the height of its "G").
 */
export async function PaymentBadges({ className }: { className?: string }) {
  const t = await getTranslations("trust");
  return (
    <ul
      aria-label={t("payments.label")}
      dir="ltr"
      className={`flex flex-wrap items-center gap-2 rtl:justify-end ${className ?? ""}`}
    >
      {BRANDS.map(({ key, mark }) =>
        SHOW_MARKS && mark ? (
          <li key={key} className="inline-flex">
            {/* Shown exactly as supplied: each mark has its own white background and outline. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mark.src}
              alt={t(`payments.${key}`)}
              width={mark.width}
              height={BADGE_H}
              className="block h-7 w-auto"
            />
          </li>
        ) : (
          <li key={key} className={frame}>
            {t(`payments.${key}`)}
          </li>
        ),
      )}
      <li className={`${frame} max-w-full gap-1.5 font-semibold`}>
        <BankIcon className="size-4 text-text-2" />
        <bdi>{t("payments.bank")}</bdi>
      </li>
    </ul>
  );
}
