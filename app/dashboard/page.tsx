"use client";

import { useState } from "react";
import { Wind, Gauge, Leaf, Activity } from "lucide-react";
import MetricCard from "./components/MetricCard";
import COChart from "./components/COChart";
import AlertsList from "./components/AlertsList";
import ReadingsTable from "./components/ReadingsTable";
import DarkModeToggle from "../components/DarkModeToggle";
import NotificationBell from "./components/NotificationBell";
import OperatorPanel from "./components/OperatorPanel";
import { auth } from "../../lib/auth";

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
  const [user] = useState(() => auth.get());

  const role        = (user?.role ?? "VIEWER").toUpperCase();
  const displayName = user?.name ?? user?.email ?? "User";

  // Operator gets dedicated operational view
  if (role === "OPERATOR") {
    return (
      <div className="space-y-8">
        <div className="flex items-end justify-between">
          <div />
          <div className="flex items-center gap-3">
            <NotificationBell />
            <DarkModeToggle />
          </div>
        </div>
        <OperatorPanel operatorName={displayName} />
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Live Sensor Readings</h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard title="CO Input Level"     value="440" unit="ppm" trend="up"      trendLabel="+5% from last hour"  icon={<Gauge className="w-5 h-5" />} accent="red"    />
            <MetricCard title="After Purification" value="218" unit="ppm" trend="down"    trendLabel="50.5% reduction"     icon={<Leaf className="w-5 h-5" />}  accent="green"  />
            <MetricCard title="Purification Rate"  value="50.5" unit="%" trend="neutral"  trendLabel="Within target range" icon={<Wind className="w-5 h-5" />}  accent="blue"   />
            <MetricCard title="Sensor Uptime"      value="99.2" unit="%" trend="neutral"  trendLabel="Last 30 days"        icon={<Activity className="w-5 h-5" />} accent="purple" />
          </div>
        </div>
        <COChart />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
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
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-4 py-2 rounded-xl">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">ESP32 Online</span>
          </div>
          <NotificationBell />
          <DarkModeToggle />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard title="CO Input Level"     value="440"  unit="ppm" trend="up"      trendLabel="+5% from last hour"  icon={<Gauge className="w-5 h-5" />}    accent="red"    />
        <MetricCard title="After Purification" value="218"  unit="ppm" trend="down"    trendLabel="50.5% reduction"     icon={<Leaf className="w-5 h-5" />}     accent="green"  />
        <MetricCard title="Purification Rate"  value="50.5" unit="%"   trend="neutral" trendLabel="Within target range" icon={<Wind className="w-5 h-5" />}     accent="blue"   />
        <MetricCard title="Sensor Uptime"      value="99.2" unit="%"   trend="neutral" trendLabel="Last 30 days"        icon={<Activity className="w-5 h-5" />} accent="purple" />
      </div>

      <COChart />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1"><AlertsList /></div>
        <div className="xl:col-span-2"><ReadingsTable /></div>
      </div>
    </div>
  );
}
