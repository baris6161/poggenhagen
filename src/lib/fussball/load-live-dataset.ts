import type { Match } from "@/data/matches";
import {
  CLUB_NAME,
  FUSSBALL_FETCH_HEADERS,
  FUSSBALL_FETCH_TIMEOUT_MS_TEAM,
  FUSSBALL_TEAM_PAGE_URL,
} from "./constants";
import { fetchWithTimeout } from "./fetch-with-timeout";
import { fussballDebug } from "./debug-log";
import {
  fetchGoalsFromMatchPage,
  type FetchMatchGoalsOutcome,
} from "./match-score";
import {
  parseGermanShortDateToIso,
  parseLastMatchLink,
  getLetztesSpielQuickview,
} from "./parse-last-match";
import { parseFixturesFromTeamHtml } from "./parse-fixtures";
import { parseTableFromTeamHtml } from "./parse-table";
import { venueForMatch } from "./venue";
import type { MatchScoreGlyphPeek } from "./obfuscated-score-glyphs";
import { peekMatchScoreGlyphDiagnosticsFromQuickviewHtml } from "./obfuscated-score-glyphs";
import type { ScoreSource } from "./score-source";

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

/**
 * Notfall-Override ohne Deploy: JSON `{"home":0,"away":2}` — nur wenn `lastResult`
 * sonst null und `parseLastMatchLink` ok.
 * In Vercel als Umgebungsvariable setzen; danach wieder entfernen.
 */
function parseLastResultOverrideFromEnv(): { home: number; away: number } | null {
  const raw = process.env.POGGE_LAST_RESULT_OVERRIDE?.trim();
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as unknown;
    if (typeof o !== "object" || o == null) return null;
    const r = o as Record<string, unknown>;
    const home = Number(r.home);
    const away = Number(r.away);
    if (!Number.isFinite(home) || !Number.isFinite(away)) return null;
    if (home < 0 || home > 99 || away < 0 || away > 99) return null;
    return { home, away };
  } catch {
    return null;
  }
}

