import { readdir } from "fs/promises";
import { join } from "path";
import type { Player, Position } from "@/data/players";
import { playerMeta } from "@/data/playerMeta";

const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * Konvertiert Dateinamen zu normalisiertem Spielernamen
 * Beispiele:
 * - "Jannik-Brosch.jpg" -> "Jannik Brosch"
 * - "maximilian-leon schubert.png" -> "Maximilian Leon Schubert"
 * - "Luis-Alexis Villamonte-Reyes.webp" -> "Luis-Alexis Villamonte-Reyes"
 * - "tolga-tükkal.png" -> "Tolga Tükkal"
 */
function filenameToName(filename: string): string {
  const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp)$/i, "");
  
  // Ersetze alle Bindestriche durch Leerzeichen
  let name = nameWithoutExt.replace(/-/g, " ");
  
  // Normalisiere Leerzeichen (mehrere Leerzeichen zu einem)
  name = name.replace(/\s+/g, " ").trim();
  
  // Großschreibung: Erster Buchstabe jedes Wortes groß, Rest klein
  name = name
    .split(" ")
    .map(word => {
      if (word.length === 0) return word;
      // Spezialfall: Doppelnamen mit Bindestrich (z.B. "Luis-Alexis")
      if (word.includes("-")) {
        return word
          .split("-")
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join("-");
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
  
  return name;
}

/**
 * Findet die Dateierweiterung eines Bildes
 */
function getImageExtension(filename: string): string | null {
  const ext = filename.toLowerCase();
  if (ext.endsWith(".jpg") || ext.endsWith(".jpeg")) return ".jpg";
  if (ext.endsWith(".png")) return ".png";
  if (ext.endsWith(".webp")) return ".webp";
  return null;
}

/**
 * Findet Position für einen Spielernamen durch verschiedene Matching-Strategien
 */
function findPosition(name: string): Position | null {
  // 1. Exakter Match
  if (playerMeta[name]) {
    return playerMeta[name] as Position;
  }
  
  // 2. Case-insensitive Match
  const lowerName = name.toLowerCase();
  for (const [metaName, position] of Object.entries(playerMeta)) {
    if (metaName.toLowerCase() === lowerName) {
      return position as Position;
    }
  }
  
  // 3. Match mit Bindestrichen statt Leerzeichen
  const nameWithDashes = name.replace(/\s+/g, "-");
  if (playerMeta[nameWithDashes]) {
    return playerMeta[nameWithDashes] as Position;
  }
  
  // 4. Match mit Leerzeichen statt Bindestrichen
  const nameWithSpaces = name.replace(/-/g, " ");
  if (playerMeta[nameWithSpaces]) {
    return playerMeta[nameWithSpaces] as Position;
  }
  
  // 5. Case-insensitive mit Varianten
  const variants = [
    nameWithDashes,
    nameWithSpaces,
    name.replace(/\s+/g, "-").toLowerCase(),
    name.replace(/-/g, " ").toLowerCase(),
  ];
  
  for (const variant of variants) {
    for (const [metaName, position] of Object.entries(playerMeta)) {
      if (metaName.toLowerCase() === variant.toLowerCase()) {
        return position as Position;
      }
    }
  }
  
  // 6. Spezialfall: "Tolka" -> "Tolga" (für alte Dateinamen)
  if (name.toLowerCase().includes("tolka")) {
    const correctedName = name.replace(/tolka/gi, "Tolga");
    if (playerMeta[correctedName]) {
      return playerMeta[correctedName] as Position;
    }
    // Auch case-insensitive prüfen
    for (const [metaName, position] of Object.entries(playerMeta)) {
      if (metaName.toLowerCase() === correctedName.toLowerCase()) {
        return position as Position;
      }
    }
  }
  
  return null;
}

/**
 * Liest alle Spieler-Bilder aus /public/bilder und generiert Player-Objekte
 * 
 * Nur Spieler mit:
 * - Vorhandenem Bild
 * - Position im playerMeta Mapping
 * werden zurückgegeben.
 */
export async function getPlayersFromImages(): Promise<Player[]> {
  try {
    const bilderDir = join(process.cwd(), "public", "bilder");
    const files = await readdir(bilderDir);

    const players: Player[] = [];
    const unmatchedFiles: string[] = [];

    for (const file of files) {
      const ext = getImageExtension(file);
      if (!ext || !SUPPORTED_EXTENSIONS.includes(ext)) continue;

      const name = filenameToName(file);
      const position = findPosition(name);

      // Nur Spieler mit Position-Mapping anzeigen
      if (!position) {
        unmatchedFiles.push(`${file} -> "${name}"`);
        continue;
      }

      // Generiere eindeutige ID aus Namen
      const id = name.toLowerCase().replace(/\s+/g, "-").replace(/-+/g, "-");

      players.push({
        id,
        name,
        position,
        image: `/bilder/${file}`,
      });
    }

    if (process.env.NODE_ENV === "development" && unmatchedFiles.length > 0) {
      console.warn("[kader] Nicht gematchte Bilder:", unmatchedFiles);
    }

    // Sortiere nach Position (Tor, Abwehr, Mittelfeld, Sturm) und dann nach Name
    const positionOrder: Record<string, number> = {
      Tor: 0,
      Abwehr: 1,
      Mittelfeld: 2,
      Sturm: 3,
    };

    return players.sort((a, b) => {
      const posDiff = (positionOrder[a.position] || 99) - (positionOrder[b.position] || 99);
      if (posDiff !== 0) return posDiff;
      return a.name.localeCompare(b.name, "de");
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Fehler beim Lesen der Spieler-Bilder:", error);
    }
    return [];
  }
}
