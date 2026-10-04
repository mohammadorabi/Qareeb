"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useLocale } from "next-intl";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

// Stage in viewBox units; the logo is drawn around its center.
const W = 1000;
const H = 320;
const CX = W / 2;
const CY = 150;
// Logo geometry (see components/brand/Logo.tsx), scaled into the stage.
const S = 0.36;
const DOT_R = 72 * S;
const RING_R = 246 * S;
const RING_W = 112 * S;
const HANDLE = {
  x1: (676 - 512) * S,
  y1: (603 - 440) * S,
  x2: (808 - 512) * S,
  y2: (798 - 440) * S,
};
const SPREAD = 410; // start distance of each dot from the center
const LIFT = 70; // height of the curve the dots travel along

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function useDot(progress: MotionValue<number>, side: 1 | -1) {
  // t: 1 = far apart, 0 = merged. The dots rise and fall along a gentle arc.
  const x = useTransform(progress, (p) => CX + side * SPREAD * (1 - clamp01(p / 0.7)));
  const y = useTransform(progress, (p) => CY - LIFT * Math.sin(Math.PI * (1 - clamp01(p / 0.7))));
  return { x, y };
}

/**
 * The signature ending: «العالم» and «سوريا» move toward each other as the
 * section scrolls in, merge into the logo's center dot, and the ring draws
 * itself around it. Reduced motion: the finished logo, static.
 */
export function DotsMerge({ world, syria }: { world: string; syria: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const rtl = useLocale() === "ar";
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });

  // "World" starts on the reading-start side, "Syria" on the end side.
  const worldSide = rtl ? 1 : -1;
  const worldDot = useDot(scrollYProgress, worldSide);
  const syriaDot = useDot(scrollYProgress, -worldSide as 1 | -1);
  const labelOpacity = useTransform(scrollYProgress, [0.5, 0.66], [1, 0]);
  const ring = useTransform(scrollYProgress, (p) => 1 - clamp01((p - 0.7) / 0.2));
  const handle = useTransform(scrollYProgress, (p) => 1 - clamp01((p - 0.86) / 0.14));

  const dots = [
    { ...worldDot, label: world },
    { ...syriaDot, label: syria },
  ];

  return (
    <div ref={ref} className="mx-auto w-full max-w-[760px]">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden="true">
        <g transform={`translate(${CX} ${CY})`}>
          <motion.circle
            r={RING_R}
            fill="none"
            stroke="var(--orange)"
            strokeWidth={RING_W}
            pathLength={1}
            strokeDasharray="1 1"
            transform="rotate(-90)"
            style={{ strokeDashoffset: reduced ? 0 : ring }}
          />
          <motion.line
            {...HANDLE}
            stroke="var(--text)"
            strokeWidth={RING_W}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            style={{ strokeDashoffset: reduced ? 0 : handle }}
          />
        </g>
        {reduced ? (
          <circle cx={CX} cy={CY} r={DOT_R} fill="var(--orange)" />
        ) : (
          dots.map((d) => (
            <motion.g key={d.label} style={{ x: d.x, y: d.y }}>
              <circle r={DOT_R} fill="var(--orange)" />
              <motion.text
                y={-DOT_R - 20}
                textAnchor="middle"
                style={{ opacity: labelOpacity }}
                className="fill-text-2 font-mono text-[30px] font-medium tracking-[0.12em]"
              >
                {d.label}
              </motion.text>
            </motion.g>
          ))
        )}
      </svg>
    </div>
  );
}
