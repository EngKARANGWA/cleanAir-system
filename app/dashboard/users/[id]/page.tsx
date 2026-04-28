import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Calendar, Clock, Cpu, Pencil, UserX, ShieldCheck } from "lucide-react";
import { users } from "../data";
import { RoleBadge, StatusBadge } from "../components/RoleBadge";
import DarkModeToggle from "../../../components/DarkModeToggle";

const avatarColors = [
  "bg-blue-500", "bg-purple-500", "bg-green-500",
  "bg-yellow-500", "bg-red-500", "bg-cyan-500",
];

const rolePermissions: Record<string, string[]> = {
  admin:    ["View all devices", "Edit device settings", "Manage users", "View all readings", "Configure alerts", "Export data"],
  operator: ["View assigned devices", "Edit device settings", "View readings", "Configure alerts"],
  viewer:   ["View assigned devices", "View readings"],
};

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = users.find((u) => u.id === id);
  if (!user) notFound();

  const idx = users.indexOf(user);
  const avatarColor = avatarColors[idx % avatarColors.length];
  const permissions = rolePermissions[user.role];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/users" className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Profile</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{user.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <Link href={`/dashboard/users/${user.id}/edit`} className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            <Pencil className="w-4 h-4" /> Edit
          </Link>
          <button type="button" className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all">
            <UserX className="w-4 h-4" /> Suspend
          </button>
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex items-center gap-6">
        <div className={`w-20 h-20 rounded-2xl ${avatarColor} flex items-center justify-center text-white text-2xl font-bold shrink-0`}>
          {user.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
            <RoleBadge role={user.role} />
            <StatusBadge status={user.status} />
          </div>
          <div className="flex items-center gap-5 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{user.email}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />Last login: {user.lastLogin}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Joined {user.joinedAt}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Assigned devices */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-500" /> Assigned Devices
          </h3>
          {user.assignedDevices.length > 0 ? (
            <div className="space-y-2">
              {user.assignedDevices.map((deviceId) => (
                <Link
                  key={deviceId}
                  href={`/dashboard/devices/${deviceId}`}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Cpu className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{deviceId}</span>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-blue-400">View →</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">No devices assigned</p>
          )}
        </div>

        {/* Permissions */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500" /> Permissions
            <span className="ml-auto text-xs text-slate-400 capitalize">{user.role} role</span>
          </h3>
          <div className="space-y-2">
            {["View all devices", "Edit device settings", "Manage users", "View all readings", "Configure alerts", "Export data"].map((perm) => {
              const granted = permissions.includes(perm);
              return (
                <div key={perm} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${granted ? "bg-green-50 dark:bg-green-500/10" : "bg-slate-50 dark:bg-slate-700/30 opacity-50"}`}>
                  <span className={`text-sm ${granted ? "text-green-600 dark:text-green-400 font-medium" : "text-slate-400 line-through"}`}>{perm}</span>
                  {granted && <span className="ml-auto text-green-500 text-xs">✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
