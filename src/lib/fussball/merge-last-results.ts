import type { Match } from "@/data/matches";
import { matchSignature } from "@/lib/match-signature";

/**
 * Aktuelles letztes Spiel (von FUSSBALL.DE) voranstellen, Duplikate aus dem Archiv entfernen.
 */
export function mergeLastResultsFromLive(
  live: Match | null,
  archive: Match[]
): Match[] {
  const sortedArchive = [...archive].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  if (!live?.result) return sortedArchive;
  const sig = matchSignature(live);
  const rest = sortedArchive.filter((m) => matchSignature(m) !== sig);
  return [live, ...rest].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
