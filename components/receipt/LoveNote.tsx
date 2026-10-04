"use client";

import { useEffect, useRef, useState } from "react";

/**
 * «مع حبّي — من …» in handwriting. The city changes each time the receipt
 * re-enters the viewport (Berlin first, so server and client agree).
 */
export function LoveNote({ template, cities }: { template: string; cities: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [index, setIndex] = useState(0);
  const seen = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // First entry shows the first city; every later re-entry advances.
        if (seen.current) setIndex((i) => (i + 1) % cities.length);
        seen.current = true;
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [cities.length]);

  const [before, after] = template.split("{city}");

  return (
    <p
      ref={ref}
      className="-skew-x-6 font-hand text-[30px] leading-none text-orange-dark sm:text-[34px]"
      aria-live="off"
    >
      {before}
      <span
        key={index}
        className="inline-block animate-[fade-in_400ms_ease-out] motion-reduce:animate-none"
      >
        {cities[index]}
      </span>
      {after}
    </p>
  );
}
