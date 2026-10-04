import type { ReactNode } from "react";

/**
 * CSS-built phone: 360×780 (9:19.5), 44px radius, notch. Purely
 * illustrative (aria-hidden); the step text next to it carries the content.
 * Size with `className` zoom utilities, never by changing the width, so the
 * screen UI keeps its 22px-padding / 14–15px-type proportions.
 */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative h-[780px] w-[360px] shrink-0 rounded-[44px] bg-text p-[9px] shadow-[0_40px_80px_-30px_rgb(31_29_27/0.45),inset_0_0_0_1.5px_rgb(255_255_255/0.08)] ${className ?? ""}`}
    >
      <div className="relative isolate h-full overflow-hidden rounded-[35px] bg-bg">
        <div className="absolute top-[10px] left-1/2 z-30 h-[27px] w-[100px] -translate-x-1/2 rounded-pill bg-text" />
        {children}
      </div>
    </div>
  );
}
