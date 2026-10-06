/**
 * i18n parity check: every Arabic message has an English and a German twin
 * with the same key path (and the same array lengths), and vice versa.
 *
 *   npm run check:i18n
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

/** Arabic is the reference; every other locale is compared against it. */
const LOCALES = ["ar", "en", "de"] as const;
const [REF, ...OTHERS] = LOCALES;

const root = new URL("../messages/", import.meta.url);
const read = (rel: string): Json => JSON.parse(readFileSync(new URL(rel, root), "utf8"));

function paths(value: Json, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return [
      `${prefix}[len=${value.length}]`,
      ...value.flatMap((v, i) => paths(v, `${prefix}[${i}]`)),
    ];
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => paths(v, prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

/** [name, file for a locale] — the base file, then one per section namespace. */
const groups: [string, (locale: string) => string][] = [["base", (l) => `${l}.json`]];
for (const ns of readdirSync(new URL("sections/", root))) {
  groups.push([ns, (l) => `sections/${ns}/${l}.json`]);
}

let problems = 0;
const report = (message: string) => {
  problems++;
  console.error(`✗ ${message}`);
};

for (const [name, file] of groups) {
  const missing = LOCALES.filter((l) => !existsSync(new URL(file(l), root)));
  if (missing.length) {
    for (const l of missing) report(`${name}: no ${file(l)}`);
    continue;
  }
  const ref = new Set(paths(read(file(REF))));
  for (const locale of OTHERS) {
    const other = new Set(paths(read(file(locale))));
    for (const p of ref) if (!other.has(p)) report(`${name}: missing in ${locale} → ${p}`);
    for (const p of other) if (!ref.has(p)) report(`${name}: missing in ${REF} → ${p}`);
  }
}

if (problems) {
  console.error(`\n${problems} i18n mismatch(es).`);
  process.exit(1);
}
console.log(`✓ i18n parity OK (${LOCALES.join(" ↔ ")}, ${groups.length} files per locale)`);
