"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Eye, EyeOff, Wind } from "lucide-react";
import DarkModeToggle from "../components/DarkModeToggle";
import PageBackground from "../components/PageBackground";
import { api } from "../../lib/api";
import { auth } from "../../lib/auth";
import { checkMockCredentials } from "../../lib/mockUsers";

const getDashboardRoute = (role: string) => {
  switch (role.toUpperCase()) {
    case "OPERATOR": return "/dashboard/dashboards/operational";
    case "VIEWER":   return "/dashboard/dashboards/view";
    default:         return "/dashboard";
  }
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Check mock credentials first (works without backend)
      const mockUser = checkMockCredentials(email, password);
      if (mockUser) {
        auth.set(mockUser);
        router.push(getDashboardRoute(mockUser.role));
        return;
      }

      // Fall back to backend
      const data = await api.auth.login(email, password);
      if (data.requiresReset) {
        router.push(`/reset-password?email=${encodeURIComponent(data.email ?? email)}`);
      } else if (data.user) {
        auth.set(data.user);
        router.push(getDashboardRoute(data.user.role));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <PageBackground />

      <div className="absolute top-4 right-4 z-20">
        <DarkModeToggle />
      </div>

      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="backdrop-blur-xl bg-white/80 dark:bg-white/10 border border-white dark:border-white/20 rounded-3xl p-8 shadow-2xl shadow-purple-200/60 dark:shadow-black/40">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-br from-violet-500 to-purple-700 p-3 rounded-2xl shadow-lg shadow-purple-500/30 mb-3">
              <Wind className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Login</h1>
            <p className="text-slate-400 dark:text-white/50 text-xs mt-1">CleanAir Monitoring System</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs px-3 py-2 rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-white/60 dark:bg-white/10 border border-slate-200 dark:border-white/20 rounded-xl px-4 py-3 pr-10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 text-sm focus:outline-none focus:border-violet-400 transition-all"
              />
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white/60 dark:bg-white/10 border border-slate-200 dark:border-white/20 rounded-xl px-4 py-3 pr-10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 text-sm focus:outline-none focus:border-violet-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs text-slate-500 dark:text-white/60 hover:text-violet-600 dark:hover:text-white transition-colors">
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-violet-600 hover:bg-violet-500 dark:bg-white dark:hover:bg-white/90 text-white dark:text-purple-900 font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-violet-500/30 dark:shadow-black/20 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in…" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
