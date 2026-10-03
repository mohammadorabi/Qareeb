/**
 * Abstract dotted map of Europe + the Eastern Mediterranean.
 *
 * Land is a handful of hand-simplified coastline polygons in [lon, lat].
 * We sample a regular grid once at module load, keep points on land, and
 * emit them as a single SVG path ("M x y h0" segments drawn with round caps),
 * so ~1.5k dots cost one DOM node.
 */

type LonLat = readonly [number, number];
type Polygon = readonly LonLat[];

const LON_MIN = -11;
const LON_MAX = 43;
const LAT_MIN = 29.5;
const LAT_MAX = 63.5;
const SCALE = 20; // SVG units per degree of latitude
const LON_FACTOR = Math.cos((46 * Math.PI) / 180); // equirectangular at ~46°N
const STEP_LAT = 0.55;
const STEP_LON = STEP_LAT / LON_FACTOR; // square grid on screen

export const MAP_WIDTH = Math.round((LON_MAX - LON_MIN) * LON_FACTOR * SCALE);
export const MAP_HEIGHT = Math.round((LAT_MAX - LAT_MIN) * SCALE);
export const DOT_SIZE = 3.4;

export function project([lon, lat]: LonLat): { x: number; y: number } {
  return {
    x: (lon - LON_MIN) * LON_FACTOR * SCALE,
    y: (LAT_MAX - lat) * SCALE,
  };
}

/**
 * Eurasia + North Africa traced as one ring with the Mediterranean left
 * outside it (via Gibraltar), cropped to the view box on the north/east/south.
 */
const MAINLAND: Polygon = [
  // Iberian Atlantic coast, northwards from Gibraltar
  [-5.6, 36.0],
  [-6.4, 36.8],
  [-7.4, 37.2],
  [-8.9, 37.0],
  [-8.8, 38.5],
  [-9.5, 38.8],
  [-8.9, 40.2],
  [-8.8, 42.0],
  [-9.3, 42.9],
  [-8.2, 43.7],
  [-6.0, 43.6],
  [-3.8, 43.5],
  [-1.8, 43.4],
  // France
  [-1.3, 44.6],
  [-1.2, 46.2],
  [-2.2, 47.2],
  [-4.4, 47.9],
  [-4.7, 48.4],
  [-3.0, 48.8],
  [-1.6, 48.6],
  [-1.9, 49.7],
  [-1.2, 49.4],
  [0.2, 49.6],
  [1.4, 50.1],
  [1.6, 50.9],
  // Low countries, Jutland, south Baltic
  [2.6, 51.1],
  [3.6, 51.5],
  [4.4, 52.2],
  [4.8, 53.0],
  [6.0, 53.4],
  [7.2, 53.6],
  [8.5, 53.6],
  [8.9, 54.0],
  [8.6, 54.9],
  [8.2, 55.5],
  [8.1, 56.5],
  [8.6, 57.1],
  [10.6, 57.7],
  [10.4, 56.6],
  [10.9, 56.4],
  [9.8, 55.0],
  [10.0, 54.5],
  [11.0, 54.0],
  [12.3, 54.3],
  [13.4, 54.6],
  [14.2, 53.9],
  [16.0, 54.3],
  [17.5, 54.8],
  [18.6, 54.6],
  [19.5, 54.4],
  [20.6, 54.9],
  [21.2, 55.7],
  [21.1, 56.8],
  [21.6, 57.4],
  [22.6, 57.75],
  [23.5, 57.0],
  [24.3, 57.2],
  [24.4, 58.3],
  [23.5, 58.7],
  [23.6, 59.2],
  [24.8, 59.5],
  [26.5, 59.5],
  [28.0, 59.5],
  [29.8, 59.9],
  // Finland, up the Gulf of Bothnia to the crop line
  [27.5, 60.4],
  [25.5, 60.2],
  [23.0, 59.85],
  [21.4, 60.5],
  [21.4, 61.4],
  [21.5, 62.3],
  [21.3, 63.0],
  [21.6, 63.5],
  // Crop: north edge, east edge, south edge
  [43.5, 63.5],
  [43.5, 29.0],
  [-10.5, 29.0],
  // Moroccan Atlantic coast to Tangier
  [-9.8, 29.5],
  [-9.7, 30.6],
  [-9.8, 31.4],
  [-8.5, 33.3],
  [-6.8, 34.0],
  [-6.0, 35.5],
  [-5.9, 35.8],
  // North African Mediterranean coast, eastwards
  [-5.3, 35.9],
  [-4.4, 35.2],
  [-2.9, 35.3],
  [-1.2, 35.3],
  [0.0, 35.9],
  [1.5, 36.5],
  [3.0, 36.8],
  [5.0, 36.8],
  [7.8, 36.9],
  [9.8, 37.3],
  [11.1, 37.0],
  [10.5, 36.4],
  [10.8, 35.6],
  [10.1, 34.3],
  [10.9, 33.7],
  [12.0, 33.0],
  [13.2, 32.9],
  [15.2, 32.3],
  [15.8, 31.4],
  [18.0, 30.7],
  [19.6, 30.3],
  [20.1, 31.0],
  [20.0, 32.2],
  [21.5, 32.9],
  [23.0, 32.6],
  [25.0, 31.6],
  [27.3, 31.4],
  [29.9, 31.2],
  [31.2, 31.5],
  [32.3, 31.3],
  // Levant, Anatolia's south and Aegean coasts
  [34.2, 31.3],
  [34.9, 32.4],
  [35.1, 33.1],
  [35.5, 33.9],
  [35.9, 34.5],
  [35.8, 35.3],
  [35.8, 35.8],
  [36.0, 36.0],
  [36.2, 36.6],
  [35.6, 36.6],
  [34.6, 36.8],
  [33.5, 36.1],
  [32.5, 36.1],
  [31.5, 36.7],
  [30.5, 36.3],
  [29.3, 36.2],
  [28.2, 36.7],
  [27.4, 37.0],
  [27.2, 37.9],
  [26.4, 38.3],
  [26.8, 39.0],
  [26.2, 39.5],
  [26.2, 40.0],
  // Greece and the Balkans' Aegean / Ionian / Adriatic coasts
  [26.4, 40.6],
  [25.0, 40.9],
  [22.9, 40.6],
  [22.6, 40.3],
  [22.9, 39.4],
  [24.0, 38.2],
  [23.7, 37.9],
  [23.2, 37.5],
  [23.0, 36.5],
  [22.4, 36.4],
  [21.7, 36.8],
  [21.6, 37.6],
  [21.3, 38.2],
  [20.7, 38.9],
  [20.1, 39.6],
  [19.4, 40.3],
  [19.5, 41.8],
  [18.5, 42.4],
  [16.4, 43.5],
  [15.2, 44.3],
  [13.9, 44.8],
  [13.6, 45.7],
  // Italy
  [12.3, 45.4],
  [12.4, 44.3],
  [13.6, 43.5],
  [14.7, 42.1],
  [16.0, 41.5],
  [18.0, 40.6],
  [18.5, 40.1],
  [17.2, 40.5],
  [16.5, 39.6],
  [17.1, 39.0],
  [16.0, 38.0],
  [15.6, 38.3],
  [15.8, 39.6],
  [15.0, 40.2],
  [14.3, 40.6],
  [12.4, 41.6],
  [11.1, 42.4],
  [10.5, 43.4],
  [9.8, 44.1],
  [8.8, 44.4],
  // French Riviera and Spanish Mediterranean coast, back to Gibraltar
  [7.5, 43.8],
  [6.4, 43.1],
  [4.9, 43.4],
  [3.2, 43.2],
  [3.0, 42.4],
  [3.2, 41.9],
  [2.2, 41.4],
  [0.9, 41.0],
  [-0.3, 39.5],
  [0.2, 38.7],
  [-0.7, 37.6],
  [-2.1, 36.7],
  [-4.4, 36.7],
  [-5.3, 36.2],
];

