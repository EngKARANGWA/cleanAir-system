import { TrendingDown, Activity, AlertTriangle, BarChart2 } from "lucide-react";
import HistoryChart from "./components/HistoryChart";
import HistoryTable from "./components/HistoryTable";
import DarkModeToggle from "../../components/DarkModeToggle";
import { readings } from "./data";

const avgInput     = Math.round(readings.reduce((s, r) => s + r.coInput,  0) / readings.length);
const avgOutput    = Math.round(readings.reduce((s, r) => s + r.coOutput, 0) / readings.length);
const avgReduction = (readings.reduce((s, r) => s + r.reduction, 0) / readings.length).toFixed(1);
const criticalCount = readings.filter((r) => r.status === "critical").length;

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">History</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Historical CO readings across all active devices
          </p>
        </div>
        <DarkModeToggle />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10"><BarChart2 className="w-4 h-4 text-red-500" /></div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg CO Input</p>
          </div>
          <p className="text-3xl font-extrabold text-red-500">{avgInput}</p>
          <p className="text-xs text-slate-400 mt-1">ppm · last 20 readings</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-500/10"><TrendingDown className="w-4 h-4 text-green-500" /></div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg After Purif.</p>
          </div>
          <p className="text-3xl font-extrabold text-green-500">{avgOutput}</p>
          <p className="text-xs text-slate-400 mt-1">ppm · last 20 readings</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10"><Activity className="w-4 h-4 text-blue-500" /></div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg Reduction</p>
          </div>
          <p className="text-3xl font-extrabold text-blue-500">{avgReduction}%</p>
          <p className="text-xs text-slate-400 mt-1">purification efficiency</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10"><AlertTriangle className="w-4 h-4 text-red-500" /></div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Critical Events</p>
          </div>
          <p className="text-3xl font-extrabold text-red-500">{criticalCount}</p>
          <p className="text-xs text-slate-400 mt-1">threshold breaches</p>
        </div>
      </div>

      {/* Chart */}
      <HistoryChart />

      {/* Table */}
      <HistoryTable />
    </div>
  );
}
