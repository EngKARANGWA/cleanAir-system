import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Cpu, MapPin, Clock, Wifi, WifiOff,
  AlertTriangle, Pencil, Trash2, RefreshCw,
  Thermometer, Activity, Shield, Calendar,
} from "lucide-react";
import { devices, DeviceStatus } from "../data";
import DarkModeToggle from "../../../components/DarkModeToggle";

const statusConfig: Record<DeviceStatus, { label: string; icon: typeof Wifi; color: string; bg: string; dot: string }> = {
  online:  { label: "Online",  icon: Wifi,         color: "text-green-600 dark:text-green-400",   bg: "bg-green-50 dark:bg-green-500/10",   dot: "bg-green-500" },
  offline: { label: "Offline", icon: WifiOff,       color: "text-slate-500 dark:text-slate-400",   bg: "bg-slate-100 dark:bg-slate-700/50",  dot: "bg-slate-400" },
  warning: { label: "Warning", icon: AlertTriangle, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-500/10", dot: "bg-yellow-500" },
};

export default async function DeviceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const device = devices.find((d) => d.id === id);
  if (!device) notFound();

  const { label, icon: StatusIcon, color, bg, dot } = statusConfig[device.status];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/devices"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{device.name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {device.location}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <button type="button" className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            <RefreshCw className="w-4 h-4" /> Reboot
          </button>
          <Link href={`/dashboard/devices/${device.id}/edit`} className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            <Pencil className="w-4 h-4" /> Edit
          </Link>
          <button type="button" className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all">
            <Trash2 className="w-4 h-4" /> Remove
          </button>
        </div>
      </div>

      {/* Status banner */}
      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border ${bg} ${color} border-current/20`}>
        <span className={`w-2.5 h-2.5 rounded-full ${dot} ${device.status === "online" ? "animate-pulse" : ""}`} />
        <StatusIcon className="w-4 h-4" />
        <span className="font-semibold text-sm">{label}</span>
        <span className="text-sm opacity-70">· Last seen {device.lastSeen}</span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">CO Input</p>
          <p className="text-4xl font-extrabold text-red-500">{device.coInput}</p>
          <p className="text-xs text-slate-400 mt-1">ppm</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">After Purification</p>
          <p className="text-4xl font-extrabold text-green-500">{device.coOutput}</p>
          <p className="text-xs text-slate-400 mt-1">ppm</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Reduction Rate</p>
          <p className="text-4xl font-extrabold text-blue-500">{device.reduction}</p>
          <p className="text-xs text-slate-400 mt-1">%</p>
        </div>
      </div>

      {/* Device Info + Specs */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Device info */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-500" /> Device Information
          </h3>
          <div className="space-y-3">
            {[
              { label: "Device ID",    value: device.id },
              { label: "IP Address",   value: device.ip },
              { label: "MAC Address",  value: device.mac },
              { label: "Firmware",     value: device.firmware },
              { label: "Installed",    value: device.installedAt },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white font-mono">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" /> Performance
          </h3>
          <div className="space-y-4">
            {[
              { label: "Uptime",            value: device.uptime,           icon: Clock,       color: "text-blue-500" },
              { label: "Purification Rate", value: `${device.reduction}%`,  icon: Shield,      color: "text-green-500" },
              { label: "Sensor Range",      value: "0 – 1000 ppm",          icon: Thermometer, color: "text-purple-500" },
              { label: "Installed Date",    value: device.installedAt,      icon: Calendar,    color: "text-slate-400" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div className="bg-slate-50 dark:bg-slate-700/40 p-2 rounded-lg">
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
