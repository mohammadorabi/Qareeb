/**
 * Hero globe: land dots (pre-generated), cities, and arc geometry.
 * Dots come from scripts/generate-map-dots.mts; regenerate with `npm run generate:map`.
 */
import { LAND_DOTS, SYRIA_DOTS } from "./map-dots.generated";
import { CENTER, RADIUS, VIEW, project, type Point } from "./map-projection";

export { CENTER as MAP_CENTER, RADIUS as MAP_RADIUS, VIEW as MAP_SIZE };
export const DOT_PATHS = { land: LAND_DOTS, syria: SYRIA_DOTS };
export const DOT_SIZE = 3.2;

export type City = { id: string; label: string; at: Point };

// Rounded: Node (SSR) and the browser can differ in the last digits of
// Math.sin/cos, which would otherwise cause a hydration attribute mismatch.
const round = (n: number) => Math.round(n * 100) / 100;

const city = (id: string, label: string, lon: number, lat: number): City => {
  const { x, y } = project(lon, lat);
  return { id, label, at: { x: round(x), y: round(y) } };
};

const C = {
  berlin: city("berlin", "BERLIN", 13.4, 52.52),
  dubai: city("dubai", "DUBAI", 55.27, 25.2),
  istanbul: city("istanbul", "ISTANBUL", 28.98, 41.01),
  toronto: city("toronto", "TORONTO", -79.38, 43.65),
  riyadh: city("riyadh", "RIYADH", 46.72, 24.71),
  stockholm: city("stockholm", "STOCKHOLM", 18.07, 59.33),
  doha: city("doha", "DOHA", 51.53, 25.29),
  damascus: city("damascus", "DAMASCUS", 36.29, 33.51),
  aleppo: city("aleppo", "ALEPPO", 37.16, 36.2),
  homs: city("homs", "HOMS", 36.72, 34.73),
  latakia: city("latakia", "LATAKIA", 35.78, 35.52),
  hama: city("hama", "HAMA", 36.75, 35.13),
};

/** Diaspora city → Syrian city, cycled in the hero. */
export const CITY_PAIRS: readonly { from: City; to: City }[] = [
  { from: C.berlin, to: C.damascus },
  { from: C.dubai, to: C.aleppo },
  { from: C.istanbul, to: C.homs },
  { from: C.toronto, to: C.latakia },
  { from: C.riyadh, to: C.hama },
  { from: C.stockholm, to: C.damascus },
  { from: C.doha, to: C.aleppo },
];

const ARC_LIFT = 0.22; // peak height as a fraction of the route length…
const ARC_MIN_LIFT = 22; // …but never flatter than this (viewBox units), for short routes

/** Quadratic arc lifting "up" off the globe, height proportional to distance. */
export function arcPath(a: Point, b: Point): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  // Unit normal; pick the one pointing up on screen.
  let nx = dy / len;
  let ny = -dx / len;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  // A quadratic's peak sits halfway to its control point.
  const offset = 2 * Math.max(len * ARC_LIFT, ARC_MIN_LIFT);
  const cx = (a.x + b.x) / 2 + nx * offset;
  const cy = (a.y + b.y) / 2 + ny * offset;
  const f = (n: number) => n.toFixed(1);
  return `M${f(a.x)} ${f(a.y)}Q${f(cx)} ${f(cy)} ${f(b.x)} ${f(b.y)}`;
}
