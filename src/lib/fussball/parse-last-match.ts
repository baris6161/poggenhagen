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

/**
 * Der Spiel-Link steht im Markup VOR dem Text „Letztes Spiel:“ (innerhalb desselben <a>).
 * Nicht den ersten href NACH dem Marker nehmen — das wäre oft „Nächstes Spiel“.
 */
function extractLetztesSpielMatchUrl(html: string, markerIdx: number): string | null {
  const anchorIdx = html.lastIndexOf('<a href="', markerIdx);
  if (anchorIdx < 0 || anchorIdx < markerIdx - 4000) {
    return null;
  }
  const frag = html.slice(anchorIdx, anchorIdx + 700);
  const m = frag.match(HREF_IN_OPEN_A_RE);
  return m?.[1] ? normalizeFussballUrl(m[1]) : null;
}

export function parseLastMatchLink(html: string): LastMatchLink | null {
  const marker = "Letztes Spiel:";
  const markerIdx = html.indexOf(marker);
  if (markerIdx < 0) return null;

  const matchUrl = extractLetztesSpielMatchUrl(html, markerIdx);
  if (!matchUrl) return null;

  const slice = html.slice(markerIdx, markerIdx + 3500);
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

  return {
    matchUrl,
    homeTeam: home,
    awayTeam: away,
    dateLabel,
    time,
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
