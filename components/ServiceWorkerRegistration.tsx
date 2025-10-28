"use client";

import { useEffect } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

declare global {
  interface Window {
    workbox?: {
      register: () => Promise<void | ServiceWorkerRegistration>;
    };
    deferredPWAInstallPrompt?: BeforeInstallPromptEvent;
  }
}

export function ServiceWorkerRegistration(): null {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const shouldRegister =
      process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_ENABLE_PWA === "true";

    const registerServiceWorker = async () => {
      try {
        await window.workbox?.register();
      } catch {}
    };

    let loadListener: (() => void) | undefined;

    if (shouldRegister) {
      if (window.workbox) {
        void registerServiceWorker();
      } else {
        loadListener = () => {
          if (window.workbox) {
            void registerServiceWorker();
          }
        };
        window.addEventListener("load", loadListener);
      }
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      window.deferredPWAInstallPrompt = promptEvent;
    };

    const handleAppInstalled = () => {
      window.deferredPWAInstallPrompt = undefined;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      if (loadListener) {
        window.removeEventListener("load", loadListener);
      }
    };
  }, []);

  return null;
}
