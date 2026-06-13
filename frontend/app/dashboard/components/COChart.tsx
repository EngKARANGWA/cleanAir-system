"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { api, type ApiDevice } from "../../../lib/api";

interface DataPoint {
  time: string;
  input: number;
  output: number;
}

function buildSnapshot(devices: ApiDevice[]): DataPoint | null {
  // API returns coInput/coOutput directly on the device object (no lastReading nesting)
  const active = devices.filter((d) => (d.coInput ?? 0) > 0);
  if (!active.length) return null;
  const avg = (vals: number[]) =>
    Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
  return {
    time:   new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    input:  avg(active.map((d) => d.coInput  ?? 0)),
    output: avg(active.map((d) => d.coOutput ?? 0)),
  };
}

export default function COChart() {
  const [history, setHistory] = useState<DataPoint[]>([]);

  useEffect(() => {
    async function poll() {
      try {
        const devices = await api.devices.list();
        const point   = buildSnapshot(devices);
        if (point) {
          setHistory((prev) => [...prev.slice(-11), point]);
        }
      } catch {
        // silently ignore poll failures
      }
    }

    poll();
    const id = setInterval(poll, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">CO Levels Over Time</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Session history · avg across active devices · ppm
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-3 py-1 rounded-full font-medium">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          Live
        </span>
      </div>

      {history.length === 0 ? (
        <div className="flex items-center justify-center h-[280px] text-slate-400 text-sm">
          Waiting for device data…
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={history} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              domain={[0, 600]}
            />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#f1f5f9",
              }}
              formatter={(value, name) => [
                `${value} ppm`,
                name === "input" ? "CO Input" : "After Purification",
              ]}
            />
            <Legend
              formatter={(value) => (value === "input" ? "CO Input" : "After Purification")}
              wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
            />
            <Line type="monotone" dataKey="input"  stroke="#f87171" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="output" stroke="#34d399" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
