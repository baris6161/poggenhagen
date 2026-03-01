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
 * Findet das nächste Spiel (1 Tag nach Spieltag wird automatisch das nächste genommen)
 */
export function getNextMatch(): Match {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  // Finde das erste Spiel, das noch nicht gespielt wurde (mindestens 1 Tag in der Zukunft)
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  for (const fixture of fixtures) {
    if (fixture.isFree) continue; // Überspringe spielfrei
    
    const matchDate = new Date(fixture.date);
    matchDate.setHours(0, 0, 0, 0);
    
    // Wenn Spiel mindestens 1 Tag in der Zukunft ist
    if (matchDate >= tomorrow) {
      return fixture;
    }
  }
  
  // Fallback: Erstes Spiel aus fixtures
  return fixtures.find(f => !f.isFree) || fixtures[0];
}

export const nextMatch: Match = getNextMatch();

export const lastResults: Match[] = [
  {
    id: "r1",
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
    id: "r2",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "Mellendorfer TV",
    date: "2025-11-09",
    time: "14:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    result: { home: 3, away: 0 },
    matchday: 11,
  },
  {
    id: "r3",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "SV Türkay Sport Garbsen",
    date: "2025-11-02",
    time: "14:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    result: { home: 1, away: 2 },
    matchday: 10,
  },
  {
    id: "r4",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "TSV Berenbostel",
    date: "2025-10-19",
    time: "15:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    result: { home: 2, away: 1 },
    matchday: 9,
  },
  {
    id: "r5",
    homeTeam: "SG Letter 05",
    awayTeam: "TSV Poggenhagen",
    date: "2025-10-12",
    time: "15:00",
    venue: "Letter",
    isHome: false,
    result: { home: 4, away: 2 },
    matchday: 8,
  },
];

export const fixtures: Match[] = [
  {
    id: "f1",
    homeTeam: "Lohnde 96",
    awayTeam: "TSV Poggenhagen",
    date: "2026-03-01",
    time: "14:00",
    venue: "Lohnde",
    isHome: false,
    matchday: 1,
  },
  {
    id: "f2",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "spielfrei",
    date: "2026-03-08",
    time: "",
    venue: "-",
    isHome: true,
    matchday: 2,
    isFree: true,
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
  },
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
    id: "f6",
    homeTeam: "FC Mecklenhorst",
    awayTeam: "TSV Poggenhagen",
    date: "2026-04-06",
    time: "15:00",
    venue: "Mecklenhorst",
    isHome: false,
    matchday: 6,
  },
  {
    id: "f7",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "TSV Godshorn II",
    date: "2026-04-12",
    time: "15:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    matchday: 7,
  },
  {
    id: "f8",
    homeTeam: "TSV Kolenfeld",
    awayTeam: "TSV Poggenhagen",
    date: "2026-04-19",
    time: "15:00",
    venue: "Kolenfeld",
    isHome: false,
    matchday: 8,
  },
  {
    id: "f9",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "SG Letter 05",
    date: "2026-04-26",
    time: "15:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    matchday: 9,
  },
  {
    id: "f10",
    homeTeam: "SC Wedemark",
    awayTeam: "TSV Poggenhagen",
    date: "2026-05-01",
    time: "15:00",
    venue: "Wedemark",
    isHome: false,
    matchday: 10,
  },
  {
    id: "f11",
    homeTeam: "TSV Berenbostel",
    awayTeam: "TSV Poggenhagen",
    date: "2026-05-03",
    time: "15:00",
    venue: "Berenbostel",
    isHome: false,
    matchday: 11,
  },
  {
    id: "f12",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "SC Wedemark",
    date: "2026-05-10",
    time: "15:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    matchday: 12,
  },
  {
    id: "f13",
    homeTeam: "SV Türkay Sport Garbsen",
    awayTeam: "TSV Poggenhagen",
    date: "2026-05-17",
    time: "15:00",
    venue: "Garbsen",
    isHome: false,
    matchday: 13,
  },
  {
    id: "f14",
    homeTeam: "Mellendorfer TV",
    awayTeam: "TSV Poggenhagen",
    date: "2026-05-31",
    time: "15:00",
    venue: "Mellendorf",
    isHome: false,
    matchday: 14,
  },
  {
    id: "f15",
    homeTeam: "TSV Poggenhagen",
    awayTeam: "1.FC Brelingen",
    date: "2026-06-07",
    time: "15:00",
    venue: "Sportplatz Poggenhagen",
    isHome: true,
    matchday: 15,
  },
];

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
  { rank: 1, team: "TSV Godshorn II", played: 13, won: 10, drawn: 0, lost: 3, goalsFor: 34, goalsAgainst: 12, goalDiff: 22, points: 30 },
  { rank: 2, team: "TSV Poggenhagen", played: 13, won: 9, drawn: 2, lost: 2, goalsFor: 45, goalsAgainst: 14, goalDiff: 31, points: 29 },
  { rank: 3, team: "TSV Kolenfeld", played: 14, won: 8, drawn: 3, lost: 3, goalsFor: 46, goalsAgainst: 28, goalDiff: 18, points: 27 },
  { rank: 4, team: "Mellendorfer TV", played: 16, won: 8, drawn: 3, lost: 5, goalsFor: 42, goalsAgainst: 33, goalDiff: 9, points: 27 },
  { rank: 5, team: "TSV Berenbostel", played: 16, won: 7, drawn: 3, lost: 6, goalsFor: 44, goalsAgainst: 32, goalDiff: 12, points: 24 },
  { rank: 6, team: "SV Resse", played: 12, won: 7, drawn: 1, lost: 4, goalsFor: 37, goalsAgainst: 20, goalDiff: 17, points: 22 },
  { rank: 7, team: "1.FC Brelingen", played: 13, won: 6, drawn: 3, lost: 4, goalsFor: 35, goalsAgainst: 31, goalDiff: 4, points: 21 },
  { rank: 8, team: "SC Wedemark", played: 11, won: 6, drawn: 2, lost: 3, goalsFor: 25, goalsAgainst: 13, goalDiff: 12, points: 20 },
  { rank: 9, team: "TSV Stelingen II", played: 13, won: 5, drawn: 4, lost: 4, goalsFor: 29, goalsAgainst: 28, goalDiff: 1, points: 19 },
  { rank: 10, team: "Lohnde 96", played: 14, won: 4, drawn: 4, lost: 6, goalsFor: 45, goalsAgainst: 31, goalDiff: 14, points: 16 },
  { rank: 11, team: "TSV Mariensee-Wulfelade", played: 15, won: 4, drawn: 3, lost: 8, goalsFor: 27, goalsAgainst: 35, goalDiff: -8, points: 15 },
  { rank: 12, team: "SG Letter 05", played: 15, won: 4, drawn: 2, lost: 9, goalsFor: 20, goalsAgainst: 49, goalDiff: -29, points: 14 },
  { rank: 13, team: "SV Frielingen", played: 13, won: 4, drawn: 1, lost: 8, goalsFor: 18, goalsAgainst: 40, goalDiff: -22, points: 13 },
  { rank: 14, team: "SV Türkay Sport Garbsen", played: 14, won: 3, drawn: 1, lost: 10, goalsFor: 23, goalsAgainst: 56, goalDiff: -33, points: 10 },
  { rank: 15, team: "FC Mecklenhorst", played: 12, won: 0, drawn: 2, lost: 10, goalsFor: 23, goalsAgainst: 71, goalDiff: -48, points: 2 },
];
