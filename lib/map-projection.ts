/**
 * Orthographic ("globe") projection centered on Syria.
 *
 * Shared by the build-time dot generator (scripts/generate-map-dots.mts)
 * and the runtime map, so cities always line up with the dots. Syria sits
 * at the exact center; the visible hemisphere reaches Toronto (~82° away).
 */

export const VIEW = 720; // square viewBox side
export const CENTER = VIEW / 2;
export const RADIUS = 340; // globe radius in viewBox units

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const LON0 = 37.0 * D2R; // central Syria
const LAT0 = 34.9 * D2R;

export type Point = { x: number; y: number };

/** [lon, lat] in degrees → viewBox point (callers only project visible-side points). */
export function project(lon: number, lat: number): Point {
  const φ = lat * D2R;
  const dλ = lon * D2R - LON0;
  return {
    x: CENTER + RADIUS * Math.cos(φ) * Math.sin(dλ),
    y:
      CENTER -
      RADIUS * (Math.cos(LAT0) * Math.sin(φ) - Math.sin(LAT0) * Math.cos(φ) * Math.cos(dλ)),
  };
}

/** viewBox point → [lon, lat] in degrees, or null outside the globe disc. */
export function unproject(x: number, y: number): [number, number] | null {
  const px = (x - CENTER) / RADIUS;
  const py = (CENTER - y) / RADIUS;
  const ρ = Math.hypot(px, py);
  if (ρ > 1) return null;
  if (ρ === 0) return [LON0 * R2D, LAT0 * R2D];
  const c = Math.asin(ρ);
  const φ = Math.asin(Math.cos(c) * Math.sin(LAT0) + (py * Math.sin(c) * Math.cos(LAT0)) / ρ);
  const λ =
    LON0 +
    Math.atan2(
      px * Math.sin(c),
      ρ * Math.cos(c) * Math.cos(LAT0) - py * Math.sin(c) * Math.sin(LAT0),
    );
  return [((λ * R2D + 540) % 360) - 180, φ * R2D];
}
