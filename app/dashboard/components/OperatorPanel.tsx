"use client";

import { AlertTriangle, CheckCircle, Clock, Cpu, Eye, Radio, TrendingDown, Activity, BellRing, Zap } from "lucide-react";
import Link from "next/link";
import { devices } from "../devices/data";

const ACTIVE_ALERTS = [
  { id: 1, level: "CRITICAL", message: "CO level above 500 ppm — Kimironko Metal Workshop", time: "3 min ago" },
  { id: 2, level: "WARNING",  message: "ESP32-002 purification rate below 50%",              time: "12 min ago" },
  { id: 3, level: "WARNING",  message: "ESP32-003 offline — last seen 2 hours ago",           time: "2 hr ago" },
];

const STATUS_DOT: Record<string, string> = {
  online:  "bg-green-500",
  warning: "bg-yellow-500 animate-pulse",
  offline: "bg-slate-400",
};

const ALERT_COLORS: Record<string, string> = {
  CRITICAL: "border-red-500/40 bg-red-500/5",
  WARNING:  "border-yellow-500/40 bg-yellow-500/5",
};

export default function OperatorPanel({ operatorName }: { operatorName: string }) {
  const online   = devices.filter((d) => d.status === "online").length;
  const warning  = devices.filter((d) => d.status === "warning").length;
  const offline  = devices.filter((d) => d.status === "offline").length;
  const critical = ACTIVE_ALERTS.filter((a) => a.level === "CRITICAL").length;

  return (
    <div className="space-y-6">
      {/* Shift banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 p-5 text-white shadow-lg shadow-blue-500/25">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-blue-200" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">Shift Status</p>
              <p className="text-lg font-bold">Welcome, {operatorName}</p>
              <p className="text-blue-100 text-sm">Monitoring {devices.length} devices across all zones</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-xl text-sm">
            <Clock className="w-4 h-4" /> Active &amp; On Duty
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {[
            { label: "Online",   value: online,   color: "bg-green-400/25 text-green-100",  icon: <CheckCircle className="w-4 h-4" /> },
            { label: "Warning",  value: warning,  color: "bg-yellow-400/25 text-yellow-100",icon: <AlertTriangle className="w-4 h-4" /> },
            { label: "Offline",  value: offline,  color: "bg-white/10 text-blue-100",       icon: <Cpu className="w-4 h-4" /> },
            { label: "Critical", value: critical, color: "bg-red-400/25 text-red-100",      icon: <BellRing className="w-4 h-4" /> },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 ${color}`}>
              {icon}
              <div>
                <p className="text-xl font-bold leading-none">{value}</p>
                <p className="text-[11px] uppercase tracking-wide opacity-80 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Device health + Active alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" /> Device Health
            </h3>
            <Link href="/dashboard/devices" className="text-xs text-blue-500 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[device.status]}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{device.name}</p>
                    <p className="text-[11px] text-slate-400">{device.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  {device.status !== "offline" ? (
                    <>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{device.coInput} ppm</p>
                      <p className="text-[11px] text-green-500">
                        <TrendingDown className="w-3 h-3 inline mr-0.5" />{device.reduction}% purified
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-400">Offline</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" /> Active Alerts
              {critical > 0 && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">{critical} critical</span>}
            </h3>
            <Link href="/dashboard/alerts" className="text-xs text-blue-500 hover:underline">View all</Link>
          </div>
          <div className="space-y-2.5">
            {ACTIVE_ALERTS.map((alert) => (
              <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-xl border ${ALERT_COLORS[alert.level]}`}>
                <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${alert.level === "CRITICAL" ? "text-red-500" : "text-yellow-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">{alert.message}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/alerts" className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
            <Eye className="w-4 h-4" /> View &amp; Acknowledge All
          </Link>
        </div>
      </div>
    </div>
  );
}
