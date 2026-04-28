import { Plus, Cpu } from "lucide-react";
import Link from "next/link";
import { devices } from "./data";
import DeviceCard from "./components/DeviceCard";
import DarkModeToggle from "../../components/DarkModeToggle";

const summary = {
  total:   devices.length,
  online:  devices.filter((d) => d.status === "online").length,
  offline: devices.filter((d) => d.status === "offline").length,
  warning: devices.filter((d) => d.status === "warning").length,
};

export default function DevicesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Devices</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {summary.total} registered · {summary.online} online · {summary.warning} warning · {summary.offline} offline
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <Link
            href="/dashboard/devices/add"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Device
          </Link>
        </div>
      </div>

      {/* Summary strips */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Devices", value: summary.total,   color: "text-slate-900 dark:text-white" },
          { label: "Online",        value: summary.online,  color: "text-green-500" },
          { label: "Warning",       value: summary.warning, color: "text-yellow-500" },
          { label: "Offline",       value: summary.offline, color: "text-slate-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm text-center">
            <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Device grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
        {devices.map((device) => (
          <DeviceCard key={device.id} device={device} />
        ))}
      </div>
    </div>
  );
}
