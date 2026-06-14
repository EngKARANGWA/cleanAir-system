"use client";

import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { ChartPoint } from "../data";

export default function HistoryChart({ chartData, loading }: { chartData: ChartPoint[]; loading: boolean }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="font-semibold text-slate-900 dark:text-white">CO Trend by Day</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Average daily input vs purified output · all devices
        </p>
      </div>

      {loading ? (
        <div className="h-[260px] flex items-center justify-center text-slate-400">Loading chart…</div>
      ) : chartData.length === 0 ? (
        <div className="h-[260px] flex items-center justify-center text-slate-400">No reading data yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="ppm"    tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, "auto"]} />
            <YAxis yAxisId="events" orientation="right" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "12px", color: "#f1f5f9" }}
              formatter={(value, name) => {
                if (name === "events")    return [`${value}`, "Threshold Events"];
                if (name === "avgInput")  return [`${value} ppm`, "Avg CO Input"];
                return [`${value} ppm`, "Avg After Purification"];
              }}
            />
            <Legend
              formatter={(v) =>
                v === "avgInput"  ? "Avg CO Input" :
                v === "avgOutput" ? "Avg After Purification" :
                "Threshold Events"
              }
              wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
            />
            <Bar  yAxisId="events" dataKey="events"    fill="rgba(251,191,36,0.25)" radius={[4, 4, 0, 0]} />
            <Line yAxisId="ppm"    dataKey="avgInput"  type="monotone" stroke="#f87171" strokeWidth={2} dot={{ r: 3, fill: "#f87171" }} />
            <Line yAxisId="ppm"    dataKey="avgOutput" type="monotone" stroke="#34d399" strokeWidth={2} dot={{ r: 3, fill: "#34d399" }} />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
