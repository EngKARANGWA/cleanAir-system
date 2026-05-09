"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, Wind } from "lucide-react";
import { api } from "../../lib/api";

const rand = (seed: number) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); };
const STARS = Array.from({ length: 120 }, (_, i) => ({
  big:     rand(i * 4)     < 0.3,
  bigH:    rand(i * 4 + 1) < 0.3,
  top:     (rand(i * 4 + 2) * 60).toFixed(2),
  left:    (rand(i * 4 + 3) * 100).toFixed(2),
  opacity: (rand(i * 4 + 4) * 0.7 + 0.3).toFixed(2),
}));

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push("/login");
    }
  }, [email, router]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await api.auth.resetPassword({ token: token ?? "", newPassword, email: email ?? "" });
      router.push("/login?reset=success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-sm mx-4">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl shadow-black/40">

        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-violet-500 to-purple-700 p-3 rounded-2xl shadow-lg shadow-purple-500/30 mb-3">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight text-center">Reset Password</h1>
          <p className="text-white/70 text-xs mt-2 text-center">
            For security reasons, please change your temporary password.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleReset}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs px-3 py-2 rounded-xl text-center">
              {error}
            </div>
          )}

          {/* New Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-violet-400 focus:bg-white/15 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-violet-400 focus:bg-white/15 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white hover:bg-white/90 disabled:opacity-50 text-purple-900 font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-black/20 mt-4 flex items-center justify-center"
          >
            {isLoading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0022] via-[#2d0a6e] to-[#6b21a8]" />

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mounted && STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width:   s.big  ? "2px" : "1px",
              height:  s.bigH ? "2px" : "1px",
              top:     `${s.top}%`,
              left:    `${s.left}%`,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      {/* Mountain silhouette */}
      <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,320 L0,200 L120,100 L240,160 L380,60 L520,140 L660,40 L800,130 L940,50 L1080,140 L1200,80 L1320,150 L1440,90 L1440,320 Z" fill="#1e0050" opacity="0.9" />
        <path d="M0,320 L0,240 L80,180 L180,220 L300,150 L440,200 L560,130 L700,190 L820,120 L960,180 L1080,140 L1200,190 L1320,160 L1440,200 L1440,320 Z" fill="#2d006b" opacity="0.85" />
      </svg>

      {/* Tree silhouettes */}
      <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {mounted && [0,60,120,180,240,300,360,420,480,540,600,660,720,780,840,900,960,1020,1080,1140,1200,1260,1320,1380].map((x, i) => {
          const h = 80 + (i % 5) * 20;
          const w = 30 + (i % 3) * 10;
          return (
            <g key={x} transform={`translate(${x}, ${200 - h})`}>
              <polygon points={`${w/2},0 ${w},${h*0.45} 0,${h*0.45}`} fill="#0f0033" opacity="0.95" />
              <polygon points={`${w/2},${h*0.2} ${w*1.1},${h*0.65} ${-w*0.1},${h*0.65}`} fill="#0f0033" opacity="0.95" />
              <polygon points={`${w/2},${h*0.4} ${w*1.2},${h*0.9} ${-w*0.2},${h*0.9}`} fill="#0f0033" opacity="0.95" />
              <rect x={w/2 - 3} y={h*0.85} width="6" height={h*0.15} fill="#0f0033" opacity="0.95" />
            </g>
          );
        })}
      </svg>

      <Suspense fallback={<div className="relative z-10 text-white">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
