import { readdir } from "fs/promises";
import { join } from "path";

const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * Liest alle Instagram-Bilder aus /public/instagram
 */
export async function getInstagramImages(): Promise<string[]> {
  try {
    const instagramDir = join(process.cwd(), "public", "instagram");
    console.log("Reading Instagram directory:", instagramDir);
    
    const files = await readdir(instagramDir);
    console.log("Found files in instagram directory:", files);

    const imagePaths: string[] = [];

    for (const file of files) {
      // Prüfe Dateiendung (case-insensitive)
      const lowerFile = file.toLowerCase();
      const hasValidExtension = SUPPORTED_EXTENSIONS.some(ext => lowerFile.endsWith(ext));
      
      if (hasValidExtension) {
        // Pfad für Next.js public folder
        const imagePath = `/instagram/${file}`;
        imagePaths.push(imagePath);
        console.log("Added image:", imagePath);
      } else {
        console.log("Skipped file (invalid extension):", file);
      }
    }

    // Sortiere die Bilder nach Dateinamen (z.B. 1.jpeg, 2.jpeg, 3.jpeg)
    const sorted = imagePaths.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || "0");
      const numB = parseInt(b.match(/\d+/)?.[0] || "0");
      return numA - numB;
    });
    
    console.log("Final sorted image paths:", sorted);
    return sorted;
  } catch (error) {
    console.error("Fehler beim Lesen der Instagram-Bilder:", error);
    // Debug: Zeige mehr Details
    if (error instanceof Error) {
      console.error("Error details:", error.message, error.stack);
    }
    return [];
  }
}
