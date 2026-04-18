export function matchSignature(m: {
  date: string;
  homeTeam: string;
  awayTeam: string;
}): string {
  return `${m.date}|${m.homeTeam.trim()}|${m.awayTeam.trim()}`;
}
