import { timingSafeBearerMatch } from "@/lib/admin/bearer-secret";
import { sendDiscordAdminWebhookTest } from "@/lib/admin/discord-admin-log";

/**
 * GET mit `Authorization: Bearer <CRON_SECRET>` — sendet eine kurze Test-Nachricht an Discord
 * (wenn `DISCORD_ADMIN_WEBHOOK_URL` gesetzt ist). Prüft die Webhook-Verbindung ohne Bundle-Rebuild.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || !timingSafeBearerMatch(auth, secret)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await sendDiscordAdminWebhookTest();

  if (!result.configured) {
    return Response.json(
      { ok: false, error: "DISCORD_ADMIN_WEBHOOK_URL not set" },
      { status: 503 }
    );
  }

  if (!result.ok) {
    return Response.json(
      {
        ok: false,
        error: "Discord webhook request failed",
        discordStatus: result.status,
        detail: result.error ?? null,
      },
      { status: 502 }
    );
  }

  return Response.json({
    ok: true,
    discordStatus: result.status,
    at: new Date().toISOString(),
  });
}
