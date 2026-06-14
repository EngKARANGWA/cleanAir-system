"use client";

import { useState, useEffect, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Search, Cpu, X, CheckCircle2, Lock } from "lucide-react";
import DarkModeToggle from "../../../../components/DarkModeToggle";
import { api, type ApiDevice, type AuthUser } from "../../../../../lib/api";

const VEHICLE_ICON: Record<string, string> = { car: "🚗", motorcycle: "🏍️", industry: "🏭" };

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", role: "VIEWER", status: "ACTIVE" });
  const [assignedDevices, setAssignedDevices] = useState<string[]>([]);
  const [allDevices, setAllDevices] = useState<ApiDevice[]>([]);
  const [allUsers, setAllUsers] = useState<AuthUser[]>([]);
  const [deviceSearch, setDeviceSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [user, devices, users] = await Promise.all([
          api.users.get(id),
          api.devices.list(),
          api.users.list(),
        ]);
        setForm({ name: user.name ?? "", email: user.email ?? "", role: user.role ?? "VIEWER", status: user.status ?? "ACTIVE" });
        setAssignedDevices(user.assignedDevices ?? []);
        setAllDevices(devices);
        setAllUsers(users);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  // Device IDs assigned to OTHER users
  const takenByOthers = useMemo(() => {
    const set = new Set<string>();
    for (const u of allUsers) {
      if (u.id === id) continue;
      for (const dId of u.assignedDevices ?? []) set.add(dId);
    }
    return set;
  }, [allUsers, id]);

  const filteredDevices = useMemo(() => {
    const q = deviceSearch.toLowerCase();
    return allDevices.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.plateOrRef.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q),
    );
  }, [allDevices, deviceSearch]);

  const toggleDevice = (deviceId: string) => {
    if (takenByOthers.has(deviceId)) return;
    setAssignedDevices((prev) =>
      prev.includes(deviceId) ? prev.filter((d) => d !== deviceId) : [...prev, deviceId],
    );
  };

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    setError("");
    setIsSaving(true);
    try {
      await api.users.update(id, { ...form, assignedDevices });
      router.refresh(); // bust the Next.js router cache so the users list re-fetches
      router.push("/dashboard/users");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/users/${id}`} className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit User</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{id}</p>
          </div>
        </div>
        <DarkModeToggle />
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Full Name</label>
          <input title="Full Name" placeholder="Full name" className={inputClass} value={form.name} onChange={set("name")} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email Address</label>
          <input type="email" title="Email Address" placeholder="Email address" className={inputClass} value={form.email} onChange={set("email")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Role</label>
            <select title="Role" className={inputClass} value={form.role} onChange={set("role")}>
              <option value="ADMIN">Admin</option>
              <option value="OPERATOR">Operator</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</label>
            <select title="Status" className={inputClass} value={form.status} onChange={set("status")}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        {/* ── Device Assignment ── */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Assigned Devices
            </label>
            <span className="text-xs text-slate-400">
              {assignedDevices.length} selected · {takenByOthers.size} taken
            </span>
          </div>

          {/* Selected chips */}
          {assignedDevices.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {assignedDevices.map((dId) => {
                const device = allDevices.find((d) => d.id === dId);
                return (
                  <span
                    key={dId}
                    className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 px-2.5 py-1 rounded-lg"
                  >
                    {VEHICLE_ICON[device?.type ?? ""] ?? "📡"} {device?.name ?? dId}
                    <button
                      type="button"
                      onClick={() => toggleDevice(dId)}
                      className="ml-0.5 text-blue-400 hover:text-blue-700 dark:hover:text-blue-100"
                      aria-label={`Remove ${dId}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Search by name, plate, type or location…"
              value={deviceSearch}
              onChange={(e) => setDeviceSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>

          {/* Device list */}
          <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
            {filteredDevices.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">No devices found</p>
            )}
            {filteredDevices.map((device) => {
              const selected = assignedDevices.includes(device.id);
              const taken = takenByOthers.has(device.id);

              return (
                <button
                  key={device.id}
                  type="button"
                  onClick={() => toggleDevice(device.id)}
                  disabled={taken}
                  title={taken ? "Already assigned to another user" : undefined}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                    ${taken ? "opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-700/20" : "hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer"}
                    ${selected && !taken ? "bg-blue-50/60 dark:bg-blue-500/10" : ""}
                  `}
                >
                  {/* Status indicator */}
                  <div className="shrink-0">
                    {taken ? (
                      <Lock className="w-4 h-4 text-slate-400" />
                    ) : selected ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                    )}
                  </div>

                  {/* Icon */}
                  <span className="text-lg shrink-0">{VEHICLE_ICON[device.type] ?? "📡"}</span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${selected ? "text-blue-700 dark:text-blue-300" : "text-slate-800 dark:text-slate-200"}`}>
                      {device.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{device.plateOrRef} · {device.location}</p>
                  </div>

                  {/* Online badge */}
                  <span className={`shrink-0 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full
                    ${device.status === "ONLINE" ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                    : device.status === "WARNING" ? "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-400"}`}>
                    {device.status}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400">
            <Lock className="w-3 h-3 inline mr-1" />Locked devices are assigned to another user and cannot be selected.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
          <Link href="/dashboard/users" className="px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
