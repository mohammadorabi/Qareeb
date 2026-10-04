"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const MAX_TILT = 4; // degrees

/**
 * Gentle 3D tilt toward a mouse pointer (pointer:fine only, never with
 * reduced motion). Writes the transform directly — no re-render per move.
 */
export function TiltTile({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduced || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * 2 * MAX_TILT).toFixed(2)}deg) rotateY(${(px * 2 * MAX_TILT).toFixed(2)}deg)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`transition-transform duration-300 ease-out will-change-transform ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
