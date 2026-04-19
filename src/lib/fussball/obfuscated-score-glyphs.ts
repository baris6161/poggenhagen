/**
 * fussball.de zeigt Ergebnisse oft als Webfont-Glyphen (PUA) mit `data-obfuscation`.
 * Ohne Browser-Font gibt es keine ASCII-Ziffern — Mapping aus kalibrierten Beispielen (Stand 2026-04).
 * Bei unbekanntem Codepoint: null (kein Fallback).
 *
 * Erweitern: weitere Codepoints ergänzen, sobald ein Spiel nicht dekodiert wird.
 */
const GLYPH_CODEPOINT_TO_DIGIT: Readonly<Record<number, number>> = {
  // 0
  0xe652: 0,
  0xe660: 0,
  0xe663: 0,
  0xe666: 0,
  0xe676: 0,
  0xe677: 0,
  0xe679: 0, // Team-/Spielseite z. B. Kolenfeld–Poggenhagen 0:2 (Obfuscation 8uakhw01 / zsct19kb, 2026-04)
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
  0xe6af: 2, // Mannschaftsseite match-score (Kolenfeld 0:2)
  0xe680: 2, // Spielseite end-result (gleiches Spiel, anderes Obfuscation-Token)
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

function digitsFromCodepoints(cps: number[]): number | null {
  if (cps.length === 0) return null;
  let s = "";
  for (const cp of cps) {
    const d = GLYPH_CODEPOINT_TO_DIGIT[cp];
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

  const home = digitsFromCodepoints(extractCodepointsFromScoreInner(leftM[1]));
  const away = digitsFromCodepoints(extractCodepointsFromScoreInner(rightM[1]));
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
