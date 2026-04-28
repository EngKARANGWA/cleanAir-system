"use client";

import { useState } from "react";
import { Search, Filter, Download } from "lucide-react";
import { readings } from "../data";

const statusStyle: Record<string, string> = {
  normal:   "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400",
  warning:  "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  critical: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
};

const PAGE_SIZE = 8;

export default function HistoryTable() {
  const [search, setSearch] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = readings.filter((r) => {
    const matchSearch =
      r.device.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.timestamp.includes(search);
    const matchDevice = deviceFilter === "all" || r.device === deviceFilter;
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchDevice && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectClass =
    "px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50";

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Search by device, location, timestamp…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select className={selectClass} value={deviceFilter} onChange={(e) => { setDeviceFilter(e.target.value); setPage(1); }}>
            <option value="all">All Devices</option>
            <option value="ESP32-001">ESP32-001</option>
            <option value="ESP32-002">ESP32-002</option>
            <option value="ESP32-004">ESP32-004</option>
          </select>
          <select className={selectClass} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="all">All Status</option>
            <option value="normal">Normal</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <button type="button" className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all ml-auto">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700/40">
              {["Timestamp", "Device", "Location", "CO Input", "After Purif.", "Reduction", "Status"].map((h) => (
                <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">No readings match your filters</td>
              </tr>
            ) : paginated.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                <td className="px-6 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{r.timestamp}</td>
                <td className="px-6 py-3 font-medium text-slate-700 dark:text-slate-300">{r.device}</td>
                <td className="px-6 py-3 text-slate-500 dark:text-slate-400">{r.location}</td>
                <td className="px-6 py-3 font-semibold text-red-500">{r.coInput} <span className="text-xs font-normal text-slate-400">ppm</span></td>
                <td className="px-6 py-3 font-semibold text-green-500">{r.coOutput} <span className="text-xs font-normal text-slate-400">ppm</span></td>
                <td className="px-6 py-3 text-blue-500 font-semibold">{r.reduction}%</td>
                <td className="px-6 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyle[r.status]}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>{filtered.length} reading{filtered.length !== 1 ? "s" : ""}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            ← Prev
          </button>
          <span className="px-3 py-1.5 font-medium text-slate-900 dark:text-white">{page} / {totalPages || 1}</span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
