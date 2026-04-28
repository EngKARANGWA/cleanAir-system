"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, Save } from "lucide-react";
import DarkModeToggle from "../../../components/DarkModeToggle";

export default function AddDevicePage() {
  const [form, setForm] = useState({
    id: "", name: "", location: "", ip: "", mac: "", firmware: "v2.1.3",
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all";

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/devices" className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add Device</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Register a new ESP32 sensor unit</p>
          </div>
        </div>
        <DarkModeToggle />
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-4 h-4 text-blue-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white">Device Details</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Device ID *</label>
            <input className={inputClass} placeholder="ESP32-005" value={form.id} onChange={set("id")} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Unit Name *</label>
            <input className={inputClass} placeholder="Unit E — Description" value={form.name} onChange={set("name")} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Location *</label>
          <input className={inputClass} placeholder="Kigali, Rwanda · Zone Name" value={form.location} onChange={set("location")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">IP Address</label>
            <input className={inputClass} placeholder="192.168.1.105" value={form.ip} onChange={set("ip")} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">MAC Address</label>
            <input className={inputClass} placeholder="A4:CF:12:7E:3B:05" value={form.mac} onChange={set("mac")} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Firmware Version</label>
          <select className={inputClass} value={form.firmware} onChange={set("firmware")}>
            <option>v2.1.3</option>
            <option>v2.1.2</option>
            <option>v2.0.9</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
          <Link href="/dashboard/devices" className="px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            Cancel
          </Link>
          <button
            type="button"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Device
          </button>
        </div>
      </div>
    </div>
  );
}
