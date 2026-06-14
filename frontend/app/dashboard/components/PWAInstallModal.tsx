"use client";

import { useEffect, useState, useCallback } from "react";
import { Download, X, Wind, Smartphone } from "lucide-react";

const DISMISSED_KEY = "cleanair_pwa_install_dismissed";
const DELAY_MS = 20_000;

function isAlreadyInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigator as any).standalone === true
  );
}

function wasDismissed(): boolean {
  try {
    return !!localStorage.getItem(DISMISSED_KEY);
  } catch {
    return false;
  }
}

export default function PWAInstallModal() {
  const [visible, setVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (isAlreadyInstalled() || wasDismissed()) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const timer = setTimeout(() => {
      // Re-check at show time in case user installed during the 20s
      if (!isAlreadyInstalled() && !wasDismissed()) {
        setVisible(true);
      }
    }, DELAY_MS);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, []);

  const dismiss = useCallback(() => {
    try { localStorage.setItem(DISMISSED_KEY, "1"); } catch { /* ignore */ }
    setVisible(false);
  }, []);

  const install = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setVisible(false);
        return;
      }
    }
    // If browser install dialog was dismissed, treat as user rejection
    dismiss();
  }, [deferredPrompt, dismiss]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Close button */}
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header gradient */}
        <div className="bg-gradient-to-br from-blue-600 to-green-500 px-6 pt-8 pb-6 flex flex-col items-center text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-3">
            <Wind className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Install CleanAir</h2>
          <p className="text-blue-100 text-sm mt-1">Access your dashboard instantly</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-blue-500 shrink-0" />
              Works offline — check status without internet
            </li>
            <li className="flex items-center gap-3">
              <Download className="w-4 h-4 text-green-500 shrink-0" />
              Installs to your home screen in one tap
            </li>
            <li className="flex items-center gap-3">
              <Wind className="w-4 h-4 text-indigo-500 shrink-0" />
              Receive push alerts for CO spikes
            </li>
          </ul>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={install}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="w-full py-2.5 px-4 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
