import { getTranslations } from "next-intl/server";
import { BankIcon } from "@/components/ui/icons";

// Official acceptance marks, unmodified (public/payments/). Each file already
// has its own white background and outline, so it isn't framed again.
const MARKS = [
  { key: "applePay", src: "/payments/apple-pay-mark.svg", width: 44 }, // 165.5 × 106
  { key: "googlePay", src: "/payments/google-pay-mark.svg", width: 41 }, // 1094 × 742
] as const;

const BADGE_H = 28;
const frame =
  "inline-flex h-7 items-center rounded-[8px] border border-border bg-white px-2.5 text-[12.5px] leading-none font-bold whitespace-nowrap text-text";

/**
 * Accepted payment methods, one row (wraps on small screens). Visa and
 * Mastercard are text badges: we don't have their official artwork, and we
 * don't draw lookalike logos.
 */
export async function PaymentBadges({ className }: { className?: string }) {
  const t = await getTranslations("trust");
  return (
    <ul
      aria-label={t("payments.label")}
      dir="ltr"
      className={`flex flex-wrap items-center gap-1.5 rtl:justify-end ${className ?? ""}`}
    >
      <li className={frame}>{t("payments.visa")}</li>
      <li className={frame}>{t("payments.mastercard")}</li>
      {MARKS.map((m) => (
        <li key={m.key} className="inline-flex">
          {/* Plain <img>: tiny static SVGs, shown exactly as supplied. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.src}
            alt={t(`payments.${m.key}`)}
            width={m.width}
            height={BADGE_H}
            className="block h-7 w-auto"
          />
        </li>
      ))}
      <li className={`${frame} max-w-full gap-1.5 font-semibold`}>
        <BankIcon className="size-4 text-text-2" />
        <bdi>{t("payments.bank")}</bdi>
      </li>
    </ul>
  );
}
