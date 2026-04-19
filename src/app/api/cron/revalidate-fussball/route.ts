import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { sendDiscordAdminCronRevalidated } from "@/lib/admin/discord-admin-log";

function timingSafeBearerMatch(authHeader: string | null, secret: string): boolean {
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

/**
 * Vercel Cron: Cache der FUSSBALL.DE-Daten invalidieren (siehe vercel.json).
 * In Vercel Projekt `CRON_SECRET` setzen — Vercel sendet `Authorization: Bearer …`.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || !timingSafeBearerMatch(auth, secret)) {
    return new Response("Unauthorized", { status: 401 });
  }
  revalidateTag("pogge-fussball");
  await sendDiscordAdminCronRevalidated();
  return Response.json({ ok: true, at: new Date().toISOString() });
}
