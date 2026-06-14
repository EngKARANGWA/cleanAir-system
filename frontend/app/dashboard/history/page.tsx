"use client";

import { useEffect, useRef, useState } from "react";
import HistoryChart from "./components/HistoryChart";
import HistoryTable from "./components/HistoryTable";
import DarkModeToggle from "../../components/DarkModeToggle";
import { api, type ApiDevice } from "../../../lib/api";
import { mapDeviceToReading, buildChartData, type Reading } from "./data";

export default function HistoryPage() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [devices,  setDevices]  = useState<ApiDevice[]>([]);
  const [loading,  setLoading]  = useState(true);

  // Track last known coInput/coOutput per device so we only record a new row when values change
  const lastValues = useRef<Map<string, { coInput: number; coOutput: number }>>(new Map());

  useEffect(() => {
    async function fetchSnapshot() {
      try {
        const devList = await api.devices.list();
        setDevices(devList);

        const now = new Date();
        const newRows: Reading[] = [];

        for (const dev of devList) {
          const input  = dev.coInput  ?? 0;
          const output = dev.coOutput ?? 0;
          if (input === 0 && output === 0) continue; // device has no readings yet

          const last = lastValues.current.get(dev.id);
          if (!last || last.coInput !== input || last.coOutput !== output) {
            lastValues.current.set(dev.id, { coInput: input, coOutput: output });
            newRows.push(mapDeviceToReading(dev, now));
          }
        }

        if (newRows.length > 0) {
          setReadings((prev) => [...newRows, ...prev].slice(0, 500));
        }
      } catch {
        // silently ignore transient polling errors
      } finally {
        setLoading(false);
      }
    }

    fetchSnapshot();
    const id = setInterval(fetchSnapshot, 10_000);
    return () => clearInterval(id);
  }, []);

  const chartData = buildChartData(readings);

  const activeReadings = readings.filter((r) => r.coInput > 0);
  const avgInput = activeReadings.length
    ? Math.round(activeReadings.reduce((s, r) => s + r.coInput,    0) / activeReadings.length * 100) / 100 : 0;
  const avgOutput = activeReadings.length
    ? Math.round(activeReadings.reduce((s, r) => s + r.coOutput,   0) / activeReadings.length * 100) / 100 : 0;
  const avgReduction = activeReadings.length
    ? (activeReadings.reduce((s, r) => s + r.reduction, 0) / activeReadings.length).toFixed(2) : "0.00";
  const criticalCount = readings.filter((r) => r.status === "critical").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-10 md:pt-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">History</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {loading
              ? "Loading…"
              : readings.length === 0
              ? "Waiting for simulation data — new rows appear as readings change"
              : `${readings.length} reading${readings.length !== 1 ? "s" : ""} across ${devices.length} device${devices.length !== 1 ? "s" : ""} · live`}
          </p>
        </div>
        <DarkModeToggle />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Avg CO Input",     value: loading ? "—" : readings.length ? `${avgInput} ppm`    : "—", color: "text-red-500"   },
          { label: "Avg After Purif.", value: loading ? "—" : readings.length ? `${avgOutput} ppm`   : "—", color: "text-green-500" },
          { label: "Avg Reduction",    value: loading ? "—" : readings.length ? `${avgReduction}%`   : "—", color: "text-blue-500"  },
          { label: "Critical Events",  value: loading ? "—" : String(criticalCount),                         color: "text-red-500"   },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm text-center">
            <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <HistoryChart chartData={chartData} loading={loading} />

      {/* Table */}
      <HistoryTable readings={readings} devices={devices} loading={loading} />
    </div>
  );
}
