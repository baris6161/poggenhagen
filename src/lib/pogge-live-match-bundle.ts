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
import { sendDiscordAdminLog } from "@/lib/admin/discord-admin-log";
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

function formatMatchLine(m: Match): string {
  const vs = `${m.homeTeam} vs ${m.awayTeam}`;
  const res =
    m.result != null ? ` (${m.result.home}:${m.result.away})` : "";
  return `${m.date} ${m.time}${res} — ${vs}`;
}

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
    const bundle = staticBundle();
    await sendDiscordAdminLog({
      title: "Pogge Bundle: Static (Sync aus)",
      color: 0xfee75c,
      fields: [
        { name: "Grund", value: "`DISABLE_FUSSBALL_SYNC=1` — kein Live-Fetch." },
        {
          name: "Nächstes Spiel (static)",
          value: formatMatchLine(bundle.nextMatch),
        },
        {
          name: "Spielplan upcoming",
          value: String(bundle.scheduleUpcoming.length),
          inline: true,
        },
        {
          name: "Letzte Ergebnisse (merged)",
          value: String(bundle.lastResultsMerged.length),
          inline: true,
        },
        {
          name: "Tabellenzeilen",
          value: String(bundle.tableData.length),
          inline: true,
        },
      ],
    });
    return bundle;
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
    const bundle: PoggeMatchBundle = {
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

    const last = live.lastResult;
    const lastScore =
      last?.result != null
        ? `${last.result.home}:${last.result.away} (${last.homeTeam} : ${last.awayTeam})`
        : "— (kein lastResult)";

    await sendDiscordAdminLog({
      title: "Pogge Bundle: fussball.de OK",
      color: 0x57f287,
      fields: [
        { name: "Quelle", value: "fussball.de", inline: true },
        {
          name: "NODE_ENV",
          value: process.env.NODE_ENV ?? "?",
          inline: true,
        },
        {
          name: "Fixtures",
          value: String(live.fixtures.length),
          inline: true,
        },
        {
          name: "Tabellenzeilen",
          value: String(live.tableData.length),
          inline: true,
        },
        {
          name: "Team-Seite HTTP",
          value: String(live.fetchMeta.teamPageHttpStatus),
          inline: true,
        },
        {
          name: "Team-HTML Zeichen",
          value: String(live.fetchMeta.teamPageHtmlChars),
          inline: true,
        },
        {
          name: "Letztes Spiel-Link geparst",
          value: live.fetchMeta.lastLinkParsed ? "ja" : "nein",
          inline: true,
        },
        {
          name: "Tore von Spielseite",
          value: live.fetchMeta.goalsFromMatchPage ? "ja" : "nein",
          inline: true,
        },
        {
          name: "Match-ID (Tail)",
          value: live.fetchMeta.lastMatchIdTail ?? "—",
          inline: true,
        },
        {
          name: "Live lastResult / Torstand",
          value: lastScore,
        },
        {
          name: "Nächstes Spiel (berechnet)",
          value: formatMatchLine(bundle.nextMatch),
        },
        {
          name: "Upcoming (Top 5)",
          value: String(bundle.scheduleUpcoming.length),
          inline: true,
        },
        {
          name: "Ergebnisse merged",
          value: String(bundle.lastResultsMerged.length),
          inline: true,
        },
      ],
    });

    return bundle;
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
    const fallback = staticBundle();
    await sendDiscordAdminLog({
      title: "Pogge Bundle: Fallback static (Fehler)",
      color: 0xed4245,
      fields: [
        { name: "Fehler", value: msg },
        ...(cause ? [{ name: "Cause", value: cause }] : []),
        {
          name: "Fallback nächstes Spiel",
          value: formatMatchLine(fallback.nextMatch),
        },
        {
          name: "Hinweis",
          value:
            "Live-Fetch oder Parse fehlgeschlagen — es gilt das statische Archiv.",
        },
      ],
    });
    return fallback;
  }
}

/**
 * Gecachte Spiel-Daten (Tag `pogge-fussball` für Cron-/Manuell-Revalidate).
 * Revalidate 15 Min: zusammen mit PWA `router.refresh()` bleiben Tabelle und Spielplan nutzbar aktuell,
 * ohne fussball.de bei jedem Seitenaufruf zu treffen.
 */
export const getCachedPoggeMatchBundle = unstable_cache(
  () => loadFreshBundle(),
  ["pogge-match-bundle-v1"],
  { revalidate: 900, tags: ["pogge-fussball"] }
);
