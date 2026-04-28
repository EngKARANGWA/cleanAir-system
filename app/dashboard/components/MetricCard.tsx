import { ReactNode } from "react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  icon: ReactNode;
  accent: "blue" | "green" | "red" | "purple" | "yellow";
}

const accentMap = {
  blue:   { text: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-500/10" },
  green:  { text: "text-green-500",  bg: "bg-green-50 dark:bg-green-500/10" },
  red:    { text: "text-red-500",    bg: "bg-red-50 dark:bg-red-500/10" },
  purple: { text: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
  yellow: { text: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-500/10" },
};

export default function MetricCard({ title, value, unit, trend, trendLabel, icon, accent }: MetricCardProps) {
  const { text, bg } = accentMap[accent];
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "down" ? "text-green-500" : trend === "up" ? "text-red-500" : "text-slate-400";

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <div className={`p-2 rounded-lg ${bg}`}>
          <span className={text}>{icon}</span>
        </div>
      </div>
      <div className="flex items-end gap-2">
        <p className={`text-3xl font-extrabold ${text}`}>{value}</p>
        {unit && <span className="text-slate-400 text-sm mb-1">{unit}</span>}
      </div>
      {trendLabel && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendColor}`}>
          <TrendIcon className="w-3.5 h-3.5" />
          {trendLabel}
        </div>
      )}
    </div>
  );
}
