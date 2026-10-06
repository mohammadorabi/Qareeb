"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  Bell,
  Check,
  ChevronLeft,
  CreditCard,
  FileText,
  Gift,
  Landmark,
  LayoutGrid,
  Lock,
  Mail,
  Plus,
  ReceiptText,
  Settings,
  ShieldCheck,
  Store,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { LogoMark } from "@/components/brand/Logo";

/*
 * App screens for the phone story, copied from the app design (Claude Design,
 * "Pay a bill — 02", "02b" and "Balance transfer — 03"): 24px side padding,
 * white cards with a 1px --border, 20px card / 16px row / 14px button radii,
 * Cairo for text, JetBrains Mono for numbers, Outfit for € amounts. Drawn at
 * 393 × 852 (1px = 1pt); PhoneFrame zooms them to its screen and draws the
 * status bar and home indicator on top. Amounts are an illustrative example
 * (labeled next to the phone). Payment brands are named in text, never drawn
 * as logos (see components/trust/PaymentBadges.tsx).
 */

const STROKE = 1.75;

type Person = { name: string; initial: string; number: string };

/* ---------- Shared pieces ---------- */

/** pt: the status bar's 59pt safe area. Content taller than the screen is clipped. */
function Screen({ children, bottom }: { children: ReactNode; bottom: ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-bg pt-[59px]">
      <div className="px-6">{children}</div>
      {bottom}
    </div>
  );
}

const squareBtn =
  "grid size-10 shrink-0 place-items-center rounded-[12px] border border-border bg-card text-text";

/** Back button at the start, title, optional icon at the end. */
function Header({ title, end }: { title: string; end?: ReactNode }) {
  return (
    <div className="flex h-10 items-center gap-3">
      <span className={squareBtn}>
        <ChevronLeft className="size-5 ltr:-scale-x-100" strokeWidth={2} />
      </span>
      <span className="text-[19px] font-bold text-text">{title}</span>
      {end && <span className="ms-auto">{end}</span>}
    </div>
  );
}

/** White sheet pinned to the bottom; pb clears the home indicator. */
function Sheet({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 rounded-t-[28px] bg-card px-6 pt-4 pb-[34px] shadow-[0_-10px_30px_rgb(31_29_27/0.07)]">
      {children}
    </div>
  );
}

function PrimaryButton({ children, pressed = false }: { children: ReactNode; pressed?: boolean }) {
  return (
    <div className="relative">
      <motion.div
        animate={pressed ? { scale: 0.96 } : { scale: 1 }}
        transition={{ duration: 0.15 }}
        className={`grid h-[54px] place-items-center rounded-[14px] text-[17px] font-bold text-white shadow-[0_10px_22px_-10px_rgb(242_100_26/0.8)] ${
          pressed ? "bg-orange-dark" : "bg-orange"
        }`}
      >
        {children}
      </motion.div>
      {pressed && (
        <motion.span
          className="pointer-events-none absolute top-1/2 left-1/2 size-10 -translate-1/2 rounded-pill bg-white/60"
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      )}
    </div>
  );
}

/** € amounts: Outfit, like the design (Latin digits in every language). */
function Money({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <bdi dir="ltr" className={`font-en ${className ?? ""}`}>
      {children}
    </bdi>
  );
}

/** Phone numbers, IDs: JetBrains Mono, always left-to-right. */
function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <bdi dir="ltr" className={`font-mono ${className ?? ""}`}>
      {children}
    </bdi>
  );
}

function Radio({ selected, check = false }: { selected?: boolean; check?: boolean }) {
  if (!selected)
    return <span className="size-[22px] shrink-0 rounded-pill border-2 border-border" />;
  return check ? (
    <span className="grid size-[22px] shrink-0 place-items-center rounded-pill bg-orange text-white">
      <Check className="size-3.5" strokeWidth={3} />
    </span>
  ) : (
    <span className="size-[22px] shrink-0 rounded-pill border-[6px] border-orange bg-card" />
  );
}

function SectionLabel({ children, add }: { children: ReactNode; add?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="text-[14px] font-bold text-text-2">{children}</span>
      {add && (
        <span className="flex items-center gap-1 text-[13px] font-semibold text-orange">
          <Plus className="size-4" strokeWidth={2.2} />
          {add}
        </span>
      )}
    </div>
  );
}

/* ---------- Step 01: home ---------- */

const TABS: LucideIcon[] = [LayoutGrid, Gift, Store, UserRound, Settings];

