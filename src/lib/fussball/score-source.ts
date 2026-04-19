/** Woher der Torstand für `lastResult` stammt (Diagnostik + Discord). */
export type ScoreSource =
  | "none"
  | "match_events"
  | "match_page_glyphs"
  | "match_page_title"
  | "match_page_json"
  /** Schmales JSON-/Key-Value-Fenster nahe `edSpielId` (nur bei klarem Muster) */
  | "match_page_embed"
  | "team_summary_glyphs"
  | "env_override";
