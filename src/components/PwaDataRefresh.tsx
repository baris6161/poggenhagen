"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Abstand zwischen Hintergrund-Aktualisierungen (RSC), passend zum Server-Cache-Revalidate. */
const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

/** Erste Aktualisierung nach Start der Web-App (langer Tab im Vordergrund). */
const FIRST_REFRESH_MS = 60 * 1000;

function isStandalonePwa(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  return (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/**
 * In der vom Home-Bildschirm gestarteten Web-App regelmäßig `router.refresh()` auslösen,
 * damit Server Components (Spielplan, Tabelle, Ergebnisse) neue Daten nachziehen können.
 */
export default function PwaDataRefresh() {
  const router = useRouter();

  useEffect(() => {
    if (!isStandalonePwa()) return;

    const run = () => {
      router.refresh();
    };

    const intervalId = window.setInterval(run, REFRESH_INTERVAL_MS);
    const bootId = window.setTimeout(run, FIRST_REFRESH_MS);

    const onVisibility = () => {
      if (document.visibilityState === "visible") run();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(bootId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [router]);

  return null;
}