/** Floating tab bar; the active tab (services) in orange. */
function TabBar() {
  const t = useTranslations("how");
  const labels = t.raw("phone.tabs") as string[];
  return (
    <div className="absolute inset-x-3.5 bottom-[26px] z-20 flex h-[78px] items-center justify-around rounded-[24px] px-1.5 border border-border bg-card shadow-[0_8px_24px_-8px_rgb(31_29_27/0.12)]">
      {TABS.map((Icon, i) => (
        <span
          key={labels[i]}
          className={`flex min-w-0 flex-1 flex-col items-center gap-1.5 text-[11px] font-semibold ${
            i === 0 ? "text-orange" : "text-muted-deco"
          }`}
        >
          <span className="relative">
            <Icon
              className="size-[22px]"
              strokeWidth={STROKE}
              fill={i === 0 ? "currentColor" : "none"}
            />
            {i === 2 && (
              <span className="absolute -end-1.5 -top-1.5 grid size-3.5 place-items-center rounded-pill bg-orange-soft text-orange">
                <Lock className="size-2" strokeWidth={3} />
              </span>
            )}
          </span>
          {labels[i]}
        </span>
      ))}
    </div>
  );
}

function ServiceCard({
  icon: Icon,
  tile,
  label,
  sub,
  soon,
}: {
  icon: LucideIcon;
  tile: string;
  label: string;
  sub: string;
  soon?: string;
}) {
  return (
    <div className="relative flex min-h-[163px] flex-col rounded-[20px] border border-border bg-card p-[18px]">
      <span className={`relative grid size-12 place-items-center rounded-[14px] ${tile}`}>
        <Icon className="size-[22px]" strokeWidth={STROKE} />
        {soon && (
          <span className="absolute -end-2 -top-2 grid size-5 place-items-center rounded-pill border border-border bg-card text-text-2">
            <Lock className="size-2.5" strokeWidth={2.5} />
          </span>
        )}
      </span>
      {soon && (
        <span className="absolute end-[18px] top-[18px] rounded-pill bg-orange px-3 py-0.5 text-[12px] font-bold text-white">
          {soon}
        </span>
      )}
      <span className="mt-4 text-[17px] leading-snug font-bold text-text">{label}</span>
      <span className="mt-1 text-[12.5px] leading-snug text-muted">{sub}</span>
    </div>
  );
}

/** Step 1 — home: logo row, greeting, three service cards, tab bar. */
export function HomeScreen() {
  const t = useTranslations("how");
  return (
    <Screen bottom={<TabBar />}>
      <div className="flex h-10 items-center gap-2">
        <span className="grid size-9 place-items-center rounded-[10px] bg-text">
          <LogoMark className="h-[18px] w-auto [&_line]:stroke-white" />
        </span>
        <span className="font-en text-[22px] font-extrabold tracking-tight text-text">
          {t("phone.brand")}
        </span>
        <span className={`${squareBtn} relative ms-auto`}>
          <Bell className="size-[19px]" strokeWidth={STROKE} />
          <span className="absolute end-[11px] top-[9px] size-[7px] rounded-pill bg-orange" />
        </span>
        <span className="grid size-10 place-items-center rounded-[12px] bg-orange-soft text-[15px] font-bold text-orange">
          {t("phone.avatar")}
        </span>
      </div>
      <p className="mt-8 text-[14px] text-muted">{t("phone.hello")}</p>
      <p className="mt-1 text-[25px] leading-tight font-extrabold text-text">{t("phone.ask")}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <ServiceCard
          icon={ReceiptText}
          tile="bg-orange-soft text-orange"
          label={t("phone.bills")}
          sub={t("phone.billsSub")}
        />
        <ServiceCard
          icon={ArrowLeftRight}
          tile="bg-water text-[#3d6670]"
          label={t("phone.transfer")}
          sub={t("phone.transferSub")}
        />
        <ServiceCard
          icon={Store}
          tile="bg-olive/50 text-muted-deco"
          label={t("phone.store")}
          sub={t("phone.storeSub")}
          soon={t("phone.soon")}
        />
      </div>
    </Screen>
  );
}

/* ---------- Step 02: balance transfer ---------- */

const AVATARS = [
  "bg-rose text-orange-ink",
  "bg-sky text-[#3b6ea5]",
  "bg-olive text-[#5b7a44]",
] as const;

function Operator({ label, dot, selected }: { label: string; dot: string; selected?: boolean }) {
  return (
    <div
      className={`flex h-[52px] items-center justify-center gap-2.5 rounded-[14px] text-[16px] font-bold ${
        selected
          ? "border-[1.5px] border-orange bg-card text-text"
          : "border border-border bg-[#f3eee7] text-muted"
      }`}
    >
      <span className={`size-2.5 rounded-pill ${dot}`} />
      {label}
    </div>
  );
}

