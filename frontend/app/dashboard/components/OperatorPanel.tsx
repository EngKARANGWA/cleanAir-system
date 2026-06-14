"use client";

import { Activity, AlertTriangle, CheckCircle, Clock, Cpu, Eye, Radio, TrendingDown } from "lucide-react";
import Link from "next/link";
import type { Device } from "../devices/data";

const STATUS_DOT: Record<string, string> = {
  online:  "bg-green-500",
  warning: "bg-yellow-500 animate-pulse",
  offline: "bg-slate-400",
};

const STATUS_TEXT: Record<string, string> = {
  online:  "text-green-600 dark:text-green-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  offline: "text-slate-500 dark:text-slate-400",
};

const ALERT_COLORS: Record<string, string> = {
  CRITICAL: "border-red-500/40 bg-red-500/5 text-red-500",
  WARNING:  "border-yellow-500/40 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400",
};

export default function OperatorPanel({
  operatorName,
  devices,
}: {
  operatorName: string;
  devices: Device[];
}) {
  const online   = devices.filter((d) => d.status === "online").length;
  const warning  = devices.filter((d) => d.status === "warning").length;
  const offline  = devices.filter((d) => d.status === "offline").length;

  const activeAlerts = devices
    .filter((d) => d.status === "warning")
    .map((d) => ({
      id:      d.id,
      level:   d.coInput >= 500 ? "CRITICAL" : "WARNING",
      message:
        d.coInput >= 500
          ? `CO level ${d.coInput} ppm on ${d.name} — critical threshold exceeded`
          : `CO level ${d.coInput} ppm on ${d.name} — above warning threshold`,
      time: d.lastSeen,
    }));

  const critical = activeAlerts.filter((a) => a.level === "CRITICAL").length;

  return (
    <div className="space-y-6">
      {/* Shift Header */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-5 text-white shadow-lg shadow-blue-500/20">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-semibold uppercase tracking-widest opacity-80">Active Shift</span>
            </div>
            <h2 className="text-xl font-bold">Welcome, {operatorName}</h2>
            <p className="text-blue-100 text-sm mt-0.5">
              Monitoring {devices.length} device{devices.length !== 1 ? "s" : ""} across all zones
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl text-sm font-medium">
            <Clock className="w-4 h-4" />
            <span>
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · Live
            </span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {[
            { label: "Online",         value: online,   icon: <CheckCircle className="w-4 h-4" />,   color: "bg-green-400/20 text-green-100"  },
            { label: "Warning",        value: warning,  icon: <AlertTriangle className="w-4 h-4" />, color: "bg-yellow-400/20 text-yellow-100" },
            { label: "Offline",        value: offline,  icon: <Cpu className="w-4 h-4" />,           color: "bg-white/10 text-blue-100"        },
            { label: "Critical Alerts",value: critical, icon: <Activity className="w-4 h-4" />,      color: "bg-red-400/20 text-red-100"       },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className={`rounded-xl px-3 py-2.5 ${color} flex items-center gap-2`}>
              {icon}
              <div>
                <p className="text-lg font-bold leading-none">{value}</p>
                <p className="text-[10px] opacity-80 uppercase tracking-wide">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Device Health + Active Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Device Health */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" /> Device Health
            </h3>
            <Link href="/dashboard/devices" className="text-xs text-blue-500 hover:underline">View all</Link>
          </div>
          {devices.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No devices found</p>
          ) : (
            <div className="space-y-3">
              {devices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[device.status]}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{device.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{device.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {device.status !== "offline" ? (
                      <>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{device.coOutput} ppm</p>
                        <p className={`text-[11px] ${STATUS_TEXT[device.status]}`}>
                          <TrendingDown className="w-3 h-3 inline mr-0.5" />
                          {device.reduction}% purified
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-slate-400">Offline</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Alerts */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              Active Alerts
              {critical > 0 && (
                <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                  {critical} critical
                </span>
              )}
            </h3>
            <Link href="/dashboard/alerts" className="text-xs text-blue-500 hover:underline">View all</Link>
          </div>

          {activeAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <CheckCircle className="w-8 h-8 mb-2 text-green-400" />
              <p className="text-sm">All systems normal</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${ALERT_COLORS[alert.level]}`}
                >
                  <AlertTriangle
                    className={`w-4 h-4 shrink-0 ${alert.level === "CRITICAL" ? "text-red-500" : "text-yellow-500"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">
                      {alert.message}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/dashboard/alerts"
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
          >
            <Eye className="w-4 h-4" />
            View All Alerts
          </Link>
        </div>
      </div>
    </div>
  );
}
