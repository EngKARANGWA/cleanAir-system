"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  Eye,
  Info,
  Leaf,
  ShieldCheck,
  Wifi,
  WifiOff,
  Wind,
  XCircle,
} from "lucide-react";
import DarkModeToggle from "../../../components/DarkModeToggle";
import NotificationBell from "../../components/NotificationBell";
import { api } from "../../../../lib/api";
import { auth } from "../../../../lib/auth";
import { mapApiDevice, type Device } from "../../devices/data";
import { useAlertNotifications } from "../../../../lib/useAlertNotifications";

// ── helpers ──────────────────────────────────────────────────────────────────

function airQualityLabel(avgInput: number): {
  label: string; color: string; bg: string; icon: React.ReactNode;
} {
  if (avgInput === 0)  return { label: "No Data",   color: "text-slate-400",                       bg: "bg-slate-100 dark:bg-slate-700",            icon: <Info className="w-5 h-5" /> };
  if (avgInput < 200)  return { label: "Good",      color: "text-green-600 dark:text-green-400",   bg: "bg-green-50 dark:bg-green-500/10",          icon: <Leaf className="w-5 h-5 text-green-500" /> };
  if (avgInput < 400)  return { label: "Moderate",  color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-500/10",        icon: <Wind className="w-5 h-5 text-yellow-500" /> };
  if (avgInput < 600)  return { label: "Poor",      color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10",        icon: <Wind className="w-5 h-5 text-orange-500" /> };
  return                      { label: "Hazardous", color: "text-red-600 dark:text-red-400",       bg: "bg-red-50 dark:bg-red-500/10",              icon: <XCircle className="w-5 h-5 text-red-500" /> };
}

const STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  online:  { dot: "bg-green-500",                label: "Online"  },
  warning: { dot: "bg-yellow-500 animate-pulse", label: "Warning" },
  offline: { dot: "bg-slate-400",                label: "Offline" },
};

// ── page ─────────────────────────────────────────────────────────────────────

export default function ViewDashboardPage() {
  const [devices, setDevices]   = useState<Device[]>([]);
  const [loading, setLoading]   = useState(true);
  const [noDevices, setNoDevices] = useState(false);

  const { notifications, markRead, markAllRead } = useAlertNotifications(devices);

  useEffect(() => {
    const user = auth.get();
    if (!user?.id) { setLoading(false); setNoDevices(true); return; }

    async function fetchMyDevices() {
      try {
        // Fetch the viewer's own profile to get the current assigned device IDs
        const profile = await api.users.get(user!.id);
        const assignedIds: string[] = profile.assignedDevices ?? [];

        if (assignedIds.length === 0) {
          setNoDevices(true);
          setDevices([]);
          setLoading(false);
          return;
        }

        // Fetch each assigned device individually
        const results = await Promise.all(assignedIds.map((id) => api.devices.get(id)));
        setDevices(results.map(mapApiDevice));
        setNoDevices(false);
      } catch {
        // silently retry on next poll
      } finally {
        setLoading(false);
      }
    }

    fetchMyDevices();
    const id = setInterval(fetchMyDevices, 10_000);
    return () => clearInterval(id);
  }, []);

  const activeDevices  = devices.filter((d) => d.status !== "offline");
  const onlineDevices  = devices.filter((d) => d.status === "online");
  const offlineDevices = devices.filter((d) => d.status === "offline");

  const avgInput = activeDevices.length
    ? Math.round(activeDevices.reduce((s, d) => s + d.coInput,  0) / activeDevices.length * 100) / 100
    : 0;
  const avgOutput = activeDevices.length
    ? Math.round(activeDevices.reduce((s, d) => s + d.coOutput, 0) / activeDevices.length * 100) / 100
    : 0;
  const avgReduction = activeDevices.length
    ? (activeDevices.reduce((s, d) => s + d.reduction, 0) / activeDevices.length).toFixed(2)
    : "0.00";

  const aq = airQualityLabel(avgInput);

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-10 md:pt-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-emerald-600 rounded-lg">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Device Dashboard</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {loading
              ? "Loading your device…"
              : noDevices
              ? "No devices assigned to your account yet"
              : `${devices.length} device${devices.length !== 1 ? "s" : ""} assigned to you`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell notifications={notifications} onMarkRead={markRead} onMarkAllRead={markAllRead} />
          <DarkModeToggle />
        </div>
      </div>

      {/* ── No devices state ── */}
      {!loading && noDevices && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-2xl mb-4">
            <WifiOff className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-semibold">No device assigned</p>
          <p className="text-sm text-slate-400 mt-1">Ask your administrator to assign a device to your account.</p>
        </div>
      )}

      {/* ── Loading state ── */}
      {loading && (
        <div className="text-center py-16 text-slate-400">Loading your device…</div>
      )}

      {!loading && !noDevices && (
        <>
          {/* ── Air quality summary ── */}
          <div className={`rounded-2xl border border-slate-200 dark:border-slate-700 p-6 ${aq.bg}`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                  Overall Air Quality
                </p>
                <div className="flex items-center gap-3">
                  {aq.icon}
                  <span className={`text-3xl font-extrabold ${aq.color}`}>{aq.label}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Based on {activeDevices.length} active device{activeDevices.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                {[
                  { label: "Avg CO Input",  value: avgInput  > 0 ? `${avgInput} ppm`  : "—", color: "text-red-500"   },
                  { label: "Avg CO Output", value: avgOutput > 0 ? `${avgOutput} ppm` : "—", color: "text-green-500" },
                  { label: "Avg Reduction", value: `${avgReduction}%`,                        color: "text-blue-500"  },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white/60 dark:bg-slate-800/60 rounded-xl px-4 py-3">
                    <p className={`text-xl font-extrabold ${color}`}>{value}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Status strip ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <Wifi className="w-5 h-5 text-green-500" />,      label: "Online",        value: onlineDevices.length,                            color: "text-green-600 dark:text-green-400",  border: "border-green-200 dark:border-green-500/20"  },
              { icon: <ShieldCheck className="w-5 h-5 text-blue-500" />, label: "Purifying Now", value: activeDevices.filter((d) => d.reduction > 0).length, color: "text-blue-600 dark:text-blue-400",    border: "border-blue-200 dark:border-blue-500/20"    },
              { icon: <WifiOff className="w-5 h-5 text-slate-400" />,    label: "Offline",       value: offlineDevices.length,                           color: "text-slate-500 dark:text-slate-400",  border: "border-slate-200 dark:border-slate-700"     },
            ].map(({ icon, label, value, color, border }) => (
              <div key={label} className={`bg-white dark:bg-slate-800 rounded-2xl border ${border} p-5 flex items-center gap-4`}>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl">{icon}</div>
                <div>
                  <p className={`text-2xl font-extrabold ${color}`}>
                    {value} <span className="text-base font-normal text-slate-400">/ {devices.length}</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Device cards ── */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              My Device{devices.length !== 1 ? "s" : ""}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {devices.map((device) => {
                const s = STATUS_STYLES[device.status] ?? STATUS_STYLES.offline;
                return (
                  <div
                    key={device.id}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm"
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{device.name}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{device.id}</p>
                        <p className="text-xs text-slate-400">{device.plateOrRef} · {device.location}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        device.status === "online"
                          ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                          : device.status === "warning"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                    </div>

                    {device.status !== "offline" ? (
                      <>
                        {/* CO readings */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {[
                            { label: "CO Input",  value: `${device.coInput} ppm`,  color: "text-red-500"   },
                            { label: "CO Output", value: `${device.coOutput} ppm`, color: "text-green-500" },
                            { label: "Purified",  value: `${device.reduction}%`,   color: "text-blue-500"  },
                          ].map(({ label, value, color }) => (
                            <div key={label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                              <p className={`text-base font-bold ${color}`}>{value}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
                            </div>
                          ))}
                        </div>

                        {/* Efficiency bar */}
                        <div>
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span>Purification efficiency</span>
                            <span className={`font-semibold ${device.reduction >= 50 ? "text-green-500" : "text-yellow-500"}`}>
                              {device.reduction}%
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${device.reduction >= 50 ? "bg-green-500" : "bg-yellow-500"}`}
                              // eslint-disable-next-line react/forbid-dom-props
                              style={{ width: `${Math.min(device.reduction, 100)}%` }}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-slate-400 py-4">
                        <WifiOff className="w-4 h-4" />
                        Device offline · Last seen {device.lastSeen ?? "unknown"}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-[11px] text-slate-400">Owner: {device.owner}</span>
                      <span className="text-[11px] text-slate-400">Updated live</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── CO reference scale ── */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              CO Level Reference Scale
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { range: "0 – 200 ppm",   label: "Good",      color: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",    icon: <CheckCircle className="w-4 h-4" /> },
                { range: "200 – 400 ppm", label: "Moderate",  color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400", icon: <Info className="w-4 h-4" /> },
                { range: "400 – 600 ppm", label: "Poor",      color: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400", icon: <Wind className="w-4 h-4" /> },
                { range: "600+ ppm",      label: "Hazardous", color: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",             icon: <XCircle className="w-4 h-4" /> },
              ].map(({ range, label, color, icon }) => (
                <div key={label} className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 ${color}`}>
                  {icon}
                  <div>
                    <p className="text-xs font-bold">{label}</p>
                    <p className="text-[11px] opacity-75">{range}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
