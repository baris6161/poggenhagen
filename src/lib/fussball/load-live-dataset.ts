import type { Match } from "@/data/matches";
import { CLUB_NAME, FUSSBALL_FETCH_HEADERS, FUSSBALL_TEAM_PAGE_URL } from "./constants";
import { fussballDebug } from "./debug-log";
import { fetchGoalsFromMatchPage } from "./match-score";
import {
  parseGermanShortDateToIso,
  parseLastMatchLink,
} from "./parse-last-match";
import { parseFixturesFromTeamHtml } from "./parse-fixtures";
import { parseTableFromTeamHtml } from "./parse-table";
import { venueForMatch } from "./venue";

function teamPageUrl(): string {
  return process.env.FUSSBALL_TEAM_URL?.trim() || FUSSBALL_TEAM_PAGE_URL;
}

function lastLinkToResultMatch(
  link: NonNullable<ReturnType<typeof parseLastMatchLink>>,
  goals: { home: number; away: number }
): Match | null {
  const date = parseGermanShortDateToIso(link.dateLabel);
  if (!date) {
    fussballDebug("lastLinkToResultMatch date parse failed", {
      dateLabel: link.dateLabel,
    });
    return null;
  }
  const id =
    link.matchUrl.split("/").filter(Boolean).pop() ?? `fb-${date}`;

  return {
    id,
    homeTeam: link.homeTeam,
    awayTeam: link.awayTeam,
    date,
    time: link.time,
    venue: venueForMatch(link.homeTeam, link.awayTeam),
    isHome: link.homeTeam.trim() === CLUB_NAME,
    result: { home: goals.home, away: goals.away },
  };
}

/**
 * Lädt Mannschaftsseite + bei Bedarf die Spielseite des letzten Spiels (Tor-Events).
 */
export async function fetchFussballLiveDataset(): Promise<{
  fixtures: Match[];
  tableData: ReturnType<typeof parseTableFromTeamHtml>;
  lastResult: Match | null;
}> {
  const url = teamPageUrl();
  const res = await fetch(url, {
    headers: { ...FUSSBALL_FETCH_HEADERS },
  });
  fussballDebug("team page fetch", { status: res.status, urlLen: url.length });
  if (!res.ok) {
    throw new Error(`FUSSBALL_TEAM_HTTP_${res.status}`);
  }
  const html = await res.text();

  const fixtures = parseFixturesFromTeamHtml(html);
  const tableData = parseTableFromTeamHtml(html);
  const lastLink = parseLastMatchLink(html);

  fussballDebug("team page parsed", {
    htmlLen: html.length,
    fixtures: fixtures.length,
    tableRows: tableData.length,
    lastLink: lastLink != null,
    lastMatchUrlTail: lastLink?.matchUrl?.slice(-40),
  });

  if (!lastLink) {
    const idx = html.indexOf("Letztes Spiel:");
    fussballDebug("parseLastMatchLink returned null", {
      markerIndex: idx,
    });
  }

  let lastResult: Match | null = null;
  if (lastLink) {
    const goals = await fetchGoalsFromMatchPage(lastLink.matchUrl, {
      headers: { ...FUSSBALL_FETCH_HEADERS },
    });
    if (!goals) {
      fussballDebug("no goals from match page", {
        matchUrlTail: lastLink.matchUrl.slice(-40),
      });
    }
    if (goals) {
      lastResult = lastLinkToResultMatch(lastLink, goals);
      if (!lastResult) {
        fussballDebug("lastLinkToResultMatch returned null after goals", {
          dateLabel: lastLink.dateLabel,
        });
      }
    }
  }

  fussballDebug("fetchFussballLiveDataset done", {
    lastResult: lastResult != null,
  });

  return { fixtures, tableData, lastResult };
}
