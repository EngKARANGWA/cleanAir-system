"use client";

import { getMessaging, getToken, onMessage, type Messaging } from "firebase/messaging";
import { getFirebaseApp, firebaseConfig } from "./firebase";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? "";

let messaging: Messaging | null = null;
let swReg: ServiceWorkerRegistration | null = null;

// Register firebase-messaging-sw.js and pass it the Firebase config
async function getSwRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;
  if (swReg) return swReg;
  try {
    swReg = await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: "/" });
    // Inject Firebase config into the service worker (avoids hardcoding in sw.js)
    swReg.active?.postMessage({ type: "FIREBASE_CONFIG", config: firebaseConfig });
    swReg.installing?.addEventListener("statechange", function () {
      if (this.state === "activated") {
        swReg?.active?.postMessage({ type: "FIREBASE_CONFIG", config: firebaseConfig });
      }
    });
    return swReg;
  } catch {
    return null;
  }
}

export async function initFCM(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  if (!("Notification" in window))   return null;
  if (Notification.permission === "denied") return null;
  if (!VAPID_KEY) {
    console.warn("FCM: NEXT_PUBLIC_FIREBASE_VAPID_KEY is not set");
    return null;
  }

  try {
    const sw = await getSwRegistration();
    if (!sw) return null;

    const app  = getFirebaseApp();
    messaging  = getMessaging(app);

    const token = await getToken(messaging, {
      vapidKey:                VAPID_KEY,
      serviceWorkerRegistration: sw,
    });

    // Store token locally — send to your backend here when you're ready
    if (token) localStorage.setItem("fcm_token", token);
    return token;
  } catch {
    return null;
  }
}

// Listen for FCM messages while the tab is in the foreground
export function onForegroundMessage(cb: (title: string, body: string, tag: string) => void): () => void {
  if (!messaging) return () => {};
  const unsub = onMessage(messaging, (payload) => {
    const title = payload.notification?.title ?? "CleanAir Alert";
    const body  = payload.notification?.body  ?? "";
    const tag   = payload.notification?.tag   ?? "cleanair";
    cb(title, body, tag);
  });
  return unsub;
}

// Show a notification via the service worker (works in foreground AND background tab)
export async function showNotification(title: string, options: NotificationOptions & { requireInteraction?: boolean } = {}): Promise<void> {
  if (typeof window === "undefined") return;
  if (!("Notification" in window))   return;
  if (Notification.permission !== "granted") return;

  const sw = swReg ?? await getSwRegistration();
  if (sw?.active) {
    sw.active.postMessage({ type: "NOTIFY", title, options: { icon: "/favicon.ico", badge: "/favicon.ico", ...options } });
  } else {
    new Notification(title, { icon: "/favicon.ico", ...options });
  }
}

export function getPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  if (Notification.permission !== "default") return Notification.permission;
  return Notification.requestPermission();
}
