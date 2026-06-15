export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus, Users, Pencil, Cpu } from "lucide-react";
import { RoleBadge, StatusBadge } from "./components/RoleBadge";
import DeleteUserButton from "./components/DeleteUserButton";
import DarkModeToggle from "../../components/DarkModeToggle";
import { api, type AuthUser, type ApiDevice } from "../../../lib/api";

const VEHICLE_ICON: Record<string, string> = { car: "🚗", motorcycle: "🏍️", industry: "🏭" };

async function fetchData(): Promise<{ users: AuthUser[]; devices: ApiDevice[] }> {
  try {
    const [users, devices] = await Promise.all([api.users.list(), api.devices.list()]);
    return { users, devices };
  } catch (err) {
    console.error(err);
    return { users: [], devices: [] };
  }
}

const avatarColors = [
  "bg-blue-500", "bg-purple-500", "bg-green-500",
  "bg-yellow-500", "bg-red-500", "bg-cyan-500",
];

function DevicesCell({ deviceIds, devices }: { deviceIds: string[]; devices: ApiDevice[] }) {
  if (deviceIds.length === 0) {
    return <span className="text-slate-400 text-xs italic">No devices</span>;
  }

  const resolved = deviceIds.map((id) => devices.find((d) => d.id === id) ?? { id, name: id, type: "", status: "" });
  const shown = resolved.slice(0, 2);
  const extra = resolved.length - 2;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {shown.map((d) => (
        <Link
          key={d.id}
          href={`/dashboard/devices/${d.id}`}
          className="inline-flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20 px-2 py-0.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
          title={`${d.name} · ${d.id} · ${d.status}`}
        >
          <span>{VEHICLE_ICON[d.type] ?? <Cpu className="w-3 h-3 inline" />}</span>
          <span className="font-mono">{d.id}</span>
        </Link>
      ))}
      {extra > 0 && (
        <span className="text-xs text-slate-400 font-medium">+{extra} more</span>
      )}
    </div>
  );
}

export default async function UsersPage() {
  const { users, devices } = await fetchData();

  const summary = {
    total:     users.length,
    active:    users.filter((u) => u.status === "ACTIVE").length,
    inactive:  users.filter((u) => u.status === "INACTIVE").length,
    suspended: users.filter((u) => u.status === "SUSPENDED").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {summary.total} users · {summary.active} active · {summary.suspended} suspended
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <Link
            href="/dashboard/users/add"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add User
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users",  value: summary.total,     color: "text-slate-900 dark:text-white" },
          { label: "Active",       value: summary.active,    color: "text-green-500" },
          { label: "Inactive",     value: summary.inactive,  color: "text-slate-400" },
          { label: "Suspended",    value: summary.suspended, color: "text-red-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm text-center">
            <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400" />
          <h3 className="font-semibold text-slate-900 dark:text-white">All Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/40">
                {["User", "Role", "Status", "Devices", "Last Login", "Joined", "Actions"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No users found or backend is unreachable.
                  </td>
                </tr>
              )}
              {users.map((user, i) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/users/${user.id}`} className="flex items-center gap-3 group">
                      <div className={`w-9 h-9 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {(user as { avatar?: string }).avatar ?? user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4"><RoleBadge role={user.role.toLowerCase()} /></td>
                  <td className="px-6 py-4"><StatusBadge status={user.status.toLowerCase()} /></td>
                  <td className="px-6 py-4 max-w-[220px]">
                    <DevicesCell deviceIds={user.assignedDevices ?? []} devices={devices} />
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {(user as { lastLogin?: string }).lastLogin
                      ? (() => { try { return new Date((user as { lastLogin?: string }).lastLogin!).toLocaleDateString(); } catch { return (user as { lastLogin?: string }).lastLogin; } })()
                      : "Never"}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {(user as { joinedAt?: string }).joinedAt
                      ? (() => { try { return new Date((user as { joinedAt?: string }).joinedAt!).toLocaleDateString(); } catch { return (user as { joinedAt?: string }).joinedAt; } })()
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/users/${user.id}/edit`} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteUserButton id={user.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
