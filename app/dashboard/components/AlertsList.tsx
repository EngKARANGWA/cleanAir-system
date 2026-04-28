import { AlertTriangle, Info, CheckCircle } from "lucide-react";

const alerts = [
  { id: 1, level: "critical", message: "CO input exceeded 500 ppm", time: "2 min ago", location: "Unit A" },
  { id: 2, level: "warning",  message: "CO input above 400 ppm threshold", time: "18 min ago", location: "Unit A" },
  { id: 3, level: "info",     message: "Purification efficiency dropped to 45%", time: "1 hr ago", location: "Unit B" },
  { id: 4, level: "resolved", message: "CO levels returned to normal range", time: "2 hr ago", location: "Unit A" },
];

const levelMap = {
  critical: { icon: AlertTriangle, color: "text-red-500",    bg: "bg-red-50 dark:bg-red-500/10",    label: "Critical" },
  warning:  { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-500/10", label: "Warning" },
  info:     { icon: Info,          color: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-500/10",   label: "Info" },
  resolved: { icon: CheckCircle,   color: "text-green-500",  bg: "bg-green-50 dark:bg-green-500/10", label: "Resolved" },
};

export default function AlertsList() {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-slate-900 dark:text-white">Recent Alerts</h3>
        <span className="text-xs text-blue-500 hover:underline cursor-pointer">View all</span>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => {
          const { icon: Icon, color, bg, label } = levelMap[alert.level as keyof typeof levelMap];
          return (
            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40">
              <div className={`p-1.5 rounded-lg ${bg} shrink-0`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{alert.message}</p>
                <p className="text-xs text-slate-400 mt-0.5">{alert.location} · {alert.time}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${bg} ${color}`}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
