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
  const url = webhookUrl();
  if (!url) return;

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
      console.warn(
        "[pogge:discord-admin] webhook HTTP",
        res.status,
        await res.text().catch(() => "")
      );
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn("[pogge:discord-admin] webhook failed", msg);
  } finally {
    clearTimeout(t);
  }
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
