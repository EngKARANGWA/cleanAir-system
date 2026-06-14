"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BellRing,
  CheckCircle,
  Clock,
  Cpu,
  Radio,
  RefreshCw,
  TrendingDown,
  Zap,
} from "lucide-react";
import Link from "next/link";
import DarkModeToggle from "../../../components/DarkModeToggle";
import MetricCard from "../../components/MetricCard";
import COChart from "../../components/COChart";
import { api } from "../../../../lib/api";
import { mapApiDevice, type Device } from "../../devices/data";

// ── helpers ──────────────────────────────────────────────────────────────────

const STATUS_DOT: Record<string, string> = {
  online:  "bg-green-500",
  warning: "bg-yellow-500 animate-pulse",
  offline: "bg-slate-400",
};

const ALERT_ROW: Record<string, string> = {
  critical: "border-red-500/30 bg-red-500/5",
  warning:  "border-yellow-500/30 bg-yellow-500/5",
};

const ALERT_BADGE: Record<string, string> = {
  critical: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
  warning:  "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
};

interface ActiveAlert {
  id: string;
  severity: string;
  title: string;
  message: string;
  device: string;
}

function deriveActiveAlerts(devices: Device[]): ActiveAlert[] {
  return devices
    .filter((d) => d.status === "warning")
    .map((d) => ({
      id:       d.id,
      severity: d.coInput >= 500 ? "critical" : "warning",
      title:    d.coInput >= 500
        ? `CO Critical — ${d.name}`
        : `CO Above Threshold — ${d.name}`,
      message:  d.coInput >= 500
        ? `CO input ${d.coInput} ppm on ${d.plateOrRef}. Exceeds 500 ppm safety threshold.`
        : `CO input ${d.coInput} ppm on ${d.plateOrRef}. Above 400 ppm warning threshold.`,
      device: d.id,
    }));
}

// ── page ─────────────────────────────────────────────────────────────────────

