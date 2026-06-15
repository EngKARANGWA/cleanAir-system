"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Lock } from "lucide-react";
import DarkModeToggle from "../../../components/DarkModeToggle";
import { api } from "../../../../lib/api";

export default function AddDevicePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    type: "car",
    owner: "",
    plateOrRef: "",
    location: "",
    ip: "",
    mac: "",
    firmware: "v2.1.3",
    safetyStatus: "NORMAL",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    setError("");

    // Basic validation
    if (!form.name.trim()) { setError("Device name / vehicle model is required."); return; }
    if (!form.owner.trim()) { setError("Owner / operator name is required."); return; }
    if (!form.plateOrRef.trim()) { setError("Plate number / reference ID is required."); return; }
    if (!form.location.trim()) { setError("Operating location is required."); return; }

    setIsSaving(true);
    try {
      await api.devices.create({
        name: form.name.trim(),
        type: form.type.toUpperCase(),   // deployed backend requires uppercase: "CAR" | "MOTORCYCLE" | "INDUSTRY"
        owner: form.owner.trim(),
        plateOrRef: form.plateOrRef.trim(),
        location: form.location.trim(),
        ip: form.ip.trim() || undefined,
        mac: form.mac.trim() || undefined,
        firmware: form.firmware || undefined,
        safetyStatus: form.safetyStatus,
      });
      router.refresh();
      router.push("/dashboard/devices");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register device. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all";

  const platePlaceholder: Record<string, string> = {
    car: "RAC 784 B", motorcycle: "RAD 112 C", industry: "IND-XYZ-001",
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/devices" className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add Device</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Register a new ESP32 purification unit</p>
          </div>
        </div>
        <DarkModeToggle />
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-5">

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Installation type */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Installation Type *</label>
          <select className={inputClass} value={form.type} onChange={set("type")} title="Installation type">
            <option value="car">Car — Passenger / taxi vehicle</option>
            <option value="motorcycle">Motorcycle — Moto / boda-boda</option>
            <option value="industry">Industry — Workshop / small factory</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Device ID — auto-assigned by backend */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Device ID</label>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">Auto-assigned</span>
              <span className="text-xs text-slate-400 ml-auto">e.g. ESP32-004</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {form.type === "industry" ? "Business / Workshop Name" : "Vehicle Make & Model"} *
            </label>
            <input
              className={inputClass}
              placeholder={form.type === "industry" ? "Nyamirambo Welding Shop" : "Toyota Corolla"}
              value={form.name}
              onChange={set("name")}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {form.type === "industry" ? "Reference ID" : "Plate Number"} *
            </label>
            <input className={inputClass} placeholder={platePlaceholder[form.type]} value={form.plateOrRef} onChange={set("plateOrRef")} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Owner / Operator *</label>
            <input className={inputClass} placeholder="Full name" value={form.owner} onChange={set("owner")} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Operating Location *</label>
          <input className={inputClass} placeholder="Kigali — District / Zone" value={form.location} onChange={set("location")} />
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Firmware Version</label>
            <select className={inputClass} value={form.firmware} onChange={set("firmware")} title="Firmware version">
              <option value="v2.1.3">v2.1.3</option>
              <option value="v2.1.2">v2.1.2</option>
              <option value="v2.0.9">v2.0.9</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Safety Status</label>
            <select className={inputClass} value={form.safetyStatus} onChange={set("safetyStatus")} title="Safety status">
              <option value="NORMAL">Normal</option>
              <option value="WARNING">Warning</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
          <Link href="/dashboard/devices" className="px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Registering…" : "Register Device"}
          </button>
        </div>
      </div>
    </div>
  );
}
