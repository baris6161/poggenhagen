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

export const lastResults: Match[] = [
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
    id: "f4",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "SV Resse",
    date: "2026-03-22",
    time: "14:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    matchday: 4,
  },
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

/**
 * Gibt die letzten Ergebnisse zurück, sortiert nach Datum (neueste zuerst)
 * Spiele, die mehr als 1 Tag alt sind und ein Ergebnis haben, werden automatisch angezeigt
 */
export function getLastResults(): Match[] {
  // Sortiere nach Datum (neueste zuerst)
  return [...lastResults].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
}

/**
 * Findet die nächsten 5 Spiele (ohne bereits gespielte)
 * Wenn ein Spiel ein Ergebnis hat, wird es automatisch ausgeschlossen
 * Spiele, die mehr als 1 Tag alt sind, werden automatisch als gespielt behandelt
 */
export function getNextFixtures(count: number = 5): Match[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  // Sammle alle gespielten Spiele (mit Ergebnis)
  const playedMatchIds = new Set(lastResults.map(r => r.id));
  
  // Filtere: Nur zukünftige Spiele ohne Ergebnis
  const upcomingFixtures = fixtures.filter(f => {
    // Überspringe spielfrei
    if (f.isFree) return false;
    
    // Überspringe bereits gespielte Spiele (haben Ergebnis in lastResults)
    if (playedMatchIds.has(f.id)) return false;
    
    const matchDate = new Date(f.date);
    matchDate.setHours(0, 0, 0, 0);
    
    // Überspringe Spiele, die mehr als 1 Tag alt sind (werden automatisch als gespielt behandelt)
    if (isMatchMoreThanOneDayOld(f)) return false;
    
    // Nur Spiele heute oder in der Zukunft
    return matchDate >= now;
  });
  
  // Nimm die ersten N Spiele
  return upcomingFixtures.slice(0, count);
}

/**
 * Findet das nächste Spiel (zeigt das nächste Spiel ab heute an)
 */
export function getNextMatch(): Match {
  const nextFixtures = getNextFixtures(1);
  if (nextFixtures.length > 0) {
    return nextFixtures[0];
  }
  
  // Fallback: Erstes Spiel aus fixtures
  return fixtures.find(f => !f.isFree) || fixtures[0];
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
  { rank: 1, team: "Mellendorfer TV", played: 19, won: 11, drawn: 3, lost: 5, goalsFor: 64, goalsAgainst: 36, goalDiff: 28, points: 36 },
  { rank: 2, team: "TSV Godshorn II", played: 16, won: 11, drawn: 2, lost: 3, goalsFor: 41, goalsAgainst: 18, goalDiff: 23, points: 35 },
  { rank: 3, team: "TSV Poggenhagen", played: 14, won: 10, drawn: 2, lost: 2, goalsFor: 46, goalsAgainst: 14, goalDiff: 32, points: 32 },
  { rank: 4, team: "TSV Kolenfeld", played: 16, won: 8, drawn: 4, lost: 4, goalsFor: 48, goalsAgainst: 38, goalDiff: 10, points: 28 },
  { rank: 5, team: "SC Wedemark", played: 14, won: 8, drawn: 3, lost: 3, goalsFor: 34, goalsAgainst: 20, goalDiff: 14, points: 27 },
  { rank: 6, team: "TSV Berenbostel", played: 18, won: 7, drawn: 3, lost: 8, goalsFor: 49, goalsAgainst: 45, goalDiff: 4, points: 24 },
  { rank: 7, team: "1.FC Brelingen", played: 15, won: 7, drawn: 3, lost: 5, goalsFor: 39, goalsAgainst: 35, goalDiff: 4, points: 24 },
  { rank: 8, team: "SV Resse", played: 13, won: 7, drawn: 1, lost: 5, goalsFor: 37, goalsAgainst: 21, goalDiff: 16, points: 22 },
  { rank: 9, team: "TSV Stelingen II", played: 15, won: 6, drawn: 4, lost: 5, goalsFor: 37, goalsAgainst: 36, goalDiff: 1, points: 22 },
  { rank: 10, team: "TSV Mariensee-Wulfelade", played: 16, won: 5, drawn: 3, lost: 8, goalsFor: 31, goalsAgainst: 38, goalDiff: -7, points: 18 },
  { rank: 11, team: "SV Frielingen", played: 15, won: 5, drawn: 2, lost: 8, goalsFor: 22, goalsAgainst: 43, goalDiff: -21, points: 17 },
  { rank: 12, team: "Lohnde 96", played: 16, won: 4, drawn: 4, lost: 8, goalsFor: 48, goalsAgainst: 36, goalDiff: 12, points: 16 },
  { rank: 13, team: "SV Türkay Sport Garbsen", played: 17, won: 4, drawn: 2, lost: 11, goalsFor: 30, goalsAgainst: 61, goalDiff: -31, points: 14 },
  { rank: 14, team: "SG Letter 05", played: 17, won: 4, drawn: 2, lost: 11, goalsFor: 23, goalsAgainst: 56, goalDiff: -33, points: 14 },
  { rank: 15, team: "FC Mecklenhorst", played: 13, won: 0, drawn: 2, lost: 11, goalsFor: 25, goalsAgainst: 77, goalDiff: -52, points: 2 },
];
