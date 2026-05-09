"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, Info, AlertTriangle, XCircle } from "lucide-react";

export interface Notification {
  id: string;
  type: "info" | "warning" | "error";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "info",
    title: "Read-only Access",
    message: "You have view-only permissions. Contact an admin to add or modify devices.",
    time: "Just now",
    read: false,
  },
  {
    id: "n2",
    type: "warning",
    title: "Device Warning",
    message: "ESP32-002 purification rate dropped below 50% threshold.",
    time: "5 min ago",
    read: false,
  },
  {
    id: "n3",
    type: "error",
    title: "Device Offline",
    message: "ESP32-003 has been offline for over 2 hours.",
    time: "2 hr ago",
    read: true,
  },
  {
    id: "n4",
    type: "info",
    title: "System Update",
    message: "CleanAir monitoring system updated to v2.1.3.",
    time: "Yesterday",
    read: true,
  },
];

const TYPE_STYLES = {
  info:    { icon: <Info className="w-4 h-4 text-blue-500" />,          dot: "bg-blue-500",    bg: "bg-blue-50 dark:bg-blue-500/10"    },
  warning: { icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />, dot: "bg-yellow-500",  bg: "bg-yellow-50 dark:bg-yellow-500/10" },
  error:   { icon: <XCircle className="w-4 h-4 text-red-500" />,         dot: "bg-red-500",     bg: "bg-red-50 dark:bg-red-500/10"       },
};

export default function NotificationBell({
  notifications: initial = DEFAULT_NOTIFICATIONS,
}: {
  notifications?: Notification[];
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>(initial);
  const ref = useRef<HTMLDivElement>(null);

  const unread = items.filter((n) => !n.read).length;

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
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
        <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-black/40 z-50 overflow-hidden">
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
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Bell className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              items.map((n) => {
                const style = TYPE_STYLES[n.type];
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => markRead(n.id)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                      !n.read ? style.bg : ""
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">{style.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {n.message}
                      </p>
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
              {items.filter((n) => n.read).length} of {items.length} read
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
