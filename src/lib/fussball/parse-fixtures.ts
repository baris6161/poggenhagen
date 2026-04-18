import type { Match } from "@/data/matches";
import { CLUB_NAME } from "./constants";
import { venueForMatch } from "./venue";

function extractMatchplanTbody(html: string): string | null {
  const container = html.indexOf("fixtures-matches-table club-matchplan-table");
  if (container < 0) return null;
  const tb = html.indexOf("<tbody>", container);
  const te = html.indexOf("</tbody>", tb);
  if (tb < 0 || te < 0) return null;
  return html.slice(tb + "<tbody>".length, te);
}

/**
 * Datum aus Kopfzeile: „Sonntag, 19.04.2026 - 15:00 Uhr | Kreisliga“
 */
function parseHeadlineDateTime(line: string): { isoDate: string; time: string } | null {
  const dm = line.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  const tm = line.match(/-\s*(\d{2}:\d{2})\s*Uhr/);
  if (!dm || !tm) return null;
  const [, dd, mm, yyyy] = dm;
  const isoDate = `${yyyy}-${mm}-${dd}`;
  return { isoDate, time: tm[1] };
}

function extractSpielId(href: string): string | null {
  const m = href.match(/\/spiel\/([0-9A-Z]+)(?:\?|"|$)/i);
  return m ? m[1] : null;
}

/**
 * Nächste Spiele aus dem Spielplan-HTML (Mannschaftsseite oder Ajax-HTML).
 */
export function parseFixturesFromTeamHtml(html: string): Match[] {
  const inner = extractMatchplanTbody(html);
  if (!inner) return [];

  const blocks = inner.split('<tr class="row-headline visible-small">');
  const out: Match[] = [];

  for (const block of blocks.slice(1)) {
    const head = block.match(/<td colspan="6">([^<]+)<\/td>/);
    if (!head) continue;
    const dt = parseHeadlineDateTime(head[1]);
    if (!dt) continue;

    const clubNames = [
      ...block.matchAll(/<div class="club-name">\s*([^<]+?)\s*<\/div>/g),
    ].map((m) => m[1].trim());
    if (clubNames.length < 2) continue;

    const spielHref = block.match(
      /href="(https:\/\/www\.fussball\.de\/spiel\/[^"]+\/spiel\/[^"]+)"/
    );
    const spielId = spielHref ? extractSpielId(spielHref[1]) : null;
    if (!spielId) continue;

    const [homeTeam, awayTeam] = clubNames;

    out.push({
      id: spielId,
      homeTeam,
      awayTeam,
      date: dt.isoDate,
      time: dt.time,
      venue: venueForMatch(homeTeam, awayTeam),
      isHome: homeTeam === CLUB_NAME,
    });
  }

  out.sort((a, b) => {
    const ta = new Date(`${a.date}T${a.time}:00`).getTime();
    const tb = new Date(`${b.date}T${b.time}:00`).getTime();
    return ta - tb;
  });

  return out;
}
