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
  MAP_CENTER,
  MAP_RADIUS,
  MAP_SIZE,
  arcPath,
  type City,
} from "@/lib/map-dots";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const CYCLE_MS = 4200;
const DRAW_S = 1.6;
const DRAW_DELAY_S = 0.35;
const EASE_DRAW = [0.65, 0, 0.35, 1] as const;

// Illustrative v1.0 services shown on arrival (no amounts). 6 services over 7 pairs,
// so the combinations keep changing.
const SERVICES = [
  "syriatelCredit",
  "mtnCredit",
  "electricity",
  "internet",
  "water",
  "phone",
] as const;

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export function DistanceMap() {
  const t = useTranslations("map");
  const reduced = usePrefersReducedMotion();
  // Ever-increasing arrival count; pair and service are derived from it.
  const [cycle, setCycle] = useState(0);
  const [arrivedCycle, setArrivedCycle] = useState<number | null>(null);

  const pathRef = useRef<SVGPathElement>(null);
  const progress = useMotionValue(0);
  const dashOffset = useTransform(progress, (p) => 1 - p);
  const giftX = useMotionValue(0);
  const giftY = useMotionValue(0);
  const giftOpacity = useTransform(progress, [0, 0.05, 0.92, 1], [0, 1, 1, 0]);

  const pair = CITY_PAIRS[cycle % CITY_PAIRS.length];
  const d = arcPath(pair.from.at, pair.to.at);
  const arrived = reduced || arrivedCycle === cycle;

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
    draw.then(() => setArrivedCycle(cycle));
    const next = setTimeout(() => setCycle((c) => c + 1), CYCLE_MS);
    return () => {
      draw.stop();
      clearTimeout(next);
    };
  }, [cycle, reduced, progress]);

  const service = SERVICES[cycle % SERVICES.length];

  return (
    // Geography never mirrors: the globe reads the same in RTL and LTR.
    <figure dir="ltr" className="relative mx-auto w-full max-w-[580px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[4%] rounded-full bg-[radial-gradient(closest-side,var(--orange-soft),transparent)] opacity-80"
      />

      <svg
        viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}
        className="relative block h-auto w-full"
        role="img"
        aria-label={t("label")}
      >
        <defs>
          <radialGradient id="gift-glow">
            <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--orange)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="globe-shade">
            <stop offset="72%" stopColor="var(--text)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--text)" stopOpacity="0.06" />
          </radialGradient>
        </defs>

        {/* Globe body: a soft sphere with a faint ring, echoing the logo. */}
        <circle
          cx={MAP_CENTER}
          cy={MAP_CENTER}
          r={MAP_RADIUS + 6}
          fill="var(--card)"
          fillOpacity="0.55"
          stroke="var(--border)"
          strokeWidth="1.5"
        />
        <circle cx={MAP_CENTER} cy={MAP_CENTER} r={MAP_RADIUS + 6} fill="url(#globe-shade)" />

        <path
          d={DOT_PATHS.land}
          stroke="var(--text-muted)"
          strokeOpacity="0.34"
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

        {/* Arcs leave southern (Gulf) cities upward, so their label moves to the right. */}
        <CityMarker
          city={pair.from}
          keyId={`from-${cycle}`}
          label={pair.from.at.y > pair.to.at.y ? "right" : "above"}
        />
        {/* Arcs reach Syria from above or the east: label to the left is always clear. */}
        <CityMarker city={pair.to} keyId={`to-${cycle}`} label="left" />

        {/* Arrival pulse on the Syrian dot */}
        {arrived && !reduced && (
          <motion.circle
            key={`pulse-${cycle}`}
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

      {/* Arrival card, below-left of the Syrian dot (arcs arrive from above or the east). */}
      <AnimatePresence>
        {arrived && (
          <motion.div
            key={`card-${cycle}`}
            initial={reduced ? false : { opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.25 } }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="absolute"
            style={{
              right: `calc(${pct(MAP_SIZE - pair.to.at.x, MAP_SIZE)} - 18px)`,
              top: pct(pair.to.at.y, MAP_SIZE),
            }}
          >
            <ArrivalCard arrived={t("arrived")} service={t(`services.${service}`)} />
          </motion.div>
        )}
      </AnimatePresence>
    </figure>
  );
}

const LABEL_POS = {
  above: { dx: 0, dy: -20, anchor: "middle" },
  right: { dx: 16, dy: 7, anchor: "start" },
  left: { dx: -16, dy: 7, anchor: "end" },
} as const;

type CityMarkerProps = { city: City; keyId: string; label: keyof typeof LABEL_POS };

function CityMarker({ city, keyId, label }: CityMarkerProps) {
  const { x, y } = city.at;
  const pos = LABEL_POS[label];
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
          x={x + pos.dx}
          y={y + pos.dy}
          textAnchor={pos.anchor}
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
