// Firebase Messaging Service Worker
// This file MUST be named firebase-messaging-sw.js and placed in /public

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Config is injected at registration time via a message
let messaging = null;

self.addEventListener("message", (e) => {
  if (e.data?.type === "FIREBASE_CONFIG") {
    if (messaging) return; // already initialised
    firebase.initializeApp(e.data.config);
    messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const { title, body, tag } = payload.notification ?? {};
      self.registration.showNotification(title ?? "CleanAir Alert", {
        body:               body  ?? "A threshold has been breached.",
        icon:               "/favicon.ico",
        badge:              "/favicon.ico",
        tag:                tag   ?? "cleanair",
        requireInteraction: payload.data?.critical === "true",
        data:               { url: "/dashboard" },
      });
    });
  }

  // Direct notify from main thread (frontend-detected breach)
  if (e.data?.type === "NOTIFY") {
    const { title, options } = e.data;
    self.registration.showNotification(title, { icon: "/favicon.ico", badge: "/favicon.ico", ...options });
  }
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url ?? "/dashboard";
  e.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((all) => {
        const match = all.find((c) => c.url.includes("/dashboard"));
        return match ? match.focus() : self.clients.openWindow(url);
      })
  );
});
