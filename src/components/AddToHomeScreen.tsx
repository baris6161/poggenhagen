"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "pogge-add-home-dismissed-until";
const DISMISS_MS = 1000 * 60 * 60 * 24 * 7;

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const m = window.matchMedia("(display-mode: standalone)");
  if (m.matches) return true;
  return (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

/** Chrome PWA Install Prompt (nicht in lib.dom) */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<{ outcome: string }>;
};

export default function AddToHomeScreen() {
  const [visible, setVisible] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpMode, setHelpMode] = useState<"ios" | "generic">("ios");
  const [androidInstallReady, setAndroidInstallReady] = useState(false);
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (!isMobileViewport() || isStandalone()) return;
    const until = localStorage.getItem(DISMISS_KEY);
    if (until && Date.now() < parseInt(until, 10)) return;
    setVisible(true);
  }, []);

  useEffect(() => {
    const onBip = (e: Event) => {
      e.preventDefault();
      deferredRef.current = e as BeforeInstallPromptEvent;
      setAndroidInstallReady(true);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_MS));
    setVisible(false);
  }, []);

  const installAndroid = useCallback(async () => {
    const ev = deferredRef.current;
    if (!ev) {
      setHelpMode("generic");
      setHelpOpen(true);
      return;
    }
    await ev.prompt();
    deferredRef.current = null;
    setAndroidInstallReady(false);
    dismiss();
  }, [dismiss]);

  const openIosHelp = useCallback(() => {
    setHelpMode("ios");
    setHelpOpen(true);
  }, []);

  const openGenericHelp = useCallback(() => {
    setHelpMode("generic");
    setHelpOpen(true);
  }, []);

  /** Ein Tipp: iOS Hilfe, Android mit Prompt = Install, sonst Hilfe. */
  const onPrimaryBannerTap = useCallback(() => {
    if (isAndroid() && androidInstallReady) {
      void installAndroid();
      return;
    }
    if (isIos()) {
      openIosHelp();
      return;
    }
    openGenericHelp();
  }, [androidInstallReady, installAndroid, openGenericHelp, openIosHelp]);

  if (!visible || isStandalone()) return null;

  const primaryLabel =
    isAndroid() && androidInstallReady ? "App installieren" : "Vereinsseite aufs Handy legen";

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none">
        <div className="pointer-events-auto mx-auto max-w-lg rounded-xl border border-border bg-card/95 backdrop-blur shadow-lg p-3 flex flex-col gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            className="h-auto min-h-11 w-full gap-2 whitespace-normal py-2.5 px-3 text-sm font-semibold leading-snug"
            onClick={onPrimaryBannerTap}
          >
            {isAndroid() && androidInstallReady ? (
              <Smartphone className="h-4 w-4 shrink-0" aria-hidden />
            ) : null}
            {primaryLabel}
          </Button>
          <div className="flex justify-center">
            <Button type="button" size="sm" variant="ghost" onClick={dismiss}>
              Später
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {helpMode === "ios"
                ? "Dann in Safari: Teilen, Zum Home-Bildschirm, Hinzufügen"
                : "Als App oder Verknüpfung"}
            </DialogTitle>
            {helpMode === "ios" ? (
              <DialogDescription asChild>
                <div className="space-y-3 pt-2 text-left text-sm text-muted-foreground">
                  <p>
                    Apple erlaubt keinen direkten Sprung in den Systemdialog. Du musst einmal{" "}
                    <strong className="text-foreground">Teilen</strong> öffnen, dann{" "}
                    <strong className="text-foreground">Zum Home-Bildschirm</strong> wählen. Danach
                    tippt du oben rechts auf{" "}
                    <strong className="text-foreground">Hinzufügen</strong>.
                  </p>
                  <ol className="list-decimal space-y-2 pl-4">
                    <li>Unten in Safari das Teilen-Symbol (Quadrat mit Pfeil nach oben).</li>
                    <li>Nach unten scrollen: Zum Home-Bildschirm.</li>
                    <li>Oben rechts Hinzufügen.</li>
                  </ol>
                </div>
              </DialogDescription>
            ) : (
              <DialogDescription className="space-y-3 pt-2 text-left text-sm text-muted-foreground">
                <p>
                  Im Browser-Menü (meist drei Punkte) nach{" "}
                  <strong className="text-foreground">App installieren</strong> oder{" "}
                  <strong className="text-foreground">Zum Startbildschirm hinzufügen</strong> suchen.
                  Wenn Chrome „Installieren“ anbietet, erscheint dafür im Banner ein eigener Button.
                </p>
              </DialogDescription>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
