"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Smartphone, Share2 } from "lucide-react";
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

  if (!visible || isStandalone()) return null;

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none">
        <div className="pointer-events-auto mx-auto max-w-lg rounded-xl border border-border bg-card/95 backdrop-blur shadow-lg p-3 flex flex-col gap-2">
          <p className="text-sm text-foreground font-medium text-center">
            Vereinsseite aufs Handy legen
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            {isAndroid() && androidInstallReady ? (
              <Button
                type="button"
                size="sm"
                className="gap-2"
                onClick={() => void installAndroid()}
              >
                <Smartphone className="h-4 w-4" />
                Installieren
              </Button>
            ) : isIos() ? (
              <Button
                type="button"
                size="sm"
                variant="default"
                className="gap-2"
                onClick={() => {
                  setHelpMode("ios");
                  setHelpOpen(true);
                }}
              >
                <Share2 className="h-4 w-4" />
                So geht&apos;s (iPhone)
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="gap-2"
                onClick={() => {
                  setHelpMode("generic");
                  setHelpOpen(true);
                }}
              >
                <Smartphone className="h-4 w-4" />
                Anleitung
              </Button>
            )}
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
              {helpMode === "ios" ? "Zum Home-Bildschirm" : "Als App oder Verknüpfung"}
            </DialogTitle>
            {helpMode === "ios" ? (
              <DialogDescription asChild>
                <ol className="list-decimal pl-4 space-y-3 text-sm text-muted-foreground text-left pt-2">
                  <li>
                    Unten rechts auf die <strong className="text-foreground">Drei Punkte</strong>{" "}
                    klicken.
                  </li>
                  <li>
                    <strong className="text-foreground">&quot;Teilen&quot;</strong> klicken.
                  </li>
                  <li>
                    Runterscrollen und auf{" "}
                    <strong className="text-foreground">&quot;Zum Home-Bildschirm&quot;</strong>{" "}
                    klicken.
                  </li>
                  <li>
                    Oben rechts auf <strong className="text-foreground">&quot;Hinzufügen&quot;</strong>{" "}
                    klicken. (<strong className="text-foreground">Als Web-App öffnen</strong>, wenn
                    möglich, anschalten.)
                  </li>
                </ol>
              </DialogDescription>
            ) : (
              <DialogDescription className="text-left text-sm text-muted-foreground pt-2 space-y-3">
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
