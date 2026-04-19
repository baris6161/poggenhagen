import type { Match } from "@/data/matches";
import {
  CLUB_NAME,
  FUSSBALL_FETCH_HEADERS,
  FUSSBALL_FETCH_TIMEOUT_MS_TEAM,
  FUSSBALL_TEAM_PAGE_URL,
} from "./constants";
import { fetchWithTimeout } from "./fetch-with-timeout";
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
  const raw = process.env.FUSSBALL_TEAM_URL?.trim();
  if (!raw) return FUSSBALL_TEAM_PAGE_URL;
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") throw new Error("not_https");
    const host = u.hostname.toLowerCase();
    if (host !== "www.fussball.de" && host !== "fussball.de") {
      throw new Error("host_not_allowed");
    }
    return raw;
  } catch {
    console.error("[fussball] FUSSBALL_TEAM_URL ungueltig oder nicht erlaubt, Fallback auf Standard-URL");
    return FUSSBALL_TEAM_PAGE_URL;
  }
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

/** Diagnostik zum letzten `fetchFussballLiveDataset`-Lauf (ohne volle URLs). */
export type FussballFetchMeta = {
  teamPageHttpStatus: number;
  teamPageHtmlChars: number;
  lastLinkParsed: boolean;
  /** Tore aus Spielseite (Tor-Events oder Glyphen-Fallback im `div.result`) */
  goalsFromMatchPage: boolean;
  /** Torstand nur aus Mannschaftsseite (`div.match-score`), weil Spielseite kein verwertbares Ergebnis lieferte */
  goalsFromTeamPageSummary: boolean;
  /** Letztes URL-Segment der Spielseite (Match-ID), z. B. für Abgleich */
  lastMatchIdTail: string | null;
};

function safeMatchIdFromUrl(matchUrl: string): string | null {
  try {
    const path = new URL(matchUrl).pathname.replace(/\/+$/, "");
    const seg = path.split("/").filter(Boolean).pop();
    return seg ?? null;
  } catch {
    const parts = matchUrl.split("/").filter(Boolean);
    return parts.pop() ?? null;
  }
}

/**
 * Lädt Mannschaftsseite + bei Bedarf die Spielseite des letzten Spiels (Tor-Events).
 */
export async function fetchFussballLiveDataset(): Promise<{
  fixtures: Match[];
  tableData: ReturnType<typeof parseTableFromTeamHtml>;
  lastResult: Match | null;
  fetchMeta: FussballFetchMeta;
}> {
  const url = teamPageUrl();
  const res = await fetchWithTimeout(
    url,
    {
      headers: { ...FUSSBALL_FETCH_HEADERS },
    },
    FUSSBALL_FETCH_TIMEOUT_MS_TEAM
  );
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
  let goalsFromMatchPage = false;
  let goalsFromTeamPageSummary = false;
  if (lastLink) {
    const goals = await fetchGoalsFromMatchPage(lastLink.matchUrl, {
      headers: { ...FUSSBALL_FETCH_HEADERS },
    });
    if (goals) {
      goalsFromMatchPage = true;
      lastResult = lastLinkToResultMatch(lastLink, goals);
      if (!lastResult) {
        fussballDebug("lastLinkToResultMatch returned null after goals", {
          dateLabel: lastLink.dateLabel,
        });
      }
    } else {
      fussballDebug("no goals from match page", {
        matchUrlTail: lastLink.matchUrl.slice(-40),
      });
      if (lastLink.summaryScore) {
        goalsFromTeamPageSummary = true;
        lastResult = lastLinkToResultMatch(lastLink, lastLink.summaryScore);
        if (!lastResult) {
          fussballDebug("lastLinkToResultMatch null after team summaryScore", {
            dateLabel: lastLink.dateLabel,
          });
        }
      }
    }
  }

  fussballDebug("fetchFussballLiveDataset done", {
    lastResult: lastResult != null,
  });

  const fetchMeta: FussballFetchMeta = {
    teamPageHttpStatus: res.status,
    teamPageHtmlChars: html.length,
    lastLinkParsed: lastLink != null,
    goalsFromMatchPage,
    goalsFromTeamPageSummary,
    lastMatchIdTail: lastLink ? safeMatchIdFromUrl(lastLink.matchUrl) : null,
  };

  return { fixtures, tableData, lastResult, fetchMeta };
}
