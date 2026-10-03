"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";
import {
  CITY_PAIRS,
  DOT_PATHS,
  DOT_SIZE,
  MAP_HEIGHT,
  MAP_WIDTH,
  arcPath,
  type City,
} from "@/lib/map-dots";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const CYCLE_MS = 4200;
const DRAW_S = 1.6;
const DRAW_DELAY_S = 0.35;
const EASE_DRAW = [0.65, 0, 0.35, 1] as const;

// One illustrative service per pair (no amounts).
const SERVICES = ["syriatelCash", "mtnCredit", "electricity", "internet", "mtnCash"] as const;

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export function DistanceMap() {
  const t = useTranslations("map");
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [arrivedIndex, setArrivedIndex] = useState<number | null>(null);

  const pathRef = useRef<SVGPathElement>(null);
  const progress = useMotionValue(0);
  const dashOffset = useTransform(progress, (p) => 1 - p);
  const giftX = useMotionValue(0);
  const giftY = useMotionValue(0);
  const giftOpacity = useTransform(progress, [0, 0.05, 0.92, 1], [0, 1, 1, 0]);

  const pair = CITY_PAIRS[index];
  const d = arcPath(pair.from.at, pair.to.at);
  const arrived = reduced || arrivedIndex === index;

  useMotionValueEvent(progress, "change", (p) => {
    const path = pathRef.current;
    if (!path) return;
    const pt = path.getPointAtLength(p * path.getTotalLength());
    giftX.set(pt.x);
    giftY.set(pt.y);
  });

  useEffect(() => {
    if (reduced) {
      progress.set(1);
      return;
    }
    progress.set(0);
    const draw = animate(progress, 1, {
      duration: DRAW_S,
      delay: DRAW_DELAY_S,
      ease: EASE_DRAW,
    });
    draw.then(() => setArrivedIndex(index));
    const next = setTimeout(() => setIndex((i) => (i + 1) % CITY_PAIRS.length), CYCLE_MS);
    return () => {
      draw.stop();
      clearTimeout(next);
    };
  }, [index, reduced, progress]);

  const service = SERVICES[index % SERVICES.length];

  return (
    // Geography never mirrors: keep Europe top-left / Syria bottom-right in RTL too.
    <figure dir="ltr" className="relative mx-auto w-full max-w-[620px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-10%] rounded-full bg-[radial-gradient(closest-side,var(--orange-soft),transparent)] opacity-70"
      />

      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="relative block h-auto w-full"
        role="img"
        aria-label={t("label")}
      >
        <defs>
          <radialGradient id="gift-glow">
            <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--orange)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path
          d={DOT_PATHS.land}
          stroke="var(--text-muted)"
          strokeOpacity="0.32"
          strokeWidth={DOT_SIZE}
          strokeLinecap="round"
        />
        <path
          d={DOT_PATHS.syria}
          stroke="var(--orange)"
          strokeOpacity="0.45"
          strokeWidth={DOT_SIZE}
          strokeLinecap="round"
        />

        {/* Faint guide under the drawn arc */}
        <path
          d={d}
          fill="none"
          stroke="var(--orange)"
          strokeOpacity="0.14"
          strokeWidth="1.5"
          strokeDasharray="2 6"
          strokeLinecap="round"
        />
        <motion.path
          ref={pathRef}
          d={d}
          fill="none"
          stroke="var(--orange)"
          strokeWidth="2.5"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          style={{ strokeDashoffset: reduced ? 0 : dashOffset }}
        />

        {!reduced && (
          <motion.g style={{ x: giftX, y: giftY, opacity: giftOpacity }}>
            <circle r="16" fill="url(#gift-glow)" />
            <circle r="5" fill="var(--orange)" stroke="var(--card)" strokeWidth="2" />
          </motion.g>
        )}

        <CityMarker city={pair.from} keyId={`from-${index}`} side="from" />
        <CityMarker city={pair.to} keyId={`to-${index}`} side="to" />

        {/* Arrival pulse on the Syrian dot */}
        {arrived && !reduced && (
          <motion.circle
            key={`pulse-${index}`}
            cx={pair.to.at.x}
            cy={pair.to.at.y}
            r="7"
            fill="none"
            stroke="var(--orange)"
            strokeWidth="2"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 3.4, opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        )}
      </svg>

      {/* Arrival card, anchored to the Syrian dot (to its west, over the sea) */}
      <AnimatePresence>
        {arrived && (
          <motion.div
            key={`card-${index}`}
            initial={reduced ? false : { opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.25 } }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="absolute"
            style={{
              // Card's right edge sits just past the dot, so it extends west over the sea.
              right: `calc(${pct(MAP_WIDTH - pair.to.at.x, MAP_WIDTH)} - 18px)`,
              top: pct(pair.to.at.y, MAP_HEIGHT),
            }}
          >
            <ArrivalCard arrived={t("arrived")} service={t(`services.${service}`)} />
          </motion.div>
        )}
      </AnimatePresence>
    </figure>
  );
}

function CityMarker({ city, keyId, side }: { city: City; keyId: string; side: "from" | "to" }) {
  const { x, y } = city.at;
  return (
    <AnimatePresence mode="wait">
      <motion.g
        key={keyId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <circle cx={x} cy={y} r="11" fill="var(--orange)" fillOpacity="0.16" />
        <circle cx={x} cy={y} r="5.5" fill="var(--orange)" stroke="var(--card)" strokeWidth="2" />
        <text
          x={side === "from" ? x : x - 16}
          y={side === "from" ? y - 20 : y - 18}
          textAnchor={side === "from" ? "middle" : "end"}
          className="fill-text font-mono text-[21px] font-medium tracking-[0.12em]"
        >
          {city.label}
        </text>
      </motion.g>
    </AnimatePresence>
  );
}

function ArrivalCard({ arrived, service }: { arrived: string; service: string }) {
  return (
    // The wrapper is LTR for geometry; let the card's own text follow the page.
    <div
      dir="auto"
      className="mt-4 flex w-max max-w-[220px] items-center gap-2.5 rounded-[14px] border border-border bg-card py-2 ps-2.5 pe-3.5 shadow-[0_10px_30px_-12px_rgb(31_29_27/0.25)]"
    >
      <span className="grid size-7 shrink-0 place-items-center rounded-pill bg-green-soft text-green">
        <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
          <path
            d="M5 10.5l3.2 3.2L15 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[14px] font-bold text-text">{arrived}</span>
        <span className="text-[12.5px] text-text-2">{service}</span>
      </span>
    </div>
  );
}
