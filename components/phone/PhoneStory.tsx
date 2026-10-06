"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import {
  ConfirmScreen,
  ServicesScreen,
  SuccessScreen,
  TransferScreen,
} from "@/components/phone/screens";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type Step = { title: string; body: string };

/** Screens in story order. Step 3 plays confirm → tap → success. */
const SCREENS = ["services", "transfer", "confirm", "pressed", "success"] as const;
type ScreenId = (typeof SCREENS)[number];

/**
 * Each step block reports how far it has crossed the viewport center (0..1).
 * The active step is the last one that has started; step 3 is subdivided.
 */
function screenFor(progress: number[]): ScreenId {
  let active = 0;
  progress.forEach((p, i) => {
    if (p > 0) active = i;
  });
  if (active === 0) return "services";
  if (active === 1) return "transfer";
  const s = progress[2];
  if (s < 0.38) return "confirm";
  if (s < 0.5) return "pressed";
  return "success";
}

const stepOf = (screen: ScreenId) => Math.min(2, SCREENS.indexOf(screen));

/** Smaller phone for shorter laptop screens (non-overlapping ranges; default 368px). */
const PHONE_FIT =
  "[@media(max-height:700px)]:[--phone-w:252px] [@media(min-height:701px)_and_(max-height:800px)]:[--phone-w:288px] [@media(min-height:801px)_and_(max-height:900px)]:[--phone-w:324px]";

function ScreenView({ id, syp }: { id: ScreenId; syp: string }) {
  switch (id) {
    case "services":
      return <ServicesScreen />;
    case "transfer":
      return <TransferScreen />;
    case "confirm":
      return <ConfirmScreen syp={syp} />;
    case "pressed":
      return <ConfirmScreen syp={syp} pressed />;
    case "success":
      return <SuccessScreen />;
  }
}

const num = (i: number) => String(i + 1).padStart(2, "0");

/** Step number + title + body; `active` controls emphasis (color, not opacity). */
function StepText({ step, i, active }: { step: Step; i: number; active: boolean }) {
  return (
    <div className="flex gap-5">
      <span
        className={`font-mono text-[28px] leading-none font-semibold transition-colors duration-300 ${
          active ? "text-orange-dark" : "text-muted-deco"
        }`}
      >
        {num(i)}
      </span>
      <div>
        <h3
          className={`text-[clamp(24px,2.6vw,34px)] leading-tight font-extrabold transition-colors duration-300 ${
            active ? "text-text" : "text-muted-deco"
          }`}
        >
          {step.title}
        </h3>
        <p
          className={`mt-3 max-w-[38ch] text-[17px] leading-[1.75] transition-colors duration-300 ${
            active ? "text-text-2" : "text-muted"
          }`}
        >
          {step.body}
        </p>
      </div>
    </div>
  );
}

/**
 * A step block, ~one viewport tall (the last one taller, so confirm → tap →
 * success each get time on screen). Its text stays pinned at the viewport
 * center while the block scrolls past, alongside the sticky phone.
 */
function StepBlock({
  step,
  i,
  active,
  last,
  onProgress,
}: {
  step: Step;
  i: number;
  active: boolean;
  last: boolean;
  onProgress: (i: number, p: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => onProgress(i, p));

  return (
    <li ref={ref} className={last ? "h-[170svh]" : "h-[calc(100svh-var(--nav-h))]"}>
      {/* Pinned roughly at the viewport center (text blocks are ~11rem tall). */}
      <div className="sticky top-[calc(50svh+var(--nav-h)/2-5.5rem)]">
        <StepText step={step} i={i} active={active} />
      </div>
    </li>
  );
}

/** Desktop: steps scroll past a sticky phone (~300vh). */
function StickyStory({ steps, syp }: { steps: Step[]; syp: string }) {
  const rtl = useLocale() === "ar";
  const [screen, setScreen] = useState<ScreenId>("services");
  const [direction, setDirection] = useState(1);
  const progress = useRef(steps.map(() => 0));
  const current = useRef<ScreenId>("services");

  const onProgress = (i: number, p: number) => {
    progress.current[i] = p;
    const next = screenFor(progress.current);
    if (next === current.current) return;
    setDirection(SCREENS.indexOf(next) > SCREENS.indexOf(current.current) ? 1 : -1);
    current.current = next;
    setScreen(next);
  };

  const active = stepOf(screen);
  // Forward = new screen enters from the reading direction's end side.
  const shift = (dir: number) => dir * (rtl ? -1 : 1) * 56;
  // The tap is a state of the confirm screen, not a new slide.
  const slideKey = screen === "pressed" ? "confirm" : screen;

  return (
    <div className="container-site hidden grid-cols-[1fr_auto] gap-16 lg:grid">
      <ol>
        {steps.map((step, i) => (
          <StepBlock
            key={step.title}
            step={step}
            i={i}
            active={i === active}
            last={i === steps.length - 1}
            onProgress={onProgress}
          />
        ))}
      </ol>
      <div>
        <div className="sticky top-(--nav-h) flex h-[calc(100svh-var(--nav-h))] items-center">
          <PhoneFrame className={PHONE_FIT}>
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={slideKey}
                custom={direction}
                className="absolute inset-0"
                variants={{
                  enter: (dir: number) => ({ x: shift(dir), opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (dir: number) => ({ x: shift(-dir), opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              >
                <ScreenView id={screen} syp={syp} />
              </motion.div>
            </AnimatePresence>
          </PhoneFrame>
        </div>
      </div>
    </div>
  );
}

/** One final-state screen per step (used by the static layouts). */
const STATIC_SCREENS: ScreenId[] = ["services", "transfer", "success"];

/** Desktop with reduced motion: the three screens side by side, static. */
function StaticRow({ steps, syp }: { steps: Step[]; syp: string }) {
  return (
    <div className="container-site hidden gap-8 lg:mt-14 lg:grid lg:grid-cols-3">
      {steps.map((step, i) => (
        <div key={step.title} className="flex flex-col gap-8">
          <StepText step={step} i={i} active />
          <PhoneFrame className="mx-auto mt-auto [--phone-w:296px]">
            <ScreenView id={STATIC_SCREENS[i]} syp={syp} />
          </PhoneFrame>
        </div>
      ))}
    </div>
  );
}

/** Below 1024px: no sticky — each step is a card with its own small phone. */
function StackedCards({ steps, syp }: { steps: Step[]; syp: string }) {
  return (
    <ol className="container-site flex flex-col gap-5 lg:hidden">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="flex flex-col gap-7 rounded-card border border-border bg-card px-5 pt-7 pb-6 md:flex-row md:items-center md:px-10"
        >
          <div className="md:flex-1">
            <StepText step={step} i={i} active />
          </div>
          {/* The whole phone, card grows to fit it. */}
          <PhoneFrame className="mx-auto [--phone-w:266px] md:mx-0">
            <ScreenView id={STATIC_SCREENS[i]} syp={syp} />
          </PhoneFrame>
        </li>
      ))}
    </ol>
  );
}

/** `syp`: server-formatted example amount (see lib/illustrative.ts). */
export function PhoneStory({ syp }: { syp: string }) {
  const t = useTranslations("how");
  const steps = t.raw("steps") as Step[];
  const reduced = usePrefersReducedMotion();

  return (
    <>
      {reduced ? <StaticRow steps={steps} syp={syp} /> : <StickyStory steps={steps} syp={syp} />}
      <StackedCards steps={steps} syp={syp} />
    </>
  );
}
