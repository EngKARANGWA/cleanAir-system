import Link from "next/link";
import { Wifi, WifiOff, AlertTriangle, MapPin, Clock, Cpu, ChevronRight } from "lucide-react";
import { Device, DeviceStatus } from "../data";

const statusConfig: Record<DeviceStatus, { label: string; icon: typeof Wifi; color: string; bg: string; dot: string }> = {
  online:  { label: "Online",  icon: Wifi,          color: "text-green-600 dark:text-green-400",  bg: "bg-green-50 dark:bg-green-500/10",  dot: "bg-green-500" },
  offline: { label: "Offline", icon: WifiOff,        color: "text-slate-500 dark:text-slate-400",  bg: "bg-slate-100 dark:bg-slate-700/50", dot: "bg-slate-400" },
  warning: { label: "Warning", icon: AlertTriangle,  color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-500/10", dot: "bg-yellow-500" },
};

export default function DeviceCard({ device }: { device: Device }) {
  const { label, icon: Icon, color, bg, dot } = statusConfig[device.status];

  return (
    <Link
      href={`/dashboard/devices/${device.id}`}
      className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-md transition-all block"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 dark:bg-blue-500/10 p-2.5 rounded-xl">
            <Cpu className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">{device.name}</p>
            <p className="text-xs text-slate-400">{device.id}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${bg} ${color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dot} ${device.status === "online" ? "animate-pulse" : ""}`} />
          {label}
        </span>
      </div>

      {/* CO stats */}
      {device.status !== "offline" ? (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-400 mb-1">CO In</p>
            <p className="font-bold text-red-500 text-sm">{device.coInput} <span className="text-[10px] font-normal text-slate-400">ppm</span></p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-400 mb-1">CO Out</p>
            <p className="font-bold text-green-500 text-sm">{device.coOutput} <span className="text-[10px] font-normal text-slate-400">ppm</span></p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-400 mb-1">Reduction</p>
            <p className="font-bold text-blue-500 text-sm">{device.reduction}%</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 text-center mb-4">
          <p className="text-sm text-slate-400">Device offline — no readings available</p>
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {device.location.split("·")[1]?.trim()}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {device.lastSeen}</span>
        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
      </div>
    </Link>
  );
}
