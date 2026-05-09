"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ChevronLeft, Wind, AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "../../lib/api";

const rand = (seed: number) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); };
const STARS = Array.from({ length: 120 }, (_, i) => ({
  big: rand(i * 4) < 0.3,
  bigH: rand(i * 4 + 1) < 0.3,
  top: (rand(i * 4 + 2) * 60).toFixed(2),
  left: (rand(i * 4 + 3) * 100).toFixed(2),
  opacity: (rand(i * 4 + 4) * 0.7 + 0.3).toFixed(2),
}));

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await api.auth.forgotPassword(email) as { message?: string };
      setSuccess(data.message ?? "Reset link sent — check your email.");
      setEmail("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0022] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0022] via-[#2d0a6e] to-[#6b21a8]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(107,33,168,0.3)_0%,transparent_70%)]" />

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {mounted && STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: s.big ? "2px" : "1px",
              height: s.bigH ? "2px" : "1px",
              top: `${s.top}%`,
              left: `${s.left}%`,
              opacity: s.opacity,
              animationDelay: `${rand(i) * 3}s`,
              animationDuration: `${2 + rand(i) * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Mountain silhouettes */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full z-0 h-[35vh]"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,320 L0,200 L120,100 L240,180 L360,60 L540,200 L720,40 L900,180 L1080,80 L1260,200 L1440,120 L1440,320 Z"
          fill="#1e0050"
          opacity="0.9"
        />
        <path
          d="M0,320 L0,260 L100,190 L220,240 L340,160 L480,260 L620,180 L780,240 L920,160 L1100,240 L1280,180 L1440,220 L1440,320 Z"
          fill="#2d006b"
          opacity="0.85"
        />
      </svg>

      {/* Pine Trees */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full z-10 h-[15vh]"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {mounted && [...Array(24)].map((_, i) => {
          const x = i * 60 + rand(i) * 20;
          const h = 80 + (i % 5) * 20;
          const w = 30 + (i % 3) * 10;
          return (
            <g key={i} transform={`translate(${x}, ${200 - h})`}>
              <polygon points={`${w / 2},0 ${w},${h * 0.45} 0,${h * 0.45}`} fill="#0f0033" opacity="0.95" />
              <polygon points={`${w / 2},${h * 0.2} ${w * 1.1},${h * 0.65} ${-w * 0.1},${h * 0.65}`} fill="#0f0033" opacity="0.95" />
              <polygon points={`${w / 2},${h * 0.4} ${w * 1.2},${h * 0.9} ${-w * 0.2},${h * 0.9}`} fill="#0f0033" opacity="0.95" />
              <rect x={w / 2 - 3} y={h * 0.85} width="6" height={h * 0.15} fill="#0f0033" opacity="0.95" />
            </g>
          );
        })}
      </svg>

      {/* Glass Card */}
      <div className="relative z-20 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="px-8 pt-10 pb-12">
            {/* Logo & Back button */}
            <div className="flex flex-col items-center mb-8">
              <Link
                href="/login"
                className="absolute top-8 left-8 text-white/50 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Login
              </Link>
              <div className="bg-gradient-to-br from-violet-500 to-purple-700 p-4 rounded-2xl shadow-xl shadow-purple-500/20 mb-4 mt-6">
                <Wind className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Forgot Password</h1>
              <p className="text-white/50 text-sm mt-2 text-center max-w-[260px]">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <p className="text-sm text-green-200">{success}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-semibold text-white/40 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 focus:bg-white/10 transition-all"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-violet-400 transition-colors" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full group relative flex items-center justify-center bg-white hover:bg-white/90 disabled:bg-white/50 text-purple-900 font-bold py-4 rounded-2xl text-sm transition-all shadow-xl shadow-black/20 overflow-hidden"
              >
                <span className={`transition-all duration-300 ${isLoading ? "opacity-0 scale-95" : "opacity-100"}`}>
                  Send Reset Link
                </span>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-purple-900/30 border-t-purple-900 rounded-full animate-spin" />
                  </div>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-white/40 text-sm">
                Remember your password?{" "}
                <Link href="/login" className="text-white font-bold hover:text-violet-300 transition-colors">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
