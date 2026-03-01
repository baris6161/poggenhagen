import { readdir } from "fs/promises";
import { join } from "path";

const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * Liest alle Instagram-Bilder aus /public/instagram
 */
export async function getInstagramImages(): Promise<string[]> {
  try {
    const instagramDir = join(process.cwd(), "public", "instagram");
    const files = await readdir(instagramDir);

    const images: string[] = [];

    for (const file of files) {
      const ext = file.toLowerCase();
      if (
        ext.endsWith(".jpg") ||
        ext.endsWith(".jpeg") ||
        ext.endsWith(".png") ||
        ext.endsWith(".webp")
      ) {
        images.push(`/instagram/${file}`);
      }
    }

    // Sortiere nach Dateiname (1.jpeg, 2.jpeg, 3.jpeg)
    return images.sort();
  } catch (error) {
    console.error("Fehler beim Lesen der Instagram-Bilder:", error);
    return [];
  }
}
