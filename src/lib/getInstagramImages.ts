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

    const imagePaths: string[] = [];

    for (const file of files) {
      const lowerFile = file.toLowerCase();
      const hasValidExtension = SUPPORTED_EXTENSIONS.some((ext) => lowerFile.endsWith(ext));

      if (hasValidExtension) {
        imagePaths.push(`/instagram/${file}`);
      }
    }

    return imagePaths.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
      return numA - numB;
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[instagram] Verzeichnis public/instagram nicht lesbar oder leer:", error);
    }
    return [];
  }
}
