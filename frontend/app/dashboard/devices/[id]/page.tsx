import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Cpu, MapPin, Clock, Wifi, WifiOff, Car, Bike, Factory,
  AlertTriangle, Pencil, Trash2, RefreshCw, User,
  Thermometer, Activity, Shield, Calendar,
} from "lucide-react";
import DarkModeToggle from "../../../components/DarkModeToggle";
import { mapApiDevice, type DeviceStatus, type VehicleType } from "../data";
import type { ApiDevice } from "../../../../lib/api";

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "https://backend-cleanair.onrender.com").replace(/\/$/, "");

const statusConfig: Record<DeviceStatus, { label: string; icon: typeof Wifi; color: string; bg: string; dot: string }> = {
  online:  { label: "Online",  icon: Wifi,         color: "text-green-600 dark:text-green-400",   bg: "bg-green-50 dark:bg-green-500/10",   dot: "bg-green-500" },
  offline: { label: "Offline", icon: WifiOff,       color: "text-slate-500 dark:text-slate-400",   bg: "bg-slate-100 dark:bg-slate-700/50",  dot: "bg-slate-400" },
  warning: { label: "Warning", icon: AlertTriangle, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-500/10", dot: "bg-yellow-500" },
};

const typeConfig: Record<VehicleType, { label: string; icon: typeof Car; color: string; bg: string }> = {
  car:        { label: "Car",        icon: Car,     color: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-500/10"     },
  motorcycle: { label: "Motorcycle", icon: Bike,    color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
  industry:   { label: "Industry",   icon: Factory, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
};

export default async function DeviceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let apiDevice: ApiDevice | null = null;
  try {
    const res = await fetch(`${BASE}/api/devices/${id}`, { cache: "no-store" });
    if (res.ok) apiDevice = await res.json() as ApiDevice;
  } catch {
    // fall through to notFound
  }

  if (!apiDevice) notFound();

  const device = mapApiDevice(apiDevice);
  const { label, icon: StatusIcon, color, bg, dot } = statusConfig[device.status];
  const { label: typeLabel, icon: TypeIcon, color: typeColor, bg: typeBg } = typeConfig[device.type];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/devices" className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{device.name}</h1>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeBg} ${typeColor}`}>{typeLabel}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-3">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{device.location}</span>
              <span className="font-mono">{device.plateOrRef}</span>
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

      {/* Status + type banner */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border ${bg} ${color} border-current/20`}>
          <span className={`w-2.5 h-2.5 rounded-full ${dot} ${device.status === "online" ? "animate-pulse" : ""}`} />
          <StatusIcon className="w-4 h-4" />
          <span className="font-semibold text-sm">{label}</span>
          <span className="text-sm opacity-70">· Last seen {device.lastSeen}</span>
        </div>
        <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border ${typeBg} ${typeColor} border-current/20`}>
          <TypeIcon className="w-4 h-4" />
          <span className="font-semibold text-sm">{typeLabel}</span>
          <span className="text-sm opacity-70 flex items-center gap-1"><User className="w-3.5 h-3.5" />{device.owner}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">CO Input (Exhaust)</p>
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

      {/* Info + Performance */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-500" /> Device &amp; Vehicle Info
          </h3>
          <div className="space-y-0">
            {[
              { label: "Device ID",   value: device.id },
              { label: "Plate / Ref", value: device.plateOrRef },
              { label: "Owner",       value: device.owner },
              { label: "Location",    value: device.location },
              { label: "IP Address",  value: device.ip },
              { label: "MAC Address", value: device.mac },
              { label: "Firmware",    value: device.firmware },
              { label: "Installed",   value: device.installedAt },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white font-mono">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" /> Performance
          </h3>
          <div className="space-y-0">
            {[
              { label: "Uptime",            value: device.uptime,          icon: Clock,       color: "text-blue-500"   },
              { label: "Purification Rate", value: `${device.reduction}%`, icon: Shield,      color: "text-green-500"  },
              { label: "Sensor Range",      value: "0 – 1000 ppm",         icon: Thermometer, color: "text-purple-500" },
              { label: "Installed Date",    value: device.installedAt,     icon: Calendar,    color: "text-slate-400"  },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center gap-3 py-2.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
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
