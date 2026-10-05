"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  CalendarHeart,
  Check,
  ChevronLeft,
  Gift,
  History,
  House,
  Lock,
  ReceiptText,
  RotateCcw,
  Smartphone,
  UserRound,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { NOT_SHOWN } from "@/lib/illustrative";

/*
 * App screens for the phone story, following the SRS UI: 22px side padding,
 * Cairo 14–15px, white cards with 1px --border and 20px radius, bottom tab
 * bar with 4 tabs (active #F2641A, inactive #8A857E). Labels only — no
 * real amounts, rates or fees. Drawn 342px wide (1pt = 342/393px); PhoneFrame
 * zooms them to its screen and draws the status bar and home indicator on top.
 */

const STROKE = 1.75;

const TAB_ICONS: LucideIcon[] = [House, History, Users, UserRound];

/** pb: the home indicator's 34pt safe area, so icons and labels sit above it. */
function TabBar({ active = 0 }: { active?: number }) {
  const t = useTranslations("how");
  const labels = t.raw("phone.tabs") as string[];
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex items-start justify-around border-t border-border bg-card px-3 pt-2.5 pb-[30px]">
      {TAB_ICONS.map((Icon, i) => (
        <span
          key={labels[i]}
          className="flex w-16 flex-col items-center gap-1 text-[11px] font-semibold"
          style={{ color: i === active ? "#F2641A" : "#8A857E" }}
        >
          <Icon className="size-[22px]" strokeWidth={STROKE} />
          {labels[i]}
        </span>
      ))}
    </div>
  );
}

function Header({ title, tag }: { title: string; tag?: string }) {
  return (
    <div className="flex items-center gap-2.5 pt-2 pb-4">
      <span className="grid size-9 place-items-center rounded-pill border border-border bg-card text-text">
        <ChevronLeft className="size-[18px] rtl:-scale-x-100" strokeWidth={STROKE} />
      </span>
      <span className="text-[18px] font-bold text-text">{title}</span>
      {tag && (
        <span className="ms-auto rounded-pill bg-mustard/30 px-2.5 py-0.5 text-[11px] font-semibold text-text">
          {tag}
        </span>
      )}
    </div>
  );
}

/** pt: the status bar's 59pt safe area; pb: clears the tab bar. */
function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-bg pt-[51px]">
      <div className="flex-1 px-[22px] pb-[92px]">{children}</div>
      <TabBar />
    </div>
  );
}

