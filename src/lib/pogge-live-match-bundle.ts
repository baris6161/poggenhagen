import { unstable_cache } from "next/cache";
import {
  fixtures as staticFixtures,
  lastResults as staticLastResults,
  tableData as staticTable,
  getLastResultsData,
  getNextFixturesData,
  getNextMatchData,
  type Match,
  type TableEntry,
} from "@/data/matches";
import { fussballDebug } from "@/lib/fussball/debug-log";
import { fetchFussballLiveDataset } from "@/lib/fussball/load-live-dataset";
import { mergeLastResultsFromLive } from "@/lib/fussball/merge-last-results";

export type PoggeMatchBundle = {
  fixtures: Match[];
  lastResultsMerged: Match[];
  tableData: TableEntry[];
  /** Bereits gefilterte nächsten 5 Pflichtspiele */
  scheduleUpcoming: Match[];
  nextMatch: Match;
  /** Quelle der Rohdaten (Tabelle + Spielplan) */
  source: "fussball.de" | "static";
};

function staticBundle(): PoggeMatchBundle {
  const lastResultsMerged = getLastResultsData(staticLastResults);
  return {
    fixtures: staticFixtures,
    lastResultsMerged,
    tableData: staticTable,
    scheduleUpcoming: getNextFixturesData(
      staticFixtures,
      lastResultsMerged,
      5
    ),
    nextMatch: getNextMatchData(staticFixtures, lastResultsMerged),
    source: "static",
  };
}

async function loadFreshBundle(): Promise<PoggeMatchBundle> {
  if (process.env.DISABLE_FUSSBALL_SYNC === "1") {
    return staticBundle();
  }
  try {
    const live = await fetchFussballLiveDataset();
    if (live.fixtures.length === 0 || live.tableData.length < 5) {
      throw new Error("FUSSBALL_PARSE_INCOMPLETE");
    }
    const lastResultsMerged = mergeLastResultsFromLive(
      live.lastResult,
      staticLastResults
    );
    if (!live.lastResult) {
      fussballDebug("FUSSBALL bundle ok but lastResult missing", {
        fixtures: live.fixtures.length,
        tableRows: live.tableData.length,
      });
    }
    return {
      fixtures: live.fixtures,
      lastResultsMerged,
      tableData: live.tableData,
      scheduleUpcoming: getNextFixturesData(
        live.fixtures,
        lastResultsMerged,
        5
      ),
      nextMatch: getNextMatchData(live.fixtures, lastResultsMerged),
      source: "fussball.de",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const cause =
      err instanceof Error && err.cause instanceof Error
        ? err.cause.message
        : undefined;
    console.error("[pogge:fussball] loadFreshBundle failed", msg, cause ?? "");
    fussballDebug("loadFreshBundle catch", {
      message: msg,
      cause: cause ?? null,
    });
    return staticBundle();
  }
}

/**
 * Gecachte Spiel-Daten (Tag `pogge-fussball` für Cron-/Manuell-Revalidate).
 */
export const getCachedPoggeMatchBundle = unstable_cache(
  () => loadFreshBundle(),
  ["pogge-match-bundle-v1"],
  { revalidate: 21600, tags: ["pogge-fussball"] }
);
