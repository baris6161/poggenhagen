import { matchSignature } from "@/lib/match-signature";

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string; // ISO
  time: string;
  venue: string;
  isHome: boolean;
  result?: { home: number; away: number };
  matchday?: number;
  isFree?: boolean; // Für spielfrei
  /** Spiel abgesetzt / Ausfall (ohne Ergebnis) */
  cancelled?: boolean;
}

// Heimspiel Route-Link
const HOME_VENUE_MAPS_URL = "https://maps.app.goo.gl/sDquMmHoEzkxwv4W8?g_st=ic";

/**
 * Generiert Google Maps URL für Auswärtsspiele
 */
export function getMapsUrl(match: Match): string {
  if (match.isHome) {
    return HOME_VENUE_MAPS_URL;
  }
  // Für Auswärtsspiele: Suche nach Gegner-Mannschaft
  const searchQuery = encodeURIComponent(match.homeTeam);
  return `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
}

/**
 * Archiv für „Letzte Spiele“ (älter als das eine Live-Spiel von FUSSBALL.DE).
 * Reihenfolge egal: getLastResults sortiert nach Datum absteigend.
 * Ergebnisse Stand April 2026, Mecklenhorst und Brelingen aus Spielberichten auf fussball.de.
 */
export const lastResults: Match[] = [
  {
    id: "arch-kolenfeld-2526",
    homeTeam: "TSV Kolenfeld",
    awayTeam: "TSV Poggenhagen",
    date: "2026-04-19",
    time: "15:00",
    venue: "Kolenfeld",
    isHome: false,
    result: { home: 0, away: 2 },
    matchday: 9,
  },
  {
    id: "arch-godshorn-2526",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "TSV Godshorn II",
    date: "2026-04-12",
    time: "15:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    result: { home: 1, away: 2 },
    matchday: 8,
  },
  {
    id: "arch-mecklenhorst-2526",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "FC Mecklenhorst",
    date: "2026-04-06",
    time: "15:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    result: { home: 12, away: 1 },
    matchday: 7,
  },
  {
    id: "arch-brelingen-2526",
    homeTeam: "1.FC Brelingen",
    awayTeam: "TSV Poggenhagen",
    date: "2026-04-04",
    time: "16:00",
    venue: "Brelingen",
    isHome: false,
    result: { home: 0, away: 6 },
    matchday: 6,
  },
  {
    id: "f4",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "SV Resse",
    date: "2026-03-22",
    time: "14:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    result: { home: 5, away: 0 },
    matchday: 4,
  },
  {
    id: "f3",
    homeTeam: "TSV Mariensee-Wulfelade",
    awayTeam: "TSV Poggenhagen",
    date: "2026-03-15",
    time: "14:00",
    venue: "Mariensee-Wulfelade",
    isHome: false,
    matchday: 3,
    cancelled: true,
  },
  {
    id: "f1",
    homeTeam: "Lohnde 96",
    awayTeam: "TSV Poggenhagen",
    date: "2026-03-01",
    time: "14:00",
    venue: "Lohnde",
    isHome: false,
    result: { home: 0, away: 1 },
    matchday: 1,
  },
  {
    id: "fs-muehlenfeld",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "TSV Mühlenfeld II",
    date: "2026-02-18",
    time: "19:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    cancelled: true,
  },
  {
    id: "r1",
    homeTeam: "SV 06 Lehrte",
    awayTeam: "TSV Poggenhagen",
    date: "2026-02-14",
    time: "14:45",
    venue: "Lehrte",
    isHome: false,
    result: { home: 3, away: 3 },
    matchday: undefined,
  },
  {
    id: "fs-helstorf",
    homeTeam: "SV Germania Helstorf",
    awayTeam: "TSV Poggenhagen",
    date: "2026-02-08",
    time: "18:45",
    venue: "Helstorf",
    isHome: false,
    cancelled: true,
  },
  {
    id: "fs-autertal",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "Autertaler SC",
    date: "2026-01-25",
    time: "14:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    cancelled: true,
  },
  {
    id: "r2",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "SV Frielingen",
    date: "2025-11-30",
    time: "14:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    result: { home: 5, away: 1 },
    matchday: 12,
  },
  {
    id: "r3",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "Mellendorfer TV",
    date: "2025-11-09",
    time: "14:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    result: { home: 3, away: 1 },
    matchday: 11,
  },
  {
    id: "r4",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "SV Türkay Sport Garbsen",
    date: "2025-11-02",
    time: "14:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    result: { home: 9, away: 0 },
    matchday: 10,
  },
  {
    id: "r5",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "TSV Berenbostel",
    date: "2025-10-19",
    time: "15:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    result: { home: 2, away: 1 },
    matchday: 9,
  },
];

export const fixtures: Match[] = [
  {
    id: "f5",
    homeTeam: "TSV Stelingen II",
    awayTeam: "TSV Poggenhagen",
    date: "2026-03-29",
    time: "12:00",
    venue: "Stelingen",
    isHome: false,
    matchday: 5,
  },
  {
    id: "f5b",
    homeTeam: "1.FC Brelingen",
    awayTeam: "TSV Poggenhagen",
    date: "2026-04-04",
    time: "16:00",
    venue: "Brelingen",
    isHome: false,
    matchday: 6,
  },
  {
    id: "f6",
    homeTeam: "FC Mecklenhorst",
    awayTeam: "TSV Poggenhagen",
    date: "2026-04-06",
    time: "15:00",
    venue: "Mecklenhorst",
    isHome: false,
    matchday: 7,
  },
  {
    id: "f7",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "TSV Godshorn II",
    date: "2026-04-12",
    time: "15:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    matchday: 8,
  },
  {
    id: "f8",
    homeTeam: "TSV Kolenfeld",
    awayTeam: "TSV Poggenhagen",
    date: "2026-04-19",
    time: "15:00",
    venue: "Kolenfeld",
    isHome: false,
    matchday: 9,
  },
  {
    id: "f9",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "SG Letter 05",
    date: "2026-04-26",
    time: "15:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    matchday: 10,
  },
  {
    id: "f10",
    homeTeam: "SC Wedemark",
    awayTeam: "TSV Poggenhagen",
    date: "2026-05-01",
    time: "15:00",
    venue: "Wedemark",
    isHome: false,
    matchday: 11,
  },
  {
    id: "f11",
    homeTeam: "TSV Berenbostel",
    awayTeam: "TSV Poggenhagen",
    date: "2026-05-03",
    time: "15:00",
    venue: "Berenbostel",
    isHome: false,
    matchday: 12,
  },
  {
    id: "f12",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "SC Wedemark",
    date: "2026-05-10",
    time: "15:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    matchday: 13,
  },
  {
    id: "f13",
    homeTeam: "SV Türkay Sport Garbsen",
    awayTeam: "TSV Poggenhagen",
    date: "2026-05-17",
    time: "15:00",
    venue: "Garbsen",
    isHome: false,
    matchday: 14,
  },
  {
    id: "f14",
    homeTeam: "Mellendorfer TV",
    awayTeam: "TSV Poggenhagen",
    date: "2026-05-31",
    time: "15:00",
    venue: "Mellendorf",
    isHome: false,
    matchday: 15,
  },
  {
    id: "f15",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "1.FC Brelingen",
    date: "2026-06-07",
    time: "15:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    matchday: 16,
  },
];

/**
 * Prüft, ob ein Spiel mehr als 1 Tag alt ist (für automatische Verschiebung)
 */
function isMatchMoreThanOneDayOld(match: Match): boolean {
  const matchDate = new Date(match.date);
  matchDate.setHours(0, 0, 0, 0);
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  // Berechne Differenz in Tagen
  const diffTime = now.getTime() - matchDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  // Wenn mehr als 1 Tag vergangen ist
  return diffDays > 1;
}

/** Sortierte Ergebnisliste (neueste zuerst). */
export function getLastResultsData(results: Match[]): Match[] {
  return [...results].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
}

/**
 * Gibt die letzten Ergebnisse zurück, sortiert nach Datum (neueste zuerst)
 * Spiele, die mehr als 1 Tag alt sind und ein Ergebnis haben, werden automatisch angezeigt
 */
export function getLastResults(): Match[] {
  return getLastResultsData(lastResults);
}

/**
 * Findet die nächsten Spiele (ohne bereits gespielte), sortiert nach Datum.
 * `resultList` soll dieselbe Quelle wie die Ergebnisanzeige nutzen (z. B. FUSSBALL.DE + Archiv).
 */
export function getNextFixturesData(
  fixtureList: Match[],
  resultList: Match[],
  count: number = 5
): Match[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const playedMatchIds = new Set(resultList.map((r) => r.id));
  const playedSignatures = new Set(resultList.map((r) => matchSignature(r)));

  const upcomingFixtures = fixtureList.filter((f) => {
    if (f.isFree) return false;
    if (playedMatchIds.has(f.id)) return false;
    if (playedSignatures.has(matchSignature(f))) return false;

    const matchDate = new Date(f.date);
    matchDate.setHours(0, 0, 0, 0);

    if (isMatchMoreThanOneDayOld(f)) return false;

    return matchDate >= now;
  });

  return upcomingFixtures.slice(0, count);
}

/**
 * Findet die nächsten 5 Spiele (ohne bereits gespielte)
 * Wenn ein Spiel ein Ergebnis hat, wird es automatisch ausgeschlossen
 * Spiele, die mehr als 1 Tag alt sind, werden automatisch als gespielt behandelt
 */
export function getNextFixtures(count: number = 5): Match[] {
  return getNextFixturesData(
    fixtures,
    getLastResultsData(lastResults),
    count
  );
}

/**
 * Findet das nächste Spiel (zeigt das nächste Spiel ab heute an)
 */
export function getNextMatchData(
  fixtureList: Match[],
  resultList: Match[]
): Match {
  const nextFixtures = getNextFixturesData(fixtureList, resultList, 1);
  if (nextFixtures.length > 0) {
    return nextFixtures[0];
  }
  return fixtureList.find((f) => !f.isFree) || fixtureList[0];
}

export function getNextMatch(): Match {
  return getNextMatchData(fixtures, getLastResultsData(lastResults));
}

// Exportiere nextMatch als Funktion, die beim Import aufgerufen wird
export const nextMatch = getNextMatch();

export interface TableEntry {
  rank: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
}

export const tableData: TableEntry[] = [
  { rank: 1, team: "Mellendorfer TV", played: 20, won: 12, drawn: 3, lost: 5, goalsFor: 71, goalsAgainst: 39, goalDiff: 32, points: 39 },
  { rank: 2, team: "TSV Poggenhagen", played: 15, won: 11, drawn: 2, lost: 2, goalsFor: 51, goalsAgainst: 14, goalDiff: 37, points: 35 },
  { rank: 3, team: "TSV Godshorn II", played: 16, won: 11, drawn: 2, lost: 3, goalsFor: 41, goalsAgainst: 18, goalDiff: 23, points: 35 },
  { rank: 4, team: "SC Wedemark", played: 15, won: 9, drawn: 3, lost: 3, goalsFor: 37, goalsAgainst: 20, goalDiff: 17, points: 30 },
  { rank: 5, team: "TSV Kolenfeld", played: 17, won: 8, drawn: 5, lost: 4, goalsFor: 52, goalsAgainst: 42, goalDiff: 10, points: 29 },
  { rank: 6, team: "TSV Berenbostel", played: 19, won: 8, drawn: 3, lost: 8, goalsFor: 54, goalsAgainst: 45, goalDiff: 9, points: 27 },
  { rank: 7, team: "1.FC Brelingen", played: 16, won: 7, drawn: 3, lost: 6, goalsFor: 39, goalsAgainst: 38, goalDiff: 1, points: 24 },
  { rank: 8, team: "TSV Stelingen II", played: 16, won: 6, drawn: 5, lost: 5, goalsFor: 38, goalsAgainst: 37, goalDiff: 1, points: 23 },
  { rank: 9, team: "SV Resse", played: 14, won: 7, drawn: 1, lost: 6, goalsFor: 37, goalsAgainst: 26, goalDiff: 11, points: 22 },
  { rank: 10, team: "TSV Mariensee-Wulfelade", played: 17, won: 5, drawn: 4, lost: 8, goalsFor: 32, goalsAgainst: 39, goalDiff: -7, points: 19 },
  { rank: 11, team: "Lohnde 96", played: 17, won: 4, drawn: 5, lost: 8, goalsFor: 52, goalsAgainst: 40, goalDiff: 12, points: 17 },
  { rank: 12, team: "SV Frielingen", played: 16, won: 5, drawn: 2, lost: 9, goalsFor: 22, goalsAgainst: 44, goalDiff: -22, points: 17 },
  { rank: 13, team: "SG Letter 05", played: 18, won: 5, drawn: 2, lost: 11, goalsFor: 24, goalsAgainst: 56, goalDiff: -32, points: 17 },
  { rank: 14, team: "SV Türkay Sport Garbsen", played: 18, won: 4, drawn: 2, lost: 12, goalsFor: 33, goalsAgainst: 68, goalDiff: -35, points: 14 },
  { rank: 15, team: "FC Mecklenhorst", played: 14, won: 0, drawn: 2, lost: 12, goalsFor: 25, goalsAgainst: 82, goalDiff: -57, points: 2 },
];
