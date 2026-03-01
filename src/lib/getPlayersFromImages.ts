import { readdir } from "fs/promises";
import { join } from "path";
import type { Player } from "@/data/players";
import { playerMeta } from "@/data/playerMeta";

const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * Konvertiert Dateinamen zu Spielernamen
 * Beispiel: "Jannik-Brosch.jpg" -> "Jannik Brosch"
 */
function filenameToName(filename: string): string {
  const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp)$/i, "");
  return nameWithoutExt.replace(/-/g, " ");
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

    for (const file of files) {
      const ext = getImageExtension(file);
      if (!ext || !SUPPORTED_EXTENSIONS.includes(ext)) continue;

      const name = filenameToName(file);
      // Versuche zuerst exakten Match, dann Varianten
      let position = playerMeta[name];
      if (!position) {
        // Versuche auch mit Bindestrichen statt Leerzeichen
        const nameWithDashes = name.replace(/\s+/g, "-");
        position = playerMeta[nameWithDashes];
      }
      if (!position) {
        // Versuche auch Varianten mit gemischten Bindestrichen/Leerzeichen
        const nameVariants = [
          name.replace(/\s+/g, "-"),
          name.replace(/-/g, " "),
        ];
        for (const variant of nameVariants) {
          if (playerMeta[variant]) {
            position = playerMeta[variant];
            break;
          }
        }
      }

      // Nur Spieler mit Position-Mapping anzeigen
      if (!position) continue;

      // Generiere eindeutige ID aus Namen
      const id = name.toLowerCase().replace(/\s+/g, "-");

      players.push({
        id,
        name,
        position,
        image: `/bilder/${file}`,
      });
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
    console.error("Fehler beim Lesen der Spieler-Bilder:", error);
    return [];
  }
}
