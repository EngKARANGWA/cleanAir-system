import { UserRole, UserStatus } from "../data";

const roleStyle: Record<UserRole, string> = {
  admin:    "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
  operator: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  viewer:   "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
};

const statusStyle: Record<UserStatus, string> = {
  active:    "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400",
  inactive:  "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400",
  suspended: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
};

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${roleStyle[role]}`}>
      {role}
    </span>
  );
}

export function StatusBadge({ status }: { status: UserStatus }) {
  const dotColor: Record<UserStatus, string> = {
    active: "bg-green-500", inactive: "bg-slate-400", suspended: "bg-red-500",
  };
  return (
    <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyle[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor[status]}`} />
      {status}
    </span>
  );
}
