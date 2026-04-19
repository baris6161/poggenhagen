import { FUSSBALL_FETCH_HEADERS, FUSSBALL_FETCH_TIMEOUT_MS_MATCH } from "./constants";
import { fussballDebug } from "./debug-log";
import { fetchWithTimeout } from "./fetch-with-timeout";
import { parseObfuscatedResultScoreFromMatchPageHtml } from "./obfuscated-score-glyphs";

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

export async function fetchGoalsFromMatchPage(
  matchUrl: string,
  init?: RequestInit
): Promise<{ home: number; away: number } | null> {
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
    return null;
  }
  const html = await res.text();
  const hasAttr = html.includes('data-match-events="');
  if (!hasAttr) {
    fussballDebug("fetchGoalsFromMatchPage no data-match-events", {
      htmlLen: html.length,
      matchUrl: matchUrl.slice(-48),
    });
  }
  const data = parseMatchEventsAttr(html);
  const goals = countGoalsFromMatchEvents(data);
  if (goals) return goals;

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
    return obfuscated;
  }

  return null;
}
