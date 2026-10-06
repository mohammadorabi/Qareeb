/**
 * Arabic for the OG image renderer (next/og). It shapes Arabic letters when
 * drawing but measures them unshaped, so every word gets a gap after it, and
 * it lays words out left to right. Handing it pre-shaped text (Unicode
 * presentation forms) in visual order fixes both; words still go in a
 * reversed flex row. Covers the basic Arabic letters and lam-alef; harakat
 * are dropped. Not for the page itself: browsers shape Arabic correctly.
 *
 * Two renderer details this relies on: Cairo has no glyphs for the isolated
 * presentation forms, so isolated letters stay base letters (same glyph); and
 * the renderer reverses every run of base Arabic characters itself, so those
 * runs are left in logical order.
 */

const HARAKAT = /[\u064B-\u065F\u0670]/g;
const TATWEEL = "\u0640";

// Presentation Forms-B lists the letters U+0621–U+064A (without U+063B–U+0640)
// in order, each with [isolated, final] or [isolated, final, initial, medial].
const DUAL_JOINING = new Set("ئبتثجحخسشصضطظعغفقكلمنهي");
const FORMS = new Map<string, number[]>();
{
  let next = 0xfe80;
  for (let cp = 0x0621; cp <= 0x064a; cp++) {
    if (cp >= 0x063b && cp <= 0x0640) continue;
    const ch = String.fromCodePoint(cp);
    const count = ch === "ء" ? 1 : DUAL_JOINING.has(ch) ? 4 : 2;
    FORMS.set(
      ch,
      Array.from({ length: count }, (_, i) => next + i),
    );
    next += count;
  }
}

/** Lam + alef ligatures: [isolated, final]. */
const LAM_ALEF: Record<string, [number, number]> = {
  آ: [0xfef5, 0xfef6],
  أ: [0xfef7, 0xfef8],
  إ: [0xfef9, 0xfefa],
  ا: [0xfefb, 0xfefc],
};

const joinsNext = (ch: string | undefined) =>
  ch === TATWEEL || (ch !== undefined && FORMS.get(ch)?.length === 4);
const joinsPrev = (ch: string | undefined) =>
  ch === TATWEEL || (ch !== undefined && FORMS.has(ch) && ch !== "ء");

const ARABIC = /[\u0600-\u06FF]/;
/** What the renderer treats as an Arabic run (and reverses). */
const RENDERER_ARABIC_RUN = /[\u0600-\u065F\u066A-\u06D2\u06FA-\u06FF]+/g;

/** One word, shaped and in visual (left-to-right) order; non-Arabic words are left as they are. */
export function toVisualArabic(word: string): string {
  if (!ARABIC.test(word)) return word;
  const chars = [...word.replace(HARAKAT, "")];
  const out: string[] = [];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const forms = FORMS.get(ch);
    const prev = i > 0 && joinsNext(chars[i - 1]) && joinsPrev(ch);
    const ligature = ch === "ل" ? LAM_ALEF[chars[i + 1]] : undefined;
    if (ligature) {
      out.push(String.fromCodePoint(ligature[prev ? 1 : 0]));
      i++;
      continue;
    }
    if (!forms) {
      out.push(ch);
      continue;
    }
    const next = joinsNext(ch) && joinsPrev(chars[i + 1]);
    const form = prev && next ? 3 : next ? 2 : prev ? 1 : 0;
    out.push(form === 0 ? ch : String.fromCodePoint(forms[form]));
  }
  const visual = out.reverse().join("");
  return visual.replace(RENDERER_ARABIC_RUN, (run) => [...run].reverse().join(""));
}
