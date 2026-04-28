import Link from "next/link";
import { Plus, Users, Pencil, Trash2 } from "lucide-react";
import { users } from "./data";
import { RoleBadge, StatusBadge } from "./components/RoleBadge";
import DarkModeToggle from "../../components/DarkModeToggle";

const summary = {
  total:     users.length,
  active:    users.filter((u) => u.status === "active").length,
  inactive:  users.filter((u) => u.status === "inactive").length,
  suspended: users.filter((u) => u.status === "suspended").length,
};

const avatarColors = [
  "bg-blue-500", "bg-purple-500", "bg-green-500",
  "bg-yellow-500", "bg-red-500", "bg-cyan-500",
];

export default function UsersPage() {
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
      <div className="grid grid-cols-4 gap-4">
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
              {users.map((user, i) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/users/${user.id}`} className="flex items-center gap-3 group">
                      <div className={`w-9 h-9 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                  <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                  <td className="px-6 py-4">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{user.assignedDevices.length}</span>
                    <span className="text-slate-400 text-xs ml-1">device{user.assignedDevices.length !== 1 ? "s" : ""}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{user.lastLogin}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{user.joinedAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/users/${user.id}/edit`} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button type="button" className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
