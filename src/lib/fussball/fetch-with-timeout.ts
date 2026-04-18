/**
 * Fetch mit hartem Timeout per AbortController.
 * Bei Timeout: rejected Promise (typisch DOMException "AbortError"), vom Aufrufer wie Netzwerkfehler behandeln.
 */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(tid);
  }
}