/** Step 2 — balance transfer: operator, number, saved recipients, amount, total. */
export function TransferScreen() {
  const t = useTranslations("how");
  const people = t.raw("phone.people") as Person[];
  const amounts = t.raw("phone.amounts") as string[];
  return (
    <Screen
      bottom={
        <Sheet>
          <div className="flex items-center justify-between text-[13px] text-muted">
            <span>{t("phone.feeLine")}</span>
            <Money className="font-semibold">{t("phone.fee")}</Money>
          </div>
          <div className="mt-1 mb-3 flex items-center justify-between">
            <span className="text-[17px] font-bold text-text">{t("phone.total")}</span>
            <Money className="text-[26px] font-extrabold text-text">{t("phone.totalValue")}</Money>
          </div>
          <PrimaryButton>{t("phone.transferNow")}</PrimaryButton>
        </Sheet>
      }
    >
      <Header
        title={t("phone.transferTitle")}
        end={<ArrowLeftRight className="size-5 text-orange" strokeWidth={2} />}
      />
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Operator label={t("phone.syriatel")} dot="bg-[#e0312b]" selected />
        <Operator label={t("phone.mtn")} dot="bg-[#f5c518]" />
      </div>
      <div className="mt-3.5 rounded-[20px] border border-border bg-card px-4 pt-3.5 pb-3">
        <p className="text-[11px] text-muted">{t("phone.recipient")}</p>
        <div className="mt-1 flex items-center gap-3" dir="ltr">
          <span className="border-e border-border pe-3 font-mono text-[14px] text-muted">
            {t("phone.prefix")}
          </span>
          <span className="font-mono text-[25px] font-medium tracking-wide text-text">
            {t("phone.number")}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-[14px] text-text">{t("phone.saveLocal")}</span>
          <span className="flex h-7 w-[46px] items-center rounded-pill bg-border p-0.5">
            <span className="size-6 rounded-pill bg-card shadow-[0_1px_3px_rgb(0_0_0/0.15)]" />
          </span>
        </div>
      </div>
      <div className="mt-5">
        <SectionLabel add={t("phone.add")}>{t("phone.saved")}</SectionLabel>
        <div className="flex flex-col gap-2">
          {people.map((p, i) => (
            <div
              key={p.name}
              className={`flex h-[64px] items-center gap-3 rounded-[16px] bg-card px-3.5 ${
                i === 0 ? "border-[1.5px] border-orange" : "border border-border"
              }`}
            >
              <span
                className={`grid size-10 place-items-center rounded-pill text-[16px] font-bold ${AVATARS[i]}`}
              >
                {p.initial}
              </span>
              <span className="flex flex-1 flex-col leading-tight">
                <span className="text-[15px] font-bold text-text">{p.name}</span>
                <Mono className="mt-1 text-[13px] text-muted">{p.number}</Mono>
              </span>
              <Radio selected={i === 0} check />
            </div>
          ))}
        </div>
      </div>
      <p className="mt-5 mb-3 text-[14px] font-bold text-text-2">{t("phone.chooseAmount")}</p>
      <div className="grid grid-cols-3 gap-3">
        {amounts.map((a, i) => (
          <span
            key={a}
            className={`grid h-12 place-items-center rounded-[14px] font-mono text-[15px] font-semibold ${
              i === amounts.length - 1
                ? "bg-orange text-white"
                : "border border-border bg-card text-text"
            }`}
          >
            {a}
          </span>
        ))}
      </div>
    </Screen>
  );
}

/* ---------- Step 03a: payment method ---------- */

function MethodRow({
  tile,
  name,
  sub,
  badge,
  selected,
}: {
  tile: ReactNode;
  name: string;
  sub: string;
  badge?: string;
  selected?: boolean;
}) {
  return (
    <div
      className={`flex h-[74px] items-center gap-3.5 rounded-[16px] bg-card px-4 ${
        selected ? "border-[1.5px] border-orange" : "border border-border"
      }`}
    >
      {tile}
      <span className="flex flex-1 flex-col leading-tight">
        <span className="flex items-center gap-2">
          <span className="text-[15px] font-bold text-text">{name}</span>
          {badge && (
            <span className="rounded-pill bg-green-soft px-2 py-0.5 text-[11px] font-bold text-green">
              {badge}
            </span>
          )}
        </span>
        <Mono className="mt-1.5 text-[13px] text-muted">{sub}</Mono>
      </span>
      <Radio selected={selected} />
    </div>
  );
}

const cardTile = (Icon: LucideIcon, className: string) => (
  <span className={`grid h-[34px] w-[48px] place-items-center rounded-[8px] ${className}`}>
    <Icon className="size-5" strokeWidth={STROKE} />
  </span>
);

