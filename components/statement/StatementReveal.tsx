"use client";

import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const MUTED = "#8a857e"; // --text-muted
const TEXT = "#1f1d1b"; // --text
const ACCENT = "#d8500b"; // --orange-dark

/** Share of the scroll range one word takes to light up; neighbours overlap, so it reads as a wave. */
const FADE = 0.06;

const ACCENT_TAG = /<\/?accent>/g;

/** `glued`: joined to the word before by a no-break space (inside an accent phrase). */
type Token = { text: string; accent: boolean; glued: boolean; start: number; end: number };
type Block = { plain: string; closing: boolean; words: Token[] };

/**
 * Splits a message into words. `<accent>…</accent>` marks words that light up
 * orange (a word counts if any of it is marked, e.g. "tap</accent>."); an
 * accent phrase never wraps mid-way. A lone dash keeps to the word before it,
 * so no line starts with one. Splits on plain spaces only: a no-break space in
 * the copy keeps two words together.
 */
function splitWords(line: string, accentAll: boolean) {
  const words: { text: string; accent: boolean; glued: boolean }[] = [];
  let inAccent = false;
  for (const raw of line.split(/ +/)) {
    if (!raw) continue;
    const opens = raw.lastIndexOf("<accent>");
    const closes = raw.lastIndexOf("</accent>");
    const accent = accentAll || inAccent || opens >= 0;
    const glued = inAccent;
    if (opens >= 0 || closes >= 0) inAccent = opens > closes;
    const text = raw.replace(ACCENT_TAG, "");
    const prev = words.at(-1);
    if (prev && /^[\p{P}\p{S}]+$/u.test(text)) prev.text += `\u00a0${text}`;
    else words.push({ text, accent, glued });
  }
  return words;
}

/** Paragraphs, then the closing line (all accent). Words light up in reading order, paced by length. */
function layout(paragraphs: string[], closing: string): Block[] {
  const blocks = [
    ...paragraphs.map((line) => ({ line, closing: false })),
    { line: closing, closing: true },
  ].map(({ line, closing }) => ({
    plain: line.replace(ACCENT_TAG, ""),
    closing,
    words: splitWords(line, closing),
  }));

  const total = blocks.flatMap((b) => b.words).reduce((n, w) => n + w.text.length + 1, 0);
  let seen = 0;
  return blocks.map((b) => ({
    ...b,
    words: b.words.map((w) => {
      const start = (seen / total) * (1 - FADE);
      seen += w.text.length + 1;
      return { ...w, start, end: start + FADE };
    }),
  }));
}

function Word({
  word,
  progress,
  reduced,
}: {
  word: Token;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const lit = word.accent ? ACCENT : TEXT;
  const style = useTransform(progress, [word.start, word.end], {
    color: [MUTED, lit],
    opacity: [0.25, 1],
  });

  // Reduced motion: final colors. Opacity is set explicitly: motion doesn't
  // clear a style it wrote once the key is dropped.
  return (
    <motion.span style={reduced ? { color: lit, opacity: 1 } : style}>{word.text}</motion.span>
  );
}

/**
 * Large centered statement whose words go from faint to full color as it
 * scrolls through the viewport. Screen readers get each paragraph as one
 * plain sentence; the per-word spans are hidden from them.
 */
export function StatementReveal({
  paragraphs,
  closing,
}: {
  paragraphs: string[];
  closing: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.55"] });
  const blocks = layout(paragraphs, closing);

  return (
    <div
      ref={ref}
      className="mx-auto flex max-w-[860px] flex-col gap-8 text-center text-[clamp(26px,3.2vw,40px)] leading-[1.6] font-semibold"
    >
      {blocks.map((block) => (
        <p
          key={block.plain}
          className={block.closing ? "text-[1.15em] font-extrabold text-balance" : "text-pretty"}
        >
          <span className="sr-only select-none">{block.plain}</span>
          <span aria-hidden="true">
            {block.words.map((word, i) => (
              <Fragment key={i}>
                {i > 0 && (word.glued ? "\u00a0" : " ")}
                <Word word={word} progress={scrollYProgress} reduced={reduced} />
              </Fragment>
            ))}
          </span>
        </p>
      ))}
    </div>
  );
}
