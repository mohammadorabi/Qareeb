"use client";

import { useId, useState } from "react";
import { PlusIcon } from "@/components/ui/icons";

type Item = { q: string; a: string };

/**
 * Accessible accordion: real buttons with aria-expanded/aria-controls, one
 * panel open at a time. Height animates via grid rows (0fr → 1fr); closed
 * panels are `inert` so their content is skipped by keyboard and screen readers.
 */
export function Accordion({ items }: { items: Item[] }) {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="divide-y divide-border border-y border-border">
      {items.map((item, i) => {
        const expanded = open === i;
        const buttonId = `${uid}-q${i}`;
        const panelId = `${uid}-a${i}`;
        return (
          <li key={item.q}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-start text-[18px] font-bold text-text transition-colors hover:text-orange-ink md:text-[20px]"
              >
                {item.q}
                <span
                  aria-hidden="true"
                  className={`grid size-9 shrink-0 place-items-center rounded-pill border transition-[rotate,background-color,border-color] duration-300 motion-reduce:transition-none ${
                    expanded
                      ? "rotate-45 border-orange bg-orange text-white"
                      : "border-border bg-card text-text"
                  }`}
                >
                  <PlusIcon className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!expanded}
              className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-[62ch] pe-14 pb-6 text-[16px] leading-[1.8] text-text-2 md:text-[17px]">
                  {item.a}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
