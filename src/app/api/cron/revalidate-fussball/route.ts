import { revalidateTag } from "next/cache";

/**
 * Vercel Cron: Cache der FUSSBALL.DE-Daten invalidieren (siehe vercel.json).
 * In Vercel Projekt `CRON_SECRET` setzen — Vercel sendet `Authorization: Bearer …`.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  revalidateTag("pogge-fussball");
  return Response.json({ ok: true, at: new Date().toISOString() });
}
