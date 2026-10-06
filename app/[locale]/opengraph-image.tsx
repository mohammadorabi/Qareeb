import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { CSSProperties, ReactNode } from "react";
import { ImageResponse } from "next/og";
import { messages } from "@/i18n/messages";
import { dirOf, routing, type Locale } from "@/i18n/routing";
import { toVisualArabic } from "@/lib/arabic-visual";

/** Social share card per language (/ar, /en, /de), built at build time. */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static TTFs (the renderer can't read woff2), OFL — see assets/og/OFL-*.txt.
const font = (file: string) => readFile(join(process.cwd(), "assets/og", file));

const C = {
  bg: "#faf6f1",
  text: "#1f1d1b",
  text2: "#5c5852",
  orange: "#f2641a",
  orangeDark: "#d8500b",
  orangeInk: "#b4430a",
};

const asLocale = (value: string): Locale =>
  (routing.locales as readonly string[]).includes(value)
    ? (value as Locale)
    : routing.defaultLocale;

/**
 * A wrapping row of words. The renderer lays words out left to right, so in
 * RTL each word is its own item in a reversed row (see lib/arabic-visual.ts).
 */
function Row({
  rtl,
  gap,
  style,
  children,
}: {
  rtl: boolean;
  gap: number;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        flexDirection: rtl ? "row-reverse" : "row",
        columnGap: gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const words = (text: string, rtl: boolean) =>
  text.split(" ").map((w, i) => <span key={i}>{rtl ? toVisualArabic(w) : w}</span>);

export async function generateImageMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  return [{ id: "card", alt: messages[locale].meta.title, size, contentType }];
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const m = messages[locale];
  const rtl = dirOf(locale) === "rtl";

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: rtl ? "flex-end" : "flex-start",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "72px 80px",
        background: C.bg,
        color: C.text,
        fontFamily: rtl ? "Cairo, Outfit" : "Outfit, Cairo",
      }}
    >
      {/* The logo ring, large and faint, bleeding off the far edge. */}
      <div
        style={{
          position: "absolute",
          top: 150,
          [rtl ? "left" : "right"]: -170,
          width: 520,
          height: 520,
          borderRadius: 9999,
          border: `96px solid ${C.orange}`,
          opacity: 0.09,
        }}
      />

      <Row rtl={rtl} gap={18} style={{ alignItems: "center" }}>
        <svg width="46" height="50" viewBox="196 124 684 744">
          <circle cx="512" cy="440" r="246" fill="none" stroke={C.orange} strokeWidth="112" />
          <circle cx="512" cy="440" r="72" fill={C.orange} />
          <line
            x1="676"
            y1="603"
            x2="808"
            y2="798"
            stroke={C.text}
            strokeWidth="112"
            strokeLinecap="round"
          />
        </svg>
        <span style={{ fontSize: 40, fontWeight: 800 }}>
          {rtl ? toVisualArabic("قريب") : "qareeb"}
        </span>
        <span style={{ fontSize: 24, fontWeight: 500, color: C.text2 }}>
          {rtl ? "qareeb ·" : "· قريب"}
        </span>
      </Row>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: rtl ? "flex-end" : "flex-start",
          maxWidth: 960,
        }}
      >
        <Row
          rtl={rtl}
          gap={22}
          style={{
            alignItems: "baseline",
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: rtl ? 0 : -1,
          }}
        >
          {words(m.hero.titleLead, rtl)}
          {/* The accent and its dot (the full stop) never wrap apart. The dot sits
              on the baseline: Cairo's box puts it there, Outfit's needs a lift. */}
          <Row
            rtl={rtl}
            gap={6}
            style={{ alignItems: rtl ? "baseline" : "flex-end", color: C.orangeDark }}
          >
            <span>{rtl ? toVisualArabic(m.hero.titleAccent) : m.hero.titleAccent}</span>
            <span
              style={{
                width: 17,
                height: 17,
                marginBottom: rtl ? 0 : 24,
                borderRadius: 9999,
                background: C.orange,
              }}
            />
          </Row>
        </Row>
        <Row
          rtl={rtl}
          gap={rtl ? 9 : 8}
          style={{
            marginTop: 28,
            justifyContent: "flex-start",
            fontSize: 30,
            fontWeight: 500,
            lineHeight: 1.45,
            color: C.text2,
          }}
        >
          {words(m.meta.description, rtl)}
        </Row>
      </div>

      <Row
        rtl={rtl}
        gap={12}
        style={{
          alignItems: "center",
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: 3,
          color: C.orangeInk,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: 9999, background: C.orange }} />
        <span>{m.hero.eyebrow}</span>
      </Row>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Outfit", data: await font("Outfit-Medium.ttf"), weight: 500, style: "normal" },
        { name: "Outfit", data: await font("Outfit-ExtraBold.ttf"), weight: 800, style: "normal" },
        { name: "Cairo", data: await font("Cairo-Bold.ttf"), weight: 500, style: "normal" },
        { name: "Cairo", data: await font("Cairo-ExtraBold.ttf"), weight: 800, style: "normal" },
      ],
    },
  );
}
