"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const OPERATOR_BLOCKED = ["/dashboard/users", "/dashboard/settings"];
const VIEWER_ALLOWED = [
  "/dashboard",
  "/dashboard/devices",
  "/dashboard/dashboards/view",
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (!userJson) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userJson);

      if (user.status !== "ACTIVE") {
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }

      const role = (user.role ?? "VIEWER").toUpperCase();

      if (role === "OPERATOR" && OPERATOR_BLOCKED.some((r) => pathname.startsWith(r))) {
        router.push("/dashboard");
        return;
      }

      if (role === "VIEWER" && !VIEWER_ALLOWED.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
        router.push("/dashboard");
        return;
      }

      setIsAuthorized(true);
    } catch (e) {
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router, pathname]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
