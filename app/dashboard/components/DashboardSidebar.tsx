"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wind, LayoutDashboard, History, BellRing, Settings, Cpu, Users, ArrowLeft, LogOut } from "lucide-react";
import { auth } from "../../../lib/auth";

const ALL_NAV = [
  { label: "Overview", href: "/dashboard",          icon: LayoutDashboard, roles: ["ADMIN", "OPERATOR", "VIEWER"] },
  { label: "Devices",  href: "/dashboard/devices",  icon: Cpu,             roles: ["ADMIN", "OPERATOR", "VIEWER"] },
  { label: "Users",    href: "/dashboard/users",    icon: Users,           roles: ["ADMIN"] },
  { label: "History",  href: "/dashboard/history",  icon: History,         roles: ["ADMIN", "OPERATOR"] },
  { label: "Alerts",   href: "/dashboard/alerts",   icon: BellRing,        roles: ["ADMIN", "OPERATOR"] },
  { label: "Settings", href: "/dashboard/settings", icon: Settings,        roles: ["ADMIN"] },
];

const ROLE_BADGE: Record<string, string> = {
  ADMIN:    "bg-purple-500/10 text-purple-500",
  OPERATOR: "bg-blue-500/10 text-blue-500",
  VIEWER:   "bg-slate-500/10 text-slate-400",
};

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userRole,  setUserRole]  = useState("VIEWER");

  useEffect(() => {
    const user = auth.get();
    if (user) {
      setUserEmail(user.email);
      setUserRole((user.role ?? "VIEWER").toUpperCase());
    }
  }, []);

  const navItems = ALL_NAV.filter((item) => item.roles.includes(userRole));

  const handleLogout = () => {
    auth.clear();
    localStorage.clear();
    sessionStorage.clear();
    router.push("/");
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-green-500 p-2 rounded-xl">
            <Wind className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-sm text-slate-900 dark:text-white">CleanAir</span>
            <span className="text-green-500 text-[10px] font-semibold uppercase tracking-widest">Dashboard</span>
            {userEmail && (
              <span className="text-slate-400 dark:text-slate-500 text-[9px] mt-1 truncate max-w-[140px]" title={userEmail}>
                {userEmail}
              </span>
            )}
            {userRole && (
              <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded mt-0.5 w-fit ${ROLE_BADGE[userRole] ?? ROLE_BADGE.VIEWER}`}>
                {userRole}
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-700 space-y-1">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
