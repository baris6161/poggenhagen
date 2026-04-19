import { FUSSBALL_FETCH_HEADERS, FUSSBALL_FETCH_TIMEOUT_MS_MATCH } from "./constants";
import { fussballDebug } from "./debug-log";
import { fetchWithTimeout } from "./fetch-with-timeout";
import type { MatchScoreGlyphPeek } from "./obfuscated-score-glyphs";
import {
  parseObfuscatedResultScoreFromMatchPageHtml,
  peekResultDivGlyphDiagnosticsFromMatchPageHtml,
} from "./obfuscated-score-glyphs";
import {
  extractHalfResultBracketText,
  parseScoreFromJsonLd,
  parseScoreFromMetaTitles,
  parseScoreNearEdSpielIdSnippet,
} from "./parse-match-page-score-fallbacks";
import type { ScoreSource } from "./score-source";

type Half = { events?: { type?: string; team?: string }[] };

type MatchEventsPayload = {
  "first-half"?: Half;
  "second-half"?: Half;
};

function parseMatchEventsAttr(html: string): MatchEventsPayload | null {
  const key = 'data-match-events="';
  const i = html.indexOf(key);
  if (i < 0) return null;
  const start = i + key.length;
  let depth = 0;
  let end = start;
  for (let j = start; j < html.length; j++) {
    const c = html[j];
    if (c === "{") depth++;
    if (c === "}") {
      depth--;
      if (depth === 0) {
        end = j + 1;
        break;
      }
    }
  }
  const raw = html.slice(start, end);
  const jsonish = raw
    .replace(/'/g, '"')
    .replace(/True/g, "true")
    .replace(/False/g, "false");
  try {
    return JSON.parse(jsonish) as MatchEventsPayload;
  } catch (e) {
    fussballDebug("match-events JSON.parse failed", {
      message: e instanceof Error ? e.message : String(e),
      rawSnippet: raw.slice(0, 120),
    });
    return null;
  }
}

export function countGoalsFromMatchEvents(data: MatchEventsPayload | null): {
  home: number;
  away: number;
} | null {
  if (!data) return null;
  let home = 0;
  let away = 0;
  for (const half of [data["first-half"], data["second-half"]]) {
    for (const ev of half?.events ?? []) {
      if (ev.type !== "goal") continue;
      if (ev.team === "home") home++;
      else if (ev.team === "away") away++;
    }
  }
  return { home, away };
}

/** Kompakte Diagnose, wenn kein Torstand von der Spielseite ermittelt werden konnte. */
export type ScoreLookupTrace = {
  matchUrlTail: string;
  htmlLen: number;
  hasDataMatchEventsAttr: boolean;
  matchEventsParsed: boolean;
  matchEventsHadGoals: boolean;
  glyphScoreOk: boolean;
  titleScoreOk: boolean;
  jsonLdScoreOk: boolean;
  embedScoreOk: boolean;
};

export type FetchMatchGoalsOutcome = {
  goals: { home: number; away: number } | null;
  source: ScoreSource;
  matchObfuscationKey: string | null;
  halfResultDiagnostic: string | null;
  matchGlyphPeek: MatchScoreGlyphPeek | null;
  /** Nur gesetzt, wenn `goals` null (Spielseite ohne verwertbaren Stand). */
  scoreLookupTrace?: ScoreLookupTrace;
};

export async function fetchGoalsFromMatchPage(
  matchUrl: string,
  init?: RequestInit
): Promise<FetchMatchGoalsOutcome> {
  const noHtmlTrace = (): ScoreLookupTrace => ({
    matchUrlTail: matchUrl.slice(-48),
    htmlLen: 0,
    hasDataMatchEventsAttr: false,
    matchEventsParsed: false,
    matchEventsHadGoals: false,
    glyphScoreOk: false,
    titleScoreOk: false,
    jsonLdScoreOk: false,
    embedScoreOk: false,
  });

  const empty = (
    source: ScoreSource,
    peekKey: string | null = null,
    half: string | null = null,
    peekFull: MatchScoreGlyphPeek | null = null,
    trace?: ScoreLookupTrace
  ): FetchMatchGoalsOutcome => ({
    goals: null,
    source,
    matchObfuscationKey: peekKey,
    halfResultDiagnostic: half,
    matchGlyphPeek: peekFull,
    ...(trace ? { scoreLookupTrace: trace } : {}),
  });

  fussballDebug("fetchGoalsFromMatchPage start", {
    matchUrl: matchUrl.slice(-48),
  });
  const res = await fetchWithTimeout(
    matchUrl,
    {
      ...init,
      headers: {
        ...FUSSBALL_FETCH_HEADERS,
        ...init?.headers,
        "User-Agent":
          (init?.headers as Record<string, string>)?.["User-Agent"] ??
          (FUSSBALL_FETCH_HEADERS as Record<string, string>)["User-Agent"],
        Accept: "text/html",
      },
      next: init?.next,
    },
    FUSSBALL_FETCH_TIMEOUT_MS_MATCH
  );
  if (!res.ok) {
    fussballDebug("fetchGoalsFromMatchPage HTTP error", {
      status: res.status,
      matchUrl: matchUrl.slice(-48),
    });
    return empty("none", null, null, null, noHtmlTrace());
  }
  const html = await res.text();
  const peek = peekResultDivGlyphDiagnosticsFromMatchPageHtml(html);
  const peekKey = peek?.obfuscationKey ?? null;
  const halfDiag = extractHalfResultBracketText(html);
  const peekFull = peek;

  const hasAttr = html.includes('data-match-events="');
  if (!hasAttr) {
    fussballDebug("fetchGoalsFromMatchPage no data-match-events", {
      htmlLen: html.length,
      matchUrl: matchUrl.slice(-48),
    });
  }
  const data = parseMatchEventsAttr(html);
  const fromEvents = countGoalsFromMatchEvents(data);
  if (fromEvents) {
    fussballDebug("fetchGoalsFromMatchPage match-events", fromEvents);
    return {
      goals: fromEvents,
      source: "match_events",
      matchObfuscationKey: peekKey,
      halfResultDiagnostic: halfDiag,
      matchGlyphPeek: peekFull,
    };
  }

  fussballDebug("fetchGoalsFromMatchPage no goals from match-events", {
    parsedData: data != null,
    hasAttr,
  });

  const obfuscated = parseObfuscatedResultScoreFromMatchPageHtml(html);
  if (obfuscated) {
    fussballDebug("fetchGoalsFromMatchPage using obfuscated div.result", {
      home: obfuscated.home,
      away: obfuscated.away,
    });
    return {
      goals: obfuscated,
      source: "match_page_glyphs",
      matchObfuscationKey: peekKey,
      halfResultDiagnostic: halfDiag,
      matchGlyphPeek: peekFull,
    };
  }

  const fromTitle = parseScoreFromMetaTitles(html);
  if (fromTitle) {
    fussballDebug("fetchGoalsFromMatchPage meta title", fromTitle);
    return {
      goals: fromTitle,
      source: "match_page_title",
      matchObfuscationKey: peekKey,
      halfResultDiagnostic: halfDiag,
      matchGlyphPeek: peekFull,
    };
  }

  const fromLd = parseScoreFromJsonLd(html);
  if (fromLd) {
    fussballDebug("fetchGoalsFromMatchPage JSON-LD", fromLd);
    return {
      goals: fromLd,
      source: "match_page_json",
      matchObfuscationKey: peekKey,
      halfResultDiagnostic: halfDiag,
      matchGlyphPeek: peekFull,
    };
  }

  const fromEmbed = parseScoreNearEdSpielIdSnippet(html);
  if (fromEmbed) {
    fussballDebug("fetchGoalsFromMatchPage embed snippet", fromEmbed);
    return {
      goals: fromEmbed,
      source: "match_page_embed",
      matchObfuscationKey: peekKey,
      halfResultDiagnostic: halfDiag,
      matchGlyphPeek: peekFull,
    };
  }

  const scoreLookupTrace: ScoreLookupTrace = {
    matchUrlTail: matchUrl.slice(-48),
    htmlLen: html.length,
    hasDataMatchEventsAttr: hasAttr,
    matchEventsParsed: data != null,
    matchEventsHadGoals: fromEvents != null,
    glyphScoreOk: obfuscated != null,
    titleScoreOk: fromTitle != null,
    jsonLdScoreOk: fromLd != null,
    embedScoreOk: fromEmbed != null,
  };

  return {
    goals: null,
    source: "none",
    matchObfuscationKey: peekKey,
    halfResultDiagnostic: halfDiag,
    matchGlyphPeek: peekFull,
    scoreLookupTrace,
  };
}
