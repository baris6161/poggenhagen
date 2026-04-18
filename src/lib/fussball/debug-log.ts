const PREFIX = "[pogge:fussball]";

function enabled(): boolean {
  return process.env.FUSSBALL_DEBUG === "1";
}

/** Nur bei FUSSBALL_DEBUG=1 (Vercel / lokal), keine großen HTML-Dumps. */
export function fussballDebug(
  message: string,
  payload?: Record<string, unknown>
): void {
  if (!enabled()) return;
  if (payload && Object.keys(payload).length > 0) {
    console.info(PREFIX, message, payload);
  } else {
    console.info(PREFIX, message);
  }
}
