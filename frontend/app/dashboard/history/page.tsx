"use client";

import { useEffect, useState } from "react";
import { Search, RefreshCw, Download } from "lucide-react";
import DarkModeToggle from "../../components/DarkModeToggle";
import { api, type ApiDevice, type HistoryEvent } from "../../../lib/api";
import { auth } from "../../../lib/auth";

const PAGE_SIZE = 15;

const statusStyle: Record<string, string> = {
  NORMAL:   "bg-green-50  dark:bg-green-500/10  text-green-600  dark:text-green-400",
  WARNING:  "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  CRITICAL: "bg-red-50    dark:bg-red-500/10    text-red-600    dark:text-red-400",
};

const typeStyle: Record<string, string> = {
  alert:   "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
  reading: "bg-blue-50   dark:bg-blue-500/10   text-blue-600   dark:text-blue-400",
};

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString([], {
      month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  } catch {
    return iso;
  }
}

function exportCsv(events: HistoryEvent[], deviceId: string) {
  const BOM    = "﻿";
  const header = "Type,Timestamp,Status,CO Input (ppm),CO Output (ppm),Reduction (%),Message";
  const rows   = events.map((e) =>
    [
      e.type,
      new Date(e.timestamp).toLocaleString(),
      e.status,
      e.data?.inputPpm  ?? "",
      e.data?.outputPpm ?? "",
      e.data ? String(Math.round(e.data.reductionPercentage * 10) / 10) : "",
      `"${e.message.replace(/"/g, '""')}"`,
    ].join(","),
  );
  const blob = new Blob([BOM + [header, ...rows].join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `history-${deviceId}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function HistoryPage() {
  const [devices, setDevices]               = useState<ApiDevice[]>([]);
  const [deviceId, setDeviceId]             = useState("");
  const [limit, setLimit]                   = useState(50);
  const [type, setType]                     = useState<"all" | "reading" | "alert">("all");
  const [events, setEvents]                 = useState<HistoryEvent[]>([]);
  const [loading, setLoading]               = useState(false);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [error, setError]                   = useState("");
  const [page, setPage]                     = useState(1);
  const [search, setSearch]                 = useState("");

  const sessionRole = (auth.get()?.role ?? "VIEWER").toUpperCase();
  const isViewer    = sessionRole === "VIEWER";

  // Load device list once on mount
  // Viewers: fetch their own profile to get the live assigned device IDs, then fetch only those
  // Admins/Operators: fetch all devices
  useEffect(() => {
    async function loadDevices() {
      try {
        if (isViewer) {
          const userId = auth.get()?.id;
          if (!userId) { setLoadingDevices(false); return; }
          const profile    = await api.users.get(userId);
          const assignedIds: string[] = profile.assignedDevices ?? [];
          if (assignedIds.length === 0) { setLoadingDevices(false); return; }
          const devList = await Promise.all(assignedIds.map((id) => api.devices.get(id)));
          setDevices(devList);
          setDeviceId(devList[0].id);
        } else {
          const devList = await api.devices.list();
          setDevices(devList);
          if (devList.length > 0) setDeviceId(devList[0].id);
        }
      } catch {
        // silently ignore
      } finally {
        setLoadingDevices(false);
      }
    }
    loadDevices();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadHistory = async (id = deviceId) => {
    if (!id) return;
    setLoading(true);
    setError("");
    setPage(1);
    try {
      const data = await api.devices.history(id, limit, type);
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load history");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-load when device list first resolves
  useEffect(() => {
    if (deviceId && !loadingDevices) loadHistory(deviceId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId, loadingDevices]);

  const filtered = events.filter((e) => {
    const q = search.toLowerCase();
    return (
      !q ||
      e.message.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q) ||
      e.status.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectedDevice = devices.find((d) => d.id === deviceId);

  const alertCount   = events.filter((e) => e.type === "alert").length;
  const readingCount = events.filter((e) => e.type === "reading").length;
  const critCount    = events.filter((e) => e.status === "CRITICAL").length;
  const warnCount    = events.filter((e) => e.status === "WARNING").length;

  const selectClass =
    "px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-10 md:pt-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Device History</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {selectedDevice
              ? `${selectedDevice.name} · ${selectedDevice.id} · ${selectedDevice.plateOrRef}`
              : "Select a device to view its history"}
          </p>
        </div>
        <DarkModeToggle />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Device selector */}
          <div className="space-y-1 flex-1 min-w-52">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Device
            </label>
            <select
              title="Select device"
              className={`${selectClass} w-full`}
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              disabled={loadingDevices}
            >
              {loadingDevices ? (
                <option>Loading devices…</option>
              ) : devices.length === 0 ? (
                <option>{isViewer ? "No devices assigned to your account" : "No devices found"}</option>
              ) : (
                devices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.id} — {d.name} ({d.plateOrRef})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Limit */}
          <div className="space-y-1 w-28">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Limit
            </label>
            <input
              type="number"
              title="Event limit"
              min={5}
              max={200}
              step={5}
              value={limit}
              onChange={(e) =>
                setLimit(Math.max(5, Math.min(200, Number(e.target.value) || 50)))
              }
              className={`${selectClass} w-full`}
            />
          </div>

          {/* Event type */}
          <div className="space-y-1 w-40">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Event Type
            </label>
            <select
              title="Event type"
              className={`${selectClass} w-full`}
              value={type}
              onChange={(e) => setType(e.target.value as "all" | "reading" | "alert")}
            >
              <option value="all">All events</option>
              <option value="reading">Readings only</option>
              <option value="alert">Alerts only</option>
            </select>
          </div>

          {/* Load button */}
          <button
            type="button"
            onClick={() => loadHistory()}
            disabled={!deviceId || loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Loading…" : "Load"}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-xl">
            {error}
          </p>
        )}
      </div>

      {/* Summary cards */}
      {events.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Events", value: events.length, color: "text-slate-900 dark:text-white" },
            { label: "Readings",     value: readingCount,  color: "text-blue-500"   },
            { label: "Critical",     value: critCount,     color: "text-red-500"    },
            { label: "Warnings",     value: warnCount,     color: "text-yellow-500" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm text-center"
            >
              <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Event table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Search message, status, event ID…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <span className="text-xs text-slate-400">{filtered.length} events</span>
          <button
            type="button"
            onClick={() => exportCsv(filtered, selectedDevice?.id ?? "device")}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-all"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/40">
                {["Type", "Timestamp", "Status", "CO Input", "CO Output", "Reduction", "Message"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Loading history…
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    {events.length === 0
                      ? "No history yet — select a device and click Load"
                      : "No events match your search"}
                  </td>
                </tr>
              ) : (
                paginated.map((e) => (
                  <tr
                    key={e.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${typeStyle[e.type] ?? ""}`}
                      >
                        {e.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatTime(e.timestamp)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle[e.status] ?? "text-slate-400"}`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-red-500">
                      {e.data ? (
                        <>
                          {e.data.inputPpm}{" "}
                          <span className="text-xs font-normal text-slate-400">ppm</span>
                        </>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-semibold text-green-500">
                      {e.data ? (
                        <>
                          {e.data.outputPpm}{" "}
                          <span className="text-xs font-normal text-slate-400">ppm</span>
                        </>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-semibold text-blue-500">
                      {e.data ? (
                        `${Math.round(e.data.reductionPercentage * 10) / 10}%`
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">
                      {e.message}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>
            {filtered.length} event{filtered.length !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ← Prev
            </button>
            <span className="px-3 py-1.5 font-medium text-slate-900 dark:text-white">
              {page} / {totalPages}
            </span>
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
    </div>
  );
}
