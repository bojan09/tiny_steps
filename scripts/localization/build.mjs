import { format } from "prettier";
import { readFile, writeFile } from "node:fs/promises";
import { chapters, copy } from "../../lib/first-year/content.ts";
import {
  developmentCopy,
  developmentStages,
} from "../../lib/first-year/development.ts";
const catalog = {};
for (const line of (await readFile("lib/i18n/mk.tsv", "utf8")).split("\n")) {
  if (!line.trim()) continue;
  const [en, mk, ...extra] = line.split("\t");
  if (!mk || extra.length) throw new Error("Invalid catalog row: " + en);
  if (catalog[en] && catalog[en] !== mk)
    throw new Error("Conflicting translation: " + en);
  catalog[en] = mk;
}
for (const chapter of chapters)
  chapter.en.forEach((en, i) => (catalog[en] = chapter.mk[i]));
for (const key of Object.keys(copy.en)) catalog[copy.en[key]] = copy.mk[key];
for (const key of Object.keys(developmentCopy.en))
  catalog[developmentCopy.en[key]] = developmentCopy.mk[key];
for (const stage of developmentStages) {
  catalog[stage.en.title] = stage.mk.title;
  catalog[stage.en.activity] = stage.mk.activity;
  stage.en.examples.forEach((en, i) => (catalog[en] = stage.mk.examples[i]));
}
const generated = await format(
  "// Generated from mk.tsv and the existing bilingual first-year content.\nexport const mk: Record<string, string> = " +
    JSON.stringify(
      Object.fromEntries(
        Object.entries(catalog).sort(([a], [b]) =>
          a < b ? -1 : a > b ? 1 : 0,
        ),
      ),
      null,
      2,
    ) +
    ";\n",
  { parser: "typescript" },
);
if (process.argv.includes("--check")) {
  if ((await readFile("lib/i18n/mk.ts", "utf8")) !== generated)
    throw new Error("Generated translations are stale; run npm run i18n:build");
} else await writeFile("lib/i18n/mk.ts", generated);
console.log(Object.keys(catalog).length + " Macedonian messages");
