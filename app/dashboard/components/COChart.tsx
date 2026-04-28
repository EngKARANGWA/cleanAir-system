"use client";

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

const data = [
  { time: "00:00", input: 380, output: 190 },
  { time: "00:30", input: 410, output: 205 },
  { time: "01:00", input: 450, output: 220 },
  { time: "01:30", input: 490, output: 240 },
  { time: "02:00", input: 520, output: 255 },
  { time: "02:30", input: 480, output: 235 },
  { time: "03:00", input: 430, output: 210 },
  { time: "03:30", input: 460, output: 225 },
  { time: "04:00", input: 500, output: 248 },
  { time: "04:30", input: 420, output: 205 },
  { time: "05:00", input: 395, output: 195 },
  { time: "05:30", input: 440, output: 218 },
];

export default function COChart() {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">CO Levels Over Time</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Last 6 hours · ppm</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-3 py-1 rounded-full font-medium">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          Live
        </span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 600]} />
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
          <Line type="monotone" dataKey="input" stroke="#f87171" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="output" stroke="#34d399" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
