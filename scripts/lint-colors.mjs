#!/usr/bin/env node
/**
 * Lint script that fails when forbidden literal Tailwind color classes
 * appear under `app/` or `components/`. The Apple-style soft-light theme
 * still requires structural fills/text to go through brand-token classes
 * (bg-card, text-foreground, text-muted-foreground, bg-muted,
 * border-border) so admin-configured brand colors take effect.
 *
 * Allowed: status-color tinted classes such as `bg-emerald-100
 * text-emerald-700` — these are the idiomatic light-theme badge/notice
 * pattern and do not need to be themeable.
 *
 * Forbidden: neutral greys (gray/slate/zinc/neutral/stone), legacy
 * `bg-white` / `text-black`, and the deleted `background-secondary`
 * token.
 *
 * Usage: `node scripts/lint-colors.mjs` — exits non-zero with a list of
 * offending lines, or zero if clean.
 */

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SEARCH_DIRS = ["app", "components"];

// Forbidden patterns. Match whole class tokens to avoid false positives on
// `bg-white/something-else` (we accept opacity/alpha modifiers).
//
// Status-color classes (e.g. `bg-emerald-100 text-emerald-700`) are
// intentionally allowed — they are the idiomatic light-theme badge/notice
// pattern and do not need to be themeable. Neutral greys are still
// forbidden because they bypass the `--muted-foreground` / `--border`
// tokens that admins can rebrand.
const FORBIDDEN = [
  /\bbg-white\b/g,
  /\btext-black\b/g,
  /\bbg-(?:gray|slate|zinc|neutral|stone)-\d+\b/g,
  /\btext-(?:gray|slate|zinc|neutral|stone)-\d+\b/g,
  /\bborder-(?:gray|slate|zinc|neutral|stone)-\d+\b/g,
  /\bbackground-secondary\b/g,
];

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else if (/\.(tsx?|jsx?|css)$/.test(entry.name)) {
      yield fullPath;
    }
  }
}

const offenders = [];

for (const dirName of SEARCH_DIRS) {
  const dir = path.join(ROOT, dirName);
  for await (const file of walk(dir)) {
    const text = await readFile(file, "utf8");
    const lines = text.split(/\r?\n/);
    lines.forEach((line, idx) => {
      for (const re of FORBIDDEN) {
        re.lastIndex = 0;
        const match = re.exec(line);
        if (match) {
          offenders.push({
            file: path.relative(ROOT, file),
            line: idx + 1,
            match: match[0],
            text: line.trim(),
          });
          break;
        }
      }
    });
  }
}

if (offenders.length === 0) {
  console.log("lint:colors — clean (no forbidden color classes)");
  process.exit(0);
}

console.error(`lint:colors — ${offenders.length} offending line(s):\n`);
for (const o of offenders) {
  console.error(`  ${o.file}:${o.line}  [${o.match}]  ${o.text}`);
}
process.exit(1);
