"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Soft orange glow that follows a mouse pointer inside the hero.
 * Writes CSS variables directly (no React re-render per move).
 */
export function HeroGlow({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduced || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.setProperty("--glow", "1");
  };

  const onLeave = () => ref.current?.style.setProperty("--glow", "0");

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={className}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500"
        style={{
          opacity: "var(--glow, 0)",
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgb(242 100 26 / 0.09), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
