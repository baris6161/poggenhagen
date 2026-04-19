/** Max. Zeichen pro Embed-Feldwert (Discord-Limit 1024). */
const MAX_FIELD_LEN = 950;
const WEBHOOK_TIMEOUT_MS = 2000;

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

function webhookUrl(): string | null {
  const u = process.env.DISCORD_ADMIN_WEBHOOK_URL?.trim();
  return u && u.length > 0 ? u : null;
}

type DiscordEmbedField = { name: string; value: string; inline?: boolean };

type DiscordWebhookBody = {
  content?: string;
  embeds?: Array<{
    title: string;
    description?: string;
    color?: number;
    fields?: DiscordEmbedField[];
    timestamp?: string;
  }>;
};

type PostResult = { ok: boolean; status: number; error?: string };

async function postDiscordWebhookPayload(
  body: DiscordWebhookBody,
  logLabel: string
): Promise<PostResult> {
  const url = webhookUrl();
  if (!url) return { ok: false, status: 0, error: "no_webhook_url" };

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(
        "[pogge:discord-admin]",
        logLabel,
        "webhook HTTP",
        res.status,
        truncate(text, 300)
      );
      return { ok: false, status: res.status, error: truncate(text, 200) };
    }
    return { ok: true, status: res.status };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn("[pogge:discord-admin]", logLabel, "webhook failed", msg);
    return { ok: false, status: 0, error: msg };
  } finally {
    clearTimeout(t);
  }
}

/**
 * POST an Discord-Webhook. Schlägt still fehl (kein throw), blockiert max. ~2 s.
 * Ohne `DISCORD_ADMIN_WEBHOOK_URL`: no-op.
 */
export async function sendDiscordAdminLog(input: {
  title: string;
  color?: number;
  fields: DiscordEmbedField[];
  content?: string;
}): Promise<void> {
  if (!webhookUrl()) return;

  const body: DiscordWebhookBody = {
    content: input.content,
    embeds: [
      {
        title: truncate(input.title, 250),
        color: input.color ?? 0x5865f2,
        fields: input.fields.map((f) => ({
          name: truncate(f.name, 250),
          value: truncate(f.value, MAX_FIELD_LEN),
          inline: f.inline,
        })),
        timestamp: new Date().toISOString(),
      },
    ],
  };

  await postDiscordWebhookPayload(body, "sendDiscordAdminLog");
}

/** Kurzer Eintrag nach erfolgreichem Cron-Revalidate (ohne Secrets). */
export async function sendDiscordAdminCronRevalidated(): Promise<void> {
  await sendDiscordAdminLog({
    title: "Pogge Cron: Cache invalidiert",
    color: 0xfee75c,
    content: "`pogge-fussball` — nächster Seitenaufruf lädt Bundle neu.",
    fields: [
      { name: "Zeit", value: new Date().toISOString(), inline: true },
      { name: "Umgebung", value: process.env.NODE_ENV ?? "?", inline: true },
    ],
  });
}

export type DiscordWebhookTestResult = {
  configured: boolean;
  ok: boolean;
  status: number;
  error?: string;
};

/**
 * Einmaliger Test-POST (manuelle Verbindungsprüfung). Kein throw.
 * `configured: false` wenn keine Webhook-URL gesetzt ist.
 */
export async function sendDiscordAdminWebhookTest(): Promise<DiscordWebhookTestResult> {
  if (!webhookUrl()) {
    return { configured: false, ok: false, status: 0, error: "no_webhook_url" };
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  const fields: DiscordEmbedField[] = [
    { name: "Zeit", value: new Date().toISOString(), inline: true },
    { name: "NODE_ENV", value: process.env.NODE_ENV ?? "?", inline: true },
  ];
  if (vercelUrl) {
    fields.push({
      name: "VERCEL_URL",
      value: vercelUrl.length > 900 ? `${vercelUrl.slice(0, 897)}…` : vercelUrl,
    });
  }

  const body: DiscordWebhookBody = {
    embeds: [
      {
        title: "Pogge: Webhook-Verbindung OK",
        description: "Manueller Verbindungstest (`/api/admin/verify-discord-webhook`).",
        color: 0x57f287,
        fields,
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const r = await postDiscordWebhookPayload(body, "webhookTest");
  return { configured: true, ok: r.ok, status: r.status, error: r.error };
}
