import { parseObfuscatedMatchScoreFromHtmlFragment } from "./obfuscated-score-glyphs";

/**
 * Link und Teamnamen des „Letzten Spiels“ (oberer Slider auf der Mannschaftsseite).
 */
export type LastMatchLink = {
  matchUrl: string;
  homeTeam: string;
  awayTeam: string;
  /** z. B. „So, 12.04.2026“ */
  dateLabel: string;
  /** z. B. „15:00“ */
  time: string;
  /** Torstand aus `div.match-score` (Webfont-Glyphen), falls dekodierbar */
  summaryScore?: { home: number; away: number };
};

/** fussball.de oft mit `//www…` im href — für `fetch` immer https. */
export function normalizeFussballUrl(href: string): string {
  const t = href.trim();
  if (t.startsWith("//")) return `https:${t}`;
  if (/^https?:\/\//i.test(t)) return t.replace(/^http:\/\//i, "https://");
  if (t.startsWith("/")) return `https://www.fussball.de${t}`;
  return `https://${t.replace(/^\/+/, "")}`;
}

const HREF_IN_OPEN_A_RE =
  /^<a href="((?:https:\/\/|\/\/)(?:www\.)?fussball\.de\/spiel\/[^"]+\/spiel\/[0-9A-Z]+|\/spiel\/[^"]+\/spiel\/[0-9A-Z]+)"/i;

/** Quickview-Karte „Letztes Spiel“: `<a>` beginnt vor dem Marker; darin liegen Teams + `match-score`. */
function extractLetztesSpielQuickview(
  html: string,
  markerIdx: number
): { matchUrl: string; anchorStart: number; anchorEnd: number } | null {
  const anchorStart = html.lastIndexOf('<a href="', markerIdx);
  if (anchorStart < 0 || anchorStart < markerIdx - 4000) {
    return null;
  }
  const frag = html.slice(anchorStart, anchorStart + 700);
  const m = frag.match(HREF_IN_OPEN_A_RE);
  if (!m?.[1]) return null;
  const closeIdx = html.indexOf("</a>", anchorStart + 20);
  const anchorEnd =
    closeIdx > 0 && closeIdx < anchorStart + 5000 ? closeIdx + 4 : anchorStart + 2500;
  return { matchUrl: normalizeFussballUrl(m[1]), anchorStart, anchorEnd };
}

/** HTML nur der Quickview-Karte „Letztes Spiel“ (ein umschließendes `<a>…</a>`). */
export function getLetztesSpielQuickview(html: string): {
  matchUrl: string;
  slice: string;
} | null {
  const marker = "Letztes Spiel:";
  const markerIdx = html.indexOf(marker);
  if (markerIdx < 0) return null;
  const quickview = extractLetztesSpielQuickview(html, markerIdx);
  if (!quickview) return null;
  const { matchUrl, anchorStart, anchorEnd } = quickview;
  const slice = html.slice(anchorStart, Math.min(anchorEnd, html.length));
  return { matchUrl, slice };
}

export function parseLastMatchLink(html: string): LastMatchLink | null {
  const got = getLetztesSpielQuickview(html);
  if (!got) return null;
  const { matchUrl, slice } = got;
  const home = slice
    .match(/<span class="team-home">([^<]+)<\/span>/)?.[1]
    ?.trim();
  const away = slice
    .match(/<span class="team-away">([^<]+)<\/span>/)?.[1]
    ?.trim();
  if (!home || !away) return null;

  // Slice startet oft mitten im öffnenden <span> (indexOf auf „Letztes Spiel:“)
  // → nicht nur /<span>Letztes Spiel:/ erwarten.
  const dateM = slice.match(/Letztes Spiel:\s*([^<]+)<\/span>/);
  const dateLabel = (dateM?.[1] ?? "").trim();
  const timeM = slice.match(
    /<span>\s*(\d{2}:\d{2})\s*(?:&#124;|\|)/i
  );
  const time = timeM?.[1] ?? "15:00";

  const summaryScore = parseObfuscatedMatchScoreFromHtmlFragment(slice) ?? undefined;

  return {
    matchUrl,
    homeTeam: home,
    awayTeam: away,
    dateLabel,
    time,
    ...(summaryScore ? { summaryScore } : {}),
  };
}

/** Aus Text wie „So, 12.04.2026“ oder „12.04.26“ → ISO `YYYY-MM-DD`. */
export function parseGermanShortDateToIso(dateLabel: string): string | null {
  if (!dateLabel?.trim()) return null;
  const m4 = dateLabel.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (m4) {
    const [, dd, mm, yyyy] = m4;
    return `${yyyy}-${mm}-${dd}`;
  }
  const m2 = dateLabel.match(/(\d{2})\.(\d{2})\.(\d{2})\b/);
  if (m2) {
    const [, dd, mm, yy] = m2;
    const y = parseInt(yy, 10);
    const yyyy = y >= 60 ? 1900 + y : 2000 + y;
    return `${yyyy}-${mm}-${dd}`;
  }
  return null;
}
