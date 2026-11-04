import { mk } from "./mk.ts";
export type Language = "en" | "mk";
export function translateText(input: string, language: Language): string {
  if (language === "en" || !input.trim()) return input;
  const key = input.replace(/\s+/g, " ").trim();
  let translated: string | undefined = Object.hasOwn(mk, key)
    ? mk[key]
    : undefined;
  if (!translated) {
    const count = key.match(
      /^(\d+) (Studio lessons? explored|first-year chapters? explored|references? reviewed|saved collections)$/,
    );
    if (count) translated = `${count[1]} ${translateText(count[2], language)}`;
    const chapter = key.match(/^(\d+) of 3 explored$/);
    if (chapter) translated = `${chapter[1]} од 3 истражени`;
    const intro = key.match(/^You’re on step (\d+) of 5\.$/);
    if (intro) translated = `На чекор ${intro[1]} од 5 сте.`;
    const room = key.match(
      /^(Explore|Review status:|Compare two routines:|Save|Remove) (.+)$/,
    );
    if (room)
      translated = `${translateText(room[1], language)} ${translateText(room[2], language)}`;
    const example = key.match(/^(.+) learning example$/);
    if (example)
      translated = `${translateText(example[1], language)} — пример за учење`;
    const retained = key.match(
      /^This routine retains the hazard\. Compare it with this alternative: (.+)$/,
    );
    if (retained)
      translated = `${translateText("This routine retains the hazard. Compare it with this alternative:", language)} ${translateText(retained[1], language)}`;
  }
  if (!translated) {
    if (typeof window !== "undefined" && /[A-Za-z]{2}/.test(key)) {
      const tracker = (
        window as Window & { __TINYSTEPS_I18N_MISSING__?: Set<string> }
      ).__TINYSTEPS_I18N_MISSING__;
      tracker?.add(key);
    }
    return input;
  }
  return (
    (input.match(/^\s*/)?.[0] || "") +
    translated +
    (input.match(/\s*$/)?.[0] || "")
  );
}
