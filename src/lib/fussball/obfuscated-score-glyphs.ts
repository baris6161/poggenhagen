/**
 * fussball.de zeigt Ergebnisse als Webfont-Glyphen (PUA) mit `data-obfuscation`.
 * Dieselbe Codepoint-Ziffer kann je nach Obfuscation-Key eine andere Zahl sein —
 * daher zuerst keyed lookup, sonst Legacy-Global-Map (nur wenn kein Key im HTML).
 *
 * Neuen Key: `data-obfuscation` aus dem HTML + Codepoints aus score-left/right
 * in GLYPH_BY_OBFUSCATION ergänzen.
 */
const GLYPH_BY_OBFUSCATION: Readonly<
  Record<string, Readonly<Record<number, number>>>
> = {
  // Unit-Tests / frühere Live-Samples
  "5tmjf3yg": { 0xe677: 0, 0xe69f: 2 },
  hgjsr0rp: { 0xe666: 0, 0xe65f: 2 },
  "8uakhw01": { 0xe679: 0, 0xe6af: 2 },
  zsct19kb: { 0xe679: 0, 0xe680: 2 },
  // Live fussball.de 2026-04 (Kolenfeld–Poggenhagen 0:2) — rotierende Keys
  ok0f6v3e: { 0xe698: 0, 0xe6a8: 2 },
  "8m1yupvd": { 0xe66f: 0, 0xe6ab: 2 },
};

/** Fallback nur sinnvoll, wenn kein `data-obfuscation` oder Key noch nicht in GLYPH_BY_OBFUSCATION. */
const GLYPH_CODEPOINT_TO_DIGIT: Readonly<Record<number, number>> = {
  // 0
  0xe652: 0,
  0xe660: 0,
  0xe663: 0,
  0xe666: 0,
  0xe676: 0,
  0xe677: 0,
  0xe679: 0,
  0xe65b: 0,
  0xe6ba: 0,
  // 1
  0xe654: 1,
  0xe6b0: 1,
  0xe67d: 1,
  0xe66f: 1,
  // 2
  0xe683: 2,
  0xe65f: 2,
  0xe69f: 2,
  0xe68c: 2,
  0xe6af: 2,
  0xe680: 2,
  // 3
  0xe6a9: 3,
  0xe6bb: 3,
  // 4
  0xe67f: 4,
  0xe69e: 4,
  // 5–9: bei Bedarf nachziehen
};

function extractCodepointsFromScoreInner(inner: string): number[] {
  const codes: number[] = [];
  const entityRe = /&#x([0-9a-fA-F]+);/g;
  let m: RegExpExecArray | null;
  while ((m = entityRe.exec(inner)) !== null) {
    codes.push(parseInt(m[1], 16));
  }
  if (codes.length > 0) return codes;
  for (const ch of inner) {
    const cp = ch.codePointAt(0);
    if (cp != null && cp >= 0xe000 && cp <= 0xf8ff) codes.push(cp);
  }
  return codes;
}

/** `data-obfuscation` aus dem öffnenden `<span … class="…score-left…">`. */
function extractObfuscationKeyFromScoreRowInner(inner: string): string | null {
  const idx = inner.search(/\bclass="[^"]*\bscore-left\b[^"]*"/i);
  if (idx < 0) return null;
  const spanStart = inner.lastIndexOf("<span", idx);
  if (spanStart < 0) return null;
  const spanEnd = inner.indexOf(">", spanStart);
  if (spanEnd < 0) return null;
  const openTag = inner.slice(spanStart, spanEnd + 1);
  return openTag.match(/\bdata-obfuscation="([^"]+)"/i)?.[1] ?? null;
}

function digitForGlyph(
  cp: number,
  obfuscationKey: string | null
): number | undefined {
  const table =
    obfuscationKey != null ? GLYPH_BY_OBFUSCATION[obfuscationKey] : undefined;
  if (table) {
    const v = table[cp];
    if (v !== undefined) return v;
    return undefined;
  }
  return GLYPH_CODEPOINT_TO_DIGIT[cp];
}

function digitsFromCodepoints(
  cps: number[],
  obfuscationKey: string | null
): number | null {
  if (cps.length === 0) return null;
  let s = "";
  for (const cp of cps) {
    const d = digitForGlyph(cp, obfuscationKey);
    if (d === undefined) return null;
    s += String(d);
  }
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

function parseObfuscatedScoreFromRowInner(inner: string): {
  home: number;
  away: number;
} | null {
  const leftM = inner.match(
    /<span[^>]*class="[^"]*score-left[^"]*"[^>]*>([\s\S]*?)<\/span>/i
  );
  const rightM = inner.match(
    /<span[^>]*class="[^"]*score-right[^"]*"[^>]*>([\s\S]*?)<\/span>/i
  );
  if (!leftM || !rightM) return null;

  const obfuscationKey = extractObfuscationKeyFromScoreRowInner(inner);
  const home = digitsFromCodepoints(
    extractCodepointsFromScoreInner(leftM[1]),
    obfuscationKey
  );
  const away = digitsFromCodepoints(
    extractCodepointsFromScoreInner(rightM[1]),
    obfuscationKey
  );
  if (home === null || away === null) return null;
  return { home, away };
}

/** Mannschaftsseite: Slider `div.match-score`. */
export function parseObfuscatedMatchScoreFromHtmlFragment(
  htmlFragment: string
): { home: number; away: number } | null {
  const scoreBlock = htmlFragment.match(
    /<div[^>]*class="[^"]*match-score[^"]*"[^>]*>([\s\S]*?)<\/div>/i
  );
  if (!scoreBlock) return null;
  return parseObfuscatedScoreFromRowInner(scoreBlock[1]);
}

/** Spielseite: `div.result` mit `score-left` / `score-right` unter `end-result`. */
export function parseObfuscatedResultScoreFromMatchPageHtml(
  html: string
): { home: number; away: number } | null {
  const resultBlock = html.match(
    /<div[^>]*class="[^"]*\bresult\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i
  );
  if (!resultBlock) return null;
  return parseObfuscatedScoreFromRowInner(resultBlock[1]);
}