function ServiceCard({
  icon: Icon,
  tint,
  label,
  sub,
  locked,
  soon,
  highlight,
}: {
  icon: LucideIcon;
  tint: string;
  label: string;
  sub?: string;
  locked?: boolean;
  soon?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative flex min-h-[148px] flex-col gap-3 rounded-[20px] border bg-card p-4 ${
        locked ? "opacity-40" : ""
      } ${highlight ? "border-orange shadow-[0_0_0_4px_rgb(242_100_26/0.14)]" : "border-border"}`}
    >
      <span className={`grid size-11 place-items-center rounded-pill ${tint} text-text`}>
        <Icon className="size-[22px]" strokeWidth={STROKE} />
      </span>
      {locked && (
        <Lock className="absolute end-4 top-4 size-[18px] text-text" strokeWidth={STROKE} />
      )}
      <span className="text-[15px] leading-snug font-bold text-text">{label}</span>
      {sub && <span className="-mt-2 text-[12.5px] leading-snug text-text-2">{sub}</span>}
      {locked && soon && (
        <span className="-mt-1 w-fit rounded-pill bg-mustard px-2 py-0.5 text-[11px] font-bold text-text">
          {soon}
        </span>
      )}
    </div>
  );
}

/** Step 1 — services grid: 2 active, 2 locked. */
export function ServicesScreen({ highlight = true }: { highlight?: boolean }) {
  const t = useTranslations("how");
  return (
    <Screen>
      <p className="pt-3 text-[14px] text-text-2">{t("phone.hello")}</p>
      <p className="mt-0.5 mb-5 text-[24px] font-extrabold text-text">{t("phone.services")}</p>
      <div className="grid grid-cols-2 gap-3">
        <ServiceCard
          icon={ReceiptText}
          tint="bg-sand"
          label={t("phone.bills")}
          sub={t("phone.billsSub")}
        />
        <ServiceCard
          icon={Smartphone}
          tint="bg-orange-soft"
          label={t("phone.transfer")}
          sub={t("phone.transferSub")}
          highlight={highlight}
        />
        <ServiceCard
          icon={Gift}
          tint="bg-lilac"
          label={t("phone.gifts")}
          locked
          soon={t("phone.soon")}
        />
        <ServiceCard
          icon={CalendarHeart}
          tint="bg-rose"
          label={t("phone.occasions")}
          locked
          soon={t("phone.soon")}
        />
      </div>
      <p className="mt-6 mb-2.5 text-[14px] font-semibold text-text-2">{t("phone.quick")}</p>
      <div className="rounded-[20px] border border-border bg-card px-3.5">
        {[
          {
            icon: Smartphone,
            tint: "bg-lilac",
            name: t("phone.quickDad"),
            sub: t("phone.quickDadSub"),
          },
          { icon: Zap, tint: "bg-sand", name: t("phone.quickHome"), sub: t("phone.quickHomeSub") },
        ].map(({ icon: Icon, tint, name, sub }, i) => (
          <div
            key={name}
            className={`flex items-center gap-3 py-3 ${i ? "border-t border-border" : ""}`}
          >
            <span className={`grid size-10 place-items-center rounded-pill ${tint} text-text`}>
              <Icon className="size-5" strokeWidth={STROKE} />
            </span>
            <span className="flex flex-1 flex-col leading-tight">
              <span className="text-[14.5px] font-bold text-text">{name}</span>
              <span className="text-[12.5px] text-text-2">{sub}</span>
            </span>
            <ChevronLeft className="size-4 text-muted-deco ltr:-scale-x-100" strokeWidth={STROKE} />
          </div>
        ))}
      </div>
    </Screen>
  );
}

function OptionCard({
  label,
  tint,
  selected,
}: {
  label: string;
  tint: string;
  selected?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col items-center gap-3 rounded-[20px] bg-card px-3 py-5 text-center ${
        selected ? "border-2 border-orange" : "border border-border"
      }`}
    >
      {selected && (
        <span className="absolute end-2.5 top-2.5 grid size-6 place-items-center rounded-pill bg-orange text-white">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      )}
      <span className={`grid size-12 place-items-center rounded-pill ${tint} text-text`}>
        <Smartphone className="size-6" strokeWidth={STROKE} />
      </span>
      <span className="text-[14.5px] font-bold text-text">{label}</span>
    </div>
  );
}

/** Step 2 — balance transfer: 2 option cards (not a 2×2 grid), saved numbers. */
export function TransferScreen() {
  const t = useTranslations("how");
  return (
    <Screen>
      <Header title={t("phone.transfer")} />
      <p className="mb-3 text-[14px] font-semibold text-text-2">{t("phone.chooseType")}</p>
      <div className="grid grid-cols-2 gap-3">
        <OptionCard label={t("phone.syriatel")} tint="bg-lilac" selected />
        <OptionCard label={t("phone.mtn")} tint="bg-olive" />
      </div>
      <p className="mt-7 mb-3 text-[14px] font-semibold text-text-2">{t("phone.saved")}</p>
      <div className="flex flex-wrap gap-2">
        <span className="flex items-center gap-1.5 rounded-pill border border-orange bg-orange-soft px-3.5 py-2 text-[14px] font-semibold text-text">
          <Check className="size-3.5 text-orange-dark" strokeWidth={3} />
          {t("phone.chipDad")}
        </span>
        <span className="rounded-pill border border-border bg-card px-3.5 py-2 text-[14px] font-semibold text-text">
          {t("phone.chipMom")}
        </span>
        <span
          dir="ltr"
          className="rounded-pill border border-border bg-card px-3.5 py-2 font-mono text-[13px] text-text"
        >
          {t("phone.chipNumber")}
        </span>
      </div>
      <div className="mt-8 grid h-[52px] place-items-center rounded-[14px] bg-orange text-[16px] font-bold text-white">
        {t("phone.continue")}
      </div>
    </Screen>
  );
}

