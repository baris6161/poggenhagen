import { CLUB_NAME } from "./constants";

/** Kurzer Ortsname für Anzeige (Sportplatz Poggenhagen / Gegner-Platz) */
export function venueForMatch(homeTeam: string, awayTeam: string): string {
  const h = homeTeam.trim();
  const a = awayTeam.trim();
  if (h === CLUB_NAME) return "Sportplatz Poggenhagen";
  return shortClubLocation(h);
}

function shortClubLocation(clubName: string): string {
  return clubName
    .replace(/^1\.\s*/i, "")
    .replace(/^(TSV|SV|SG|SC|Mellendorfer)\s+/i, "")
    .replace(/\s+II$/i, "")
    .trim();
}