/** Step 3a — payment method: summary, express buttons, saved methods, pay. */
export function MethodScreen({ pressed = false }: { pressed?: boolean }) {
  const t = useTranslations("how");
  return (
    <Screen
      bottom={
        <Sheet>
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[13px] text-muted">
              <ShieldCheck className="size-4 text-green" strokeWidth={2} />
              {t("phone.secure")}
            </span>
            <Money className="text-[26px] font-extrabold text-text">{t("phone.totalValue")}</Money>
          </div>
          <PrimaryButton pressed={pressed}>{t("phone.payNow")}</PrimaryButton>
        </Sheet>
      }
    >
      <Header title={t("phone.methodTitle")} />
      <div className="mt-5 flex items-center justify-between gap-3 rounded-[20px] bg-orange-soft px-5 py-5">
        <span className="flex flex-col leading-tight">
          <span className="text-[12.5px] font-semibold text-orange">{t("phone.summaryLabel")}</span>
          <span className="mt-1.5 text-[16px] font-bold text-text">{t("phone.summaryName")}</span>
        </span>
        <Money className="text-[28px] font-extrabold text-orange">{t("phone.totalValue")}</Money>
      </div>
      <p className="mt-6 mb-3 text-[14px] font-bold text-text-2">{t("phone.quickPay")}</p>
      <div className="grid grid-cols-2 gap-3">
        <span className="grid h-[50px] place-items-center rounded-[14px] bg-[#000] font-en text-[16px] font-semibold text-white">
          {t("phone.applePay")}
        </span>
        <span className="grid h-[50px] place-items-center rounded-[14px] border border-border bg-card font-en text-[16px] font-semibold text-text">
          {t("phone.googlePay")}
        </span>
      </div>
      <div className="my-5 flex items-center gap-3 text-[13px] text-muted">
        <span className="h-px flex-1 bg-border" />
        {t("phone.orPay")}
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="flex flex-col gap-2.5">
        <MethodRow
          tile={cardTile(CreditCard, "bg-[#1f2a6b] text-white")}
          name={t("phone.visa")}
          sub="•••• •••• •••• 4291"
          badge={t("phone.default")}
          selected
        />
        <MethodRow
          tile={cardTile(CreditCard, "bg-text text-white")}
          name={t("phone.mastercard")}
          sub="•••• •••• •••• 8830"
        />
        <MethodRow
          tile={cardTile(Landmark, "bg-orange-soft text-orange")}
          name={t("phone.bank")}
          sub="DE89 •••• •••• 3000"
        />
      </div>
    </Screen>
  );
}

/* ---------- Step 03b: success ---------- */

/** Step 3b — success: check, amount, details, receipt. */
export function SuccessScreen() {
  const t = useTranslations("how");
  const details = t.raw("phone.details") as [string, string][];
  return (
    <Screen
      bottom={
        <Sheet>
          <PrimaryButton>{t("phone.done")}</PrimaryButton>
          <p className="mt-4 flex items-center justify-center gap-2 text-[15px] font-bold text-text-2">
            <FileText className="size-[18px]" strokeWidth={STROKE} />
            {t("phone.pdf")}
          </p>
        </Sheet>
      }
    >
      <span className={squareBtn}>
        <X className="size-5" strokeWidth={2} />
      </span>
      <div className="flex flex-col items-center text-center">
        <span className="grid size-[108px] place-items-center rounded-pill bg-green-soft">
          <span className="grid size-[78px] place-items-center rounded-pill bg-green text-white shadow-[0_10px_24px_-8px_rgb(63_154_106/0.7)]">
            <Check className="size-9" strokeWidth={3} />
          </span>
        </span>
        <p className="mt-6 text-[25px] font-extrabold text-text">{t("phone.successTitle")}</p>
        <p className="mt-1.5 text-[13.5px] text-muted">{t("phone.successSub")}</p>
        <Money className="mt-5 text-[42px] leading-none font-extrabold text-text">
          {t("phone.totalValue")}
        </Money>
        <Mono className="mt-2.5 text-[13px] text-muted">{t("phone.syp")}</Mono>
      </div>
      <div className="mt-6 rounded-[20px] border border-border bg-card px-4 py-2">
        {details.map(([label, value], i) => (
          <div key={label} className="flex items-center justify-between py-2.5">
            <span className="text-[13.5px] text-muted">{label}</span>
            {i < 2 ? (
              <Mono className="text-[13.5px] font-semibold text-text">{value}</Mono>
            ) : (
              <bdi className="text-[13.5px] text-text">{value}</bdi>
            )}
          </div>
        ))}
        <div className="mt-1 flex items-center justify-between border-t border-border pt-3 pb-1.5">
          <span className="text-[13.5px] text-muted">{t("phone.paidTotal")}</span>
          <Money className="text-[15px] font-bold text-text">{t("phone.totalValue")}</Money>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-2 rounded-[16px] bg-green-soft px-4 py-3.5 text-[13px] font-semibold text-green">
        <Mail className="size-[18px]" strokeWidth={STROKE} />
        {t("phone.emailed")}
      </p>
    </Screen>
  );
}
