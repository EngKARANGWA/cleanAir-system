"use client";

import { useEffect, useState } from "react";
import MetricCard from "./components/MetricCard";
import COChart from "./components/COChart";
import AlertsList from "./components/AlertsList";
import ReadingsTable from "./components/ReadingsTable";
import DarkModeToggle from "../components/DarkModeToggle";
import DeviceCard from "./devices/components/DeviceCard";
import OperatorPanel from "./components/OperatorPanel";
import NotificationBell from "./components/NotificationBell";
import { api } from "../../lib/api";
import { mapApiDevice, type Device } from "./devices/data";

const ROLE_STYLE: Record<string, string> = {
  ADMIN:    "bg-purple-500/10 text-purple-500 border-purple-500/20",
  OPERATOR: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  VIEWER:   "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

const ROLE_DESC: Record<string, string> = {
  ADMIN:    "Full access · All devices · User management",
  OPERATOR: "All devices · Alerts · History",
  VIEWER:   "Read-only · Assigned devices only",
};

export default function DashboardPage() {
  const [user, setUser]       = useState<{ name?: string; email?: string; role?: string } | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}

    function fetchDevices() {
      api.devices
        .list()
        .then((data) => setDevices(data.map(mapApiDevice)))
        .catch(() => {});
    }

    fetchDevices();
    // Re-poll every 10 s — ESP32 posts new readings every few seconds
    const id = setInterval(fetchDevices, 10_000);
    return () => clearInterval(id);
  }, []);

  const role        = (user?.role ?? "VIEWER").toUpperCase();
  const displayName = user?.name ?? user?.email ?? "User";

  const activeDevices = devices.filter((d) => d.status !== "offline");
  const onlineCount   = devices.filter((d) => d.status === "online").length;

  const avgInput = activeDevices.length
    ? Math.round(activeDevices.reduce((s, d) => s + d.coInput,  0) / activeDevices.length * 100) / 100
    : 0;
  const avgOutput = activeDevices.length
    ? Math.round(activeDevices.reduce((s, d) => s + d.coOutput, 0) / activeDevices.length * 100) / 100
    : 0;
  const avgReduction = activeDevices.length
    ? (activeDevices.reduce((s, d) => s + d.reduction, 0) / activeDevices.length).toFixed(2)
    : "0.00";
  const uptimePct = devices.length
    ? Math.round((onlineCount / devices.length) * 100)
    : 0;

  if (role === "OPERATOR") {
    return (
      <div className="space-y-8">
        <div className="flex items-end justify-end gap-3 pt-10 md:pt-0">
          <NotificationBell />
          <DarkModeToggle />
        </div>
        <OperatorPanel operatorName={displayName} devices={devices} />
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Live Sensor Readings</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="CO Input Level"     value={avgInput  > 0 ? String(avgInput)  : "—"} unit="ppm" accent="red"    />
            <MetricCard title="After Purification" value={avgOutput > 0 ? String(avgOutput) : "—"} unit="ppm" accent="green"  />
            <MetricCard title="Purification Rate"  value={avgReduction}                             unit="%"   accent="blue"   />
            <MetricCard title="Devices Online"     value={String(uptimePct)}                        unit="%"   accent="purple" />
          </div>
        </div>
        <COChart />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 pt-10 md:pt-0">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome, {displayName}
            </h1>
            <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${ROLE_STYLE[role] ?? ROLE_STYLE.VIEWER}`}>
              {role}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {ROLE_DESC[role] ?? ROLE_DESC.VIEWER} · Last updated just now
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
            onlineCount > 0
              ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20"
              : "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-700"
          }`}>
            <span className={`w-2 h-2 rounded-full ${onlineCount > 0 ? "bg-green-500 animate-pulse" : "bg-slate-400"}`} />
            <span className={`text-sm font-medium ${onlineCount > 0 ? "text-green-600 dark:text-green-400" : "text-slate-500"}`}>
              {onlineCount > 0 ? `${onlineCount} Online` : "No Devices"}
            </span>
          </div>
          <NotificationBell />
          <DarkModeToggle />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="CO Input Level"     value={avgInput  > 0 ? String(avgInput)  : "—"} unit="ppm" accent="red"    />
        <MetricCard title="After Purification" value={avgOutput > 0 ? String(avgOutput) : "—"} unit="ppm" accent="green"  />
        <MetricCard title="Purification Rate"  value={avgReduction}                             unit="%"   accent="blue"   />
        <MetricCard title="Devices Online"     value={String(uptimePct)}                        unit="%"   accent="purple" />
      </div>

      {/* Chart */}
      <COChart />

      {/* Alerts + Readings */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <AlertsList devices={devices} />
        </div>
        <div className="xl:col-span-2">
          <ReadingsTable devices={devices} />
        </div>
      </div>

      {/* Registered Devices */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Registered Devices</h2>
          <a href="/dashboard/devices" className="text-sm text-blue-500 hover:underline">View all</a>
        </div>
        {devices.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">Loading devices…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
