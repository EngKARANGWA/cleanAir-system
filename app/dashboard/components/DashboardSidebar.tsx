"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wind,
  LayoutDashboard,
  History,
  BellRing,
  Settings,
  Cpu,
  Users,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard",         icon: LayoutDashboard },
  { label: "Devices",  href: "/dashboard/devices", icon: Cpu },
  { label: "Users",    href: "/dashboard/users",   icon: Users },
  { label: "History",  href: "/dashboard/history", icon: History },
  { label: "Alerts",   href: "/dashboard/alerts",  icon: BellRing },
  { label: "Settings", href: "/dashboard/settings",icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

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
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
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

      {/* Back to site */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-700">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </Link>
      </div>
    </aside>
  );
}
