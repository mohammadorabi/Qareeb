"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Every Framer Motion animation honors the OS "reduce motion" setting. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
