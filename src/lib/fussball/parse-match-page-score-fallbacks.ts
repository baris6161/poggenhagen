/**
 * ASCII-/JSON-Fallbacks für die fussball.de-Spielseite, wenn Tor-Events und
 * Webfont-Glyphen im `div.result` nicht greifen.
 */

const SCORE_TITLE_RE = /(\d{1,2})\s*[:.\-–]\s*(\d{1,2})/;

function normalizeTitleScoreLine(s: string): string | null {
  const t = s.replace(/\s+/g, " ").trim();
  const m = t.match(SCORE_TITLE_RE);
  if (!m) return null;
  const home = parseInt(m[1], 10);
  const away = parseInt(m[2], 10);
  if (!Number.isFinite(home) || !Number.isFinite(away)) return null;
  if (home < 0 || home > 99 || away < 0 || away > 99) return null;
  return `${home}:${away}`;
}

function extractTagInner(html: string, tag: "title" | "meta"): string[] {
  const out: string[] = [];
  if (tag === "title") {
    const re = /<title[^>]*>([^<]*)<\/title>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      if (m[1]) out.push(m[1].trim());
    }
    return out;
  }
  const re =
    /<meta[^>]+(?:property|name)="(?:og:title|twitter:title)"[^>]+content="([^"]*)"[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    if (m[1]) out.push(m[1].trim());
  }
  const re2 =
    /<meta[^>]+content="([^"]*)"[^>]+(?:property|name)="(?:og:title|twitter:title)"[^>]*>/gi;
  while ((m = re2.exec(html)) !== null) {
    if (m[1]) out.push(m[1].trim());
  }
  return out;
}

/** Konservativ: nur wenn alle gefundenen Titel/Meta denselben Stand liefern. */
export function parseScoreFromMetaTitles(html: string): {
  home: number;
  away: number;
} | null {
  const lines = [
    ...extractTagInner(html, "title"),
    ...extractTagInner(html, "meta"),
  ];
  const scores = new Set<string>();
  for (const line of lines) {
    const s = normalizeTitleScoreLine(line);
    if (s) scores.add(s);
  }
  if (scores.size !== 1) return null;
  const only = [...scores][0]!.split(":");
  return { home: parseInt(only[0]!, 10), away: parseInt(only[1]!, 10) };
}

function tryPairFromObject(o: unknown): { home: number; away: number } | null {
  if (o == null || typeof o !== "object") return null;
  const r = o as Record<string, unknown>;
  const pairs: [string, string][] = [
    ["homeScore", "awayScore"],
    ["heimtore", "gasttore"],
    ["home", "away"],
  ];
  for (const [hk, ak] of pairs) {
    const h = r[hk];
    const a = r[ak];
    if (typeof h === "number" && typeof a === "number") {
      if (h >= 0 && h <= 99 && a >= 0 && a <= 99) return { home: h, away: a };
    }
    if (typeof h === "string" && typeof a === "string") {
      const hn = parseInt(h, 10);
      const an = parseInt(a, 10);
      if (Number.isFinite(hn) && Number.isFinite(an) && hn >= 0 && hn <= 99 && an >= 0 && an <= 99)
        return { home: hn, away: an };
    }
  }
  const res = r.result;
  if (res && typeof res === "object") {
    const p = tryPairFromObject(res);
    if (p) return p;
  }
  return null;
}

function walkJsonForScore(node: unknown): { home: number; away: number } | null {
  const direct = tryPairFromObject(node);
  if (direct) return direct;
  if (Array.isArray(node)) {
    for (const el of node) {
      const p = walkJsonForScore(el);
      if (p) return p;
    }
    return null;
  }
  if (node != null && typeof node === "object") {
    const o = node as Record<string, unknown>;
    const t = o["@type"];
    const types = Array.isArray(t) ? t : t != null ? [t] : [];
    const isSports =
      types.some(
        (x) =>
          typeof x === "string" &&
          /SportsEvent|SportsGame|Event/i.test(x)
      ) || Object.keys(o).some((k) => /team|score|result|home|away/i.test(k));
    if (isSports) {
      const p = tryPairFromObject(o);
      if (p) return p;
    }
    for (const v of Object.values(o)) {
      const p = walkJsonForScore(v);
      if (p) return p;
    }
  }
  return null;
}

/** Alle `application/ld+json`-Blöcke durchsuchen (sehr defensiv). */
export function parseScoreFromJsonLd(html: string): {
  home: number;
  away: number;
} | null {
  const re = /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1]?.trim();
    if (!raw) continue;
    try {
      const data = JSON.parse(raw) as unknown;
      const p = walkJsonForScore(data);
      if (p) return p;
    } catch {
      continue;
    }
  }
  return null;
}

/** Nur Diagnose (Halbzeit ≠ Endstand) — nicht als Endergebnis verwenden. */
export function extractHalfResultBracketText(html: string): string | null {
  const m = html.match(
    /<span[^>]*class="[^"]*\bhalf-result\b[^"]*"[^>]*>\s*(\[[^\]]+\])\s*<\/span>/i
  );
  return m?.[1]?.trim() ?? null;
}

/** Sehr enger Fenster-Suchraum um `edSpielId` (nur wenn ein klares Zahlenpaar vorkommt). */
export function parseScoreNearEdSpielIdSnippet(html: string): {
  home: number;
  away: number;
} | null {
  const key = "edSpielId=";
  const i = html.indexOf(key);
  if (i < 0) return null;
  const window = html.slice(i, i + 8000);
  const m = window.match(/"heimtore"\s*:\s*(\d+)\s*,\s*"gasttore"\s*:\s*(\d+)/i);
  if (m) {
    const home = parseInt(m[1]!, 10);
    const away = parseInt(m[2]!, 10);
    if (home >= 0 && home <= 99 && away >= 0 && away <= 99) return { home, away };
  }
  const m2 = window.match(/"homeScore"\s*:\s*(\d+)\s*,\s*"awayScore"\s*:\s*(\d+)/i);
  if (m2) {
    const home = parseInt(m2[1]!, 10);
    const away = parseInt(m2[2]!, 10);
    if (home >= 0 && home <= 99 && away >= 0 && away <= 99) return { home, away };
  }
  return null;
}
