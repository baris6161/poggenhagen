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
}

export const nextMatch: Match = {
  id: "next-1",
  homeTeam: "TSV Poggenhagen",
  awayTeam: "SV Bordenau",
  date: "2026-03-15",
  time: "15:00",
  venue: "Sportplatz Poggenhagen",
  isHome: true,
  matchday: 18,
};

export const lastResults: Match[] = [
  { id: "r1", homeTeam: "TSV Poggenhagen", awayTeam: "TuS Schneeren", date: "2026-02-22", time: "15:00", venue: "Sportplatz Poggenhagen", isHome: true, result: { home: 3, away: 1 }, matchday: 17 },
  { id: "r2", homeTeam: "SC Wunstorf II", awayTeam: "TSV Poggenhagen", date: "2026-02-15", time: "14:00", venue: "Sportplatz Wunstorf", isHome: false, result: { home: 1, away: 2 }, matchday: 16 },
  { id: "r3", homeTeam: "TSV Poggenhagen", awayTeam: "TSV Bordenau", date: "2026-02-08", time: "15:00", venue: "Sportplatz Poggenhagen", isHome: true, result: { home: 2, away: 2 }, matchday: 15 },
  { id: "r4", homeTeam: "SG Engelbostel", awayTeam: "TSV Poggenhagen", date: "2026-02-01", time: "14:00", venue: "Am Pfarrlandplatz", isHome: false, result: { home: 0, away: 4 }, matchday: 14 },
  { id: "r5", homeTeam: "TSV Poggenhagen", awayTeam: "MTV Mandelsloh", date: "2026-01-25", time: "14:00", venue: "Sportplatz Poggenhagen", isHome: true, result: { home: 1, away: 0 }, matchday: 13 },
];

export const fixtures: Match[] = [
  nextMatch,
  { id: "f2", homeTeam: "TSV Hagenburg", awayTeam: "TSV Poggenhagen", date: "2026-03-22", time: "15:00", venue: "Sportplatz Hagenburg", isHome: false, matchday: 19 },
  { id: "f3", homeTeam: "TSV Poggenhagen", awayTeam: "SV Dudensen", date: "2026-03-29", time: "15:30", venue: "Sportplatz Poggenhagen", isHome: true, matchday: 20 },
  { id: "f4", homeTeam: "FC Mardorf", awayTeam: "TSV Poggenhagen", date: "2026-04-05", time: "15:00", venue: "Am Steinhuder Meer", isHome: false, matchday: 21 },
  { id: "f5", homeTeam: "TSV Poggenhagen", awayTeam: "SV Eilvese", date: "2026-04-12", time: "15:30", venue: "Sportplatz Poggenhagen", isHome: true, matchday: 22 },
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
  { rank: 1, team: "SC Wunstorf II", played: 17, won: 13, drawn: 2, lost: 2, goalsFor: 45, goalsAgainst: 15, goalDiff: 30, points: 41 },
  { rank: 2, team: "SV Bordenau", played: 17, won: 12, drawn: 3, lost: 2, goalsFor: 38, goalsAgainst: 14, goalDiff: 24, points: 39 },
  { rank: 3, team: "TSV Poggenhagen", played: 17, won: 11, drawn: 3, lost: 3, goalsFor: 36, goalsAgainst: 18, goalDiff: 18, points: 36 },
  { rank: 4, team: "SG Engelbostel", played: 17, won: 10, drawn: 2, lost: 5, goalsFor: 32, goalsAgainst: 22, goalDiff: 10, points: 32 },
  { rank: 5, team: "TuS Schneeren", played: 17, won: 8, drawn: 4, lost: 5, goalsFor: 28, goalsAgainst: 20, goalDiff: 8, points: 28 },
  { rank: 6, team: "TSV Bordenau", played: 17, won: 7, drawn: 5, lost: 5, goalsFor: 25, goalsAgainst: 22, goalDiff: 3, points: 26 },
  { rank: 7, team: "MTV Mandelsloh", played: 17, won: 7, drawn: 3, lost: 7, goalsFor: 24, goalsAgainst: 26, goalDiff: -2, points: 24 },
  { rank: 8, team: "TSV Hagenburg", played: 17, won: 5, drawn: 4, lost: 8, goalsFor: 20, goalsAgainst: 28, goalDiff: -8, points: 19 },
  { rank: 9, team: "SV Dudensen", played: 17, won: 4, drawn: 3, lost: 10, goalsFor: 18, goalsAgainst: 32, goalDiff: -14, points: 15 },
  { rank: 10, team: "FC Mardorf", played: 17, won: 3, drawn: 2, lost: 12, goalsFor: 14, goalsAgainst: 38, goalDiff: -24, points: 11 },
  { rank: 11, team: "SV Eilvese", played: 17, won: 2, drawn: 1, lost: 14, goalsFor: 10, goalsAgainst: 42, goalDiff: -32, points: 7 },
];
