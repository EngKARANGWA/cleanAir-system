"use client";

import { useEffect, useRef, useState } from "react";
import type { Device } from "../app/dashboard/devices/data";
import { showNotification } from "./fcm";

export interface AppNotification {
  id:      string;
  type:    "info" | "warning" | "error";
  title:   string;
  message: string;
  time:    string;
  read:    boolean;
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function useAlertNotifications(devices: Device[]) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  // Track fired alert keys so each alert only fires once until the condition clears
  const fired = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (devices.length === 0) return;

    const time     = nowTime();
    const newItems: AppNotification[] = [];

    function fire(
      key:      string,
      type:     AppNotification["type"],
      title:    string,
      message:  string,
      critical  = false
    ) {
      if (fired.current.has(key)) return;
      fired.current.add(key);
      newItems.push({ id: key, type, title, message, time, read: false });
      showNotification(title, { body: message, tag: key, requireInteraction: critical });
    }

    for (const dev of devices) {

      // ── Device offline ──────────────────────────────────────────────
      const offKey = `off-${dev.id}`;
      if (dev.status === "offline") {
        fire(offKey, "info",
          `Device Offline — ${dev.name}`,
          `${dev.id} lost connection. Check network or power.`
        );
      } else {
        fired.current.delete(offKey); // auto-clear when device reconnects
      }

      // ── CO Critical ≥ 500 ppm ───────────────────────────────────────
      const critKey = `crit-${dev.id}`;
      if (dev.coInput >= 500) {
        fire(critKey, "error",
          `CO Critical — ${dev.name}`,
          `CO input at ${dev.coInput} ppm on ${dev.plateOrRef}. Exceeds 500 ppm safety threshold.`,
          true
        );
      } else {
        fired.current.delete(critKey);
      }

      // ── CO Warning 400–499 ppm ──────────────────────────────────────
      const warnKey = `warn-${dev.id}`;
      if (dev.coInput >= 400 && dev.coInput < 500) {
        fire(warnKey, "warning",
          `CO Warning — ${dev.name}`,
          `CO input at ${dev.coInput} ppm on ${dev.plateOrRef}. Above 400 ppm warning threshold.`
        );
      } else {
        fired.current.delete(warnKey);
      }

      // ── Low purification < 45 % ─────────────────────────────────────
      const effKey = `eff-${dev.id}`;
      if (dev.status !== "offline" && dev.coInput > 0 && dev.reduction < 45) {
        fire(effKey, "warning",
          `Low Purification — ${dev.name}`,
          `Efficiency at ${dev.reduction}% on ${dev.plateOrRef}, below the 45% target.`
        );
      } else {
        fired.current.delete(effKey);
      }
    }

    if (newItems.length > 0) {
      setNotifications((prev) => [...newItems, ...prev].slice(0, 50));
    }
  }, [devices]);

  const markRead    = (id: string) =>
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const clearAll = () => {
    setNotifications([]);
    fired.current.clear();
  };

  return { notifications, markRead, markAllRead, clearAll };
}
