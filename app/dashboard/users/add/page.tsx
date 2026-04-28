"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import DarkModeToggle from "../../../components/DarkModeToggle";

export default function AddUserPage() {
  const [form, setForm] = useState({
    name: "", email: "", role: "viewer", status: "active", password: "",
  });

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all";

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/users" className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add User</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Create a new system account</p>
          </div>
        </div>
        <DarkModeToggle />
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Full Name *</label>
          <input className={inputClass} placeholder="First Last" value={form.name} onChange={set("name")} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email Address *</label>
          <input type="email" className={inputClass} placeholder="user@cleanair.rw" value={form.email} onChange={set("email")} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Temporary Password *</label>
          <input type="password" className={inputClass} placeholder="Min. 8 characters" value={form.password} onChange={set("password")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Role *</label>
            <select className={inputClass} value={form.role} onChange={set("role")}>
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</label>
            <select className={inputClass} value={form.status} onChange={set("status")}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Role descriptions */}
        <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
          <p><span className="font-semibold text-purple-500">Admin</span> — Full access: devices, users, settings, all data</p>
          <p><span className="font-semibold text-blue-500">Operator</span> — Manage assigned devices, view readings, configure alerts</p>
          <p><span className="font-semibold text-slate-600 dark:text-slate-300">Viewer</span> — Read-only access to assigned devices</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
          <Link href="/dashboard/users" className="px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            Cancel
          </Link>
          <button type="button" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
            <Save className="w-4 h-4" /> Create User
          </button>
        </div>
      </div>
    </div>
  );
}
