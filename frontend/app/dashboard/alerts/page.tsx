"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { api, type ApiDevice } from "../../../lib/api";
import AlertCard from "./components/AlertCard";
import AlertRules from "./components/AlertRules";
import DarkModeToggle from "../../components/DarkModeToggle";
import type { Alert, AlertSeverity, AlertState } from "./data";

// ─── Derive Alert objects from live device data ───────────────────────────────

const DEVICE_TYPE_LABEL: Record<string, string> = {
  car: "Car", motorcycle: "Motorcycle", industry: "Industry",
  CAR: "Car", MOTORCYCLE: "Motorcycle", INDUSTRY: "Industry",
};

function deriveAlerts(devices: ApiDevice[]): Alert[] {
  const now = new Date().toLocaleString();
  return devices.flatMap((d) => {
    // API returns coInput/coOutput/reduction directly on the device object
    const inputPpm  = d.coInput  ?? 0;
    const outputPpm = d.coOutput ?? 0;
    const type      = DEVICE_TYPE_LABEL[d.type] ?? d.type;
    const results: Alert[] = [];

    if (d.status === "OFFLINE" || (!inputPpm && !outputPpm)) {
      results.push({
        id:          `off-${d.id}`,
        severity:    "info" as AlertSeverity,
        state:       "active" as AlertState,
        title:       `Device Offline — ${d.name}`,
        message:     `${d.id} lost connection. Device may be out of Wi-Fi range.`,
        device:      d.id,
        vehicleName: d.name,
        plateOrRef:  d.plateOrRef,
        type,
        coLevel:     0,
        threshold:   0,
        triggeredAt: now,
      });
      return results;
    }

    if (inputPpm >= 500) {
      results.push({
        id:          `crit-${d.id}`,
        severity:    "critical",
        state:       "active",
        title:       `CO Critical — ${d.name}`,
        message:     `CO input reached ${inputPpm} ppm on ${d.plateOrRef}. Exceeds 500 ppm safety threshold.`,
        device:      d.id,
        vehicleName: d.name,
        plateOrRef:  d.plateOrRef,
        type,
        coLevel:     inputPpm,
        threshold:   500,
        triggeredAt: now,
      });
    } else if (inputPpm >= 400) {
      results.push({
        id:          `warn-${d.id}`,
        severity:    "warning",
        state:       "active",
        title:       `CO Above Threshold — ${d.name}`,
        message:     `CO input at ${inputPpm} ppm on ${d.plateOrRef}. Above 400 ppm warning threshold.`,
        device:      d.id,
        vehicleName: d.name,
        plateOrRef:  d.plateOrRef,
        type,
        coLevel:     inputPpm,
        threshold:   400,
        triggeredAt: now,
      });
    }

    const reduction = d.reduction ?? (
      inputPpm > 0 && outputPpm >= 0
        ? Math.round(((inputPpm - outputPpm) / inputPpm) * 100)
        : 0
    );
    if (inputPpm > 0 && reduction < 45) {
      results.push({
        id:          `eff-${d.id}`,
        severity:    "warning",
        state:       "active",
        title:       `Low Purification Rate — ${d.name}`,
        message:     `Purification efficiency at ${reduction}% on ${d.plateOrRef}, below the 45% target.`,
        device:      d.id,
        vehicleName: d.name,
        plateOrRef:  d.plateOrRef,
        type,
        coLevel:     inputPpm,
        threshold:   45,
        triggeredAt: now,
      });
    }

    return results;
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Filter = "all" | "active" | "acknowledged" | "resolved";

export default function AlertsPage() {
  const [alerts,  setAlerts]  = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState<Filter>("all");

  useEffect(() => {
    api.devices
      .list()
      .then((devs) => setAlerts(deriveAlerts(devs)))
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = alerts.filter((a) => filter === "all" || a.state === filter);

  const summary = {
    critical:     alerts.filter((a) => a.severity === "critical" && a.state !== "resolved").length,
    warning:      alerts.filter((a) => a.severity === "warning"  && a.state !== "resolved").length,
    acknowledged: alerts.filter((a) => a.state === "acknowledged").length,
    resolved:     alerts.filter((a) => a.state === "resolved").length,
  };

  const tabClass = (f: Filter) =>
    `px-4 py-2 text-sm font-medium rounded-xl transition-all ${
      filter === f
        ? "bg-blue-600 text-white"
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
    }`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Alerts</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor threshold breaches and system events
          </p>
        </div>
        <DarkModeToggle />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Critical",     value: summary.critical,     color: "text-red-500"    },
          { label: "Warnings",     value: summary.warning,      color: "text-yellow-500" },
          { label: "Acknowledged", value: summary.acknowledged, color: "text-blue-500"   },
          { label: "Resolved",     value: summary.resolved,     color: "text-green-500"  },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm text-center"
          >
            <p className={`text-3xl font-extrabold ${color}`}>{loading ? "—" : value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-4">
        {/* Filter tabs */}
        <div className="flex items-center gap-2">
          <button type="button" className={tabClass("all")}          onClick={() => setFilter("all")}>
            All ({alerts.length})
          </button>
          <button type="button" className={tabClass("active")}       onClick={() => setFilter("active")}>
            Active ({alerts.filter((a) => a.state === "active").length})
          </button>
          <button type="button" className={tabClass("acknowledged")} onClick={() => setFilter("acknowledged")}>
            Acknowledged ({summary.acknowledged})
          </button>
          <button type="button" className={tabClass("resolved")}     onClick={() => setFilter("resolved")}>
            Resolved ({summary.resolved})
          </button>
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center text-slate-400 text-sm">
              Loading alerts…
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center">
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <p className="font-medium text-slate-600 dark:text-slate-300">All clear — no alerts in this category</p>
              <p className="text-sm text-slate-400 mt-1">All devices are operating within normal thresholds.</p>
            </div>
          ) : (
            filtered.map((alert) => <AlertCard key={alert.id} alert={alert} />)
          )}
        </div>
      </div>

      {/* Alert Rules */}
      <AlertRules />
    </div>
  );
}
