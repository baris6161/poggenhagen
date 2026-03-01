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
  // Tor
  "Jannik Brosch": "Tor",
  "Jannes Segelke": "Tor",
  "Ben Levin Sieg": "Tor",
  
  // Abwehr
  "Dennis Ahrbecker": "Abwehr",
  "Lasse Schröder": "Abwehr",
  "Lukas Mager": "Abwehr",
  "Malte Weidemann": "Abwehr",
  
  // Mittelfeld
  "Steven Rohr": "Mittelfeld",
  "Cihan Cinar": "Mittelfeld",
  "Marius Meineke": "Mittelfeld",
  "Florian Lange": "Mittelfeld",
  "Theo Schlaphoff": "Mittelfeld",
  "Baris Aktas": "Mittelfeld",
  "Kim Julien Wegner": "Mittelfeld",
  "Felix Brieskorn": "Mittelfeld",
  "Mel Struß": "Mittelfeld",
  "Steven Engel": "Mittelfeld",
  "Justin Möller": "Mittelfeld",
  "Maximilian Leon Schubert": "Mittelfeld",
  
  // Sturm
  "Tolka Tükkal": "Sturm",
  "Moritz Weingartner": "Sturm",
  "Luis-Alexis Villamonte-Reyes": "Sturm", // Bindestrich im Namen beibehalten
  "Lennard Kern": "Sturm",
};