/** Step 3a — confirmation breakdown (labels only), with an optional tap. */
/** `syp` is the server-formatted example amount; everything else shows "—". */
export function ConfirmScreen({ syp, pressed = false }: { syp: string; pressed?: boolean }) {
  const t = useTranslations("how");
  const rows = t.raw("phone.rows") as string[];
  return (
    <Screen>
      <Header title={t("phone.confirmTitle")} tag={t("phone.example")} />
      <div className="flex items-center gap-3 rounded-[20px] border border-border bg-card p-3.5">
        <span className="grid size-11 place-items-center rounded-pill bg-lilac text-[16px] font-bold text-text">
          {t("phone.chipDad").slice(0, 1)}
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[12.5px] text-text-2">{t("phone.to")}</span>
          <span className="text-[15px] font-bold text-text">{t("phone.chipDad")}</span>
          <span className="text-[12.5px] text-text-2">{t("phone.syriatel")}</span>
        </span>
      </div>
      <div className="mt-3 rounded-[20px] border border-border bg-card px-4 py-1.5">
        {rows.map((label, i) => {
          const total = i === rows.length - 1;
          return (
            <div
              key={label}
              className={`flex items-center justify-between gap-3 py-3 ${
                total ? "border-t border-dashed border-border" : ""
              }`}
            >
              <span className={`text-[14px] ${total ? "font-bold text-text" : "text-text-2"}`}>
                {label}
              </span>
              <bdi className={`font-mono text-[13.5px]`}>{i === 0 ? syp : NOT_SHOWN}</bdi>
            </div>
          );
        })}
      </div>
      <p className="mt-3 flex items-start gap-2 text-[12.5px] leading-snug text-green">
        <RotateCcw className="mt-0.5 size-4 shrink-0" strokeWidth={STROKE} />
        {t("phone.refund")}
      </p>
      <div className="relative mt-5">
        <motion.div
          animate={pressed ? { scale: 0.95 } : { scale: 1 }}
          transition={{ duration: 0.15 }}
          className={`grid h-[52px] place-items-center rounded-[14px] text-[16px] font-bold text-white ${
            pressed ? "bg-orange-dark" : "bg-orange"
          }`}
        >
          {t("phone.pay")}
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
    </Screen>
  );
}

/** Step 3b — success: «وصلت» under a green check, with a delivery timeline. */
export function SuccessScreen() {
  const t = useTranslations("how");
  const track = t.raw("phone.track") as string[];
  return (
    <Screen>
      <div className="flex flex-col items-center pt-12 text-center">
        <span className="grid size-[92px] place-items-center rounded-pill bg-green-soft">
          <span className="grid size-16 place-items-center rounded-pill bg-green text-white">
            <Check className="size-8" strokeWidth={2.5} />
          </span>
        </span>
        <p className="mt-6 text-[26px] font-extrabold text-text">{t("phone.arrived")}</p>
        <p className="mt-1 text-[15px] text-text-2">{t("phone.arrivedSub")}</p>
      </div>
      <ol className="mt-8 rounded-[20px] border border-border bg-card px-4 py-2">
        {track.map((label, i) => (
          <li key={label} className="relative flex items-center gap-3 py-2.5">
            {i < track.length - 1 && (
              <span className="absolute start-[11px] top-[34px] h-[18px] w-0.5 bg-green/40" />
            )}
            <span className="grid size-6 place-items-center rounded-pill bg-green text-white">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            <span className="text-[14.5px] font-semibold text-text">{label}</span>
          </li>
        ))}
      </ol>
      <div className="mt-6 grid h-[52px] place-items-center rounded-[14px] border border-border bg-card text-[16px] font-bold text-text">
        {t("phone.done")}
      </div>
    </Screen>
  );
}
