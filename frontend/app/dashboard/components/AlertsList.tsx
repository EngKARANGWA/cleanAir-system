import { AlertTriangle, Info, CheckCircle } from "lucide-react";
import type { Device } from "../devices/data";

const levelMap = {
  critical: { icon: AlertTriangle, color: "text-red-500",    bg: "bg-red-50 dark:bg-red-500/10",       label: "Critical" },
  warning:  { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-500/10", label: "Warning"  },
  info:     { icon: Info,          color: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-500/10",     label: "Info"     },
  normal:   { icon: CheckCircle,   color: "text-green-500",  bg: "bg-green-50 dark:bg-green-500/10",   label: "Normal"   },
} as const;

type Level = keyof typeof levelMap;

interface DerivedAlert {
  id: string;
  level: Level;
  message: string;
  location: string;
  time: string;
}

function deriveAlerts(devices: Device[]): DerivedAlert[] {
  const alerts: DerivedAlert[] = [
    ...devices
      .filter((d) => d.coInput >= 500)
      .map((d) => ({
        id:       `crit-${d.id}`,
        level:    "critical" as Level,
        message:  `CO input ${d.coInput} ppm — critical threshold exceeded`,
        location: d.name,
        time:     d.lastSeen,
      })),
    ...devices
      .filter((d) => d.coInput >= 400 && d.coInput < 500)
      .map((d) => ({
        id:       `warn-${d.id}`,
        level:    "warning" as Level,
        message:  `CO input ${d.coInput} ppm — above 400 ppm threshold`,
        location: d.name,
        time:     d.lastSeen,
      })),
    ...devices
      .filter((d) => d.status === "offline")
      .map((d) => ({
        id:       `off-${d.id}`,
        level:    "info" as Level,
        message:  `${d.name} is offline`,
        location: d.id,
        time:     d.lastSeen,
      })),
  ];

  if (alerts.length === 0 && devices.length > 0) {
    alerts.push({
      id:       "ok",
      level:    "normal",
      message:  "All devices within normal CO range",
      location: "System",
      time:     "Just now",
    });
  }

  return alerts.slice(0, 4);
}

export default function AlertsList({ devices }: { devices: Device[] }) {
  const alerts = deriveAlerts(devices);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-slate-900 dark:text-white">Recent Alerts</h3>
        <a href="/dashboard/alerts" className="text-xs text-blue-500 hover:underline">View all</a>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">Loading device data…</div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const { icon: Icon, color, bg, label } = levelMap[alert.level];
            return (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <div className={`p-1.5 rounded-lg ${bg} shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{alert.message}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{alert.location} · {alert.time}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${bg} ${color}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
