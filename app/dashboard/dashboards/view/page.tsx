"use client";

import { CheckCircle, Eye, Info, Leaf, ShieldCheck, Wifi, WifiOff, Wind, XCircle } from "lucide-react";
import { devices } from "../../devices/data";
import DarkModeToggle from "../../../components/DarkModeToggle";
import NotificationBell from "../../components/NotificationBell";

function airQualityLabel(avg: number) {
  if (avg === 0)  return { label: "No Data",   color: "text-slate-400",                       bg: "bg-slate-100 dark:bg-slate-700",                   icon: <Info className="w-5 h-5" /> };
  if (avg < 200)  return { label: "Good",      color: "text-green-600 dark:text-green-400",   bg: "bg-green-50 dark:bg-green-500/10",                 icon: <Leaf className="w-5 h-5 text-green-500" /> };
  if (avg < 400)  return { label: "Moderate",  color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-500/10",               icon: <Wind className="w-5 h-5 text-yellow-500" /> };
  if (avg < 600)  return { label: "Poor",      color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10",               icon: <Wind className="w-5 h-5 text-orange-500" /> };
  return                 { label: "Hazardous", color: "text-red-600 dark:text-red-400",       bg: "bg-red-50 dark:bg-red-500/10",                     icon: <XCircle className="w-5 h-5 text-red-500" /> };
}

const STATUS_DOT: Record<string, string> = {
  online:  "bg-green-500",
  warning: "bg-yellow-500 animate-pulse",
  offline: "bg-slate-400",
};

const STATUS_LABEL: Record<string, string> = {
  online:  "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
  offline: "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400",
};

export default function ViewDashboardPage() {
  const active  = devices.filter((d) => d.status !== "offline");
  const online  = devices.filter((d) => d.status === "online");
  const offline = devices.filter((d) => d.status === "offline");

  const avgInput  = active.length ? Math.round(active.reduce((s, d) => s + d.coInput, 0)  / active.length) : 0;
  const avgOutput = active.length ? Math.round(active.reduce((s, d) => s + d.coOutput, 0) / active.length) : 0;
  const avgRed    = active.length ? (active.reduce((s, d) => s + d.reduction, 0) / active.length).toFixed(1) : "0.0";

  const aq = airQualityLabel(avgInput);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-emerald-600 rounded-lg"><Eye className="w-4 h-4 text-white" /></div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">View Dashboard</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Read-only air quality overview · {devices.length} monitored locations</p>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <DarkModeToggle />
        </div>
      </div>

      {/* Air quality summary */}
      <div className={`rounded-2xl border border-slate-200 dark:border-slate-700 p-6 ${aq.bg}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Overall Air Quality</p>
            <div className="flex items-center gap-3">
              {aq.icon}
              <span className={`text-3xl font-extrabold ${aq.color}`}>{aq.label}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Based on {active.length} active device{active.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Avg CO Input",  value: avgInput  > 0 ? `${avgInput} ppm`  : "—", color: "text-red-500"   },
              { label: "Avg CO Output", value: avgOutput > 0 ? `${avgOutput} ppm` : "—", color: "text-green-500" },
              { label: "Avg Reduction", value: `${avgRed}%`,                               color: "text-blue-500"  },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white/60 dark:bg-slate-800/60 rounded-xl px-4 py-3">
                <p className={`text-xl font-extrabold ${color}`}>{value}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <Wifi className="w-5 h-5 text-green-500" />,     label: "Devices Online",  value: online.length,  border: "border-green-200 dark:border-green-500/20",  color: "text-green-600 dark:text-green-400"  },
          { icon: <ShieldCheck className="w-5 h-5 text-blue-500" />,label: "Purifying Now",   value: active.filter((d) => d.reduction > 0).length, border: "border-blue-200 dark:border-blue-500/20", color: "text-blue-600 dark:text-blue-400" },
          { icon: <WifiOff className="w-5 h-5 text-slate-400" />,   label: "Devices Offline", value: offline.length, border: "border-slate-200 dark:border-slate-700",      color: "text-slate-500 dark:text-slate-400"  },
        ].map(({ icon, label, value, border, color }) => (
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

      {/* Device cards */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Monitored Locations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {devices.map((device) => (
            <div key={device.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{device.name}</p>
                  <p className="text-xs text-slate-400">{device.plateOrRef} · {device.location}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_LABEL[device.status]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[device.status]}`} />
                  {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                </span>
              </div>

              {device.status !== "offline" ? (
                <>
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
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Purification efficiency</span>
                      <span className={device.reduction >= 50 ? "text-green-500 font-semibold" : "text-yellow-500 font-semibold"}>{device.reduction}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${device.reduction >= 50 ? "bg-green-500" : "bg-yellow-500"}`} style={{ width: `${Math.min(device.reduction, 100)}%` }} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-400 py-4">
                  <WifiOff className="w-4 h-4" /> Device offline · Last seen {device.lastSeen}
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                <span className="text-[11px] text-slate-400">Owner: {device.owner}</span>
                <span className="text-[11px] text-slate-400">{device.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reference scale */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500" /> CO Level Reference Scale
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { range: "0–200 ppm",   label: "Good",      color: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",   icon: <CheckCircle className="w-4 h-4" /> },
            { range: "200–400 ppm", label: "Moderate",  color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",icon: <Info className="w-4 h-4" /> },
            { range: "400–600 ppm", label: "Poor",      color: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",icon: <Wind className="w-4 h-4" /> },
            { range: "600+ ppm",    label: "Hazardous", color: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",            icon: <XCircle className="w-4 h-4" /> },
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
    </div>
  );
}