/** Diagnostik zum letzten `fetchFussballLiveDataset`-Lauf (ohne volle URLs). */
export type FussballFetchMeta = {
  teamPageHttpStatus: number;
  teamPageHtmlChars: number;
  lastLinkParsed: boolean;
  /** Torstand von der Spielseite (beliebige Fallback-Stufe in fetchGoalsFromMatchPage) */
  goalsFromMatchPage: boolean;
  /** Torstand nur aus Mannschaftsseite (`div.match-score`), weil Spielseite kein verwertbares Ergebnis lieferte */
  goalsFromTeamPageSummary: boolean;
  /** Letztes URL-Segment der Spielseite (Match-ID), z. B. für Abgleich */
  lastMatchIdTail: string | null;
  /** Finale Quelle für `lastResult` */
  lastResultScoreSource: ScoreSource;
  /** `data-obfuscation` der Team-Quickview `match-score` */
  teamObfuscationKey: string | null;
  /** `data-obfuscation` im `div.result` der Spielseite (wenn HTML geholt) */
  matchObfuscationKey: string | null;
  /** Kurz: Keys + Hex-Glyphen für Discord */
  glyphDiagSummary: string | null;
  /** Halbzeit-Snippet nur zur Diagnose, kein Endergebnis */
  halfResultDiagnostic: string | null;
  /** `POGGE_LAST_RESULT_OVERRIDE` aktiv und genutzt */
  envOverrideActive: boolean;
  /** Copy-Paste-Hinweis Team-Quickview-Glyphen (kurz) */
  teamGlyphMappingHint: string | null;
  /** Copy-Paste-Hinweis Spielseite `div.result` (kurz) */
  matchGlyphMappingHint: string | null;
  /** Kurztext, wenn letztes Spiel-Link da ist, aber kein `lastResult` (Logs/Discord). */
  lastResultMissDetail: string | null;
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

function buildGlyphDiagSummary(
  teamKey: string | null,
  teamLeft: string | null,
  teamRight: string | null,
  matchKey: string | null,
  matchLeft: string | null,
  matchRight: string | null
): string | null {
  const parts: string[] = [];
  if (teamKey != null || teamLeft || teamRight) {
    parts.push(
      `Team key=${teamKey ?? "—"} L=${teamLeft ?? "—"} R=${teamRight ?? "—"}`
    );
  }
  if (matchKey != null || matchLeft || matchRight) {
    parts.push(
      `Spiel key=${matchKey ?? "—"} L=${matchLeft ?? "—"} R=${matchRight ?? "—"}`
    );
  }
  const s = parts.join(" | ");
  return s.length > 0 ? s.slice(0, 900) : null;
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

  const quick = getLetztesSpielQuickview(html);
  const teamPeek = quick
    ? peekMatchScoreGlyphDiagnosticsFromQuickviewHtml(quick.slice)
    : null;

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
  let lastResultScoreSource: ScoreSource = "none";
  let matchObfuscationKey: string | null = null;
  let halfResultDiagnostic: string | null = null;
  let envOverrideActive = false;
  let matchGlyphPeek: MatchScoreGlyphPeek | null = null;
  let lastMatchPageOutcome: FetchMatchGoalsOutcome | undefined;

  if (lastLink) {
    const matchOutcome = await fetchGoalsFromMatchPage(lastLink.matchUrl, {
      headers: { ...FUSSBALL_FETCH_HEADERS },
    });
    lastMatchPageOutcome = matchOutcome;
    matchObfuscationKey = matchOutcome.matchObfuscationKey;
    halfResultDiagnostic = matchOutcome.halfResultDiagnostic;
    matchGlyphPeek = matchOutcome.matchGlyphPeek;

    if (matchOutcome.goals) {
      goalsFromMatchPage = true;
      lastResultScoreSource = matchOutcome.source;
      lastResult = lastLinkToResultMatch(lastLink, matchOutcome.goals);
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
        lastResultScoreSource = "team_summary_glyphs";
        lastResult = lastLinkToResultMatch(lastLink, lastLink.summaryScore);
        if (!lastResult) {
          fussballDebug("lastLinkToResultMatch null after team summaryScore", {
            dateLabel: lastLink.dateLabel,
          });
        }
      } else {
        const ov = parseLastResultOverrideFromEnv();
        if (ov) {
          lastResult = lastLinkToResultMatch(lastLink, ov);
          if (lastResult) {
            envOverrideActive = true;
            lastResultScoreSource = "env_override";
          } else {
            fussballDebug("lastLinkToResultMatch null after env override", {
              dateLabel: lastLink.dateLabel,
            });
          }
        }
      }
    }
  }

  fussballDebug("fetchFussballLiveDataset done", {
    lastResult: lastResult != null,
    lastResultScoreSource,
  });

  let lastResultMissDetail: string | null = null;
  if (lastLink && !lastResult) {
    const trace = lastMatchPageOutcome?.scoreLookupTrace;
    const hadOverrideEnv = parseLastResultOverrideFromEnv() != null;
    console.warn("[pogge:fussball] lastResult missing after live fetch", {
      homeTeam: lastLink.homeTeam,
      awayTeam: lastLink.awayTeam,
      dateLabel: lastLink.dateLabel,
      matchUrlTail: lastLink.matchUrl.slice(-48),
      hadTeamSummaryScore: !!lastLink.summaryScore,
      hadEnvOverrideJson: hadOverrideEnv,
      scoreLookupTrace: trace ?? null,
    });
    lastResultMissDetail = [
      `${lastLink.homeTeam} vs ${lastLink.awayTeam}`,
      lastLink.dateLabel,
      `teamSummary=${lastLink.summaryScore ? "y" : "n"}`,
      `overrideEnv=${hadOverrideEnv ? "y" : "n"}`,
      trace ? JSON.stringify(trace) : "no_trace",
    ]
      .join(" | ")
      .slice(0, 950);
  }

  const glyphDiagSummary = buildGlyphDiagSummary(
    teamPeek?.obfuscationKey ?? null,
    teamPeek?.leftHex ?? null,
    teamPeek?.rightHex ?? null,
    matchGlyphPeek?.obfuscationKey ?? matchObfuscationKey,
    matchGlyphPeek?.leftHex ?? null,
    matchGlyphPeek?.rightHex ?? null
  );

  const fetchMeta: FussballFetchMeta = {
    teamPageHttpStatus: res.status,
    teamPageHtmlChars: html.length,
    lastLinkParsed: lastLink != null,
    goalsFromMatchPage,
    goalsFromTeamPageSummary,
    lastMatchIdTail: lastLink ? safeMatchIdFromUrl(lastLink.matchUrl) : null,
    lastResultScoreSource,
    teamObfuscationKey: teamPeek?.obfuscationKey ?? null,
    matchObfuscationKey,
    glyphDiagSummary,
    halfResultDiagnostic,
    envOverrideActive,
    teamGlyphMappingHint: teamPeek?.mappingSuggestion?.slice(0, 420) ?? null,
    matchGlyphMappingHint: matchGlyphPeek?.mappingSuggestion?.slice(0, 420) ?? null,
    lastResultMissDetail,
  };

  return { fixtures, tableData, lastResult, fetchMeta };
}
