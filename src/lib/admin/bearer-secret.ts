import { timingSafeEqual } from "node:crypto";

/** Konstantzeit-Vergleich für `Authorization: Bearer …` (Cron, Admin-Routen). */
export function timingSafeBearerMatch(
  authHeader: string | null,
  secret: string
): boolean {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const received = authHeader.slice("Bearer ".length);
  const expected = secret;
  if (received.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(received, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    return false;
  }
}
