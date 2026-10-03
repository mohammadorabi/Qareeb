"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { ComponentPropsWithoutRef, PointerEvent } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const STRENGTH = 0.25; // fraction of the pointer offset the button follows
const MAX_SHIFT = 8; // px
const SPRING = { stiffness: 260, damping: 18, mass: 0.4 };

const clamp = (v: number) => Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, v));

/** A <button> that leans toward a fine pointer (mouse/trackpad) only. */
export function MagneticButton({
  onPointerMove,
  onPointerLeave,
  ...props
}: ComponentPropsWithoutRef<typeof motion.button>) {
  const reduced = usePrefersReducedMotion();
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  const handleMove = (e: PointerEvent<HTMLButtonElement>) => {
    onPointerMove?.(e);
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(clamp((e.clientX - (r.left + r.width / 2)) * STRENGTH));
    y.set(clamp((e.clientY - (r.top + r.height / 2)) * STRENGTH));
  };

  const handleLeave = (e: PointerEvent<HTMLButtonElement>) => {
    onPointerLeave?.(e);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      style={{ x, y }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...props}
    />
  );
}
