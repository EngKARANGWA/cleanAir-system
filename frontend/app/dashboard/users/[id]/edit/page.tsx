"use client";

import { useState, useEffect, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Search, Cpu, CheckCircle2, Lock } from "lucide-react";
import DarkModeToggle from "../../../../components/DarkModeToggle";
import { api, type ApiDevice, type AuthUser } from "../../../../../lib/api";

const VEHICLE_ICON: Record<string, string> = {
  car: "🚗", CAR: "🚗", motorcycle: "🏍️", MOTORCYCLE: "🏍️", industry: "🏭", INDUSTRY: "🏭",
};

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [form, setForm]                   = useState({ name: "", email: "", role: "VIEWER", status: "ACTIVE" });
  const [currentDevices, setCurrentDevices] = useState<string[]>([]);   // already assigned (read-only)
  const [newDevice, setNewDevice]           = useState<string>("");      // device to ADD on save
  const [allDevices,  setAllDevices]        = useState<ApiDevice[]>([]);
  const [allUsers,    setAllUsers]          = useState<AuthUser[]>([]);
  const [deviceSearch, setDeviceSearch]     = useState("");
  const [isLoading,  setIsLoading]          = useState(true);
  const [isSaving,   setIsSaving]           = useState(false);
  const [error,      setError]              = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [user, devices, users] = await Promise.all([
          api.users.get(id),
          api.devices.list(),
          api.users.list(),
        ]);
        setForm({
          name:   user.name   ?? "",
          email:  user.email  ?? "",
          role:   user.role   ?? "VIEWER",
          status: user.status ?? "ACTIVE",
        });
        setCurrentDevices(user.assignedDevices ?? []);
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

  // Device IDs taken by OTHER users
  const takenByOthers = useMemo(() => {
    const s = new Set<string>();
    for (const u of allUsers) {
      if (u.id === id) continue;
      for (const dId of u.assignedDevices ?? []) s.add(dId);
    }
    return s;
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

  // Pick a new device to assign — single select, only from devices not already owned
  const pickDevice = (deviceId: string) => {
    if (takenByOthers.has(deviceId) || currentDevices.includes(deviceId)) return;
    setNewDevice((prev) => (prev === deviceId ? "" : deviceId));
  };

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    setError("");
    setIsSaving(true);
    try {
      const payload: Parameters<typeof api.users.update>[1] = { ...form };
      // Backend: deviceId adds ONE device — only send when role is VIEWER and a new device is chosen
      if (form.role === "VIEWER" && newDevice) {
        payload.deviceId = newDevice;
      }
      await api.users.update(id, payload);
      router.refresh();
      router.push("/dashboard/users");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all";

  const isViewer = form.role === "VIEWER";

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
          <Link
            href={`/dashboard/users/${id}`}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
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

        {/* ── Device Assignment (VIEWER only) ── */}
        <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-700">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5 pt-1">
            <Cpu className="w-3.5 h-3.5" /> Device Assignment
          </label>

          {!isViewer ? (
            /* Non-VIEWER: show lock message */
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Device assignment is only available for <span className="font-semibold">Viewer</span> role users.
              </p>
            </div>
          ) : (
            <>
              {/* Currently assigned devices (read-only) */}
              {currentDevices.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wide">Currently assigned</p>
                  <div className="flex flex-wrap gap-2">
                    {currentDevices.map((dId) => {
                      const dev = allDevices.find((d) => d.id === dId);
                      return (
                        <span
                          key={dId}
                          className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/30 px-2.5 py-1 rounded-lg"
                        >
                          {VEHICLE_ICON[dev?.type ?? ""] ?? "📡"}
                          <span className="font-mono">{dId}</span>
                          {dev && <span className="text-green-500/70">· {dev.name}</span>}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* New device to add */}
              {newDevice && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <p className="text-xs text-blue-700 dark:text-blue-300 flex-1">
                    Will assign <span className="font-mono font-semibold">{newDevice}</span> on save
                  </p>
                  <button
                    type="button"
                    onClick={() => setNewDevice("")}
                    className="text-xs text-blue-400 hover:text-blue-600 underline"
                  >
                    Clear
                  </button>
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
                  const alreadyOwned = currentDevices.includes(device.id);
                  const taken        = takenByOthers.has(device.id);
                  const selected     = newDevice === device.id;
                  const st           = device.status?.toUpperCase();

                  return (
                    <button
                      key={device.id}
                      type="button"
                      onClick={() => pickDevice(device.id)}
                      disabled={taken || alreadyOwned}
                      title={
                        alreadyOwned ? "Already assigned to this user"
                        : taken      ? "Already assigned to another user"
                        : undefined
                      }
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                        ${taken || alreadyOwned ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer"}
                        ${selected ? "bg-blue-50/70 dark:bg-blue-500/10" : ""}
                        ${alreadyOwned ? "bg-green-50/40 dark:bg-green-500/5" : ""}
                      `}
                    >
                      {/* Indicator */}
                      <div className="shrink-0">
                        {alreadyOwned ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : taken ? (
                          <Lock className="w-4 h-4 text-slate-400" />
                        ) : selected ? (
                          <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                        )}
                      </div>

                      {/* Vehicle icon */}
                      <span className="text-lg shrink-0">{VEHICLE_ICON[device.type] ?? "📡"}</span>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          alreadyOwned ? "text-green-700 dark:text-green-300"
                          : selected   ? "text-blue-700 dark:text-blue-300"
                          :              "text-slate-800 dark:text-slate-200"
                        }`}>
                          {device.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate font-mono">{device.id} · {device.plateOrRef}</p>
                      </div>

                      {/* Right badges */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {alreadyOwned && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400">
                            Assigned
                          </span>
                        )}
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          st === "ONLINE"  ? "bg-green-100  dark:bg-green-500/20  text-green-600  dark:text-green-400"
                        : st === "WARNING" ? "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                        :                   "bg-slate-100  dark:bg-slate-700      text-slate-400"
                        }`}>
                          {device.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-400">
                <Lock className="w-3 h-3 inline mr-1" />
                Locked = assigned to another user · Green = already yours · Click to select a new device to add.
              </p>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
          <Link
            href="/dashboard/users"
            className="px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