export default function OperationalDashboardPage() {
  const [devices, setDevices]           = useState<Device[]>([]);
  const [loading, setLoading]           = useState(true);
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set());

  function load(showSpinner = false) {
    if (showSpinner) setLoading(true);
    api.devices
      .list()
      .then((data) => setDevices(data.map(mapApiDevice)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load(true);
    const id = setInterval(() => load(false), 10_000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const online  = devices.filter((d) => d.status === "online").length;
  const warning = devices.filter((d) => d.status === "warning").length;
  const offline = devices.filter((d) => d.status === "offline").length;

  const activeDevices = devices.filter((d) => d.coInput > 0);
  const avgInput      = activeDevices.length
    ? Math.round(activeDevices.reduce((s, d) => s + d.coInput,  0) / activeDevices.length * 100) / 100 : 0;
  const avgOutput     = activeDevices.length
    ? Math.round(activeDevices.reduce((s, d) => s + d.coOutput, 0) / activeDevices.length * 100) / 100 : 0;
  const avgReduction  = activeDevices.length
    ? (activeDevices.reduce((s, d) => s + d.reduction, 0) / activeDevices.length).toFixed(2)
    : "0.00";

  const allAlerts    = deriveActiveAlerts(devices);
  const activeAlerts = allAlerts.filter((a) => !acknowledgedIds.has(a.id));
  const criticalCount = activeAlerts.filter((a) => a.severity === "critical").length;

  const handleAcknowledge    = (id: string) =>
    setAcknowledgedIds((prev) => new Set([...prev, id]));
  const handleAcknowledgeAll = () =>
    setAcknowledgedIds(new Set(activeAlerts.map((a) => a.id)));

  return (
    <div className="space-y-8">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-10 md:pt-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Radio className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Operational Dashboard</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Live monitoring · {loading ? "…" : devices.length} registered devices · Last refreshed just now
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => load(true)}
            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <DarkModeToggle />
        </div>
      </div>

      {/* ── Shift banner ── */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-500 p-5 text-white shadow-lg shadow-blue-500/25">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-blue-200" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">Shift Status</p>
              <p className="text-lg font-bold">
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · Live
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-xl text-sm">
            <Clock className="w-4 h-4" />
            Active &amp; On Duty
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {[
            { label: "Online",   value: online,        color: "bg-green-400/25 text-green-100",   icon: <CheckCircle className="w-4 h-4" />    },
            { label: "Warning",  value: warning,       color: "bg-yellow-400/25 text-yellow-100", icon: <AlertTriangle className="w-4 h-4" />  },
            { label: "Offline",  value: offline,       color: "bg-white/10 text-blue-100",        icon: <Cpu className="w-4 h-4" />            },
            { label: "Critical", value: criticalCount, color: "bg-red-400/25 text-red-100",       icon: <BellRing className="w-4 h-4" />       },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 ${color}`}>
              {icon}
              <div>
                <p className="text-xl font-bold leading-none">{loading ? "—" : value}</p>
                <p className="text-[11px] uppercase tracking-wide opacity-80 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Key metrics ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard title="Avg CO Input"           value={avgInput  > 0 ? String(avgInput)  : "—"} unit="ppm" accent="red"    />
        <MetricCard title="Avg After Purification" value={avgOutput > 0 ? String(avgOutput) : "—"} unit="ppm" accent="green"  />
        <MetricCard title="Avg Purification Rate"  value={avgReduction}                             unit="%"   accent="blue"   />
        <MetricCard title="Active Alerts"          value={String(activeAlerts.length)}              unit=""    accent="yellow" />
      </div>

      {/* ── Device health table ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-500" />
            Device Health Monitor
          </h2>
          <Link href="/dashboard/devices" className="text-xs text-blue-500 hover:underline">
            Manage devices →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                <th className="text-left px-6 py-3">Device / Owner</th>
                <th className="text-left px-6 py-3">Location</th>
                <th className="text-center px-6 py-3">Status</th>
                <th className="text-right px-6 py-3">CO Input</th>
                <th className="text-right px-6 py-3">CO Output</th>
                <th className="text-right px-6 py-3">Reduction</th>
                <th className="text-right px-6 py-3">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">Loading devices…</td>
                </tr>
              ) : devices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">No devices registered.</td>
                </tr>
              ) : (
                devices.map((device) => (
                  <tr key={device.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-3">
                      <p className="font-medium text-slate-900 dark:text-white">{device.name}</p>
                      <p className="text-[11px] text-slate-400">{device.id} · {device.owner}</p>
                    </td>
                    <td className="px-6 py-3 text-slate-500 dark:text-slate-400">{device.location}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        device.status === "online"
                          ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                          : device.status === "warning"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[device.status]}`} />
                        {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right font-semibold text-red-500">
                      {device.coInput  > 0 ? `${device.coInput} ppm`  : "—"}
                    </td>
                    <td className="px-6 py-3 text-right font-semibold text-green-600 dark:text-green-400">
                      {device.coOutput > 0 ? `${device.coOutput} ppm` : "—"}
                    </td>
                    <td className="px-6 py-3 text-right">
                      {device.reduction > 0 ? (
                        <span className={`font-semibold ${device.reduction >= 50 ? "text-green-500" : "text-yellow-500"}`}>
                          <TrendingDown className="w-3 h-3 inline mr-0.5" />
                          {device.reduction}%
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-6 py-3 text-right text-slate-400 text-xs">{device.lastSeen}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Active alerts ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            Active Alerts
            {activeAlerts.length > 0 && (
              <span className="text-[11px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                {activeAlerts.length}
              </span>
            )}
          </h2>
          {activeAlerts.length > 0 && (
            <button
              type="button"
              onClick={handleAcknowledgeAll}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-500 hover:text-blue-600 border border-blue-500/30 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Acknowledge All
            </button>
          )}
        </div>

        {activeAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <CheckCircle className="w-10 h-10 mb-3 text-green-400" />
            <p className="font-medium text-slate-600 dark:text-slate-300">All clear — no active alerts</p>
            <p className="text-sm mt-1">All systems are operating normally.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-4 px-6 py-4 border-l-4 ${ALERT_ROW[alert.severity]} ${
                  alert.severity === "critical" ? "border-l-red-500" : "border-l-yellow-500"
                }`}
              >
                <AlertTriangle
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    alert.severity === "critical" ? "text-red-500" : "text-yellow-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${ALERT_BADGE[alert.severity]}`}>
                      {alert.severity}
                    </span>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{alert.title}</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{alert.message}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{alert.device}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAcknowledge(alert.id)}
                  className="shrink-0 text-xs font-medium text-slate-500 hover:text-blue-500 border border-slate-200 dark:border-slate-600 hover:border-blue-400 px-3 py-1.5 rounded-lg transition-all"
                >
                  Acknowledge
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── CO Trend Chart ── */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          CO Trend — Session History
        </h2>
        <COChart />
      </div>

    </div>
  );
}
