"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const MUTED = "#8a857e"; // --text-muted (3.4:1 — fine at this large size)
const TEXT = "#1f1d1b"; // --text

/** One line that warms from muted to full text as it reaches the viewport center. */
function Line({ children }: { children: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "center 0.5"] });
  const color = useTransform(scrollYProgress, [0, 1], [MUTED, TEXT]);
  const y = useTransform(scrollYProgress, [0, 1], [18, 0]);

  return (
    <motion.p
      ref={ref}
      style={reduced ? { color: TEXT } : { color, y }}
      className="text-[clamp(26px,3.6vw,44px)] leading-[1.45] font-bold text-balance"
    >
      {children}
    </motion.p>
  );
}

export function ProblemLines({ lines }: { lines: string[] }) {
  return (
    <div className="mt-10 flex max-w-[860px] flex-col gap-10 md:mt-14 md:gap-16">
      {lines.map((line) => (
        <Line key={line}>{line}</Line>
      ))}
    </div>
  );
}
