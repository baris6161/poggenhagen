import { readFile } from "fs/promises";
import { join } from "path";

const LOGO_FILENAME = "TSV-Poggenhagen.webp";

/** Base64-Daten-URL des Vereinslogos (public/) für OG/Favicon-ImageResponse. */
export async function getLogoDataUrl(): Promise<string | null> {
  try {
    const buf = await readFile(join(process.cwd(), "public", LOGO_FILENAME));
    return `data:image/webp;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}