const BLACK_SEA: Polygon = [
  [27.7, 42.5],
  [28.0, 43.4],
  [28.6, 44.3],
  [29.7, 45.2],
  [30.7, 46.4],
  [31.8, 46.6],
  [33.6, 46.1],
  [32.5, 45.4],
  [33.5, 44.5],
  [34.5, 44.5],
  [35.5, 45.1],
  [36.6, 45.4],
  [37.5, 44.7],
  [39.7, 43.6],
  [41.6, 41.6],
  [40.0, 41.0],
  [37.0, 41.2],
  [35.0, 42.0],
  [33.0, 41.9],
  [31.5, 41.3],
  [29.1, 41.2],
  [28.2, 41.5],
];

const ISLANDS: Polygon[] = [
  // Scandinavia (Norway + Sweden), cropped at the north edge
  [
    [8.0, 63.5],
    [6.0, 62.5],
    [5.0, 61.5],
    [4.9, 60.3],
    [5.6, 59.0],
    [6.5, 58.1],
    [8.0, 58.1],
    [9.5, 58.9],
    [10.5, 59.3],
    [11.1, 59.0],
    [11.2, 58.4],
    [11.9, 57.7],
    [12.6, 56.5],
    [12.9, 55.6],
    [14.2, 55.4],
    [14.8, 56.2],
    [16.4, 56.5],
    [16.6, 57.8],
    [18.0, 59.0],
    [18.5, 59.4],
    [18.9, 60.1],
    [17.2, 60.7],
    [17.4, 61.7],
    [17.6, 62.5],
    [18.5, 63.3],
    [19.0, 63.5],
  ],
  // Great Britain
  [
    [-5.7, 50.1],
    [-3.5, 50.4],
    [-1.0, 50.8],
    [1.4, 51.2],
    [1.7, 52.6],
    [0.3, 53.4],
    [-0.1, 54.2],
    [-1.6, 55.6],
    [-1.8, 57.5],
    [-3.4, 58.6],
    [-5.0, 58.6],
    [-5.8, 57.5],
    [-5.6, 56.3],
    [-4.9, 54.8],
    [-3.3, 54.9],
    [-3.0, 53.8],
    [-4.6, 53.3],
    [-4.1, 52.7],
    [-5.2, 51.8],
    [-3.2, 51.5],
  ],
  // Ireland
  [
    [-6.0, 52.2],
    [-6.2, 53.4],
    [-5.5, 54.6],
    [-7.3, 55.3],
    [-8.5, 54.5],
    [-10.0, 53.5],
    [-10.2, 52.0],
    [-8.5, 51.6],
  ],
  // Zealand
  [
    [11.0, 55.2],
    [12.6, 55.3],
    [12.5, 56.1],
    [11.2, 55.9],
  ],
  // Corsica, Sardinia, Sicily, Mallorca, Crete, Cyprus
  [
    [8.6, 41.4],
    [9.4, 41.4],
    [9.5, 43.0],
    [8.7, 42.6],
  ],
  [
    [8.4, 39.0],
    [9.6, 39.1],
    [9.8, 41.0],
    [8.2, 41.0],
  ],
  [
    [12.4, 37.8],
    [15.1, 36.7],
    [15.6, 38.2],
    [13.5, 38.2],
  ],
  [
    [2.4, 39.4],
    [3.4, 39.4],
    [3.3, 39.9],
    [2.5, 39.9],
  ],
  [
    [23.5, 35.2],
    [26.3, 35.0],
    [26.2, 35.4],
    [23.6, 35.6],
  ],
  [
    [32.3, 34.7],
    [34.0, 34.6],
    [34.6, 35.7],
    [33.0, 35.4],
  ],
];

