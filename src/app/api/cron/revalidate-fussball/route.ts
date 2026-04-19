import { revalidateTag } from "next/cache";
import { timingSafeBearerMatch } from "@/lib/admin/bearer-secret";
import { sendDiscordAdminCronRevalidated } from "@/lib/admin/discord-admin-log";

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
