/** Mannschaftsseite (ohne #! hash — Server ignoriert Hash ohnehin) */
export const FUSSBALL_TEAM_PAGE_URL =
  "https://www.fussball.de/mannschaft/tsv-poggenhagen-tsv-poggenhagen-niedersachsen/-/saison/2526/team-id/011MIA8IDC000000VTVG0001VTR8C1K7";

export const CLUB_NAME = "TSV Poggenhagen";

export const FUSSBALL_FETCH_HEADERS = {
  "User-Agent": "TSV-Poggenhagen-Website/1.0 (+https://www.tsv-poggenhagen1946.de)",
  Accept: "text/html,application/xhtml+xml",
} as const;

/** Harte Timeouts gegen hängende TTFB bei langsamem fussball.de */
export const FUSSBALL_FETCH_TIMEOUT_MS_TEAM = 6000;
export const FUSSBALL_FETCH_TIMEOUT_MS_MATCH = 5000;
