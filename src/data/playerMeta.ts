import type { Position } from "./players";

/**
 * Mapping von Spielernamen zu Positionen
 * 
 * WICHTIG: Nur Spieler mit Mapping werden angezeigt!
 * 
 * Um einen neuen Spieler hinzuzufügen:
 * 1. Bild in /public/bilder/ hochladen (Format: Vorname-Nachname.jpg/png/webp)
 * 2. Hier den Namen (genau wie im Dateinamen, aber mit Leerzeichen statt Bindestrichen) und Position eintragen
 */
export const playerMeta: Record<string, Position> = {
  "Andreas Kögler": "Tor",
  "Baris Aktas": "Mittelfeld",
  "Ben Levin Sieg": "Sturm",
  "Cihan Cinar": "Mittelfeld",
  "David Bindhak": "Abwehr",
  "Dennis Ahrbecker": "Mittelfeld",
  "Felix Brieskorn": "Sturm",
  "Florian Lange": "Mittelfeld",
  "Jannes Segelke": "Abwehr",
  "Jannik Brosch": "Tor",
  "Justin Möller": "Mittelfeld",
  "Kim Julien Wegner": "Sturm",
  "Lasse Schröder": "Mittelfeld",
  "Lennard Kern": "Abwehr",
  "Luis-Alexis Villamonte-Reyes": "Sturm",
  "Lukas Mager": "Abwehr",
  "Malte Weidemann": "Mittelfeld",
  "Marius Meineke": "Sturm",
  "Maximilian Leon Schubert": "Mittelfeld",
  "Mel Struß": "Abwehr",
  "Moritz Weingartner": "Sturm",
  "Steven Engel": "Mittelfeld",
  "Steven Rohr": "Abwehr",
  "Sven Potornyai": "Tor",
  "Theo Schlaphoff": "Mittelfeld",
  "Tolka Tükkal": "Sturm",
};
