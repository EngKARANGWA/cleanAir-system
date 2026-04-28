import { Wind, Gauge, Leaf, Activity } from "lucide-react";
import MetricCard from "./components/MetricCard";
import COChart from "./components/COChart";
import AlertsList from "./components/AlertsList";
import ReadingsTable from "./components/ReadingsTable";
import DarkModeToggle from "../components/DarkModeToggle";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time CO monitoring · Last updated just now
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-4 py-2 rounded-xl">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">ESP32 Online</span>
          </div>
          <DarkModeToggle />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="CO Input Level"
          value="440"
          unit="ppm"
          trend="up"
          trendLabel="+5% from last hour"
          icon={<Gauge className="w-5 h-5" />}
          accent="red"
        />
        <MetricCard
          title="After Purification"
          value="218"
          unit="ppm"
          trend="down"
          trendLabel="50.5% reduction"
          icon={<Leaf className="w-5 h-5" />}
          accent="green"
        />
        <MetricCard
          title="Purification Rate"
          value="50.5"
          unit="%"
          trend="neutral"
          trendLabel="Within target range"
          icon={<Wind className="w-5 h-5" />}
          accent="blue"
        />
        <MetricCard
          title="Sensor Uptime"
          value="99.2"
          unit="%"
          trend="neutral"
          trendLabel="Last 30 days"
          icon={<Activity className="w-5 h-5" />}
          accent="purple"
        />
      </div>

      {/* Chart */}
      <COChart />

      {/* Alerts + Readings */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <AlertsList />
        </div>
        <div className="xl:col-span-2">
          <ReadingsTable />
        </div>
      </div>
    </div>
  );
}
