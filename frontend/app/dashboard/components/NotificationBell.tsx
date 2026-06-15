"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell, BellOff, BellRing, CheckCheck,
  Info, AlertTriangle, XCircle, Check,
} from "lucide-react";
import { initFCM, requestPermission, getPermission, showNotification } from "../../../lib/fcm";
import type { AppNotification } from "../../../lib/useAlertNotifications";

const TYPE_STYLES = {
  info:    { icon: <Info    className="w-4 h-4 text-blue-500"   />, dot: "bg-blue-500",   bg: "bg-blue-50 dark:bg-blue-500/10"    },
  warning: { icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />, dot: "bg-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-500/10" },
  error:   { icon: <XCircle className="w-4 h-4 text-red-500"   />, dot: "bg-red-500",    bg: "bg-red-50 dark:bg-red-500/10"      },
};

export default function NotificationBell({
  notifications = [],
  onMarkRead    = () => {},
  onMarkAllRead = () => {},
}: {
  notifications?: AppNotification[];
  onMarkRead?:    (id: string) => void;
  onMarkAllRead?: () => void;
}) {
  const [open,       setOpen]       = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [enabling,   setEnabling]   = useState(false);
  const [justEnabled, setJustEnabled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const perm = getPermission();
    setPermission(perm);
    // Only initialize FCM silently if permission is already granted — avoids
    // Firebase's getToken() triggering a browser permission dialog on mount.
    if (perm === "granted") initFCM().catch(() => {});
  }, []);

  async function handleEnable() {
    setEnabling(true);
    try {
      const perm = await requestPermission();
      setPermission(perm);
      if (perm === "granted") {
        // Register SW + get FCM token in background — non-blocking
        initFCM().catch(() => {});
        // Fire an immediate confirmation notification so user can see it works
        await showNotification("CleanAir Alerts Enabled", {
          body: "You'll receive browser notifications when CO levels are dangerous.",
          tag:  "cleanair-enabled",
        });
        setJustEnabled(true);
        setTimeout(() => setJustEnabled(false), 3000);
      }
    } finally {
      setEnabling(false);
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">

      {/* Bell button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-blue-500 hover:border-blue-300 dark:hover:border-blue-500 transition-all shadow-sm"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden">

          {/* Permission banner */}
          {permission !== "granted" && permission !== "unsupported" && (
            <div className={`px-4 py-3 border-b flex items-center gap-3 ${
              permission === "denied"
                ? "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20"
                : "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20"
            }`}>
              <BellOff className={`w-4 h-4 shrink-0 ${permission === "denied" ? "text-red-500" : "text-blue-500"}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${permission === "denied" ? "text-red-700 dark:text-red-300" : "text-blue-700 dark:text-blue-300"}`}>
                  {permission === "denied" ? "Notifications blocked" : "Enable push notifications"}
                </p>
                <p className={`text-[11px] mt-0.5 ${permission === "denied" ? "text-red-500" : "text-blue-500"}`}>
                  {permission === "denied"
                    ? "Open browser settings → Site permissions → Allow notifications"
                    : "Get alerted when CO levels are dangerous"}
                </p>
              </div>
              {permission !== "denied" && (
                <button
                  type="button"
                  onClick={handleEnable}
                  disabled={enabling}
                  className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded-lg font-medium hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                  {enabling ? "…" : "Enable"}
                </button>
              )}
            </div>
          )}

          {/* Success flash after enabling */}
          {justEnabled && (
            <div className="px-4 py-2.5 bg-green-50 dark:bg-green-500/10 border-b border-green-100 dark:border-green-500/20 flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500 shrink-0" />
              <p className="text-xs font-semibold text-green-700 dark:text-green-300">
                Notifications enabled — check your browser for the test alert!
              </p>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</span>
              {unread > 0 && (
                <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                  {unread} new
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <BellRing className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">No alerts — all systems normal</p>
              </div>
            ) : (
              notifications.map((n) => {
                const style = TYPE_STYLES[n.type];
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => onMarkRead(n.id)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${!n.read ? style.bg : ""}`}
                  >
                    <div className="mt-0.5 shrink-0">{style.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{n.title}</p>
                        {!n.read && <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{n.time}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700 text-center">
            <p className="text-xs text-slate-400">
              {notifications.filter((n) => n.read).length} of {notifications.length} read
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