/** Approximate outline of Syria, used only to warm-tint its dots. */
const SYRIA: Polygon = [
  [35.9, 34.6],
  [35.7, 35.1],
  [35.9, 35.9],
  [36.6, 36.8],
  [38.0, 36.85],
  [40.0, 36.9],
  [41.3, 37.1],
  [42.3, 37.3],
  [41.3, 36.4],
  [41.2, 34.5],
  [38.8, 33.4],
  [36.8, 32.3],
  [35.8, 32.7],
  [35.9, 33.3],
  [36.5, 34.6],
];

function inside([lon, lat]: LonLat, poly: Polygon): boolean {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

const isLand = (p: LonLat) =>
  (inside(p, MAINLAND) && !inside(p, BLACK_SEA)) || ISLANDS.some((poly) => inside(p, poly));

function buildDotPaths() {
  let land = "";
  let syria = "";
  for (let lat = LAT_MAX - STEP_LAT / 2; lat > LAT_MIN; lat -= STEP_LAT) {
    for (let lon = LON_MIN + STEP_LON / 2; lon < LON_MAX; lon += STEP_LON) {
      const p: LonLat = [lon, lat];
      if (!isLand(p)) continue;
      const { x, y } = project(p);
      const seg = `M${x.toFixed(1)} ${y.toFixed(1)}h0`;
      if (inside(p, SYRIA)) syria += seg;
      else land += seg;
    }
  }
  return { land, syria };
}

export const DOT_PATHS = buildDotPaths();

export type City = { id: string; label: string; at: { x: number; y: number } };

const city = (id: string, label: string, lonLat: LonLat): City => ({
  id,
  label,
  at: project(lonLat),
});

/** Arc pairs cycled in the hero, Europe → Syria. */
export const CITY_PAIRS: readonly { from: City; to: City }[] = [
  {
    from: city("berlin", "BERLIN", [13.4, 52.52]),
    to: city("damascus", "DAMASCUS", [36.29, 33.51]),
  },
  {
    from: city("stockholm", "STOCKHOLM", [18.07, 59.33]),
    to: city("aleppo", "ALEPPO", [37.16, 36.2]),
  },
  { from: city("amsterdam", "AMSTERDAM", [4.9, 52.37]), to: city("homs", "HOMS", [36.72, 34.73]) },
  {
    from: city("vienna", "VIENNA", [16.37, 48.21]),
    to: city("latakia", "LATAKIA", [35.78, 35.52]),
  },
  { from: city("paris", "PARIS", [2.35, 48.86]), to: city("hama", "HAMA", [36.75, 35.13]) },
];

/** Quadratic arc bowing north-east (up and away from the Mediterranean). */
export function arcPath(a: { x: number; y: number }, b: { x: number; y: number }): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  // Perpendicular pointing "up-right" on screen for a top-left → bottom-right arc.
  const bow = 0.28;
  const cx = mx + dy * bow;
  const cy = my - dx * bow;
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}
