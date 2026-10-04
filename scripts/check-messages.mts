/**
 * i18n parity check: every Arabic message has an English twin with the same
 * key path (and the same array lengths), and vice versa.
 *
 *   npm run check:i18n
 */
import { readdirSync, readFileSync } from "node:fs";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

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

const pairs: [string, string, string][] = [["base", "ar.json", "en.json"]];
for (const ns of readdirSync(new URL("sections/", root))) {
  pairs.push([ns, `sections/${ns}/ar.json`, `sections/${ns}/en.json`]);
}

let problems = 0;
for (const [name, arFile, enFile] of pairs) {
  const ar = new Set(paths(read(arFile)));
  const en = new Set(paths(read(enFile)));
  const report = (p: string, side: string) => {
    problems++;
    console.error(`✗ ${name}: missing in ${side} → ${p}`);
  };
  for (const p of ar) if (!en.has(p)) report(p, "en");
  for (const p of en) if (!ar.has(p)) report(p, "ar");
}

if (problems) {
  console.error(`\n${problems} i18n mismatch(es).`);
  process.exit(1);
}
console.log(`✓ i18n parity OK (${pairs.length} files per locale)`);
