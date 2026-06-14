"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const OPERATOR_BLOCKED = ["/dashboard/users", "/dashboard/settings"];
const VIEWER_ALLOWED   = ["/dashboard", "/dashboard/devices", "/dashboard/dashboards/view"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }

    try {
      const user = JSON.parse(raw);
      if (user.status !== "ACTIVE") { localStorage.removeItem("user"); router.push("/login"); return; }

      const role = (user.role ?? "VIEWER").toUpperCase();

      if (role === "OPERATOR" && OPERATOR_BLOCKED.some((r) => pathname.startsWith(r))) {
        router.push("/dashboard/dashboards/operational"); return;
      }

      if (role === "VIEWER" && !VIEWER_ALLOWED.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
        router.push("/dashboard/dashboards/view"); return;
      }

      setAuthorized(true);
    } catch {
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router, pathname]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return <>{children}</>;
}
